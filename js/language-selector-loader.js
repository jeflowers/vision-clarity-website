/**
 * Vision Clarity Institute - Language Selector Loader
 * This script loads the language selector component into all pages
 */

document.addEventListener('DOMContentLoaded', function() {
  // Find the language selector container
  const languageSelectorContainer = document.querySelector('.header-actions');
  
  if (!languageSelectorContainer) {
    console.warn('Language selector container not found');
    return;
  }
  
  // Determine the root path based on the current page
  const rootPath = window.location.pathname.includes('/pages/') ? '../' : '';
  
  // Load the language selector component
  fetch(`${rootPath}components/language-selector.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load language selector component');
      }
      return response.text();
    })
    .then(html => {
      // Insert the language selector at the beginning of the header actions
      const firstChild = languageSelectorContainer.firstChild;
      
      // Create a temporary element to hold the HTML
      const tempElement = document.createElement('div');
      tempElement.innerHTML = html;
      
      // Get the language selector element
      const languageSelector = tempElement.firstChild;
      
      // Insert the language selector into the DOM
      languageSelectorContainer.insertBefore(languageSelector, firstChild);
      
      // Initialize i18n if it exists
      if (window.i18n) {
        // Update the language selector to match the current language
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
          languageSelect.value = window.i18n.currentLanguage;
        }
        
        // Apply translations to the language selector
        window.i18n.applyTranslations();
      }
    })
    .catch(error => {
      console.error('Error loading language selector:', error);
    });
});
