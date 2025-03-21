/**
 * Vision Clarity Institute - Service Inquiry Modal
 * Handles the service inquiry modal functionality, form validation, and submission.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('serviceInquiryModal');
    const modalContent = modal.querySelector('.service-inquiry-content');
    const openButton = document.getElementById('serviceInquiryButton');
    const closeButton = modal.querySelector('.close-service-inquiry');
    const form = document.getElementById('serviceInquiryForm');
    const successAlert = document.getElementById('serviceInquirySuccess');
    const closeSuccessButton = successAlert.querySelector('.close-success');
    const closeSuccessBtn = successAlert.querySelector('.close-success-btn');
    
    // Initialize accessibility attributes
    modalContent.setAttribute('role', 'dialog');
    modalContent.setAttribute('aria-labelledby', 'service-inquiry-title');
    modalContent.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    
    // Functions
    function openModal() {
        modal.classList.add('active', 'fade-in');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus the first form field
        setTimeout(() => {
            document.getElementById('inquiry-name-modal').focus();
        }, 100);
        
        // Store the element that had focus before opening the modal
        modal.prevFocusElement = document.activeElement;
        
        // Trap focus inside modal
        document.addEventListener('focusin', trapFocus);
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.classList.remove('active', 'fade-in', 'fade-out');
            modal.setAttribute('aria-hidden', 'true');
            
            // Restore focus to previous element
            if (modal.prevFocusElement) {
                modal.prevFocusElement.focus();
            }
            
            // Restore background scrolling
            document.body.style.overflow = '';
        }, 300);
        
        // Remove focus trap
        document.removeEventListener('focusin', trapFocus);
    }
    
    function showSuccessAlert() {
        successAlert.classList.add('active');
        
        // Set focus to close button for accessibility
        setTimeout(() => {
            closeSuccessBtn.focus();
        }, 100);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeSuccessAlert();
        }, 5000);
    }
    
    function closeSuccessAlert() {
        successAlert.classList.remove('active');
        
        // Restore focus if modal was closed
        if (modal.getAttribute('aria-hidden') === 'true' && modal.prevFocusElement) {
            modal.prevFocusElement.focus();
        }
    }
    
    function trapFocus(event) {
        // List of all focusable elements in the modal
        const focusableElements = modalContent.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If focus is outside the modal, bring it back in
        if (!modalContent.contains(event.target)) {
            event.preventDefault();
            firstElement.focus();
        }
        
        // Handle tab key to keep focus cycling within the modal
        if (event.key === 'Tab') {
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    function validateForm() {
        // Simple validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        // Clear existing error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                field.parentNode.appendChild(errorMessage);
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message
                const errorMessage = document.createElement('span');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please enter a valid email address';
                field.parentNode.appendChild(errorMessage);
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    function isValidEmail(email) {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function handleSubmit(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Collect form data
            const formData = new FormData(form);
            const formValues = {};
            
            formData.forEach((value, key) => {
                formValues[key] = value;
            });
            
            // In a real implementation, you would send this data to a server
            console.log('Form submitted with values:', formValues);
            
            // Reset form
            form.reset();
            
            // Clear any validation styling
            const formFields = form.querySelectorAll('input, select, textarea');
            formFields.forEach(field => {
                field.classList.remove('error');
            });
            
            // Close modal and show success message
            closeModal();
            showSuccessAlert();
        }
    }
    
    // Event Listeners
    openButton.addEventListener('click', function(event) {
        event.preventDefault();
        openModal();
    });
    
    closeButton.addEventListener('click', closeModal);
    
    // Close when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close success alert when clicking close button
    closeSuccessButton.addEventListener('click', closeSuccessAlert);
    closeSuccessBtn.addEventListener('click', closeSuccessAlert);
    
    // Close success alert when clicking outside content
    successAlert.addEventListener('click', function(event) {
        if (event.target === successAlert) {
            closeSuccessAlert();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (modal.classList.contains('active')) {
                closeModal();
            }
            if (successAlert.classList.contains('active')) {
                closeSuccessAlert();
            }
        }
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Field validation on blur
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
                
                // Check if error message already exists
                let errorMessage = this.parentNode.querySelector('.error-message');
                if (!errorMessage) {
                    // Add error message
                    errorMessage = document.createElement('span');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    this.parentNode.appendChild(errorMessage);
                }
            } else if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                this.classList.add('error');
                
                // Check if error message already exists
                let errorMessage = this.parentNode.querySelector('.error-message');
                if (!errorMessage) {
                    // Add error message
                    errorMessage = document.createElement('span');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Please enter a valid email address';
                    this.parentNode.appendChild(errorMessage);
                }
            } else {
                this.classList.remove('error');
                
                // Remove error message if it exists
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
        
        field.addEventListener('focus', function() {
            // Remove error message when field is focused
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            
            this.classList.remove('error');
        });
    });
});
