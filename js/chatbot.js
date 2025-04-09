// Vision Clarity Institute - AI Chatbot Implementation
// Supporting both OpenAI and Claude AI integration

// Configuration object for chatbot settings
const chatbotConfig = {
    // API configuration
    openAI: {
        apiKey: 'YOUR_OPENAI_API_KEY', // Replace with actual API key in production
        model: 'gpt-4-turbo', // OpenAI model selection
        maxTokens: 250,
        temperature: 0.7
    },
    claude: {
        apiKey: 'YOUR_CLAUDE_API_KEY', // Replace with actual API key in production
        model: 'claude-3-5-sonnet', // Claude model selection
        maxTokens: 250,
        temperature: 0.7
    },
    // General configuration
    activeAI: 'claude', // 'openai' or 'claude'
    elementId: 'vision-clarity-chatbot',
    systemMessage: 'You are a helpful assistant for Vision Clarity Institute, a Lasik eye surgery provider. Provide concise, accurate information about Lasik procedures, recovery, consultation process, and general eye health. Recommend scheduling a consultation for specific medical advice.',
    initialMessage: 'Hello! I'm your Vision Clarity virtual assistant. How can I help you with your Lasik surgery questions today?'
};

// Class for handling chatbot functionality
class VisionClarityChatbot {
    constructor(config) {
        this.config = config;
        this.chatHistory = [];
        this.isOpen = false;
        this.isLoading = false;
        
        // Initialize on DOM load
        document.addEventListener('DOMContentLoaded', () => this.initialize());
    }
    
    // Set up chatbot UI and event listeners
    initialize() {
        this.createChatbotUI();
        this.setupEventListeners();
        this.addSystemMessage();
    }
    
    // Create chatbot interface elements
    createChatbotUI() {
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = this.config.elementId;
        chatbotContainer.className = 'vision-clarity-chatbot';
        
        // Create chatbot button
        const chatbotButton = document.createElement('button');
        chatbotButton.className = 'chatbot-button';
        chatbotButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2">
                <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"></path>
            </svg>
        `;
        
        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
            <div class="chat-header">
                <svg height="24" width="24" viewBox="0 0 24 24" fill="#76b900" class="chat-logo">
                    <circle cx="12" cy="12" r="10" fill="#76b900"/>
                    <path d="M8 12 L16 12 M12 8 L12 16" stroke="white" stroke-width="2"/>
                </svg>
                <span>Vision Clarity Assistant</span>
                <div class="ai-toggle-container">
                    <label class="ai-toggle">
                        <input type="checkbox" id="ai-toggle-checkbox" ${this.config.activeAI === 'claude' ? 'checked' : ''}>
                        <span class="ai-toggle-slider"></span>
                        <span class="ai-toggle-label">${this.config.activeAI === 'claude' ? 'Claude' : 'GPT'}</span>
                    </label>
                </div>
                <button class="close-chat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-container">
                <textarea class="chat-input" placeholder="Type your question here..." rows="1"></textarea>
                <button class="send-button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        `;
        
        // Append elements to container
        chatbotContainer.appendChild(chatWindow);
        chatbotContainer.appendChild(chatbotButton);
        
        // Add to page
        document.body.appendChild(chatbotContainer);
        
        // Store references to DOM elements
        this.chatbotButton = chatbotButton;
        this.chatWindow = chatWindow;
        this.messagesContainer = chatWindow.querySelector('.chat-messages');
        this.chatInput = chatWindow.querySelector('.chat-input');
        this.sendButton = chatWindow.querySelector('.send-button');
        this.closeButton = chatWindow.querySelector('.close-chat');
        this.aiToggle = chatWindow.querySelector('#ai-toggle-checkbox');
        this.aiToggleLabel = chatWindow.querySelector('.ai-toggle-label');
    }
    
