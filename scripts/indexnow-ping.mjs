// IndexNow ping — submits new/changed URLs to IndexNow-participating search
// engines (Bing, DuckDuckGo, Ecosia, Yandex, ...) through the shared endpoint.
//
// Wired in as the Netlify build command, so it runs on every deploy. It NEVER
// fails the build: any error is logged and the process still exits 0.
//
// What counts as "changed":
//   new sitemap = ./sitemap.xml in this repo (the build being published)
//   old sitemap = https://<host>/sitemap.xml currently live (the PREVIOUS build)
//   A URL is submitted when it is missing from the old sitemap, or its <lastmod>
//   differs. First deploy (no live sitemap yet) submits every URL.
//
// NOTE ON THE KEY: the IndexNow key is PUBLIC by design. It is a domain-
// verification token, not a secret credential. It is published in the open at
// https://<host>/<key>.txt, and this script simply reads it back from that same
// {key}.txt file at the publish root, so there is one source of truth per site.

import { readFileSync, readdirSync } from 'node:fs';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const ROOT = process.cwd();
const DRY_RUN = !!process.env.INDEXNOW_DRY_RUN;

const log = (msg) => console.log(`[indexnow] ${msg}`);

// Pull <loc>/<lastmod> pairs out of a sitemap without an XML dependency.
function parseSitemap(xml) {
  const map = new Map();
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of urlBlocks) {
    const loc = (block.match(/<loc>\s*([^<]+?)\s*<\/loc>/) || [])[1];
    if (!loc) continue;
    const lastmod = (block.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/) || [])[1] || '';
    map.set(loc.trim(), lastmod.trim());
  }
  return map;
}

async function main() {
  // Locate the public {key}.txt verification file at the publish root.
  let keyFile;
  try {
    keyFile = readdirSync(ROOT).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  } catch { /* root unreadable; handled below */ }
  if (!keyFile) { log('no {key}.txt key file at publish root; skipping'); return; }
  const key = keyFile.replace(/\.txt$/, '');

  // Read the new (local) sitemap.
  let newXml;
  try {
    newXml = readFileSync(`${ROOT}/sitemap.xml`, 'utf8');
  } catch {
    log('no local sitemap.xml; skipping'); return;
  }
  const newMap = parseSitemap(newXml);
  if (newMap.size === 0) { log('local sitemap.xml has no <url> entries; skipping'); return; }

  // Derive the host from the sitemap itself (keeps this script identical per repo).
  const host = new URL(newMap.keys().next().value).host;
  const keyLocation = `https://${host}/${key}.txt`;

  // Fetch the old (live) sitemap = the previously deployed build.
  let oldMap = new Map();
  try {
    const res = await fetch(`https://${host}/sitemap.xml`, { redirect: 'follow' });
    if (res.ok) oldMap = parseSitemap(await res.text());
    else log(`live sitemap returned HTTP ${res.status}; treating all URLs as new`);
  } catch (e) {
    log(`could not fetch live sitemap (${e.message}); treating all URLs as new`);
  }

  // Diff: new URL, or same URL with a changed <lastmod>.
  const changed = [];
  for (const [loc, lastmod] of newMap) {
    if (!oldMap.has(loc) || oldMap.get(loc) !== lastmod) changed.push(loc);
  }

  if (changed.length === 0) {
    log(`no new or changed URLs for ${host}; nothing to ping`); return;
  }
  log(`${changed.length} new/changed URL(s) for ${host}`);

  if (DRY_RUN) {
    log('INDEXNOW_DRY_RUN set; not submitting');
    for (const u of changed) log(`  would ping ${u}`);
    return;
  }

  const body = { host, key, keyLocation, urlList: changed };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    log(`submitted ${changed.length} URL(s) to ${ENDPOINT} (HTTP ${res.status})`);
  } catch (e) {
    log(`submit failed (${e.message}); ignoring so the deploy is not blocked`);
  }
}

try {
  await main();
} catch (e) {
  log(`unexpected error (${e.message}); ignoring`);
}
process.exit(0);
