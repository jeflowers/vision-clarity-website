/**
 * Vision Clarity Institute - Content Localization Helper
 * Handles culture-specific content adaptations beyond text translation.
 */

import i18n from './i18n.js';

class ContentLocalizer {
  constructor() {
    // Cultural preferences for eye care content
    this.culturalPreferences = {
      // Default (English) preferences
      'en': {
        caseStudyEmphasis: 'technology', // US audience tends to focus on technology
        imageryFocus: 'individual',      // Emphasize individual outcomes
        testimonialStyle: 'results',     // Focus on measurable results
        formFields: ['name', 'email', 'phone', 'insurance', 'message'],
        honorifics: false,               // Less formal naming conventions
        phoneFormat: '(###) ###-####',
        decimalSeparator: '.',
        currencySymbol: '$',
        currencyFormat: 'symbol-before' // $100
      },
      
      // Spanish preferences
      'es': {
        caseStudyEmphasis: 'family',    // Emphasize family benefits
        imageryFocus: 'family',         // Family-oriented imagery
        testimonialStyle: 'experience', // Focus on patient experience
        formFields: ['name', 'email', 'phone', 'insurance', 'preferred_time', 'message'],
        honorifics: true,              // More formal naming (Sr./Sra.)
        phoneFormat: '(###) ###-####',
        decimalSeparator: ',',
        currencySymbol: '$',
        currencyFormat: 'symbol-before' // $100
      },
      
      // Chinese preferences
      'zh': {
        caseStudyEmphasis: 'credentials', // Emphasize doctor credentials
        imageryFocus: 'technology',       // Emphasis on advanced technology
        testimonialStyle: 'authority',    // Expert authority important
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,                // More formal naming conventions
        phoneFormat: '(###) ###-####',
        decimalSeparator: '.',
        currencySymbol: '$',
        currencyFormat: 'symbol-before' // $100
      },
      
      // Korean preferences
      'ko': {
        caseStudyEmphasis: 'credentials', // Emphasize doctor credentials
        imageryFocus: 'results',         // Before/after results
        testimonialStyle: 'authority',   // Formal testimonials
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,               // Formal naming with honorifics
        phoneFormat: '(###) ###-####',
        decimalSeparator: '.',
        currencySymbol: '$',
        currencyFormat: 'symbol-before' // $100
      },
      
      // Armenian preferences
      'hy': {
        caseStudyEmphasis: 'experience',  // Emphasize doctor experience
        imageryFocus: 'community',        // Community/family oriented
        testimonialStyle: 'personal',     // Personal recommendations valued
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,                // Formal naming
        phoneFormat: '(###) ###-####',
        decimalSeparator: ',',
        currencySymbol: '$',
        currencyFormat: 'symbol-before' // $100
      },
      
      // Hebrew preferences
      'he': {
        caseStudyEmphasis: 'credentials', // Emphasize doctor credentials
        imageryFocus: 'technology',       // Technology focus
        testimonialStyle: 'detailed',     // Detailed testimonials
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,                // Formal naming
        phoneFormat: '(###) ###-####',
        decimalSeparator: '.',
        currencySymbol: '₪',
        currencyFormat: 'symbol-after' // 100₪ (though we'd still use $ in US)
      },
      
      // Filipino/Tagalog preferences
      'tl': {
        caseStudyEmphasis: 'affordability', // Cost-effectiveness
        imageryFocus: 'family',            // Family-oriented
        testimonialStyle: 'community',     // Community recommendations
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,                 // Formal naming
        phoneFormat: '(###) ###-####',
        decimalSeparator: '.',
        currencySymbol: '$',
        currencyFormat: 'symbol-before' // $100
      },
      
      // Russian preferences
      'ru': {
        caseStudyEmphasis: 'credentials', // Emphasize doctor credentials
        imageryFocus: 'results',         // Focus on results
        testimonialStyle: 'detailed',    // Detailed testimonials
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,               // Formal naming
        phoneFormat: '(###) ###-####',
        decimalSeparator: ',',
        currencySymbol: '$',
        currencyFormat: 'symbol-after' // 100$ (though we'd still use $ before in US)
      },
      
      // Persian/Farsi preferences
      'fa': {
        caseStudyEmphasis: 'experience', // Doctor experience
        imageryFocus: 'luxury',         // Premium/luxury feel
        testimonialStyle: 'authority',  // Authority testimonials
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,              // Formal naming
        phoneFormat: '(###) ###-####',
        decimalSeparator: '/',
        currencySymbol: '$',
        currencyFormat: 'symbol-after' // 100$ (though we'd still use $ before in US)
      },
      
      // Arabic preferences
      'ar': {
        caseStudyEmphasis: 'credentials', // Doctor credentials
        imageryFocus: 'family',          // Family-oriented
        testimonialStyle: 'authority',   // Authority focused
        formFields: ['name', 'email', 'phone', 'preferred_language', 'insurance', 'message'],
        honorifics: true,               // Formal naming
        phoneFormat: '(###) ###-####',
        decimalSeparator: '٫',
        currencySymbol: '$',
        currencyFormat: 'symbol-after' // 100$ (though we'd still use $ before in US)
      }
    };
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    document.addEventListener('languageChanged', (event) => {
      this.adaptContentForCulture(event.detail.language);
    });
    
    document.addEventListener('DOMContentLoaded', () => {
      const currentLang = document.documentElement.lang || 'en';
      this.adaptContentForCulture(currentLang);
    });
  }
  
