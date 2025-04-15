/**
 * Vision Clarity Institute - Component Loader
 * Handles dynamic loading of reusable components
 */

// Check if ComponentLoader already exists
if (!window.ComponentLoader) {
  window.ComponentLoader = {
    initialized: false,
    componentCache: {},
    
    init: function() {
      // Prevent multiple initializations
      if (this.initialized) {
        console.log('ComponentLoader already initialized');
        return;
      }
      
      this.initialized = true;
      console.log('Initializing ComponentLoader');
      
      // Load all components by default
      this.loadAllComponents();
      
      // Setup event listeners
      this.setupEventListeners();
    },
    
    setupEventListeners: function() {
      // Listen for manual component load requests
      document.addEventListener('loadComponent', (event) => {
        if (event.detail && event.detail.path) {
          this.loadComponent(event.detail.path, event.detail.target);
        }
      });
    },
    
    loadAllComponents: function() {
      // Find all component placeholders
      const containers = document.querySelectorAll('[data-component]');
      
      // Load each component
      containers.forEach(container => {
        const componentPath = container.getAttribute('data-component');
        this.loadComponent(componentPath, container);
      });
    },
    
    loadComponent: function(path, targetElement) {
      if (!path) {
        console.error('Component path is required');
        return Promise.reject('Component path is required');
      }
      
      // Determine full component path
      const rootPath = this.getRootPath();
      const fullPath = path.startsWith('/') ? path : `${rootPath}${path}`;
      
      // Return from cache if available
      if (this.componentCache[fullPath]) {
        return Promise.resolve(this.componentCache[fullPath])
          .then(content => {
            if (targetElement) {
              targetElement.innerHTML = content;
              this.postLoadProcessing(targetElement);
            }
            return content;
          });
      }
      
      // Fetch the component
      return fetch(fullPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load component: ${fullPath} (${response.status})`);
          }
          return response.text();
        })
        .then(content => {
          // Cache the component content
          this.componentCache[fullPath] = content;
          
          // Insert the component if target element provided
          if (targetElement) {
            targetElement.innerHTML = content;
            this.postLoadProcessing(targetElement);
          }
          
          // Dispatch component loaded event
          document.dispatchEvent(new CustomEvent('componentLoaded', { 
            detail: { path, element: targetElement }
          }));
          
          console.log(`Component loaded event: ${path}`);
          
          return content;
        })
        .catch(error => {
          console.error(`Error loading component ${path}:`, error);
          return Promise.reject(error);
        });
    },
    
    getRootPath: function() {
      // Same logic as in I18nManager
      if (window.location.hostname.includes('github.io')) {
        return '/vision-clarity-website/';
      }
      
      const path = window.location.pathname;
      if (path.includes('/pages/')) {
        return '../';
      }
      
      return './';
    },
    
    postLoadProcessing: function(container) {
      // Short delay to ensure translations are loaded
      setTimeout(() => {
        // Apply translations if I18nManager is available
        if (window.I18nManager && typeof window.I18nManager.applyTranslations === 'function') {
          window.I18nManager.applyTranslations();
        }
        
        // Initialize any scripts within the container
        this.initComponentScripts(container);
      }, 100); // 100ms delay
    },
    
    initComponentScripts: function(container) {
      // Find and execute any script tags in the component
      const scripts = container.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy content
        newScript.textContent = oldScript.textContent;
        
        // Replace old script with new one to execute it
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  };
} else {
  console.log('ComponentLoader already defined, using existing instance');
}

// Initialize safely
document.addEventListener('DOMContentLoaded', function() {
  if (window.ComponentLoader && typeof window.ComponentLoader.init === 'function') {
    window.ComponentLoader.init();
  }
});
