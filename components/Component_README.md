# Vision Clarity Institute Website - Dynamic Components 

## Overview

This implementation provides a comprehensive solution for dynamic components in the Vision Clarity Institute website. The components include headers, footers, language selectors, and modal forms, with support for internationalization (i18n) across all elements.

## Component Structure

### Core Components

1. **Header Component** (`components/header.html`)
   - Dynamic navigation menu that highlights the current page
   - Contains language selector and action buttons

2. **Footer Component** (`components/footer.html`)
   - Site-wide footer with navigation links and contact information
   - Uses the same path handling as the header

3. **Language Selector** (`components/language-selector.html`)
   - Dropdown for selecting the site language
   - Displays language names in their native script

4. **Modal Components**
   - **Consultation Modal** (`components/consultation-modal.html`)
   - **Service Inquiry Modal** (`components/service-inquiry-modal.html`)

### JavaScript Modules

1. **Path Utilities** (`js/path-utils.js`)
   - Determines relative paths based on current page location
   - Handles GitHub Pages compatibility

2. **Component Loader** (`js/component-loader.js` or `js/component-loader-compat.js`)
   - Loads header and footer components
   - Handles component initialization and post-processing

3. **Internationalization** (`js/i18n.js`)
   - Manages translation loading and application
   - Handles language switching

4. **Modal Management** (`js/modal.js`)
   - Handles modal loading, display, and form processing

## Implementation Guide

### 1. Prepare Your HTML Pages

For each HTML page (e.g., index.html, services.html), include placeholder elements for the components:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.title">Vision Clarity Institute</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/modal.css">
    <!-- Additional stylesheets -->
</head>
<body>
    <!-- Header placeholder - will be populated by component-loader.js -->
    <header></header>

    <!-- Page content -->
    <main>
        <!-- Your page-specific content here -->
    </main>

    <!-- Footer placeholder - will be populated by component-loader.js -->
    <footer></footer>

    <!-- Scripts -->
    <script src="js/component-loader-compat.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/modal.js"></script>
    <!-- Additional scripts -->
</body>
</html>
```

### 2. Add Component Files to Your Project

Place the component files in the appropriate directories:

```
project-root/
├── components/
│   ├── header.html
│   ├── footer.html
│   ├── language-selector.html
│   ├── consultation-modal.html
│   └── service-inquiry-modal.html
├── css/
│   ├── styles.css
│   └── modal.css
├── js/
│   ├── component-loader-compat.js
│   ├── i18n.js
│   ├── modal.js
│   └── i18n/
│       ├── en.json
│       └── [other language files]
├── index.html
└── pages/
    ├── services.html
    └── [other pages]
