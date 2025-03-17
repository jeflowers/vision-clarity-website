# Vision Clarity Institute - Internationalization (i18n) System

This document explains how to use, maintain, and extend the internationalization (i18n) system for the Vision Clarity Institute website.

## Overview

The i18n system allows the website to be available in multiple languages to serve the diverse population of Southern California:

- English (en) - Default
- Spanish (es) - Major language in Southern California
- Chinese (zh) - Significant community in LA County
- Korean (ko) - Notable around Koreatown and medical districts
- Armenian (hy) - Prominent in Glendale and East Hollywood
- Hebrew (he) - Israeli community in West LA and Pico-Robertson (RTL language)
- Filipino/Tagalog (tl) - Significant Filipino population
- Russian (ru) - Present in West Hollywood and parts of San Fernando Valley
- Persian/Farsi (fa) - "Tehrangeles" community in West LA (RTL language)
- Arabic (ar) - Middle Eastern communities (RTL language)

The system is designed to be:

- Easy to maintain and update
- Performant with minimal impact on page load times
- Accessible and SEO-friendly
- Fully supportive of right-to-left (RTL) languages
- Extendable to add more languages in the future

## File Structure

```
website/
├── js/
│   ├── i18n/
│   │   ├── en.json       # English translations
│   │   ├── es.json       # Spanish translations
│   │   ├── zh.json       # Chinese translations
│   │   ├── ko.json       # Korean translations
│   │   ├── hy.json       # Armenian translations
│   │   └── template.json # Template for translators
│   ├── i18n.js           # Main internationalization module
│   └── scripts.js        # Main site JavaScript
├── tools/
│   └── translation-tools.js  # Translation management utilities
└── pages/
    └── services.html     # Example page with i18n attributes
```

## How It Works

1. Each HTML element that needs translation has a `data-i18n` attribute with a key that follows dot notation (e.g., `services.title`).
2. The i18n system loads translations from JSON files based on the user's selected language or browser preferences.
3. When a page loads or language changes, the system replaces the content of elements with the corresponding translations.
4. The language preference is saved in localStorage for returning visitors.

## Adding Translations to HTML Elements

To make an element translatable:

1. Add a `data-i18n` attribute with a key following the naming convention:
   ```html
   <h2 data-i18n="services.traditional.title">Traditional LASIK</h2>
   ```

2. Make sure the key exists in all language JSON files.

### Naming Convention

Translation keys follow a hierarchical structure:
- `global.*` - For site-wide elements (navigation, footer, buttons)
- `[page].*` - For page-specific content

Example:
```
global.menu.home        # "Home" in the navigation
services.header.title   # "Our Services" page title
```

## Translation Files

Each language has its own JSON file with the same structure. The English (en.json) file serves as the default and reference.

Translation files use a nested object structure that mirrors the dot notation used in HTML:

```json
{
  "global": {
    "menu": {
      "home": "Home",
      "services": "Services"
    }
  },
  "services": {
    "header": {
      "title": "Our Services"
    }
  }
}
```

## Adding a New Language

To add a new language:

1. Create a new JSON file in `js/i18n/` with the appropriate language code (e.g., `fr.json` for French).
2. Copy the structure from `template.json` and translate all strings.
3. Add the language to the dropdown in HTML:
   ```html
   <select id="language-select">
     <!-- Existing languages -->
     <option value="fr">Français</option>
   </select>
   ```
4. Add the language code to the `supportedLanguages` array in `i18n.js`.

## For Developers

### Using the i18n System in JavaScript

The i18n system exposes a global object (`window.i18n`) that you can use in your scripts:

```javascript
// Get a translation by key
const title = window.i18n.getTranslation('services.header.title');

// Get a formatted translation with variables
const greeting = window.i18n.formatTranslation('user.greeting', { name: 'John' });
// If the translation is "Hello, {{name}}!", this will return "Hello, John!"

// Change the language programmatically
window.i18n.changeLanguage('es');
```

### Adding Dynamic Content

For dynamically generated content, you can use the utility function:

```javascript
// Using the global utility function
const translatedText = window.vci.translate('key.to.translation');

// Example: Creating a new element with translated content
const newElement = document.createElement('div');
newElement.textContent = window.vci.translate('dynamic.content');
document.body.appendChild(newElement);
```

### Listening for Language Changes

You can listen for language changes to update dynamic content:

```javascript
document.addEventListener('languageChanged', (event) => {
  const newLanguage = event.detail.language;
  // Update your dynamic content here
});
```

## Translation Management Tools

The project includes a Node.js script (`tools/translation-tools.js`) to help manage translations:

### Setup

```bash
cd tools
npm install cheerio glob
```

### Usage

```bash
# Extract translation keys from HTML files
node translation-tools.js extract

# Check for missing translations across all language files
node translation-tools.js check

# Generate a template file for translators
node translation-tools.js template
```

## Best Practices

1. **Keep keys organized**: Follow the established naming convention to keep the translation system maintainable.

2. **Use placeholders for dynamic content**: For content that includes variables, use placeholders like `{{name}}` and the `formatTranslation` method.

3. **Avoid hardcoded text**: All user-visible text should use the i18n system, not just major content.

4. **Test all languages**: Verify that the layout works with all languages, especially those that might be longer or use different characters.

5. **Proper RTL support**: Our system now supports right-to-left languages (Hebrew, Arabic, and Persian). The RTL styling is automatically applied when these languages are selected. Key considerations:
   - Text alignment and flow direction are reversed
   - UI elements like buttons, navigation, and forms are mirrored
   - Icons and imagery that imply direction are flipped
   - Special font stacks are used for better rendering
   - Special attention to bidirectional content (e.g., English terms within Arabic text)

6. **Update all languages simultaneously**: When adding new content, update all language files at the same time to prevent missing translations.

7. **Font considerations**: Different languages may require different font stacks for optimal readability. Our CSS includes language-specific font stacks.

8. **Cultural adaptation**: Beyond translation, be mindful of cultural differences in imagery, icons, and examples used in content.

## SEO Considerations

The system sets the `lang` attribute on the `<html>` element when the language changes, which helps search engines understand the page language. For optimal SEO:

1. Consider using separate URLs for each language (e.g., `/es/services.html` for Spanish) for better indexing.

2. Add `hreflang` links in the `<head>` section to indicate language alternatives:
   ```html
   <link rel="alternate" hreflang="es" href="https://visionclarityinstitute.com/es/services.html">
   ```

3. Include the language in your XML sitemap with `<xhtml:link>` elements.

## Performance Considerations

The i18n system is designed to be lightweight, but keep these tips in mind:

1. Translation files are loaded on-demand to minimize initial load times.

2. Consider preloading the most common language files if your analytics show a clear preference pattern.

3. For very large sites, consider splitting translation files by page or section.
