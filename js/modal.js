/**
 * Vision Clarity Institute - Modal Form Handler
 * Handles the consultation and inquiry modal forms.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine the correct path based on current page location
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    const templatesPath = isInPagesDirectory ? '../templates/' : 'pages/templates/';
    
    // Load all modal templates if they don't already exist
    if (!document.getElementById('consultationModal') && !document.getElementById('inquiryModal') && !document.getElementById('messageModal')) {
        loadModalTemplates();
    } else {
        console.log('Modals already exist in the page, initializing...');
        initializeModals();
    }
    
    /**
     * Load all modal templates
     */
    function loadModalTemplates() {
        // Load consultation modal template
        fetch(`${templatesPath}consultation-modal.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load consultation modal: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                console.log('Consultation modal loaded successfully');
                
                // Load inquiry modal template after consultation modal is loaded
                return fetch(`${templatesPath}inquiry-modal.html`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load inquiry modal: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                console.log('Inquiry modal loaded successfully');
                
                // Load message modal template
                return fetch(`${templatesPath}message-modal.html`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load message modal: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                console.log('Message modal loaded successfully');
                
                // Initialize modals after all are loaded
                initializeModals();
            })
            .catch(error => {
                console.error('Error loading modal templates:', error);
                createFallbackModals();
            });
    }
    
    /**
     * Create fallback modals if template loading fails
     */
    function createFallbackModals() {
        console.log('Creating fallback modals');
        
        // Consultation modal fallback
        const consultationModalHTML = `
        <div id="consultationModal" class="modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <h2 class="modal-title">Schedule a Consultation</h2>
                
                <form id="consultationForm">
                    <div class="form-field">
                        <label for="name">Name <span class="required">*</span></label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="email">Email <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="phone">Phone <span class="required">*</span></label>
                        <input type="tel" id="phone" name="phone" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="consultation_service">Service of Interest</label>
                        <select id="consultation_service" name="service">
                            <option value="">Select a service</option>
                            <option value="traditional_lasik">Traditional LASIK</option>
                            <option value="bladeless_lasik">Custom Bladeless LASIK</option>
                            <option value="prk">PRK</option>
                            <option value="presbyopia">Presbyopia Correction</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-field">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="4"></textarea>
                    </div>
                    
                    <div class="checkbox-field">
                        <input type="checkbox" id="consent" name="consent" required>
                        <label for="consent">I consent to Vision Clarity Institute collecting and storing the information provided above.</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Schedule Consultation</button>
                    </div>
                </form>
            </div>
        </div>
        `;
        
        // Inquiry modal fallback
        const inquiryModalHTML = `
        <div id="inquiryModal" class="modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <h2 class="modal-title">Service Inquiry</h2>
                
                <form id="inquiryForm">
                    <div class="form-field">
                        <label for="inquiry_name">Name <span class="required">*</span></label>
                        <input type="text" id="inquiry_name" name="name" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="inquiry_email">Email <span class="required">*</span></label>
                        <input type="email" id="inquiry_email" name="email" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="inquiry_phone">Phone <span class="required">*</span></label>
                        <input type="tel" id="inquiry_phone" name="phone" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="inquiry_service">Service of Interest <span class="required">*</span></label>
                        <select id="inquiry_service" name="service" required>
                            <option value="">Select a service</option>
                            <option value="traditional_lasik">Traditional LASIK</option>
                            <option value="bladeless_lasik">Custom Bladeless LASIK</option>
                            <option value="prk">PRK</option>
                            <option value="presbyopia">Presbyopia Correction</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-field">
                        <label for="inquiry_message">Message</label>
                        <textarea id="inquiry_message" name="message" rows="4"></textarea>
                    </div>
                    
                    <div class="checkbox-field">
                        <input type="checkbox" id="inquiry_consent" name="consent" required>
                        <label for="inquiry_consent">I consent to Vision Clarity Institute collecting and storing the information provided above.</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Submit Inquiry</button>
                    </div>
                </form>
            </div>
        </div>
        `;
        
        // Message modal fallback
        const messageModalHTML = `
        <div id="messageModal" class="modal">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">&times;</button>
                <h2 class="modal-title">Send Us a Message</h2>
                
                <form id="messageForm">
                    <div class="form-field">
                        <label for="message_name">Name <span class="required">*</span></label>
                        <input type="text" id="message_name" name="name" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="message_email">Email <span class="required">*</span></label>
                        <input type="email" id="message_email" name="email" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="message_phone">Phone <span class="required">*</span></label>
                        <input type="tel" id="message_phone" name="phone" required>
                    </div>
                    
                    <div class="form-field">
                        <label for="message_text">Message <span class="required">*</span></label>
                        <textarea id="message_text" name="message" rows="4" required></textarea>
                    </div>
                    
                    <div class="checkbox-field">
                        <input type="checkbox" id="message_consent" name="consent" required>
                        <label for="message_consent">I consent to Vision Clarity Institute collecting and storing the information provided above.</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', consultationModalHTML);
        document.body.insertAdjacentHTML('beforeend', inquiryModalHTML);
        document.body.insertAdjacentHTML('beforeend', messageModalHTML);
        
        initializeModals();
    }
    
    /**
     * Initialize modal functionality
     */
    function initializeModals() {
        const openModalButtons = document.querySelectorAll('.open-modal');
        const consultationModal = document.getElementById('consultationModal');
        const inquiryModal = document.getElementById('inquiryModal');
        const messageModal = document.getElementById('messageModal');
        const consultationForm = document.getElementById('consultationForm');
        const inquiryForm = document.getElementById('inquiryForm');
        const messageForm = document.getElementById('messageForm');
        
        // Skip if modals couldn't be loaded
        if (!consultationModal || !inquiryModal) {
            console.error('Modal templates not found or failed to load, even with fallback.');
            setupFallbackLinks();
            return;
        }
        
        console.log('Modals initialized, setting up event listeners');
        
        // Open Modal event handlers
        openModalButtons.forEach(button => {
            // Clean up any existing event listeners to prevent duplicates
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button);
            
            clone.addEventListener('click', function(e) {
                e.preventDefault();
                const formType = this.getAttribute('data-form-type') || 'consultation';
                const serviceType = this.getAttribute('data-service') || '';
                
                if (formType === 'consultation') {
                    openModal(consultationModal, serviceType);
                } else if (formType === 'inquiry') {
                    openModal(inquiryModal, serviceType);
                } else if (formType === 'message') {
                    openModal(messageModal);
                }
            });
        });
        
        // Close modal event handlers
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                closeModal(this.closest('.modal'));
            });
        });
        
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function() {
                closeModal(this.closest('.modal'));
            });
        });
        
        // Close modal when Escape key is pressed (accessibility)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (consultationModal.classList.contains('active')) {
                    closeModal(consultationModal);
                }
                if (inquiryModal.classList.contains('active')) {
                    closeModal(inquiryModal);
                }
                if (messageModal && messageModal.classList.contains('active')) {
                    closeModal(messageModal);
                }
            }
        });
        
        // Handle form submissions
        if (consultationForm) {
            consultationForm.addEventListener('submit', handleFormSubmit);
        }
        
        if (inquiryForm) {
            inquiryForm.addEventListener('submit', handleFormSubmit);
        }
        
        if (messageForm) {
            messageForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Set up accessibility features for all modals
        setupAccessibility(consultationModal);
        setupAccessibility(inquiryModal);
        if (messageModal) {
            setupAccessibility(messageModal);
        }
    }
    
    /**
     * Open a specific modal
     * @param {HTMLElement} modal - The modal element to open
     * @param {string} serviceType - Optional service type to pre-select
     */
    function openModal(modal, serviceType = '') {
        // Close any open modals first
        document.querySelectorAll('.modal.active').forEach(openModal => {
            closeModal(openModal);
        });
        
        // Show the modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Pre-select service if specified and form field exists
        if (serviceType) {
            // For consultation form
            const consultationServiceField = modal.querySelector('#consultation_service');
            if (consultationServiceField) {
                consultationServiceField.value = serviceType;
            }
            
            // For inquiry form
            const inquiryServiceField = modal.querySelector('#inquiry_service');
            if (inquiryServiceField) {
                inquiryServiceField.value = serviceType;
            }
            
            // Universal service selector (works with both form types)
            const serviceSelector = modal.querySelector('select[name="service"]');
            if (serviceSelector) {
                serviceSelector.value = serviceType;
            }
        }
        
        // Set focus to first form field for accessibility
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        // Announce modal opened for screen readers
        announceForScreenReaders('Dialog opened');
    }
    
    /**
     * Close a specific modal
     */
    function closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable scrolling
        
        // Announce modal closed for screen readers
        announceForScreenReaders('Dialog closed');
    }
    
    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formId = this.id;
        
        // Validate form
        if (!validateForm(this)) {
            return;
        }
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', formId, Object.fromEntries(formData));
        
        // Show success message
        let successMessage;
        if (formId === 'consultationForm') {
            successMessage = 'Thank you! Your consultation request has been submitted. We will contact you shortly to confirm your appointment.';
        } else if (formId === 'inquiryForm') {
            successMessage = 'Thank you for your request. A member of our team will respond to your questions within 24 hours.';
        } else {
            successMessage = 'Thank you for your message. Our team will get back to you as soon as possible.';
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
            closeModal(this.closest('.modal'));
            
            // Reset form display after modal is closed
            setTimeout(() => {
                this.style.display = 'block';
                this.reset();
                if (successElement.parentNode) {
                    successElement.parentNode.removeChild(successElement);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * Validate form before submission
     */
    function validateForm(form) {
        let isValid = true;
        
        // Check required fields
        form.querySelectorAll('[required]').forEach(field => {
            if (field.type === 'checkbox') {
                if (!field.checked) {
                    isValid = false;
                    highlightInvalidField(field);
                } else {
                    removeInvalidHighlight(field);
                }
            } else {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightInvalidField(field);
                } else {
                    removeInvalidHighlight(field);
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Highlight invalid form field
     */
    function highlightInvalidField(field) {
        field.classList.add('invalid');
        
        // Add error message if it doesn't exist
        const parent = field.closest('.form-field') || field.parentNode;
        if (!parent.querySelector('.error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = field.validationMessage || 'This field is required';
            parent.appendChild(errorMessage);
        }
    }
    
    /**
     * Remove invalid highlight from field
     */
    function removeInvalidHighlight(field) {
        field.classList.remove('invalid');
        
        // Remove error message if it exists
        const parent = field.closest('.form-field') || field.parentNode;
        const errorMessage = parent.querySelector('.error-message');
        if (errorMessage) {
            parent.removeChild(errorMessage);
        }
    }
    
    /**
     * Setup accessibility features for a modal
     */
    function setupAccessibility(modal) {
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
    }
    
    /**
     * Helper function for screen reader announcements
     */
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
    
    /**
     * Fallback function if modal functionality fails completely
     */
    function setupFallbackLinks() {
        const consultationButtons = document.querySelectorAll('.open-modal[data-form-type="consultation"]');
        const inquiryButtons = document.querySelectorAll('.open-modal[data-form-type="inquiry"]');
        const messageButtons = document.querySelectorAll('.open-modal[data-form-type="message"]');
        
        // Determine if we're in the pages directory
        const isInPagesDirectory = window.location.pathname.includes('/pages/');
        
        // Convert consultation buttons to regular links
        consultationButtons.forEach(button => {
            const link = document.createElement('a');
            const serviceType = button.getAttribute('data-service') || '';
            link.href = isInPagesDirectory ? `contact.html${serviceType ? '?service=' + serviceType : ''}` : `pages/contact.html${serviceType ? '?service=' + serviceType : ''}`;
            link.className = button.className.replace('open-modal', '');
            link.textContent = button.textContent;
            button.parentNode.replaceChild(link, button);
        });
        
        // Convert inquiry buttons to regular links
        inquiryButtons.forEach(button => {
            const link = document.createElement('a');
            const serviceType = button.getAttribute('data-service') || '';
            link.href = isInPagesDirectory ? `contact.html?inquiry=true${serviceType ? '&service=' + serviceType : ''}` : `pages/contact.html?inquiry=true${serviceType ? '&service=' + serviceType : ''}`;
            link.className = button.className.replace('open-modal', '');
            link.textContent = button.textContent;
            button.parentNode.replaceChild(link, button);
        });
        
        // Convert message buttons to regular links
        messageButtons.forEach(button => {
            const link = document.createElement('a');
            link.href = isInPagesDirectory ? 'contact.html?message=true' : 'pages/contact.html?message=true';
            link.className = button.className.replace('open-modal', '');
            link.textContent = button.textContent;
            button.parentNode.replaceChild(link, button);
        });
        
        console.log('Modal functionality disabled - falling back to direct links');
    }
});
