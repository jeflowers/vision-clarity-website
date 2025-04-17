/**
 * Vision Clarity Institute - Enhanced Header Functionality
 * Improves header accessibility, navigation, and mobile responsiveness
 */

// Add this near the top of the file, right after your initial comments
window.initializeHeader = initializeHeader;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize header functionality
    initializeHeader();
});

/**
 * Initialize header functionality
 */
function initializeHeader() {
    setupMobileMenu();
    setActiveNavItem();
    loadLanguageSelector();
}

/**
 * Set up mobile menu toggle
 */
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        
        // Toggle menu visibility
        navList.classList.toggle('active');
        
        // Announce menu state to screen readers
        announceToScreenReader(!expanded ? 'Menu expanded' : 'Menu collapsed');
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
}

/**
 * Set active navigation item based on current page
 */
function setActiveNavItem() {
    // Get current path
    const currentPath = window.location.pathname;
    
    // Find all navigation items
    const navLinks = document.querySelectorAll('.nav-list a');
    
    // Reset all links
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Determine which link should be active
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Simple path matching
        if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html')) {
            // Home page
            if (href.endsWith('index.html') || href === './') {
                setActiveLink(link);
            }
        } else if (currentPath.includes(href) && href !== './') {
            // Other pages (check for more specific match)
            setActiveLink(link);
        } else if (link.dataset.navId) {
            // Check by navigation ID
            const navId = link.dataset.navId;
            if ((navId === 'home' && (currentPath === '/' || currentPath.endsWith('index.html'))) ||
                (navId === 'services' && currentPath.includes('services.html')) ||
                (navId === 'technology' && currentPath.includes('technology.html')) ||
                (navId === 'team' && currentPath.includes('team.html')) ||
                (navId === 'locations' && currentPath.includes('locations.html')) ||
                (navId === 'contact' && currentPath.includes('contact.html'))) {
                setActiveLink(link);
            }
        }
    });
}

/**
 * Set a navigation link as active
 * @param {HTMLElement} link - The navigation link to set as active
 */
function setActiveLink(link) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
}

/**
 * Load the language selector component into the header
 */
function loadLanguageSelector() {
    const headerLanguageContainer = document.getElementById('header-language-component');
    if (!headerLanguageContainer) return;
    
    // Try to determine the correct path using PathResolver if available
    let basePath = './';
    if (window.PathResolver && typeof window.PathResolver.getBasePath === 'function') {
        basePath = window.PathResolver.getBasePath();
    } else {
        // Fallback path detection
        if (window.location.pathname.includes('/pages/')) {
            basePath = '../';
        }
    }
    
    // Load the language selector component
    fetch(`${basePath}components/language-selector-form.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load language selector component');
            }
            return response.text();
        })
        .then(html => {
            // Replace form prefix with 'header'
            const processedHtml = html.replace(/\{\{form_prefix\}\}/g, 'header');
            
            // Insert the component
            headerLanguageContainer.innerHTML = processedHtml;
            
            // Initialize the language selector
            initializeLanguageSelector();
            
            // Apply stored language preference
            const storedLanguage = localStorage.getItem('vci-language');
            if (storedLanguage) {
                const selector = document.getElementById('header_preferred_language');
                if (selector) {
                    selector.value = storedLanguage;
                    updateFlagDisplay(selector);
                }
            }
        })
        .catch(error => {
            console.error('Error loading language selector component:', error);
            // Fallback - create a simple language selector
            createFallbackLanguageSelector(headerLanguageContainer);
        });
}

/**
 * Create a fallback language selector if the component can't be loaded
 * @param {HTMLElement} container - The container element
 */
function createFallbackLanguageSelector(container) {
    if (!container) return;
    
    const fallbackHtml = `
    <div class="form-field language-selector-field" data-field="preferred_language">
        <label for="header_preferred_language" data-i18n="modal.form.preferred_language">
            Preferred Language
        </label>
        
        <div class="select-wrapper flag-select-wrapper">
            <select id="header_preferred_language" 
                    name="preferred_language" 
                    class="form-language-select flag-enabled"
                    aria-describedby="header_language_description">
                <option value="en" data-flag="🇺🇸" data-i18n="modal.form.language.english">English</option>
                <option value="es" data-flag="🇪🇸" data-i18n="modal.form.language.spanish">Spanish</option>
                <option value="zh" data-flag="🇨🇳" data-i18n="modal.form.language.chinese">Chinese</option>
            </select>
            <div class="select-arrow-container">
                <span class="select-arrow"></span>
            </div>
            <span class="flag-display form-flag-display" aria-hidden="true">🇺🇸</span>
        </div>
    </div>`;
    
    container.innerHTML = fallbackHtml;
    
    // Initialize the language selector
    initializeLanguageSelector();
}

/**
 * Initialize the language selector
 */
function initializeLanguageSelector() {
    const selector = document.getElementById('header_preferred_language');
    if (!selector) return;
    
    // Update flag display
    updateFlagDisplay(selector);
    
    // Add change event listener
    selector.addEventListener('change', function() {
        // Update flag display and store preference
        updateFlagDisplay(this);
        
        // Save language preference
        localStorage.setItem('vci-language', this.value);
        
        // Change language if i18n is available
        if (window.i18n && typeof window.i18n.changeLanguage === 'function') {
            window.i18n.changeLanguage(this.value);
        }
    });
}

/**
 * Update the flag display for a language selector
 * @param {HTMLElement} selector - The language selector element
 */
function updateFlagDisplay(selector) {
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

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
    const announcer = document.getElementById('a11y-announcer');
    if (!announcer) return;
    
    // Set the message
    announcer.textContent = message;
    
    // Clear after a delay to ensure repeated announcements work
    setTimeout(() => {
        announcer.textContent = '';
    }, 3000);
}

// Handle window resize
window.addEventListener('resize', function() {
    const navList = document.querySelector('.nav-list');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    // When resizing to desktop view, reset mobile menu state
    if (window.innerWidth > 768 && navList && menuToggle) {
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});
