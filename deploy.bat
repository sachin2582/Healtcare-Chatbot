@echo off
REM Healthcare Chatbot Production Deployment Script for Windows
REM This script automates the deployment process

setlocal enabledelayedexpansion

echo 🚀 Starting Healthcare Chatbot Production Deployment...

REM Check if required tools are installed
echo [INFO] Checking requirements...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    where python3 >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Python is not installed. Please install Python first.
        pause
        exit /b 1
    )
)

echo [SUCCESS] All requirements are met!

REM Main deployment menu
echo.
echo [INFO] Deployment Options:
echo 1. Deploy Frontend only (Vercel)
echo 2. Deploy Backend only (Railway)
echo 3. Deploy Full Stack (Frontend + Backend)
echo 4. Setup Database only
echo 5. Complete Deployment (Frontend + Backend + Database)

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto deploy_frontend
if "%choice%"=="2" goto deploy_backend
if "%choice%"=="3" goto deploy_fullstack
if "%choice%"=="4" goto setup_database
if "%choice%"=="5" goto complete_deployment

echo [ERROR] Invalid choice. Please run the script again.
pause
exit /b 1

:deploy_frontend
echo [INFO] Deploying frontend to Vercel...
cd frontend

echo [INFO] Installing frontend dependencies...
call npm install

echo [INFO] Building frontend...
call npm run build

echo [INFO] Checking Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
)

echo [INFO] Deploying to Vercel...
call vercel --prod --yes

echo [SUCCESS] Frontend deployed successfully!
cd ..
goto end

:deploy_backend
echo [INFO] Deploying backend to Railway...

echo [INFO] Checking Railway CLI...
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Installing Railway CLI...
    call npm install -g @railway/cli
)

echo [INFO] Logging into Railway...
call railway login

echo [INFO] Deploying backend to Railway...
call railway up --detach

echo [SUCCESS] Backend deployed successfully!
goto end

:deploy_fullstack
call :deploy_frontend
call :deploy_backend
goto end

:setup_database
echo [INFO] Setting up production database...
cd backend

echo [INFO] Installing backend dependencies...
call pip install -r requirements.txt

echo [INFO] Running database migration...
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine); print('Database tables created successfully!')"

echo [INFO] Populating database with demo data...
call python add_data_to_database.py

echo [SUCCESS] Database setup completed!
cd ..
goto end

:complete_deployment
call :deploy_frontend
call :deploy_backend
call :setup_database
goto end

:end
echo.
echo [SUCCESS] Deployment completed successfully!
echo [INFO] Next steps:
echo 1. Configure environment variables in your deployment platform
echo 2. Test your deployed application
echo 3. Set up custom domain (optional)
echo 4. Configure monitoring and logging
echo.
pause
