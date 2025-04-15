document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded in accordion.js');
  
  // Wait for a short time to ensure all elements are properly loaded
  setTimeout(function() {
    // Get all accordion headers
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    console.log('Found ' + accordionHeaders.length + ' accordion headers');
    
    // Set up each accordion
    accordionHeaders.forEach(function(header) {
      // Set initial aria-expanded state
      header.setAttribute('aria-expanded', 'false');
      
      // Add click event listener
      header.addEventListener('click', function() {
        // Toggle expanded state
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle content visibility
        const content = this.nextElementSibling;
        if (content && content.classList.contains('accordion-content')) {
          if (!isExpanded) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = '0';
          }
        }
      });
      
      // Force initial state of content
      const content = header.nextElementSibling;
      if (content && content.classList.contains('accordion-content')) {
        content.style.maxHeight = '0';
      }
    });
  }, 500); // 500ms delay to ensure DOM is fully processed
});
