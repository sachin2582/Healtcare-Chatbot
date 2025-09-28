import openai
from typing import List, Dict, Optional
import chromadb
from chromadb.config import Settings
import uuid
from config import OPENAI_API_KEY, CHROMA_PERSIST_DIRECTORY, EMBEDDING_MODEL
from sqlalchemy.orm import Session
from models import Patient, Document

# Initialize OpenAI client
openai.api_key = OPENAI_API_KEY

class RAGService:
    def __init__(self):
        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(
            path=CHROMA_PERSIST_DIRECTORY,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        try:
            self.collection = self.chroma_client.get_collection("healthcare_documents")
        except:
            self.collection = self.chroma_client.create_collection(
                name="healthcare_documents",
                metadata={"description": "Healthcare guidelines and documents"}
            )
    
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
        """Add document to vector store"""
        try:
            # Create document ID
            doc_id = str(uuid.uuid4())
            
            # Get embedding
            embedding = self.get_embedding(content)
            
            if embedding:
                # Add to ChromaDB
                self.collection.add(
                    ids=[doc_id],
                    embeddings=[embedding],
                    documents=[content],
                    metadatas=[{
                        "title": title,
                        "type": doc_type,
                        "content_preview": content[:200] + "..." if len(content) > 200 else content
                    }]
                )
                return True
        except Exception as e:
            print(f"Error adding document: {e}")
        return False
    
    def search_documents(self, query: str, n_results: int = 5) -> List[Dict]:
        """Search for relevant documents"""
        try:
            # Get query embedding
            query_embedding = self.get_embedding(query)
            
            if not query_embedding:
                return []
            
            # Search in ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            
            # Format results
            documents = []
            if results['documents'] and results['documents'][0]:
                for i, doc in enumerate(results['documents'][0]):
                    documents.append({
                        "content": doc,
                        "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                        "distance": results['distances'][0][i] if results['distances'] else 0
                    })
            
            return documents
        except Exception as e:
            print(f"Error searching documents: {e}")
            return []
    
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
    
    def generate_response(self, query: str, patient_context: Optional[Dict] = None, 
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
            return "I apologize, but I'm experiencing technical difficulties. Please try again later or consult with your healthcare provider directly."
    
    def process_query(self, query: str, db: Session, patient_id: Optional[int] = None) -> Dict:
        """Process a complete query with RAG"""
        # Get patient context if patient_id provided
        patient_context = None
        if patient_id:
            patient_context = self.get_patient_context(db, patient_id)
        
        # Search for relevant documents
        retrieved_docs = self.search_documents(query)
        
        # Generate response
        response = self.generate_response(query, patient_context, retrieved_docs)
        
        return {
            "response": response,
            "patient_context": patient_context,
            "retrieved_documents": [doc['metadata'].get('title', 'Untitled') for doc in retrieved_docs]
        }
