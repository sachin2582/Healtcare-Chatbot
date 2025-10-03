#!/usr/bin/env python3
"""
Script to restart the server with updated validation code
"""
import subprocess
import sys
import os
import signal
import time

def restart_server():
    print("🔄 Restarting the FastAPI server with updated validation code...")
    
    # Kill any existing uvicorn processes
    try:
        if os.name == 'nt':  # Windows
            subprocess.run(['taskkill', '/f', '/im', 'python.exe'], capture_output=True)
        else:  # Unix/Linux/Mac
            subprocess.run(['pkill', '-f', 'uvicorn'], capture_output=True)
        print("✅ Killed existing server processes")
    except:
        print("ℹ️  No existing server processes found")
    
    # Wait a moment
    time.sleep(2)
    
    # Start the server
    print("🚀 Starting server with updated code...")
    try:
        if os.name == 'nt':  # Windows
            subprocess.Popen([
                sys.executable, '-m', 'uvicorn', 
                'main:app', 
                '--host', '0.0.0.0', 
                '--port', '8000', 
                '--reload'
            ], cwd=os.getcwd())
        else:  # Unix/Linux/Mac
            subprocess.Popen([
                'uvicorn', 'main:app', 
                '--host', '0.0.0.0', 
                '--port', '8000', 
                '--reload'
            ], cwd=os.getcwd())
        
        print("✅ Server started successfully!")
        print("🌐 Server should be running at http://localhost:8000")
        print("📝 Validation for duplicate appointments is now active")
        print("\n💡 Test the validation by:")
        print("   1. Book an appointment with a patient")
        print("   2. Try to book another appointment for the same patient on the same day")
        print("   3. You should see a proper validation error message")
        
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("\n🔧 Manual restart instructions:")
        print("   1. Press Ctrl+C to stop the current server")
        print("   2. Run: python main.py")
        print("   3. Or run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload")

if __name__ == '__main__':
    restart_server()
