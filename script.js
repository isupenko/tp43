// DOM Elements
const navbar = document.querySelector('.navbar');
const backToTopBtn = document.getElementById('backToTop');
const loadingScreen = document.querySelector('.loading-screen');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Loading Screen
window.addEventListener('load', function () {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';

        // Initialize animations after loading
        initScrollAnimations();
        initCounterAnimations();
    }, 1500);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effects
let lastScrollTop = 0;
window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar background change
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollTop > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }

    lastScrollTop = scrollTop;
});

// Back to top functionality
backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');

                // Trigger counter animation for stats
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = [
        { selector: '.about-text', animation: 'slide-left' },
        { selector: '.about-visual', animation: 'slide-right' },
        { selector: '.service-card', animation: '', stagger: 100 },
        { selector: '.portfolio-item', animation: 'scale', stagger: 150 },
        { selector: '.advantage-card', animation: '', stagger: 100 },
        { selector: '.timeline-item', animation: 'slide-left', stagger: 200 },
        { selector: '.review-card', animation: '', stagger: 150 },
        { selector: '.pricing-card', animation: 'scale', stagger: 200 },
        { selector: '.team-member', animation: '', stagger: 100 },
        { selector: '.contact-card', animation: 'slide-left', stagger: 100 },
        { selector: '.contact-form-wrapper', animation: 'slide-right' }
    ];

    animateElements.forEach(({ selector, animation, stagger }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            if (animation) {
                element.classList.add(animation);
            }
            if (stagger) {
                element.style.animationDelay = `${index * (stagger / 1000)}s`;
            }
            observer.observe(element);
        });
    });
}

// Counter animation for statistics
function initCounterAnimations() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = Math.floor(current);
    }, 16);
}

// Portfolio filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter portfolio items
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Form handling
const contactForm = document.querySelector('.contact-form');
const submitBtn = contactForm.querySelector('button[type="submit"]');
const btnText = submitBtn.querySelector('span');
const btnLoader = submitBtn.querySelector('.btn-loader');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Form validation
    const requiredFields = this.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff4444';
            field.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
        } else {
            field.style.borderColor = '#8B4513';
            field.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.1)';
        }
    });

    // Email validation
    const emailField = this.querySelector('input[type="email"]');
    if (emailField.value && !isValidEmail(emailField.value)) {
        isValid = false;
        emailField.style.borderColor = '#ff4444';
        emailField.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
    }

    // Phone validation
    const phoneField = this.querySelector('input[type="tel"]');
    if (phoneField.value && !isValidPhone(phoneField.value)) {
        isValid = false;
        phoneField.style.borderColor = '#ff4444';
        phoneField.style.boxShadow = '0 0 0 3px rgba(255, 68, 68, 0.1)';
    }

    if (isValid) {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Success state
            submitBtn.classList.remove('loading');
            submitBtn.style.background = '#28a745';
            btnText.textContent = 'Заявка отправлена!';

            // Show success message
            showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');

            // Reset form
            this.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                btnText.textContent = 'Отправить заявку';
            }, 3000);
        }, 2000);
    } else {
        showNotification('Пожалуйста, заполните все обязательные поля корректно.', 'error');
    }
});

// Form field animations
const formGroups = document.querySelectorAll('.form-group');
formGroups.forEach(group => {
    const input = group.querySelector('input, select, textarea');
    const label = group.querySelector('label');

    if (input && label) {
        input.addEventListener('focus', function () {
            group.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                group.classList.remove('focused');
            }
        });

        // Check if field has value on page load
        if (input.value) {
            group.classList.add('focused');
        }
    }
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    const floatingParticles = document.querySelector('.floating-particles');

    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }

    if (floatingParticles) {
        floatingParticles.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Add hover effects for interactive elements
const interactiveElements = document.querySelectorAll('.service-card, .portfolio-item, .advantage-card, .review-card, .team-member, .pricing-card');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function () {
        this.style.transform = this.style.transform.replace(/translateY\([^)]*\)/g, '') + ' translateY(-10px)';
    });

    element.addEventListener('mouseleave', function () {
        this.style.transform = this.style.transform.replace(/translateY\([^)]*\)/g, '') + ' translateY(0px)';
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect after loading (optional)
window.addEventListener('load', function () {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title .title-line:first-child');
        if (heroTitle) {
            const originalText = heroTitle.textContent;
            typeWriter(heroTitle, originalText, 80);
        }
    }, 2000);
});

// Smooth reveal animation for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.animate-on-scroll:not(.animated)');

    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('animated');
        }
    });
}

// Throttled scroll event for performance
let ticking = false;
function updateOnScroll() {
    revealOnScroll();
    ticking = false;
}

window.addEventListener('scroll', function () {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function (e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }

    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Focus management for accessibility
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Error handling for failed resources
window.addEventListener('error', function (e) {
    console.warn('Resource failed to load:', e.target.src || e.target.href);
}, true);

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function (registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics and tracking (placeholder)
function trackEvent(category, action, label) {
    // Google Analytics or other tracking service
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track button clicks
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('Button', 'Click', e.target.textContent.trim());
    }
});

console.log('🎨 Технология покраски - Website loaded successfully!');