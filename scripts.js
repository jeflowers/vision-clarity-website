// Vision Clarity Institute - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
    }
    
    // Language selector functionality
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            changeLanguage(selectedLanguage);
        });
    }
    
    // FAQ items toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
    
    // Testimonial slider functionality
    initTestimonialSlider();
    
    // Initialize localization
    initLocalization();
});

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!prevButton || !nextButton) return;
    
    // Current slide index
    let currentSlide = 0;
    const testimonials = [
        {
            text: "After 20 years of wearing glasses, I can finally see clearly without them. The procedure was quick and painless, and the staff made me feel completely at ease. I wish I had done this years ago!",
            author: "Jennifer T.",
            location: "Los Angeles, CA",
            image: "assets/images/testimonials/jennifer-t.jpg"
        },
        {
            text: "The Vision Clarity Institute team took such great care of me throughout the entire process. From consultation to post-op care, everything was thoroughly explained and all my questions were answered. My vision is now 20/15 - even better than expected!",
            author: "Michael K.",
            location: "Newport Beach, CA",
            image: "assets/images/testimonials/michael-k.jpg"
        },
        {
            text: "As someone with a high prescription and astigmatism, I was told by other clinics that I wasn't a good candidate for LASIK. Dr. Peterson at Vision Clarity took the time to do a thorough assessment and recommended their custom procedure. Six months later, I'm seeing perfectly without any side effects.",
            author: "Sarah L.",
            location: "Pasadena, CA",
            image: "assets/images/testimonials/sarah-l.jpg"
        }
    ];
    
    // Update testimonial content
    function updateTestimonial(index) {
        const testimonialContent = document.querySelector('.testimonial-content');
        if (!testimonialContent) return;
        
        const testimonial = testimonials[index];
        
        testimonialContent.innerHTML = `
            <div class="testimonial-rating">
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
                <span class="star">★</span>
            </div>
            <blockquote>
                <p>"${testimonial.text}"</p>
            </blockquote>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}" class="author-image">
                <div class="author-info">
                    <h4>${testimonial.author}</h4>
                    <p>${testimonial.location}</p>
                </div>
            </div>
        `;
        
        // Update active indicator
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    // Previous testimonial
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        updateTestimonial(currentSlide);
    });
    
    // Next testimonial
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        updateTestimonial(currentSlide);
    });
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateTestimonial(currentSlide);
        });
    });
    
    // Auto-advance testimonials every 8 seconds
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateTestimonial(currentSlide);
        }
    }, 8000);
}

/**
 * Change website language
 * @param {string} lang - Language code (en, es, zh, ko, hy)
 */
function changeLanguage(lang) {
    // In a real implementation, this would load language files and update the UI
    console.log(`Changing language to: ${lang}`);
    
    // Simulated language change for demo purposes
    fetch(`locales/${lang}/translation.json`)
        .then(response => response.json())
        .then(translations => {
            // Apply translations to UI elements
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (key && getNestedValue(translations, key)) {
                    element.textContent = getNestedValue(translations, key);
                }
            });
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });
}

/**
 * Initialize localization
 */
function initLocalization() {
    // Get browser language or use default
    const userLang = navigator.language || navigator.userLanguage;
    const lang = userLang.split('-')[0]; // Get primary language code
    
    // Set default language based on browser or use English
    const supportedLanguages = ['en', 'es', 'zh', 'ko', 'hy'];
    const defaultLang = supportedLanguages.includes(lang) ? lang : 'en';
    
    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = defaultLang;
    }
    
    // Load default language
    changeLanguage(defaultLang);
}

/**
 * Get nested object value from dot notation string
 * @param {Object} obj - The object to search in
 * @param {string} path - Dot notation path (e.g., 'global.buttons.submit')
 * @returns {string|null} - The value or null if not found
 */
function getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current === null || current === undefined || !current.hasOwnProperty(key)) {
            return null;
        }
        current = current[key];
    }
    
    return current;
}