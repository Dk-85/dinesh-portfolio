// ===================================
// EMAILJS CONFIGURATION
// ===================================
/* 
    EMAILJS SETUP INSTRUCTIONS:
    
    To use this contact form, you need to:
    
    1. Sign up for a free account at https://www.emailjs.com/
    2. Add an Email Service (Gmail, Outlook, etc.) in Email Services section
    3. Create an Email Template in Email Templates section:
       - Set the recipient email in the template settings (this keeps your email private!)
       - Use {{from_name}}, {{from_email}}, and {{message}} as template variables
       - Example template:
         Subject: New Contact Form Message from {{from_name}}
         Body: 
         From: {{from_name}}
         Email: {{from_email}}
         Message: {{message}}
    4. Get your credentials from Integration section:
       - Service ID
       - Template ID  
       - Public Key (also called User ID)
    5. Replace the placeholder values below:
       - SERVICE_ID: Replace 'YOUR_SERVICE_ID' with your actual Service ID
       - TEMPLATE_ID: Replace 'YOUR_TEMPLATE_ID' with your actual Template ID
       - PUBLIC_KEY: Replace 'YOUR_PUBLIC_KEY' with your actual Public Key/User ID
    
    IMPORTANT: Set the recipient email in EmailJS template settings, not in code!
    This keeps your email address private and secure.
    
    ALTERNATIVE: You can also use Formspree (https://formspree.io/) which doesn't 
    require client-side configuration - just change the form action URL.
*/

// REPLACE THESE VALUES WITH YOUR EMAILJS CREDENTIALS:
const EMAILJS_CONFIG = {
    SERVICE_ID: 'YOUR_SERVICE_ID',    // Replace with your EmailJS Service ID
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID',  // Replace with your EmailJS Template ID
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY'     // Replace with your EmailJS Public Key/User ID
};

// ===================================
// DOM CONTENT LOADED
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();
    initNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarScroll();
    initActiveNavLinks();
    initScrollToTop();
    initContactForm();
});

// ===================================
// EMAILJS INITIALIZATION
// ===================================
function initEmailJS() {
    // Initialize EmailJS with your Public Key
    // Make sure to replace YOUR_PUBLIC_KEY with your actual EmailJS Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS initialized');
    } else {
        console.error('EmailJS SDK not loaded. Check CDN link in index.html');
    }
}

// ===================================
// MOBILE MENU TOGGLE
// ===================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Update ARIA attributes for accessibility
        hamburger.setAttribute('aria-expanded', isActive);
        hamburger.setAttribute('aria-label', isActive ? 'Close navigation menu' : 'Open navigation menu');

        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation menu');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Open navigation menu');
                document.body.style.overflow = '';
            }
        }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation menu');
            document.body.style.overflow = '';
            hamburger.focus();
        }
    });
}

// ===================================
// SMOOTH SCROLLING FOR NAVBAR LINKS
// ===================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    const navbar = document.querySelector('.navbar');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is empty or just '#'
            if (!href || href === '#' || href === '#home') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = target.offsetTop - navbarHeight;

                // Enhanced smooth scrolling with easing
                smoothScrollTo(targetPosition, 800);
            }
        });
    });
}

// Custom smooth scroll function with easing
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, start + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// ===================================
// FADE-IN ON SCROLL FOR SECTIONS
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in animation
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        if (section.id !== 'home') {
            observer.observe(section);
        }
    });

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.education-item, .skills-category, .project-card, .contact-form, .section-title, .about-content'
    );

    animatedElements.forEach(el => {
        if (el) observer.observe(el);
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const scrollThreshold = 50;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Use throttled scroll for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    handleScroll();
}

// ===================================
// ACTIVE NAVIGATION LINK HIGHLIGHTING
// ===================================
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const updateActiveLink = () => {
        let current = '';
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const scrollPosition = window.pageYOffset + navbarHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    updateActiveLink();
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
function initScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    document.body.appendChild(scrollTopBtn);

    // Show/hide button based on scroll position
    const scrollThreshold = 400;
    let ticking = false;

    function toggleScrollTop() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollY > scrollThreshold) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                toggleScrollTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Scroll to top on button click
    scrollTopBtn.addEventListener('click', () => {
        smoothScrollTo(0, 600);
    });

    // Initial check
    toggleScrollTop();
}

// ===================================
// CONTACT FORM - EMAILJS INTEGRATION
// ===================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (!form || !submitBtn) return;

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear all error messages
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }

    // Show error message for a specific field
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Show form status message
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Validate form
    function validateForm() {
        clearErrors();
        let isValid = true;

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate name
        if (!name) {
            showError('name', 'Name is required');
            isValid = false;
        }

        // Validate email
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate message
        if (!message) {
            showError('message', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous status
        formStatus.style.display = 'none';
        clearErrors();

        // Validate form
        if (!validateForm()) {
            showStatus('Please fix the errors above', 'error');
            return;
        }

        // Check if EmailJS is configured
        if (EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ||
            EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
            EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            showStatus('EmailJS is not configured. Please set up your EmailJS credentials in script.js', 'error');
            console.error('EmailJS not configured. Please replace placeholder values in EMAILJS_CONFIG object.');
            return;
        }

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('sending');
        showStatus('Sending...', 'success');

        try {
            // Send email using EmailJS
            // Make sure to replace the service ID, template ID, and public key above
            const response = await emailjs.sendForm(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                form,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            // Success
            if (response.status === 200) {
                showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                clearErrors();

                // Reset form after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            showStatus('Failed to send message. Please try again later or contact me directly.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.classList.remove('sending');
        }
    });

    // Real-time validation on blur
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    nameInput.addEventListener('blur', () => {
        if (!nameInput.value.trim()) {
            showError('name', 'Name is required');
        }
    });

    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (!email) {
            showError('email', 'Email is required');
        } else if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
        }
    });

    messageInput.addEventListener('blur', () => {
        const message = messageInput.value.trim();
        if (!message) {
            showError('message', 'Message is required');
        } else if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters long');
        }
    });

    // Clear errors on input
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            const errorId = `${input.id}-error`;
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
}

// ===================================
// ERROR HANDLING
// ===================================
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
}, false);
