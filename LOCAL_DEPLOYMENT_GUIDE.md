# 💻 Local PC Deployment Guide

## 🎯 Deploy Healthcare Chatbot on Your Local PC

This guide will help you run your healthcare chatbot locally on your Windows PC.

## 📋 Prerequisites

Make sure you have these installed:
- ✅ Python 3.11 (or 3.9+)
- ✅ Node.js 16+ 
- ✅ Git (optional, if you want to clone)

## 🚀 Step-by-Step Local Deployment

### Step 1: Navigate to Your Project
```bash
cd D:\ChatBot
```

### Step 2: Start Backend Server

**Open Command Prompt or PowerShell:**

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Start Frontend Server

**Open a NEW Command Prompt or PowerShell window:**

```bash
# Navigate to frontend directory
cd D:\ChatBot\frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

**Expected Output:**
```
webpack compiled with 0 errors
Local:            http://localhost:3000
On Your Network:  http://192.168.1.xxx:3000
```

## 🎉 Your Healthcare Chatbot is Now Running!

### 🌐 Access Your Application

**Frontend (Main App):**
- URL: http://localhost:3000
- Features: Chatbot interface, admin panel access

**Backend API:**
- URL: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

**Admin Panel:**
- URL: http://localhost:3000/admin
- Features: Manage doctors, specialties, time slots, health packages

## 🧪 Test Your Local Deployment

### Test Backend API
```bash
# Health check
curl http://localhost:8000/health

# Admin endpoints
curl http://localhost:8000/admin/doctors
curl http://localhost:8000/admin/specialities
```

### Test Frontend
1. Open browser: http://localhost:3000
2. Test chatbot functionality
3. Click "🔧 Admin Panel" button
4. Test all CRUD operations

## 🗄️ Database Setup (If Needed)

If you need to set up the database with demo data:

```bash
cd backend
python add_data_to_database.py
```

This will populate your database with:
- 18 doctors
- 17 medical specialties
- 88 time slots
- 5 health packages

## 🔧 Environment Variables (Optional)

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=sqlite:///./healthcare_chatbot.db

# OpenAI API (if you want to test AI features)
OPENAI_API_KEY=your-openai-api-key

# Environment
ENVIRONMENT=development
DEBUG=true
```

## 📱 Features You Can Test Locally

### ✅ Chatbot Features
- Welcome message with buttons
- Doctor appointment booking
- Health package booking
- Specialty selection
- Time slot management

### ✅ Admin Panel Features
- Add/Edit/Delete doctors
- Manage medical specialties
- Create/Block time slots
- Manage health packages
- View dashboard statistics

### ✅ API Endpoints
- All CRUD operations
- Health check monitoring
- Admin API endpoints
- Chat functionality

## 🚨 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill process if needed
taskkill /PID <process_id> /F
```

### Frontend Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Clear npm cache
npm cache clean --force
npm install
```

### Database Issues
```bash
# Delete existing database and recreate
cd backend
del healthcare_chatbot.db
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"
python add_data_to_database.py
```

## 🎯 Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd D:\ChatBot\backend
pip install -r requirements.txt
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd D:\ChatBot\frontend
npm install
npm start
```

## 📊 Expected URLs

After successful deployment:
- **Main App**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🎉 Success Indicators

Your local deployment is working when:
- ✅ Backend shows "Uvicorn running on http://127.0.0.1:8000"
- ✅ Frontend shows "webpack compiled with 0 errors"
- ✅ You can access http://localhost:3000 in your browser
- ✅ Admin panel loads and functions properly
- ✅ Chatbot responds to messages

---

**🚀 Your healthcare chatbot is now running locally on your PC!**
