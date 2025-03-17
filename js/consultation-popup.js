function openModal() {
    const modal = document.getElementById('consultationModal');
    modal.classList.add('active', 'fade-in');
}

function closeModal() {
    const modal = document.getElementById('consultationModal');
    modal.classList.add('fade-out');
    setTimeout(() => {
        modal.classList.remove('active', 'fade-in', 'fade-out');
    }, 200);
}

function handleSubmit(event) {
    event.preventDefault();
    // Handle form submission here
    closeModal();
    alert('Thank you! We will contact you shortly.');
}

// Close modal when clicking outside
document.getElementById('consultationModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.getElementById('consultationModal').classList.contains('active')) {
        closeModa
