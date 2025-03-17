/**
 * Vision Clarity Institute - Consultation Popup
 * Handles the free consultation modal popup functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('consultation-modal');
    const openBtn = document.getElementById('consultation-btn');
    const closeBtn = document.querySelector('.close-popup');
    const form = document.getElementById('consultation-form-popup');

    // Open modal function
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event listeners
    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('full-name-popup').value,
                email: document.getElementById('email-popup').value,
                phone: document.getElementById('phone-popup').value,
                location: document.getElementById('location-popup').value,
                service: document.getElementById('service-popup').value,
                dateStart: document.getElementById('date-start-popup').value,
                dateEnd: document.getElementById('date-end-popup').value,
                message: document.getElementById('message-popup').value
            };
            
            // Log form data (in a real app, you would send this to a server)
            console.log('Form submitted:', formData);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = 'Thank you! Your consultation request has been submitted. We will contact you shortly.';
            
            // Replace form with success message
            form.innerHTML = '';
            form.appendChild(successMessage);
            
            // Close modal after delay
            setTimeout(function() {
                closeModal();
                
                // Reset form after modal is closed (for potential reopening)
                setTimeout(function() {
                    form.innerHTML = document.getElementById('form-template').innerHTML;
                }, 300);
            }, 3000);
        });
    }

    // Also handle any CTA buttons throughout the site
    const ctaButtons = document.querySelectorAll('.cta-consultation');
    ctaButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });
});
