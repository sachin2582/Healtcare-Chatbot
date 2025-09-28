import openai
from typing import List, Dict, Optional
import uuid
import json
import re
from config import OPENAI_API_KEY, EMBEDDING_MODEL
from sqlalchemy.orm import Session
from models import Patient, Document, Doctor, Questionnaire, ChatSession
from text_config import (
    SystemMessages, AIPrompts, ContextLabels, ErrorMessages, LogMessages,
    DefaultValues, HealthKeywords, UserChoices, PainRecommendations,
    FeverAdvice, TemplatePlaceholders, DatabaseCategories, ConfidencePatterns
)
from llm_service import llm_service

# Initialize OpenAI client
openai.api_key = OPENAI_API_KEY

class EnhancedRAGService:
    def __init__(self):
        # Simple in-memory document storage for demo
        self.documents = []
    
    def get_embedding(self, text: str) -> List[float]:
        """Get embedding for text using OpenAI"""
        try:
            response = openai.embeddings.create(
                input=text,
                model=EMBEDDING_MODEL
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"{ErrorMessages.EMBEDDING_ERROR}: {e}")
            return []
    
    def find_matching_questionnaire(self, query: str, db: Session) -> Optional[Questionnaire]:
        """Find the best matching questionnaire based on keywords"""
        try:
            # Get all active questionnaires ordered by priority
            questionnaires = db.query(Questionnaire).filter(
                Questionnaire.is_active == True
            ).order_by(Questionnaire.priority.asc()).all()
            
            query_lower = query.lower()
            
            for questionnaire in questionnaires:
                keywords = [kw.strip().lower() for kw in questionnaire.trigger_keywords.split(',')]
                
                # Check if any keyword matches
                for keyword in keywords:
                    if keyword in query_lower:
                        return questionnaire
            
            return None
        except Exception as e:
            print(f"{ErrorMessages.QUESTIONNAIRE_ERROR}: {e}")
            return None
    
    def has_placeholders(self, template: str) -> bool:
        """Check if the template contains placeholders that need user input"""
        placeholders = TemplatePlaceholders.PLACEHOLDERS[:4]  # First 4 placeholders
        return any(placeholder in template for placeholder in placeholders)
    
    def has_user_response(self, query: str, db: Session) -> bool:
        """Check if user has provided a meaningful response (not just greetings)"""
        query_lower = query.lower()
        
        # Get greetings from database - look for questionnaires with greeting keywords
        try:
            greeting_questionnaires = db.query(Questionnaire).filter(
                Questionnaire.category == DatabaseCategories.GENERAL,
                Questionnaire.trigger_keywords.contains(HealthKeywords.GREETINGS[0]) |
                Questionnaire.trigger_keywords.contains(HealthKeywords.GREETINGS[1]) |
                Questionnaire.trigger_keywords.contains(HealthKeywords.GREETINGS[2])
            ).all()
            
            # Extract all greeting keywords from database
            greetings = []
            for q in greeting_questionnaires:
                keywords = [kw.strip().lower() for kw in q.trigger_keywords.split(',')]
                greetings.extend(keywords)
            
            # Remove duplicates
            greetings = list(set(greetings))
        except Exception as e:
            print(f"{ErrorMessages.GREETING_ERROR}: {e}")
            greetings = []
        
        # If it's just a greeting, show the question
        if any(greeting in query_lower for greeting in greetings) and len(query.split()) <= 3:
            return False
        
        # If user mentions specific health issues, process the response
        # Get health keywords from database as well
        try:
            health_questionnaires = db.query(Questionnaire).filter(
                Questionnaire.category.in_([
                    DatabaseCategories.SYMPTOMS, 
                    DatabaseCategories.APPOINTMENT, 
                    DatabaseCategories.EMERGENCY, 
                    DatabaseCategories.MEDICATION
                ])
            ).all()
            
            health_keywords = []
            for q in health_questionnaires:
                keywords = [kw.strip().lower() for kw in q.trigger_keywords.split(',')]
                health_keywords.extend(keywords)
            
            # Remove duplicates
            health_keywords = list(set(health_keywords))
        except Exception as e:
            print(f"{ErrorMessages.HEALTH_KEYWORDS_ERROR}: {e}")
            health_keywords = HealthKeywords.HEALTH_ISSUES
        
        return any(keyword in query_lower for keyword in health_keywords)
    
    def process_questionnaire_response(self, questionnaire: Questionnaire, user_input: str) -> str:
        """Process user input and generate response based on questionnaire template"""
        try:
            # Simple template processing - in a real system, you'd have more sophisticated NLP
            response = questionnaire.response_template
            
            # Extract basic information from user input
            user_input_lower = user_input.lower()
            
            # Common replacements for user choices
            for key, value in UserChoices.CHOICE_MAPPINGS.items():
                if key in user_input or key in user_input_lower:
                    response = response.replace("{user_choice}", value)
                    break
            
            # If no specific choice detected but user mentioned health topics, provide a default
            if "{user_choice}" in response:
                response = response.replace("{user_choice}", DefaultValues.HEALTH_CONCERN)
            
            # Extract pain level (1-10)
            pain_match = re.search(r'(\d+)/10|(\d+)\s*out\s*of\s*10|pain\s*level\s*(\d+)', user_input_lower)
            if pain_match:
                pain_level = pain_match.group(1) or pain_match.group(2) or pain_match.group(3)
                response = response.replace("{pain_level}", pain_level)
                
                # Add recommendation based on pain level
                pain_int = int(pain_level)
                if pain_int >= PainRecommendations.PAIN_LEVELS["high"]:
                    recommendation = PainRecommendations.RECOMMENDATIONS["high"]
                elif pain_int >= PainRecommendations.PAIN_LEVELS["moderate_high"]:
                    recommendation = PainRecommendations.RECOMMENDATIONS["moderate_high"]
                elif pain_int >= PainRecommendations.PAIN_LEVELS["moderate"]:
                    recommendation = PainRecommendations.RECOMMENDATIONS["moderate"]
                else:
                    recommendation = PainRecommendations.RECOMMENDATIONS["low"]
                
                response = response.replace("{recommendation}", recommendation)
            
            # Extract temperature
            temp_match = re.search(r'(\d+(?:\.\d+)?)\s*°?[fF]|(\d+(?:\.\d+)?)\s*degrees', user_input_lower)
            if temp_match:
                temperature = temp_match.group(1) or temp_match.group(2)
                response = response.replace("{temperature}", temperature)
                
                temp_float = float(temperature)
                if temp_float >= FeverAdvice.TEMPERATURE_LEVELS["high"]:
                    fever_advice = FeverAdvice.ADVICE["high"]
                elif temp_float >= FeverAdvice.TEMPERATURE_LEVELS["moderate"]:
                    fever_advice = FeverAdvice.ADVICE["moderate"]
                else:
                    fever_advice = FeverAdvice.ADVICE["normal"]
                
                response = response.replace("{fever_advice}", fever_advice)
            
            # Extract pain location
            detected_location = DefaultValues.AFFECTED_AREA
            for location, keywords in HealthKeywords.PAIN_LOCATIONS.items():
                if any(keyword in user_input_lower for keyword in keywords):
                    detected_location = location
                    break
            
            response = response.replace("{pain_location}", detected_location)
            
            # Extract duration
            detected_duration = "a while"
            for duration, keywords in HealthKeywords.DURATION_KEYWORDS.items():
                if any(keyword in user_input_lower for keyword in keywords):
                    detected_duration = duration
                    break
            
            response = response.replace("{duration}", detected_duration)
            response = response.replace("{appointment_type}", "medical")
            response = response.replace("{doctor_preference}", DefaultValues.PREFERRED_DOCTOR)
            response = response.replace("{appointment_timing}", DefaultValues.PREFERRED_TIME)
            response = response.replace("{medication_name}", DefaultValues.YOUR_MEDICATION)
            response = response.replace("{medication_response}", DefaultValues.CONSULT_DOCTOR)
            response = response.replace("{cough_type}", "persistent")
            response = response.replace("{cough_advice}", "staying hydrated and resting")
            response = response.replace("{headache_location}", "your head")
            response = response.replace("{severity}", "moderate")
            response = response.replace("{headache_advice}", "rest in a quiet, dark room")
            response = response.replace("{vomiting_status}", "some discomfort")
            response = response.replace("{nausea_advice}", "resting and avoiding solid foods")
            response = response.replace("{user_topic}", DefaultValues.HEALTH_CONCERN)
            response = response.replace("{general_advice}", "consulting with a healthcare professional")
            
            # Replace any remaining placeholders with sensible defaults
            response = response.replace("{user_choice}", DefaultValues.HEALTH_CONCERN)
            response = response.replace("{pain_level}", "moderate")
            response = response.replace("{recommendation}", "consulting with a healthcare professional")
            response = response.replace("{temperature}", "normal")
            response = response.replace("{fever_advice}", "monitor and rest")
            response = response.replace("{pain_location}", DefaultValues.AFFECTED_AREA)
            response = response.replace("{duration}", "recently")
            response = response.replace("{appointment_type}", "medical")
            response = response.replace("{doctor_preference}", DefaultValues.PREFERRED_DOCTOR)
            response = response.replace("{appointment_timing}", DefaultValues.PREFERRED_TIME)
            response = response.replace("{medication_name}", DefaultValues.YOUR_MEDICATION)
            response = response.replace("{medication_response}", DefaultValues.CONSULT_DOCTOR)
            response = response.replace("{cough_type}", "persistent")
            response = response.replace("{cough_advice}", "staying hydrated and resting")
            response = response.replace("{headache_location}", "your head")
            response = response.replace("{severity}", "moderate")
            response = response.replace("{headache_advice}", "rest in a quiet, dark room")
            response = response.replace("{vomiting_status}", "some discomfort")
            response = response.replace("{nausea_advice}", "resting and avoiding solid foods")
            
            return response
            
        except Exception as e:
            print(f"{ErrorMessages.PROCESSING_ERROR}: {e}")
            return questionnaire.response_template
    
    def get_patient_context(self, db: Session, patient_id: int) -> Optional[Dict]:
        """Get patient context from database"""
        try:
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            if patient:
                return {
                    "id": patient.id,
                    "name": patient.name,
                    "age": patient.age,
                    "gender": patient.gender,
                    "diagnosis": patient.diagnosis,
                    "medications": patient.medications,
                    "lab_results": patient.lab_results,
                    "last_visit": patient.last_visit.isoformat() if patient.last_visit else None
                }
        except Exception as e:
            print(f"{ErrorMessages.PATIENT_CONTEXT_ERROR}: {e}")
        return None

    def get_doctor_context(self, db: Session, doctor_id: int) -> Optional[Dict]:
        """Get doctor context from database"""
        try:
            doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
            if doctor:
                return {
                    "id": doctor.id,
                    "name": doctor.name,
                    "specialization": doctor.specialization,
                    "contact": doctor.contact
                }
        except Exception as e:
            print(f"{ErrorMessages.DOCTOR_CONTEXT_ERROR}: {e}")
        return None

    def generate_openai_response_with_confidence(self, query: str, patient_context: Optional[Dict] = None,
                                                doctor_context: Optional[Dict] = None,
                                                retrieved_docs: List[Dict] = None) -> tuple[str, float]:
        """Generate response using unified LLM service with confidence scoring"""
        try:
            # Use the unified LLM service which will try multiple providers
            response_text, confidence = llm_service.generate_response_with_confidence(
                query=query,
                patient_context=patient_context,
                doctor_context=doctor_context,
                retrieved_docs=retrieved_docs
            )
            
            return response_text, confidence
            
        except Exception as e:
            print(f"{ErrorMessages.OPENAI_ERROR}: {e}")
            raise e  # Re-raise to be caught by the calling function

    def generate_openai_response(self, query: str, patient_context: Optional[Dict] = None,
                                doctor_context: Optional[Dict] = None,
                                retrieved_docs: List[Dict] = None) -> str:
        """Generate response using OpenAI with context (legacy method for compatibility)"""
        response, _ = self.generate_openai_response_with_confidence(query, patient_context, doctor_context, retrieved_docs)
        return response

    def process_query_with_fallback(self, query: str, db: Session, patient_id: Optional[int] = None,
                                   doctor_id: Optional[int] = None) -> Dict:
        """Process a complete query with AI-first approach and database fallback when AI confidence is low"""
        
        # Get patient and doctor context
        patient_context = None
        if patient_id:
            patient_context = self.get_patient_context(db, patient_id)

        doctor_context = None
        if doctor_id:
            doctor_context = self.get_doctor_context(db, doctor_id)

        # Try OpenAI first with confidence checking
        try:
            # Search for relevant documents (if available)
            retrieved_docs = []  # Simplified for now
            
            # Generate OpenAI response with confidence score
            response, confidence = self.generate_openai_response_with_confidence(
                query, patient_context, doctor_context, retrieved_docs
            )
            
            # Define confidence threshold
            confidence_threshold = DefaultValues.CONFIDENCE_THRESHOLD
            
            # If AI is confident enough, return the response
            if confidence >= confidence_threshold:
                return {
                    "response": response,
                    "patient_context": patient_context,
                    "doctor_context": doctor_context,
                    "retrieved_documents": [doc.get('metadata', {}).get('title', 'Untitled') for doc in retrieved_docs],
                    "fallback_mode": False,
                    "ai_confidence": confidence
                }
            else:
                print(LogMessages.AI_CONFIDENCE_LOW.format(confidence=confidence))
                
        except Exception as e:
            print(f"{LogMessages.OPENAI_FAILED}: {e}")
            confidence = 0.0
        
        # AI either failed or had low confidence - search local database
        questionnaire = self.find_matching_questionnaire(query, db)
        
        if questionnaire:
            # Check if this is an initial greeting or needs more information
            if questionnaire.question and not self.has_user_response(query, db):
                # Show the questionnaire question first
                response = questionnaire.question
                current_question = questionnaire.question
            else:
                # Process the response template to generate a meaningful response
                response = self.process_questionnaire_response(questionnaire, query)
                current_question = None
        else:
            # No matching questionnaire found, get default from database
            default_questionnaire = db.query(Questionnaire).filter(
                Questionnaire.category == DatabaseCategories.GENERAL,
                Questionnaire.is_active == True
            ).order_by(Questionnaire.priority.asc()).first()
            
            if default_questionnaire:
                response = default_questionnaire.response_template
                current_question = default_questionnaire.question
            else:
                # If no questionnaires exist in database, create a basic one
                response = DefaultValues.ADMIN_SETUP_MESSAGE
                current_question = None
        
        return {
            "response": response,
            "patient_context": patient_context,
            "doctor_context": doctor_context,
            "retrieved_documents": [],
            "current_question": current_question,
            "fallback_mode": True,
            "ai_confidence": confidence if 'confidence' in locals() else 0.0
        }
