@echo off
echo 🚀 Starting Healthcare Chatbot Locally...

echo.
echo 📋 Checking prerequisites...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

echo.
echo 🔧 Starting Backend Server...
start "Backend Server" cmd /k "cd /d D:\ChatBot\backend && echo Starting backend... && pip install -r requirements.txt && python main.py"

echo.
echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d D:\ChatBot\frontend && echo Starting frontend... && npm install && npm start"

echo.
echo 🎉 Healthcare Chatbot is starting up!
echo.
echo 📱 Your application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    Admin:    http://localhost:3000/admin
echo.
echo ⚠️  Keep both command windows open while using the application.
echo.
pause
