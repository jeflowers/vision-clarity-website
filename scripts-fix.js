/**
 * Change website language
 * @param {string} lang - Language code (en, es, zh, ko, hy)
 */
function changeLanguage(lang) {
    console.log(`Changing language to: ${lang}`);
    
    // Store the selected language in localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // FIXED: Use correct path to translation files
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