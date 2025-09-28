"""
Unified LLM service supporting multiple providers including LLaMA via Ollama/LM Studio
"""

import requests
import json
import time
from typing import List, Dict, Optional, Tuple
from llm_config import llm_config, LLMProvider
from text_config import AIPrompts, ContextLabels, DefaultValues, ConfidencePatterns
import re

class LLMService:
    def __init__(self):
        self.config = llm_config
        self.current_provider = self.config.get_current_provider()
    
    def get_available_providers(self) -> List[LLMProvider]:
        """Get list of available providers"""
        available = []
        for provider in LLMProvider:
            if self.config.is_provider_available(provider):
                available.append(provider)
        return available
    
    def test_provider_connection(self, provider: LLMProvider) -> bool:
        """Test if a provider is reachable"""
        try:
            config = self.config.get_config(provider)
            base_url = config.get("base_url")
            
            if not base_url:
                return False
            
            # Test connection
            if provider == LLMProvider.OPENAI:
                # Test OpenAI connection
                import openai
                openai.api_key = config.get("api_key")
                response = openai.models.list()
                return True
            else:
                # Test Ollama/LM Studio connection
                response = requests.get(f"{base_url}/api/tags", timeout=5)
                return response.status_code == 200
                
        except Exception as e:
            print(f"Connection test failed for {provider.value}: {e}")
            return False
    
    def generate_response_with_confidence(
        self, 
        query: str, 
        patient_context: Optional[Dict] = None,
        doctor_context: Optional[Dict] = None,
        retrieved_docs: List[Dict] = None
    ) -> Tuple[str, float]:
        """Generate response with confidence scoring using the best available provider"""
        
        # Try providers in order of preference
        providers_to_try = [
            self.current_provider,
            LLMProvider.OPENAI
        ]
        
        # Remove duplicates while preserving order
        providers_to_try = list(dict.fromkeys(providers_to_try))
        
        last_error = None
        
        for provider in providers_to_try:
            if not self.config.is_provider_available(provider):
                continue
                
            try:
                print(f"Trying {provider.value}...")
                response, confidence = self._generate_with_provider(
                    provider, query, patient_context, doctor_context, retrieved_docs
                )
                print(f"✅ Success with {provider.value}")
                return response, confidence
                
            except Exception as e:
                print(f"❌ {provider.value} failed: {e}")
                last_error = e
                continue
        
        # If all providers fail, raise the last error
        if last_error:
            raise last_error
        else:
            raise Exception("No LLM providers are available")
    
    def _generate_with_provider(
        self,
        provider: LLMProvider,
        query: str,
        patient_context: Optional[Dict] = None,
        doctor_context: Optional[Dict] = None,
        retrieved_docs: List[Dict] = None
    ) -> Tuple[str, float]:
        """Generate response using a specific provider"""
        
        if provider == LLMProvider.OPENAI:
            return self._generate_openai(query, patient_context, doctor_context, retrieved_docs)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    def _generate_openai(
        self,
        query: str,
        patient_context: Optional[Dict] = None,
        doctor_context: Optional[Dict] = None,
        retrieved_docs: List[Dict] = None
    ) -> Tuple[str, float]:
        """Generate response using OpenAI"""
        import openai
        
        config = self.config.get_config(LLMProvider.OPENAI)
        openai.api_key = config["api_key"]
        
        # Build context
        context_parts = []
        if patient_context:
            context_parts.append(f"{ContextLabels.PATIENT_INFORMATION}:\n{patient_context}")
        if doctor_context:
            context_parts.append(f"{ContextLabels.ASSIGNED_DOCTOR}:\n{doctor_context}")
        if retrieved_docs:
            doc_text = "\n\n".join([doc['content'] for doc in retrieved_docs])
            context_parts.append(f"{ContextLabels.RELEVANT_GUIDELINES}:\n{doc_text}")
        
        context = "\n\n".join(context_parts)
        
        messages = [
            {"role": "system", "content": AIPrompts.SYSTEM_PROMPT_WITH_CONFIDENCE},
            {"role": "user", "content": f"{ContextLabels.CONTEXT}:\n{context}\n\n{ContextLabels.USER_QUERY}: {query}"}
        ]
        
        response = openai.chat.completions.create(
            model=config["model"],
            messages=messages,
            max_tokens=config["max_tokens"],
            temperature=config["temperature"]
        )
        
        response_text = response.choices[0].message.content
        confidence = self._extract_confidence(response_text)
        
        return response_text, confidence
    
    
    
    def _extract_confidence(self, response_text: str) -> float:
        """Extract confidence score from response text"""
        confidence = DefaultValues.DEFAULT_CONFIDENCE
        confidence_match = re.search(ConfidencePatterns.CONFIDENCE_REGEX, response_text)
        if confidence_match:
            confidence = float(confidence_match.group(1))
            # Remove confidence score from response text
            response_text = re.sub(ConfidencePatterns.CONFIDENCE_REPLACEMENT, '', response_text).strip()
        return confidence

# Global LLM service instance
llm_service = LLMService()
