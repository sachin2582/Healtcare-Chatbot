@echo off
echo 📦 Creating Healthcare Chatbot Installation Package...

echo.
echo Creating installation folder...
mkdir Healthcare-Chatbot-Installation 2>nul

echo.
echo Copying project files...
xcopy /E /I /Y . Healthcare-Chatbot-Installation\Healthcare-Chatbot

echo.
echo Creating installation script...
(
echo @echo off
echo echo 🚀 Healthcare Chatbot Installation
echo echo.
echo echo This will install the healthcare chatbot on your PC.
echo echo.
echo pause
echo.
echo echo 📋 Checking prerequisites...
echo python --version ^>nul 2^>^&1
echo if %%errorlevel%% neq 0 ^(
echo     echo ❌ Python not found. Please install Python 3.11 first.
echo     echo Download from: https://python.org
echo     pause
echo     exit /b 1
echo ^)
echo.
echo node --version ^>nul 2^>^&1
echo if %%errorlevel%% neq 0 ^(
echo     echo ❌ Node.js not found. Please install Node.js first.
echo     echo Download from: https://nodejs.org
echo     pause
echo     exit /b 1
echo ^)
echo.
echo echo ✅ Prerequisites check passed!
echo echo.
echo echo 🔧 Installing dependencies...
echo.
echo cd Healthcare-Chatbot\backend
echo pip install -r requirements.txt
echo.
echo cd ..\frontend
echo npm install
echo.
echo cd ..\backend
echo python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine^)"
echo python add_data_to_database.py
echo.
echo echo.
echo echo ✅ Installation completed!
echo echo.
echo echo 🚀 Run start.bat to start the application.
echo pause
) > Healthcare-Chatbot-Installation\install.bat

echo.
echo Creating startup script...
(
echo @echo off
echo echo 🚀 Starting Healthcare Chatbot...
echo.
echo start "Backend" cmd /k "cd Healthcare-Chatbot\backend && python main.py"
echo timeout /t 5
echo start "Frontend" cmd /k "cd Healthcare-Chatbot\frontend && npm start"
echo.
echo echo ✅ Application started!
echo echo 🌐 Open http://localhost:3000 in your browser
echo pause
) > Healthcare-Chatbot-Installation\start.bat

echo.
echo Creating README file...
(
echo # Healthcare Chatbot Installation
echo.
echo ## Prerequisites
echo 1. Install Python 3.11: https://python.org
echo 2. Install Node.js: https://nodejs.org
echo.
echo ## Installation
echo 1. Run: install.bat
echo 2. Run: start.bat
echo.
echo ## Access
echo - Main App: http://localhost:3000
echo - Admin Panel: http://localhost:3000/admin
echo.
echo ## Features
echo - Healthcare chatbot with AI
echo - Doctor appointment booking
echo - Admin panel for management
echo - Health package booking
echo.
echo ## Support
echo Contact [Your Name] for assistance.
) > Healthcare-Chatbot-Installation\README.md

echo.
echo Creating prerequisites file...
(
echo Required Software:
echo 1. Python 3.11 - https://python.org
echo 2. Node.js 16+ - https://nodejs.org
echo.
echo System Requirements:
echo - Windows 10/11, macOS, or Linux
echo - 4GB RAM minimum
echo - 2GB free storage
echo - Internet connection for setup
) > Healthcare-Chatbot-Installation\prerequisites.txt

echo.
echo ✅ Installation package created successfully!
echo.
echo 📁 Package location: Healthcare-Chatbot-Installation\
echo 📦 Contents:
echo    - Healthcare-Chatbot/ (your project)
echo    - install.bat (installation script)
echo    - start.bat (startup script)
echo    - README.md (instructions)
echo    - prerequisites.txt (requirements)
echo.
echo 🚀 You can now share this folder with others!
echo.
pause

