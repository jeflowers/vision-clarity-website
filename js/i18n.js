/**
 * Vision Clarity Institute - Internationalization Manager
 * Handles language detection, translation, and language switching
 */

// Check if I18nManager already exists
if (!window.I18nManager) {
  window.I18nManager = {
    initialized: false,
    translations: {},
    currentLanguage: 'en',  // Default language
    supportedLanguages: ['en', 'es', 'la_es', 'br', 'zh', 'ko', 'he', 'ru', 'fa', 'ar'],
    
    init: function() {
      // Prevent multiple initializations
      if (this.initialized) {
        console.log('I18nManager already initialized');
        return;
      }
      
      console.log('Initializing I18nManager');
      this.initialized = true;
      
      // Detect language
      this.detectLanguage();
      
      // Load translations for current language
      this.loadTranslations(this.currentLanguage, () => {
        // Apply translations to current page
        this.applyTranslations();
        
        // Setup language selector dropdowns
        this.setupLanguageSelectors();
      });
    },
    
    detectLanguage: function() {
      // Check for language in localStorage
      const storedLang = localStorage.getItem('preferred_language');
      if (storedLang && this.supportedLanguages.includes(storedLang)) {
        this.currentLanguage = storedLang;
        console.log(`Using stored language: ${this.currentLanguage}`);
        return;
      }
      
      // Check for language in URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam && this.supportedLanguages.includes(langParam)) {
        this.currentLanguage = langParam;
        console.log(`Using URL parameter language: ${this.currentLanguage}`);
        return;
      }
      
      // Check browser language
      const browserLang = navigator.language || navigator.userLanguage;
      const shortLang = browserLang.split('-')[0];
      
      if (this.supportedLanguages.includes(shortLang)) {
        this.currentLanguage = shortLang;
        console.log(`Using browser language: ${this.currentLanguage}`);
      } else {
        // Special case for Latin American Spanish
        if (browserLang.includes('-') && 
            ['mx', 'co', 'ar', 'pe', 'cl', 'ec', 'gt', 'cu', 'bo', 've'].includes(browserLang.split('-')[1].toLowerCase()) && 
            shortLang === 'es') {
          this.currentLanguage = 'la_es';
          console.log(`Detected Latin American Spanish: ${this.currentLanguage}`);
        } else {
          console.log(`Using default language: ${this.currentLanguage}`);
        }
      }
    },
    
    loadTranslations: function(language, callback) {
      // If we already have translations for this language, no need to load again
      if (this.translations[language]) {
        if (callback) callback();
        return;
      }
      
      const rootPath = this.getRootPath();
      const url = `${rootPath}js/i18n/${language}.json`;
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error loading translations: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          this.translations[language] = data;
          console.log(`Translations loaded for ${language}`);
          if (callback) callback();
        })
        .catch(error => {
          console.error('Error loading translations:', error);
          // Fall back to English if available
          if (language !== 'en' && this.translations['en']) {
            console.log('Falling back to English translations');
            this.currentLanguage = 'en';
            if (callback) callback();
          } else if (language !== 'en') {
            // Try to load English as fallback
            this.loadTranslations('en', callback);
          }
        });
    },
    
    applyTranslations: function() {
      console.log(`Applying translations for ${this.currentLanguage}`);
      
      // Skip if translations aren't loaded
      if (!this.translations[this.currentLanguage]) {
        console.warn(`No translations available for ${this.currentLanguage}`);
        return;
      }
      
      // Apply HTML dir attribute for RTL languages
      const rtlLanguages = ['ar', 'he', 'fa'];
      document.documentElement.dir = rtlLanguages.includes(this.currentLanguage) ? 'rtl' : 'ltr';
      document.documentElement.lang = this.currentLanguage;
      
      // Find all elements with data-i18n attribute
      const elements = document.querySelectorAll('[data-i18n]');
      
      elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = this.getTranslation(key);
        
        if (translation) {
          // Handle different types of elements
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.type === 'placeholder') {
              element.placeholder = translation;
            } else {
              element.value = translation;
            }
          } else if (element.tagName === 'IMG') {
            element.alt = translation;
          } else if (element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', translation);
          } else if (element.hasAttribute('data-a11y-label')) {
            const a11yKey = element.getAttribute('data-a11y-label');
            const a11yTranslation = this.getTranslation(a11yKey);
            if (a11yTranslation) element.setAttribute('aria-label', a11yTranslation);
          } else {
            element.textContent = translation;
          }
        }
      });
      
      // Set language in localStorage
      localStorage.setItem('preferred_language', this.currentLanguage);
      
      // Update meta tags
      this.updateMetaTags();
      
      // Update all language selectors
      this.updateAllLanguageSelectors();
    },
    
    getTranslation: function(key) {
      if (!key) return null;
      
      // Get current translations
      const currentTranslations = this.translations[this.currentLanguage];
      if (!currentTranslations) return null;
      
      // Handle nested keys like 'home.hero.title'
      const parts = key.split('.');
      let result = currentTranslations;
      
      for (const part of parts) {
        if (!result[part]) return null;
        result = result[part];
      }
      
      return result;
    },
    
    changeLanguage: function(language) {
      if (!this.supportedLanguages.includes(language)) {
        console.warn(`Language ${language} is not supported`);
        return;
      }
      
      if (this.currentLanguage === language) {
        console.log(`Already using language ${language}`);
        return;
      }
      
      this.currentLanguage = language;
      console.log(`Changing language to ${language}`);
      
      // Load translations if needed
      if (!this.translations[language]) {
        this.loadTranslations(language, () => {
          this.applyTranslations();
        });
      } else {
        this.applyTranslations();
      }
    },
    
    updateMetaTags: function() {
      // Update meta tags for SEO
      const title = this.getTranslation('meta.title');
      const description = this.getTranslation('meta.description');
      
      if (title) {
        document.title = title;
        const metaTitle = document.querySelector('meta[name="title"]');
        if (metaTitle) metaTitle.setAttribute('content', title);
      }
      
      if (description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', description);
      }
    },
    
    getRootPath: function() {
      // Handle GitHub Pages URL structure
      if (window.location.hostname.includes('github.io')) {
        return '/vision-clarity-website/';
      }
      
      // Count directory levels for relative paths
      const path = window.location.pathname;
      if (path.includes('/pages/')) {
        return '../';
      }
      
      return './';
    },

    setupLanguageSelectors: function() {
      // Find all language selectors
      document.querySelectorAll('.form-language-select.flag-enabled').forEach(selector => {
        // Set initial selection
        for (let i = 0; i < selector.options.length; i++) {
          if (selector.options[i].value === this.currentLanguage) {
            selector.selectedIndex = i;
            break;
          }
        }
        
        // Update flag display
        this.updateSelectorFlag(selector);
        
        // Handle change events
        selector.addEventListener('change', (event) => {
          const newLang = event.target.value;
          this.changeLanguage(newLang);
          
          // Update all other selectors to match
          this.updateAllLanguageSelectors();
        });
      });
    },
    
    updateAllLanguageSelectors: function() {
      document.querySelectorAll('.form-language-select.flag-enabled').forEach(selector => {
        // Update the selected value
        for (let i = 0; i < selector.options.length; i++) {
          if (selector.options[i].value === this.currentLanguage) {
            selector.selectedIndex = i;
            break;
          }
        }
        
        // Update flag display
        this.updateSelectorFlag(selector);
      });
    },
    
    updateSelectorFlag: function(selector) {
      const selectedOption = selector.options[selector.selectedIndex];
      const flagEmoji = selectedOption.getAttribute('data-flag');
      const flagDisplay = selector.parentElement.querySelector('.flag-display');
      
      if (flagDisplay && flagEmoji) {
        flagDisplay.textContent = flagEmoji;
      }
    },
    
    updateSelectedLanguage: function(langCode) {
      // Update the current language
      this.currentLanguage = langCode;
      
      // Update all language selectors to match
      document.querySelectorAll('.form-language-select.flag-enabled').forEach(selector => {
        // Update the selected value
        for (let i = 0; i < selector.options.length; i++) {
          if (selector.options[i].value === langCode) {
            selector.selectedIndex = i;
            break;
          }
        }
        
        // Update the displayed flag
        this.updateSelectorFlag(selector);
      });
      
      // Apply language change to the page
      this.applyTranslations();
    }
  };
} else {
  console.log('I18nManager already defined, using existing instance');
}

// Initialize safely
document.addEventListener('DOMContentLoaded', function() {
  if (window.I18nManager && typeof window.I18nManager.init === 'function') {
    window.I18nManager.init();
  }
});

// Re-initialize after components are loaded
document.addEventListener('allComponentsLoaded', function() {
  if (window.I18nManager && typeof window.I18nManager.applyTranslations === 'function') {
    setTimeout(() => {
      window.I18nManager.applyTranslations();
      window.I18nManager.setupLanguageSelectors();
    }, 200);
  }
});
