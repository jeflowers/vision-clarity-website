/**
 * Vision Clarity Institute - Component Loader
 * This script loads header, footer, and other common components
 */

// Import PathUtils
import PathUtils from './path-utils.js';

class ComponentLoader {
  constructor() {
    // Components to load
    this.components = [
      { path: 'components/header.html', target: 'header', loaded: false },
      { path: 'components/footer.html', target: 'footer', loaded: false }
    ];
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the component loader
   */
  init() {
    // Load components when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      this.loadAllComponents();
    });
    
    // Set up component loaded event listener
    document.addEventListener('componentLoaded', (event) => {
      const { component } = event.detail;
      
      // Mark the component as loaded
      this.components.forEach(comp => {
        if (comp.path === component) {
          comp.loaded = true;
        }
      });
      
      // Check if all components are loaded
      const allLoaded = this.components.every(comp => comp.loaded);
      if (allLoaded) {
        this.postLoadProcessing();
      }
    });
  }
  
  /**
   * Load all registered components
   */
  loadAllComponents() {
    this.components.forEach(component => {
      const { path, target } = component;
      PathUtils.loadComponent(path, target);
    });
  }
  
  /**
   * Process after all components are loaded
   */
  postLoadProcessing() {
    // Highlight the current page in the navigation
    PathUtils.highlightCurrentNav();
    
    // Apply i18n translations if available
    if (window.i18n && typeof window.i18n.applyTranslations === 'function') {
      window.i18n.applyTranslations();
    }
    
    // Load language selector if not already loaded
    if (document.querySelector('#language-select')) {
      console.log('Language selector already loaded');
    } else {
      this.loadLanguageSelector();
    }
    
    // Dispatch event that all components have loaded
    document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
  }
  
  /**
   * Load the language selector
   */
  loadLanguageSelector() {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      PathUtils.loadComponent('components/language-selector.html', headerActions, (element) => {
        // Move the loaded language selector to be the first child
        const languageSelector = element.querySelector('.language-selector');
        if (languageSelector && element.firstChild !== languageSelector) {
          element.insertBefore(languageSelector, element.firstChild);
        }
      });
    }
  }
}

// Create and export an instance
const componentLoader = new ComponentLoader();
export default componentLoader;
