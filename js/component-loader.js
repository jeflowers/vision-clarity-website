/**
 * Vision Clarity Institute - Combined Component Loader
 * Handles dynamic loading of reusable components with broad compatibility
 * Enhanced for GitHub Pages compatibility and security
 */

// Global debug setting - can be switched off in production
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
      
      // Force the root path on GitHub Pages
      if (window.location.hostname.includes('github.io')) {
        this.forcedRootPath = '/vision-clarity-website/';
        debugLog('Using GitHub Pages root path:', this.forcedRootPath);
      }
      
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
        
        // If header was just loaded, try loading language selector immediately
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
      
      // Manually add header directly to ensure it's present even before loading
      this.addFallbackHeader();
      
      // Load critical components first
      this.components
        .filter(c => c.critical)
        .forEach(component => {
          const targetElement = this.getTargetElement(component.target);
          if (targetElement) {
            this.loadComponent(component.path, targetElement, true);
          } else {
            debugLog(`Target element not found for ${component.path}: ${component.target}`);
          }
        });
    },
    
    // Add a fallback header in case of loading failures
    addFallbackHeader: function() {
      const headerElement = document.querySelector('header.header');
      if (!headerElement || headerElement.innerHTML.trim() === '') {
        const basicHeader = `
          <div class="container">
            <div class="logo-container">
              <a href="${this.getRootPath()}index.html" aria-label="Vision Clarity Institute Home">
                <img src="${this.getRootPath()}assets/images/logo.svg" alt="Vision Clarity Institute" class="logo">
              </a>
            </div>
            <nav class="main-nav" role="navigation" aria-label="Main Navigation">
              <ul class="nav-list" id="main-menu">
                <li><a href="${this.getRootPath()}index.html" data-nav-id="home">Home</a></li>
                <li><a href="${this.getRootPath()}pages/services.html" data-nav-id="services">Services</a></li>
                <li><a href="${this.getRootPath()}pages/technology.html" data-nav-id="technology">Technology</a></li>
                <li><a href="${this.getRootPath()}pages/team.html" data-nav-id="team">Meet Our Team</a></li>
                <li><a href="${this.getRootPath()}pages/locations.html" data-nav-id="locations">Locations</a></li>
                <li><a href="${this.getRootPath()}pages/contact.html" data-nav-id="contact">Contact</a></li>
              </ul>
            </nav>
            <div class="header-actions">
              <div id="header-language-component" class="language-selector-container"></div>
              <div class="header-buttons">
                <button class="btn btn-primary open-modal" data-form-type="consultation">Schedule Consultation</button>
                <button class="btn btn-secondary open-modal" data-form-type="inquiry">Request Information</button>
              </div>
            </div>
          </div>`;
        
        if (headerElement) {
          headerElement.innerHTML = basicHeader;
        } else {
          const newHeader = document.createElement('header');
          newHeader.className = 'header';
          newHeader.innerHTML = basicHeader;
          document.body.insertBefore(newHeader, document.body.firstChild);
        }
      }
    },
    
    loadAllComponents: function() {
      // Load all components that aren't already loaded
      this.components
        .filter(c => !c.loaded)
        .forEach(component => {
          const targetElement = this.getTargetElement(component.target);
          if (targetElement) {
            this.loadComponent(component.path, targetElement);
          } else {
            debugLog(`Target element not found for ${component.path}: ${component.target}`);
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
      
      // Sanitize the path to prevent directory traversal attacks
      const sanitizedPath = this.sanitizePath(path);
      if (!sanitizedPath) {
        console.error(`Invalid component path: ${path}`);
        return Promise.reject(`Invalid component path: ${path}`);
      }
      
      // Determine full component path
      const rootPath = this.getRootPath();
      const fullPath = sanitizedPath.startsWith('/') ? sanitizedPath : `${rootPath}${sanitizedPath}`;
      
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
              
              // Safely set the HTML content (with basic XSS protection)
              this.safelySetInnerHTML(targetElement, finalContent);
              this.postLoadProcessing(targetElement);
            }
            return content;
          });
      }
      
      // Try multiple paths to handle GitHub Pages deployment
      const pathsToTry = [
        fullPath, 
        `/vision-clarity-website/${sanitizedPath}`,
        `./vision-clarity-website/${sanitizedPath}`
      ];
      
      return this.tryLoadFromPaths(pathsToTry, targetElement, sanitizedPath);
    },
    
    // Sanitize path to prevent directory traversal
    sanitizePath: function(path) {
      if (!path || typeof path !== 'string') return null;
      
      // Remove any attempt to traverse directories
      const sanitized = path.replace(/\.\.\//g, '');
      
      // Only allow certain file types (html, js, css) to be loaded
      if (!/\.(html|js|css)$/.test(sanitized)) {
        return null;
      }
      
      return sanitized;
    },
    
    // Try loading component from multiple paths until one succeeds
    tryLoadFromPaths: function(paths, targetElement, originalPath) {
      if (paths.length === 0) {
        return Promise.reject(`Failed to load component from all paths: ${originalPath}`);
      }
      
      const currentPath = paths[0];
      const remainingPaths = paths.slice(1);
      
      return this.fetchComponent(currentPath)
        .then(content => {
          const rootPath = this.getRootPath();
          
          // Replace {{rootPath}} placeholder with actual root path
          const processedContent = content.replace(/\{\{rootPath\}\}/g, rootPath);
          // Replace {{form_prefix}} placeholder for language selector
          const finalContent = processedContent.replace(/\{\{form_prefix\}\}/g, 'header');
          
          // Cache the component content
          this.componentCache[currentPath] = finalContent;
          
          // Insert the component if target element provided
          if (targetElement) {
            // Safely set the HTML content
            this.safelySetInnerHTML(targetElement, finalContent);
            this.postLoadProcessing(targetElement);
          }
          
          // Dispatch component loaded event
          document.dispatchEvent(new CustomEvent('componentLoaded', { 
            detail: { path: originalPath, element: targetElement, component: originalPath }
          }));
          
          debugLog(`Component loaded successfully: ${originalPath}`);
          
          return finalContent;
        })
        .catch(() => {
          debugLog(`Failed to load from ${currentPath}, trying next path...`);
          return this.tryLoadFromPaths(remainingPaths, targetElement, originalPath);
        });
    },
    
    // Fetch component from a specific path
    fetchComponent: function(path) {
      if (typeof fetch === 'function') {
        return fetch(path)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load component: ${path} (${response.status})`);
            }
            return response.text();
          });
      } else {
        // Fallback to XMLHttpRequest for older browsers
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                resolve(xhr.responseText);
              } else {
                reject(`Error loading component: ${path} (${xhr.status})`);
              }
            }
          };
          
          xhr.open('GET', path, true);
          xhr.send();
        });
      }
    },
    
    // Safely set innerHTML to prevent XSS
    safelySetInnerHTML: function(element, content) {
      // Basic XSS protection
      const sanitized = content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, 'data-removed=');
        
      element.innerHTML = sanitized;
    },
    
    getRootPath: function() {
      // If forcedRootPath is set (for GitHub Pages), use it
      if (this.forcedRootPath) {
        return this.forcedRootPath;
      }
      
      // If on GitHub Pages, use the repository-specific path
      if (window.location.hostname.includes('github.io')) {
        return '/vision-clarity-website/';
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
        
        // Setup mobile menu functionality
        this.setupMobileMenu();
        
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
    
    setupMobileMenu: function() {
      const menuToggle = document.querySelector('.mobile-menu-toggle');
      const navList = document.querySelector('.nav-list');
      
      if (!menuToggle || !navList) {
        // If elements not found, create mobile menu toggle
        const navElement = document.querySelector('.main-nav');
        if (navElement && !navElement.querySelector('.mobile-menu-toggle')) {
          const toggle = document.createElement('button');
          toggle.className = 'mobile-menu-toggle';
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-controls', 'main-menu');
          toggle.setAttribute('aria-label', 'Toggle Menu');
          toggle.innerHTML = '<span></span><span></span><span></span>';
          
          navElement.insertBefore(toggle, navElement.firstChild);
          
          // Re-query for the elements
          const newToggle = document.querySelector('.mobile-menu-toggle');
          if (newToggle && navList) {
            this.attachMobileMenuEvents(newToggle, navList);
          }
        }
        return;
      }
      
      this.attachMobileMenuEvents(menuToggle, navList);
    },
    
    attachMobileMenuEvents: function(menuToggle, navList) {
      // Toggle mobile menu
      menuToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        
        // Toggle menu visibility
        navList.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && 
            !navList.contains(event.target) && 
            navList.classList.contains('active')) {
            
            navList.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Close menu on escape key
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus(); // Return focus to toggle button
        }
      });
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
      } else if (currentPath === '/' || currentPath.endsWith('/vision-clarity-website/') || 
                 currentPath.endsWith('/vision-clarity-website/index.html') || 
                 currentPath === '/index.html') {
        activeNavId = 'home';
      }
      
      debugLog('Current path:', currentPath);
      debugLog('Active nav ID:', activeNavId);
      
      // Find all navigation items
      const navItems = document.querySelectorAll('[data-nav-id]');
      
      // Remove active class from all items
      navItems.forEach(item => {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      });
      
      // Add active class to the current page's nav item
      const activeItem = document.querySelector(`[data-nav-id="${activeNavId}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
        activeItem.setAttribute('aria-current', 'page');
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
        this.loadComponent(componentPath, languageContainer, true).catch(() => {
          // Fallback to a simple language selector if loading fails
          this.createFallbackLanguageSelector(languageContainer);
        });
      } else if (!languageContainer) {
        // If container not found, it might be because header is still loading
        // Try again after a short delay
        setTimeout(() => {
          const retryContainer = document.querySelector('#header-language-component');
          if (retryContainer && !retryContainer.querySelector('.language-selector-field')) {
            debugLog('Retrying language selector load after delay');
            
            // Use absolute path for GitHub Pages
            const retryPath = window.location.hostname.includes('github.io') 
              ? '/vision-clarity-website/components/language-selector-form.html'
              : `${this.getRootPath()}components/language-selector-form.html`;
              
            this.loadComponent(retryPath, retryContainer, true).catch(() => {
              // Fallback to a simple language selector if loading fails
              this.createFallbackLanguageSelector(retryContainer);
            });
          }
        }, 500);
      }
    },
    
    createFallbackLanguageSelector: function(container) {
      if (!container) return;
      
      debugLog('Creating fallback language selector');
      
      const fallbackHtml = `
        <div class="form-field language-selector-field" data-field="preferred_language">
          <label for="header_preferred_language" class="sr-only">
            Preferred Language
          </label>
          
          <div class="select-wrapper flag-select-wrapper">
            <select id="header_preferred_language" 
                    name="preferred_language" 
                    class="form-language-select flag-enabled"
                    aria-describedby="header_language_description">
              <option value="en" data-flag="🇺🇸">English</option>
              <option value="es" data-flag="🇪🇸">Spanish</option>
            </select>
            <div class="select-arrow-container">
              <span class="select-arrow"></span>
            </div>
            <span class="flag-display form-flag-display" aria-hidden="true">🇺🇸</span>
          </div>
        </div>`;
      
      // Safely set the HTML content
      this.safelySetInnerHTML(container, fallbackHtml);
      
      // Initialize the language selector
      const selector = container.querySelector('#header_preferred_language');
      if (selector) {
        this.initializeLanguageSelector(selector);
      }
    },
    
    initializeLanguageSelector: function(selector) {
      if (!selector) {
        selector = document.getElementById('header_preferred_language');
      }
      
      if (!selector) return;
      
      // Update flag display
      this.updateFlagDisplay(selector);
      
      // Add change event listener
      selector.addEventListener('change', function() {
        // Get the parent ComponentLoader instance
        const componentLoader = window.ComponentLoader;
        
        // Update flag display
        if (componentLoader) {
          componentLoader.updateFlagDisplay(this);
        }
        
        // Save language preference
        localStorage.setItem('vci-language', this.value);
        
        // Change language if i18n is available
        if (window.i18n && typeof window.i18n.changeLanguage === 'function') {
          window.i18n.changeLanguage(this.value);
        }
      });
    },
    
    updateFlagDisplay: function(selector) {
      if (!selector || selector.selectedIndex === undefined) return;
      
      const selectedOption = selector.options[selector.selectedIndex];
      if (!selectedOption) return;
      
      const flag = selectedOption.getAttribute('data-flag');
      if (!flag) return;
      
      // Find the flag display element
      const flagDisplay = selector.parentNode.querySelector('.flag-display');
      if (flagDisplay) {
        // Update existing flag
        flagDisplay.textContent = flag;
      } else {
        // Create flag display if it doesn't exist
        const newFlagDisplay = document.createElement('span');
        newFlagDisplay.className = 'flag-display';
        newFlagDisplay.setAttribute('aria-hidden', 'true');
        newFlagDisplay.textContent = flag;
        
        // Add to wrapper
        selector.parentNode.appendChild(newFlagDisplay);
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
