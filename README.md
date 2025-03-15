# Vision Clarity Institute Website

## Overview

The Vision Clarity Institute website is a modern, responsive platform for a premium Lasik eye surgery provider. The design follows NVIDIA's clean and professional design principles while offering comprehensive information about vision correction services, technologies, and patient resources.

## Key Features

### Professional Design
- Responsive layout optimized for all devices
- Clean, modern aesthetic with professional typography and color scheme
- Consistent navigation and user experience across all pages

### Comprehensive Content Structure
- Detailed service descriptions with treatment options
- Technology showcase highlighting advanced equipment
- Location finder with interactive map and clinic information
- Streamlined contact forms for consultation scheduling

### Interactive Elements
- AI-powered chatbot with dual AI capabilities (OpenAI and Claude)
- Interactive testimonial slider
- Location search functionality
- Dynamic FAQ accordions

### Multilingual Support
- Complete translations for English and Spanish
- Partial support for Chinese, Korean, and Armenian
- Structured localization system using i18next

## Technology Stack

### Frontend
- HTML5/CSS3 for structure and styling
- JavaScript (ES6+) for interactive features
- Responsive design principles with mobile-first approach

### Backend
- Node.js with Express for server implementation
- RESTful API endpoints for chatbot and contact form processing

### AI Integration
- Dual AI provider support (OpenAI GPT and Claude)
- Real-time chat interface with toggle between AI providers
- Context-aware responses based on vision care knowledge

## Project Structure

```
vision-clarity-website/
│
├── index.html              # Main HTML document with site structure
│
├── styles.css              # Global stylesheet containing all site styling
│
├── scripts.js              # JavaScript file for interactive functionality
│
├── chatbot.js              # Chatbot implementation with OpenAI/Claude support
│
├── chatbot.css             # Chatbot-specific styling
│
├── server.js               # Express server implementation
│
├── api/                    # Directory for API implementations
│   └── chatbot-api.js      # Chatbot API supporting multiple AI providers
│
├── assets/                 # Directory for all media assets
│   ├── images/             # Image files for the site
│   │   ├── logo.svg        # Vision Clarity logo
│   │   ├── hero/           # Hero section images
│   │   └── icons/          # UI icons (search, arrows, etc.)
│   │
│   └── fonts/              # Custom font files and documentation
│
├── pages/                  # Additional HTML pages
│   ├── services.html       # Detailed service descriptions
│   ├── technology.html     # Information about Lasik technology
│   ├── locations.html      # Clinic locations page
│   └── contact.html        # Contact information and form
│
└── locales/                # Localization resources
    ├── en/                 # English translations
    ├── es/                 # Spanish translations
    ├── zh/                 # Chinese translations
    ├── ko/                 # Korean translations
    └── hy/                 # Armenian translations
```

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeflowers/vision-clarity-website.git
   cd vision-clarity-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to add your API keys for OpenAI and Claude.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **View the website**
   Open your browser and navigate to `http://localhost:3000`

## AI Chatbot Implementation

The website features a sophisticated chatbot that can switch between OpenAI and Claude AI models. This provides flexibility in response styles and ensures fallback capability if one service is unavailable.

### Key Chatbot Features

- **Toggle Between AI Providers**: Users can switch between OpenAI and Claude with a simple UI toggle.
- **Different Response Styles**: OpenAI provides concise, direct responses while Claude offers more detailed explanations with better paragraph structure.
- **Context-Aware Responses**: The chatbot has domain knowledge about Lasik procedures, recovery processes, and common patient questions.
- **Demo Mode Fallback**: If API keys are not configured, the system falls back to pre-written responses for demonstration purposes.

## Multilingual Support

The website implements comprehensive language support using a structured JSON-based translation system.

- Language selection is available in the site header
- Translations are organized by page and component
- The system dynamically loads the appropriate language file based on user selection

## Deployment

The website can be deployed to any standard Node.js hosting environment:

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## License

This project is proprietary and confidential. All rights reserved by Vision Clarity Institute.

---

© 2025 Vision Clarity Institute