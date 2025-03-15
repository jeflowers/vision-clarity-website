# Vision Clarity Institute Website

A modern, responsive website for Vision Clarity Institute, a Lasik eye surgery provider. This website is designed with a clean, professional aesthetic inspired by NVIDIA's design principles.

## Features

- Responsive design that works on all devices
- Multi-language support (English, Spanish, Chinese, Korean, Armenian)
- Interactive AI chatbot for patient assistance with both OpenAI and Claude AI support
- Toggle between different AI models for diverse response styles
- Clean, intuitive navigation

## Technical Stack

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js with Express
- AI Integration: OpenAI API and Claude AI API

## Project Structure

```
vision-clarity-website/
│
├── api/                 # API implementation
│   └── chatbot-api.js   # Chatbot API endpoints (OpenAI and Claude)
│
├── index.html           # Main entry point
├── styles.css           # Main styles
├── chatbot.css          # Chatbot-specific styles
├── scripts.js           # Main JavaScript
├── chatbot.js           # Chatbot implementation
├── server.js            # Express server
└── .env.example         # Environment variables template
```

## Setup and Installation

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
   Edit the `.env` file and add your OpenAI and/or Claude API keys.

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## AI Integration

The website features a dual AI chatbot implementation supporting both OpenAI and Claude AI models:

- Users can toggle between AI providers via the UI switch
- OpenAI responses are concise and direct
- Claude AI responses are more detailed with better paragraph structure
- The system will fall back to demo mode if API keys are not configured

## Demo Mode

When running without valid API keys, the chatbot will operate in demo mode with pre-written responses for common questions about Lasik surgery. This allows for testing and demonstration without requiring API credentials.

## License

This project is proprietary and confidential. All rights reserved by Vision Clarity Institute.