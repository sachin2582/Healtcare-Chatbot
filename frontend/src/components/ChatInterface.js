import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Avatar,
  Tooltip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Send, Person, SmartToy, Info, LocalHospital } from '@mui/icons-material';
// Removed date-fns import - using native JavaScript date formatting
import { useAppContext } from '../contexts/AppContext';
import chatService from '../services/chatService';
import callbackService from '../services/callbackService';
import { BRANDING, UI_MESSAGES } from '../config/textConfig';
import AppointmentFlow from './AppointmentFlow';
import HealthPackageBooking from './HealthPackageBooking';

const ChatInterface = ({ selectedDoctor: propSelectedDoctor, onClose, clearChat = false }) => {
  const { patients, doctors } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(propSelectedDoctor?.id || '');
  const [loading, setLoading] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [healthPackageDialogOpen, setHealthPackageDialogOpen] = useState(false);
  const [error, setError] = useState(null);
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

  // Show welcome message on component mount and when clearing chat
  useEffect(() => {
    if (clearChat) {
      setMessages([]);
      setInputMessage('');
      setError(null);
      setLoading(false);
      setAppointmentDialogOpen(false);
      setHealthPackageDialogOpen(false);
      setCallbackFlow(false);
      // Show welcome message after clearing
      setTimeout(() => {
        const welcomeResponse = createGreetingResponse();
        setMessages([welcomeResponse]);
      }, 300);
    } else if (messages.length === 0) {
      // Show welcome message only on initial mount
      const welcomeResponse = createGreetingResponse();
      setMessages([welcomeResponse]);
    }
  }, [clearChat]);

  // Restart conversation function
  const restartConversation = () => {
    setMessages([]);
    setInputMessage('');
    setError(null);
    setLoading(false);
    setAppointmentDialogOpen(false);
    setHealthPackageDialogOpen(false);
    setCallbackFlow(false);
    
    // Show welcome message
    setTimeout(() => {
      const welcomeResponse = createGreetingResponse();
      setMessages([welcomeResponse]);
    }, 300);
  };

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

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    return patient ? patient.name : 'Unknown Patient';
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
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
            mt: 2
          }}>
            {Object.entries(UI_MESSAGES.WELCOME_OPTIONS).map(([key, option]) => (
              <Button
                key={key}
                variant="outlined"
                onClick={() => setInputMessage(option.action)}
                sx={{
                  textTransform: 'none',
                  minHeight: '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#1a365d',
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: '#f8fafc',
                    borderColor: '#1e3c72',
                    color: '#1e3c72',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(30, 60, 114, 0.15)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 6px rgba(30, 60, 114, 0.2)'
                  }
                }}
              >
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <span style={{ 
                    fontSize: '18px',
                    marginBottom: '4px',
                    transition: 'transform 0.2s ease'
                  }}>
                    {option.icon}
                  </span>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    fontSize: '12px',
                    textAlign: 'center',
                    lineHeight: 1.3
                  }}>
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

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    return doctor ? `${doctor.name} (${doctor.specialization})` : 'Unknown Doctor';
  };


  return (
    <Box sx={{
      height: onClose ? '100%' : 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f7fbf8 0%, #ffffff 40%)'
    }}>
      <Paper elevation={0} sx={{
        px: 4,
        py: 3,
        borderRadius: 0,
        borderBottom: '1px solid #e4efe9',
        backgroundColor: 'background.paper',
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                <LocalHospital />
              </Avatar>
              <Box>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Fortis Care Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Personalized guidance from Fortis medical experts
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            {!propSelectedDoctor && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Patient Profile (Optional)</InputLabel>
                  <Select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    label="Patient Profile (Optional)"
                  >
                    <MenuItem value="">
                      <em>General Inquiry</em>
                    </MenuItem>
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id.toString()}>
                        {patient.name} (ID: {patient.id})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Preferred Doctor (Optional)</InputLabel>
                  <Select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    label="Preferred Doctor (Optional)"
                  >
                    <MenuItem value="">
                      <em>No Preference</em>
                    </MenuItem>
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} &mdash; {doctor.specialization}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            )}
          </Grid>
        </Grid>

        {(selectedPatient || selectedDoctor) && (
          <Alert
            severity="info"
            sx={{ mt: 2, borderRadius: 2, alignItems: 'center' }}
            icon={<Info />}
          >
            <Stack spacing={1}>
              {selectedPatient && (
                <span>{UI_MESSAGES.CONSULTING_FOR} <strong>{getPatientName(selectedPatient)}</strong></span>
              )}
              {selectedDoctor && (
                <span>{UI_MESSAGES.PREFERRED_SPECIALIST} <strong>{getDoctorName(selectedDoctor)}</strong></span>
              )}
            </Stack>
          </Alert>
        )}
      </Paper>

      <Box sx={{ flex: 1, overflow: 'auto', px: { xs: 1.5, sm: 4 }, py: 3 }}>
        {messages.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            mt: 6,
            p: 4,
            borderRadius: 3,
            background: 'radial-gradient(circle at top, rgba(15,108,63,0.1), transparent 70%)',
            maxWidth: 500,
            mx: 'auto'
          }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, mb: 2, mx: 'auto' }}>
              <SmartToy fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="primary" gutterBottom>
              {BRANDING.AI_WELCOME_TITLE}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {BRANDING.AI_WELCOME_SUBTITLE}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mb: 3, fontWeight: 500 }}>
              {BRANDING.AI_WELCOME_QUESTION}
            </Typography>
            <Stack spacing={2} sx={{ mt: 3 }}>
              {Object.entries(UI_MESSAGES.WELCOME_OPTIONS).map(([key, option]) => (
                <Button
                  key={key}
                  variant="outlined"
                  fullWidth
                  onClick={() => setInputMessage(option.action)}
                  startIcon={<span style={{ fontSize: '18px' }}>{option.icon}</span>}
                  sx={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    p: 2,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'left', width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {messages.map((message) => (
          <Stack
            key={message.id}
            direction={message.sender === 'user' ? 'row-reverse' : 'row'}
            spacing={1.5}
            alignItems="flex-end"
            sx={{ mb: 2.5 }}
          >
            <Tooltip title={message.sender === 'user' ? 'You' : 'Fortis Care Assistant'}>
              <Avatar sx={{ bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main' }}>
                {message.sender === 'user' ? <Person /> : <LocalHospital />}
              </Avatar>
            </Tooltip>

            <Paper
              elevation={message.sender === 'assistant' ? 1 : 3}
              sx={{
                px: 3,
                py: 2,
                maxWidth: { xs: '85%', md: '65%' },
                background: message.sender === 'user'
                  ? 'linear-gradient(135deg, #ff6f3c 0%, #ff8f5a 100%)'
                  : '#ffffff',
                color: message.sender === 'user' ? '#fff' : 'text.primary',
                borderRadius: message.sender === 'user'
                  ? '22px 22px 4px 22px'
                  : '22px 22px 22px 4px',
                border: message.sender === 'assistant' ? '1px solid #e4efe9' : 'none'
              }}
            >
              {message.isGreetingResponse ? (
                message.content
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {message.content}
                </Typography>
              )}

              {message.patientContext && (
                <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e4efe9', backgroundColor: 'rgba(15,108,63,0.04)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Person fontSize="small" />
                      Patient Summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <strong>Name:</strong> {message.patientContext.name}<br />
                      <strong>Age:</strong> {message.patientContext.age}<br />
                      <strong>Gender:</strong> {message.patientContext.gender}<br />
                      {message.patientContext.diagnosis && (
                        <>
                          <strong>Diagnosis:</strong> {message.patientContext.diagnosis}<br />
                        </>
                      )}
                      {message.patientContext.medications && (
                        <>
                          <strong>Medications:</strong> {message.patientContext.medications}<br />
                        </>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {message.doctorContext && (
                <Card sx={{ mt: 2, borderRadius: 2, border: '1px solid #e4efe9', backgroundColor: 'rgba(15,108,63,0.06)' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="subtitle2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalHospital fontSize="small" />
                      Doctor On Call
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <strong>Name:</strong> {message.doctorContext.name}<br />
                      <strong>Specialization:</strong> {message.doctorContext.specialization}<br />
                      {message.doctorContext.contact && (
                        <>
                          <strong>Contact:</strong> {message.doctorContext.contact}
                        </>
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {message.retrievedDocuments && message.retrievedDocuments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <Info fontSize="small" />
                    Fortis Knowledge Base
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {message.retrievedDocuments.map((doc, index) => (
                      <Chip
                        key={index}
                        label={doc}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1.5, borderColor: 'primary.main', color: 'primary.main' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.6 }}>
                {new Date(message.timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </Typography>
            </Paper>
          </Stack>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Paper sx={{ p: 2, backgroundColor: 'rgba(15,108,63,0.06)', borderRadius: 2, border: '1px solid #e4efe9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToy color="primary" />
                <CircularProgress size={16} color="primary" />
                <Typography variant="body2" color="primary">
                  Fortis Care is reviewing your request...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Paper elevation={0} sx={{
        px: { xs: 2, sm: 4 },
        py: 2.5,
        borderRadius: 0,
        borderTop: '1px solid #e4efe9',
        backgroundColor: 'background.paper'
      }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={UI_MESSAGES.PLACEHOLDER_MESSAGE}
            disabled={loading}
            variant="outlined"
            size="medium"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            sx={{
              background: 'linear-gradient(135deg, #0f6c3f 0%, #13824d 100%)',
              color: '#ffffff',
              p: 2,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #0d5a35 0%, #106c40 100%)'
              }
            }}
          >
            <Send />
          </IconButton>
        </Stack>
        
        {/* Restart Conversation Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button 
            size="small" 
            onClick={restartConversation}
            startIcon={<SmartToy />}
            sx={{
              fontSize: '11px',
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: '20px',
              background: '#f8f9fa',
              color: '#6c757d',
              border: '1px solid #dee2e6',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#e9ecef',
                borderColor: '#1e3c72',
                color: '#1e3c72',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(30, 60, 114, 0.15)'
              }
            }}
          >
            Restart Conversation
          </Button>
        </Box>
      </Paper>

      {/* Appointment Booking Dialog */}
      <AppointmentFlow
        open={appointmentDialogOpen}
        onClose={() => setAppointmentDialogOpen(false)}
        patientId={selectedPatient ? parseInt(selectedPatient) : 1} // Default to patient 1 if none selected
      />
      
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

export default ChatInterface;
