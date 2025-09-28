#!/usr/bin/env python3
"""
Test script for LLaMA integration via Ollama or LM Studio
"""

import os
import sys
from dotenv import load_dotenv

def test_llama_setup():
    """Test LLaMA setup and configuration"""
    print("🦙 Testing LLaMA Integration")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    try:
        from llm_service import llm_service
        from llm_config import LLMProvider
        
        print("✅ LLM service imported successfully")
        
        # Check available providers
        available_providers = llm_service.get_available_providers()
        print(f"📋 Available providers: {[p.value for p in available_providers]}")
        
        # Test each provider
        for provider in [LLMProvider.OPENAI]:
            print(f"\n🧪 Testing {provider.value}...")
            print("-" * 30)
            
            if llm_service.config.is_provider_available(provider):
                print(f"✅ {provider.value} is configured")
                
                # Test connection
                if llm_service.test_provider_connection(provider):
                    print(f"✅ {provider.value} connection successful")
                    
                    # Test response generation
                    try:
                        response, confidence = llm_service.generate_response_with_confidence(
                            query="Hello, I have a headache. What should I do?",
                            patient_context=None,
                            doctor_context=None,
                            retrieved_docs=None
                        )
                        
                        print(f"✅ {provider.value} response generation successful!")
                        print(f"🤖 Response: {response[:100]}...")
                        print(f"📊 Confidence: {confidence}")
                        
                    except Exception as e:
                        print(f"❌ {provider.value} response generation failed: {e}")
                else:
                    print(f"❌ {provider.value} connection failed")
            else:
                print(f"⚠️  {provider.value} not configured")
        
        print(f"\n🎉 LLaMA integration test completed!")
        return True
        
    except Exception as e:
        print(f"❌ LLaMA integration test failed: {e}")
        return False

def test_rag_with_llama():
    """Test RAG service with LLaMA"""
    print("\n🧪 Testing RAG Service with LLaMA")
    print("=" * 50)
    
    try:
        from rag_service_enhanced import EnhancedRAGService
        from database import get_db
        
        # Initialize RAG service
        rag_service = EnhancedRAGService()
        print("✅ RAG service initialized")
        
        # Test queries
        test_queries = [
            "I have a severe headache",
            "I need to book an appointment",
            "Emergency situation",
            "I have a fever of 102°F"
        ]
        
        # Get database session
        db = next(get_db())
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n🔍 Test {i}: '{query}'")
            print("-" * 30)
            
            try:
                result = rag_service.process_query_with_fallback(
                    query=query,
                    db=db,
                    patient_id=None,
                    doctor_id=None
                )
                
                print(f"✅ Response generated successfully!")
                print(f"🤖 Response: {result['response'][:150]}...")
                print(f"📊 Fallback mode: {result.get('fallback_mode', 'N/A')}")
                print(f"📊 AI Confidence: {result.get('ai_confidence', 'N/A')}")
                
            except Exception as e:
                print(f"❌ Error with query '{query}': {e}")
        
        print(f"\n🎉 RAG with LLaMA test completed!")
        return True
        
    except Exception as e:
        print(f"❌ RAG with LLaMA test failed: {e}")
        return False

def show_setup_instructions():
    """Show setup instructions for LLaMA"""
    print("\n📋 LLaMA Setup Instructions")
    print("=" * 50)
    
    print("\n🔧 Option 1: Use OpenAI (if quota available)")
    print("-" * 30)
    print("1. Get OpenAI API key")
    print("2. Add to .env file:")
    print("   LLM_PROVIDER=openai")
    print("   OPENAI_API_KEY=your_key_here")

if __name__ == "__main__":
    print("🚀 LLaMA Integration Test")
    print("=" * 50)
    
    # Show setup instructions
    show_setup_instructions()
    
    print("\n" + "=" * 50)
    
    # Test LLaMA setup
    llama_ok = test_llama_setup()
    
    if llama_ok:
        # Test RAG with LLaMA
        rag_ok = test_rag_with_llama()
        
        if rag_ok:
            print("\n🎉 ALL TESTS PASSED!")
            print("Your chatbot is ready to use LLaMA!")
        else:
            print("\n⚠️  LLaMA works but RAG integration has issues.")
    else:
        print("\n❌ LLaMA integration needs setup.")
        print("Please follow the setup instructions above.")
    
    print("\n" + "=" * 50)
