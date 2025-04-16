/**
 * Vision Clarity Institute - Combined Internationalization Module
 * 
 * This module handles loading and applying translations based on user language preferences.
 * It includes functionality for language detection, loading appropriate translations,
 * handling right-to-left languages, and managing language switching.
 */

// Check if I18nManager already exists to prevent duplicate declarations
if (!window.I18nManager) {
  // Create I18nManager only if it doesn't already exist
  window.I18nManager = {
    // Core configuration
    translations: {}, // Will store all loaded translations
    currentLanguage: 'en', // Default language
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'br', 'la_es', 'es', 'zh', 'ko', 'tw', 'hy', 'he', 'tl', 'ru', 'lg', 'fa', 'ar'],
    rtlLanguages: ['he', 'ar', 'fa'],
    missingTranslations: {}, // Track missing translations for reporting
    initialized: false, // Flag to track if already initialized
    
    /**
     * Initialize the I18n system
     */
    init: function() {
      // Check if already initialized
      if (this.initialized) {
        console.log('I18n System already initialized');
        return;
      }
      
      console.log('Initializing I18n System');
      this.initialized = true;
      
      // Initialize event listeners
      this.initEventListeners();
      
      // Initialize language based on saved preference or detection
      this.initLanguage();
    },
    
    /**
     * Set up event listeners for language selection
     */
    initEventListeners: function() {
      // Language selector dropdown event listener
      const languageSelect = document.getElementById('language-select');
      if (languageSelect) {
        languageSelect.addEventListener('change', (event) => {
          this.changeLanguage(event.target.value);
        });
      }
      
      // Listen for custom events that might trigger language changes
      document.addEventListener('vci-language-change', (event) => {
        if (event.detail && event.detail.language) {
          this.changeLanguage(event.detail.language);
        }
      });
    },
    
    /**
     * Initialize the language based on preferences or browser settings
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
     * Handle RTL (right-to-left) language settings
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
     * Determine the root path based on the current environment
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
     * Get the browser's language
     */
    getBrowserLanguage: function() {
      const fullLang = navigator.language || navigator.userLanguage;
      return fullLang.split('-')[0].toLowerCase();
    },
    
    /**
     * Load the appropriate font for the selected language
     */
    loadFontsForLanguage: function(lang) {
      document.body.className = document.body.className.replace(/lang-\w+/g, '');
      document.body.classList.add(`lang-${lang}`);
      
      // Add specific font loading for languages that need specialized fonts
      const specialFontLanguages = ['zh', 'ko', 'tw', 'ar', 'he', 'ru'];
      
      if (specialFontLanguages.includes(lang)) {
        // Ensure any specialized font CSS is loaded
        if (!document.getElementById(`font-${lang}`)) {
          const fontStylesheet = document.createElement('link');
          fontStylesheet.id = `font-${lang}`;
          fontStylesheet.rel = 'stylesheet';
          fontStylesheet.href = this.getRootPath() + `css/fonts-${lang}.css`;
          document.head.appendChild(fontStylesheet);
        }
      }
    },
    
    /**
     * Load translations for the specified language
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
     * Change the current language and update UI accordingly
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
      
      // Reset missing translations for current language
      this.missingTranslations[this.currentLanguage] = [];
      
      // Find all elements with data-i18n attribute
      const elements = document.querySelectorAll('[data-i18n]');
      console.log(`Applying translations to ${elements.length} elements`);
      
      elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = this.getTranslation(key, { logMissing: true, returnKey: false });
        
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
          // If translation is missing, use the key as fallback text
          if (element.tagName !== 'META' && element.tagName !== 'IMG' && element.tagName !== 'IFRAME') {
            // Only set fallback text for elements that display text
            const keyParts = key.split('.');
            element.textContent = keyParts[keyParts.length - 1].replace(/_/g, ' ');
          }
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
      
      // Report missing translations if any
      this.reportMissingTranslations();
      
      // Ensure critical translations persist
      this.ensureCriticalTranslations();
    },
    
    /**
     * Ensure critical translations like homepage features are properly applied
     */
    ensureCriticalTranslations: function() {
      // This function specifically ensures the intro features and other critical elements
      // retain their translations even if there are timing issues
      const criticalKeys = [
        'home.intro.feature1',
        'home.intro.feature2',
        'home.intro.feature3',
        'home.intro.feature4',
        'home.intro.button',
        'home.hero.secondary_button'
      ];
      
      // Create a fallback set of translations if they're missing
      const fallbackTranslations = {
        'home.intro.feature1': 'Advanced bladeless LASIK technology',
        'home.intro.feature2': 'Comprehensive consultation and eye analysis',
        'home.intro.feature3': 'Personalized treatment plans',
        'home.intro.feature4': 'Exceptional post-operative care',
        'home.intro.button': 'Our Technology',
        'home.hero.secondary_button': 'Learn More'
      };
      
      // Apply these translations to the elements
      criticalKeys.forEach(key => {
        const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
        elements.forEach(element => {
          // Check if element has content or just the key
          if (element.textContent === key || 
              element.textContent.includes('feature') ||
              element.textContent === 'button') {
            element.textContent = fallbackTranslations[key] || key;
          }
        });
      });
      
      // Add a mutation observer to detect if translations get overwritten
      this.setupTranslationObserver(criticalKeys, fallbackTranslations);
    },
    
    /**
     * Set up a mutation observer to prevent critical translations from being overwritten
     */
    setupTranslationObserver: function(keys, fallbacks) {
      // If browser doesn't support MutationObserver, skip this
      if (!window.MutationObserver) return;
      
      // Find elements with these critical translations
      keys.forEach(key => {
        const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
        
        elements.forEach(element => {
          // Set up observer for this element
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              // If the text content was changed and now looks like a key
              if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const currentText = element.textContent;
                if (currentText === key || 
                    currentText.includes('feature') ||
                    currentText === 'button') {
                  // Restore the translation
                  element.textContent = fallbacks[key] || key;
                }
              }
            });
          });
          
          // Start observing
          observer.observe(element, { 
            characterData: true, 
            childList: true,
            subtree: true
          });
        });
      });
    },
    
    /**
     * Get a translation for the given key
     */
    getTranslation: function(key, options = {}) {
      if (!key) return null;
      
      const settings = {
        logMissing: true,
        returnKey: true,
        ...options
      };
      
      // Split the key into parts
      const parts = key.split('.');
      
      // Navigate through the nested translations object
      let translation = this.translations[this.currentLanguage];
      let keyExists = true;
      
      for (const part of parts) {
        if (!translation || typeof translation !== 'object') {
          keyExists = false;
          break;
        }
        translation = translation[part];
        if (translation === undefined) {
          keyExists = false;
          break;
        }
      }
      
      // If translation exists, return it
      if (keyExists && translation !== undefined) {
        return translation;
      }
      
      // If key uses "traditional" or "bladeless", try with "_lasik" suffix
      if (!keyExists && key.includes('.service.')) {
        const serviceKeys = ['traditional', 'bladeless'];
        for (const serviceKey of serviceKeys) {
          if (key.endsWith(`.${serviceKey}`)) {
            const altKey = key.replace(`.${serviceKey}`, `.${serviceKey}_lasik`);
            const altTranslation = this.getTranslation(altKey, { logMissing: false, returnKey: false });
            if (altTranslation) {
              return altTranslation;
            }
          }
        }
      }
      
      // Try fallback to default language
      if (this.currentLanguage !== this.defaultLanguage) {
        let defaultTranslation = this.translations[this.defaultLanguage];
        let defaultKeyExists = true;
        
        for (const part of parts) {
          if (!defaultTranslation || typeof defaultTranslation !== 'object') {
            defaultKeyExists = false;
            break;
          }
          defaultTranslation = defaultTranslation[part];
          if (defaultTranslation === undefined) {
            defaultKeyExists = false;
            break;
          }
        }
        
        if (defaultKeyExists && defaultTranslation !== undefined) {
          // Log that we're using a fallback
          if (settings.logMissing) {
            console.warn(`Using fallback translation for key: ${key} (${this.currentLanguage} -> ${this.defaultLanguage})`);
          }
          return defaultTranslation;
        }
      }
      
      // Log missing translation if requested
      if (settings.logMissing) {
        console.warn(`No translation found for key: ${key}`);
        
        // Store missing key for reporting
        if (!this.missingTranslations[this.currentLanguage]) {
          this.missingTranslations[this.currentLanguage] = [];
        }
        
        if (!this.missingTranslations[this.currentLanguage].includes(key)) {
          this.missingTranslations[this.currentLanguage].push(key);
        }
      }
      
      // Return the key itself if requested
      return settings.returnKey ? key : null;
    },
    
    /**
     * Format a translation with variable replacements
     */
    formatTranslation: function(key, vars = {}) {
      let text = this.getTranslation(key);
      
      if (!text) return null;
      
      // Replace variables in the format {{variableName}}
      return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
        return vars[variable] !== undefined ? vars[variable] : match;
      });
    },
    
    /**
     * Report missing translations to console
     */
    reportMissingTranslations: function() {
      const currentMissing = this.missingTranslations[this.currentLanguage] || [];
      
      if (currentMissing.length > 0) {
        console.warn(`Found ${currentMissing.length} missing translations for language: ${this.currentLanguage}`);
        console.warn('Missing translations:', currentMissing);
        
        // Group missing translations by section for easier fixing
        const groupedMissing = this.groupMissingTranslations(currentMissing);
        console.warn('Grouped missing translations:', groupedMissing);
      }
    },
    
    /**
     * Group missing translations by section for better organization
     */
    groupMissingTranslations: function(missingKeys) {
      const grouped = {};
      
      missingKeys.forEach(key => {
        const section = key.split('.')[0];
        if (!grouped[section]) {
          grouped[section] = [];
        }
        grouped[section].push(key);
      });
      
      return grouped;
    },

    /**
     * Get translations for the specified language
     * Useful for accessing translations programmatically without changing the UI language
     */
    getTranslationsForLanguage: async function(lang) {
      if (!this.supportedLanguages.includes(lang)) {
        console.error(`Language ${lang} is not supported`);
        return null;
      }
      
      // Load translations if not already loaded
      if (!this.translations[lang]) {
        await this.loadTranslations(lang);
      }
      
      return this.translations[lang];
    },
    
    /**
     * Translate a specific text string with supplied key
     * Useful for dynamically inserted content that isn't in the DOM when applyTranslations runs
     */
    translateText: function(key, params = {}) {
      let translation = this.getTranslation(key);
      
      if (!translation) return key;
      
      // Replace any parameters in the translation
      if (Object.keys(params).length > 0) {
        translation = this.formatTranslation(key, params);
      }
      
      return translation;
    },
    
    /**
     * Export missing translations to a JSON format that can be easily copied
     * Useful for developers to update translation files
     */
    exportMissingTranslations: function() {
      const missingByLanguage = {};
      
      Object.keys(this.missingTranslations).forEach(lang => {
        if (this.missingTranslations[lang].length > 0) {
          // Create nested structure for the missing translations
          const missingObj = {};
          
          this.missingTranslations[lang].forEach(key => {
            const parts = key.split('.');
            let current = missingObj;
            
            // Build the nested structure
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) {
                current[parts[i]] = {};
              }
              current = current[parts[i]];
            }
            
            // Set the value for the leaf node to an empty string
            current[parts[parts.length - 1]] = "";
          });
          
          missingByLanguage[lang] = missingObj;
        }
      });
      
      return JSON.stringify(missingByLanguage, null, 2);
    }
  };

  // Make i18n available globally as a reference to I18nManager
  window.i18n = window.I18nManager;
} else {
  console.log('I18nManager already defined, using existing instance');
  // Ensure i18n alias is set properly
  window.i18n = window.I18nManager;
}

// Initialize safely - only if not already initialized
document.addEventListener('DOMContentLoaded', function() {
  if (window.I18nManager && typeof window.I18nManager.init === 'function') {
    window.I18nManager.init();
  }
});
