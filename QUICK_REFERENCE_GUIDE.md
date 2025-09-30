# 🚀 Healthcare Chatbot - Quick Reference Guide

## 📋 Overview
This guide provides a quick reference for understanding and modifying the Healthcare Chatbot application. Perfect for reverse engineering and making custom changes.

---

## 🎯 **Quick Start - Key Files to Know**

### **Frontend (React)**
| File | Purpose | Key Functions |
|------|---------|---------------|
| `App.js` | Main router & theme | Routes, Material-UI theme |
| `LandingPage.js` | Marketing page | Doctor showcase, chat triggers |
| `ChatInterface.js` | Basic chat | Message handling, appointment flow |
| `ProfessionalChatInterface.js` | Enhanced chat | Dynamic buttons, advanced features |
| `AppointmentFlow.js` | Booking flow | Multi-step appointment process |
| `FloatingChatbot.js` | Persistent widget | Always-visible chat button |

### **Backend (FastAPI)**
| File | Purpose | Key Functions |
|------|---------|---------------|
| `main.py` | API server | All endpoints, CORS, RAG integration |
| `models.py` | Database schema | SQLAlchemy models |
| `database.py` | DB connection | Session management |
| `rag_service_enhanced.py` | AI service | Chatbot intelligence |

### **Services (Frontend)**
| File | Purpose | API Calls |
|------|---------|-----------|
| `api.js` | Base API service | Generic HTTP methods |
| `chatService.js` | Chat functionality | POST /chat |
| `appointmentService.js` | Appointments | GET/POST appointments |
| `healthPackageService.js` | Health packages | GET/POST packages |
| `chatButtonService.js` | Dynamic buttons | GET/POST chat buttons |

---

## 🔄 **Common User Flows**

### **Flow 1: Landing Page → Chat → Appointment**
```
1. User visits / → LandingPage.js loads
2. Clicks "Start Chat" → Opens ChatInterface modal
3. Types message → sendMessage() → POST /chat
4. Clicks "Book Appointment" → Opens AppointmentFlow
5. Selects speciality → GET /specialities
6. Selects doctor → GET /doctors
7. Selects time → GET /available-slots
8. Confirms booking → POST /appointments
```

### **Flow 2: Floating Chat → Health Package**
```
1. User clicks floating button → FloatingChatbot.js
2. Opens ProfessionalChatInterface
3. Clicks "Health Checkup" → Opens HealthPackageBooking
4. Selects package → GET /health-packages
5. Books package → POST /health-package-bookings
```

### **Flow 3: Callback Request**
```
1. User types "callback" in chat
2. ChatInterface detects callback intent
3. Asks for mobile number
4. Validates number → callbackService.validateMobileNumber()
5. Creates request → POST /callback-requests
```

---

## 🛠️ **Common Modifications**

### **Adding New Chat Buttons**
```sql
-- Add to database
INSERT INTO chat_buttons (button_text, button_action, button_value, button_icon, button_color, button_variant, display_order, is_active, category, description) 
VALUES ('New Action', 'custom', 'new_action', 'icon_name', 'primary', 'contained', 7, true, 'info', 'Description');
```
*No code changes needed - buttons auto-load from API*

### **Adding New API Endpoint**
```python
# Backend: main.py
@app.get("/new-endpoint")
async def new_endpoint(db: Session = Depends(get_db)):
    return {"data": "response"}
```

```javascript
// Frontend: services/api.js
export const getNewData = async () => {
  const response = await apiService.get('/new-endpoint');
  return response.data;
};
```

### **Modifying Chat Responses**
```javascript
// Frontend: ChatInterface.js - sendMessage() function
// Add custom logic before API call
if (currentMessage.toLowerCase().includes('custom keyword')) {
  // Handle custom response
  return;
}
```

