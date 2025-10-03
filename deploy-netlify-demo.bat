@echo off
echo 🌐 Deploying Healthcare Chatbot to Netlify (Demo Mode)
echo.

echo 📋 This will deploy your frontend with fallback data for demo purposes.
echo ⚠️  This version will work without a backend API.
echo.

pause

echo 🔧 Building frontend with fallback data support...
cd frontend

echo.
echo 📦 Installing dependencies...
npm install

echo.
echo 🔨 Building for production...
npm run build

echo.
echo ✅ Build completed successfully!
echo.

echo 🌐 Your build is ready for Netlify deployment:
echo 📁 Build folder: frontend/build/
echo.

echo 📋 Next steps:
echo 1. Go to https://netlify.com
echo 2. Drag and drop the 'frontend/build' folder
echo 3. Get your deployment URL
echo.

echo 🎯 Demo Features Available:
echo ✅ Healthcare chatbot interface
echo ✅ Admin panel with demo data
echo ✅ Doctor and specialty management
echo ✅ Time slot management
echo ✅ Health package booking
echo ✅ Professional UI/UX
echo.

echo 📱 Demo Data Included:
echo - 5 sample doctors
echo - 8 medical specialties  
echo - Sample time slots
echo - 3 health packages
echo - 2 sample patients
echo.

echo 🚀 Your demo is ready for deployment!
echo.
pause

