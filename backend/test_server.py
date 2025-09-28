#!/usr/bin/env python3
"""
Test script to check if the FastAPI server can start properly
"""

import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing imports...")
    from main import app
    print("✅ FastAPI app imported successfully")
    
    from database import get_db
    print("✅ Database connection imported successfully")
    
    from models import Speciality
    print("✅ Speciality model imported successfully")
    
    from schemas import Speciality as SpecialitySchema
    print("✅ SpecialitySchema imported successfully")
    
    print("\n✅ All imports successful!")
    print("The server should be able to start properly.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
