// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');
const faqItems = document.querySelectorAll('.faq-item');

let currentIndex = 0;
const totalSlides = slides.length;

// Function to show slide
function showSlide(index) {
    // Remove active class from all
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    // Add active class to current
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

// Next button
nextBtn.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }
    showSlide(currentIndex);
});

// Previous button
prevBtn.addEventListener('click', () => {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    }
    showSlide(currentIndex);
});

// Dots click
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
    });
});

// Auto Slide every 5 seconds
setInterval(() => {
    currentIndex++;
    if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }
    showSlide(currentIndex);
}, 5000);


// State
let currentSlide = 0;
let slideInterval;
let autoSlideEnabled = true;
const SLIDE_DURATION = 5000; // 5 seconds per slide

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initMobileMenu();
    setupEventListeners();
    setupAnimations();
    setupFAQ();
    startAutoSlide();
    
    // Add current year to footer
    updateCurrentYear();
});

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Slider Functions
function initSlider() {
    // Set initial position
    updateSlider();
    
    // Event listeners for slider controls
    prevBtn.addEventListener('click', () => {
        showPrevSlide();
        resetAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        showNextSlide();
        resetAutoSlide();
    });
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });
    
    // Pause auto slide on hover
    const heroSlider = document.querySelector('.hero-slider');
    heroSlider.addEventListener('mouseenter', pauseAutoSlide);
    heroSlider.addEventListener('mouseleave', resumeAutoSlide);
    
    // Touch support for mobile
    let startX = 0;
    let endX = 0;
    
    heroSlider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        pauseAutoSlide();
    });
    
    heroSlider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
        resumeAutoSlide();
    });
    
    function handleSwipe() {
        const threshold = 50;
        if (startX - endX > threshold) {
            showNextSlide();
        } else if (endX - startX > threshold) {
            showPrevSlide();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showPrevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
            resetAutoSlide();
        }
    });
}

function startAutoSlide() {
    if (!autoSlideEnabled) return;
    
    stopAutoSlide();
    slideInterval = setInterval(() => {
        showNextSlide();
    }, SLIDE_DURATION);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function pauseAutoSlide() {
    autoSlideEnabled = false;
    stopAutoSlide();
}

function resumeAutoSlide() {
    autoSlideEnabled = true;
    startAutoSlide();
}

function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

function showNextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function showPrevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

function updateSlider() {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Update slider position
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Restart progress animation
    const activeSlide = slides[currentSlide];
    const progressBar = activeSlide.querySelector('.slide::after');
    if (progressBar) {
        progressBar.style.animation = 'none';
        setTimeout(() => {
            progressBar.style.animation = `progress ${SLIDE_DURATION}ms linear`;
        }, 10);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Category tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', filterProducts);
    });
    
    // WhatsApp order buttons
    const whatsappButtons = document.querySelectorAll('.whatsapp-order-btn');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Track order button click
            const productName = e.target.closest('.product-card').querySelector('h3').textContent;
            console.log(`Product ordered via WhatsApp: ${productName}`);
            
            // Optional: Add analytics tracking here
            // Example: trackEvent('product_order_click', { product: productName });
        });
    });
    
    // Update WhatsApp number function
    document.addEventListener('updateWhatsAppNumber', function(e) {
        const newNumber = e.detail.number;
        updateAllWhatsAppLinks(newNumber);
    });
}

function filterProducts(e) {
    const category = e.currentTarget.dataset.category;
    
    // Update active tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Filter products
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Setup Scroll Animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('step')) {
                    entry.target.classList.add('animate');
                }
                if (entry.target.classList.contains('testimonial-card')) {
                    entry.target.classList.add('animate');
                }
                if (entry.target.classList.contains('feature')) {
                    entry.target.classList.add('animate');
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.step, .testimonial-card, .feature').forEach(el => {
        observer.observe(el);
    });
}

// Setup FAQ functionality
function setupFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });
}

// Update WhatsApp Number Function
function updateAllWhatsAppLinks(newNumber) {
    // Remove any non-digit characters from the number
    const cleanNumber = newNumber.replace(/\D/g, '');
    
    // Update all WhatsApp links
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        const newHref = currentHref.replace(/wa\.me\/\d+/, `wa.me/${cleanNumber}`);
        link.setAttribute('href', newHref);
    });
    
    // Update contact info in footer
    const contactNumber = document.querySelector('.contact-info li:first-child');
    if (contactNumber) {
        const formattedNumber = cleanNumber.length === 12 ? 
            `+${cleanNumber.substring(0,2)} ${cleanNumber.substring(2,7)} ${cleanNumber.substring(7)}` :
            `+91 ${cleanNumber.substring(2)}`;
        contactNumber.innerHTML = `<i class="fab fa-whatsapp"></i> ${formattedNumber}`;
    }
    
    console.log(`Updated WhatsApp number to: ${cleanNumber}`);
    
    // Show confirmation message
    showNotification('WhatsApp number updated successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.remove('loading');
        } else {
            img.classList.add('loading');
            imageObserver.observe(img);
        }
    });
});

// Update current year in footer
function updateCurrentYear() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
}

// Preload slider images for better performance
function preloadSliderImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1566385101042-1a0f0c126a96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize image preloading
preloadSliderImages();

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Order tracking function (example)
function trackOrder(productName, quantity) {
    // This is where you would integrate with your analytics platform
    console.log(`Order tracked: ${quantity} x ${productName}`);
    
    // Example for Google Analytics:
    // gtag('event', 'order', {
    //     'event_category': 'engagement',
    //     'event_label': productName,
    //     'value': quantity
    // });
}

// Example usage for order tracking (call this when WhatsApp order button is clicked)
document.querySelectorAll('.whatsapp-order-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Track the order click
        trackOrder(productName, 1);
        
        // You can also store this in localStorage for analytics
        const orderData = {
            product: productName,
            timestamp: new Date().toISOString(),
            source: 'product_card'
        };
        
        try {
            const recentOrders = JSON.parse(localStorage.getItem('freshFarmRecentOrders') || '[]');
            recentOrders.push(orderData);
            // Keep only last 50 orders
            if (recentOrders.length > 50) {
                recentOrders.shift();
            }
            localStorage.setItem('freshFarmRecentOrders', JSON.stringify(recentOrders));
        } catch (error) {
            console.error('Error saving order data:', error);
        }
    });
});
