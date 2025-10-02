# ✅ Railway Deployment Checklist

## 🚀 Pre-Deployment (2 minutes)
- [ ] GitHub repository is connected to Railway
- [ ] `railway.toml` file exists in root directory
- [ ] `backend/requirements.txt` file exists
- [ ] All code is pushed to GitHub

## 🚂 Railway Deployment Steps (5 minutes)

### Step 1: Create Project
- [ ] Go to https://railway.app
- [ ] Login with GitHub
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose "Healtcare-Chatbot" repository
- [ ] Click "Deploy Now"

### Step 2: Add Database
- [ ] Click "New Service" in your project
- [ ] Select "Database" → "PostgreSQL"
- [ ] Wait for database creation (2-3 minutes)

### Step 3: Configure Environment
- [ ] Go to your main service settings
- [ ] Add environment variables:
  - [ ] `OPENAI_API_KEY=your-key-here`
  - [ ] `ENVIRONMENT=production`
  - [ ] `DEBUG=false`
  - [ ] `HOST=0.0.0.0`
  - [ ] `PORT=8000`

### Step 4: Wait for Deployment
- [ ] Monitor deployment logs
- [ ] Wait for "Deployed" status (5-10 minutes)
- [ ] Check that all services show green status

## 🧪 Testing (2 minutes)

### Health Check
- [ ] Open your Railway app URL
- [ ] Add `/health` to the URL
- [ ] Should return: `{"status": "healthy"}`

### Admin API Test
- [ ] Test: `https://your-app.railway.app/admin/doctors`
- [ ] Should return JSON array of doctors
- [ ] Test: `https://your-app.railway.app/admin/specialities`
- [ ] Should return JSON array of specialties

### Database Migration
- [ ] Run database migration (optional)
- [ ] Populate with demo data

## 🎯 Success Criteria
- [ ] ✅ Railway shows "Deployed" status
- [ ] ✅ Health endpoint returns healthy
- [ ] ✅ Admin endpoints return data
- [ ] ✅ No error logs in Railway dashboard
- [ ] ✅ Database is connected and accessible

## 🚨 Common Issues & Quick Fixes

### Build Failed
- **Check**: Railway build logs
- **Fix**: Wait 2-3 minutes, Railway auto-retries

### Database Connection Error
- **Check**: PostgreSQL service is running
- **Fix**: Ensure database service is deployed

### Health Check Failed
- **Check**: OPENAI_API_KEY is set
- **Fix**: Add missing environment variables

### CORS Errors
- **Check**: CORS_ORIGINS environment variable
- **Fix**: Update with frontend URL after Vercel deployment

## 📱 Your Deployment URLs
After successful deployment:
- **Main App**: `https://your-app-name.railway.app`
- **Health Check**: `https://your-app-name.railway.app/health`
- **Admin API**: `https://your-app-name.railway.app/admin/doctors`

## 🎉 Ready for Demo!
Once all items are checked:
- [ ] Your healthcare chatbot is live on Railway
- [ ] Backend API is fully functional
- [ ] Admin panel APIs are working
- [ ] Ready for frontend deployment
- [ ] Ready for client demos

---

**🚀 Follow this checklist step by step for a successful Railway deployment!**
