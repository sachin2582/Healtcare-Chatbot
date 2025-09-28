import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { 
  Send, 
  Person, 
  SmartToy, 
  LocalHospital,
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
// Removed date-fns import - using native JavaScript date formatting
import { useAppContext } from '../contexts/AppContext';
import chatService from '../services/chatService';
import callbackService from '../services/callbackService';
import { BRANDING, UI_MESSAGES } from '../config/textConfig';
import AppointmentFlow from './AppointmentFlow';
import HealthPackageBooking from './HealthPackageBooking';
import './ProfessionalChatInterface.css';

const ProfessionalChatInterface = ({ selectedDoctor: propSelectedDoctor, onClose, isModal = false, clearChat = false }) => {
  const { patients, doctors } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(propSelectedDoctor?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [healthPackageDialogOpen, setHealthPackageDialogOpen] = useState(false);
  const [callbackFlow, setCallbackFlow] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (propSelectedDoctor) {
      setSelectedDoctor(propSelectedDoctor.id);
    }
  }, [propSelectedDoctor]);

  // Clear chat when clearChat prop is true
  useEffect(() => {
    if (clearChat) {
      setMessages([]);
      setInputMessage('');
      setError(null);
      setLoading(false);
      setAppointmentDialogOpen(false);
      setHealthPackageDialogOpen(false);
      setCallbackFlow(false);
    }
  }, [clearChat]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setLoading(true);
    setError(null);

    // Check if it's a greeting and respond with buttons
    if (isGreeting(currentMessage)) {
      setTimeout(() => {
        const greetingResponse = createGreetingResponse();
        setMessages(prev => [...prev, greetingResponse]);
        setLoading(false);
      }, 500); // Small delay for better UX
      return;
    }

    // Check if it's a callback request
    if (currentMessage.toLowerCase().includes('request a callback') || 
        currentMessage.toLowerCase().includes('callback') ||
        currentMessage.toLowerCase().includes('call back') ||
        currentMessage.toLowerCase().includes('call me back')) {
      
      setTimeout(() => {
        setCallbackFlow(true);
        const callbackResponse = {
          id: Date.now() + 1,
          content: "Can I have your mobile number?",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, callbackResponse]);
        setLoading(false);
      }, 500);
      return;
    }

    // Handle mobile number input in callback flow
    if (callbackFlow) {
      const validation = callbackService.validateMobileNumber(currentMessage);
      
      if (!validation.isValid) {
        setTimeout(() => {
          const errorResponse = {
            id: Date.now() + 1,
            content: validation.message + " Please provide a valid mobile number.",
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorResponse]);
          setLoading(false);
        }, 500);
        return;
      }

      // Valid mobile number - save to database
      try {
        const callbackData = {
          mobile_number: currentMessage,
          notes: 'Callback request from chatbot'
        };
        
        const response = await callbackService.createCallbackRequest(callbackData);
        
        setTimeout(() => {
          const successResponse = {
            id: Date.now() + 1,
            content: response.message,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, successResponse]);
          setCallbackFlow(false);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        setTimeout(() => {
          const errorResponse = {
            id: Date.now() + 1,
            content: "Sorry, there was an error processing your callback request. Please try again later.",
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorResponse]);
          setCallbackFlow(false);
          setLoading(false);
        }, 500);
      }
      return;
    }

    // Check if it's a health checkup package request
    if (currentMessage.toLowerCase().includes('health checkup') || 
        currentMessage.toLowerCase().includes('health package') ||
        currentMessage.toLowerCase().includes('health screening') ||
        currentMessage.toLowerCase().includes('medical test') ||
        currentMessage.toLowerCase().includes('lab test') ||
        currentMessage.toLowerCase().includes('general health information')) {
      
      setTimeout(() => {
        setHealthPackageDialogOpen(true);
        setLoading(false);
      }, 500);
      return;
    }

    // Check if it's an appointment request
    if (currentMessage.toLowerCase().includes('appointment') || 
        currentMessage.toLowerCase().includes('book') ||
        currentMessage.toLowerCase().includes('schedule')) {
      setTimeout(() => {
        setAppointmentDialogOpen(true);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const result = await chatService.sendMessage(
        currentMessage,
        selectedPatient ? parseInt(selectedPatient) : null,
        selectedDoctor ? parseInt(selectedDoctor) : null
      );

      if (result.error) {
        setError(result.error.message || 'Failed to send message');
        setMessages(prev => [...prev, result.botResponse]);
      } else {
        setMessages(prev => [...prev, result.botResponse]);
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
      
      const errorMessage = {
        id: Date.now() + 1,
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
        sender: 'assistant',
        timestamp: new Date(),
        error: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleOptionClick = (optionText) => {
    // Set the clicked option as the input message and send it
    setInputMessage(optionText);
    // Auto-send the message
    setTimeout(() => {
      const userMessage = {
        id: Date.now(),
        content: optionText,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      chatService.sendMessage(
        optionText,
        selectedPatient ? parseInt(selectedPatient) : null,
        selectedDoctor ? parseInt(selectedDoctor) : null
      ).then(result => {
        if (result.error) {
          setError(result.error.message || 'Failed to send message');
          setMessages(prev => [...prev, result.botResponse]);
        } else {
          setMessages(prev => [...prev, result.botResponse]);
        }
        setLoading(false);
      }).catch(err => {
        setError('Failed to send message. Please try again.');
        console.error('Error sending message:', err);
        
        const errorMessage = {
          id: Date.now() + 1,
          content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.',
          sender: 'assistant',
          timestamp: new Date(),
          error: true
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
      });
    }, 100);
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    return patient ? patient.name : 'Unknown Patient';
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    return doctor ? `${doctor.name} (${doctor.specialization})` : 'Unknown Doctor';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Check if message is a greeting
  const isGreeting = (message) => {
    const greetingPatterns = UI_MESSAGES.GREETING_RESPONSES.GREETING_PATTERNS;
    const lowerMessage = message.toLowerCase().trim();
    return greetingPatterns.some(pattern => lowerMessage.includes(pattern));
  };

  // Create greeting response with buttons
  const createGreetingResponse = () => {
    return {
      id: Date.now(),
      content: (
        <Box>
          <Typography variant="body1" sx={{ mb: 2, color: '#2d3748' }}>
            {UI_MESSAGES.GREETING_RESPONSES.WELCOME_MESSAGE}
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#4a5568' }}>
            {UI_MESSAGES.GREETING_RESPONSES.HELP_QUESTION}
          </Typography>
          <Box className="welcome-options">
            {Object.entries(UI_MESSAGES.WELCOME_OPTIONS).map(([key, option]) => (
              <Button
                key={key}
                variant="outlined"
                className="welcome-option-button"
                onClick={() => setInputMessage(option.action)}
                sx={{
                  textTransform: 'none',
                  minHeight: '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box className="option-content">
                  <span className="option-icon">{option.icon}</span>
                  <Typography className="option-label">
                    {option.label}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      ),
      sender: 'assistant',
      timestamp: new Date(),
      isGreetingResponse: true
    };
  };


  return (
    <Box className={`professional-chat-container ${isModal ? 'modal' : ''}`}>
      {/* Chat Header */}
      <Box className="chat-header">
        <Box className="header-left">
          <Avatar className="chat-avatar">
            <LocalHospital />
          </Avatar>
          <Box className="header-info">
            <Typography variant="h6" className="chat-title">
              HealthCare AI Assistant
            </Typography>
            <Typography variant="body2" className="chat-subtitle">
              {selectedDoctor ? `Consulting with ${getDoctorName(selectedDoctor)}` : 'Online now'}
            </Typography>
          </Box>
        </Box>
        <Box className="header-actions">
          <IconButton 
            size="small" 
            onClick={() => setIsMinimized(!isMinimized)}
            className="minimize-btn"
          >
            {isMinimized ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
          {onClose && (
            <IconButton size="small" onClick={onClose} className="close-btn">
              <Close />
            </IconButton>
          )}
        </Box>
      </Box>

      {!isMinimized && (
        <>
          {/* Context Information */}
          {(selectedPatient || selectedDoctor) && (
            <Box className="context-bar">
              <Stack direction="row" spacing={1} alignItems="center">
                {selectedPatient && (
                  <Chip
                    icon={<Person />}
                    label={`Patient: ${getPatientName(selectedPatient)}`}
                    size="small"
                    className="context-chip"
                  />
                )}
                {selectedDoctor && (
                  <Chip
                    icon={<LocalHospital />}
                    label={`Doctor: ${getDoctorName(selectedDoctor)}`}
                    size="small"
                    className="context-chip doctor"
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Messages Area */}
          <Box className="messages-container">
            {messages.length === 0 && (
              <Box className="welcome-message">
                <Card className="welcome-card">
                  <CardContent>
                    <Avatar className="welcome-avatar">
                      <SmartToy />
                    </Avatar>
                    <Typography variant="h6" className="welcome-title">
                      {BRANDING.AI_WELCOME_TITLE}
                    </Typography>
                    <Typography variant="body2" className="welcome-text">
                      {BRANDING.AI_WELCOME_SUBTITLE}
                    </Typography>
                    <Typography variant="body2" className="welcome-question">
                      {BRANDING.AI_WELCOME_QUESTION}
                    </Typography>
                    <Box className="welcome-options">
                      {Object.entries(UI_MESSAGES.WELCOME_OPTIONS).map(([key, option]) => (
                        <Button
                          key={key}
                          variant="outlined"
                          className="welcome-option-button"
                          onClick={() => setInputMessage(option.action)}
                          startIcon={<span className="option-icon">{option.icon}</span>}
                        >
                          <Box className="option-content">
                            <Typography variant="body2" className="option-label">
                              {option.label}
                            </Typography>
                            <Typography variant="caption" className="option-description">
                              {option.description}
                            </Typography>
                          </Box>
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {messages.map((message) => (
              <Box
                key={message.id}
                className={`message-wrapper ${message.sender}`}
              >
                <Box className="message-bubble">
                  {message.isGreetingResponse ? (
                    message.content
                  ) : (
                    <Typography className="message-content">
                      {message.content.split('\n').map((line, index) => {
                        // Check if line contains numbered options
                        const optionMatch = line.match(/^(\d+)\)\s*(.+)/);
                        if (optionMatch) {
                          const [, number, text] = optionMatch;
                          return (
                            <div key={index} style={{ marginBottom: '4px' }}>
                              <button
                                className="option-link"
                                onClick={() => handleOptionClick(text)}
                                style={{
                                  color: message.sender === 'user' ? 'white' : '#1e3c72'
                                }}
                              >
                                {number}) {text}
                              </button>
                            </div>
                          );
                        }
                        return <div key={index}>{line}</div>;
                      })}
                    </Typography>
                  )}
                  
                  {/* Show current question if available */}
                  {message.sender === 'assistant' && message.currentQuestion && (
                    <Box className="follow-up-question">
                      <Typography variant="body2" className="question-text">
                        {message.currentQuestion}
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Show fallback mode indicator */}
                  {message.sender === 'assistant' && message.fallbackMode && (
                    <Chip
                      label="Using Health Guidelines"
                      size="small"
                      className="fallback-indicator"
                      sx={{ fontSize: '10px', height: '18px', mt: 0.5 }}
                    />
                  )}
                </Box>
                <Typography variant="caption" className="message-time">
                  {formatTime(message.timestamp)}
                </Typography>
              </Box>
            ))}

            {loading && (
              <Box className="message-wrapper assistant">
                <Box className="message-bubble">
                  <Box className="typing-indicator">
                    <CircularProgress size={14} />
                    <Typography variant="body2" className="typing-text">
                      AI Assistant is typing...
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {error && (
              <Alert severity="error" className="error-alert">
                {error}
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box className="input-container">
            <Box className="input-wrapper">
              <TextField
                fullWidth
                multiline
                maxRows={2}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={UI_MESSAGES.PLACEHOLDER_MESSAGE}
                variant="outlined"
                className="message-input"
                disabled={loading}
                size="small"
              />
              <IconButton
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="send-button"
                size="small"
              >
                {loading ? <CircularProgress size={16} color="inherit" /> : <Send />}
              </IconButton>
            </Box>
            
            {/* Quick Actions */}
            <Box className="quick-actions">
              <Button size="small" onClick={() => setInputMessage(UI_MESSAGES.QUICK_ACTIONS.HEADACHE)}>
                {UI_MESSAGES.HEADACHE_LABEL}
              </Button>
              <Button size="small" onClick={() => setInputMessage(UI_MESSAGES.QUICK_ACTIONS.APPOINTMENT)}>
                {UI_MESSAGES.APPOINTMENT_LABEL}
              </Button>
              <Button size="small" onClick={() => setInputMessage('I want to book a health checkup')}>
                Health Checkup
              </Button>
              <Button size="small" onClick={() => setInputMessage(UI_MESSAGES.QUICK_ACTIONS.FEVER)}>
                {UI_MESSAGES.FEVER_LABEL}
              </Button>
              <Button size="small" onClick={() => setInputMessage(UI_MESSAGES.QUICK_ACTIONS.EMERGENCY)}>
                {UI_MESSAGES.EMERGENCY_LABEL}
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Appointment Booking Dialog */}
      <AppointmentFlow
        open={appointmentDialogOpen}
        onClose={() => setAppointmentDialogOpen(false)}
        patientId={selectedPatient ? parseInt(selectedPatient) : 1} // Default to patient 1 if none selected
      />
      
      {/* Health Package Booking Dialog */}
      <Dialog
        open={healthPackageDialogOpen}
        onClose={() => setHealthPackageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        fullScreen={false}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospital sx={{ color: '#1e3c72' }} />
            Health Checkup Packages
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, minHeight: '70vh' }}>
          <HealthPackageBooking
            onBookingComplete={(result) => {
              setHealthPackageDialogOpen(false);
              // Show success message in chat
              const successMessage = {
                id: Date.now(),
                content: (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 2, color: '#2d3748' }}>
                      ✅ Health package booked successfully!
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Package:</strong> {result.package_name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Confirmation:</strong> {result.confirmation_number}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Amount:</strong> ₹{result.total_amount}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {result.booking_date} at {result.booking_time}
                    </Typography>
                  </Box>
                ),
                sender: 'assistant',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, successMessage]);
            }}
            onBack={() => setHealthPackageDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProfessionalChatInterface;
