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