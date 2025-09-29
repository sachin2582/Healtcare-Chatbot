import { apiService } from './api';

class ChatService {
  constructor() {
    this.messageHistory = [];
    this.currentSession = null;
  }

  // Send a message and get response
  async sendMessage(message, patientId = null, doctorId = null, sessionId = null) {
    try {
      const response = await apiService.sendMessage(message, patientId, doctorId);
      
      // Store message in history
      const chatMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date(),
        patientId,
        doctorId
      };

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        fallbackMode: response.fallback_mode,
        currentQuestion: response.current_question,
        sessionId: response.session_id,
        patientContext: response.patient_context,
        doctorContext: response.doctor_context,
        retrievedDocuments: response.retrieved_documents
      };

      this.messageHistory.push(chatMessage, botResponse);
      
      return {
        userMessage: chatMessage,
        botResponse: botResponse,
        fullResponse: response
      };
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Return error message
      const errorResponse = {
        id: Date.now(),
        type: 'bot',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
        timestamp: new Date(),
        error: true
      };

      return {
        userMessage: null,
        botResponse: errorResponse,
        error: {
          message: error?.message || error?.toString() || 'An unknown error occurred'
        }
      };
    }
  }

  // Get message history
  getMessageHistory() {
    return this.messageHistory;
  }

  // Clear message history
  clearHistory() {
    this.messageHistory = [];
  }

  // Get last N messages
  getLastMessages(count = 10) {
    return this.messageHistory.slice(-count);
  }

  // Check if chatbot is in fallback mode
  isInFallbackMode() {
    const lastBotMessage = this.messageHistory
      .filter(msg => msg.type === 'bot')
      .pop();
    return lastBotMessage?.fallbackMode || false;
  }

  // Get current session info
  getCurrentSession() {
    return this.currentSession;
  }

  // Set current session
  setCurrentSession(session) {
    this.currentSession = session;
  }

  // Generate conversation summary
  getConversationSummary() {
    const userMessages = this.messageHistory.filter(msg => msg.type === 'user');
    const botMessages = this.messageHistory.filter(msg => msg.type === 'bot');
    
    return {
      totalMessages: this.messageHistory.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      duration: this.messageHistory.length > 0 ? 
        this.messageHistory[this.messageHistory.length - 1].timestamp - this.messageHistory[0].timestamp : 0,
      fallbackMode: this.isInFallbackMode(),
      lastActivity: this.messageHistory.length > 0 ? 
        this.messageHistory[this.messageHistory.length - 1].timestamp : null
    };
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;
