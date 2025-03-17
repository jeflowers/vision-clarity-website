/**
 * Vision Clarity Institute - Language-Specific Font Loader
 * This module handles loading appropriate fonts based on the current language.
 */

class FontLoader {
  constructor() {
    this.loadedFonts = new Set(); // Track which language fonts have been loaded
    this.fontDefinitions = {
      // Default Latin fonts (English, Spanish, etc.)
      'latin': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap'
        ],
        fontFamily: "'Open Sans', 'Roboto', system-ui, sans-serif"
      },
      // Chinese fonts
      'zh': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap'
        ],
        fontFamily: "'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif"
      },
      // Korean fonts
      'ko': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap'
        ],
        fontFamily: "'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
      },
      // Armenian fonts
      'hy': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian:wght@400;500;700&display=swap'
        ],
        fontFamily: "'Noto Sans Armenian', system-ui, sans-serif"
      },
      // Hebrew fonts
      'he': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap'
        ],
        fontFamily: "'Heebo', 'Rubik', 'Arial Hebrew', 'David', sans-serif"
      },
      // Filipino/Tagalog (uses Latin script)
      'tl': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap'
        ],
        fontFamily: "'Open Sans', system-ui, sans-serif"
      },
      // Russian fonts
      'ru': {
        urls: [
          'https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Roboto:wght@400;500;700&display=swap'
        ],
        fontFamily: "'PT Sans', 'Roboto', 'Arial', sans-serif"
      },
      // Persian/Farsi fonts
      'fa': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap'
        ],
        fontFamily: "'Vazirmatn', 'Tahoma', 'Iranian Sans', sans-serif"
      },
      // Arabic fonts
      'ar': {
        urls: [
          'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700&display=swap'
        ],
        fontFamily: "'Cairo', 'Amiri', 'Tahoma', 'Traditional Arabic', sans-serif"
      }
    };
    
    // Initialize event listeners for language changes
    this.initEventListeners();
  }
  
  /**
   * Initialize event listeners for language changes
   */
  initEventListeners() {
    document.addEventListener('languageChanged', (event) => {
      this.loadFontsForLanguage(event.detail.language);
    });
    
    // Also load fonts for initial language
    document.addEventListener('DOMContentLoaded', () => {
      const currentLang = document.documentElement.lang || 'en';
      this.loadFontsForLanguage(currentLang);
    });
  }
  
  /**
   * Load the appropriate fonts for a specific language
   * @param {string} lang - Language code
   */
  loadFontsForLanguage(lang) {
    // Don't reload fonts if already loaded for this language
    if (this.loadedFonts.has(lang)) {
      return;
    }
    
    // Get font definition for the language
    const fontDef = this.fontDefinitions[lang] || this.fontDefinitions['latin'];
    
    // Load fonts
    fontDef.urls.forEach(url => {
      this.loadFont(url);
    });
    
    // Apply font family to body
    document.body.style.fontFamily = fontDef.fontFamily;
    
    // Mark these fonts as loaded
    this.loadedFonts.add(lang);
  }
  
  /**
   * Load a font by injecting a link element
   * @param {string} url - URL of the font CSS file
   */
  loadFont(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
}

// Create and initialize the font loader
const fontLoader = new FontLoader();

// Export for use in other modules
export default fontLoader;
