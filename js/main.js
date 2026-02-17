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
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Animate children with stagger
                const children = entry.target.querySelectorAll('.animate-stagger');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.1}s`;
                    child.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Add animation classes to common elements
    document.querySelectorAll('.feature-item, .service-card, .testimonial-card, .package-card').forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Observe bottom CTA container
    const bottomCtaContainer = document.querySelector('.bottom-cta .container');
    if (bottomCtaContainer) {
        observer.observe(bottomCtaContainer);
    }
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
