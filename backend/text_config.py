"""
Centralized text configuration for the healthcare chatbot application.
All hardcoded strings should be defined here for easy maintenance and localization.
"""

# System Messages
class SystemMessages:
    # API Messages
    HEALTH_CHECK_MESSAGE = "Healthcare Chatbot API is running"
    ERROR_PROCESSING_CHAT = "Error processing chat message"
    ERROR_ADDING_DOCUMENT = "Error adding document"
    ERROR_POPULATING_QUESTIONNAIRES = "Error populating questionnaires"
    
    # Database Messages
    PATIENT_NOT_FOUND = "Patient not found"
    QUESTIONNAIRE_NOT_FOUND = "Questionnaire not found"
    DOCUMENT_NOT_FOUND = "Document not found"
    
    # Success Messages
    QUESTIONNAIRES_POPULATED = "Questionnaires populated successfully"

# AI System Prompts
class AIPrompts:
    SYSTEM_PROMPT_BASE = """You are a helpful healthcare chatbot assistant. You have access to patient data and healthcare guidelines.

Guidelines for responses:
1. Always prioritize patient safety and recommend consulting healthcare professionals
2. Use the provided patient context and relevant documents to give personalized advice
3. Be clear about what information is from patient records vs general guidelines
4. Never provide specific medical diagnoses - only general health information
5. Encourage patients to consult their doctors for medical concerns"""

    CONFIDENCE_INSTRUCTION = """
IMPORTANT: At the end of your response, provide a confidence score from 0.0 to 1.0 
indicating how confident you are that your response adequately addresses the user's query.
Format: [CONFIDENCE: X.X] where X.X is a number between 0.0 and 1.0"""

    SYSTEM_PROMPT_WITH_CONFIDENCE = SYSTEM_PROMPT_BASE + CONFIDENCE_INSTRUCTION

# Context Labels
class ContextLabels:
    PATIENT_INFORMATION = "Patient Information"
    ASSIGNED_DOCTOR = "Assigned Doctor"
    RELEVANT_GUIDELINES = "Relevant Guidelines"
    USER_QUERY = "User Query"
    CONTEXT = "Context"

# Error Messages
class ErrorMessages:
    EMBEDDING_ERROR = "Error getting embedding"
    QUESTIONNAIRE_ERROR = "Error finding questionnaire"
    GREETING_ERROR = "Error getting greetings from database"
    HEALTH_KEYWORDS_ERROR = "Error getting health keywords from database"
    PROCESSING_ERROR = "Error processing questionnaire response"
    PATIENT_CONTEXT_ERROR = "Error getting patient context"
    DOCTOR_CONTEXT_ERROR = "Error getting doctor context"
    OPENAI_ERROR = "Error generating OpenAI response"
    VECTOR_STORE_WARNING = "Warning: Failed to add document {title} to vector store"

# Log Messages
class LogMessages:
    AI_CONFIDENCE_LOW = "AI confidence too low ({confidence:.2f}), searching local database..."
    OPENAI_FAILED = "OpenAI failed, searching local database"
    FALLBACK_SYSTEM = "OpenAI failed, using fallback system"

# Default Values
class DefaultValues:
    CONFIDENCE_THRESHOLD = 0.6
    DEFAULT_CONFIDENCE = 0.5
    MAX_TOKENS = 500
    TEMPERATURE = 0.7
    MODEL_NAME = "gpt-3.5-turbo"
    
    # Default responses
    ADMIN_SETUP_MESSAGE = "I'm your healthcare assistant. Please contact the administrator to set up questionnaires."
    AFFECTED_AREA = "the affected area"
    HEALTH_CONCERN = "your health concern"
    PREFERRED_DOCTOR = "your preferred doctor"
    PREFERRED_TIME = "your preferred time"
    YOUR_MEDICATION = "your medication"
    CONSULT_DOCTOR = "please consult your doctor or pharmacist"

# Health Keywords
class HealthKeywords:
    GREETINGS = ["hello", "hi", "hey"]
    HEALTH_ISSUES = ["pain", "ache", "hurt", "sore", "fever", "headache", "cough", "nausea", "appointment", "medication", "emergency"]
    
    # Pain locations
    PAIN_LOCATIONS = {
        "head": ["head", "headache", "head pain", "skull", "temple"],
        "chest": ["chest", "chest pain", "heart", "breast"],
        "back": ["back", "spine", "lower back", "upper back"],
        "stomach": ["stomach", "abdomen", "belly", "tummy", "gut"],
        "leg": ["leg", "legs", "thigh", "calf", "foot", "feet"],
        "arm": ["arm", "arms", "hand", "hands", "shoulder"]
    }
    
    # Duration keywords
    DURATION_KEYWORDS = {
        "a few minutes": ["few minutes", "just started", "recently"],
        "a few hours": ["few hours", "couple hours", "this morning", "this afternoon"],
        "a day": ["today", "yesterday", "one day", "24 hours"],
        "a few days": ["few days", "couple days", "since monday", "since tuesday"],
        "a week": ["week", "7 days", "since last week"]
    }

# User Choice Mappings
class UserChoices:
    CHOICE_MAPPINGS = {
        "1": "general health information",
        "one": "general health information",
        "general health": "general health information",
        "2": "appointment booking",
        "two": "appointment booking",
        "appointment": "appointment booking",
        "3": "emergency assistance",
        "three": "emergency assistance",
        "emergency": "emergency assistance",
        "4": "medication questions",
        "four": "medication questions",
        "medication": "medication questions",
        "5": "something else",
        "five": "something else",
        "something else": "something else"
    }

# Pain Level Recommendations
class PainRecommendations:
    RECOMMENDATIONS = {
        "high": "immediate medical attention",
        "moderate_high": "seeing a doctor today",
        "moderate": "monitoring and possibly seeing a doctor if it persists",
        "low": "rest and over-the-counter pain relief"
    }
    
    PAIN_LEVELS = {
        "high": 8,
        "moderate_high": 6,
        "moderate": 4
    }

# Fever Advice
class FeverAdvice:
    ADVICE = {
        "high": "immediate medical attention - this is a high fever",
        "moderate": "monitor closely and consider seeing a doctor",
        "normal": "rest, stay hydrated, and monitor"
    }
    
    TEMPERATURE_LEVELS = {
        "high": 103,
        "moderate": 101
    }

# Template Placeholders
class TemplatePlaceholders:
    PLACEHOLDERS = [
        "{user_choice}", "{pain_level}", "{temperature}", "{pain_location}",
        "{recommendation}", "{fever_advice}", "{duration}", "{appointment_type}",
        "{doctor_preference}", "{appointment_timing}", "{medication_name}",
        "{medication_response}", "{cough_type}", "{cough_advice}", "{headache_location}",
        "{severity}", "{headache_advice}", "{vomiting_status}", "{nausea_advice}",
        "{user_topic}", "{general_advice}"
    ]

# Database Categories
class DatabaseCategories:
    GENERAL = "general"
    SYMPTOMS = "symptoms"
    APPOINTMENT = "appointment"
    EMERGENCY = "emergency"
    MEDICATION = "medication"

# Confidence Patterns
class ConfidencePatterns:
    CONFIDENCE_REGEX = r'\[CONFIDENCE:\s*(\d+\.?\d*)\]'
    CONFIDENCE_REPLACEMENT = r'\s*\[CONFIDENCE:\s*\d+\.?\d*\]'