```

### 3. Configure Translation Files

Create translation files for each supported language in the `js/i18n/` directory. Each file should include translations for all component text.

Example structure for `en.json`:

```json
{
  "global": {
    "menu": {
      "home": "Home",
      "services": "Services",
      "technology": "Technology",
      "staff": "Our Staff",
      "locations": "Locations",
      "contact": "Contact"
    },
    "buttons": {
      "schedule": "Schedule Consultation",
      "inquiry": "Request Information"
    },
    "footer": {
      "quickLinks": "Quick Links",
      "contact": "Contact",
      "hours": "Hours",
      "copyright": "© 2025 Vision Clarity Institute. All rights reserved."
    }
  },
  "language": {
    "english": "English",
    "spanish": "Español",
    "chinese": "中文",
    "korean": "한국어",
    "armenian": "Հայերեն",
    "hebrew": "עברית",
    "russian": "Русский",
    "farsi": "فارسی",
    "arabic": "العربية"
  },
  "modal": {
    "consultation": {
      "title": "Schedule a Consultation"
    },
    "inquiry": {
      "title": "Request Information"
    }
  }
}
```

### 4. Script Loading Order

The scripts should be loaded in the following order:

1. `component-loader-compat.js` - Loads core components
2. `i18n.js` - Initializes internationalization
3. `modal.js` - Handles modal functionality
4. Page-specific scripts

This ensures that components are loaded before other scripts try to interact with them.

## How It Works

### Dynamic Path Detection

The system automatically detects the current page's location within the site structure and adjusts paths accordingly:

- For pages in the root directory (e.g., `index.html`), paths start with `./`
- For pages in subdirectories (e.g., `pages/services.html`), paths start with `../`
- For GitHub Pages deployments, paths include the repository name

This allows the same components to be used across all pages without manual path adjustments.

### Component Loading Process

1. When a page loads, `component-loader-compat.js` initializes
2. It loads the header and footer components using the correct relative paths
3. After components load, it highlights the current page in the navigation
4. It then loads the language selector and applies any saved language preference
5. Finally, it triggers an event that all components are loaded

### Internationalization

The internationalization system:

1. Detects the user's language preference (saved or browser default)
2. Loads the appropriate translation file
3. Applies translations to all elements with `data-i18n` attributes
4. Updates the page when the user selects a different language

### Modal Forms

Modal forms are loaded dynamically when needed:

1. Action buttons in the header trigger modal display
2. The modals are loaded if not already present in the DOM
3. Form validation and submission are handled by the modal.js script

## Browser Compatibility

The implementation supports:

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11 (using the compatibility version)
- Mobile browsers

## Customization

### Adding New Components

To add a new component:

1. Create the component HTML file in the `components/` directory
2. Use `{{rootPath}}` for dynamic path resolution
3. Add the component to the components array in `component-loader-compat.js`

### Modifying Existing Components

To modify an existing component:

1. Edit the component HTML file
2. Update translation files if text changes
3. Any references to the modified component in other files should be updated as needed

### Adding New Pages

When adding a new page to the site:

1. Use the template structure with header and footer placeholders
2. Include the component loader and other necessary scripts
3. Add the page to the navigation menu in the header component
4. Update the data-nav-id attributes as needed

## Troubleshooting

### Common Issues

1. **Components Not Loading**
   - Check browser console for errors
   - Verify that component files exist in the correct location
   - Ensure component-loader-compat.js is properly included

2. **Navigation Highlighting Not Working**
   - Verify data-nav-id attributes match the expected values in PathUtils.highlightCurrentNav()
   - Check that the current page path is being correctly detected

3. **Translation Issues**
   - Verify that translation JSON files are properly formatted
   - Check that elements have the correct data-i18n attributes
   - Ensure the i18n.js file is loaded after component-loader-compat.js

4. **Path Resolution Problems**
   - Check that {{rootPath}} placeholders are present in component HTML files
   - Verify the getRootPath() function's output in the console
   - For special hosting environments, adjust the path detection logic as needed

### Debugging Tips

1. Use the browser console to check for script errors
2. Add console.log statements to monitor component loading
3. Verify that custom events (componentLoaded, allComponentsLoaded) are firing
4. Test with different page locations to ensure path resolution works correctly

## Performance Considerations

### Optimization Techniques

1. **Caching Components**
   - Consider adding component caching to reduce network requests
   - Cache translation files for faster language switching

2. **Lazy Loading**
   - Load modal components only when needed
   - Consider lazy loading translations for non-default languages

3. **Minification**
   - Minify JavaScript and CSS files for production
   - Optimize component HTML by removing unnecessary whitespace

## Security Considerations

1. **Form Submission**
   - Implement proper CSRF protection for form submissions
   - Validate all form data on the server side

2. **Cross-Origin Requests**
   - Set appropriate CORS headers for component loading if hosted on different domains
   - Consider bundling components for production to avoid cross-origin issues

3. **Content Security Policy**
   - Ensure your CSP allows dynamic script execution if needed
   - Consider using nonces for dynamically loaded scripts

## Maintenance

### Version Control

1. Keep component files under version control
2. Document changes to components in commit messages
3. Consider tagging major component updates for reference

### Documentation

1. Maintain documentation of component interfaces
2. Document custom events and their expected behavior
3. Keep component examples up to date for reference

## Conclusion

This dynamic component approach offers several advantages:

1. **Maintainability**: Changes to common components only need to be made in one place
2. **Consistency**: All pages use the same header, footer, and styles
3. **Flexibility**: Path resolution automatically adjusts to the page location
4. **Internationalization**: All text can be easily translated and updated

By following this implementation guide, you can maintain a consistent user experience across the Vision Clarity Institute website while simplifying ongoing maintenance and updates.
