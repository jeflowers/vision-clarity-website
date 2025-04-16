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
  
      // First load modal components explicitly
      this.loadModalComponents();
      
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
      this.modals.inquiryModal = document.getElementById('inquiry-modal') || 
                                document.getElementById('service-inquiry-modal');
      
      // Find form elements
      this.forms.consultationForm = document.getElementById('consultation-form');
      this.forms.inquiryForm = document.getElementById('inquiry-form') || 
                              document.getElementById('service-inquiry-form');
      
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

    loadModalComponents: function() {
      console.log('Modal components will be loaded by modal-preloader.js');
      
      // Make sure we have references to the modals once they're loaded
      setTimeout(() => {
        this.modals.consultationModal = document.getElementById('consultationModal');
        this.modals.inquiryModal = document.getElementById('inquiryModal');
        this.forms.consultationForm = document.getElementById('consultationForm');
        this.forms.inquiryForm = document.getElementById('inquiryForm');
        
        if (this.forms.consultationForm) {
          this.setupForm(this.forms.consultationForm, 'consultation');
        }
        
        if (this.forms.inquiryForm) {
          this.setupForm(this.forms.inquiryForm, 'inquiry');
        }
      }, 1000);
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
      // Original handlers for data-open-modal
      document.querySelectorAll('[data-open-modal]').forEach(button => {
        const modalId = button.getAttribute('data-open-modal');
        button.addEventListener('click', () => {
          this.openModal(modalId);
        });
      });
      
      // Add new handlers for open-modal class with data-form-type
      document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', () => {
          const formType = button.getAttribute('data-form-type');
          if (formType === 'consultation') {
            this.openModal('consultation-modal');
          } else if (formType === 'inquiry') {
            // Try both possible IDs
            const serviceInquiryModal = document.getElementById('service-inquiry-modal');
            if (serviceInquiryModal) {
              this.openModal('service-inquiry-modal');
            } else {
              this.openModal('inquiry-modal');
            }
          }
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
        console.log(`Modal opened: ${modalId}`);
      } else {
        console.error(`Modal not found with ID: ${modalId}`);
        // For debugging
        console.log('Available modals:', 
          Array.from(document.querySelectorAll('.modal')).map(m => ({id: m.id, classes: m.className})));
        
        // If the modal doesn't exist yet, we might be in a race condition
        // Try again after a short delay
        setTimeout(() => {
          const retryModal = document.getElementById(modalId);
          if (retryModal) {
            console.log(`Modal found on retry: ${modalId}`);
            retryModal.classList.add('active');
            document.body.classList.add('modal-open');
          } else {
            console.error(`Modal still not found on retry: ${modalId}`);
          }
        }, 500);
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
        document.body.classList.remove('modal-open');
      });
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

// Add at the end of your file
document.addEventListener('allComponentsLoaded', function() {
  console.log('All components loaded, re-initializing ModalManager event listeners');
  if (window.ModalManager && typeof window.ModalManager.setupEventListeners === 'function') {
    window.ModalManager.setupEventListeners();
  }
});
