/**
 * Vision Clarity Institute - Site Integration
 * This script ensures all components work together seamlessly
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if necessary modal elements exist, add them if not
    ensureModalsExist();
    
    // Initialize internationalization if not already done
    if (window.i18n) {
        // Apply translations to current page
        window.i18n.applyTranslations();
    }
    
    // Add event listener for allComponentsLoaded event
    document.addEventListener('allComponentsLoaded', function() {
        // Initialize modals after components are loaded
        initializeModals();
    });
});

/**
 * Ensure modal templates exist in the DOM
 */
function ensureModalsExist() {
    // Check if consultation modal exists
    if (!document.getElementById('consultationModal')) {
        loadModalTemplate('consultation');
    }
    
    // Check if inquiry modal exists
    if (!document.getElementById('inquiryModal')) {
        loadModalTemplate('inquiry');
    }
}

/**
 * Load modal template from components directory
 * @param {string} modalType - Type of modal to load
 */
function loadModalTemplate(modalType) {
    // Determine root path based on current page location
    const isInPages = window.location.pathname.includes('/pages/');
    const rootPath = isInPages ? '../' : './';
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.id = `${modalType}Modal`;
    modalContainer.className = 'modal';
    document.body.appendChild(modalContainer);
    
    // Load modal content
    fetch(`${rootPath}components/${modalType}-modal.html`)
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            
            // After loading, initialize form event listeners
            const form = modalContainer.querySelector('form');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    handleFormSubmit(e);
                });
            }
        })
        .catch(error => {
            console.error(`Error loading ${modalType} modal:`, error);
        });
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
    // Make sure all modal triggers are properly set up
    if (typeof convertContactLinksToModalTriggers === 'function') {
        convertContactLinksToModalTriggers();
    }
    
    // Ensure language selectors are working in modal forms
    const languageSelectors = document.querySelectorAll('.form-language-select');
    languageSelectors.forEach(selector => {
        // Set default value to current site language
        if (window.i18n) {
            selector.value = window.i18n.currentLanguage;
        }
    });
}
