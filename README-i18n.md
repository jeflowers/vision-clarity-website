# Vision Clarity Institute Website Internationalization Architecture

## Overview

The Vision Clarity Institute website implements a comprehensive internationalization (i18n) and localization (l10n) architecture to serve patients in the Los Angeles area, where many languages are spoken. This document outlines the components and best practices implemented in our multilingual solution.

## Core Components

### 1. Internationalization (i18n) Module

The core internationalization functionality is managed by the `i18n.js` module, which handles:

- Loading and applying translations based on user language preferences
- Managing language selection and persistence
- Applying translations to DOM elements using data-i18n attributes
- Handling right-to-left (RTL) languages like Hebrew, Arabic, and Persian
- Providing fallback mechanisms when translations are missing

### 2. Language Detection

The `language-detector.js` module provides intelligent language selection based on:

- User preferences stored in localStorage
- Geolocation data for Los Angeles area neighborhoods (with language preferences mapped to regions)
- Browser language preferences
- Default language fallback (English)

### 3. Font Management

The `font-loader.js` module automatically loads appropriate fonts based on the selected language, ensuring proper text rendering for all supported scripts:

- Latin scripts (English, Spanish, etc.)
- Chinese (Simplified)
- Korean
- Armenian
- Hebrew (with RTL support)
- Russian
- Persian/Farsi (with RTL support)
- Arabic (with RTL support)

### 4. Cultural Adaptation

The `content-localizer.js` module goes beyond simple text translation to provide culturally relevant content:

- Adapting imagery to cultural preferences (e.g., individual vs. family focus)
- Adjusting testimonial styles based on cultural expectations
- Customizing form fields based on cultural communication norms
- Formatting numbers and currency according to locale conventions
- Emphasizing different aspects of medical credentials based on cultural values

### 5. Accessibility Enhancement

The `accessibility-i18n.js` module ensures that our multilingual site remains fully accessible:

- Screen reader optimizations with language-specific announcements
- Proper language tagging for screen readers
- Handling mixed language content (e.g., English terms in non-English contexts)
- Setting up appropriate ARIA labels and live regions for dynamic content
- Managing directionality for RTL languages

### 6. SEO Optimization

The `hreflang-manager.js` module optimizes multilingual SEO by:

- Adding appropriate hreflang tags for all supported languages
- Implementing canonical URLs for language variants
- Managing x-default language indicators
- Providing proper language region variants (e.g., en-US, es-US)

## Translation Files

All translations are stored in JSON files in the `js/i18n/` directory, organized by language code:

- `en.json` - English (default)
- `es.json` - Spanish
- `zh.json` - Chinese (Simplified)
- `ko.json` - Korean
- `hy.json` - Armenian
- `he.json` - Hebrew
- `tl.json` - Tagalog/Filipino
- `ru.json` - Russian
- `fa.json` - Persian/Farsi
- `ar.json` - Arabic

Translation files use a nested structure with dot notation for keys, allowing for organization by page and component.

## HTML Implementation

HTML elements use the `data-i18n` attribute to specify the translation key:

```html
<h1 data-i18n="services.header.title">Our Services</h1>
<p data-i18n="services.header.subtitle">Advanced vision correction procedures tailored to your needs</p>
```

## Language Selection

The language selection is provided via a dropdown in the header:

```html
<div class="language-selector">
    <select id="language-select" aria-label="Select Language">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
        <option value="ko">한국어</option>
        <option value="hy">Հայերեն</option>
        <!-- Additional languages -->
    </select>
</div>
```

## Cultural Adaptation Example

Images and content can be culturally adapted using data attributes:

```html
<div class="hero-image" data-imagery-variants='{"individual":"path/to/individual-focus.jpg","family":"path/to/family-focus.jpg","technology":"path/to/tech-focus.jpg","default":"path/to/default.jpg"}'>
    <img src="path/to/default.jpg" alt="Vision Clarity Institute">
</div>
```

## Usage Guidelines

### Adding New Translations

1. Create a new JSON file in the `js/i18n/` directory named with the language code (e.g., `ja.json` for Japanese)
2. Copy the structure from `en.json` and translate each string value
3. Add the language to the supported languages array in the i18n modules
4. Add the language option to the language selector dropdown

### Adding Translatable Content

1. Add the `data-i18n` attribute to HTML elements that need translation
2. Use dot notation to organize keys (e.g., `page.section.element`)
3. Add the translation keys and values to each language JSON file

### RTL Language Support

For right-to-left (RTL) languages (Hebrew, Arabic, Persian):

1. Add the language code to the `rtlLanguages` array in `i18n.js`
2. Ensure CSS supports RTL layouts (using the `.rtl` class that's automatically added to the body)
3. Test text alignment, navigation, and UI components in RTL mode

## Testing

All internationalization features should be tested using:

1. Browser language preference testing
2. Manual language switching
3. Geolocation spoofing for regional preferences
4. Screen reader compatibility testing
5. RTL layout verification
6. Font loading and rendering tests across devices

## Performance Considerations

- Translation files are loaded on demand for the selected language
- Fonts are loaded only when needed for the current language
- Cached language preferences minimize repeated API calls
- Regional language detection leverages browser caching

## Browser Support

The internationalization system is compatible with all modern browsers (Chrome, Firefox, Safari, Edge) and degrades gracefully in older browsers by falling back to the default language if advanced features are not supported.
