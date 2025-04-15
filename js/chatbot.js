/**
 * Vision Clarity Institute - Chatbot Module
 * Securely loads environment variables and API keys
 */

// Check if ChatbotManager already exists
if (!window.ChatbotManager) {
  window.ChatbotManager = {
    initialized: false,
    config: {
      apiKey: null,
      apiEndpoint: null,
      environment: 'production'
    },
    
    init: async function() {
      // Prevent multiple initializations
      if (this.initialized) {
        console.log('ChatbotManager already initialized');
        return;
      }
      
      console.log('Initializing ChatbotManager');
      
      // Load environment configuration securely
      await this.loadEnvironmentConfig();
      
      // Only continue if we successfully loaded the required configuration
      if (this.config.apiKey && this.config.apiEndpoint) {
        this.initialized = true;
        this.setupChatInterface();
      } else {
        console.error('Failed to initialize ChatbotManager: Missing API configuration');
      }
    },
    
    loadEnvironmentConfig: async function() {
      try {
        // Determine the correct environment config path
        const rootPath = this.getRootPath();
        let configPath;
        
        // Use different config sources based on environment
        if (window.location.hostname.includes('github.io')) {
          // For GitHub Pages, we use a special endpoint that serves config securely
          configPath = `${rootPath}api/config`;
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          // For local development
          configPath = `${rootPath}config/env.local.json`;
        } else {
          // For production environment
          configPath = `${rootPath}api/env`;
        }
        
        console.log(`Loading chatbot configuration from: ${configPath}`);
        
        // Add a cache buster to prevent caching of sensitive config
        const cacheBuster = `?_=${new Date().getTime()}`;
        const response = await fetch(configPath + cacheBuster);
        
        if (!response.ok) {
          throw new Error(`Failed to load environment config (Status: ${response.status})`);
        }
        
        const config = await response.json();
        
        // Validate required config fields
        if (!config.apiKey || !config.apiEndpoint) {
          throw new Error('Missing required configuration: apiKey or apiEndpoint');
        }
        
        // Store config securely
        this.config = {
          ...this.config,
          ...config
        };
        
        console.log('Successfully loaded chatbot configuration');
        return true;
      } catch (error) {
        console.error('Error loading environment configuration:', error);
        
        // In production, we should handle this gracefully
        if (this.isProduction()) {
          // Disable chatbot functionality rather than showing an error to users
          this.disableChatbot();
        }
        
        return false;
      }
    },
    
    isProduction: function() {
      return window.location.hostname !== 'localhost' && 
             window.location.hostname !== '127.0.0.1' &&
             !window.location.hostname.includes('.test') &&
             !window.location.hostname.includes('.dev');
    },
    
    disableChatbot: function() {
      // Hide chatbot UI elements
      const chatbot = document.getElementById('chatbot');
      const chatToggle = document.getElementById('chat-toggle');
      
      if (chatbot) chatbot.style.display = 'none';
      if (chatToggle) chatToggle.style.display = 'none';
    },
    
    getRootPath: function() {
      // If on GitHub Pages, use the repository-specific path
      if (window.location.hostname.includes('github.io')) {
        return '/vision-clarity-website/';
      }
      
      // Check if we're in a subdirectory
      const path = window.location.pathname;
      if (path.includes('/pages/')) {
        return '../';
      }
      
      return './';
    },
    
    setupChatInterface: function() {
      // Get chat elements
      const chatbot = document.getElementById('chatbot');
      if (!chatbot) return;
      
      const chatToggle = document.getElementById('chat-toggle');
      const chatMessages = document.getElementById('chat-messages');
      const chatInput = document.getElementById('chat-input');
      const chatSend = document.getElementById('chat-send');
      
      // Setup toggle functionality
      if (chatToggle) {
        chatToggle.addEventListener('click', () => {
          chatbot.classList.toggle('active');
        });
      }
      
      // Setup send functionality
      if (chatInput && chatSend) {
        // Send message on button click
        chatSend.addEventListener('click', () => {
          this.sendMessage(chatInput.value, chatMessages);
          chatInput.value = '';
        });
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            this.sendMessage(chatInput.value, chatMessages);
            chatInput.value = '';
          }
        });
      }
    },
    
    sendMessage: async function(message, chatMessages) {
      if (!message.trim()) return;
      
      // Add user message to chat
      this.addMessage('user', message, chatMessages);
      
      try {
        // Show typing indicator
        this.showTypingIndicator(chatMessages);
        
        // Process message using the API
        const response = await this.getAIResponse(message);
        
        // Remove typing indicator and add response
        this.hideTypingIndicator(chatMessages);
        this.addMessage('bot', response, chatMessages);
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Remove typing indicator and add error message
        this.hideTypingIndicator(chatMessages);
        this.addMessage('bot', 'I apologize, but I encountered an issue processing your request. Please try again later.', chatMessages);
      }
    },
    
    showTypingIndicator: function(chatMessages) {
      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.innerHTML = '<span></span><span></span><span></span>';
      
      const messageElement = document.createElement('div');
      messageElement.className = 'chat-message bot-message typing';
      messageElement.appendChild(indicator);
      
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    hideTypingIndicator: function(chatMessages) {
      const typingIndicator = chatMessages.querySelector('.typing');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    },
    
    addMessage: function(sender, text, chatMessages) {
      const messageElement = document.createElement('div');
      messageElement.className = `chat-message ${sender}-message`;
      messageElement.textContent = text;
      
      chatMessages.appendChild(messageElement);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    getAIResponse: async function(message) {
      // If in development mode without API access, use mock responses
      if (!this.config.apiKey || this.config.environment === 'development') {
        return this.generateMockResponse(message);
      }
      
      try {
        // Real API call using the securely loaded API key
        const response = await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            message: message,
            user_id: this.getUserIdentifier(),
            context: 'vision_clarity_website'
          })
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response || 'I apologize, but I didn\'t understand. Could you please rephrase your question?';
      } catch (error) {
        console.error('Error calling chatbot API:', error);
        
        // Fallback to mock responses if API fails
        return this.generateMockResponse(message);
      }
    },
    
    getUserIdentifier: function() {
      // Generate a session identifier if one doesn't exist
      let sessionId = sessionStorage.getItem('vci_session_id');
      
      if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('vci_session_id', sessionId);
      }
      
      return sessionId;
    },
    
    generateMockResponse: function(message) {
      // Simple responses for demo purposes or when API is unavailable
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
        return "You can schedule an appointment by calling our office at (800) 555-0123 or by using the Schedule Consultation button at the top of the page.";
      }
      
      if (lowerMessage.includes('lasik') || lowerMessage.includes('surgery')) {
        return "LASIK is a safe and effective procedure that can correct nearsightedness, farsightedness, and astigmatism. Would you like more information about our LASIK procedures?";
      }
      
      if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
        return "The cost of procedures varies based on your specific needs. We offer financing options and accept most insurance plans. Would you like to schedule a consultation to discuss pricing?";
      }
      
      if (lowerMessage.includes('location') || lowerMessage.includes('office')) {
        return "Our main office is located at 123 Vision Way, Los Angeles, CA 90001. We also have satellite offices throughout Southern California. You can find all our locations on the Locations page.";
      }
      
      // Default response
      return "Thank you for your message. If you have questions about our services or would like to schedule a consultation, please call us at (800) 555-0123 or use the Schedule Consultation button above.";
    }
  };
} else {
  console.log('ChatbotManager already defined, using existing instance');
}

// Initialize safely
document.addEventListener('DOMContentLoaded', function() {
  if (window.ChatbotManager && typeof window.ChatbotManager.init === 'function') {
    window.ChatbotManager.init();
  }
});
