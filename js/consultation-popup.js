/**
 * Vision Clarity Institute - Consultation Popup
 * Handles the free consultation modal popup functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('consultation-modal');
    const openBtn = document.getElementById('consultation-btn');
    const closeBtn = document.querySelector('.close-popup');
    const form = document.getElementById('consultation-form-popup');
    
    // Store original form HTML for reset functionality
    const consultationFormOriginalHTML = form ? form.innerHTML : '';
    window.consultationFormTemplate = consultationFormOriginalHTML;

    // Open modal function
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        
        // Focus on first input field for accessibility
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 50);
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event listeners
    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Validate form fields
    function validateField(field) {
        if (field.validity.valid) {
            // Clear any existing error message
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
            return true;
        } else {
            // Display error message
            let errorMessage = '';
            if (field.validity.valueMissing) {
                errorMessage = 'This field is required';
            } else if (field.validity.typeMismatch) {
                if (field.type === 'email') {
                    errorMessage = 'Please enter a valid email address';
                } else if (field.type === 'tel') {
                    errorMessage = 'Please enter a valid phone number';
                }
            }
            
            // Add error message if not already present
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
            
            return false;
        }
    }

    // Handle form submission
    if (form) {
        // Add validation for individual fields
        const formFields = form.querySelectorAll('input[required], select[required]');
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(field);
            });
            
            field.addEventListener('input', function() {
                if (field.validity.valid) {
                    // Remove error when user fixes the issue
                    const errorElement = field.parentNode.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate all fields
            let isValid = true;
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                // Focus on the first invalid field
                form.querySelector(':invalid').focus();
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('full-name-popup').value,
                email: document.getElementById('email-popup').value,
                phone: document.getElementById('phone-popup').value,
                location: document.getElementById('location-popup').value,
                service: document.getElementById('service-popup').value,
                dateStart: document.getElementById('date-start-popup').value,
                dateEnd: document.getElementById('date-end-popup').value,
                message: document.getElementById('message-popup').value,
                consent: document.getElementById('consent-popup').checked
            };
            
            // Log form data (in a real app, you would send this to a server)
            console.log('Form submitted:', formData);
            
            // Disable form fields during submission
            formFields.forEach(field => {
                field.disabled = true;
            });
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = '<p>Thank you! Your consultation request has been submitted.</p><p>We will contact you shortly to confirm your appointment.</p>';
            
            // Replace form with success message
            form.innerHTML = '';
            form.appendChild(successMessage);
            
            // Announce to screen readers
            const ariaLive = document.createElement('div');
            ariaLive.setAttribute('aria-live', 'assertive');
            ariaLive.className = 'sr-only';
            ariaLive.textContent = 'Form submitted successfully. Thank you for your request. We will contact you shortly.';
            document.body.appendChild(ariaLive);
            
            // Close modal after delay
            setTimeout(function() {
                closeModal();
                
                // Reset form after modal is closed
                setTimeout(function() {
                    // Reset form to original state
                    form.innerHTML = window.consultationFormTemplate || consultationFormOriginalHTML;
                    
                    // Re-attach event listeners for the new form elements
                    const newFormFields = form.querySelectorAll('input[required], select[required]');
                    newFormFields.forEach(field => {
                        field.addEventListener('blur', function() {
                            validateField(field);
                        });
                        
                        field.addEventListener('input', function() {
                            if (field.validity.valid) {
                                const errorElement = field.parentNode.querySelector('.error-message');
                                if (errorElement) {
                                    errorElement.remove();
                                }
                            }
                        });
                    });
                    
                    // Re-attach submit event listener
                    form.addEventListener('submit', this);
                    
                    // Remove the aria-live element
                    if (ariaLive && ariaLive.parentNode) {
                        ariaLive.parentNode.removeChild(ariaLive);
                    }
                }, 300);
            }, 3000);
        });
    }

    // Also handle any CTA buttons throughout the site
    const ctaButtons = document.querySelectorAll('.cta-consultation');
    ctaButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });
    
    // Set min date for date pickers to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = formattedDate;
    });
    
    // Handle date range validation
    const startDate = document.getElementById('date-start-popup');
    const endDate = document.getElementById('date-end-popup');
    
    if (startDate && endDate) {
        startDate.addEventListener('change', function() {
            endDate.min = startDate.value;
            if (endDate.value && endDate.value < startDate.value) {
                endDate.value = startDate.value;
            }
        });
    }
});
