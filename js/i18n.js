// Internationalization (i18n) Core Functionality

class I18nManager {
    constructor() {
        // Current language setting
        this.currentLanguage = 'en';
        
        // Supported languages with RTL configuration
        this.supportedLanguages = {
            'en': { rtl: false, code: 'en' },
            'es': { rtl: false, code: 'es' },
            'zh': { rtl: false, code: 'zh' },
            'ko': { rtl: false, code: 'ko' },
            'hy': { rtl: false, code: 'hy' },
            'ar': { rtl: true, code: 'ar' },
            'he': { rtl: true, code: 'he' }
        };
        
        // Cached translations
        this.translations = {};
    }

    /**
     * Apply Right-to-Left (RTL) styling based on language
     * @param {string} language - Language code
     */
    applyRTLStyles(language) {
        const languageConfig = this.supportedLanguages[language] || { rtl: false };
        
        // Toggle RTL class on document root
        document.documentElement.classList.toggle('rtl', languageConfig.rtl);
        document.documentElement.setAttribute('dir', languageConfig.rtl ? 'rtl' : 'ltr');
        
        // Apply custom RTL CSS variables
        if (languageConfig.rtl) {
            document.documentElement.style.setProperty('--text-align', 'right');
            document.documentElement.style.setProperty('--flex-direction', 'row-reverse');
        } else {
            document.documentElement.style.setProperty('--text-align', 'left');
            document.documentElement.style.setProperty('--flex-direction', 'row');
        }
    }

    /**
     * Initialize language preferences
     * @returns {Promise<string>} Resolved language
     */
    async initializeLanguage() {
        // Check for saved language preference
        const savedLanguage = localStorage.getItem('preferred_language');
        
        // Check browser language
        const browserLanguage = navigator.language.split('-')[0];
        
        // Determine language priority: saved > browser > default
        let selectedLanguage = 'en'; // Default
        
        if (savedLanguage && this.supportedLanguages[savedLanguage]) {
            selectedLanguage = savedLanguage;
        } else if (this.supportedLanguages[browserLanguage]) {
            selectedLanguage = browserLanguage;
        }
        
        await this.setLanguage(selectedLanguage);
        return selectedLanguage;
    }

    /**
     * Load translations for a specific language
     * @param {string} language - Language code
     * @returns {Promise<Object>} Translation object
     */
    async loadTranslations(language) {
        // Validate language
        if (!this.supportedLanguages[language]) {
            console.warn(`Unsupported language: ${language}. Falling back to English.`);
            language = 'en';
        }

        // Check if translations are already cached
        if (this.translations[language]) {
            return this.translations[language];
        }

        try {
            const response = await fetch(`/locales/${language}.json`);
            
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${language}`);
            }

            const translations = await response.json();
            this.translations[language] = translations;
            return translations;
        } catch (error) {
            console.error('Translation loading error:', error);
            
            // Fallback to English translations
            if (language !== 'en') {
                return this.loadTranslations('en');
            }

            return {};
        }
    }

    /**
     * Set the current language and apply translations
     * @param {string} language - Language code
     */
    async setLanguage(language) {
        try {
            // Load translations
            const translations = await this.loadTranslations(language);
            
            // Apply RTL styles
            this.applyRTLStyles(language);
            
            // Update language selector
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = language;
            }

            // Update HTML lang attribute
            document.documentElement.lang = language;
            
            // Apply translations to all elements with data-i18n attribute
            const elements = document.querySelectorAll('[data-i18n]');
            
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.translate(key, translations);
                
                if (translation) {
                    // Handle different element types
                    if (element.tagName === 'IMG') {
                        element.alt = translation;
                    } else if (element.tagName === 'META') {
                        element.content = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            });

            // Store language preference
            localStorage.setItem('preferred_language', language);
            this.currentLanguage = language;
        } catch (error) {
            console.error('Language setting error:', error);
        }
    }

    /**
     * Translate a specific key
     * @param {string} key - Translation key
     * @param {Object} translations - Translation dictionary
     * @returns {string} Translated text or key
     */
    translate(key, translations = this.translations[this.currentLanguage]) {
        // Split nested keys
        const keys = key.split('.');
        
        // Traverse translation object
        let translation = translations;
        for (const k of keys) {
            translation = translation?.[k];
            if (translation === undefined) break;
        }

        return translation || key;
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    // Additional method for language configuration
    getLanguageConfig(language) {
        return this.supportedLanguages[language] || { rtl: false, code: language };
    }
}

// Initialize internationalization on page load
const i18nManager = new I18nManager();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    i18nManager.initializeLanguage().then(language => {
        // Setup language selector if exists
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (event) => {
                i18nManager.setLanguage(event.target.value);
            });
        }
    });
});

// Export for potential use in other modules
export default i18nManager;