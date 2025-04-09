/**
 * Vision Clarity Institute - Modal System
 * Implements modal windows for consultation and service inquiry forms
 */

/** Start modal existance check ###################################################### **/
// Check if modals exist, and if not, load them
function ensureModalsExist() {
    if (!document.getElementById('consultationModal') || !document.getElementById('inquiryModal')) {
        console.log('Modals not found in DOM, attempting to load...');
        
        // Create container for modals if needed
        let modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);
        }
        
        // Determine the root path based on current page
        const rootPath = window.location.pathname.includes('/pages/') ? '../' : './';
        
        // Load consultation modal
        fetch(`${rootPath}pages/templates/consultation-modal.html`)
            .then(response => response.text())
            .then(html => {
                modalContainer.innerHTML += html;
                console.log('Consultation modal loaded');
            })
            .catch(error => console.error('Error loading consultation modal:', error));
            
        // Load inquiry modal
        fetch(`${rootPath}pages/templates/inquiry-modal.html`)
            .then(response => response.text())
            .then(html => {
                modalContainer.innerHTML += html;
                console.log('Inquiry modal loaded');
            })
            .catch(error => console.error('Error loading inquiry modal:', error));
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', ensureModalsExist);
/** End modal existance check ###################################################### **/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal triggers
    const modalButtons = document.querySelectorAll('.open-modal');
    modalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Check for data-modal-type first, then fall back to data-form-type
            const modalType = this.getAttribute('data-modal-type') || this.getAttribute('data-form-type');
            openModal(modalType);
        });
    });

    // Initialize close buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    // Close when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.active');
            openModals.forEach(modal => closeModal(modal));
        }
    });

    // Convert existing contact links to modal triggers
    convertContactLinksToModalTriggers();
});

/**
 * Open a specific modal
 * @param {string} modalType - consultation or inquiry
 */
function openModal(modalType) {
    let modal;
    
    if (modalType === 'consultation') {
        modal = document.getElementById('consultationModal');
    } else if (modalType === 'inquiry') {
        modal = document.getElementById('inquiryModal');
    }

    if (modal) {
        // Show modal
        modal.style.display = 'block';
        
        // Add active class for animation (after brief delay for the display change to take effect)
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Prevent body scrolling
        document.body.classList.add('modal-open');
        
        // Set focus to first form field
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

/**
 * Close a modal
 * @param {HTMLElement} modal - The modal to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    // Remove active class first (triggers transition)
    modal.classList.remove('active');
    
    // After transition completes, hide the modal
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }, 300);
}

/**
 * Form submission handling
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Simple validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = form.id === 'consultationForm' 
            ? 'Thank you! Your consultation request has been received. We will contact you shortly.'
            : 'Thank you for your inquiry. Our team will respond to your questions soon.';
        
        form.prepend(successMsg);
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            
            // Close modal after showing success message
            setTimeout(() => {
                closeModal(form.closest('.modal'));
                
                // Remove success message after modal closes
                successMsg.remove();
            }, 2000);
        }, 1000);
    }
}

/**
 * Convert existing contact page links to modal triggers
 */
function convertContactLinksToModalTriggers() {
    // Find contact links that should trigger modals
    document.querySelectorAll('a[href*="contact.html"]').forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip if explicitly marked to not convert
        if (link.classList.contains('no-modal')) return;
        
        // Determine modal type based on URL
        let modalType = 'consultation';
        if (href.includes('inquiry=true') || href.includes('inquiry')) {
            modalType = 'inquiry';
        }
        
        // Replace link behavior
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(modalType);
        });
        
        // Add attributes for clarity
        link.setAttribute('data-modal-type', modalType);
        link.setAttribute('role', 'button');
    });
}

// Initialize form handlers once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const consultationForm = document.getElementById('consultationForm');
    const inquiryForm = document.getElementById('inquiryForm');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleFormSubmit);
    }
});
