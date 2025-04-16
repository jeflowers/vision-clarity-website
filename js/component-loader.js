/**
 * Vision Clarity Institute - Combined Component Loader
 * Handles dynamic loading of reusable components with broad compatibility
 */

// Global debug setting - set to false by default
const DEBUG_MODE = false;

// Debug logging function that only logs when debug mode is enabled
function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log(...args);
  }
}

// Check if ComponentLoader already exists
if (!window.ComponentLoader) {
  window.ComponentLoader = {
    initialized: false,
    componentCache: {},
    components: [
      { path: 'components/header.html', target: 'header.header', loaded: false, critical: true },
      { path: 'components/footer.html', target: 'footer.footer', loaded: false, critical: true },
      { path: 'components/language-selector-form.html', target: '#header-language-component', loaded: false, critical: true },
      { path: 'components/consultation-modal.html', target: 'body', loaded: false, critical: false },
      { path: 'components/service-inquiry-modal.html', target: 'body', loaded: false, critical: false }
    ],
    loadedCount: 0,
    
    init: function() {
      // Prevent multiple initializations
      if (this.initialized) {
        debugLog('ComponentLoader already initialized');
        return;
      }
      
      this.initialized = true;
      debugLog('Initializing ComponentLoader');
      
      // Load critical components immediately
      this.loadCriticalComponents();
      
      // Load remaining components after a small delay
      setTimeout(() => {
        this.loadAllComponents();
        // Ensure language selector is loaded
        this.loadLanguageSelector();
      }, 100);
      
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
      
      // Listen for component loaded events
      document.addEventListener('componentLoaded', this.handleComponentLoaded.bind(this));
    },
    
    handleComponentLoaded: function(event) {
      this.loadedCount++;
      
      // Update component status if it's one we're tracking
      const componentInfo = this.components.find(c => c.path === event.detail.path);
      if (componentInfo) {
        componentInfo.loaded = true;
        
        // If header was just loaded, try loading language selector
        if (event.detail.path === 'components/header.html') {
          setTimeout(() => this.loadLanguageSelector(), 50);
        }
      }
      
      // Check if all registered components are loaded
      const allRegisteredLoaded = this.components.every(c => c.loaded);
      if (allRegisteredLoaded) {
        this.postLoadProcessing();
      }
    },
    
    loadCriticalComponents: function() {
      debugLog('Loading critical components (header/footer)...');
      
      // Load critical components first
      this.components
        .filter(c => c.critical)
        .forEach(component => {
          const targetElement = this.getTargetElement(component.target);
          if (targetElement) {
            this.loadComponent(component.path, targetElement, true);
          }
        });
    },
    
    loadAllComponents: function() {
      // Load all components that aren't already loaded
      this.components
        .filter(c => !c.loaded)
        .forEach(component => {
          const targetElement = this.getTargetElement(component.target);
          if (targetElement) {
            this.loadComponent(component.path, targetElement);
          }
        });
      
      // Find custom components marked with data-component
      const customContainers = document.querySelectorAll('[data-component]');
      debugLog('Found custom component containers:', customContainers.length);
      
      customContainers.forEach(container => {
        const componentPath = container.getAttribute('data-component');
        this.loadComponent(componentPath, container);
      });
    },
    
    getTargetElement: function(targetSelector) {
      // Get the target element from selector or return the element itself
      return typeof targetSelector === 'string'
        ? document.querySelector(targetSelector)
        : targetSelector;
    },
    
    loadComponent: function(path, targetElement, isCritical = false) {
      if (!path) {
        console.error('Component path is required');
        return Promise.reject('Component path is required');
      }
      
      // Handle target element if passed as string
      if (typeof targetElement === 'string') {
        targetElement = document.querySelector(targetElement);
        if (!targetElement) {
          console.error(`Target element not found: ${targetElement}`);
          return Promise.reject(`Target element not found: ${targetElement}`);
        }
      }
      
      // Determine full component path
      const rootPath = this.getRootPath();
      const fullPath = path.startsWith('/') ? path : `${rootPath}${path}`;
      
      debugLog(`Loading component: ${fullPath}`);
      
      // Return from cache if available and not critical
      if (!isCritical && this.componentCache[fullPath]) {
        return Promise.resolve(this.componentCache[fullPath])
          .then(content => {
            if (targetElement) {
              // Replace {{rootPath}} placeholder with actual root path
              const processedContent = content.replace(/\{\{rootPath\}\}/g, rootPath);
              // Replace {{form_prefix}} placeholder for language selector
              const finalContent = processedContent.replace(/\{\{form_prefix\}\}/g, 'header');
              targetElement.innerHTML = finalContent;
              this.postLoadProcessing(targetElement);
            }
            return content;
          });
      }
      
      // Use Promise-based fetch but fall back to XHR for older browsers
      if (typeof fetch === 'function') {
        return fetch(fullPath)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load component: ${fullPath} (${response.status})`);
            }
            return response.text();
          })
          .then(content => {
            // Replace {{rootPath}} placeholder with actual root path
            const processedContent = content.replace(/\{\{rootPath\}\}/g, rootPath);
            // Replace {{form_prefix}} placeholder for language selector
            const finalContent = processedContent.replace(/\{\{form_prefix\}\}/g, 'header');
            
            // Cache the component content
            this.componentCache[fullPath] = finalContent;
            
            // Insert the component if target element provided
            if (targetElement) {
              targetElement.innerHTML = finalContent;
              this.postLoadProcessing(targetElement);
            }
            
            // Dispatch component loaded event
            document.dispatchEvent(new CustomEvent('componentLoaded', { 
              detail: { path, element: targetElement, component: path }
            }));
            
            debugLog(`Component loaded event: ${path}`);
            
            return finalContent;
          })
          .catch(error => {
            console.error(`Error loading component ${path}:`, error);
            return Promise.reject(error);
          });
      } else {
        // Fallback to XMLHttpRequest for older browsers
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // Replace {{rootPath}} placeholder with the actual root path
                const processedContent = xhr.responseText.replace(/\{\{rootPath\}\}/g, rootPath);
                // Replace {{form_prefix}} placeholder for language selector
                const finalContent = processedContent.replace(/\{\{form_prefix\}\}/g, 'header');
                
                // Cache the component content
                this.componentCache[fullPath] = finalContent;
                
                // Insert the component into the target element
                if (targetElement) {
                  targetElement.innerHTML = finalContent;
                  this.postLoadProcessing(targetElement);
                }
                
                // Dispatch component loaded event
                document.dispatchEvent(new CustomEvent('componentLoaded', { 
                  detail: { path, element: targetElement, component: path }
                }));
                
                debugLog(`Component loaded event: ${path}`);
                
                resolve(finalContent);
              } else {
                const error = `Error loading component: ${fullPath} (${xhr.status})`;
                console.error(error);
                reject(error);
              }
            }
          };
          
          xhr.open('GET', fullPath, true);
          xhr.send();
        });
      }
    },
    
    getRootPath: function() {
      // If on GitHub Pages, use the repository-specific path
      if (window.location.hostname.includes('github.io')) {
        // Extract repo name from path for GitHub Pages
        const path = window.location.pathname;
        if (path.includes('/vision-clarity-website/')) {
          return '/vision-clarity-website/';
        }
      }
      
      // Count directory levels for relative paths
      const path = window.location.pathname;
      let depth = 0;
      
      // Remove the file from the path
      let pathWithoutFile = path;
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
    
    postLoadProcessing: function(container) {
      // If no specific container, consider it a global post-processing
      if (!container) {
        // Highlight the current page in the navigation
        this.highlightCurrentNav();
        
        // Ensure language selector is loaded
        this.loadLanguageSelector();
        
        // Dispatch event that all components have loaded
        document.dispatchEvent(new CustomEvent('allComponentsLoaded'));
        
        debugLog('All components loaded event fired');
      }
      
      // Apply translations if I18nManager is available (with delay for proper initialization)
      setTimeout(() => {
        if (window.I18nManager && typeof window.I18nManager.applyTranslations === 'function') {
          window.I18nManager.applyTranslations();
        } else if (window.i18n && typeof window.i18n.applyTranslations === 'function') {
          window.i18n.applyTranslations();
        }
        
        // Initialize any scripts within the container
        this.initComponentScripts(container);
      }, 150);
    },
    
    initComponentScripts: function(container) {
      // If no container provided, skip
      if (!container) return;
      
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
    },
    
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
      } else if (currentPath.includes('/team.html') || (isGitHubPages && currentPath.includes('/pages/team.html'))) {
        activeNavId = 'team';
      } else if (currentPath.includes('/locations.html') || (isGitHubPages && currentPath.includes('/pages/locations.html'))) {
        activeNavId = 'locations';
      } else if (currentPath.includes('/contact.html') || (isGitHubPages && currentPath.includes('/pages/contact.html'))) {
        activeNavId = 'contact';
      }
      
      debugLog('Current path:', currentPath);
      debugLog('Active nav ID:', activeNavId);
      
      // Find all navigation items
      const navItems = document.querySelectorAll('[data-nav-id]');
      
      // Remove active class from all items
      navItems.forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to the current page's nav item
      const activeItem = document.querySelector(`[data-nav-id="${activeNavId}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
        debugLog('Active item found and highlighted:', activeItem);
      } else {
        debugLog('No navigation item found with ID:', activeNavId);
      }
    },
    
    loadLanguageSelector: function() {
      // Use the dedicated language component container
      const languageContainer = document.querySelector('#header-language-component');
      
      // Only proceed if container exists and doesn't already have the component
      if (languageContainer && !languageContainer.querySelector('.language-selector-field')) {
        debugLog('Loading language selector into #header-language-component');
        
        // Use absolute path for GitHub Pages or relative path for local development
        let componentPath;
        if (window.location.hostname.includes('github.io')) {
          // When on GitHub Pages, always use the absolute repository path
          componentPath = '/vision-clarity-website/components/language-selector-form.html';
        } else {
          // For local development, use the root path calculation
          const rootPath = this.getRootPath();
          componentPath = `${rootPath}components/language-selector-form.html`;
        }
        
        debugLog('Using component path:', componentPath);
        
        // Always use the full path to load the component
        this.loadComponent(componentPath, languageContainer, true);
      } else {
        debugLog('Language selector already loaded or container not found');
        
        // If container not found, it might be because header is still loading
        // Try again after a short delay
        if (!languageContainer) {
          setTimeout(() => {
            const retryContainer = document.querySelector('#header-language-component');
            if (retryContainer && !retryContainer.querySelector('.language-selector-field')) {
              debugLog('Retrying language selector load after delay');
              
              // Use absolute path for GitHub Pages
              const retryPath = window.location.hostname.includes('github.io') 
                ? '/vision-clarity-website/components/language-selector-form.html'
                : `${this.getRootPath()}components/language-selector-form.html`;
                
              this.loadComponent(retryPath, retryContainer, true);
            }
          }, 500);
        }
      }
    }
  };
} else {
  debugLog('ComponentLoader already defined, using existing instance');
}

// Initialize safely - but make sure it runs as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (window.ComponentLoader && typeof window.ComponentLoader.init === 'function') {
      window.ComponentLoader.init();
    }
  });
} else {
  // DOM already loaded, initialize immediately
  if (window.ComponentLoader && typeof window.ComponentLoader.init === 'function') {
    window.ComponentLoader.init();
  }
}

// For compatibility with older code that might use PathUtils
if (!window.PathUtils) {
  window.PathUtils = {
    getRootPath: function() {
      return window.ComponentLoader.getRootPath();
    },
    loadComponent: function(path, target, callback) {
      return window.ComponentLoader.loadComponent(path, target).then(() => {
        if (callback && typeof callback === 'function') {
          callback(typeof target === 'string' ? document.querySelector(target) : target);
        }
      });
    },
    highlightCurrentNav: function() {
      return window.ComponentLoader.highlightCurrentNav();
    }
  };
}