  /**
   * Adapt content for a specific culture/language
   * @param {string} lang - Language code
   */
  adaptContentForCulture(lang) {
    const preferences = this.culturalPreferences[lang] || this.culturalPreferences['en'];
    
    // Adapt testimonials to preferred style
    this.adaptTestimonials(preferences.testimonialStyle);
    
    // Adapt imagery focus
    this.adaptImagery(preferences.imageryFocus);
    
    // Adapt case studies emphasis
    this.adaptCaseStudies(preferences.caseStudyEmphasis);
    
    // Adapt contact forms
    this.adaptContactForms(preferences.formFields, preferences.honorifics);
    
    // Format numbers according to locale
    this.formatNumbers(preferences.decimalSeparator, preferences.currencySymbol, preferences.currencyFormat);
  }
  
  /**
   * Adapt testimonials based on cultural preferences
   * @param {string} style - Preferred testimonial style
   */
  adaptTestimonials(style) {
    const testimonialSections = document.querySelectorAll('.testimonial-section');
    if (!testimonialSections.length) return;
    
    // Remove previous adaptations
    testimonialSections.forEach(section => {
      section.classList.remove('focus-results', 'focus-experience', 'focus-authority', 'focus-personal', 'focus-detailed', 'focus-community');
    });
    
    // Apply new adaptation
    testimonialSections.forEach(section => {
      section.classList.add(`focus-${style}`);
      
      // Find testimonials that match the preferred style
      const allTestimonials = section.querySelectorAll('.testimonial-card');
      
      if (allTestimonials.length > 0) {
        // Hide all testimonials first
        allTestimonials.forEach(card => card.style.display = 'none');
        
        // Show testimonials that match the preferred style
        const preferredTestimonials = section.querySelectorAll(`.testimonial-card[data-style="${style}"]`);
        
        if (preferredTestimonials.length > 0) {
          preferredTestimonials.forEach(card => card.style.display = 'block');
        } else {
          // If no matching testimonials, show all
          allTestimonials.forEach(card => card.style.display = 'block');
        }
      }
    });
  }
  
  /**
   * Adapt imagery based on cultural preferences
   * @param {string} focus - Preferred imagery focus
   */
  adaptImagery(focus) {
    // Find all image containers with cultural variants
    const imageContainers = document.querySelectorAll('[data-imagery-variants]');
    
    imageContainers.forEach(container => {
      try {
        const variants = JSON.parse(container.getAttribute('data-imagery-variants'));
        
        // Find the appropriate image for this culture
        const imageUrl = variants[focus] || variants['default'];
        
        if (imageUrl) {
          // Find the image element within the container
          const img = container.querySelector('img');
          if (img) {
            img.src = imageUrl;
          }
        }
      } catch (error) {
        console.error('Error parsing imagery variants:', error);
      }
    });
  }
  
  /**
   * Adapt case studies based on cultural preferences
   * @param {string} emphasis - Preferred case study emphasis
   */
  adaptCaseStudies(emphasis) {
    // Hide all emphasis sections first
    document.querySelectorAll('.case-study-emphasis').forEach(section => {
      section.style.display = 'none';
    });
    
    // Show the preferred emphasis sections
    document.querySelectorAll(`.case-study-emphasis[data-emphasis="${emphasis}"]`).forEach(section => {
      section.style.display = 'block';
    });
  }
  
  /**
   * Adapt contact forms based on cultural preferences
   * @param {Array} fields - Preferred form fields
   * @param {boolean} useHonorifics - Whether to use honorifics
   */
  adaptContactForms(fields, useHonorifics) {
    const forms = document.querySelectorAll('form.contact-form');
    
    forms.forEach(form => {
      // Show/hide honorifics field
      const honorificsField = form.querySelector('.form-field[data-field="honorific"]');
      if (honorificsField) {
        honorificsField.style.display = useHonorifics ? 'block' : 'none';
      }
      
      // Show/hide optional fields based on cultural preferences
      const allFields = form.querySelectorAll('.form-field');
      allFields.forEach(field => {
        const fieldName = field.getAttribute('data-field');
        
        // Required fields are always shown
        if (field.classList.contains('required')) return;
        
        // Show/hide based on cultural preference
        if (fieldName && !field.classList.contains('required')) {
          field.style.display = fields.includes(fieldName) ? 'block' : 'none';
        }
      });
    });
  }
  
  /**
   * Format numbers according to locale preferences
   * @param {string} decimalSeparator - Decimal separator character
   * @param {string} currencySymbol - Currency symbol
   * @param {string} currencyFormat - Currency format (symbol-before or symbol-after)
   */
  formatNumbers(decimalSeparator, currencySymbol, currencyFormat) {
    // Format numbers with the appropriate decimal separator
    document.querySelectorAll('.format-number').forEach(element => {
      const value = element.textContent.trim();
      const parsedValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      
      if (!isNaN(parsedValue)) {
        const parts = parsedValue.toString().split('.');
        const formattedValue = parts[0] + (parts.length > 1 ? decimalSeparator + parts[1] : '');
        element.textContent = formattedValue;
      }
    });
    
    // Format currency values
    document.querySelectorAll('.format-currency').forEach(element => {
      const value = element.textContent.trim();
      const parsedValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      
      if (!isNaN(parsedValue)) {
        const parts = parsedValue.toString().split('.');
        const formattedNumber = parts[0] + (parts.length > 1 ? decimalSeparator + parts[1] : '');
        
        if (currencyFormat === 'symbol-before') {
          element.textContent = currencySymbol + formattedNumber;
        } else {
          element.textContent = formattedNumber + currencySymbol;
        }
      }
    });
  }
  
  /**
   * Get current culture preferences
   * @returns {Object} Cultural preferences for current language
   */
  getCurrentPreferences() {
    const currentLang = document.documentElement.lang || 'en';
    return this.culturalPreferences[currentLang] || this.culturalPreferences['en'];
  }
}

// Create and export the content localizer
const contentLocalizer = new ContentLocalizer();

export default contentLocalizer;
