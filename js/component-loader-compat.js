/**
 * Vision Clarity Institute - Component Loader (Compatible Version)
 * This script loads header, footer, and other common components
 * Works without ES6 module support for broader compatibility
 */

// Path utilities
const PathUtils = {
  /**
   * Determine the root path based on the current page location
   * @returns {string} Root path with trailing slash
   */
  getRootPath: function() {
    // Check if we're in a subdirectory
    const path = window.location.pathname;
    
    // Extract page depth (how many directories deep from the root)
    let depth = 0;
    let pathWithoutFile = path;
    
    // Remove the file from the path (e.g., /pages/services.html -> /pages/)
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      pathWithoutFile = path.substring(0, lastSlashIndex + 1);
    }
    
    // Count directory levels
    const parts = pathWithoutFile.split('/').filter(part => part.length > 0);
    depth = parts.length;
    
    // Special case: if we're viewing through GitHub Pages with repo name in the path
    const isGitHubPages = path.includes('/vision-clarity-website/');
    if (isGitHubPages) {
      // Return path to root including the repo name
      return path.substring(0, path.indexOf('/vision-clarity-website/') + '/vision-clarity-website/'.length);
    }
    
    // Generate the appropriate root path
    if (depth === 0) {
      return './'; // We're at the root
    } else {
      // Go up 'depth' levels
      return '../'.repeat(depth);
    }
  },
  
  /**
   * Load a component into a target element
   * @param {string} componentPath - Path to the component HTML file
   * @param {string|HTMLElement} targetSelector - CSS selector or element to load the component into
   * @param {Function} callback - Optional callback function after loading
   */
  loadComponent: function(componentPath, targetSelector, callback) {
    // Determine the root path
    const rootPath = this.getRootPath();
    
    // Get the target element
    const targetElement = typeof targetSelector === 'string' 
      ? document.querySelector(targetSelector) 
      : targetSelector;
    
    if (!targetElement) {
      console.error(`Target element not found: ${targetSelector}`);
      return;
    }
    
    // Create XMLHttpRequest (for IE compatibility)
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Replace {{rootPath}} placeholder with the actual root path
          const processedHtml = xhr.responseText.replace(/\\{\\{rootPath\\}\\}/g, rootPath);
          
          // Insert the component into the target element
          targetElement.innerHTML = processedHtml;
          
          // Call the callback function if provided
          if (callback && typeof callback === 'function') {
            callback(targetElement);
          }
          
          // Dispatch a custom event for other scripts to react to
          const event = document.createEvent('CustomEvent');
          event.initCustomEvent('componentLoaded', true, true, {
            component: componentPath,
            target: targetElement
          });
          document.dispatchEvent(event);
        } else {
          console.error('Error loading component:', xhr.statusText);
        }
      }
    };
    
    xhr.open('GET', rootPath + componentPath, true);
    xhr.send();
  },
  
  /**
   * Highlight the current page in the navigation menu
   */
  highlightCurrentNav: function() {
    // Get the current page path
    const currentPath = window.location.pathname;
    
    // Check for GitHub Pages URL structure
    const isGitHubPages = currentPath.includes('/vision-clarity-website/');
    
    // Determine which navigation item should be active
    let activeNavId = 'home'; // Default to home
    
    // Handle both local and GitHub Pages URL structures
    if (currentPath.includes('/services.html') || (isGitHubPages && currentPath.includes('/pages/services.html'))) {
      activeNavId = 'services';
    } else if (currentPath.includes('/technology.html') || (isGitHubPages && currentPath.includes('/pages/technology.html'))) {
      activeNavId = 'technology';
    } else if (currentPath.includes('/staff.html') || (isGitHubPages && currentPath.includes('/pages/staff.html'))) {
      activeNavId = 'staff';
    } else if (currentPath.includes('/locations.html') || (isGitHubPages && currentPath.includes('/pages/locations.html'))) {
      activeNavId = 'locations';
    } else if (currentPath.includes('/contact.html') || (isGitHubPages && currentPath.includes('/pages/contact.html'))) {
      activeNavId = 'contact';
    }
    
    // For debugging
    console.log('Current path:', currentPath);
    console.log('Active nav ID:', activeNavId);
    
    // Find all navigation items
    const navItems = document.querySelectorAll('[data-nav-id]');
    
    // Remove active class from all items
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove('active');
    }
    
    // Add active class to the current page's nav item
    const activeItem = document.querySelector(`[data-nav-id="${activeNavId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      console.log('Active item found and highlighted:', activeItem);
    } else {
      console.error('No navigation item found with ID:', activeNavId);
    }
  }
};

// Component Loader
const ComponentLoader = {
  // Components to load
  components: [
    { path: 'components/header.html', target: 'header', loaded: false },
    { path: 'components/footer.html', target: 'footer', loaded: false }
  ],
  
  /**
   * Initialize the component loader
   */
  init: function() {
    // Keep track of loaded components
    this.loadedCount = 0;
    
    // Load components when the DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.loadAllComponents.bind(this));
    } else {
      this.loadAllComponents();
    }
    
    // Set up component loaded event listener
    document.addEventListener('componentLoaded', this.handleComponentLoaded.bind(this));
  },
  
  /**
   * Handle component loaded event
   * @param {Event} event - Custom event
   */
  handleComponentLoaded: function(event) {
    this.loadedCount++;
    
    // Check if all components are loaded
    if (this.loadedCount === this.components.length) {
      this.postLoadProcessing();
    }
  },
  
  /**
   * Load all registered components
   */
  loadAllComponents: function() {
    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];
      PathUtils.loadComponent(component.path, component.target);
    }
  },
  
  /**
   * Process after all components are loaded
   */
  postLoadProcessing: function() {
    // Highlight the current page in the navigation
    PathUtils.highlightCurrentNav();
    
    // Apply i18n translations if available
    if (window.i18n && typeof window.i18n.applyTranslations === 'function') {
      window.i18n.applyTranslations();
    }
    
    // Load language selector if not already loaded
    if (!document.querySelector('#language-select')) {
      this.loadLanguageSelector();
    }
    
    // Dispatch event that all components have loaded
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('allComponentsLoaded', true, true, {});
    document.dispatchEvent(event);
  },
  
  /**
   * Load the language selector
   */
  loadLanguageSelector: function() {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
      PathUtils.loadComponent('components/language-selector.html', headerActions, function(element) {
        // Move the loaded language selector to be the first child
        const languageSelector = element.querySelector('.language-selector');
        if (languageSelector && element.firstChild !== languageSelector) {
          element.insertBefore(languageSelector, element.firstChild);
        }
      });
    }
  }
};

// Initialize the component loader
document.addEventListener('DOMContentLoaded', function() {
  ComponentLoader.init();
});

// Make utilities available globally
window.PathUtils = PathUtils;
window.ComponentLoader = ComponentLoader;