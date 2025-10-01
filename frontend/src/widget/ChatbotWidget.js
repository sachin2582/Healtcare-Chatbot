// Standalone chatbot widget for embedding on other websites
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ChatbotWidget.css';

const ChatbotWidget = {
  init: (config) => {
    const {
      containerId = 'chatbot-widget',
      apiUrl,
      clientId,
      apiKey,
      position = 'bottom-right',
      theme = 'default',
      title = 'Healthcare Assistant'
    } = config;

    // Create widget container
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = `chatbot-widget-container ${position}`;
      document.body.appendChild(container);
    }

    // Render the chatbot component
    ReactDOM.render(
      <ChatbotWidgetComponent 
        apiUrl={apiUrl}
        clientId={clientId}
        apiKey={apiKey}
        theme={theme}
        title={title}
      />,
      container
    );
  }
};

const ChatbotWidgetComponent = ({ apiUrl, clientId, apiKey, theme, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async (message) => {
    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Client-ID': clientId
        },
        body: JSON.stringify({
          message: message,
          client_id: clientId
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, 
        { id: Date.now(), content: message, sender: 'user' },
        { id: Date.now() + 1, content: data.response, sender: 'bot' }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`chatbot-widget ${theme}`}>
      {!isOpen ? (
        <button 
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
        >
          💬
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>{title}</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.content}
              </div>
            ))}
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(inputMessage);
                  setInputMessage('');
                }
              }}
              placeholder="Type your message..."
            />
            <button onClick={() => {
              sendMessage(inputMessage);
              setInputMessage('');
            }}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
  window.ChatbotWidget = ChatbotWidget;
}




