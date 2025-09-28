#!/usr/bin/env python3
"""
Test script to check if OpenAI API is responding correctly
"""

import os
import sys
from dotenv import load_dotenv
import openai
from config import OPENAI_API_KEY, OPENAI_MODEL, EMBEDDING_MODEL

def test_openai_connection():
    """Test OpenAI API connection and response"""
    print("🔍 Testing OpenAI API Connection...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check API key
    if not OPENAI_API_KEY or OPENAI_API_KEY == "your_openai_api_key_here":
        print("❌ ERROR: OpenAI API key not found or not set!")
        print("Please set your OPENAI_API_KEY in the .env file")
        return False
    
    print(f"✅ API Key found: {OPENAI_API_KEY[:10]}...")
    print(f"📝 Model: {OPENAI_MODEL}")
    print(f"🔗 Embedding Model: {EMBEDDING_MODEL}")
    print()
    
    # Set API key
    openai.api_key = OPENAI_API_KEY
    
    try:
        # Test 1: Simple chat completion
        print("🧪 Test 1: Chat Completion")
        print("-" * 30)
        
        response = openai.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Respond with 'Hello! I am working correctly.'"},
                {"role": "user", "content": "Test message"}
            ],
            max_tokens=50,
            temperature=0.1
        )
        
        ai_response = response.choices[0].message.content
        print(f"✅ Chat completion successful!")
        print(f"🤖 AI Response: {ai_response}")
        print()
        
        # Test 2: Embedding generation
        print("🧪 Test 2: Embedding Generation")
        print("-" * 30)
        
        embedding_response = openai.embeddings.create(
            input="Test text for embedding",
            model=EMBEDDING_MODEL
        )
        
        embedding = embedding_response.data[0].embedding
        print(f"✅ Embedding generation successful!")
        print(f"📊 Embedding dimension: {len(embedding)}")
        print(f"📊 First 5 values: {embedding[:5]}")
        print()
        
        # Test 3: Confidence scoring (as used in your chatbot)
        print("🧪 Test 3: Confidence Scoring")
        print("-" * 30)
        
        confidence_response = openai.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {
                    "role": "system", 
                    "content": "You are a healthcare chatbot. At the end of your response, provide a confidence score from 0.0 to 1.0 indicating how confident you are that your response adequately addresses the user's query. Format: [CONFIDENCE: X.X] where X.X is a number between 0.0 and 1.0"
                },
                {"role": "user", "content": "I have a headache. What should I do?"}
            ],
            max_tokens=200,
            temperature=0.7
        )
        
        confidence_text = confidence_response.choices[0].message.content
        print(f"✅ Confidence scoring test successful!")
        print(f"🤖 AI Response: {confidence_text}")
        
        # Extract confidence score
        import re
        confidence_match = re.search(r'\[CONFIDENCE:\s*(\d+\.?\d*)\]', confidence_text)
        if confidence_match:
            confidence = float(confidence_match.group(1))
            print(f"📊 Confidence Score: {confidence}")
        else:
            print("⚠️  No confidence score found in response")
        print()
        
        print("🎉 ALL TESTS PASSED! OpenAI is working correctly.")
        return True
        
    except openai.AuthenticationError as e:
        print(f"❌ Authentication Error: {e}")
        print("Please check your OpenAI API key")
        return False
        
    except openai.RateLimitError as e:
        print(f"❌ Rate Limit Error: {e}")
        print("You may have exceeded your API rate limit")
        return False
        
    except openai.APIError as e:
        print(f"❌ API Error: {e}")
        print("There was an issue with the OpenAI API")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

def test_rag_service():
    """Test the RAG service specifically"""
    print("🧪 Test 4: RAG Service Integration")
    print("-" * 30)
    
    try:
        from rag_service_enhanced import EnhancedRAGService
        from database import get_db
        from sqlalchemy.orm import Session
        
        # Initialize RAG service
        rag_service = EnhancedRAGService()
        print("✅ RAG service initialized successfully")
        
        # Test with a simple query
        test_query = "I have a fever and headache"
        print(f"🔍 Testing query: '{test_query}'")
        
        # Get database session
        db = next(get_db())
        
        # Test the process_query_with_fallback method
        result = rag_service.process_query_with_fallback(
            query=test_query,
            db=db,
            patient_id=None,
            doctor_id=None
        )
        
        print("✅ RAG service test successful!")
        print(f"🤖 Response: {result['response'][:100]}...")
        print(f"📊 Fallback mode: {result.get('fallback_mode', 'N/A')}")
        print(f"📊 AI Confidence: {result.get('ai_confidence', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ RAG Service Error: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("🚀 OpenAI API Health Check")
    print("=" * 50)
    print()
    
    # Test basic OpenAI connection
    openai_ok = test_openai_connection()
    
    if openai_ok:
        print()
        # Test RAG service integration
        rag_ok = test_rag_service()
        
        if rag_ok:
            print()
            print("🎉 ALL SYSTEMS OPERATIONAL!")
            print("Your chatbot should be working correctly.")
        else:
            print()
            print("⚠️  OpenAI works but RAG service has issues.")
    else:
        print()
        print("❌ OpenAI API is not responding correctly.")
        print("Please check your configuration and try again.")
    
    print()
    print("=" * 50)
