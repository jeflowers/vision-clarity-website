/**
 * Vision Clarity Institute - Internationalization Module
 * This module handles loading and applying translations based on user language preferences.
 */

// Import our utility modules
import languageDetector from './language-detector.js';
import fontLoader from './font-loader.js';

class I18nManager {
  constructor() {
    this.translations = {}; // Will store all loaded translations
    this.currentLanguage = 'en'; // Default language
    this.defaultLanguage = 'en';
    this.supportedLanguages = ['en', 'es', 'zh', 'ko', 'hy', 'he', 'tl', 'ru', 'fa', 'ar'];
    this.rtlLanguages = ['he', 'ar', 'fa'];
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Initialize language based on saved preference or detection
    this.initLanguage();
  }
  
  /**
   * Initialize event listeners for language selection
   */
  initEventListeners() {
    // Language selector dropdown event listener
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', (event) => {
        this.changeLanguage(event.target.value);
      });
    }
  }
  
  /**
   * Initialize language based on saved preference or detection
   */
  async initLanguage() {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('vci-language');
    
    // If no saved language, use our advanced language detector
    if (!savedLanguage) {
      this.currentLanguage = await languageDetector.detectLanguage();
    } else if (this.supportedLanguages.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
    
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
    fontLoader.loadFontsForLanguage(this.currentLanguage);
    
    console.log(`Language initialized: ${this.currentLanguage}`);
  }
  
  /**
   * Handle text direction based on language
   * @param {string} lang - Language code
   */
  handleTextDirection(lang) {
    if (this.rtlLanguages.includes(lang)) {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
      // Add RTL stylesheet if not already added
      if (!document.getElementById('rtl-stylesheet')) {
        const rtlStylesheet = document.createElement('link');
        rtlStylesheet.id = 'rtl-stylesheet';
        rtlStylesheet.rel = 'stylesheet';
        rtlStylesheet.href = '../css/rtl.css';
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
  }
  
  /**
   * Get the user's browser language
   * @returns {string} Language code (e.g., 'en', 'es')
   */
  getBrowserLanguage() {
    const fullLang = navigator.language || navigator.userLanguage;
    return fullLang.split('-')[0].toLowerCase(); // Extract the language code (e.g., 'en' from 'en-US')
  }
  
  /**
   * Load translations for a specific language
   * @param {string} lang - Language code
   * @returns {Promise} Promise that resolves when translations are loaded
   */
  async loadTranslations(lang) {
    try {
      // Check if translations are already loaded
      if (this.translations[lang]) {
        return;
      }
      
      // Fetch the translation file
      const response = await fetch(`../js/i18n/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${lang}`);
      }
      
      this.translations[lang] = await response.json();
      console.log(`Loaded translations for ${lang}`);
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      
      // Fallback to default language if not already trying to load it
      if (lang !== this.defaultLanguage) {
        console.warn(`Falling back to ${this.defaultLanguage}`);
        await this.loadTranslations(this.defaultLanguage);
      }
    }
  }
  
  /**
   * Change the current language
   * @param {string} lang - Language code
   */
  async changeLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.error(`Language ${lang} is not supported`);
      return;
    }
    
    // Save the language preference
    localStorage.setItem('vci-language', lang);
    this.currentLanguage = lang;
    
    // Load translations if not already loaded
    await this.loadTranslations(lang);
    
    // Apply translations
    this.applyTranslations();
    
    // Update the HTML lang attribute
    document.documentElement.lang = lang;
    
    // Handle right-to-left languages (Hebrew and Arabic)
    const rtlLanguages = ['he', 'ar'];
    if (rtlLanguages.includes(lang)) {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
    
    // Dispatch a custom event for other components to react to language change
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }
  
  /**
   * Apply translations to all elements with data-i18n attributes
   */
  applyTranslations() {
    // Return early if translations aren't loaded
    if (!this.translations[this.currentLanguage]) {
      console.warn(`Translations for ${this.currentLanguage} not loaded.`);
      return;
    }
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
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
  }
  
  /**
   * Get a translation by key using dot notation
   * @param {string} key - Translation key in dot notation (e.g., 'global.menu.home')
   * @returns {string|null} The translation or null if not found
   */
  getTranslation(key) {
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
  }
  
  /**
   * Get a formatted translation with variable substitution
   * @param {string} key - Translation key
   * @param {Object} vars - Variables for substitution
   * @returns {string} Formatted translation
   */
  formatTranslation(key, vars = {}) {
    let text = this.getTranslation(key);
    
    if (!text) return null;
    
    // Replace variables in the format {{variableName}}
    return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return vars[variable] !== undefined ? vars[variable] : match;
    });
  }
}

// Create and export a singleton instance
const i18n = new I18nManager();

// Make i18n available globally
window.i18n = i18n;

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // i18n is already initialized, but we can add any page-specific handling here
});

export default i18n;
