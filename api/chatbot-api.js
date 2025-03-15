// Vision Clarity Institute - Chatbot API Handler
// Server-side implementation for secure API communication with OpenAI and Claude AI

// Load environment variables
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const axios = require('axios');

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Claude API base URL
const CLAUDE_API_BASE_URL = 'https://api.anthropic.com/v1/messages';

/**
 * API endpoint for chatbot communication
 * Receives chat history and returns AI response based on selected provider
 */
router.post('/chat', async (req, res) => {
    try {
        // Extract request data
        const { 
            messages, 
            provider = 'openai', 
            model = provider === 'openai' ? 'gpt-4-turbo' : 'claude-3-5-sonnet', 
            max_tokens = 250, 
            temperature = 0.7 
        } = req.body;
        
        // Validate request
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }
        
        let response;
        
        if (provider === 'openai') {
            // Call OpenAI API
            response = await openai.chat.completions.create({
                model,
                messages,
                max_tokens,
                temperature,
            });
            
            // Return the OpenAI response
            res.json({
                message: response.choices[0].message,
                usage: response.usage,
                provider: 'openai'
            });
        } else if (provider === 'claude') {
            // Format messages for Claude API
            const systemMessage = messages.find(msg => msg.role === 'system');
            const userMessages = messages.filter(msg => msg.role !== 'system');
            
            // Convert chat history to Claude format
            const claudeMessages = [];
            
            for (let i = 0; i < userMessages.length; i++) {
                const message = userMessages[i];
                if (message.role === 'user') {
                    claudeMessages.push({
                        role: 'user',
                        content: message.content
                    });
                } else if (message.role === 'assistant') {
                    claudeMessages.push({
                        role: 'assistant',
                        content: message.content
                    });
                }
            }
            
            // Call Claude API
            const claudeResponse = await axios.post(
                CLAUDE_API_BASE_URL,
                {
                    model,
                    messages: claudeMessages,
                    system: systemMessage ? systemMessage.content : null,
                    max_tokens,
                    temperature
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.CLAUDE_API_KEY,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );
            
            // Return the Claude response
            res.json({
                message: {
                    role: 'assistant',
                    content: claudeResponse.data.content[0].text
                },
                usage: claudeResponse.data.usage,
                provider: 'claude'
            });
        } else {
            return res.status(400).json({ error: 'Invalid AI provider specified' });
        }
    } catch (error) {
        console.error('AI API Error:', error);
        
        // Handle different types of errors
        if (error.response) {
            // API error
            res.status(error.response.status).json({
                error: error.response.data.error?.message || 'API error occurred'
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
    const openAIKey = process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured';
    const claudeKey = process.env.CLAUDE_API_KEY ? 'Configured' : 'Not configured';
    
    res.json({
        status: 'online',
        service: 'Vision Clarity Chatbot API',
        version: '1.1.0',
        providers: {
            openai: openAIKey,
            claude: claudeKey
        }
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