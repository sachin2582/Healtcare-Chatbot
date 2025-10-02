@echo off
echo 🔧 Setting up Healthcare Chatbot for Local Deployment...

echo.
echo 📋 Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed.
    pause
    exit /b 1
)

echo.
echo 📋 Installing Frontend Dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies installation failed.
    pause
    exit /b 1
)

echo.
echo 🗄️ Setting up Database...
cd ..\backend
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine); print('Database tables created successfully!')"

echo.
echo 📊 Populating Database with Demo Data...
python add_data_to_database.py

echo.
echo ✅ Setup completed successfully!
echo.
echo 🚀 You can now run start-local.bat to start the application.
echo.
pause
