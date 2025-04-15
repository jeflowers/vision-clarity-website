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
  
  // Service components mapping
  serviceComponents: {
    'traditional': 'components/services/traditional-lasik.html',
    'custom': 'components/services/custom-bladeless-lasik.html',
    'prk': 'components/services/prk.html',
    'presbyopia': 'components/services/presbyopia-correction.html'
  },
  
  // Initialize the component loader
  init: function() {
    // Load components when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      this.loadAllComponents();
      this.initServiceComponents();
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
    fetch(`${rootPath}${componentPath}`)
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
  
  // Initialize service components
  initServiceComponents: function() {
    // Only run this on the services page
    const serviceContainer = document.getElementById('service-content-container');
    if (!serviceContainer) {
      return; // Not on services page
    }
    
    console.log('Initializing service components');
    
    // Handle service navigation links
    document.querySelectorAll('.service-card .service-actions a').forEach(link => {
      link.addEventListener('click', (event) => {
        // Prevent default anchor behavior
        event.preventDefault();
        
        // Get the service ID from the href attribute
        const serviceId = link.getAttribute('href').substring(1); // Remove the # prefix
        
        // Update the URL hash without scrolling
        history.pushState(null, null, `#${serviceId}`);
        
        // Load the corresponding service component
        this.loadServiceComponent(serviceId);
      });
    });
    
    // Handle URL hash changes
    window.addEventListener('hashchange', () => {
      const serviceId = window.location.hash.substring(1); // Remove the # prefix
      if (serviceId && this.serviceComponents[serviceId]) {
        this.loadServiceComponent(serviceId);
      }
    });
    
    // Load the default service component based on URL hash or default to 'traditional'
    const initialServiceId = window.location.hash.substring(1);
    if (initialServiceId && this.serviceComponents[initialServiceId]) {
      this.loadServiceComponent(initialServiceId);
    } else {
      this.loadServiceComponent('traditional'); // Default service
    }
  },
  
  // Load a service component
  loadServiceComponent: function(serviceId) {
    // Get the component container
    const container = document.getElementById('service-content-container');
    if (!container) {
      console.error('Service content container not found');
      return;
    }
    
    // Check if the serviceId is valid
    if (!this.serviceComponents[serviceId]) {
      console.error('Invalid service ID:', serviceId);
      return;
    }
    
    // Get the component path
    const componentPath = this.serviceComponents[serviceId];
    
    console.log(`Loading service component: ${serviceId} from ${componentPath}`);
    
    // Show loading indicator
    container.innerHTML = '<div class="loading-indicator">Loading...</div>';
    
    // Load the component
    this.loadComponent(componentPath, container);
    
    // Highlight the active service
    this.highlightActiveService(serviceId);
  },
  
  // Highlight the active service in the navigation
  highlightActiveService: function(serviceId) {
    // Remove active class from all service links
    document.querySelectorAll('.service-card .service-actions a').forEach(link => {
      link.classList.remove('active');
      // If the parent has an active class, remove it too
      const card = link.closest('.service-card');
      if (card) {
        card.classList.remove('active');
      }
    });
    
    // Add active class to the selected service link
    const activeLink = document.querySelector(`.service-card .service-actions a[href="#${serviceId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      // Also add active class to the parent card
      const card = activeLink.closest('.service-card');
      if (card) {
        card.classList.add('active');
      }
    }
  },
  
  // Get the root path based on current page location
  getRootPath: function() {
    // Use the shared PathResolver if available
    if (window.PathResolver) {
      return window.PathResolver.getRootPath();
    }
    
    // Fallback to original implementation
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path.endsWith('/index.html')) {
      return './';
    }
    return '../';
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
