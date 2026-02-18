/* ===================================
   Keepin It Green Lawncare Solutions
   Main JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileNav();
    initBeforeAfterSlider();
    initFAQAccordion();
    initScrollAnimations();
    initParallax();
    initFormValidation();
});

/* ===================================
   NAVIGATION
   =================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ===================================
   MOBILE NAVIGATION
   =================================== */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');
    const body = document.body;

    if (!hamburger || !mobileOverlay) return;

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

/* ===================================
   BEFORE/AFTER SLIDER
   =================================== */
function initBeforeAfterSlider() {
    const sliders = document.querySelectorAll('.before-after-slider');

    sliders.forEach(slider => {
        const beforeImg = slider.querySelector('.before-img');
        const handle = slider.querySelector('.slider-handle');
        const button = slider.querySelector('.slider-button');

        if (!beforeImg || !handle) return;

        let isDragging = false;

        function updateSlider(x) {
            const rect = slider.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));

            beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
            if (button) button.style.left = `${percentage}%`;
        }

        function startDrag(e) {
            isDragging = true;
            slider.style.cursor = 'grabbing';
        }

        function endDrag() {
            isDragging = false;
            slider.style.cursor = 'ew-resize';
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
        }

        // Mouse events
        slider.addEventListener('mousedown', startDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('mousemove', drag);

        // Touch events
        slider.addEventListener('touchstart', startDrag, { passive: true });
        document.addEventListener('touchend', endDrag);
        document.addEventListener('touchmove', drag, { passive: false });

        // Click to position
        slider.addEventListener('click', function(e) {
            updateSlider(e.clientX);
        });
    });
}

/* ===================================
   FAQ ACCORDION
   =================================== */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // FAQ Search
    const searchInput = document.getElementById('faq-search');
    const searchCount = document.getElementById('faq-search-count');
    if (!searchInput || !faqItems.length) return;

    let noResults = document.querySelector('.faq-no-results');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        let visible = 0;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer-inner');
            const text = (question ? question.textContent : '') + ' ' + (answer ? answer.textContent : '');

            if (!query || text.toLowerCase().includes(query)) {
                item.classList.remove('faq-hidden');
                visible++;
            } else {
                item.classList.add('faq-hidden');
                item.classList.remove('active');
            }
        });

        if (query) {
            searchCount.textContent = visible + ' result' + (visible !== 1 ? 's' : '');
        } else {
            searchCount.textContent = '';
        }

        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'faq-no-results';
            noResults.textContent = 'No matching questions found. Try a different search term.';
            document.querySelector('.faq-list').appendChild(noResults);
        }
        noResults.style.display = (visible === 0 && query) ? 'block' : 'none';
    });
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */
function initScrollAnimations() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Stagger children of grid containers
                if (entry.target.classList.contains('anim-stagger')) {
                    var kids = entry.target.children;
                    for (var i = 0; i < kids.length; i++) {
                        (function(child, delay) {
                            setTimeout(function() { child.classList.add('animate-in'); }, delay);
                        })(kids[i], i * 120);
                    }
                }

                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });

    // --- Fade Up: section headers, intros, content blocks, CTAs ---
    var fadeUpSelectors = [
        '.section-header',
        '.showcase-intro',
        '.highlight-header',
        '.highlight-cta',
        '.content-block',
        '.tagline-box',
        '.soil-testing-content',
        '.soil-report-mockup',
        '.video-showcase-content',
        '.video-showcase-player',
        '.before-after-container',
        '.location-content',
        '.page-section-header',
        '.additional-services',
        '.bottom-cta .container',
        '.page-contact-form',
        '.page-contact-section .section-header',
        '.map-grid > div:first-child'
    ];

    document.querySelectorAll(fadeUpSelectors.join(',')).forEach(function(el) {
        el.classList.add('anim-fade-up');
        observer.observe(el);
    });

    // --- Scale In: images, visual elements ---
    var scaleSelectors = [
        '.showcase-visual',
        '.showcase-image',
        '.split-content-image',
        '.before-after-slider',
        '.map-container'
    ];

    document.querySelectorAll(scaleSelectors.join(',')).forEach(function(el) {
        el.classList.add('anim-scale-in');
        observer.observe(el);
    });

    // --- Stagger grids: feature grids, service cards, testimonials, packages, metrics, showcase features ---
    var staggerSelectors = [
        '.features-grid',
        '.services-grid',
        '.testimonials-grid',
        '.packages-grid',
        '.soil-metrics',
        '.showcase-features',
        '.trust-badges',
        '.footer-grid',
        '.services-modal-grid'
    ];

    document.querySelectorAll(staggerSelectors.join(',')).forEach(function(el) {
        el.classList.add('anim-stagger');
        // Give children the animation class
        for (var i = 0; i < el.children.length; i++) {
            el.children[i].classList.add('anim-fade-up');
        }
        observer.observe(el);
    });

    // --- Fade Left/Right for split layouts ---
    document.querySelectorAll('.split-content').forEach(function(el) {
        var text = el.querySelector('.split-content-text');
        var img = el.querySelector('.split-content-image');
        if (text) { text.classList.add('anim-fade-left'); observer.observe(text); }
        if (img) { img.classList.add('anim-fade-right'); observer.observe(img); }
    });

    // Soil testing grid: left text, right mockup
    document.querySelectorAll('.soil-testing-grid').forEach(function(el) {
        var children = el.children;
        if (children[0]) { children[0].classList.add('anim-fade-left'); observer.observe(children[0]); }
        if (children[1]) { children[1].classList.add('anim-fade-right'); observer.observe(children[1]); }
    });

    // Video showcase: left content, right player
    document.querySelectorAll('.video-showcase-layout').forEach(function(el) {
        var content = el.querySelector('.video-showcase-content');
        var player = el.querySelector('.video-showcase-player');
        if (content) { content.classList.add('anim-fade-left'); observer.observe(content); }
        if (player) { player.classList.add('anim-fade-right'); observer.observe(player); }
    });

    // Location grid: left text, right map
    document.querySelectorAll('.location-grid').forEach(function(el) {
        var children = el.children;
        if (children[0]) { children[0].classList.add('anim-fade-left'); observer.observe(children[0]); }
        if (children[1]) { children[1].classList.add('anim-fade-right'); observer.observe(children[1]); }
    });

    // Map grid on about page
    document.querySelectorAll('.map-grid').forEach(function(el) {
        var children = el.children;
        if (children[0]) { children[0].classList.add('anim-fade-left'); observer.observe(children[0]); }
        if (children[1]) { children[1].classList.add('anim-fade-right'); observer.observe(children[1]); }
    });

    // FAQ items stagger
    document.querySelectorAll('.faq-list').forEach(function(el) {
        el.classList.add('anim-stagger');
        for (var i = 0; i < el.children.length; i++) {
            el.children[i].classList.add('anim-fade-up');
        }
        observer.observe(el);
    });

    // Contact grid: form left, info right
    document.querySelectorAll('.contact-grid').forEach(function(el) {
        var children = el.children;
        if (children[0]) { children[0].classList.add('anim-fade-left'); observer.observe(children[0]); }
        if (children[1]) { children[1].classList.add('anim-fade-right'); observer.observe(children[1]); }
    });
}

