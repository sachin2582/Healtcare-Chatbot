#!/usr/bin/env python3
"""
Healthcare Chatbot Backend Server
Run this script to start the FastAPI server
"""

import uvicorn
from config import DEBUG, BACKEND_PORT

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=BACKEND_PORT,
        reload=DEBUG,
        log_level="info" if not DEBUG else "debug"
    )
