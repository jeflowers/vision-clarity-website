/**
 * Vision Clarity Institute - Modal Manager
 * Handles opening, closing, and validation of modal dialogs
 */

// Check if ModalManager already exists
if (!window.ModalManager) {
  window.ModalManager = {
    initialized: false,
    modals: {},
    forms: {},
    currentLanguageSelectors: {},
    
    init: function() {
      // Prevent multiple initializations
      if (this.initialized) {
        console.log('ModalManager already initialized');
        return;
      }
      
      console.log('Initializing modal manager');
      this.initialized = true;
      
      // Load modals
      this.loadModals();
      
      // Initialize language selectors
      this.initLanguageSelectors();
      
      // Setup event listeners
      this.setupEventListeners();
    },
    
    loadModals: function() {
      console.log('Loading modals...');
      
      // Determine the root path for modal components
      const rootPath = this.getRootPath();
      console.log(`Using root path: ${rootPath}`);
      
      // Find modal elements
      this.modals.consultationModal = document.getElementById('consultation-modal');
      this.modals.inquiryModal = document.getElementById('inquiry-modal');
      
      // Find form elements
      this.forms.consultationForm = document.getElementById('consultation-form');
      this.forms.inquiryForm = document.getElementById('inquiry-form');
      
      // Set up language selector containers
      const langSelectorContainers = document.querySelectorAll('.language-selector-container');
      console.log(`Found ${langSelectorContainers.length} language selector containers`);
      
      // Check if all required elements are present
      const hasAllElements = {
        consultationModal: !!this.modals.consultationModal,
        inquiryModal: !!this.modals.inquiryModal,
        consultationForm: !!this.forms.consultationForm,
        inquiryForm: !!this.forms.inquiryForm
      };
      
      console.log('Modal elements found:', hasAllElements);
      
      // Set up forms if present
      if (this.forms.consultationForm) {
        this.setupForm(this.forms.consultationForm, 'consultation');
      }
      
      if (this.forms.inquiryForm) {
        this.setupForm(this.forms.inquiryForm, 'inquiry');
      }
      
      console.log('Modals loaded successfully');
      
      // Initialize language selectors again after modals are loaded
      this.initLanguageSelectors();
    },
    
    setupForm: function(form, formType) {
      // Add validation logic here
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.validateAndSubmit(form, formType);
      });
      
      // Set up other form behaviors
      // ...
    },
    
    validateAndSubmit: function(form, formType) {
      // Form validation logic
      // ...
      
      // Form submission logic
      // ...
    },
    
    getRootPath: function() {
      // Same logic as in I18nManager and ComponentLoader
      if (window.location.hostname.includes('github.io')) {
        return '/vision-clarity-website/';
      }
      
      const path = window.location.pathname;
      if (path.includes('/pages/')) {
        return '../';
      }
      
      return './';
    },
    
    setupEventListeners: function() {
      // Setup button listeners for opening modals
      document.querySelectorAll('[data-open-modal]').forEach(button => {
        const modalId = button.getAttribute('data-open-modal');
        button.addEventListener('click', () => {
          this.openModal(modalId);
        });
      });
      
      // Setup close buttons within modals
      document.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', () => {
          const modal = button.closest('.modal');
          if (modal) {
            this.closeModal(modal.id);
          }
        });
      });
      
      // Close modal when clicking outside content
      document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
          if (event.target === modal) {
            this.closeModal(modal.id);
          }
        });
      });
      
      // Escape key to close modals
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.closeAllModals();
        }
      });
    },
    
    openModal: function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    },
    
    closeModal: function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    },
    
    closeAllModals: function() {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.classList.remove('modal-open');
    },
    
    initLanguageSelectors: function() {
      console.log('Initializing language selectors');
      const selectors = document.querySelectorAll('.language-selector');
      console.log(`Found ${selectors.length} language selectors`);
      
      selectors.forEach(selector => {
        const id = selector.id;
        
        // Skip if already initialized
        if (this.currentLanguageSelectors[id]) {
          console.log(`Selector ${id} already initialized, skipping`);
          return;
        }
        
        console.log(`Initializing selector: ${id}`);
        
        // Setup country flag indicator
        const flagIndicator = selector.querySelector('.selected-language-flag');
        if (flagIndicator) {
          // Set initial flag based on current language
          const currentLang = window.I18nManager ? window.I18nManager.currentLanguage : 'en';
          const flagEmoji = this.getFlagEmoji(currentLang);
          flagIndicator.textContent = flagEmoji;
          console.log(`Set initial flag: ${flagEmoji}`);
        }
        
        // Setup dropdown functionality
        const dropdown = selector.querySelector('.language-dropdown');
        const dropdownToggle = selector.querySelector('.language-selector-toggle');
        
        if (dropdown && dropdownToggle) {
          dropdownToggle.addEventListener('click', () => {
            dropdown.classList.toggle('show');
          });
          
          // Close when clicking outside
          document.addEventListener('click', (event) => {
            if (!selector.contains(event.target)) {
              dropdown.classList.remove('show');
            }
          });
          
          // Handle language selection
          const options = dropdown.querySelectorAll('.language-option');
          options.forEach(option => {
            option.addEventListener('click', () => {
              const lang = option.getAttribute('data-lang');
              
              // Update flag
              if (flagIndicator) {
                flagIndicator.textContent = this.getFlagEmoji(lang);
              }
              
              // Change language if I18nManager is available
              if (window.I18nManager && typeof window.I18nManager.changeLanguage === 'function') {
                window.I18nManager.changeLanguage(lang);
              }
              
              // Close dropdown
              dropdown.classList.remove('show');
            });
          });
        }
        
        // Mark as initialized
        this.currentLanguageSelectors[id] = true;
        console.log(`Language selector ${id} initialized`);
      });
    },
    
    getFlagEmoji: function(langCode) {
      // Map language codes to country codes for flag emojis
      const langToCountry = {
        'en': 'US', // English ->
    getFlagEmoji: function(langCode) {
      // Map language codes to country codes for flag emojis
      const langToCountry = {
        'en': 'US', // English -> USA flag
        'es': 'ES', // Spanish -> Spain flag
        'la_es': 'MX', // Latin American Spanish -> Mexico flag
        'br': 'BR', // Portuguese -> Brazil flag
        'zh': 'CN', // Chinese -> China flag
        'ko': 'KR', // Korean -> South Korea flag
        'tw': 'TW', // Taiwanese -> Taiwan flag
        'hy': 'AM', // Armenian -> Armenia flag
        'he': 'IL', // Hebrew -> Israel flag
        'tl': 'PH', // Tagalog -> Philippines flag
        'ru': 'RU', // Russian -> Russia flag
        'lg': 'ZZ', // Luganda -> Custom flag
        'fa': 'IR', // Persian/Farsi -> Iran flag
        'ar': 'SA'  // Arabic -> Saudi Arabia flag
      };
      
      const countryCode = langToCountry[langCode] || 'US';
      
      // Special case for Luganda
      if (countryCode === 'ZZ') {
        return '🌍'; // Generic globe emoji
      }
      
      // Convert country code to flag emoji
      // Each letter is converted to a regional indicator symbol letter
      // which when combined, create a flag emoji
      return countryCode
        .split('')
        .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
        .join('');
    }
  };
} else {
  console.log('ModalManager already defined, using existing instance');
}

// Initialize safely
document.addEventListener('DOMContentLoaded', function() {
  if (window.ModalManager && typeof window.ModalManager.init === 'function') {
    window.ModalManager.init();
  }
});
