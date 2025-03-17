/**
 * Vision Clarity Institute - Accessibility-Enhanced Internationalization
 * This module extends the i18n system with accessibility-focused features.
 */

import i18n from './i18n.js';

class AccessibilityI18n {
  constructor() {
    // Accessibility-specific translations
    this.accessibilityTranslations = {
      'en': {
        screenReaderOnly: {
          languageChanged: 'Language changed to English',
          mainContentStart: 'Beginning of main content',
          mainContentEnd: 'End of main content',
          navigationStart: 'Beginning of navigation',
          navigationEnd: 'End of navigation',
          skipToContent: 'Skip to main content',
          contactFormStart: 'Beginning of contact form',
          contactFormEnd: 'End of contact form',
          requiredField: 'This field is required',
          expandMenu: 'Expand menu',
          collapseMenu: 'Collapse menu',
          openSubmenu: 'Open submenu',
          closeSubmenu: 'Close submenu',
          loading: 'Loading, please wait',
          searchResults: 'Search results',
          noSearchResults: 'No search results found',
          closePopup: 'Close popup',
          modalOpened: 'Dialog opened',
          modalClosed: 'Dialog closed',
          currentPage: 'Current page'
        },
        ariaLabels: {
          languageSelector: 'Select language',
          mobileMenuButton: 'Toggle mobile menu',
          searchInput: 'Search for services or information',
          searchButton: 'Submit search',
          closeButton: 'Close',
          nextSlide: 'Next slide',
          previousSlide: 'Previous slide',
          slideNumber: 'Slide {{current}} of {{total}}',
          socialLinks: 'Social media links',
          contactInfo: 'Contact information',
          officeHours: 'Office hours',
          testimonials: 'Patient testimonials',
          relatedServices: 'Related services',
          procedures: 'Available procedures',
          locationMap: 'Office location map',
          staffSection: 'Our medical staff',
          techSection: 'Our technology',
          insuranceSection: 'Accepted insurance plans'
        }
      },
      // Spanish translations
      'es': {
        screenReaderOnly: {
          languageChanged: 'Idioma cambiado a Español',
          mainContentStart: 'Comienzo del contenido principal',
          mainContentEnd: 'Fin del contenido principal',
          navigationStart: 'Comienzo de la navegación',
          navigationEnd: 'Fin de la navegación',
          skipToContent: 'Saltar al contenido principal',
          contactFormStart: 'Comienzo del formulario de contacto',
          contactFormEnd: 'Fin del formulario de contacto',
          requiredField: 'Este campo es obligatorio',
          expandMenu: 'Expandir menú',
          collapseMenu: 'Contraer menú',
          openSubmenu: 'Abrir submenú',
          closeSubmenu: 'Cerrar submenú',
          loading: 'Cargando, por favor espere',
          searchResults: 'Resultados de búsqueda',
          noSearchResults: 'No se encontraron resultados',
          closePopup: 'Cerrar ventana emergente',
          modalOpened: 'Diálogo abierto',
          modalClosed: 'Diálogo cerrado',
          currentPage: 'Página actual'
        },
        ariaLabels: {
          languageSelector: 'Seleccionar idioma',
          mobileMenuButton: 'Alternar menú móvil',
          searchInput: 'Buscar servicios o información',
          searchButton: 'Enviar búsqueda',
          closeButton: 'Cerrar',
          nextSlide: 'Siguiente diapositiva',
          previousSlide: 'Diapositiva anterior',
          slideNumber: 'Diapositiva {{current}} de {{total}}',
          socialLinks: 'Enlaces de redes sociales',
          contactInfo: 'Información de contacto',
          officeHours: 'Horario de oficina',
          testimonials: 'Testimonios de pacientes',
          relatedServices: 'Servicios relacionados',
          procedures: 'Procedimientos disponibles',
          locationMap: 'Mapa de ubicación de la oficina',
          staffSection: 'Nuestro personal médico',
          techSection: 'Nuestra tecnología',
          insuranceSection: 'Planes de seguro aceptados'
        }
      },
      // Add other languages here following the same structure
      // Hebrew example (abbreviated) - RTL language with specific accessibility concerns
      'he': {
        screenReaderOnly: {
          languageChanged: 'השפה שונתה לעברית',
          mainContentStart: 'תחילת התוכן הראשי',
          mainContentEnd: 'סוף התוכן הראשי',
          skipToContent: 'דלג לתוכן הראשי',
          requiredField: 'שדה חובה'
        },
        ariaLabels: {
          languageSelector: 'בחר שפה',
          mobileMenuButton: 'החלף תפריט נייד',
          searchInput: 'חפש שירותים או מידע',
          searchButton: 'שלח חיפוש'
        }
      }
      // Additional languages would be added here
    };
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Apply initial accessibility translations
    this.applyAccessibilityTranslations();
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    document.addEventListener('languageChanged', (event) => {
      this.applyAccessibilityTranslations(event.detail.language);
      this.announceLanguageChange(event.detail.language);
    });
    
    document.addEventListener('DOMContentLoaded', () => {
      const currentLang = document.documentElement.lang || 'en';
      this.applyAccessibilityTranslations(currentLang);
      this.setupAccessibilityFeatures();
    });
  }
  
