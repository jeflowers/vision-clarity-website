/**
 * Vision Clarity Institute - Internationalization Module
 * This module handles loading and applying translations based on user language preferences.
 */

// Create a simple version without ES6 imports
const I18nManager = {
  translations: {}, // Will store all loaded translations
  currentLanguage: 'en', // Default language
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'br', 'la_es', 'es', 'zh', 'ko', 'tw', 'hy', 'he', 'tl', 'ru', 'fa', 'ar'],
  rtlLanguages: ['he', 'ar', 'fa'],
  
  /**
   * Initialize the I18n system
   */
  init: function() {
    console.log('Initializing I18n System');
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Initialize language based on saved preference or detection
    this.initLanguage();
  },
  
  /**
   * Initialize event listeners for language selection
   */
  initEventListeners: function() {
    // Language selector dropdown event listener
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', (event) => {
        this.changeLanguage(event.target.value);
      });
    }
  },
  
  /**
   * Initialize language based on saved preference or detection
   */
  initLanguage: async function() {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('vci-language');
    
    // If no saved language, use browser language or fall back to default
    if (!savedLanguage) {
      this.currentLanguage = this.getBrowserLanguage();
      
      // If not supported, use default
      if (!this.supportedLanguages.includes(this.currentLanguage)) {
        this.currentLanguage = this.defaultLanguage;
      }
    } else if (this.supportedLanguages.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
    
    console.log(`Selected language: ${this.currentLanguage}`);
    
    // Set the language selector to the current language
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = this.currentLanguage;
    }
    
    // Load translations and apply them
    await this.loadTranslations(this.currentLanguage);
    this.applyTranslations();
    
    // Set the HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
    
    // Handle right-to-left languages
    this.handleTextDirection(this.currentLanguage);
    
    // Load appropriate fonts for the language
    this.loadFontsForLanguage(this.currentLanguage);
    
    console.log(`Language initialized: ${this.currentLanguage}`);
  },
  
  /**
   * Handle text direction based on language
   * @param {string} lang - Language code
   */
  handleTextDirection: function(lang) {
    if (this.rtlLanguages.includes(lang)) {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
      // Add RTL stylesheet if not already added
      if (!document.getElementById('rtl-stylesheet')) {
        const rtlStylesheet = document.createElement('link');
        rtlStylesheet.id = 'rtl-stylesheet';
        rtlStylesheet.rel = 'stylesheet';
        rtlStylesheet.href = this.getRootPath() + 'css/rtl.css';
        document.head.appendChild(rtlStylesheet);
      }
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
      // Remove RTL stylesheet if it exists
      const rtlStylesheet = document.getElementById('rtl-stylesheet');
      if (rtlStylesheet) {
        rtlStylesheet.remove();
      }
    }
  },
  
  /**
   * Get the root path based on current page location
   * @returns {string} The root path
   */
  getRootPath: function() {
    // If on GitHub Pages, use the repository-specific path
    if (window.location.hostname.includes('github.io')) {
      return '/vision-clarity-website/';
    }
    
    // Check if we're in a subdirectory
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
      return '../';
    }
    
    return './';
  },
  
  /**
   * Simple utility to detect browser language
   * @returns {string} Language code (e.g., 'en', 'es')
   */
  getBrowserLanguage: function() {
    const fullLang = navigator.language || navigator.userLanguage;
    return fullLang.split('-')[0].toLowerCase(); // Extract the language code (e.g., 'en' from 'en-US')
  },
  
  /**
   * Load appropriate fonts for a language
   * @param {string} lang - Language code
   */
  loadFontsForLanguage: function(lang) {
    // Simplified version that could be expanded based on language needs
    // For now, just add a class to the body
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${lang}`);
  },
  
  /**
   * Load translations for a specific language
   * @param {string} lang - Language code
   * @returns {Promise} Promise that resolves when translations are loaded
   */
  loadTranslations: async function(lang) {
    try {
      // Check if translations are already loaded
      if (this.translations[lang]) {
        console.log(`Using cached translations for ${lang}`);
        return;
      }
      
      // Determine the correct URL based on environment
      let translationUrl;
      
      // Special case for GitHub Pages
      if (window.location.hostname.includes('github.io')) {
        translationUrl = `/vision-clarity-website/js/i18n/${lang}.json`;
        console.log(`Loading translations from GitHub Pages path: ${translationUrl}`);
      } else {
        // For local development or other hosting
        const rootPath = this.getRootPath();
        translationUrl = `${rootPath}js/i18n/${lang}.json`;
        console.log(`Loading translations from standard path: ${translationUrl}`);
      }
      
      // Add cache-busting parameter
      const cacheBuster = `?_=${new Date().getTime()}`;
      
      // Fetch the translation file
      const response = await fetch(translationUrl + cacheBuster);
      
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${lang} (Status: ${response.status})`);
      }
      
      this.translations[lang] = await response.json();
      console.log(`Successfully loaded translations for ${lang}`);
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      
      // Add empty translations object to prevent repeated failed attempts
      this.translations[lang] = this.translations[lang] || {};
      
      // Fallback to default language if not already trying to load it
      if (lang !== this.defaultLanguage) {
        console.warn(`Falling back to ${this.defaultLanguage}`);
        await this.loadTranslations(this.defaultLanguage);
      } else {
        // Create some basic translations for English as fallback
        console.warn('Creating basic fallback translations for English');
        this.translations[this.defaultLanguage] = {
          global: {
            menu: {
              home: "Home",
              services: "Services",
              technology: "Technology",
              staff: "Meet Our Team",
              locations: "Locations",
              contact: "Contact",
            },
            buttons: {
              schedule: "Schedule Consultation",
              inquiry: "Request Information"
            }
          },
          services: {
            header: {
              title: "LASIK Eye Surgery",
              subtitle: "Innovative vision correction methods designed specifically for you"
            }
          }
        };
      }
    }
  },
  
  /**
   * Change the current language
   * @param {string} lang - Language code
   */
  changeLanguage: async function(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.error(`Language ${lang} is not supported`);
      return;
    }
    
    console.log(`Changing language to: ${lang}`);
    
    // Save the language preference
    localStorage.setItem('vci-language', lang);
    this.currentLanguage = lang;
    
    // Load translations if not already loaded
    await this.loadTranslations(lang);
    
    // Apply translations
    this.applyTranslations();
    
    // Update the HTML lang attribute
    document.documentElement.lang = lang;
    
    // Handle right-to-left languages
    this.handleTextDirection(lang);
    
    // Load appropriate fonts for the language
    this.loadFontsForLanguage(lang);
    
    // Track language change in analytics if available
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        'language': lang
      });
    }
    
    // Dispatch a custom event for other components to react to language change
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  },
  
  /**
   * Apply translations to all elements with data-i18n attributes
   */
  applyTranslations: function() {
    // Return early if translations aren't loaded
    if (!this.translations[this.currentLanguage]) {
      console.warn(`Translations for ${this.currentLanguage} not loaded.`);
      return;
    }
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`Applying translations to ${elements.length} elements`);
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation) {
        // Special handling for different element types
        if (element.tagName === 'INPUT' && element.type === 'placeholder') {
          element.placeholder = translation;
        } else if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
          element.content = translation;
        } else if (element.tagName === 'IMG' || element.tagName === 'IFRAME') {
          element.alt = translation;
        } else {
          // Default: set as text content
          element.textContent = translation;
        }
      } else {
        console.warn(`No translation found for key: ${key}`);
      }
    });
    
    // Update page title if it has a translation
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.getAttribute('data-i18n')) {
      const titleKey = titleElement.getAttribute('data-i18n');
      const titleTranslation = this.getTranslation(titleKey);
      if (titleTranslation) {
        document.title = titleTranslation;
      }
    }
  },
  
  /**
   * Get a translation by key using dot notation
   * @param {string} key - Translation key in dot notation (e.g., 'global.menu.home')
   * @returns {string|null} The translation or null if not found
   */
  getTranslation: function(key) {
    if (!key) return null;
    
    // Split the key into parts
    const parts = key.split('.');
    
    // Navigate through the nested translations object
    let translation = this.translations[this.currentLanguage];
    for (const part of parts) {
      if (!translation || typeof translation !== 'object') {
        return null;
      }
      translation = translation[part];
    }
    
    // Fallback to default language if translation is missing
    if (translation === undefined && this.currentLanguage !== this.defaultLanguage) {
      let defaultTranslation = this.translations[this.defaultLanguage];
      for (const part of parts) {
        if (!defaultTranslation || typeof defaultTranslation !== 'object') {
          return null;
        }
        defaultTranslation = defaultTranslation[part];
      }
      return defaultTranslation;
    }
    
    return translation;
  },
  
  /**
   * Get a formatted translation with variable substitution
   * @param {string} key - Translation key
   * @param {Object} vars - Variables for substitution
   * @returns {string} Formatted translation
   */
  formatTranslation: function(key, vars = {}) {
    let text = this.getTranslation(key);
    
    if (!text) return null;
    
    // Replace variables in the format {{variableName}}
    return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return vars[variable] !== undefined ? vars[variable] : match;
    });
  }
};

// Initialize and expose globally
document.addEventListener('DOMContentLoaded', function() {
  I18nManager.init();
});

// Make i18n available globally
window.i18n = I18nManager;
