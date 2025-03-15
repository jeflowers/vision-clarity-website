// Language dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    const languageDropdown = document.getElementById('languageDropdown');

    // Toggle dropdown when language button is clicked
    if (languageToggle) {
        languageToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (languageDropdown && languageToggle && !languageToggle.contains(e.target) && !languageDropdown.contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
    });

    // Handle language selection
    if (languageDropdown) {
        const languageOptions = languageDropdown.querySelectorAll('a');
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update language button text to selected language
                const selectedLanguage = this.textContent.trim().substring(0, 2);
                languageToggle.childNodes[0].nodeValue = selectedLanguage;
                
                // Hide dropdown after selection
                languageDropdown.classList.remove('show');
                
                // Here you would typically handle the actual language change
                console.log('Language changed to:', this.textContent.trim());
            });
        });
    }
});
