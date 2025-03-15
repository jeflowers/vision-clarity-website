# Vision Clarity Institute - Custom Fonts

This directory contains custom font files used throughout the Vision Clarity Institute website.

## Font Usage Guidelines

- Primary Font: Montserrat - Used for headings and titles
- Secondary Font: Open Sans - Used for body text and general content
- Accent Font: Roboto - Used for buttons and call-to-action elements

## Implementation

Import the fonts in the main CSS file using @font-face rules or via Google Fonts with appropriate fallbacks.

```css
/* Example implementation */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Roboto:wght@400;500&display=swap');

:root {
  --font-primary: 'Montserrat', sans-serif;
  --font-secondary: 'Open Sans', sans-serif;
  --font-accent: 'Roboto', sans-serif;
}
```

## Font License Information

All fonts used are licensed under the Open Font License or are open-source alternatives.