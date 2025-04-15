/**
 * Vision Clarity Institute - Chatbot Module
 */

// Check if ChatbotManager already exists
if (!window.ChatbotManager) {
  window.ChatbotManager = {
    initialized: false,
    
    init: function() {
      // Prevent multiple initializations
      if (this.initialized) {
        console.log('ChatbotManager already initialized');
        return;
      }
      
      this.initialized = true;
      console.log('Initializing ChatbotManager');
      
      // Setup chat interface
      this.setupChatInterface();
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
    
    sendMessage: function(message, chatMessages) {
      if (!message.trim()) return;
      
      // Add user message to chat
      this.addMessage('user', message, chatMessages);
      
      // Process message and generate response
      setTimeout(() => {
        const response = this.generateResponse(message);
        this.addMessage('bot', response, chatMessages);
      }, 500);
    },
    
    addMessage: function(sender, text, chatMessages) {
      const messageElement = document.createElement('div');
      messageElement.className = `chat-message ${sender}-message`;
      messageElement.textContent = text;
      
      chatMessages.appendChild(messageElement);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    
    generateResponse: function(message) {
      // Simple responses for demo purposes
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