/* ===================================
   PARALLAX EFFECTS
   =================================== */
function initParallax() {
    // Disabled - was causing background images to be cut off
    return;
}

/* ===================================
   FORM VALIDATION
   =================================== */
function initFormValidation() {
    const forms = document.querySelectorAll('.contact-form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                removeError(field);

                if (!field.value.trim()) {
                    showError(field, 'This field is required');
                    isValid = false;
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    showError(field, 'Please enter a valid email address');
                    isValid = false;
                } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                    showError(field, 'Please enter a valid phone number');
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                showFormSuccess(form);

                // In production, this would submit to the server
                // For Netlify Forms, the form would have data-netlify="true"
                console.log('Form submitted successfully');
            }
        });
    });
}

function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #e53935; font-size: 0.8rem; margin-top: 4px;';
    field.parentNode.appendChild(errorDiv);
}

function removeError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\(\)\+]{10,}$/.test(phone);
}

function showFormSuccess(form) {
    const formContent = form.innerHTML;
    form.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 style="color: #2d5a27; margin: 20px 0 10px;">Thank You!</h3>
            <p style="color: #666;">Your message has been sent successfully. We'll get back to you soon!</p>
        </div>
    `;

    // Reset form after delay (optional)
    setTimeout(() => {
        form.innerHTML = formContent;
        initFormValidation();
    }, 5000);
}

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ===================================
   MOBILE BOTTOM NAV SERVICES DROPDOWN
   =================================== */
document.addEventListener('DOMContentLoaded', function() {
    const servicesBtn = document.querySelector('.mobile-bottom-services');
    const servicesDropdown = document.querySelector('.mobile-services-dropdown');

    if (servicesBtn && servicesDropdown) {
        servicesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            servicesDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!servicesBtn.contains(e.target) && !servicesDropdown.contains(e.target)) {
                servicesDropdown.classList.remove('active');
            }
        });
    }
});

/* ===================================
   SERVICES MODAL
   =================================== */
document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('view-services-btn');
    const modal = document.getElementById('services-modal');

    if (!openBtn || !modal) return;

    const closeBtn = modal.querySelector('.services-modal-close');

    openBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

/* ===================================
   SOIL REPORT ANIMATION
   =================================== */
document.addEventListener('DOMContentLoaded', function() {
    const soilReport = document.querySelector('.soil-report-mockup');

    if (soilReport) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate metric bars
                    const bars = soilReport.querySelectorAll('.metric-bar-fill');
                    bars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.width = bar.dataset.width || '70%';
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.5 });

        observer.observe(soilReport);
    }
});
