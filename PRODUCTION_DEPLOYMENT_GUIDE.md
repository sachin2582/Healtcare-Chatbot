# 🚀 Healthcare Chatbot - Production Deployment Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Production Environment Setup](#production-environment-setup)
3. [Database Configuration](#database-configuration)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Backend Deployment Options](#backend-deployment-options)
6. [Environment Variables](#environment-variables)
7. [Database Migration](#database-migration)
8. [Domain Configuration](#domain-configuration)
9. [SSL/HTTPS Setup](#sslhttps-setup)
10. [Monitoring & Logging](#monitoring--logging)
11. [Backup Strategy](#backup-strategy)
12. [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide will help you deploy your healthcare chatbot to production environments. The application consists of:
- **Frontend**: React application (deploy to Vercel)
- **Backend**: FastAPI application (deploy to Railway/Render)
- **Database**: PostgreSQL (production database)

## 🔧 Production Environment Setup

### Prerequisites
- GitHub repository with your code
- Domain name (optional)
- Production database (PostgreSQL)
- Environment variables configured

### Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│  (PostgreSQL)   │
│   React App     │    │   FastAPI       │    │   Production    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ Database Configuration

### Option 1: Railway PostgreSQL (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy connection details

### Option 2: Supabase (Alternative)
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Get database connection string
4. Use PostgreSQL connection

### Option 3: Render PostgreSQL
1. Go to [Render.com](https://render.com)
2. Create new PostgreSQL database
3. Get connection details

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

1. **Update API Configuration**
```javascript
// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Update all API calls to use production URL
```

2. **Create Vercel Configuration**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ]
}
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from Frontend Directory**
```bash
cd frontend
vercel --prod
```

4. **Set Environment Variables in Vercel Dashboard**
```
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_ADMIN_API_URL=https://your-backend-url.com/admin
```

## ⚙️ Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Create Railway Project**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

2. **Configure Railway**
```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd backend && python main.py"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "always"
```

3. **Deploy Backend**
```bash
railway up
```

### Option 2: Render

1. **Create Render Web Service**
2. **Configure Build Settings**
```bash
Build Command: cd backend && pip install -r requirements.txt
Start Command: cd backend && python main.py
```

### Option 3: Heroku

1. **Create Heroku App**
```bash
heroku create your-chatbot-backend
```

2. **Configure Procfile**
```
# Procfile
web: cd backend && python main.py
```

3. **Deploy**
```bash
git push heroku master
```

## 🔐 Environment Variables

### Frontend Environment Variables (Vercel)
```env
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_ADMIN_API_URL=https://your-backend-url.com/admin
REACT_APP_ENVIRONMENT=production
```

### Backend Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=healthcare_chatbot
DB_USER=your-username
DB_PASSWORD=your-password

# API Keys
OPENAI_API_KEY=your-openai-key
LLAMA_API_KEY=your-llama-key

# CORS
CORS_ORIGINS=https://your-frontend-url.vercel.app
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app

# Security
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret

# Environment
ENVIRONMENT=production
DEBUG=false
```

## 🗃️ Database Migration

### Step 1: Update Database Configuration
```python
# backend/config.py
import os
from sqlalchemy import create_engine

# Production database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./healthcare_chatbot.db")

if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(DATABASE_URL)
else:
    # Fallback to SQLite for development
    engine = create_engine("sqlite:///./healthcare_chatbot.db")
```

### Step 2: Run Database Migration
```bash
# Connect to production database
cd backend
python -c "
from database import engine
from models import Base
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"
```

### Step 3: Populate Production Database
```bash
# Run the population script
python add_data_to_database.py
```

## 🌐 Domain Configuration

### Custom Domain Setup (Optional)

1. **Vercel Custom Domain**
   - Go to Vercel Dashboard
   - Add your domain
   - Update DNS records

2. **Backend Custom Domain**
   - Configure custom domain in Railway/Render
   - Update CORS settings

3. **Update Environment Variables**
```env
CORS_ORIGINS=https://your-domain.com
REACT_APP_API_BASE_URL=https://api.your-domain.com
```

## 🔒 SSL/HTTPS Setup

### Automatic SSL (Recommended)
- Vercel: Automatic HTTPS
- Railway: Automatic HTTPS
- Render: Automatic HTTPS

### Manual SSL (If needed)
```nginx
# nginx configuration
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring & Logging

### Application Monitoring
```python
# backend/monitoring.py
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }
```

### Error Tracking
```python
# Add to main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
)
```

## 💾 Backup Strategy

### Database Backup
```bash
# PostgreSQL backup
pg_dump -h your-host -U your-user -d your-database > backup.sql

# Restore
psql -h your-host -U your-user -d your-database < backup.sql
```

### Automated Backup Script
```python
# backup_script.py
import os
import subprocess
from datetime import datetime

def backup_database():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"backup_{timestamp}.sql"
    
    cmd = [
        "pg_dump",
        "-h", os.getenv("DB_HOST"),
        "-U", os.getenv("DB_USER"),
        "-d", os.getenv("DB_NAME"),
        "-f", backup_file
    ]
    
    subprocess.run(cmd, check=True)
    print(f"Backup created: {backup_file}")

if __name__ == "__main__":
    backup_database()
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
```python
# backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Database Connection Issues**
```python
# Check database connection
import psycopg2

def test_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        print("Database connection successful!")
        conn.close()
    except Exception as e:
        print(f"Database connection failed: {e}")
```

3. **Environment Variables Not Loading**
```python
# backend/config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

# Verify environment variables
required_vars = ["DATABASE_URL", "OPENAI_API_KEY"]
for var in required_vars:
    if not os.getenv(var):
        raise ValueError(f"Environment variable {var} is required")
```

## 📱 Demo Setup Checklist

### Pre-Demo Setup
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render
- [ ] Set up production database
- [ ] Configure all environment variables
- [ ] Run database migration
- [ ] Populate with demo data
- [ ] Test all admin panel functions
- [ ] Test chatbot functionality
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring
- [ ] Create backup strategy

### Demo Data
```sql
-- Verify demo data exists
SELECT COUNT(*) FROM doctors;        -- Should be 18
SELECT COUNT(*) FROM specialities;   -- Should be 17
SELECT COUNT(*) FROM doctor_time_slots; -- Should be 88
SELECT COUNT(*) FROM health_packages;   -- Should be 5
```

## 🎯 Quick Start Commands

### Deploy Frontend
```bash
cd frontend
npm install
npm run build
vercel --prod
```

### Deploy Backend
```bash
cd backend
pip install -r requirements.txt
railway up
```

### Database Setup
```bash
cd backend
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"
python add_data_to_database.py
```

## 📞 Support

For deployment issues:
1. Check logs in deployment platform
2. Verify environment variables
3. Test database connectivity
4. Check CORS configuration
5. Verify SSL certificates

---

**🎉 Your healthcare chatbot is now ready for production deployment!**
