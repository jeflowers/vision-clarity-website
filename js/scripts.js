/**
 * Vision Clarity Institute - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Initialize language selection
    initLanguageSelector();
    
    // Initialize FAQ accordions
    initFaqAccordions();
    
    // Initialize any other UI elements
    initMiscUI();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                navList.classList.contains('active') ? 'true' : 'false');
        });
    }
}

/**
 * Initialize language selector dropdown
 */
function initLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        // Set initial value based on saved preference or default
        const savedLanguage = localStorage.getItem('vci-language');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
            // Apply the saved language on page load
            changeLanguage(savedLanguage);
        }
        
        // Add change event listener
        languageSelect.addEventListener('change', function(e) {
            const selectedLang = e.target.value;
            changeLanguage(selectedLang);
        });
    }
}

/**
 * Check if a language is right-to-left (RTL)
 * @param {string} lang - Language code to check
 * @returns {boolean} Whether the language is RTL
 */
function isRTLLanguage(lang) {
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(lang);
}

/**
 * Apply right-to-left (RTL) styles if needed
 * @param {string} lang - Language code
 */
function applyRTLIfNeeded(lang) {
    const htmlElement = document.documentElement;
    
    if (isRTLLanguage(lang)) {
        htmlElement.dir = 'rtl';
        htmlElement.classList.add('rtl');
    } else {
        htmlElement.dir = 'ltr';
        htmlElement.classList.remove('rtl');
    }
}

/**
 * Change website language
 * @param {string} lang - Language code (en, es, zh, ko, hy)
 */
function changeLanguage(lang) {
    console.log(`Changing language to: ${lang}`);
    
    // Store the selected language in localStorage
    localStorage.setItem('vci-language', lang);
    
    // Apply RTL if needed
    applyRTLIfNeeded(lang);
    
    // Set the HTML lang attribute
    document.documentElement.lang = lang;
    
    // Fetch the translation file
    fetch(`locales/${lang}/translation.json`)
        .then(response => {
            console.log('Translation fetch response:', response);
            if (!response.ok) {
                throw new Error(`Failed to load translation file (${response.status})`);
            }
            return response.json();
        })
        .then(translations => {
            console.log('Translations loaded successfully', translations);
            // Apply translations to UI elements with data-i18n attributes
            applyTranslations(translations);
            
            // Dispatch a custom event that other scripts can listen for
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: lang } 
            }));
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });
}

/**
 * Apply translations to elements with data-i18n attributes
 * @param {Object} translations - Translation object
 */
function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(translations, key);
        
        if (key && value) {
            // For inputs, update placeholder if it exists
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = value;
            } 
            // For elements with innerHTML (like buttons with icons), preserve inner HTML
            else if (element.children.length > 0 && element.getAttribute('data-i18n-html') !== 'true') {
                element.textContent = value;
            } 
            // For regular text elements
            else {
                element.innerHTML = value;
            }
        }
    });
    
    // Special handling for document title
    if (translations.global && translations.global.siteName) {
        document.title = translations.global.siteName;
    }
}

/**
 * Get a nested value from an object using dot notation
 * @param {Object} obj - The object to extract value from
 * @param {string} path - Path in dot notation (e.g., 'global.menu.home')
 * @returns {string|null} The extracted value or null if not found
 */
function getNestedValue(obj, path) {
    if (!obj || !path) {
        return null;
    }
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (!current[key]) {
            return null;
        }
        current = current[key];
    }
    
    return current;
}

/**
 * Initialize FAQ accordions
 */
function initFaqAccordions() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class on parent
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            // Set aria-expanded attribute
            const isExpanded = faqItem.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Find answer element
            const answer = this.nextElementSibling;
            if (answer && answer.classList.contains('faq-answer')) {
                answer.style.maxHeight = isExpanded ? `${answer.scrollHeight}px` : '0';
            }
        });
    });
}

/**
 * Initialize miscellaneous UI elements
 */
function initMiscUI() {
    // Testimonial slider functionality
    const nextBtn = document.querySelector('.next-testimonial');
    const prevBtn = document.querySelector('.prev-testimonial');
    const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
    
    if (nextBtn && prevBtn && indicators.length) {
        // Implement slider functionality
        // (This is a placeholder - actual implementation would depend on your slider design)
    }
}
