// Vision Clarity Institute - Server Implementation
// Express server for handling static files and API requests

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const path = require('path');
const chatbotApi = require('./api/chatbot-api');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '')));

// API routes
app.use('/api', chatbotApi);

// Serve index.html for all other routes to support SPA behavior
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Website available at http://localhost:${PORT}`);
});