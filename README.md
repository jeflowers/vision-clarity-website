# Vision Clarity Institute Website

## Project Overview

Vision Clarity Institute's website is a modern, responsive web application designed to provide comprehensive information about advanced laser vision correction services. Built with a focus on user experience, accessibility, and multilingual support, the website serves as a critical digital touchpoint for patients seeking vision correction solutions.

## Key Features

### Technical Architecture
- **Frontend**: Responsive HTML5, CSS3, and modern JavaScript
- **Backend**: Node.js with Express.js
- **Internationalization**: Comprehensive multi-language support
- **AI Integration**: OpenAI-powered chatbot for patient assistance

### Multilingual Capabilities
- Supported Languages:
  - English
  - Spanish
  - Chinese
  - Korean
  - Armenian

### Primary Functionalities
- Detailed service descriptions
- Interactive AI chatbot
- Responsive design
- Multilingual content management
- Secure API integrations

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jeflowers/vision-clarity-website.git
   cd vision-clarity-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration details

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Internationalization Workflow

### Adding/Updating Translations

1. Add `data-i18n` attributes to HTML elements:
   ```html
   <h1 data-i18n="services.header.title">Our Services</h1>
   ```

2. Extract translation keys:
   ```bash
   npm run extract-translations
   ```

3. Translate the generated JSON files in the `locales/` directory

### Language Management
- Automatic browser language detection
- Persistent language preference
- Fallback to default language (English)

## API Integration

### Chatbot API
The website integrates an AI-powered chatbot using OpenAI's GPT models to provide interactive patient support.

### Security Considerations
- Secure API communication
- Environment-based configuration
- Error handling and logging

## Project Structure

```
vision-clarity-website/
│
├── js/                 # JavaScript files
│   ├── i18n.js         # Internationalization management
│   └── chatbot.js      # Chatbot functionality
│
├── css/                # Stylesheets
│   ├── styles.css      # Global styles
│   └── chatbot.css     # Chatbot-specific styles
│
├── locales/            # Translation files
│   ├── en.json         # English translations
│   ├── es.json         # Spanish translations
│   └── ...             # Other language translations
│
├── pages/              # HTML page templates
│   ├── services.html
│   ├── contact.html
│   └── ...             
│
├── api/                # Backend API handlers
│   └── chatbot-api.js  # Chatbot API implementation
│
├── assets/             # Media and design assets
│   ├── images/
│   └── icons/
│
└── server.js           # Main server configuration
```

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## Localization Best Practices
- Use translation keys consistently
- Avoid hardcoding text
- Provide context for translators
- Test translations across different languages

## Performance Optimization
- Lazy loading of translation files
- Caching of translation resources
- Minimal overhead for language switching

## Licensing

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For inquiries, please contact:
- Vision Clarity Institute
- Email: tech@visionclarityinstitute.com

## Roadmap

- [ ] Expand language support
- [ ] Implement locale-specific formatting
- [ ] Enhanced AI chatbot capabilities
- [ ] Comprehensive accessibility improvements