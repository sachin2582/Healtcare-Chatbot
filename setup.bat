@echo off
REM Healthcare Chatbot Setup Script for Windows
echo 🏥 Setting up Healthcare Chatbot...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is required but not installed.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is required but not installed.
    pause
    exit /b 1
)

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is required but not installed.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Backend setup
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    (
        echo # Database Configuration
        echo DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_chatbot
        echo POSTGRES_USER=postgres
        echo POSTGRES_PASSWORD=password
        echo POSTGRES_DB=healthcare_chatbot
        echo DATABASE_PORT=5432
        echo.
        echo # OpenAI Configuration
        echo OPENAI_API_KEY=your_openai_api_key_here
        echo OPENAI_MODEL=gpt-3.5-turbo
        echo EMBEDDING_MODEL=text-embedding-3-small
        echo.
        echo # Application Configuration
        echo SECRET_KEY=your_secret_key_here
        echo DEBUG=True
        echo BACKEND_PORT=8000
        echo FRONTEND_PORT=3000
        echo CORS_ORIGINS=http://localhost:3000,http://localhost:5173
        echo.
        echo # ChromaDB Configuration
        echo CHROMA_PERSIST_DIRECTORY=./chroma_db
    ) > .env
    echo ⚠️  Please update the .env file with your actual API keys and database credentials!
)

REM Initialize database
echo Initializing database...
python init_db.py

REM Add sample data
echo Adding sample data...
python sample_data.py

cd ..

REM Frontend setup
echo 🔧 Setting up frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
npm install

cd ..

echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update the .env file in the backend directory with your OpenAI API key
echo 2. Make sure PostgreSQL is running and accessible
echo 3. Start the backend server:
echo    cd backend ^&^& venv\Scripts\activate ^&^& python run.py
echo 4. Start the frontend server:
echo    cd frontend ^&^& npm start
echo.
echo 🌐 The application will be available at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Documentation: http://localhost:8000/docs
pause
