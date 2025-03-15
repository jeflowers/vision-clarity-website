// Vision Clarity Institute - Chatbot API Handler
// Server-side implementation for secure API communication

// Load environment variables
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * API endpoint for chatbot communication
 * Receives chat history and returns AI response
 */
router.post('/chat', async (req, res) => {
    try {
        // Extract request data
        const { messages, model = 'gpt-4-turbo', max_tokens = 250, temperature = 0.7 } = req.body;
        
        // Validate request
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }
        
        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model,
            messages,
            max_tokens,
            temperature,
        });
        
        // Return the response
        res.json({
            message: response.choices[0].message,
            usage: response.usage
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // Handle different types of errors
        if (error.response) {
            // OpenAI API error
            res.status(error.response.status).json({
                error: error.response.data.error.message
            });
        } else {
            // Server error
            res.status(500).json({
                error: 'An error occurred while processing your request'
            });
        }
    }
});

/**
 * Endpoint to validate the API connection
 * Used for testing API connectivity
 */
router.get('/status', (req, res) => {
    res.json({
        status: 'online',
        service: 'Vision Clarity Chatbot API',
        version: '1.0.0'
    });
});

/**
 * Error handling middleware
 */
router.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

module.exports = router;