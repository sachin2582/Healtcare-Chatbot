#!/bin/bash

# Healthcare Chatbot Production Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting Healthcare Chatbot Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
        print_error "Python is not installed. Please install Python first."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Deploy Frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build frontend
    print_status "Building frontend..."
    npm run build
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod --yes
    
    print_success "Frontend deployed successfully!"
    cd ..
}

# Deploy Backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Login to Railway (if not already logged in)
    print_status "Logging into Railway..."
    railway login
    
    # Deploy backend
    print_status "Deploying backend to Railway..."
    railway up --detach
    
    print_success "Backend deployed successfully!"
}

# Setup Production Database
setup_database() {
    print_status "Setting up production database..."
    
    cd backend
    
    # Install Python dependencies
    print_status "Installing backend dependencies..."
    pip install -r requirements.txt
    
    # Run database migration
    print_status "Running database migration..."
    python -c "
from database import engine
from models import Base
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"
    
    # Populate database with demo data
    print_status "Populating database with demo data..."
    python add_data_to_database.py
    
    print_success "Database setup completed!"
    cd ..
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Check requirements
    check_requirements
    
    # Ask user for deployment options
    echo ""
    print_status "Deployment Options:"
    echo "1. Deploy Frontend only (Vercel)"
    echo "2. Deploy Backend only (Railway)"
    echo "3. Deploy Full Stack (Frontend + Backend)"
    echo "4. Setup Database only"
    echo "5. Complete Deployment (Frontend + Backend + Database)"
    
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            deploy_frontend
            ;;
        2)
            deploy_backend
            ;;
        3)
            deploy_frontend
            deploy_backend
            ;;
        4)
            setup_database
            ;;
        5)
            deploy_frontend
            deploy_backend
            setup_database
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    print_success "Deployment completed successfully!"
    print_status "Next steps:"
    echo "1. Configure environment variables in your deployment platform"
    echo "2. Test your deployed application"
    echo "3. Set up custom domain (optional)"
    echo "4. Configure monitoring and logging"
}

# Run main function
main "$@"
