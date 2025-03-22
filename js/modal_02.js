/**
 * Vision Clarity Institute - Modal Form Handler
 * This module handles the display and interaction with the consultation and inquiry modals.
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
    
    // Initialize by loading the modals
    this.loadModals();
  }
  
  /**
   * Load modal HTML components
   */
  async loadModals() {
    try {
      // Determine the root path based on the current page
      const rootPath = window.location.pathname.includes('/pages/') ? '../' : '';
      
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
      
      // Initialize event listeners
      this.initEventListeners();
      
      // Set flag indicating modals are loaded
      this.modalsLoaded = true;
      
      // Check if modals should be shown based on URL parameters
      this.checkQueryParameters();
      
      console.log('Modals loaded successfully');
    } catch (error) {
      console.error('Error loading modal components:', error);
    }
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Modal trigger buttons
    const modalTriggers = document.querySelectorAll('.open-modal');
    modalTriggers.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior if it's an anchor
        const formType = button.getAttribute('data-form-type');
        this.openModal(formType);
      });
    });
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
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
      this.consultationForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
    
    if (this.inquiryForm) {
      this.inquiryForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    }
    
    // Handle escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeAllModals();
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
    // If modals aren't loaded yet, wait and try again
    if (!this.modalsLoaded) {
      setTimeout(() => {
        this.openModal(formType);
      }, 500);
      return;
    }
    
    // Save the last focused element for accessibility
    this.lastFocusedElement = document.activeElement;
    
    if (formType === 'consultation' && this.consultationModal) {
      this.consultationModal.style.display = 'block';
      this.announceModalOpen('consultation');
      document.body.classList.add('modal-open');
      this.trapFocus(this.consultationModal);
    } else if (formType === 'inquiry' && this.inquiryModal) {
      this.inquiryModal.style.display = 'block';
      this.announceModalOpen('inquiry');
      document.body.classList.add('modal-open');
      this.trapFocus(this.inquiryModal);
    }
  }
  
  /**
   * Close a specific modal
   * @param {HTMLElement} modal - Modal element to close
   */
  closeModal(modal) {
    if (modal) {
      modal.style.display = 'none';
      this.announceModalClose();
      document.body.classList.remove('modal-open');
      
      // Restore focus to the element that was focused before the modal was opened
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
      }
    }
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
    // You might want to use a more robust validation depending on your requirements
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
   * Handle form submission
   * @param {Event} event - Form submission event
   */
  handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formId = form.id;
    
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
    
    console.log(`Form submission from ${formId}:`, formObject);
    
    // In a real implementation, you would send this data to your backend
    // For example:
    /*
    fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formObject)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.showFormSuccess(formId);
      } else {
        this.showFormError(formId, data.message);
      }
    })
    .catch(error => {
      this.showFormError(formId, "Something went wrong. Please try again.");
    });
    */
    
    // For now, we'll simulate a successful submission
    this.showFormSuccess(formId);
    
    // Close the modal after a delay
    setTimeout(() => {
      this.closeAllModals();
      form.reset();
    }, 3000);
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
      form.appendChild(successMessage);
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
  
  /**
   * Show form error message
   * @param {string} formId - ID of the form
   * @param {string} message - Error message to display
   */
  showFormError(formId, message) {
    const form = document.getElementById(formId);
    
    if (!form) return;
    
    // Create error message if it doesn't exist
    let errorMessage = form.querySelector('.form-error');
    
    if (!errorMessage) {
      errorMessage = document.createElement('div');
      errorMessage.className = 'form-error';
      form.appendChild(errorMessage);
    }
    
    // Set message text
    errorMessage.textContent = message;
    
    // Make sure error message is visible
    errorMessage.style.display = 'block';
    
    // Announce error to screen readers
    const liveRegion = document.getElementById('a11y-announcer');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }
}

// Initialize the modal manager when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.modalManager = new ModalManager();
});
