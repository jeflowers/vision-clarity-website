/**
 * Vision Clarity Institute - Unified Modal Handler
 * Consolidated modal system that handles all modal windows including consultation and inquiry forms
 */

class ModalManager {
  constructor() {
    // Modal elements - will be loaded dynamically
    this.consultationModal = null;
    this.inquiryModal = null;
    
    // Form elements
    this.consultationForm = null;
    this.inquiryForm = null;
    
    // Last focused element before modal open (for accessibility)
    this.lastFocusedElement = null;
    
    // Flag to check if modals are loaded
    this.modalsLoaded = false;
    
    // Initialize the modal system
    this.init();
  }
  
  /**
   * Initialize the modal system
   */
  init() {
    // Load modals when the DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.loadModals());
    } else {
      this.loadModals();
    }
    
    // Handle URL query parameters after modals are loaded
    document.addEventListener('modalsLoaded', () => {
      this.checkQueryParameters();
    });
  }
  
  /**
   * Load modal HTML components
   */
  async loadModals() {
    try {
      console.log('Loading modals...');
      
      // Determine the root path based on the current page
      const rootPath = this.getRootPath();
      console.log('Using root path:', rootPath);
      
      // Load consultation modal
      const consultationResponse = await fetch(`${rootPath}components/consultation-modal.html`);
      const consultationHTML = await consultationResponse.text();
      
      // Load service inquiry modal
      const inquiryResponse = await fetch(`${rootPath}components/service-inquiry-modal.html`);
      const inquiryHTML = await inquiryResponse.text();
      
      // Create container for modals if it doesn't exist
      let modalContainer = document.getElementById('modal-container');
      if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
      }
      
      // Add modals to the DOM
      modalContainer.innerHTML = consultationHTML + inquiryHTML;
      
      // Load language selector components
      await this.loadLanguageSelectors();
      
      // Create accessibility announcer if it doesn't exist
      if (!document.getElementById('a11y-announcer')) {
        const announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        document.body.appendChild(announcer);
      }
      
      // Get references to modal elements
      this.consultationModal = document.getElementById('consultationModal');
      this.inquiryModal = document.getElementById('inquiryModal');
      this.consultationForm = document.getElementById('consultationForm');
      this.inquiryForm = document.getElementById('inquiryForm');
      
      console.log('Modal elements found:', {
        consultationModal: !!this.consultationModal,
        inquiryModal: !!this.inquiryModal,
        consultationForm: !!this.consultationForm,
        inquiryForm: !!this.inquiryForm
      });
      
      // Initialize event listeners
      this.initEventListeners();
      
      // Set flag indicating modals are loaded
      this.modalsLoaded = true;
      
      // Dispatch event that modals are loaded
      document.dispatchEvent(new CustomEvent('modalsLoaded'));
      
      console.log('Modals loaded successfully');
    } catch (error) {
      console.error('Error loading modal components:', error);
    }
  }
  
  /**
   * Load language selector components into containers
   */
  async loadLanguageSelectors() {
    try {
      const rootPath = this.getRootPath();
      const containers = document.querySelectorAll('[data-component="language-selector-form"]');
      
      if (containers.length === 0) {
        console.log('No language selector containers found');
        return;
      }
      
      console.log(`Found ${containers.length} language selector containers`);
      
      // Load the language selector component
      const response = await fetch(`${rootPath}components/language-selector-form.html`);
      let languageSelectorHTML = await response.text();
      
      // Process each container
      for (const container of containers) {
        const formPrefix = container.getAttribute('data-form-prefix') || 'form';
        
        // Replace placeholders in the template
        let processedHTML = languageSelectorHTML.replace(/\{\{form_prefix\}\}/g, formPrefix);
        
        // Set the container content
        container.innerHTML = processedHTML;
      }
      
      console.log('Language selectors loaded successfully');
    } catch (error) {
      console.error('Error loading language selector components:', error);
    }
  }
  
  /**
   * Get the root path based on current page location
   * @returns {string} The root path
   */
  getRootPath() {
    // Use the shared PathResolver if available
    if (window.PathResolver && typeof window.PathResolver.getRootPath === 'function') {
      return window.PathResolver.getRootPath();
    }
    
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
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Re-scan for modal trigger buttons
    this.initModalTriggers();
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.closeAllModals();
      });
    });
    
    // Close on outside click
    if (this.consultationModal) {
      this.consultationModal.addEventListener('click', (event) => {
        if (event.target === this.consultationModal) {
          this.closeModal(this.consultationModal);
        }
      });
    }
    
    if (this.inquiryModal) {
      this.inquiryModal.addEventListener('click', (event) => {
        if (event.target === this.inquiryModal) {
          this.closeModal(this.inquiryModal);
        }
      });
    }
    
    // Handle form submissions
    if (this.consultationForm) {
      this.consultationForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    if (this.inquiryForm) {
      this.inquiryForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    // Initialize language selectors with flag display
    this.initLanguageSelectors();
    
    // Handle escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeAllModals();
      }
    });
    
    // Re-initialize modal triggers when DOM changes
    const observer = new MutationObserver(() => {
      this.initModalTriggers();
      this.initLanguageSelectors();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Initialize language selectors with flag display functionality
   */
  initLanguageSelectors() {
    const languageSelects = document.querySelectorAll('.flag-enabled');
    
    languageSelects.forEach(select => {
      // Skip if already initialized
      if (select.getAttribute('data-flag-initialized') === 'true') return;
      
      // Set initial flag display
      const flagDisplay = select.parentElement.querySelector('.flag-display');
      if (flagDisplay) {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.getAttribute('data-flag')) {
          flagDisplay.textContent = selectedOption.getAttribute('data-flag');
        }
      }
      
      // Add change event listener to update flag
      select.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption && selectedOption.getAttribute('data-flag') && flagDisplay) {
          flagDisplay.textContent = selectedOption.getAttribute('data-flag');
        }
      });
      
      // Show tooltip on focus/hover
      select.addEventListener('focus', function() {
        const tooltipId = this.getAttribute('aria-describedby');
        if (tooltipId) {
          const tooltip = document.getElementById(tooltipId);
          if (tooltip) {
            tooltip.style.display = 'block';
          }
        }
      });
      
      select.addEventListener('blur', function() {
        const tooltipId = this.getAttribute('aria-describedby');
        if (tooltipId) {
          const tooltip = document.getElementById(tooltipId);
          if (tooltip) {
            tooltip.style.display = 'none';
          }
        }
      });
      
      // Mark as initialized
      select.setAttribute('data-flag-initialized', 'true');
    });
  }
  
  /**
   * Initialize modal trigger buttons
   */
  initModalTriggers() {
    // Modal trigger buttons
    const modalTriggers = document.querySelectorAll('.open-modal');
    
    modalTriggers.forEach(button => {
      // Check if this button already has an event listener (using a data attribute flag)
      if (button.getAttribute('data-modal-listener') !== 'true') {
        button.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent default link behavior if it's an anchor
          const formType = button.getAttribute('data-form-type') || button.getAttribute('data-modal-type');
          console.log('Modal button clicked, type:', formType);
          this.openModal(formType);
        });
        
        // Mark this button as having an event listener
        button.setAttribute('data-modal-listener', 'true');
      }
    });
  }
  
  /**
   * Check URL query parameters to see if a modal should be opened
   */
  checkQueryParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('consultation')) {
      this.openModal('consultation');
    } else if (urlParams.has('inquiry')) {
      this.openModal('inquiry');
    }
  }
  
  /**
   * Open a specific modal
   * @param {string} formType - Type of form to open ('consultation' or 'inquiry')
   */
  openModal(formType) {
    console.log('Opening modal:', formType);
    
    // If modals aren't loaded yet, wait and try again
    if (!this.modalsLoaded) {
      console.log('Modals not loaded yet, waiting...');
      setTimeout(() => {
        this.openModal(formType);
      }, 500);
      return;
    }
    
    // Save the last focused element for accessibility
    this.lastFocusedElement = document.activeElement;
    
    let modal;
    
    if (formType === 'consultation' && this.consultationModal) {
      modal = this.consultationModal;
    } else if (formType === 'inquiry' && this.inquiryModal) {
      modal = this.inquiryModal;
    }
    
    if (modal) {
      console.log('Found modal to open:', modal.id);
      // Show modal
      modal.style.display = 'block';
      
      // Add active class for animation (after brief delay for the display change to take effect)
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      
      // Announce to screen readers
      this.announceModalOpen(formType);
      
      // Prevent body scrolling
      document.body.classList.add('modal-open');
      
      // Focus trap for accessibility
      this.trapFocus(modal);
    } else {
      console.warn(`Modal type '${formType}' not found. Available modals:`, 
                  this.consultationModal ? 'consultation' : 'none',
                  this.inquiryModal ? 'inquiry' : 'none');
    }
  }
  
  /**
   * Close a specific modal
   * @param {HTMLElement} modal - Modal element to close
   */
  closeModal(modal) {
    if (!modal) return;
    
    console.log('Closing modal:', modal.id);
    
    // Remove active class first (triggers transition)
    modal.classList.remove('active');
    
    // After transition completes, hide the modal
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      
      // Announce to screen readers
      this.announceModalClose();
      
      // Restore focus to the element that was focused before the modal was opened
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    }, 300);
  }
  
  /**
   * Close all modals
   */
  closeAllModals() {
    if (this.consultationModal) {
      this.closeModal(this.consultationModal);
    }
    
    if (this.inquiryModal) {
      this.closeModal(this.inquiryModal);
    }
  }
  
  /**
   * Trap focus within the modal for accessibility
   * @param {HTMLElement} modal - The modal to trap focus within
   */
  trapFocus(modal) {
    // Find all focusable elements within the modal
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      // Focus the first input or focusable element
      setTimeout(() => {
        const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
        if (firstInput) {
          firstInput.focus();
        } else {
          focusableElements[0].focus();
        }
      }, 100);
    }
  }
  
  /**
   * Announce modal open to screen readers
   * @param {string} type - Type of modal ('consultation' or 'inquiry')
   */
  announceModalOpen(type) {
    // Get the live region for announcements
    const liveRegion = document.getElementById('a11y-announcer');
    
    if (liveRegion) {
      // Use i18n translation if available
      if (window.i18n && typeof window.i18n.getTranslation === 'function') {
        liveRegion.textContent = window.i18n.getTranslation(`modal.${type}.title`) + ' dialog opened';
      } else {
        liveRegion.textContent = type === 'consultation' ? 
          'Schedule a Consultation dialog opened' : 
          'Request Information dialog opened';
      }
    }
  }
  
  /**
   * Announce modal close to screen readers
   */
  announceModalClose() {
    // Get the live region for announcements
    const liveRegion = document.getElementById('a11y-announcer');
    
    if (liveRegion) {
      liveRegion.textContent = 'Dialog closed';
    }
  }
  
  /**
   * Handle form submission
   * @param {Event} event - Form submission event
   */
  handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formId = form.id;
    
    console.log('Form submitted:', formId);
    
    // Validate form before submission
    if (!this.validateForm(form)) {
      return;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const formObject = {};
    
    for (const [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    
    console.log(`Form submission data:`, formObject);
    
    // In a real implementation, you would send this data to your backend
    // For now, we'll simulate a successful submission
    this.showFormSuccess(formId);
    
    // Close the modal after a delay
    setTimeout(() => {
      this.closeAllModals();
      form.reset();
    }, 3000);
  }
  
  /**
   * Validate form fields
   * @param {HTMLFormElement} form - The form to validate
   * @returns {boolean} True if the form is valid, false otherwise
   */
  validateForm(form) {
    // Check required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (field.type === 'checkbox' && !field.checked) {
        this.showFieldError(field, 'This checkbox is required');
        isValid = false;
      } else if (field.value.trim() === '') {
        this.showFieldError(field, 'This field is required');
        isValid = false;
      } else if (field.type === 'email' && !this.validateEmail(field.value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        isValid = false;
      } else if (field.type === 'tel' && !this.validatePhone(field.value)) {
        this.showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
      } else {
        this.clearFieldError(field);
      }
    });
    
    return isValid;
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  /**
   * Validate phone number format (basic validation)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  validatePhone(phone) {
    // This is a simple validation that requires at least 7 digits
    const re = /^[+]?[0-9\s()-]{7,}$/;
    return re.test(phone);
  }
  
  /**
   * Show error message for a field
   * @param {HTMLElement} field - The field with an error
   * @param {string} message - Error message to display
   */
  showFieldError(field, message) {
    // Remove any existing error message
    this.clearFieldError(field);
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e53935';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '4px';
    
    // Add error styles to the field
    field.style.borderColor = '#e53935';
    
    // Add error message after the field
    if (field.type === 'checkbox') {
      field.parentElement.appendChild(errorElement);
    } else {
      field.parentElement.appendChild(errorElement);
    }
  }
  
  /**
   * Clear error message for a field
   * @param {HTMLElement} field - The field to clear error for
   */
  clearFieldError(field) {
    // Remove error styles
    field.style.borderColor = '';
    
    // Remove error message
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  /**
   * Show form success message
   * @param {string} formId - ID of the form
   */
  showFormSuccess(formId) {
    const form = document.getElementById(formId);
    
    if (!form) return;
    
    // Create success message if it doesn't exist
    let successMessage = form.querySelector('.form-success');
    
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      form.prepend(successMessage);
    }
    
    // Set message text based on form type
    if (formId === 'consultationForm') {
      successMessage.textContent = 'Thank you! Your consultation request has been received. We will contact you shortly.';
      
      // Use i18n translation if available
      if (window.i18n && typeof window.i18n.getTranslation === 'function') {
        const translation = window.i18n.getTranslation('modal.consultation.success');
        if (translation) {
          successMessage.textContent = translation;
        }
      }
    } else if (formId === 'inquiryForm') {
      successMessage.textContent = 'Thank you for your inquiry. Our team will respond to your questions soon.';
      
      // Use i18n translation if available
      if (window.i18n && typeof window.i18n.getTranslation === 'function') {
        const translation = window.i18n.getTranslation('modal.inquiry.success');
        if (translation) {
          successMessage.textContent = translation;
        }
      }
    }
    
    // Make sure success message is visible
    successMessage.style.display = 'block';
    
    // Announce success to screen readers
    const liveRegion = document.getElementById('a11y-announcer');
    if (liveRegion) {
      liveRegion.textContent = successMessage.textContent;
    }
  }
}

// Initialize the modal manager when the document is loaded
let modalManager;
document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing modal manager');
  modalManager = new ModalManager();
  
  // Make modalManager available globally
  window.modalManager = modalManager;
  
  // For backward compatibility
  window.openModal = (formType) => modalManager.openModal(formType);
  window.closeModal = (modal) => modalManager.closeModal(modal);
});