    // Set up event handlers
    setupEventListeners() {
        // Toggle chat window
        this.chatbotButton.addEventListener('click', () => this.toggleChatWindow());
        this.closeButton.addEventListener('click', () => this.toggleChatWindow());
        
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key (except with Shift key)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
            
            // Auto-resize textarea
            this.resizeInput();
        });
        
        // Resize input as user types
        this.chatInput.addEventListener('input', () => this.resizeInput());
        
        // Toggle between AI providers
        this.aiToggle.addEventListener('change', () => {
            this.config.activeAI = this.aiToggle.checked ? 'claude' : 'openai';
            this.aiToggleLabel.textContent = this.aiToggle.checked ? 'Claude' : 'GPT';
            
            // Add a system message indicating the AI change
            this.addMessage('system', `Switched to ${this.config.activeAI === 'claude' ? 'Claude AI' : 'OpenAI GPT'} for responses.`);
        });
    }
    
    // Add initial system message to chat history (not visible to user)
    addSystemMessage() {
        this.chatHistory.push({
            role: 'system',
            content: this.config.systemMessage
        });
        
        // Add welcome message from assistant
        this.addMessage('assistant', this.config.initialMessage);
    }
    
    // Display chat window
    toggleChatWindow() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.add('active');
            this.chatbotButton.classList.add('hidden');
            this.chatInput.focus();
        } else {
            this.chatWindow.classList.remove('active');
            this.chatbotButton.classList.remove('hidden');
        }
    }
    
    // Add a message to the chat interface
    addMessage(role, content) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${role}-message`;
        
        // Create message bubble with appropriate icon
        let iconSvg = '';
        if (role === 'assistant') {
            iconSvg = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#76b900" stroke="none">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12 L16 12 M12 8 L12 16" stroke="white" stroke-width="2"/>
                </svg>
            `;
        } else if (role === 'user') {
            iconSvg = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#555" stroke="none">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="8" r="4" fill="white"/>
                    <path d="M20 19v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1c0-3.314 3.582-6 8-6s8 2.686 8 6z" fill="white"/>
                </svg>
            `;
        } else if (role === 'system') {
            iconSvg = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#888" stroke="none">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4m0 4h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `;
        }
        
        messageElement.innerHTML = `
            <div class="message-avatar">${iconSvg}</div>
            <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom of chat
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Add to chat history
        if (role !== 'thinking' && role !== 'system') {
            this.chatHistory.push({
                role: role,
                content: content
            });
        }
    }
    
    // Send user message and get AI response
    async sendMessage() {
        const userMessage = this.chatInput.value.trim();
        
        if (userMessage === '' || this.isLoading) return;
        
        // Add user message to chat
        this.addMessage('user', userMessage);
        
        // Clear input
        this.chatInput.value = '';
        this.resizeInput();
        
        // Show thinking indicator
        this.isLoading = true;
        const thinkingMessage = document.createElement('div');
        thinkingMessage.className = 'chat-message assistant-message thinking';
        thinkingMessage.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#76b900" stroke="none">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12 L16 12 M12 8 L12 16" stroke="white" stroke-width="2"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(thinkingMessage);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        try {
            // Get response from selected AI provider
            const response = await this.getAIResponse(userMessage);
            
            // Remove thinking indicator
            this.messagesContainer.removeChild(thinkingMessage);
            
            // Display AI response
            this.addMessage('assistant', response);
        } catch (error) {
            // Remove thinking indicator
            this.messagesContainer.removeChild(thinkingMessage);
            
            // Show error message
            this.addMessage('assistant', 'I apologize, but I encountered an error processing your request. Please try again or contact our support team for assistance.');
            console.error('Chatbot error:', error);
        }
        
        this.isLoading = false;
    }
    
    // Get response from AI API based on selected provider
    async getAIResponse(userMessage) {
        // For GitHub Pages demonstration, we'll use simulated responses
        // In production, you would make actual API calls to your backend
        
        // Simulated response delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log which AI provider is being used
        console.log(`Using ${this.config.activeAI} for response`);
        
        // Sample responses based on user input and selected AI provider
        if (userMessage.toLowerCase().includes('cost') || userMessage.toLowerCase().includes('price')) {
            if (this.config.activeAI === 'claude') {
                return "The cost of Lasik surgery at Vision Clarity Institute ranges from $1,800 to $2,500 per eye. This pricing varies based on your specific vision correction needs and the technology selected for your procedure. We offer multiple financing options with monthly payment plans to make treatment accessible.\n\nFor a precise quote tailored to your situation, we recommend scheduling a complimentary consultation. During this appointment, our specialists will evaluate your eyes and provide a detailed breakdown of all costs involved in your treatment plan.";
            } else {
                return "The cost of Lasik surgery at Vision Clarity Institute typically ranges from $1,800 to $2,500 per eye, depending on your specific vision needs and the technology used. We offer financing options and flexible payment plans. For an exact quote, we recommend scheduling a free consultation where we can evaluate your specific case.";
            }
        } else if (userMessage.toLowerCase().includes('recovery') || userMessage.toLowerCase().includes('healing')) {
            if (this.config.activeAI === 'claude') {
                return "Most patients experience noticeable vision improvement within 24-48 hours after Lasik surgery. Your recovery timeline typically follows this pattern:\n\nDay of procedure: You'll need a designated driver to take you home after surgery. We recommend resting with your eyes closed for several hours following the procedure.\n\nFirst 48 hours: Most patients can return to work and normal activities, though you might experience some mild discomfort, slight blurriness, or sensitivity to light.\n\nFirst week: You'll have a follow-up appointment to verify proper healing. Most visual side effects diminish significantly during this period.\n\nFirst 3-6 months: Your vision continues to stabilize, with complete healing typically occurring within this timeframe.\n\nOur team provides comprehensive post-operative instructions and schedules appropriate follow-up visits to ensure optimal healing and results.";
            } else {
                return "Most patients experience improved vision within 24-48 hours after Lasik surgery. You'll need someone to drive you home after the procedure, and you should plan to rest for the remainder of that day. Many patients return to work within 1-2 days. Complete healing may take 3-6 months, though most stabilization occurs within the first few weeks. We provide detailed aftercare instructions and schedule follow-up visits to monitor your progress.";
            }
        } else if (userMessage.toLowerCase().includes('consultation') || userMessage.toLowerCase().includes('appointment')) {
            if (this.config.activeAI === 'claude') {
                return "We would be pleased to arrange a consultation for you at Vision Clarity Institute. Our comprehensive consultations are complimentary and take approximately 90 minutes.\n\nDuring your appointment, our specialists will:\n\n1. Conduct a series of diagnostic tests to evaluate your eye health and vision\n2. Discuss your specific vision correction goals\n3. Determine if you're an appropriate candidate for Lasik surgery\n4. Answer all your questions regarding the procedure\n5. Provide personalized recommendations for your vision correction\n\nTo schedule your consultation, please call our dedicated patient care team at (800) 555-2020, or use the convenient online scheduling tool on our Contact page. We offer weekday, evening, and select weekend appointments to accommodate your schedule.";
            } else {
                return "We'd be happy to schedule a consultation for you! Our comprehensive consultations are free and take approximately 90 minutes. During this appointment, our specialists will perform diagnostic tests, discuss your vision goals, and determine if you're a candidate for Lasik. You can schedule by calling (800) 555-2020 or using our online scheduling tool on the Contact page.";
            }
        } else {
            if (this.config.activeAI === 'claude') {
                return `Thank you for your inquiry about ${userMessage.toLowerCase().split(' ').slice(0, 3).join(' ')}. To provide you with the most accurate and personalized information regarding your specific situation, I recommend scheduling a complimentary consultation with one of our vision specialists.\n\nOur experienced team can thoroughly assess your unique visual needs, answer your specific questions, and provide tailored recommendations based on your eye health and vision correction goals.\n\nWould you like information about scheduling a consultation? I'd be happy to explain our consultation process or address any other questions you might have about our services.`;
            } else {
                return "Thank you for your question about " + userMessage.toLowerCase().split(' ').slice(0, 3).join(' ') + "... To provide you with the most accurate information specific to your situation, I'd recommend scheduling a free consultation with one of our eye specialists. They can address your unique concerns and provide personalized recommendations. Would you like information about scheduling a consultation?";
            }
        }
    }
    
    // Auto-resize the input textarea
    resizeInput() {
        // Reset height to auto to get the correct scrollHeight
        this.chatInput.style.height = 'auto';
        
        // Set new height based on content (with max height)
        const newHeight = Math.min(this.chatInput.scrollHeight, 120);
        this.chatInput.style.height = newHeight + 'px';
    }
}

// Initialize chatbot
const visionClarityChatbot = new VisionClarityChatbot(chatbotConfig);
