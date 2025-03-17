/**
 * Get a nested value from an object using dot notation
 * @param {Object} obj - The object to extract value from
 * @param {string} path - The path in dot notation (e.g., 'global.menu.home')
 * @returns {string|null} The value at the specified path, or null if not found
 */
function getNestedValue(obj, path) {
    if (!obj || !path) return null;
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (!current[key]) return null;
        current = current[key];
    }
    
    return current;
}

/**
 * Change website language
 * @param {string} lang - Language code (en, es, zh, ko, hy)
 */
function changeLanguage(lang) {
    console.log(`Changing language to: ${lang}`);
    
    // Store the selected language in localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Use correct path to translation files
    fetch(`/locales/${lang}/translation.json`)
        .then(response => {
            console.log('Translation fetch response:', response);
            if (!response.ok) {
                throw new Error(`Failed to load translation file (${response.status})`);
            }
            return response.json();
        })
        .then(translations => {
            console.log('Translations loaded successfully', translations);
            // Apply translations to UI elements with data-i18n attributes
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const value = getNestedValue(translations, key);
                
                if (key && value) {
                    // For inputs, update placeholder if it exists
                    if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                        element.placeholder = value;
                    } 
                    // For elements with innerHTML (like buttons with icons), preserve inner HTML
                    else if (element.children.length > 0 && element.getAttribute('data-i18n-html') !== 'true') {
                        element.textContent = value;
                    } 
                    // For regular text elements
                    else {
                        element.innerHTML = value;
                    }
                }
            });
            
            // Special handling for document title
            if (translations.global && translations.global.siteName) {
                document.title = translations.global.siteName;
            }
            
            // Special handling for language selector
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = lang;
            }
            
            // Dispatch a custom event that other scripts can listen for
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        })
        .catch(error => {
            console.error('Error loading translations:', error);
        });
}

// Initialize language selection on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get language preference from localStorage or default to English
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    
    // Set the language selector to the saved preference
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        
        // Add event listener for language changes
        languageSelect.addEventListener('change', (event) => {
            changeLanguage(event.target.value);
        });
    }
    
    // Apply the saved language
    changeLanguage(savedLanguage);
});