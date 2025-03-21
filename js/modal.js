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
    
    // Check if we have the modal in the page already (for debugging purposes)
    if (document.getElementById('service-modal')) {
        console.log('Modal already exists in the page, initializing...');
        initializeModal();
        return;
    }
    
    // Otherwise, load the modal template
    fetch(templatePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load modal template: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            console.log('Modal template loaded successfully');
            initializeModal(); // Initialize after loading
        })
        .catch(error => {
            console.error('Error loading modal template:', error);
            
            // Create a fallback modal if the template fails to load
            createFallbackModal();
        });
});

/**
 * Create a fallback modal directly in the page if template loading fails
 */
function createFallbackModal() {
    console.log('Creating fallback modal');
    const modalHTML = `
    <div id="service-modal" class="modal" aria-hidden="true">
        <div class="modal-overlay"></div>
        <div class="modal-container" role="dialog" aria-labelledby="modal-title">
            <div class="modal-header">
                <h2 id="modal-title">Schedule a Consultation</h2>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-content">
                <form id="service-form" class="modal-form" data-form-type="consultation">
                    <div class="form-field required" data-field="name">
                        <label for="modal-name">Name</label>
                        <input type="text" id="modal-name" name="name" required>
                    </div>
                    
                    <div class="form-field required" data-field="email">
                        <label for="modal-email">Email</label>
                        <input type="email" id="modal-email" name="email" required>
                    </div>
                    
                    <div class="form-field required" data-field="phone">
                        <label for="modal-phone">Phone</label>
                        <input type="tel" id="modal-phone" name="phone" required>
                    </div>
                    
                    <div class="form-field" data-field="message">
                        <label for="modal-message">Message</label>
                        <textarea id="modal-message" name="message" rows="4"></textarea>
                    </div>
                    
                    <div class="form-field required">
                        <div class="checkbox-container">
                            <input type="checkbox" id="modal-consent" name="consent" required>
                            <label for="modal-consent" class="checkbox-label">
                                I consent to Vision Clarity Institute collecting and storing the information provided above.
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary modal-submit-button">Schedule Consultation</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    initializeModal();
}

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
            'title': 'Request Information',
            'submitButton': 'Submit Inquiry'
        }
    };
    
    // Skip if modal couldn't be loaded
    if (!modal) {
        console.error('Modal template not found or failed to load, even with fallback.');
        // Convert button links to href for graceful degradation
        setupFallbackLinks();
        return;
    }
    
    console.log('Modal initialized, setting up event listeners');
    
    // Open Modal with Configuration
    openModalButtons.forEach(button => {
        // Clean up any existing event listeners to prevent duplicates
        const clone = button.cloneNode(true);
        button.parentNode.replaceChild(clone, button);
        
        clone.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Modal button clicked');
            
            // Determine form type from button data attribute
            const formType = this.getAttribute('data-form-type') || 'consultation';
            console.log('Modal type:', formType);
            
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
        console.log('Configuring modal for:', formType);
        
        // Set form type attribute
        modalForm.setAttribute('data-form-type', formType);
        
        // Update title and submit button text based on form type
        if (window.i18n && typeof window.i18n.getTranslation === 'function') {
            // If i18n module is available, use it
            modalTitle.textContent = window.i18n.getTranslation(`modals.${formType}.title`) || modalTranslations[formType].title;
            modalSubmitButton.textContent = window.i18n.getTranslation(`modals.form.submit_${formType}`) || modalTranslations[formType].submitButton;
        } else {
            // Fallback to our basic translations
            modalTitle.textContent = modalTranslations[formType].title;
            modalSubmitButton.textContent = modalTranslations[formType].submitButton;
        }
        
        // Show/hide fields based on form type
        if (formType === 'consultation') {
            // Hide inquiry-specific fields
            document.querySelectorAll('.inquiry-field').forEach(field => {
                field.style.display = 'none';
                const input = field.querySelector('select, input');
                if (input) input.required = false;
            });
            
            // Show consultation fields
            document.querySelectorAll('.consultation-field').forEach(field => {
                field.style.display = 'block';
                const input = field.querySelector('input, select');
                if (input && field.classList.contains('required')) input.required = true;
            });
        } else if (formType === 'inquiry') {
            // Show inquiry-specific fields
            document.querySelectorAll('.inquiry-field').forEach(field => {
                field.style.display = 'block';
                const input = field.querySelector('select, input');
                if (input && field.classList.contains('required')) input.required = true;
            });
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

// Fallback function if modal functionality fails completely
function setupFallbackLinks() {
    const consultationButtons = document.querySelectorAll('.open-modal[data-form-type="consultation"]');
    const inquiryButtons = document.querySelectorAll('.open-modal[data-form-type="inquiry"]');
    
    // Determine if we're in the pages directory
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    
    // Convert consultation buttons to regular links
    consultationButtons.forEach(button => {
        const link = document.createElement('a');
        link.href = isInPagesDirectory ? 'contact.html' : 'pages/contact.html';
        link.className = button.className.replace('open-modal', '');
        link.textContent = button.textContent;
        button.parentNode.replaceChild(link, button);
    });
    
    // Convert inquiry buttons to regular links
    inquiryButtons.forEach(button => {
        const link = document.createElement('a');
        link.href = isInPagesDirectory ? 'contact.html?inquiry=true' : 'pages/contact.html?inquiry=true';
        link.className = button.className.replace('open-modal', '');
        link.textContent = button.textContent;
        button.parentNode.replaceChild(link, button);
    });
    
    console.log('Modal functionality disabled - falling back to direct links');
}