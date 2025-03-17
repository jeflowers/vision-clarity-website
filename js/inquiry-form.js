/**
 * Vision Clarity Institute - Service Inquiry Form Functionality
 * Handles validation and submission of the service inquiry form.
 */

document.addEventListener('DOMContentLoaded', function() {
    const inquiryForm = document.getElementById('service-inquiry-form');
    
    if (!inquiryForm) return;
    
    // Add success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = '<p><strong>Thank you for your inquiry!</strong></p><p>We have received your message and will respond within 24 hours to the contact method you specified.</p>';
    inquiryForm.insertBefore(successMessage, inquiryForm.firstChild);
    
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
    
    // Add validation for individual required fields
    const requiredFields = inquiryForm.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
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
    
    // Handle form submission
    inquiryForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate all required fields
        let isValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Focus on the first invalid field
            inquiryForm.querySelector(':invalid').focus();
            return;
        }
        
        // Collect form data
        const formData = {
            name: document.getElementById('inquiry-name').value,
            email: document.getElementById('inquiry-email').value,
            phone: document.getElementById('inquiry-phone').value,
            service: document.getElementById('inquiry-service').value,
            message: document.getElementById('inquiry-message').value,
            contactPreference: document.querySelector('input[name="contact-preference"]:checked').value,
            consent: document.getElementById('inquiry-consent').checked
        };
        
        // Log form data (in production, you would send this to a server)
        console.log('Inquiry form submitted:', formData);
        
        // Show success message
        successMessage.classList.add('visible');
        
        // Disable form fields during submission
        const formFields = inquiryForm.querySelectorAll('input, select, textarea, button');
        formFields.forEach(field => {
            field.disabled = true;
        });
        
        // Announce to screen readers
        const ariaLive = document.createElement('div');
        ariaLive.setAttribute('aria-live', 'assertive');
        ariaLive.className = 'sr-only';
        ariaLive.textContent = 'Your inquiry has been successfully submitted. We will respond within 24 hours.';
        document.body.appendChild(ariaLive);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // In a real implementation, you would send the form data to a server here
        // For demonstration purposes, we'll simulate a form reset after a delay
        setTimeout(function() {
            // Reset the form
            inquiryForm.reset();
            
            // Re-enable form fields
            formFields.forEach(field => {
                field.disabled = false;
            });
            
            // Remove success message
            successMessage.classList.remove('visible');
            
            // Remove aria-live element
            if (ariaLive && ariaLive.parentNode) {
                ariaLive.parentNode.removeChild(ariaLive);
            }
        }, 5000); // Reset form after 5 seconds for demo purposes
    });
    
    // Add internationalization support
    document.addEventListener('languageChanged', function(event) {
        // Update any dynamic elements in the form based on language change
        // This would typically involve updating the success message and error messages
        // based on translations provided by the i18n system
    });
});
