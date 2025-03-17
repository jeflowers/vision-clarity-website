/**
 * RTL (Right-to-Left) Support Styles
 * These styles are applied when a right-to-left language (Hebrew or Arabic) is selected
 */

/* Base RTL styles */
html[dir="rtl"] body {
  text-align: right;
}

/* Navigation */
html[dir="rtl"] .nav-list {
  flex-direction: row-reverse;
}

html[dir="rtl"] .header-actions {
  flex-direction: row-reverse;
}

/* Service sections */
html[dir="rtl"] .service-grid.reverse {
  flex-direction: row-reverse;
}

html[dir="rtl"] .service-grid:not(.reverse) {
  flex-direction: row-reverse;
}

/* Lists */
html[dir="rtl"] ul.service-list {
  padding-right: 1.5em;
  padding-left: 0;
}

html[dir="rtl"] ul.service-list li::before {
  right: -1.5em;
  left: auto;
}

/* Footer */
html[dir="rtl"] .footer-grid {
  flex-direction: row-reverse;
}

html[dir="rtl"] .footer-legal {
  flex-direction: row-reverse;
}

/* Font adjustments for RTL languages */
html[dir="rtl"] body {
  /* Improved font stacks for Arabic and Hebrew */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif;
}

html[lang="he"] body {
  font-family: "Arial Hebrew", "Frank Ruehl CLM", "Gisha", "David", "FbSpoiler", "Simple CLM", "Hadasim CLM", "Taamey David CLM", sans-serif;
}

html[lang="ar"] body {
  font-family: "Amiri", "Scheherazade", "Traditional Arabic", "Sakkal Majalla", "Droid Arabic Naskh", "Lateef", "Harmattan", sans-serif;
}

html[lang="fa"] body {
  font-family: "Vazir", "Tahoma", "Iranian Sans", "Mitra", "B Nazanin", "Roya", sans-serif;
}

/* Special handling for form elements */
html[dir="rtl"] input,
html[dir="rtl"] textarea {
  text-align: right;
}

/* Fix for form elements that should remain LTR (like phone numbers) */
html[dir="rtl"] input[type="tel"],
html[dir="rtl"] input[type="email"],
html[dir="rtl"] input[type="url"] {
  direction: ltr;
  text-align: right;
}

/* Button icons adjustment */
html[dir="rtl"] .btn i,
html[dir="rtl"] button i {
  margin-right: 0;
  margin-left: 0.5em;
  transform: scaleX(-1); /* Flip icons horizontally */
}

/* Special fixes for specific elements */
html[dir="rtl"] .mobile-menu-toggle {
  right: auto;
  left: 1rem;
}

/* Language selector placement */
html[dir="rtl"] .language-selector {
  margin-right: 0;
  margin-left: 1rem;
}

/* Fix for scrollbars in RTL mode */
html[dir="rtl"] ::-webkit-scrollbar {
  right: auto;
  left: 0;
}

/* Responsive adjustments for RTL */
@media (max-width: 768px) {
  html[dir="rtl"] .service-grid,
  html[dir="rtl"] .service-grid.reverse {
    flex-direction: column;
  }
  
  html[dir="rtl"] .footer-grid {
    flex-direction: column;
  }
}