### **Adding New Appointment Step**
```javascript
// Frontend: AppointmentFlow.js
const steps = [
  'Select Speciality',
  'Select Doctor', 
  'New Step',        // Add here
  'Book Appointment'
];

// Add new component and navigation logic
```

---

## 🎨 **Styling & UI Changes**

### **Global Theme**
```javascript
// App.js - Modify theme object
const theme = createTheme({
  palette: {
    primary: { main: '#0f6c3f' },  // Change colors here
    secondary: { main: '#ff6f3c' }
  }
});
```

### **Component Styling**
- **CSS Files**: `*.css` files in components
- **Material-UI**: Use `sx` prop for inline styles
- **Global Styles**: `index.css`

---

## 🗄️ **Database Operations**

### **Key Tables**
- `patients` - Patient information
- `doctors` - Doctor profiles  
- `specialities` - Medical specialities
- `appointments` - Appointment bookings
- `health_packages` - Health checkup packages
- `chat_buttons` - Dynamic chat buttons
- `callback_requests` - Callback requests

### **Common Queries**
```sql
-- Get all active doctors
SELECT * FROM doctors WHERE is_available = true;

-- Get appointments for today
SELECT * FROM appointments WHERE DATE(appointment_date) = CURDATE();

-- Get available time slots
SELECT * FROM doctor_time_slots WHERE is_available = true;
```

---

## 🔧 **Environment Configuration**

### **Backend (.env)**
```bash
DATABASE_URL=sqlite:///./healthcare_chatbot.db
BACKEND_PORT=8000
FRONTEND_PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### **Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:8000
```

---

## 🚀 **Running the Application**

### **Backend**
```bash
cd backend
python run.py
# Server runs on http://localhost:8000
```

### **Frontend**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

---

## 📊 **Key Event Mappings**

| User Action | Component | Handler | API Call | Result |
|-------------|-----------|---------|----------|--------|
| Click "Start Chat" | LandingPage | handleStartChat | None | Opens ChatInterface |
| Type message | ChatInterface | sendMessage | POST /chat | AI response |
| Click "Book Appointment" | ChatInterface | setAppointmentDialogOpen | None | Opens AppointmentFlow |
| Select speciality | AppointmentFlow | handleSpecialitySelect | GET /specialities | Move to doctor selection |
| Select doctor | AppointmentFlow | handleDoctorSelect | GET /doctors | Move to booking |
| Select time slot | AppointmentBooking | handleTimeSelect | GET /available-slots | Show confirmation |
| Confirm booking | AppointmentBooking | handleSubmit | POST /appointments | Show success |
| Click floating chat | FloatingChatbot | toggleChat | None | Open chat widget |
| Click chat button | ProfessionalChatInterface | handleButtonClick | GET /chat-buttons | Execute action |

---

## 🐛 **Common Issues & Solutions**

### **"Failed to fetch" Error**
- Check if backend is running on port 8000
- Verify CORS settings in main.py
- Check network tab in browser dev tools

### **Database Errors**
- Run `python init_db.py` to create tables
- Run population scripts to add sample data
- Check database file permissions

### **Component Not Loading**
- Check import paths
- Verify component exports
- Check console for JavaScript errors

### **API Endpoint Not Found**
- Verify endpoint URL in frontend service
- Check backend endpoint definition
- Ensure server is running

---

## 📚 **Documentation Files**

1. **APPLICATION_FLOW_DOCUMENTATION.md** - Complete flow analysis
2. **API_ENDPOINTS_MAPPING.md** - All API endpoints and schemas
3. **QUICK_REFERENCE_GUIDE.md** - This file (quick reference)

---

## 🎯 **Next Steps for Customization**

1. **Identify the component** you want to modify
2. **Check the event handlers** in that component
3. **Follow the data flow** from frontend to backend
4. **Modify the appropriate files** based on your needs
5. **Test the changes** by running the application

---

**Happy Coding! 🚀**

*This guide provides everything you need to understand and modify the Healthcare Chatbot application. Use it as your reference while making changes.*
