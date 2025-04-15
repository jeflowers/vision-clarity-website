/**
 * Vision Clarity Institute - Debug Tools
 * Utility functions for debugging styling and component issues
 */

// Debug namespace to avoid conflicts
window.VCIDebug = {
    /**
     * Verify and fix team page grid styling if needed
     */
    fixTeamGrid: function() {
        console.log('Checking team grid styling...');
        
        // Verify team styles are applied
        const teamGrid = document.querySelector('.team-grid');
        if (teamGrid) {
            const computed = window.getComputedStyle(teamGrid);
            console.log('Team grid display style:', computed.display);
            
            // Force display if needed
            if (computed.display !== 'grid') {
                console.log('Applying grid display style manually');
                teamGrid.style.display = 'grid';
                teamGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
                teamGrid.style.gap = '2rem';
                teamGrid.style.marginTop = '2rem';
            }
        }
    },
    
    /**
     * Check if components loaded properly
     */
    checkComponents: function() {
        console.log('Checking component loading...');
        
        // Check header
        const header = document.querySelector('header.header');
        if (header) {
            console.log('Header content length:', header.innerHTML.length);
            if (header.innerHTML.length < 50) {
                console.warn('Header may not have loaded correctly');
            }
        }
        
        // Check footer
        const footer = document.querySelector('footer.footer');
        if (footer) {
            console.log('Footer content length:', footer.innerHTML.length);
            if (footer.innerHTML.length < 50) {
                console.warn('Footer may not have loaded correctly');
            }
        }
        
        // Check language selector
        const langSelector = document.getElementById('header-language-component');
        if (langSelector) {
            console.log('Language selector found:', !!langSelector);
        }
    },
    
    /**
     * Check language selector dropdown visibility
     */
    checkLanguageSelector: function() {
        console.log('Checking language selector styling...');
        
        // Find language selectors
        const selectors = document.querySelectorAll('.flag-enabled');
        selectors.forEach(selector => {
            // Check if icon container exists
            const iconContainer = selector.parentNode.querySelector('.select-icon-container');
            if (!iconContainer) {
                console.warn('Missing select-icon-container for selector:', selector.id);
                
                // Create one if missing
                const newIconContainer = document.createElement('div');
                newIconContainer.className = 'select-icon-container';
                
                const selectIcon = document.createElement('span');
                selectIcon.className = 'select-icon';
                
                newIconContainer.appendChild(selectIcon);
                selector.parentNode.appendChild(newIconContainer);
                
                console.log('Created missing select-icon-container');
            }
            
            // Check flag display
            const flagDisplay = selector.parentNode.querySelector('.flag-display');
            if (!flagDisplay) {
                console.warn('Missing flag-display for selector:', selector.id);
            }
        });
    },
    
    /**
     * Apply team specific fixes
     */
    applyTeamPageFixes: function() {
        // Fix bio toggle functionality if needed
        const bioToggles = document.querySelectorAll('.bio-toggle');
        if (bioToggles.length > 0) {
            console.log('Setting up bio toggles:', bioToggles.length);
            
            bioToggles.forEach(toggle => {
                // Ensure event listener is attached only once
                toggle.removeEventListener('click', this.handleBioToggle);
                toggle.addEventListener('click', this.handleBioToggle);
            });
        }
        
        // Fix team filters if needed
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length > 0) {
            console.log('Setting up team filters:', filterBtns.length);
            
            filterBtns.forEach(btn => {
                // Ensure event listener is attached only once
                btn.removeEventListener('click', this.handleFilterClick);
                btn.addEventListener('click', this.handleFilterClick);
            });
        }
    },
    
    /**
     * Handle bio toggle click event
     */
    handleBioToggle: function() {
        const credentialsId = this.getAttribute('aria-controls');
        const credentials = document.getElementById(credentialsId);
        
        if (credentials.style.display === 'block') {
            credentials.style.display = 'none';
            this.setAttribute('aria-expanded', 'false');
            this.classList.remove('expanded');
            this.textContent = 'View Credentials';
        } else {
            credentials.style.display = 'block';
            this.setAttribute('aria-expanded', 'true');
            this.classList.add('expanded');
            this.textContent = 'Hide Credentials';
        }
    },
    
    /**
     * Handle filter button click event
     */
    handleFilterClick: function() {
        // Find all filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get filter category
        const filter = this.getAttribute('data-filter');
        
        // Find all team members
        const teamMembers = document.querySelectorAll('.team-member');
        
        // Show/hide team members based on filter
        teamMembers.forEach(member => {
            if (filter === 'all' || member.getAttribute('data-category') === filter) {
                member.style.display = 'block';
            } else {
                member.style.display = 'none';
            }
        });
    },
    
    /**
     * Initialize debugging
     */
    init: function() {
        console.log('Initializing VCI debug tools...');
        
        document.addEventListener('DOMContentLoaded', function() {
            // Run basic checks
            VCIDebug.checkComponents();
            VCIDebug.checkLanguageSelector();
            
            // Page-specific checks
            if (document.querySelector('.team-grid')) {
                VCIDebug.fixTeamGrid();
                VCIDebug.applyTeamPageFixes();
            }
        });
    }
};

// Auto-initialize
VCIDebug.init();
