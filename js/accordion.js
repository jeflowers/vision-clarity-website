/**
 * Vision Clarity Institute - Accordion Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordion functionality
    initAccordions();
});

/**
 * Initialize accordion functionality
 */
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        // Set initial state
        header.setAttribute('aria-expanded', 'false');
        
        // Add click event listener
        header.addEventListener('click', function() {
            // Toggle aria-expanded state
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Find and toggle the accordion content
            const content = this.nextElementSibling;
            if (content && content.classList.contains('accordion-content')) {
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            }
            
            // Optionally close other accordions if you want only one open at a time
            // (uncomment the following block if needed)
            /*
            const allHeaders = document.querySelectorAll('.accordion-header');
            allHeaders.forEach(item => {
                if (item !== this) {
                    item.setAttribute('aria-expanded', 'false');
                    const itemContent = item.nextElementSibling;
                    if (itemContent && itemContent.classList.contains('accordion-content')) {
                        itemContent.style.maxHeight = '0';
                    }
                }
            });
            */
        });
    });
}
