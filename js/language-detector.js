/**
 * Vision Clarity Institute - Advanced Language Detection
 * This module provides enhanced language detection based on various factors.
 */

class LanguageDetector {
  constructor(supportedLanguages = ['en', 'es', 'zh', 'ko', 'hy', 'he', 'tl', 'ru', 'fa', 'ar']) {
    this.supportedLanguages = supportedLanguages;
    this.defaultLanguage = 'en';
    
    // Los Angeles area language preferences by region
    this.regionLanguageMap = {
      // Glendale/Burbank
      'glendale': ['hy', 'en', 'es'],
      'burbank': ['hy', 'en', 'es'],
      
      // Koreatown and surroundings
      'koreatown': ['ko', 'en', 'es'],
      'mid_wilshire': ['ko', 'en', 'es'],
      
      // West LA / Beverly Hills
      'west_la': ['fa', 'he', 'en', 'ru'],
      'beverly_hills': ['fa', 'he', 'en', 'ru'],
      'pico_robertson': ['he', 'en', 'fa'],
      
      // San Gabriel Valley
      'alhambra': ['zh', 'en', 'es'],
      'monterey_park': ['zh', 'en', 'es'],
      'arcadia': ['zh', 'en'],
      
      // East LA
      'east_los_angeles': ['es', 'en'],
      'boyle_heights': ['es', 'en'],
      
      // Western San Fernando Valley
      'sherman_oaks': ['en', 'es', 'fa', 'ru'],
      'encino': ['en', 'fa', 'ru', 'he'],
      
      // Long Beach / South Bay
      'long_beach': ['es', 'en', 'tl', 'zh'],
      'carson': ['tl', 'en', 'es'],
      
      // Hollywood area
      'west_hollywood': ['ru', 'en', 'es'],
      'hollywood': ['en', 'es', 'ru', 'hy'],
      
      // Default for Los Angeles area
      'los_angeles': ['en', 'es', 'zh', 'ko', 'hy']
    };
  }
  
  /**
   * Detect the optimal language for the user based on multiple factors
   * @returns {Promise<string>} The detected language code
   */
  async detectLanguage() {
    // Get saved preference first (highest priority)
    const savedLanguage = localStorage.getItem('vci-language');
    if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to get geolocation and use regional preferences
    try {
      const region = await this.determineRegion();
      if (region) {
        const regionLanguages = this.regionLanguageMap[region] || this.regionLanguageMap['los_angeles'];
        
        // Check if any of the region's preferred languages match the browser languages
        const browserLanguages = this.getBrowserLanguages();
        for (const browserLang of browserLanguages) {
          for (const regionLang of regionLanguages) {
            if (browserLang === regionLang) {
              return browserLang;
            }
          }
        }
        
        // If no match, use the top language for the region
        return regionLanguages[0];
      }
    } catch (error) {
      console.warn('Error determining region:', error);
    }
    
    // Fall back to browser language preferences
    const browserLanguages = this.getBrowserLanguages();
    for (const lang of browserLanguages) {
      if (this.supportedLanguages.includes(lang)) {
        return lang;
      }
    }
    
    // Last resort: default language
    return this.defaultLanguage;
  }
  
  /**
   * Get browser language preferences as an array
   * @returns {Array<string>} Array of language codes
   */
  getBrowserLanguages() {
    // Try to get navigator.languages (array of language preferences)
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages
        .map(lang => lang.split('-')[0].toLowerCase())
        .filter(lang => this.supportedLanguages.includes(lang));
    }
    
    // Fall back to navigator.language or navigator.userLanguage
    const browserLang = (navigator.language || navigator.userLanguage || this.defaultLanguage)
      .split('-')[0].toLowerCase();
    
    return [browserLang];
  }
  
  /**
   * Approximate the user's region based on IP geolocation
   * Uses a free geolocation API
   * @returns {Promise<string|null>} Region identifier or null if cannot determine
   */
  async determineRegion() {
    try {
      // Using a free geolocation API (replace with your preferred service)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // Check if in Greater LA area
      if (data.region_code === 'CA' && 
          (data.city === 'Los Angeles' || this.isGreaterLAArea(data.latitude, data.longitude))) {
        
        // Determine specific region within LA
        return this.determineSpecificLARegion(data.latitude, data.longitude, data.city);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return null;
    }
  }
  
  /**
   * Check if coordinates are within Greater LA area
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {boolean} True if in Greater LA area
   */
  isGreaterLAArea(lat, lng) {
    // Rough bounding box for Greater LA area
    return (
      lat >= 33.5 && lat <= 34.6 &&
      lng >= -118.9 && lng <= -117.5
    );
  }
  
  /**
   * Determine specific region within LA based on coordinates and city name
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {string} city - City name from geolocation
   * @returns {string} Region identifier
   */
  determineSpecificLARegion(lat, lng, city) {
    // Map cities to our region identifiers
    const cityToRegion = {
      'Glendale': 'glendale',
      'Burbank': 'burbank',
      'Alhambra': 'alhambra',
      'Monterey Park': 'monterey_park',
      'Arcadia': 'arcadia',
      'Beverly Hills': 'beverly_hills',
      'West Hollywood': 'west_hollywood',
      'Hollywood': 'hollywood',
      'Long Beach': 'long_beach',
      'Carson': 'carson',
      'Sherman Oaks': 'sherman_oaks',
      'Encino': 'encino'
    };
    
    // If we have a direct city match, use it
    if (city && cityToRegion[city]) {
      return cityToRegion[city];
    }
    
    // Otherwise, approximate region based on coordinates
    // This is a very simplified example - in production this would use more precise boundaries
    
    // Koreatown approximate location
    if (lat >= 34.05 && lat <= 34.08 && lng >= -118.31 && lng <= -118.28) {
      return 'koreatown';
    }
    
    // West LA approximate location
    if (lat >= 34.03 && lat <= 34.08 && lng >= -118.48 && lng <= -118.40) {
      return 'west_la';
    }
    
    // Pico-Robertson approximate location
    if (lat >= 34.05 && lat <= 34.07 && lng >= -118.39 && lng <= -118.36) {
      return 'pico_robertson';
    }
    
    // East LA approximate location
    if (lat >= 34.02 && lat <= 34.05 && lng >= -118.18 && lng <= -118.15) {
      return 'east_los_angeles';
    }
    
    // Default to general Los Angeles
    return 'los_angeles';
  }
}

// Create and expose the language detector globally instead of ES6 export
const languageDetector = new LanguageDetector();
window.languageDetector = languageDetector;
