import React, { useState, useEffect } from 'react';
import { Box, Fab, Badge, Slide, IconButton, Tooltip } from '@mui/material';
import { Close, SmartToy, LocalHospital } from '@mui/icons-material';
import ProfessionalChatInterface from './ProfessionalChatInterface';
import { useAppContext } from '../contexts/AppContext';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const { patients, doctors, loading } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [clearChat, setClearChat] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Clear unread count when opening
      setClearChat(true); // Trigger chat clearing
      // Reset clearChat after a brief delay to allow the effect to trigger
      setTimeout(() => setClearChat(false), 100);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Simulate new messages for demo (in real app, this would come from WebSocket or polling)
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setUnreadCount(prev => prev + 1);
      }, 30000); // Add unread count every 30 seconds when closed
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keep chatbot always visible - no scroll-based hiding
  // The button will maintain its fixed position regardless of scroll

  if (loading) {
    return null; // Don't render until data is loaded
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Slide direction="up" in={isVisible} timeout={300}>
        <Box className={`floating-chatbot-container ${isOpen ? 'chat-open' : ''}`}>
          <Tooltip 
            title="Need help? Chat with our AI assistant!" 
            placement="left" 
            arrow 
            open={!isOpen && unreadCount === 0}
            PopperProps={{
              disablePortal: true,
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -10],
                  },
                },
              ],
            }}
          >
            <Fab
              className={`floating-chat-button ${isOpen ? 'open' : ''}`}
              onClick={toggleChat}
              color="primary"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #0f6c3f 0%, #1a8c5a 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1a8c5a 0%, #0f6c3f 100%)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(15, 108, 63, 0.3)',
              }}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                invisible={unreadCount === 0}
              >
                <SmartToy />
              </Badge>
            </Fab>
          </Tooltip>
        </Box>
      </Slide>

      {/* Chat Widget */}
      <Slide direction="up" in={isOpen} timeout={300}>
        <Box className={`chat-widget ${isOpen ? 'open' : ''}`}>
          <Box className="chat-widget-header">
            <Box className="chat-header-content">
              <LocalHospital className="chat-icon" />
              <Box className="chat-header-text">
                <h3>HealthCare AI Assistant</h3>
                <p>Personalized guidance from medical experts</p>
              </Box>
            </Box>
            <IconButton 
              onClick={handleClose} 
              className="chat-close-button"
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
          
          <Box className="chat-widget-content">
            <ProfessionalChatInterface 
              onClose={handleClose}
              isModal={true}
              clearChat={clearChat}
            />
          </Box>
        </Box>
      </Slide>
    </>
  );
};

export default FloatingChatbot;
