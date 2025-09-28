# Port Configuration Guide

## 🚀 Avoiding Port Conflicts

Yes, the `.env` variables are specifically designed to avoid port conflicts! Here's how to configure different ports for your healthcare chatbot.

## 📋 Default Ports

By default, the application uses these ports:
- **Frontend (React)**: 3000
- **Backend (FastAPI)**: 8000
- **Database (PostgreSQL)**: 5432

## ⚙️ Environment Variables for Ports

Add these variables to your `backend/.env` file:

```env
# Port Configuration
BACKEND_PORT=8000          # FastAPI backend server port
FRONTEND_PORT=3000         # React development server port
DATABASE_PORT=5432         # PostgreSQL database port
```

## 🔧 Common Port Conflicts & Solutions

### 1. **Port 3000 Already in Use** (Common with React apps)
```env
FRONTEND_PORT=3001
```
Then start React with:
```bash
PORT=3001 npm start
```

### 2. **Port 8000 Already in Use** (Common with other APIs)
```env
BACKEND_PORT=8001
```

### 3. **Port 5432 Already in Use** (Common with existing PostgreSQL)
```env
DATABASE_PORT=5433
```

### 4. **XAMPP/WAMP Users** (Apache conflicts)
```env
FRONTEND_PORT=3001
BACKEND_PORT=8001
DATABASE_PORT=5433
```

## 🐳 Docker Configuration

For Docker deployment, you can override ports using environment variables:

```bash
# Example: Use different ports for Docker
export FRONTEND_PORT=3001
export BACKEND_PORT=8001
export DATABASE_PORT=5433

# Then run Docker Compose
docker-compose up -d
```

Or create a `.env` file in the root directory:
```env
FRONTEND_PORT=3001
BACKEND_PORT=8001
DATABASE_PORT=5433
```

## 🔄 How It Works

### Backend Configuration
The backend reads port configuration from environment variables:

```python
# config.py
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))
DATABASE_PORT = int(os.getenv("DATABASE_PORT", "5432"))
```

### Frontend Configuration
The frontend uses the backend port for API calls:

```javascript
// api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  `http://localhost:${process.env.REACT_APP_BACKEND_PORT || '8000'}`;
```

### Docker Configuration
Docker Compose uses environment variables for port mapping:

```yaml
# docker-compose.yml
services:
  frontend:
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
  backend:
    ports:
      - "${BACKEND_PORT:-8000}:8000"
  postgres:
    ports:
      - "${DATABASE_PORT:-5432}:5432"
```

## 📝 Step-by-Step Port Configuration

### 1. **Check Current Port Usage**
```bash
# Windows
netstat -an | findstr :3000
netstat -an | findstr :8000
netstat -an | findstr :5432

# Linux/Mac
lsof -i :3000
lsof -i :8000
lsof -i :5432
```

### 2. **Update Environment Variables**
Edit `backend/.env`:
```env
BACKEND_PORT=8001    # If 8000 is occupied
FRONTEND_PORT=3001   # If 3000 is occupied
DATABASE_PORT=5433   # If 5432 is occupied
```

### 3. **Update CORS Configuration**
```env
CORS_ORIGINS=http://localhost:3001,http://localhost:5173
```

### 4. **Restart Services**
```bash
# Stop existing services
# Then restart with new ports
cd backend && python run.py
cd frontend && PORT=3001 npm start
```

## 🌐 Access URLs

After changing ports, access your application at:
- **Frontend**: `http://localhost:{FRONTEND_PORT}`
- **Backend API**: `http://localhost:{BACKEND_PORT}`
- **API Documentation**: `http://localhost:{BACKEND_PORT}/docs`

## 🚨 Important Notes

1. **CORS Configuration**: Always update `CORS_ORIGINS` when changing frontend port
2. **Database URL**: The `DATABASE_URL` automatically uses the configured `DATABASE_PORT`
3. **React Proxy**: Update `package.json` proxy if needed for development
4. **Firewall**: Ensure new ports are not blocked by firewall

## 🔍 Troubleshooting

### Port Still in Use Error
```bash
# Find process using the port
lsof -i :PORT_NUMBER

# Kill the process (Linux/Mac)
kill -9 PID

# Windows
taskkill /PID PID /F
```

### CORS Errors
Make sure `CORS_ORIGINS` includes your frontend URL:
```env
CORS_ORIGINS=http://localhost:3001,http://localhost:5173
```

### Database Connection Issues
Verify the database port in `DATABASE_URL`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/healthcare_chatbot
```

This configuration system ensures your healthcare chatbot can run alongside other applications without port conflicts!
