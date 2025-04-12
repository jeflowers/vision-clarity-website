/**
 * Vision Clarity Institute - Team Page Scripts
 * This script handles team filtering and credential toggles
 */

document.addEventListener('DOMContentLoaded', function() {
    // Toggle credentials visibility
    const bioToggles = document.querySelectorAll('.bio-toggle');
    
    bioToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
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
        });
    });
    
    // Team filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const teamMembers = document.querySelectorAll('.team-member');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide team members based on filter
            teamMembers.forEach(member => {
                if (filter === 'all' || member.getAttribute('data-category') === filter) {
                    member.style.display = 'block';
                } else {
                    member.style.display = 'none';
                }
            });
        });
    });
});
