/**
 * Vision Clarity Institute - Consultation Popup Module
 * Handles the consultation scheduling modal functionality.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('consultationModal');
    const modalContent = modal.querySelector('.popup-modal');
    const openButtons = document.querySelectorAll('#scheduleConsultationBtn, .consultation-trigger');
    const closeButton = modal.querySelector('.close-popup');
    const form = document.getElementById('consultation-form');
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('preferred-date').min = minDate;
    
    // Initialize accessibility attributes
    modalContent.setAttribute('role', 'dialog');
    modalContent.setAttribute('aria-labelledby', 'consultation-form-title');
    modalContent.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    
    // Functions
    function openModal() {
        modal.classList.add('active', 'fade-in');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus the first form field
        setTimeout(() => {
            document.getElementById('full-name').focus();
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
    
    function handleSubmit(event) {
        event.preventDefault();
        
        // Simple validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (isValid) {
            // Here you would typically send the data to the server
            // For demonstration purposes, we'll just show a success message
            
            // Create a success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <h3>Thank you!</h3>
                <p>Your consultation request has been submitted. One of our patient coordinators will contact you shortly to confirm your appointment.</p>
                <button class="btn btn-primary">Close</button>
            `;
            
            // Replace form with success message
            form.style.display = 'none';
            modalContent.appendChild(successMessage);
            
            // Add click handler to close button
            successMessage.querySelector('button').addEventListener('click', function() {
                closeModal();
                
                // Reset and show the form after modal is closed
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successMessage.remove();
                }, 300);
            });
        }
    }
    
    // Event Listeners
    openButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            openModal();
        });
    });
    
    closeButton.addEventListener('click', closeModal);
    
    // Close when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Field validation
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        field.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
});
