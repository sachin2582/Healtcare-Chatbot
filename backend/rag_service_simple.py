import openai
from typing import List, Dict, Optional
import uuid
from config import OPENAI_API_KEY, EMBEDDING_MODEL
from sqlalchemy.orm import Session
from models import Patient, Document, Doctor

# Initialize OpenAI client
openai.api_key = OPENAI_API_KEY

class RAGService:
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
            print(f"Error getting embedding: {e}")
            return []
    
    def add_document(self, title: str, content: str, doc_type: str = "guideline"):
        """Add document to storage"""
        try:
            doc_id = str(uuid.uuid4())
            embedding = self.get_embedding(content)
            
            if embedding:
                self.documents.append({
                    "id": doc_id,
                    "title": title,
                    "content": content,
                    "type": doc_type,
                    "embedding": embedding
                })
                return True
        except Exception as e:
            print(f"Error adding document: {e}")
        return False
    
    def search_documents(self, query: str, n_results: int = 5) -> List[Dict]:
        """Search for relevant documents using simple similarity"""
        try:
            if not self.documents:
                return []
            
            query_embedding = self.get_embedding(query)
            if not query_embedding:
                return []
            
            # Simple similarity search (cosine similarity)
            results = []
            for doc in self.documents:
                similarity = self.cosine_similarity(query_embedding, doc["embedding"])
                results.append({
                    "content": doc["content"],
                    "metadata": {"title": doc["title"], "type": doc["type"]},
                    "distance": 1 - similarity
                })
            
            # Sort by similarity and return top results
            results.sort(key=lambda x: x["distance"])
            return results[:n_results]
            
        except Exception as e:
            print(f"Error searching documents: {e}")
            return []
    
    def cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        import math
        dot_product = sum(x * y for x, y in zip(a, b))
        magnitude_a = math.sqrt(sum(x * x for x in a))
        magnitude_b = math.sqrt(sum(x * x for x in b))
        
        if magnitude_a == 0 or magnitude_b == 0:
            return 0
        return dot_product / (magnitude_a * magnitude_b)
    
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
            print(f"Error getting patient context: {e}")
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
            print(f"Error getting doctor context: {e}")
        return None

    def generate_response(self, query: str, patient_context: Optional[Dict] = None,
                         doctor_context: Optional[Dict] = None,
                         retrieved_docs: List[Dict] = None) -> str:
        """Generate response using OpenAI with context"""
        try:
            # Build system prompt
            system_prompt = """You are a helpful healthcare chatbot assistant. You have access to patient data and healthcare guidelines.
            
            Guidelines for responses:
            1. Always prioritize patient safety and recommend consulting healthcare professionals
            2. Use the provided patient context and relevant documents to give personalized advice
            3. Be clear about what information is from patient records vs general guidelines
            4. Never provide specific medical diagnoses - only general health information
            5. Encourage patients to consult their doctors for medical concerns
            """
            
            # Build context
            context_parts = []
            
            if patient_context:
                context_parts.append(f"Patient Information:\n{patient_context}")

            if doctor_context:
                context_parts.append(f"Assigned Doctor:\n{doctor_context}")

            if retrieved_docs:
                doc_text = "\n\n".join([doc['content'] for doc in retrieved_docs])
                context_parts.append(f"Relevant Guidelines:\n{doc_text}")
            
            context = "\n\n".join(context_parts)
            
            # Build messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context:\n{context}\n\nUser Query: {query}"}
            ]
            
            # Generate response
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating response: {e}")
            error_message = str(e)
            if "quota" in error_message.lower() or "billing" in error_message.lower():
                return "I apologize, but I've reached my usage limit for today. Please check your OpenAI account billing or try again later. For immediate assistance, please contact your healthcare provider directly."
            else:
                return "I apologize, but I'm experiencing technical difficulties. Please try again later or consult with your healthcare provider directly."
    
    def process_query(self, query: str, db: Session, patient_id: Optional[int] = None,
                      doctor_id: Optional[int] = None) -> Dict:
        """Process a complete query with RAG"""
        # Get patient context if patient_id provided
        patient_context = None
        if patient_id:
            patient_context = self.get_patient_context(db, patient_id)

        doctor_context = None
        if doctor_id:
            doctor_context = self.get_doctor_context(db, doctor_id)

        # Search for relevant documents
        retrieved_docs = self.search_documents(query)

        # Generate response
        response = self.generate_response(query, patient_context, doctor_context, retrieved_docs)

        return {
            "response": response,
            "patient_context": patient_context,
            "doctor_context": doctor_context,
            "retrieved_documents": [doc['metadata'].get('title', 'Untitled') for doc in retrieved_docs]
        }
