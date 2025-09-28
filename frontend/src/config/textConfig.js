/**
 * Centralized text configuration for the frontend
 * All hardcoded strings should be defined here for easy maintenance and localization
 */

// Application Branding
export const BRANDING = {
  APP_NAME: "Fortis Care",
  AI_NAME: "HealthCare AI",
  TAGLINE: "Your trusted healthcare companion",
  WELCOME_TITLE: "Welcome to Fortis Care",
  WELCOME_SUBTITLE: "Ask health questions, understand treatment plans, or get guidance from Fortis specialists. Select a patient profile and preferred doctor for tailored support.",
  AI_WELCOME_TITLE: "Welcome to HealthCare AI",
  AI_WELCOME_SUBTITLE: "Hello! I'm your healthcare assistant. How can I help you today?",
  AI_WELCOME_QUESTION: "Are you looking for:"
};

// UI Messages
export const UI_MESSAGES = {
  // Chat Interface
  PLACEHOLDER_MESSAGE: "Type your message...",
  CONSULTING_FOR: "Consulting for",
  PREFERRED_SPECIALIST: "Preferred specialist:",
  
  // Quick Actions
  QUICK_ACTIONS: {
    HEADACHE: "I have a headache",
    APPOINTMENT: "I need an appointment", 
    FEVER: "I have a fever",
    EMERGENCY: "Emergency help"
  },
  
  // Labels
  HEADACHE_LABEL: "Headache",
  APPOINTMENT_LABEL: "Appointment",
  FEVER_LABEL: "Fever", 
  EMERGENCY_LABEL: "Emergency",
  
  // Tags
  TAGS: {
    SYMPTOMS: "Symptoms",
    MEDICATIONS: "Medications", 
    APPOINTMENTS: "Appointments",
    EMERGENCY: "Emergency"
  },
  
  // Welcome Button Options
  WELCOME_OPTIONS: {
    GENERAL_HEALTH: {
      label: "Book a Health Checkup",
      description: "Browse and book comprehensive health checkup packages",
      icon: "🏥",
      action: "I want to book a health checkup"
    },
    APPOINTMENT: {
      label: "Appointment Booking", 
      description: "Schedule or manage your medical appointments",
      icon: "📅",
      action: "I need to book an appointment"
    },
    EMERGENCY: {
      label: "Emergency Assistance",
      description: "Get immediate help for urgent medical situations",
      icon: "🚨",
      action: "I need emergency assistance"
    },
    CALLBACK: {
      label: "Request a Callback",
      description: "Get a callback from our healthcare executive",
      icon: "📞",
      action: "I want to request a callback"
    },
    OTHER: {
      label: "Something Else",
      description: "Ask any other health-related questions",
      icon: "❓",
      action: "I have other questions"
    }
  },

  // Greeting Responses
  GREETING_RESPONSES: {
    WELCOME_MESSAGE: "Hello! Welcome to Fortis Healthcare. I'm your AI health assistant.",
    HELP_QUESTION: "How can I assist you today? Please select from the options below:",
    GREETING_PATTERNS: [
      "hi", "hello", "hey", "good morning", "good afternoon", "good evening",
      "greetings", "howdy", "hi there", "hello there", "hey there"
    ]
  },

  // Appointment Flow Messages
  APPOINTMENT_FLOW: {
    SELECT_SPECIALITY: "Please select a medical speciality for your appointment:",
    SELECT_DOCTOR: "Choose a doctor for your appointment:",
    BOOK_APPOINTMENT: "Book your appointment with the selected doctor:",
    APPOINTMENT_BOOKED: "Your appointment has been successfully booked!",
    CONFIRMATION_NUMBER: "Confirmation Number",
    APPOINTMENT_DATE: "Appointment Date",
    APPOINTMENT_TIME: "Appointment Time",
    DOCTOR_NAME: "Doctor",
    SPECIALITY: "Speciality"
  }
};

// Service Descriptions
export const SERVICES = [
  {
    icon: "🏥",
    title: "24/7 Healthcare Support",
    description: "Get instant medical guidance and support anytime, anywhere with our AI-powered healthcare assistant."
  },
  {
    icon: "👨‍⚕️", 
    title: "Expert Doctor Consultation",
    description: "Connect with qualified healthcare professionals for personalized medical advice and treatment."
  },
  {
    icon: "📋",
    title: "Health Assessment", 
    description: "Comprehensive health questionnaires to help assess your symptoms and provide appropriate guidance."
  },
  {
    icon: "💊",
    title: "Medication Management",
    description: "Get information about medications, dosages, and potential interactions with expert guidance."
  }
];

// Fallback Data
export const FALLBACK_DOCTORS = [
  {
    id: 1,
    name: "Dr. Emily Chen",
    specialization: "Internal Medicine", 
    experience: "15 years",
    image: "/api/placeholder/150/150"
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    specialization: "Cardiology",
    experience: "12 years", 
    image: "/api/placeholder/150/150"
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    specialization: "Pediatrics",
    experience: "10 years",
    image: "/api/placeholder/150/150"
  }
];

// Error Messages
export const ERROR_MESSAGES = {
  LOADING_ERROR: "Error loading data",
  NETWORK_ERROR: "Network error. Please check your connection.",
  GENERIC_ERROR: "Something went wrong. Please try again."
};

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: "Loading...",
  SENDING: "Sending...",
  PROCESSING: "Processing..."
};

// Button Labels
export const BUTTON_LABELS = {
  START_CHAT: "Start Chat",
  CLOSE: "Close",
  SEND: "Send",
  RETRY: "Retry"
};

// Status Messages
export const STATUS_MESSAGES = {
  CONNECTED: "Connected",
  DISCONNECTED: "Disconnected", 
  TYPING: "Typing...",
  ONLINE: "Online",
  OFFLINE: "Offline"
};
