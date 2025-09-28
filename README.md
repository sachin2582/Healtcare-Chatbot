# Healthcare Chatbot 🏥

A comprehensive AI-powered healthcare chatbot built with React frontend and FastAPI backend, featuring appointment booking, health checkup packages, and callback requests.

## 🌟 Features

### 🤖 AI Chatbot
- **Smart Conversations**: Natural language processing for health-related queries
- **Context Awareness**: Maintains conversation context for better responses
- **Multi-specialty Support**: Covers various medical specialties

### 📅 Appointment Booking
- **Specialty Selection**: Choose from various medical specialties
- **Doctor Selection**: Browse and select preferred doctors
- **Time Slot Management**: Real-time availability checking
- **Patient Information**: Secure patient data collection
- **Booking Confirmation**: Email/SMS confirmations

### 🏥 Health Checkup Packages
- **Comprehensive Packages**: Multiple health screening options
- **Package Details**: Detailed test information and pricing
- **Professional Design**: Clean, modern interface
- **Compact Cards**: Efficient space utilization
- **Package Booking**: Direct booking from package selection

### 📞 Callback Requests
- **Easy Request**: Simple callback request flow
- **Mobile Validation**: Real-time phone number validation
- **Database Storage**: Secure callback request storage
- **Executive Follow-up**: Automated callback scheduling

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material-UI Components**: Professional, modern design
- **Floating Chatbot**: Always accessible chat interface
- **Landing Page**: Comprehensive healthcare information

## 🚀 Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Material-UI (MUI)**: Professional UI components
- **Axios**: HTTP client for API calls
- **Context API**: State management
- **CSS3**: Custom styling and animations

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **SQLite**: Lightweight database (configurable for PostgreSQL)
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server

### AI/ML
- **Enhanced RAG Service**: Retrieval-Augmented Generation
- **ChromaDB**: Vector database for embeddings
- **OpenAI Integration**: GPT models for natural language processing

## 📁 Project Structure

```
ChatBot/
├── backend/
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic schemas
│   ├── main.py                # FastAPI application
│   ├── database.py            # Database configuration
│   ├── config.py              # Application configuration
│   ├── rag_service_enhanced.py # AI service
│   ├── migrate_*.py           # Database migration scripts
│   └── populate_*.py          # Data population scripts
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── contexts/          # React contexts
│   │   ├── config/            # Configuration files
│   │   └── styles/            # CSS files
│   ├── public/                # Static assets
│   └── package.json           # Dependencies
└── README.md                  # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy python-dotenv openai chromadb
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**
   ```bash
   python migrate_callback_requests.py
   ```

5. **Populate initial data:**
   ```bash
   python populate_health_packages.py
   ```

6. **Start the backend server:**
   ```bash
   python main.py
   ```
   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Application will run on `http://localhost:3000`

## 📱 Usage

### Starting the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   python main.py
   ```

2. **Start Frontend (in new terminal):**
   ```bash
   cd frontend
   npm start
   ```

3. **Open Browser:**
   Navigate to `http://localhost:3000`

### Key Features Usage

#### 🤖 Chat with AI
- Click the floating chatbot button
- Ask health-related questions
- Use quick action buttons for common queries

#### 📅 Book Appointments
1. Click "Appointment Booking" in welcome options
2. Select medical specialty
3. Choose preferred doctor
4. Fill patient information
5. Select available time slot
6. Confirm booking

#### 🏥 Health Checkup Packages
1. Click "Book a Health Checkup" in welcome options
2. Browse available packages
3. View package details and tests
4. Book preferred package

#### 📞 Request Callback
1. Click "Request a Callback" in welcome options
2. Provide mobile number when prompted
3. Receive confirmation message

## 🔧 API Endpoints

### Health Checkup Packages
- `GET /health-packages` - Get all packages
- `GET /health-packages/{id}` - Get package details
- `POST /health-packages/book` - Book a package

### Appointments
- `GET /specialities` - Get medical specialties
- `GET /doctors` - Get doctors by specialty
- `GET /doctors/{id}/available-slots` - Get available time slots
- `POST /appointments/book` - Book appointment

### Callback Requests
- `POST /callback-requests` - Create callback request
- `GET /callback-requests` - Get all requests
- `PUT /callback-requests/{id}` - Update request status

## 🗄️ Database Schema

### Key Tables
- **patients**: Patient information
- **doctors**: Doctor profiles and specialties
- **appointments**: Appointment bookings
- **health_packages**: Health checkup packages
- **callback_requests**: Callback request management

## 🎨 UI/UX Features

### Design Principles
- **Professional**: Healthcare-grade interface design
- **Accessible**: WCAG compliant components
- **Responsive**: Mobile-first design approach
- **Intuitive**: User-friendly navigation

### Key Components
- **Floating Chatbot**: Always accessible AI assistant
- **Welcome Cards**: Clear action options
- **Compact Package Cards**: Efficient information display
- **Professional Forms**: Clean data collection interfaces

## 🔒 Security Features

- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: Graceful error management

## 🚀 Deployment

### Backend Deployment
1. Configure production database
2. Set environment variables
3. Use production WSGI server (Gunicorn)
4. Deploy to cloud platform (AWS, Azure, GCP)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, AWS S3)
3. Configure API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: [Your Contact Information]

## 🙏 Acknowledgments

- Material-UI team for excellent components
- FastAPI for the amazing Python framework
- OpenAI for AI capabilities
- Healthcare professionals for domain expertise

---

**Built with ❤️ for better healthcare accessibility**