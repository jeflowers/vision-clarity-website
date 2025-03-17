/**
 * Vision Clarity Institute - Hreflang Manager for SEO
 * This script adds hreflang links to improve SEO for multilingual content.
 */

class HreflangManager {
  constructor(supportedLanguages = ['en', 'es', 'zh', 'ko', 'hy', 'he', 'tl', 'ru', 'fa', 'ar']) {
    this.supportedLanguages = supportedLanguages;
    this.defaultLanguage = 'en';
    this.baseUrl = 'https://visionclarityinstitute.com'; // Replace with actual domain
    
    // Language variants mapping for hreflang (for languages with regional variants)
    this.languageVariants = {
      'en': 'en-US',      // US English
      'es': 'es-US',      // US Spanish
      'zh': 'zh-Hans-US', // Simplified Chinese for US
      'ko': 'ko-US',      // Korean for US
      'hy': 'hy-AM',      // Armenian
      'he': 'he-IL',      // Hebrew
      'tl': 'tl-PH',      // Filipino/Tagalog
      'ru': 'ru-RU',      // Russian
      'fa': 'fa-IR',      // Persian/Farsi
      'ar': 'ar-001'      // Arabic (generic)
    };
    
    // Initialize hreflang tags when the document is ready
    document.addEventListener('DOMContentLoaded', () => {
      this.addHreflangTags();
    });
    
    // Update hreflang when language changes
    document.addEventListener('languageChanged', () => {
      this.updateHreflangTags();
    });
  }
  
  /**
   * Add hreflang tags to the document head
   */
  addHreflangTags() {
    // Remove any existing hreflang tags first
    this.removeExistingHreflangTags();
    
    // Get current path and page
    const currentPath = window.location.pathname;
    
    // Add a hreflang tag for each supported language
    this.supportedLanguages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = this.languageVariants[lang] || lang;
      
      // For language URLs, we can either use path prefix (/es/page) or query param (?lang=es)
      // This implementation uses path prefix which is better for SEO
      if (lang === this.defaultLanguage) {
        // Default language typically doesn't have a prefix
        link.href = `${this.baseUrl}${currentPath}`;
      } else {
        // Remove any existing language prefix from path if present
        const pathWithoutLang = this.removeLanguagePrefixFromPath(currentPath);
        link.href = `${this.baseUrl}/${lang}${pathWithoutLang}`;
      }
      
      // Add a class for easier selection later
      link.classList.add('hreflang-tag');
      
      document.head.appendChild(link);
    });
    
    // Add x-default hreflang for language selector pages
    const xDefaultLink = document.createElement('link');
    xDefaultLink.rel = 'alternate';
    xDefaultLink.hreflang = 'x-default';
    xDefaultLink.href = `${this.baseUrl}${this.removeLanguagePrefixFromPath(currentPath)}`;
    xDefaultLink.classList.add('hreflang-tag');
    document.head.appendChild(xDefaultLink);
  }
  
  /**
   * Update hreflang tags (for dynamic changes)
   */
  updateHreflangTags() {
    this.addHreflangTags(); // Simply recreate them
  }
  
  /**
   * Remove any existing hreflang tags
   */
  removeExistingHreflangTags() {
    const existingTags = document.querySelectorAll('.hreflang-tag');
    existingTags.forEach(tag => tag.remove());
  }
  
  /**
   * Remove language prefix from path if present
   * @param {string} path - The current path
   * @returns {string} Path without language prefix
   */
  removeLanguagePrefixFromPath(path) {
    // Check if path starts with a language code
    const match = path.match(new RegExp(`^/(${this.supportedLanguages.join('|')})(\/|$)`));
    
    if (match) {
      // Remove the language prefix
      return path.substring(match[0].length - (match[2] === '/' ? 1 : 0));
    }
    
    return path;
  }
}

// Create and initialize the hreflang manager
const hreflangManager = new HreflangManager();

export default hreflangManager;
