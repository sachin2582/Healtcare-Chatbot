#!/bin/bash

# Healthcare Chatbot Setup Script
echo "🏥 Setting up Healthcare Chatbot..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is required but not installed."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_chatbot
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=healthcare_chatbot
DATABASE_PORT=5432

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
EMBEDDING_MODEL=text-embedding-3-small

# Application Configuration
SECRET_KEY=your_secret_key_here
DEBUG=True
BACKEND_PORT=8000
FRONTEND_PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# ChromaDB Configuration
CHROMA_PERSIST_DIRECTORY=./chroma_db
EOF
    echo "⚠️  Please update the .env file with your actual API keys and database credentials!"
fi

# Initialize database
echo "Initializing database..."
python init_db.py

# Add sample data
echo "Adding sample data..."
python sample_data.py

cd ..

# Frontend setup
echo "🔧 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file in the backend directory with your OpenAI API key"
echo "2. Make sure PostgreSQL is running and accessible"
echo "3. Start the backend server:"
echo "   cd backend && source venv/bin/activate && python run.py"
echo "4. Start the frontend server:"
echo "   cd frontend && npm start"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:\${FRONTEND_PORT:-3000}"
echo "   Backend API: http://localhost:\${BACKEND_PORT:-8000}"
echo "   API Documentation: http://localhost:\${BACKEND_PORT:-8000}/docs"
