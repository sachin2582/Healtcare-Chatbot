# Healthcare Chatbot Local Deployment Script
Write-Host "🚀 Starting Healthcare Chatbot Locally..." -ForegroundColor Green

Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "`n🔧 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\ChatBot\backend; Write-Host 'Starting backend...' -ForegroundColor Green; pip install -r requirements.txt; python main.py"

Write-Host "⏳ Waiting 5 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\ChatBot\frontend; Write-Host 'Starting frontend...' -ForegroundColor Green; npm install; npm start"

Write-Host "`n🎉 Healthcare Chatbot is starting up!" -ForegroundColor Green
Write-Host "`n📱 Your application will be available at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   Admin:    http://localhost:3000/admin" -ForegroundColor White

Write-Host "`n⚠️  Keep both PowerShell windows open while using the application." -ForegroundColor Yellow
Read-Host "`nPress Enter to continue"
