/**
 * Vision Clarity Institute - Unified Modal System
 * 
 * This file combines all modal functionality into a single, cohesive system.
 * It handles:
 * - Modal loading and initialization
 * - Button event listeners (with support for both data-modal-type and data-form-type)
 * - Form validation and submission
 * - Accessibility features
 * - Success and error messaging
 */

// Create the ModalSystem namespace to avoid global conflicts
const ModalSystem = {
  // Track modals and their state
  modals: {
    consultation: {
      id: 'consultationModal',
      element: null,
      form: null,
      loaded: false
    },
    inquiry: {
      id: 'inquiryModal',
      element: null,
      form: null,
      loaded: false
    },
    message: {
      id: 'messageModal',
      element: null,
      form: null,
      loaded: false
    }
  },
  
  // Store focus history for accessibility
  lastFocusedElement: null,
  
  // Configuration options
  config: {
    // Template paths relative to the site root
    templatePaths: {
      consultation: 'pages/templates/consultation-modal.html',
      inquiry: 'pages/templates/inquiry-modal.html',
      message: 'pages/templates/message-modal.html'
    },
    // Animation timings
    animationTiming: {
      showDelay: 10,     // ms delay before adding active class (for animation)
      hideDelay: 300,    // ms delay before hiding modal (for animation)
      focusDelay: 300    // ms delay before setting focus on first field
    },
    // Success message display duration
    successMessageDuration: 2000,
    // Debug mode
    debug: true
  },
  
  /**
   * Initialize the modal system
   */
  init: function() {
    // Log initialization if in debug mode
    this.log('Initializing Modal System');
    
    // Get the root path for templates
    this.rootPath = this.getRootPath();
    
    // Look for existing modals in the DOM
    this.findExistingModals();
    
    // Load any missing modals
    this.loadMissingModals().then(() => {
      // Initialize event listeners
      this.initEventListeners();
      
      // Process URL parameters if any
      this.processUrlParameters();
      
      this.log('Modal System Initialized');
    }).catch(error => {
      this.log('Error initializing modal system: ' + error.message, 'error');
    });
    
    // Add global reference (for legacy code)
    window.ModalSystem = this;
  },
  
  /**
   * Find any modals that already exist in the DOM
   */
  findExistingModals: function() {
    // Check for each registered modal type
    Object.keys(this.modals).forEach(modalType => {
      const modalId = this.modals[modalType].id;
      const element = document.getElementById(modalId);
      
      if (element) {
        this.log(`Found existing ${modalType} modal in DOM`);
        this.modals[modalType].element = element;
        this.modals[modalType].loaded = true;
        
        // Also look for the form inside the modal
        const formId = modalType + 'Form';
        const form = document.getElementById(formId);
        if (form) {
          this.modals[modalType].form = form;
        }
      }
    });
  },
  
  /**
   * Load any modals that aren't already in the DOM
   * @returns {Promise} Resolves when all modals are loaded
   */
  loadMissingModals: function() {
    return new Promise((resolve, reject) => {
      // Create or find the modal container
      let modalContainer = document.getElementById('modal-container');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
      }
      
      // Create an array of fetch promises for missing modals
      const fetchPromises = [];
      
      // For each missing modal, create a fetch promise
      Object.keys(this.modals).forEach(modalType => {
        if (!this.modals[modalType].loaded) {
          const templatePath = this.rootPath + this.config.templatePaths[modalType];
          this.log(`Loading ${modalType} modal from ${templatePath}`);
          
          const fetchPromise = fetch(templatePath)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to load ${modalType} modal (Status: ${response.status})`);
              }
              return response.text();
            })
            .then(html => {
              // Add the modal HTML to the container
              modalContainer.innerHTML += html;
              
              // Get a reference to the modal element
              const element = document.getElementById(this.modals[modalType].id);
              if (element) {
                this.modals[modalType].element = element;
                this.modals[modalType].loaded = true;
                
                // Get a reference to the form inside the modal
                const formId = modalType + 'Form';
                const form = document.getElementById(formId);
                if (form) {
                  this.modals[modalType].form = form;
                }
                
                this.log(`${modalType} modal loaded successfully`);
              } else {
                this.log(`Modal HTML loaded but could not find element with ID ${this.modals[modalType].id}`, 'error');
              }
            })
            .catch(error => {
              this.log(`Error loading ${modalType} modal: ${error.message}`, 'error');
            });
          
          fetchPromises.push(fetchPromise);
        }
      });
      
      // If there's nothing to load, resolve immediately
      if (fetchPromises.length === 0) {
        resolve();
        return;
      }
      
      // Wait for all fetches to complete
      Promise.all(fetchPromises)
        .then(() => {
          // Check if any modals were successfully loaded
          const anyModalLoaded = Object.keys(this.modals).some(
            modalType => this.modals[modalType].loaded
          );
          
          if (anyModalLoaded) {
            resolve();
          } else {
            reject(new Error('No modals could be loaded'));
          }
        })
        .catch(reject);
    });
  },
  
  /**
   * Set up all event listeners for modals
   */
  initEventListeners: function() {
    // Modal trigger buttons - supporting both data-form-type and data-modal-type
    const modalButtons = document.querySelectorAll('.open-modal');
    this.log(`Found ${modalButtons.length} modal trigger buttons`);
    
    modalButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Check both attributes for compatibility
        const modalType = button.getAttribute('data-modal-type') || button.getAttribute('data-form-type');
        this.log(`Button clicked with modal type: ${modalType}`);
        
        if (modalType) {
          // Check if service-specific data is provided
          const serviceType = button.getAttribute('data-service');
          this.openModal(modalType, serviceType);
        } else {
          this.log('Button clicked but no modal type specified', 'warn');
        }
      });
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
          this.closeModal(modal);
        }
      });
    });
    
    // Close on background click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModal(e.target);
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.active, .modal[style*="display: block"]');
        openModals.forEach(modal => this.closeModal(modal));
      }
    });
    
    // Initialize form submit handlers
    Object.keys(this.modals).forEach(modalType => {
      const form = this.modals[modalType].form;
      if (form) {
        form.addEventListener('submit', (e) => this.handleFormSubmit(e, modalType));
        
        // Add validation listeners to required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
          // Validate on blur
          field.addEventListener('blur', () => this.validateField(field));
          
          // Clear errors on focus
          field.addEventListener('focus', () => this.clearFieldError(field));
        });
      }
    });
    
    // Convert contact links to modal triggers
    this.convertContactLinksToModalTriggers();
  },
  
  /**
   * Process URL parameters to open modals if specified
   */
  processUrlParameters: function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for modal triggers in URL
    if (urlParams.has('consultation')) {
      this.openModal('consultation');
    } else if (urlParams.has('inquiry')) {
      this.openModal('inquiry');
    }
  },
  
  /**
   * Open a specific modal
   * @param {string} modalType - Type of modal to open (consultation, inquiry, etc.)
   * @param {string} serviceType - Optional service type for pre-filling the form
   */
  openModal: function(modalType, serviceType) {
    // Log the request
    this.log(`Request to open modal: ${modalType}`);

    // Check if the modal type is valid
    if (!this.modals[modalType]) {
      this.log(`Unknown modal type: ${modalType}`, 'error');
      return;
    }
    
    // Make sure the modal element exists
    const modal = this.modals[modalType].element;
    if (!modal) {
      this.log(`Modal of type ${modalType} not found in DOM`, 'error');
      return;
    }
    
    // Save the currently focused element for accessibility
    this.lastFocusedElement = document.activeElement;
    
    // Debug the modal
    this.log(`Opening modal: ${modalType}`, 'info', modal);
    this.log(`Modal ID: ${modal.id}`, 'info');
    this.log(`Modal classList: ${modal.className}`, 'info');
    this.log(`Modal display before: ${window.getComputedStyle(modal).display}`, 'info');
    
    // Show the modal
    modal.style.display = 'block';
    
    // Force repaint to ensure styles are applied
    modal.offsetHeight;
    
    // Debug the modal after style change
    this.log(`Modal display after setting to block: ${modal.style.display}`, 'info');
    this.log(`Modal computed style after setting to block: ${window.getComputedStyle(modal).display}`, 'info');
    
    // Add active class after a brief delay (for CSS transitions)
    setTimeout(() => {
      modal.classList.add('active');
      this.log(`Added 'active' class to modal: ${modalType}`, 'info');
    }, this.config.animationTiming.showDelay);
    
    // Prevent body scrolling
    document.body.classList.add('modal-open');
    
    // If a service type was specified, pre-fill the form
    if (serviceType && this.modals[modalType].form) {
      const serviceField = this.modals[modalType].form.querySelector('[name="service"]');
      if (serviceField) {
        serviceField.value = serviceType;
      }
    }
    
    // Set focus to the first form field
    setTimeout(() => {
      // Find the first input field that isn't hidden
      const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) {
        firstInput.focus();
      }
    }, this.config.animationTiming.focusDelay);
    
    // Announce to screen readers
    this.announceToScreenReaders(`${modalType} dialog opened`);
  },
  
  /**
   * Close a modal
   * @param {HTMLElement} modal - The modal element to close
   */
  closeModal: function(modal) {
    if (!modal) return;
    
    // Remove active class to trigger CSS transitions
    modal.classList.remove('active');
    
    // After transition completes, hide the modal
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // Restore focus to the element that was focused before the modal was opened
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    }, this.config.animationTiming.hideDelay);
    
    // Announce to screen readers
    this.announceToScreenReaders('Dialog closed');
  },
  
  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   * @param {string} modalType - Type of modal the form is in
   */
  handleFormSubmit: function(e, modalType) {
    e.preventDefault();
    const form = e.target;
    
    // Validate the form
    if (!this.validateForm(form)) {
      return;
    }
    
    // Collect form data for logging/debugging
    const formData = new FormData(form);
    const formValues = {};
    formData.forEach((value, key) => {
      formValues[key] = value;
    });
    
    this.log(`Form submitted: ${modalType}`, 'info', formValues);
    
    // Show success message
    this.showFormSuccess(form, modalType);
    
    // In a real implementation, you would send the form data to your server
    // For example:
    /*
    fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formValues)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.showFormSuccess(form, modalType);
      } else {
        this.showFormError(form, data.message || 'An error occurred.');
      }
    })
    .catch(error => {
      this.showFormError(form, 'An error occurred while submitting the form.');
      this.log('Form submission error', 'error', error);
    });
    */
  },
  
  /**
   * Validate an entire form
   * @param {HTMLFormElement} form - The form to validate
   * @returns {boolean} True if the form is valid, false otherwise
   */
  validateForm: function(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Validate each required field
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  },
  
  /**
   * Validate a single field
   * @param {HTMLElement} field - The field to validate
   * @returns {boolean} True if the field is valid, false otherwise
   */
  validateField: function(field) {
    // Clear any existing error
    this.clearFieldError(field);
    
    // Check if the field is empty
    if (field.type === 'checkbox' && !field.checked) {
      this.showFieldError(field, 'This checkbox must be checked');
      return false;
    } else if ((field.type !== 'checkbox' && field.value.trim() === '')) {
      this.showFieldError(field, 'This field is required');
      return false;
    }
    
    // Check specific field types
    if (field.type === 'email' && !this.validateEmail(field.value)) {
      this.showFieldError(field, 'Please enter a valid email address');
      return false;
    } else if (field.type === 'tel' && !this.validatePhone(field.value)) {
      this.showFieldError(field, 'Please enter a valid phone number');
      return false;
    }
    
    return true;
  },
  
  /**
   * Show an error message for a field
   * @param {HTMLElement} field - The field with an error
   * @param {string} message - The error message to display
   */
  showFieldError: function(field, message) {
    // Add error class to the field
    field.classList.add('error');
    
    // Create an error message element if it doesn't exist
    let errorMessage = field.parentNode.querySelector('.field-error');
    if (!errorMessage) {
      errorMessage = document.createElement('div');
      errorMessage.className = 'field-error';
      field.parentNode.appendChild(errorMessage);
    }
    
    // Set the error message text
    errorMessage.textContent = message;
  },
  
  /**
   * Clear error styling and message for a field
   * @param {HTMLElement} field - The field to clear
   */
  clearFieldError: function(field) {
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message if it exists
    const errorMessage = field.parentNode.querySelector('.field-error');
    if (errorMessage) {
      errorMessage.remove();
    }
  },
  
  /**
   * Show success message after form submission
   * @param {HTMLFormElement} form - The form that was submitted
   * @param {string} modalType - Type of modal (consultation, inquiry, etc.)
   */
  showFormSuccess: function(form, modalType) {
    // Create success message element
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    
    // Set message based on form type
    if (modalType === 'consultation') {
      successMsg.textContent = 'Thank you! Your consultation request has been received. We will contact you shortly.';
    } else if (modalType === 'inquiry') {
      successMsg.textContent = 'Thank you for your inquiry. Our team will respond to your questions soon.';
    } else if (modalType === 'message') {
      successMsg.textContent = 'Your message has been sent. Thank you for reaching out to us.';
    } else {
      successMsg.textContent = 'Your form has been submitted successfully. Thank you!';
    }
    
    // Add the message to the top of the form
    form.prepend(successMsg);
    
    // Announce success to screen readers
    this.announceToScreenReaders(successMsg.textContent);
    
    // Reset the form
    setTimeout(() => {
      form.reset();
      
      // Close the modal after showing success message
      setTimeout(() => {
        const modal = form.closest('.modal');
        if (modal) {
          this.closeModal(modal);
        }
        
        // Remove success message after modal closes
        successMsg.remove();
      }, this.config.successMessageDuration);
    }, 1000);
  },
  
  /**
   * Show error message after form submission failure
   * @param {HTMLFormElement} form - The form that was submitted
   * @param {string} errorMessage - The error message to display
   */
  showFormError: function(form, errorMessage) {
    // Create error message element
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-error';
    errorMsg.textContent = errorMessage;
    
    // Add the message to the top of the form
    form.prepend(errorMsg);
    
    // Announce error to screen readers
    this.announceToScreenReaders(`Error: ${errorMessage}`);
    
    // Remove the error message after a delay
    setTimeout(() => {
      errorMsg.remove();
    }, 5000);
  },
  
  /**
   * Convert existing contact page links to modal triggers
   */
  convertContactLinksToModalTriggers: function() {
    // Find contact links that should trigger modals
    document.querySelectorAll('a[href*="contact.html"]').forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip if explicitly marked to not convert
      if (link.classList.contains('no-modal')) return;
      
      // Determine modal type based on URL
      let modalType = 'consultation';
      if (href && (href.includes('inquiry=true') || href.includes('inquiry'))) {
        modalType = 'inquiry';
      }
      
      // Replace link behavior
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal(modalType);
      });
      
      // Add attributes for clarity
      link.setAttribute('data-form-type', modalType);
      link.setAttribute('role', 'button');
    });
  },
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validateEmail: function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validatePhone: function(phone) {
    // Basic validation that requires at least 10 digits
    // This can be adjusted based on your specific requirements
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  },
  
  /**
   * Announce a message to screen readers
   * @param {string} message - Message to announce
   */
  announceToScreenReaders: function(message) {
    // Find or create the live region
    let announcer = document.getElementById('a11y-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    
    // Update the announcer with the message
    announcer.textContent = message;
  },
  
  /**
   * Get the root path based on the current page location
   * @returns {string} The root path for loading templates
   */
  getRootPath: function() {
    // Check if we're in a subdirectory
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
      return '../';
    }
    return './';
  },
  
  /**
   * Utility function for logging messages
   * @param {string} message - Message to log
   * @param {string} level - Log level (info, warn, error)
   * @param {object} data - Optional data to log
   */
  log: function(message, level = 'info', data = null) {
    if (!this.config.debug) return;
    
    const prefix = '🔵 ModalSystem:';
    
    switch (level) {
      case 'warn':
        console.warn(`${prefix} ${message}`, data || '');
        break;
      case 'error':
        console.error(`${prefix} ${message}`, data || '');
        break;
      default:
        console.log(`${prefix} ${message}`, data || '');
        break;
    }
  }
};

// Make the getRootPath function available globally for other modules to use
window.utilityFunctions = window.utilityFunctions || {};
window.utilityFunctions.getRootPath = ModalSystem.getRootPath;

// Initialize the modal system
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the modal system
  ModalSystem.init();
});
