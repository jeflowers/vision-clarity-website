/**
 * Vision Clarity Institute - Component Loader
 * This script loads header, footer, and other common components
 */

const ComponentLoader = {
  // Components to load
  components: [
    { path: 'components/header.html', target: 'header', loaded: false },
    { path: 'components/footer.html', target: 'footer', loaded: false }
  ],
  
  // Initialize the component loader
  init: function() {
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
  },
  
  // Load all registered components
  loadAllComponents: function() {
    this.components.forEach(component => {
      const { path, target } = component;
      this.loadComponent(path, target);
    });
  },
  
  // Load a component
  loadComponent: function(componentPath, targetSelector) {
    const targetElement = typeof targetSelector === 'string' 
      ? document.querySelector(targetSelector) 
      : targetSelector;
    
    if (!targetElement) {
      console.error(`Target element not found: ${targetSelector}`);
      return;
    }
    
    // Determine the root path
    const rootPath = this.getRootPath();
    
    // Fetch the component
    fetch(rootPath + componentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load component: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        // Replace {{rootPath}} with actual path
        const processedHtml = html.replace(/\{\{rootPath\}\}/g, rootPath);
        
        // Insert the component
        targetElement.innerHTML = processedHtml;
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('componentLoaded', {
          detail: {
            component: componentPath,
            target: targetElement
          }
        }));
        
        // Initialize header if applicable
        if (targetSelector === 'header' && window.initializeHeader) {
          window.initializeHeader();
        }
      })
      .catch(error => console.error('Error loading component:', error));
  },
  
  // Get the root path based on current page location
  getRootPath: function() {
    // Check if we're in a subdirectory
    const path = window.location.pathname;
    
    // Extract page depth
    let depth = 0;
    let pathWithoutFile = path;
    
    // Remove the file from the path
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      pathWithoutFile = path.substring(0, lastSlashIndex + 1);
    }
    
    // Count directory levels
    const parts = pathWithoutFile.split('/').filter(part => part.length > 0);
    depth = parts.length;
    
    // Generate the appropriate root path
    if (depth === 0) {
      return './'; // We're at the root
    } else {
      // Go up 'depth' levels
      return '../'.repeat(depth);
    }
  },
  
  // Process after all components are loaded
  postLoadProcessing: function() {
    // Apply i18n translations if available
    if (window.i18n && typeof window.i18n.applyTranslations === 'function') {
      window.i18n.applyTranslations();
    }
    
    // Dispatch event that all components have loaded
    document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
  }
};

// Initialize the component loader
ComponentLoader.init();
