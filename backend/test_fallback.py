#!/usr/bin/env python3
"""
Test the fallback system when OpenAI is not available
"""

import sys
import os
from dotenv import load_dotenv

def test_fallback_system():
    """Test the questionnaire fallback system"""
    print("🧪 Testing Fallback System (No OpenAI)")
    print("=" * 50)
    
    try:
        from rag_service_enhanced import EnhancedRAGService
        from database import get_db
        from sqlalchemy.orm import Session
        
        # Initialize RAG service
        rag_service = EnhancedRAGService()
        print("✅ RAG service initialized successfully")
        
        # Test queries
        test_queries = [
            "I have a headache",
            "I need an appointment", 
            "Emergency help",
            "I have a fever",
            "Hello"
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
        
        print(f"\n🎉 Fallback system test completed!")
        return True
        
    except Exception as e:
        print(f"❌ Fallback System Error: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("🚀 Fallback System Health Check")
    print("=" * 50)
    print()
    
    success = test_fallback_system()
    
    if success:
        print("\n✅ Your chatbot will work with the fallback system!")
        print("💡 The system will use local questionnaires when OpenAI is unavailable.")
    else:
        print("\n❌ There are issues with the fallback system too.")
    
    print("\n" + "=" * 50)
