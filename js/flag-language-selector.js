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
                
                // Save language preference to localStorage
                localStorage.setItem('vci-language', language);
                
                // Sync all other language selectors
                syncLanguageSelectors(language);
            }
        });
        
        // Add tooltip hover behavior
        setupTooltipBehavior(selector);
    });
    
    // Set initial language based on saved preference or browser language
    setInitialLanguage();
}

/**
 * Set up tooltip hover behavior
 * @param {HTMLElement} selector - The language selector element
 */
function setupTooltipBehavior(selector) {
    const wrapper = selector.closest('.flag-select-wrapper');
    if (!wrapper) return;
    
    // Find the tooltip/description element
    const tooltipContainer = wrapper.nextElementSibling;
    if (!tooltipContainer || !tooltipContainer.classList.contains('language-tooltip-container')) return;
    
    const tooltip = tooltipContainer.querySelector('.field-description');
    if (!tooltip) return;
    
    // Hide tooltip by default
    tooltip.style.display = 'none';
    
    // Show tooltip on hover
    wrapper.addEventListener('mouseenter', function() {
        tooltip.style.display = 'block';
    });
    
    wrapper.addEventListener('mouseleave', function() {
        tooltip.style.display = 'none';
    });
    
    // Hide tooltip when clicking outside
    document.addEventListener('click', function(event) {
        if (!wrapper.contains(event.target)) {
            tooltip.style.display = 'none';
        }
    });
    
    // Show/hide tooltip on focus/blur for accessibility
    selector.addEventListener('focus', function() {
        tooltip.style.display = 'block';
    });
    
    selector.addEventListener('blur', function() {
        // Delay hiding to allow for click events
        setTimeout(() => {
            tooltip.style.display = 'none';
        }, 200);
    });
    
    // On mobile, show/hide on click
    wrapper.addEventListener('touchstart', function() {
        const isVisible = tooltip.style.display === 'block';
        tooltip.style.display = isVisible ? 'none' : 'block';
    });
}

/**
 * Update the flag display for a language selector
 * @param {HTMLElement} selector - The language selector element
 */
function updateFlag(selector) {
    if (!selector || !selector.options || selector.selectedIndex === undefined) {
        console.error('Invalid selector passed to updateFlag');
        return;
    }
    
    const selectedOption = selector.options[selector.selectedIndex];
    if (!selectedOption) {
        console.error('No selected option found');
        return;
    }
    
    const flag = selectedOption.getAttribute('data-flag');
    
    if (!flag) {
        console.warn('No flag data found for selected option');
        return;
    }
    
    // Find the flag display element
    let flagDisplay = selector.parentNode.querySelector('.flag-display');
    
    if (flagDisplay) {
        // Update existing flag display
        flagDisplay.textContent = flag;
    } else {
        // Create flag display if it doesn't exist
        flagDisplay = document.createElement('span');
        flagDisplay.className = 'flag-display';
        flagDisplay.setAttribute('aria-hidden', 'true');
        
        // Add appropriate class based on context
        if (selector.classList.contains('header-language-select') || selector.id === 'header_preferred_language') {
            flagDisplay.classList.add('header-flag-display');
        } else if (selector.classList.contains('form-language-select')) {
            flagDisplay.classList.add('form-flag-display');
        }
        
        flagDisplay.textContent = flag;
        
        // Add to wrapper
        selector.parentNode.appendChild(flagDisplay);
    }
    
    // Update direction attribute for RTL languages
    if (['ar', 'he', 'fa'].includes(selector.value)) {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
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
            
            // Update RTL/LTR direction
            if (['ar', 'he', 'fa'].includes(language)) {
                document.documentElement.setAttribute('dir', 'rtl');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
            }
        }
    }
}

// Add global access
window.flagLanguageSelector = {
    update: updateFlag,
    sync: syncLanguageSelectors,
    initialize: initializeFlagLanguageSelectors
};
