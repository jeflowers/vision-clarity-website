# Vision Clarity Institute - Localization System

## Overview

The Vision Clarity Institute website implements a comprehensive localization system using i18next to support multiple languages. This directory contains translation files for all supported languages.

## Supported Languages

- English (en)
- Spanish (es)
- Chinese (zh)
- Korean (ko)
- Armenian (hy)

## File Structure

Each language has its own directory containing a `translation.json` file with all translatable strings organized by page and component:

```
locales/
  ├── en/
  │   └── translation.json
  ├── es/
  │   └── translation.json
  ├── zh/
  │   └── translation.json
  ├── ko/
  │   └── translation.json
  └── hy/
      └── translation.json
```

## Translation File Format

Each translation file follows a nested JSON structure organized by:

1. Global elements that appear across the site
2. Page-specific content
3. Component-specific content

For example:

```json
{
  "global": {
    "siteName": "Vision Clarity Institute",
    "menu": { ... }
  },
  "home": { ... },
  "services": { ... }
}
```

## Implementation

The localization system is implemented using the following components:

1. **Language Selector**: A dropdown in the header that allows users to switch languages.
2. **i18next Integration**: The `scripts.js` file loads the appropriate language file based on the user's selection or browser preferences.
3. **Content Rendering**: All text content is rendered using translation keys rather than hardcoded strings.

## Adding Translations

To add a new translation:

1. Create a new directory for the language code (e.g., `locales/fr/`)
2. Copy the `translation.json` file from the English version
3. Translate all string values while keeping the keys and structure intact
4. Add the new language option to the language selector in the HTML templates

## Testing Translations

To test a translation:

1. Select the language from the language dropdown in the website header
2. Verify that all text content is correctly translated
3. Check that special characters, right-to-left text, and other language-specific features display correctly

## Maintaining Translations

When adding new content to the website:

1. Add the new content to the English translation file first
2. Use a descriptive, hierarchical key structure
3. Update all other language files with the same keys
4. Have professional translators provide accurate translations for the new content