  /**
   * Apply accessibility translations to the page
   * @param {string} lang - Language code (optional, uses current language if not provided)
   */
  applyAccessibilityTranslations(lang) {
    lang = lang || document.documentElement.lang || 'en';
    
    // Get translations for this language, falling back to English if not available
    const translations = this.accessibilityTranslations[lang] || this.accessibilityTranslations['en'];
    
    // Apply screen reader only text
    document.querySelectorAll('[data-a11y-text]').forEach(element => {
      const key = element.getAttribute('data-a11y-text');
      const parts = key.split('.');
      
      if (parts.length === 2 && translations[parts[0]] && translations[parts[0]][parts[1]]) {
        element.textContent = translations[parts[0]][parts[1]];
      }
    });
    
    // Apply ARIA labels
    document.querySelectorAll('[data-a11y-label]').forEach(element => {
      const key = element.getAttribute('data-a11y-label');
      const parts = key.split('.');
      
      if (parts.length === 2 && translations[parts[0]] && translations[parts[0]][parts[1]]) {
        let label = translations[parts[0]][parts[1]];
        
        // Handle variables in ARIA labels
        if (label.includes('{{')) {
          const vars = {};
          
          // Extract variables from data attributes
          Object.keys(element.dataset).forEach(attr => {
            if (attr.startsWith('var')) {
              const varName = attr.substring(3).toLowerCase();
              vars[varName] = element.dataset[attr];
            }
          });
          
          // Replace variables in the label
          label = label.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
            return vars[variable] !== undefined ? vars[variable] : match;
          });
        }
        
        element.setAttribute('aria-label', label);
      }
    });
  }
  
  /**
   * Set up accessibility features on the page
   */
  setupAccessibilityFeatures() {
    this.setupSkipLinks();
    this.setupLanguageToggleAnnouncements();
    this.setupLiveRegions();
    this.enhanceFormAccessibility();
    this.enhanceNavigationAccessibility();
    this.setupDirectionAttributes();
  }
  
  /**
   * Set up skip links for keyboard navigation
   */
  setupSkipLinks() {
    const mainContent = document.querySelector('main') || document.querySelector('#content');
    
    if (!mainContent) return;
    
    // Check if skip link already exists
    if (!document.querySelector('#skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-link';
      skipLink.href = '#content';
      skipLink.className = 'sr-only sr-only-focusable';
      
      // Get translation for current language
      const currentLang = document.documentElement.lang || 'en';
      const translations = this.accessibilityTranslations[currentLang] || this.accessibilityTranslations['en'];
      skipLink.textContent = translations.screenReaderOnly.skipToContent;
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Add ID to main content if missing
    if (!mainContent.id) {
      mainContent.id = 'content';
    }
  }
  
  /**
   * Set up announcements for language changes
   */
  setupLanguageToggleAnnouncements() {
    const languageSelect = document.getElementById('language-select');
    
    if (!languageSelect) return;
    
    // Create or get the live region
    let liveRegion = document.getElementById('a11y-announcer');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  }
  
  /**
   * Announce language change to screen readers
   * @param {string} lang - Language code
   */
  announceLanguageChange(lang) {
    const translations = this.accessibilityTranslations[lang] || this.accessibilityTranslations['en'];
    const announcement = translations.screenReaderOnly.languageChanged;
    
    const liveRegion = document.getElementById('a11y-announcer');
    if (liveRegion) {
      liveRegion.textContent = announcement;
    }
  }
  
  /**
   * Set up live regions for dynamic content
   */
  setupLiveRegions() {
    // Create live regions for various dynamic content areas
    const liveRegions = [
      { id: 'search-results-live', ariaLive: 'polite' },
      { id: 'form-feedback-live', ariaLive: 'assertive' },
      { id: 'page-loading-live', ariaLive: 'polite' }
    ];
    
    liveRegions.forEach(region => {
      if (!document.getElementById(region.id)) {
        const liveRegion = document.createElement('div');
        liveRegion.id = region.id;
        liveRegion.setAttribute('aria-live', region.ariaLive);
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
    });
  }
  
  /**
   * Enhance form accessibility
   */
  enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add proper form labels if missing
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        const id = input.id || `${input.name}-input`;
        input.id = id;
        
        // If there's no associated label, add one
        if (!document.querySelector(`label[for="${id}"]`)) {
          const label = input.getAttribute('placeholder') || input.name;
          if (label) {
            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', id);
            labelElement.className = 'sr-only'; // Visually hidden but available to screen readers
            labelElement.textContent = label;
            input.parentNode.insertBefore(labelElement, input);
          }
        }
        
        // Add proper ARIA attributes for required fields
        if (input.required) {
          input.setAttribute('aria-required', 'true');
          
          // Get current language translations
          const currentLang = document.documentElement.lang || 'en';
          const translations = this.accessibilityTranslations[currentLang] || this.accessibilityTranslations['en'];
          
          input.setAttribute('aria-describedby', `${id}-required-msg`);
          
          // Add message element for screen readers
          if (!document.getElementById(`${id}-required-msg`)) {
            const requiredMsg = document.createElement('span');
            requiredMsg.id = `${id}-required-msg`;
            requiredMsg.className = 'sr-only';
            requiredMsg.textContent = translations.screenReaderOnly.requiredField;
            input.parentNode.insertBefore(requiredMsg, input.nextSibling);
          }
        }
      });
    });
  }
  
  /**
   * Enhance navigation accessibility
   */
  enhanceNavigationAccessibility() {
    const navItems = document.querySelectorAll('nav li');
    
    navItems.forEach(item => {
      const link = item.querySelector('a');
      const subMenu = item.querySelector('ul');
      
      if (link && subMenu) {
        // It's a dropdown menu
        if (!link.getAttribute('aria-haspopup')) {
          link.setAttribute('aria-haspopup', 'true');
          link.setAttribute('aria-expanded', 'false');
          
          // Add event listener to toggle aria-expanded
          link.addEventListener('click', function(e) {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
          });
        }
      }
    });
  }
  
  /**
   * Set up proper direction attributes for mixed content
   */
  setupDirectionAttributes() {
    // For RTL languages, we need to ensure that embedded LTR content is properly marked
    const isRTL = document.dir === 'rtl';
    
    if (isRTL) {
      // Find English text in RTL context
      const textNodes = this.getTextNodes(document.body);
      
      textNodes.forEach(node => {
        // Check if the text contains mostly Latin characters
        if (this.isMainlyLatin(node.nodeValue) && node.parentElement) {
          node.parentElement.setAttribute('dir', 'ltr');
        }
      });
      
      // Special handling for form fields
      document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
          // Check the input value and update direction
          if (this.value && this.value.trim()) {
            this.dir = this.isMainlyLatin(this.value) ? 'ltr' : 'rtl';
          }
        });
      });
    }
  }
  
  /**
   * Get all text nodes in an element
   * @param {Element} element - The element to search in
   * @returns {Array} Array of text nodes
   */
  getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.trim()) {
        textNodes.push(node);
      }
    }
    
    return textNodes;
  }
  
  /**
   * Check if text is mainly Latin characters
   * @param {string} text - Text to check
   * @returns {boolean} True if mainly Latin characters
   */
  isMainlyLatin(text) {
    if (!text || typeof text !== 'string') return true;
    
    // Count Latin vs non-Latin characters
    let latinCount = 0;
    let nonLatinCount = 0;
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      
      // Basic Latin, Latin-1 Supplement, Latin Extended-A/B
      if ((charCode >= 32 && charCode <= 127) || 
          (charCode >= 160 && charCode <= 255) ||
          (charCode >= 256 && charCode <= 591)) {
        latinCount++;
      } else if (charCode > 591) { // Skip control characters and count non-Latin
        nonLatinCount++;
      }
    }
    
    // Consider mainly Latin if more than 70% are Latin characters
    return latinCount > nonLatinCount * 0.7;
  }
  
  /**
   * Get accessibility translations by key
   * @param {string} key - Translation key in dot notation
   * @param {Object} vars - Variables for substitution
   * @returns {string} Translated text
   */
  getA11yTranslation(key, vars = {}) {
    const currentLang = document.documentElement.lang || 'en';
    const translations = this.accessibilityTranslations[currentLang] || this.accessibilityTranslations['en'];
    
    // Split the key into parts
    const parts = key.split('.');
    
    if (parts.length !== 2 || !translations[parts[0]] || !translations[parts[0]][parts[1]]) {
      return key; // Return the key if translation not found
    }
    
    let text = translations[parts[0]][parts[1]];
    
    // Replace variables in the format {{variableName}}
    return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return vars[variable] !== undefined ? vars[variable] : match;
    });
  }
}

// Create and export accessibility enhancer
const a11yI18n = new AccessibilityI18n();

export default a11yI18n;