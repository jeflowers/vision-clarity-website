/**
 * Vision Clarity Institute - Modal Form Handler
 * Handles the consultation and inquiry modal forms.
 * Dynamically loads the modal template HTML from a separate file.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine the correct path to the template based on current page location
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    const templatePath = isInPagesDirectory ? 
                         '../templates/modal-template.html' : 
                         'pages/templates/modal-template.html';
    
    fetch(templatePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load modal template');
            }
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            initializeModal(); // Initialize after loading
        })
        .catch(error => {
            console.error('Error loading modal template:', error);
        });
});

/**
 * Initialize modal functionality after the template has been loaded
 */
function initializeModal() {
    // Modal opening and configuration
    const openModalButtons = document.querySelectorAll('.open-modal');
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('service-form');
    const modalSubmitButton = document.querySelector('.modal-submit-button');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Modal Translations
    const modalTranslations = {
        'consultation': {
            'title': 'Schedule a Consultation',
            'submitButton': 'Schedule Consultation'
        },
        'inquiry': {
            'title': 'Service Inquiry',
            'submitButton': 'Submit Inquiry'
        }
    };
    
    // Skip if modal couldn't be loaded
    if (!modal) {
        console.warn('Modal template not found or failed to load.');
        return;
    }
    
    // Open Modal with Configuration
    openModalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determine form type from button data attribute
            const formType = this.getAttribute('data-form-type') || 'consultation';
            
            // Configure modal based on type
            configureModal(formType);
            
            // Show modal
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            // Set focus to first form field for accessibility
            setTimeout(() => {
                const firstInput = modal.querySelector('input, select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 100);
            
            // Announce modal opened for screen readers
            announceForScreenReaders('Dialog opened');
        });
    });
    
    // Configure modal for specific form type
    function configureModal(formType) {
        // Set form type attribute
        modalForm.setAttribute('data-form-type', formType);
        
        // Update title and submit button text based on form type
        if (window.i18n && typeof window.i18n.getTranslation === 'function') {
            // If i18n module is available, use it
            modalTitle.textContent = window.i18n.getTranslation(`modals.${formType}.title`);
            modalSubmitButton.textContent = window.i18n.getTranslation(`modals.form.submit_${formType}`);
        } else {
            // Fallback to our basic translations
            modalTitle.textContent = modalTranslations[formType].title;
            modalSubmitButton.textContent = modalTranslations[formType].submitButton;
        }
        
        // Clear previous form values
        modalForm.reset();
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Announce modal closed for screen readers
        announceForScreenReaders('Dialog closed');
    }
    
    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close modal when Escape key is pressed (accessibility)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Trap focus in modal for accessibility
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && modal.classList.contains('active')) {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    // Form submission
    modalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formType = this.getAttribute('data-form-type');
        
        // Here you would typically send the data to your server
        // For demonstration, we'll just log it and show a success message
        console.log('Form submitted:', formType, Object.fromEntries(formData));
        
        // Show success message (could be enhanced with a proper notification system)
        let successMessage;
        if (formType === 'consultation') {
            successMessage = 'Thank you! Your consultation request has been submitted. We will contact you shortly to confirm your appointment.';
        } else {
            successMessage = 'Thank you for your inquiry. A member of our team will respond to your questions within 24 hours.';
        }
        
        // Create success message element
        const successElement = document.createElement('div');
        successElement.className = 'form-success';
        successElement.textContent = successMessage;
        
        // Replace form with success message
        this.style.display = 'none';
        this.parentNode.appendChild(successElement);
        
        // Close modal after delay
        setTimeout(() => {
            closeModal();
            
            // Reset form display after modal is closed
            setTimeout(() => {
                this.style.display = 'block';
                if (successElement.parentNode) {
                    successElement.parentNode.removeChild(successElement);
                }
            }, 300);
        }, 3000);
    });
    
    // Helper function for screen reader announcements
    function announceForScreenReaders(message) {
        let announcer = document.getElementById('a11y-announcer');
        
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = message;
    }
}
