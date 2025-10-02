#!/usr/bin/env python3
"""
Railway startup script for healthcare chatbot
"""
import os
import sys

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Change to backend directory
os.chdir('backend')

# Import and run main
if __name__ == "__main__":
    import main
