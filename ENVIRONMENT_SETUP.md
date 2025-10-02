# 🔧 Environment Setup Guide

## 📋 Quick Setup Checklist

### For Demo Deployment
- [ ] Set up production database (PostgreSQL)
- [ ] Configure environment variables
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Run database migration
- [ ] Test all functionality

## 🗄️ Database Setup Options

### Option 1: Railway PostgreSQL (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login
3. Create new project
4. Add PostgreSQL database
5. Copy connection string

### Option 2: Supabase (Free Tier Available)
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string

### Option 3: Render PostgreSQL
1. Go to [Render.com](https://render.com)
2. Create new PostgreSQL database
3. Copy connection details

## 🔐 Environment Variables Configuration

### Backend Environment Variables

#### Required Variables:
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=healthcare_chatbot
DB_USER=your-username
DB_PASSWORD=your-password

# API Keys
OPENAI_API_KEY=your-openai-api-key

# CORS (Update with your frontend URL)
CORS_ORIGINS=https://your-frontend.vercel.app

# Environment
ENVIRONMENT=production
```

#### Optional Variables:
```env
# Security
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret

# Server
HOST=0.0.0.0
PORT=8000

# Logging
LOG_LEVEL=INFO
DEBUG=false
```

### Frontend Environment Variables

#### Required Variables:
```env
# API Configuration
REACT_APP_API_BASE_URL=https://your-backend.railway.app
REACT_APP_ADMIN_API_URL=https://your-backend.railway.app/admin

# Environment
REACT_APP_ENVIRONMENT=production
```

## 🚀 Deployment Platforms

### Backend Deployment

#### Railway (Recommended)
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

#### Render
1. Connect GitHub repository
2. Set build command: `cd backend && pip install -r requirements.txt`
3. Set start command: `cd backend && python main.py`
4. Add environment variables

#### Heroku
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
4. Deploy: `git push heroku master`

### Frontend Deployment

#### Vercel (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `cd frontend && vercel --prod`

#### Netlify
1. Connect GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`
4. Add environment variables

## 📊 Database Migration

### Automatic Migration (Recommended)
```bash
cd backend
python production_migration.py
```

### Manual Migration
```bash
cd backend
python -c "
from database import engine
from models import Base
Base.metadata.create_all(bind=engine)
print('Tables created successfully!')
"

python add_data_to_database.py
```

## 🔍 Verification Steps

### 1. Database Verification
```sql
-- Check if tables exist and have data
SELECT COUNT(*) FROM doctors;        -- Should be 18
SELECT COUNT(*) FROM specialities;   -- Should be 17
SELECT COUNT(*) FROM doctor_time_slots; -- Should be 88
SELECT COUNT(*) FROM health_packages;   -- Should be 5
```

### 2. API Verification
```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test admin endpoints
curl https://your-backend-url.com/admin/doctors
curl https://your-backend-url.com/admin/specialities
```

### 3. Frontend Verification
- [ ] Chatbot loads correctly
- [ ] Admin panel accessible
- [ ] All CRUD operations work
- [ ] Time slot management works
- [ ] Health package booking works

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```python
# Test connection
import psycopg2
try:
    conn = psycopg2.connect(DATABASE_URL)
    print("✅ Connection successful")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")
```

#### 2. CORS Errors
```python
# Update CORS origins in backend/config.py
CORS_ORIGINS = [
    "https://your-frontend.vercel.app",
    "https://your-custom-domain.com"
]
```

#### 3. Environment Variables Not Loading
```python
# Verify in backend
import os
from dotenv import load_dotenv

load_dotenv()
print(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")
print(f"OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY')}")
```

#### 4. Frontend API Calls Failing
```javascript
// Check API base URL in frontend
console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);

// Test API connectivity
fetch(`${process.env.REACT_APP_API_BASE_URL}/health`)
  .then(response => response.json())
  .then(data => console.log('API Response:', data))
  .catch(error => console.error('API Error:', error));
```

## 📱 Demo Preparation

### Pre-Demo Checklist
- [ ] All environment variables configured
- [ ] Database populated with demo data
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Admin panel fully functional
- [ ] Chatbot responding correctly
- [ ] Time slot management working
- [ ] Health package booking working
- [ ] Custom domain configured (optional)
- [ ] SSL certificates working
- [ ] Monitoring set up (optional)

### Demo Data Verification
```bash
# Run this to verify demo data
cd backend
python -c "
from database import get_db
from models import Doctor, Speciality, DoctorTimeSlots, HealthPackage
from sqlalchemy.orm import Session

db = next(get_db())
print(f'Doctors: {db.query(Doctor).count()}')
print(f'Specialities: {db.query(Speciality).count()}')
print(f'Time Slots: {db.query(DoctorTimeSlots).count()}')
print(f'Health Packages: {db.query(HealthPackage).count()}')
"
```

## 🔄 Updates and Maintenance

### Updating Environment Variables
1. Update variables in deployment platform
2. Restart the application
3. Verify changes are applied

### Database Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_file.sql
```

### Monitoring
- Set up health checks
- Monitor API response times
- Track error rates
- Monitor database performance

---

**🎯 Your healthcare chatbot is now ready for production deployment!**
