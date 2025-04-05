/**
 * Vision Clarity Institute - Flag-based Language Selector
 * Adds flag indicator to language selectors and handles localization
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeFlagLanguageSelectors();
});

/**
 * Initialize flag-based language selectors
 */
function initializeFlagLanguageSelectors() {
    // Find all flag-enabled language selectors
    const selectors = document.querySelectorAll('.flag-enabled');
    
    selectors.forEach(selector => {
        // Set initial flag based on selected option
        updateFlag(selector);
        
        // Update flag when selection changes
        selector.addEventListener('change', function() {
            updateFlag(this);
            
            // Get the selected language
            const language = this.value;
            
            // Check if this is the header language selector
            if (this.id === 'header_preferred_language') {
                // Change site language if i18n is available
                if (window.i18n && typeof window.i18n.changeLanguage === 'function') {
                    window.i18n.changeLanguage(language);
                }
                
                // Sync all other language selectors
                syncLanguageSelectors(language);
            }
        });
    });
    
    // Set initial language based on saved preference or browser language
    setInitialLanguage();
}

/**
 * Update the flag display for a language selector
 * @param {HTMLElement} selector - The language selector element
 */
function updateFlag(selector) {
    const selectedOption = selector.options[selector.selectedIndex];
    const flag = selectedOption.getAttribute('data-flag');
    
    if (!flag) return;
    
    // Find the flag display element
    const flagDisplay = selector.parentNode.querySelector('.flag-display');
    if (flagDisplay) {
        flagDisplay.textContent = flag;
    } else {
        // Create flag display if it doesn't exist
        const newFlagDisplay = document.createElement('span');
        newFlagDisplay.className = 'flag-display';
        newFlagDisplay.setAttribute('aria-hidden', 'true');
        newFlagDisplay.textContent = flag;
        
        // Add appropriate class based on context
        if (selector.classList.contains('header-language-select')) {
            newFlagDisplay.classList.add('header-flag-display');
        } else if (selector.classList.contains('form-language-select')) {
            newFlagDisplay.classList.add('form-flag-display');
        }
        
        // Add to wrapper
        selector.parentNode.appendChild(newFlagDisplay);
    }
}

/**
 * Sync language selection across all selectors
 * @param {string} language - The language code to set
 */
function syncLanguageSelectors(language) {
    const selectors = document.querySelectorAll('.flag-enabled');
    
    selectors.forEach(selector => {
        if (selector.value !== language) {
            // Set the value
            selector.value = language;
            
            // Update the flag
            updateFlag(selector);
        }
    });
}

/**
 * Set initial language based on saved preference or browser language
 */
function setInitialLanguage() {
    // Try to get saved language preference
    let language = localStorage.getItem('vci-language');
    
    // If no saved preference, try to get browser language
    if (!language) {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            // Extract the language code (e.g., 'en' from 'en-US')
            language = browserLang.split('-')[0];
        }
    }
    
    // Default to English if no language found or if language is not supported
    if (!language) {
        language = 'en';
    }
    
    // Get the header language selector
    const headerSelector = document.getElementById('header_preferred_language');
    
    // Check if the language is supported
    if (headerSelector) {
        // Check if the language is in the options
        let languageSupported = false;
        for (let i = 0; i < headerSelector.options.length; i++) {
            if (headerSelector.options[i].value === language) {
                languageSupported = true;
                break;
            }
        }
        
        // Set the language if supported
        if (languageSupported) {
            headerSelector.value = language;
            updateFlag(headerSelector);
            syncLanguageSelectors(language);
        }
    }
}

// Add global access
window.flagLanguageSelector = {
    update: updateFlag,
    sync: syncLanguageSelectors,
    initialize: initializeFlagLanguageSelectors
};
