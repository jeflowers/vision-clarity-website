// i18n.js - Translation functionality

/**
 * Change website language
 * @param {string} lang - Language code (en, es, zh, ko, hy)
 */
function changeLanguage(lang) {
    console.log(`Changing language to: ${lang}`);
    
    // Store the selected language in localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Fetch translation file
    fetch(`/locales/${lang}/translation.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load translation file (${response.status})`);
            }
            return response.json();
        })
        .then(translations => {
            applyTranslations(translations);
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });
}

/**
 * Apply translations to UI elements
 * @param {Object} translations - Translation object
 */
function applyTranslations(translations) {
    // Apply translations to elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedValue(translations, key);
        
        if (key && value) {
            // Apply translation based on element type
            applyTranslationToElement(element, value);
        }
    });
    
    // Handle special cases
    handleSpecialTranslations(translations);
    
    // Notify other components about language change
    document.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: localStorage.getItem('preferredLanguage') } 
    }));
}

/**
 * Apply translation to a specific element based on its type
 * @param {Element} element - DOM element to translate
 * @param {string} value - Translated text
 */
function applyTranslationToElement(element, value) {
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

/**
 * Handle special translation cases like document title
 * @param {Object} translations - Translation object
 */
function handleSpecialTranslations(translations) {
    // Special handling for document title
    if (translations.global && translations.global.siteName) {
        document.title = translations.global.siteName;
    }
    
    // Special handling for language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = localStorage.getItem('preferredLanguage');
    }
}

/**
 * Initialize localization
 */
function initLocalization() {
    // Check for user preference in localStorage first
    let defaultLang = localStorage.getItem('preferredLanguage');
    
    // If no preference is stored, get browser language or use default
    if (!defaultLang) {
        const userLang = navigator.language || navigator.userLanguage;
        const lang = userLang.split('-')[0]; // Get primary language code
        
        // Set default language based on browser or use English
        const supportedLanguages = ['en', 'es', 'zh', 'ko', 'hy'];
        defaultLang = supportedLanguages.includes(lang) ? lang : 'en';
    }
    
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

// Add event listener for language selector
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            changeLanguage(selectedLanguage);
        });
    }
    
    // Initialize localization
    initLocalization();
});
