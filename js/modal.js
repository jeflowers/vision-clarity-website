/**
 * Vision Clarity Institute - Modal Form Handler
 * Handles the consultation and inquiry modal forms.
 * Dynamically loads the modal template HTML from a separate file.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine the correct path to the template based on current page location
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    const templatePath = isInPagesDirectory ? 
                         '../templates/modal-template.html' : 
                         'pages/templates/modal-template.html';
    
    // Check if we have the modal in the page already (for debugging purposes)
    if (document.getElementById('service-modal')) {
        console.log('Modal already exists in the page, initializing...');
        initializeModal();
        return;
    }
    
    // Otherwise, load the modal template
    fetch(templatePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load modal template: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            console.log('Modal template loaded successfully');
            initializeModal(); // Initialize after loading
        })
        .catch(error => {
            console.error('Error loading modal template:', error);
            
            // Create a fallback modal if the template fails to load
            createFallbackModal();
        });
});

/**
 * Create a fallback modal directly in the page if template loading fails
 */
function createFallbackModal() {
    console.log('Creating fallback modal');
    const modalHTML = `
    <div id="service-modal" class="modal" aria-hidden="true">
        <div class="modal-overlay"></div>
        <div class="modal-container" role="dialog" aria-labelledby="modal-title">
            <div class="modal-header">
                <h2 id="modal-title">Schedule a Consultation</h2>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal-content">
                <form id="service-form" class="modal-form" data-form-type="consultation">
                    <div class="form-field required" data-field="name">
                        <label for="modal-name">Name</label>
                        <input type="text" id="modal-name" name="name" required>
                    </div>
                    
                    <div class="form-field required" data-field="email">
                        <label for="modal-email">Email</label>
                        <input type="email" id="modal-email" name="email" required>
                    </div>
                    
                    <div class="form-field required" data-field="phone">
                        <label for="modal-phone">Phone</label>
                        <input type="tel" id="modal-phone" name="phone" required>
                    </div>
                    
                    <div class="form-field" data-field="message">
                        <label for="modal-message">Message</label>
                        <textarea id="modal-message" name="message" rows="4"></textarea>
                    </div>
                    
                    <div class="form-field required">
                        <div class="checkbox-container">
                            <input type="checkbox" id="modal-consent" name="consent" required>
                            <label for="modal-consent" class="checkbox-label">
                                I consent to Vision Clarity Institute collecting and storing the information provided above.
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary modal-submit-button">Schedule Consultation</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    initializeModal();
}