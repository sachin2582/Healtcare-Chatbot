@echo off
echo 🔒 Secure Deployment Guide for Healthcare Chatbot
echo.
echo This script will help you deploy your chatbot online without sharing source code.
echo.

echo 📋 Choose your deployment method:
echo.
echo 1. Deploy to Railway (Free, Easy)
echo 2. Deploy to Render (Free, Reliable)
echo 3. Deploy to Vercel (Frontend only)
echo 4. Create Docker container
echo 5. Create demo videos/screenshots
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto render
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto docker
if "%choice%"=="5" goto demo

echo Invalid choice. Please run the script again.
pause
exit /b 1

:railway
echo.
echo 🚂 Railway Deployment Instructions:
echo.
echo 1. Go to: https://railway.app
echo 2. Login with GitHub
echo 3. Create new project from your repository
echo 4. Add PostgreSQL database
echo 5. Set environment variables:
echo    - OPENAI_API_KEY=your-key
echo    - ENVIRONMENT=production
echo 6. Deploy and get your URL
echo.
echo ✅ After deployment, share only the URL with others!
echo.
pause
goto end

:render
echo.
echo 🎨 Render Deployment Instructions:
echo.
echo 1. Go to: https://render.com
echo 2. Connect your GitHub repository
echo 3. Create new Web Service
echo 4. Set build command: pip install -r requirements.txt
echo 5. Set start command: cd backend && python main.py
echo 6. Add environment variables
echo 7. Deploy and get your URL
echo.
echo ✅ After deployment, share only the URL with others!
echo.
pause
goto end

:vercel
echo.
echo ⚡ Vercel Deployment Instructions:
echo.
echo 1. Go to: https://vercel.com
echo 2. Import your GitHub repository
echo 3. Set build settings:
echo    - Framework: Create React App
echo    - Root Directory: frontend
echo 4. Add environment variables:
echo    - REACT_APP_API_BASE_URL=https://your-backend-url
echo 5. Deploy and get your URL
echo.
echo ✅ Deploy backend separately, then frontend!
echo.
pause
goto end

:docker
echo.
echo 🐳 Docker Deployment Instructions:
echo.
echo 1. Install Docker Desktop
echo 2. Build Docker image:
echo    docker build -t healthcare-chatbot .
echo 3. Run container:
echo    docker run -p 8000:8000 healthcare-chatbot
echo 4. Share Docker image or instructions
echo.
echo ✅ Others can run your app without seeing source code!
echo.
pause
goto end

:demo
echo.
echo 📹 Demo Creation Instructions:
echo.
echo 1. Record screen videos of:
echo    - Chatbot conversation flow
echo    - Admin panel functionality
echo    - Appointment booking process
echo    - Health package management
echo.
echo 2. Take screenshots of:
echo    - Main interface
echo    - Admin dashboard
echo    - Database management
echo    - All key features
echo.
echo 3. Create presentation with:
echo    - Feature overview
echo    - Technical capabilities
echo    - Business benefits
echo.
echo ✅ Share demo materials instead of source code!
echo.
pause
goto end

:end
echo.
echo 🔒 Your code is protected!
echo.
echo 💡 Tips for secure sharing:
echo - Never share source code directly
echo - Use online deployment for demos
echo - Provide limited access credentials
echo - Create professional presentations
echo - Consider licensing agreements
echo.
pause

