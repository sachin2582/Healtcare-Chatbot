# 🚂 Railway Deployment Guide for Healthcare Chatbot

## 📋 Prerequisites
- ✅ GitHub repository connected to Railway
- ✅ Railway account set up
- ✅ Project code pushed to GitHub

## 🚀 Step-by-Step Railway Deployment

### Step 1: Create Railway Project

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Login with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your healthcare chatbot repository

### Step 2: Configure Service

1. **Add Backend Service**
   - Railway will auto-detect your project
   - Select "Deploy" for the main service
   - Railway will use the `railway.toml` configuration

2. **Set Root Directory** (if needed)
   - In Railway dashboard, go to Settings
   - Set Root Directory to `backend/`

### Step 3: Add PostgreSQL Database

1. **Add Database Service**
   - In your Railway project dashboard
   - Click "New Service"
   - Select "Database" → "PostgreSQL"

2. **Connect Database**
   - Railway will automatically provide `DATABASE_URL`
   - Copy the connection string for later use

### Step 4: Configure Environment Variables

In your Railway service settings, add these environment variables:

#### **Required Environment Variables:**
```env
# Database (Auto-provided by Railway)
DATABASE_URL=postgresql://username:password@host:port/database

# API Keys (You need to provide these)
OPENAI_API_KEY=your-openai-api-key-here

# Environment
ENVIRONMENT=production
DEBUG=false
HOST=0.0.0.0
PORT=8000

# CORS (Update with your frontend URL after deployment)
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

#### **Optional Environment Variables:**
```env
# Security
SECRET_KEY=your-secret-key-change-this
JWT_SECRET=your-jwt-secret-change-this

# Logging
LOG_LEVEL=INFO
```

### Step 5: Deploy and Test

1. **Trigger Deployment**
   - Push any change to your GitHub repository
   - Railway will automatically deploy

2. **Check Deployment Status**
   - Go to Railway dashboard
   - Monitor the deployment logs
   - Wait for "Deployed" status

3. **Test Health Endpoint**
   - Your app will be available at: `https://your-app-name.railway.app`
   - Test: `https://your-app-name.railway.app/health`

### Step 6: Database Migration

1. **Connect to Railway CLI** (Optional)
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   ```

2. **Run Database Migration**
   ```bash
   railway run python production_migration.py
   ```

   Or manually run the migration script locally with Railway DATABASE_URL:
   ```bash
   cd backend
   DATABASE_URL=your-railway-database-url python production_migration.py
   ```

### Step 7: Update CORS Settings

After your backend is deployed:

1. **Get Your Backend URL**
   - Copy your Railway app URL: `https://your-app-name.railway.app`

2. **Update CORS in Railway**
   - Go to Railway service settings
   - Update `CORS_ORIGINS` environment variable
   - Add your frontend URL when you deploy it

## 🔧 Railway-Specific Configuration

### railway.toml Configuration
Your `railway.toml` file is already configured:
```toml
[build]
builder = "nixpacks"
buildCommand = "cd backend && pip install -r requirements.txt"

[deploy]
startCommand = "cd backend && python main.py"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "always"

[env]
PYTHON_VERSION = "3.11"
PORT = "8000"
HOST = "0.0.0.0"
```

### Requirements.txt
Make sure your `backend/requirements.txt` includes all dependencies:
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
openai==1.3.7
chromadb==0.4.18
python-multipart==0.0.6
pydantic==2.5.0
```

## 🚨 Troubleshooting Railway Deployment

### Common Issues:

1. **Build Fails**
   - Check Railway build logs
   - Verify `requirements.txt` exists in backend folder
   - Ensure Python version is compatible

2. **Database Connection Error**
   - Verify `DATABASE_URL` is set correctly
   - Check if PostgreSQL service is running
   - Ensure database credentials are correct

3. **Health Check Fails**
   - Verify `/health` endpoint exists
   - Check if app starts successfully
   - Review application logs

4. **CORS Errors**
   - Update `CORS_ORIGINS` with correct frontend URL
   - Restart the service after updating environment variables

### Railway Logs
- Go to Railway dashboard
- Click on your service
- View "Deployments" tab for logs
- Check "Logs" tab for runtime logs

## 📊 Post-Deployment Verification

### Test These Endpoints:
```bash
# Health check
curl https://your-app-name.railway.app/health

# Admin endpoints
curl https://your-app-name.railway.app/admin/doctors
curl https://your-app-name.railway.app/admin/specialities

# Chat endpoint
curl -X POST https://your-app-name.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Expected Responses:
- Health check: `{"status": "healthy", "environment": "production", "version": "1.0.0"}`
- Admin endpoints: JSON arrays of data
- Chat endpoint: Chat response

## 🎯 Next Steps After Railway Deployment

1. **Deploy Frontend to Vercel**
   - Use your Railway backend URL for `REACT_APP_API_BASE_URL`
   - Update CORS settings in Railway

2. **Set Up Custom Domain** (Optional)
   - Configure custom domain in Railway settings
   - Update DNS records

3. **Monitor and Maintain**
   - Set up monitoring
   - Regular database backups
   - Monitor logs and performance

## 🔗 Railway Dashboard URLs

After deployment, you'll have:
- **Railway Dashboard**: `https://railway.app/dashboard`
- **Your App**: `https://your-app-name.railway.app`
- **Database**: Accessible via Railway dashboard
- **Logs**: Available in Railway dashboard

---

**🚂 Your healthcare chatbot backend is now ready for Railway deployment!**
