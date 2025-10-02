import os
from dotenv import load_dotenv
from typing import List

load_dotenv()


def _get_int_env(names: List[str], default: int) -> int:
    """Return the first valid integer found in the provided env keys."""
    for name in names:
        value = os.getenv(name)
        if value is not None:
            try:
                return int(value)
            except ValueError:
                pass
    return default

# Database Configuration
DATABASE_PORT = _get_int_env(["DATABASE_PORT"], 5432)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./healthcare_chatbot.db")
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_DB = os.getenv("POSTGRES_DB", "healthcare_chatbot")

# Production Database Configuration
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME", "healthcare_chatbot")

# Environment Detection
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT.lower() == "production"

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your_openai_api_key_here")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

# Application Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
BACKEND_PORT = _get_int_env(["BACKEND_PORT", "PORT"], 8000)
FRONTEND_PORT = _get_int_env(["FRONTEND_PORT"], 3000)

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0" if IS_PRODUCTION else "127.0.0.1")

_raw_cors = os.getenv("CORS_ORIGINS")
if _raw_cors:
    CORS_ORIGINS = [origin.strip() for origin in _raw_cors.split(",") if origin.strip()]
else:
    CORS_ORIGINS = [
        f"http://localhost:{FRONTEND_PORT}",
        f"http://127.0.0.1:{FRONTEND_PORT}",
    ]

# ChromaDB Configuration
CHROMA_PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIRECTORY", "./chroma_db")
