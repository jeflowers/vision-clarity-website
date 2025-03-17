// consultation-popup.js
document.addEventListener("DOMContentLoaded", function() {
    const openModalBtn = document.getElementById('consultation-btn');
    const modal = document.getElementById('consultation-modal');
    const closeModalBtn = modal.querySelector('.close-popup');

    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    const popupForm = document.getElementById('consultation-form-popup');
    popupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here (e.g., AJAX request)
        alert('Your consultation request has been submitted successfully.');
        popupForm.reset();
        modal.classList.remove('active');
    });
});
