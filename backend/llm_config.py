"""
Configuration for different LLM providers including LLaMA via Ollama/LM Studio
"""

import os
from typing import Optional, Dict, Any
from enum import Enum

class LLMProvider(Enum):
    OPENAI = "openai"
    HUGGINGFACE = "huggingface"

class LLMConfig:
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "openai").lower()
        self.fallback_enabled = os.getenv("LLM_FALLBACK_ENABLED", "true").lower() == "true"
        
        # Provider-specific configurations
        self.configs = {
            LLMProvider.OPENAI: {
                "api_key": os.getenv("OPENAI_API_KEY"),
                "base_url": os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
                "model": os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
                "embedding_model": os.getenv("EMBEDDING_MODEL", "text-embedding-3-small"),
                "max_tokens": int(os.getenv("OPENAI_MAX_TOKENS", "500")),
                "temperature": float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
            }
        }
    
    def get_config(self, provider: LLMProvider) -> Dict[str, Any]:
        """Get configuration for a specific provider"""
        return self.configs.get(provider, {})
    
    def get_current_provider(self) -> LLMProvider:
        """Get the current provider"""
        try:
            return LLMProvider(self.provider)
        except ValueError:
            return LLMProvider.OPENAI
    
    def is_provider_available(self, provider: LLMProvider) -> bool:
        """Check if a provider is properly configured"""
        config = self.get_config(provider)
        
        if provider == LLMProvider.OPENAI:
            return bool(config.get("api_key") and config["api_key"] != "your_openai_api_key_here")
        
        return False

# Global configuration instance
llm_config = LLMConfig()
