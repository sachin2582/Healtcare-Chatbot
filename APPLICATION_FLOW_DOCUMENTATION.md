# 🏥 Healthcare Chatbot - Complete Application Flow Documentation

## 📋 Table of Contents
1. [Application Overview](#application-overview)
2. [Frontend Component Flow](#frontend-component-flow)
3. [User Interaction Events](#user-interaction-events)
4. [Backend API Flow](#backend-api-flow)
5. [Database Operations](#database-operations)
6. [Complete User Journey](#complete-user-journey)
7. [Code Modification Guide](#code-modification-guide)

---

## 🎯 Application Overview

The Healthcare Chatbot is a React + FastAPI application with the following main features:
- **Landing Page**: Marketing page with doctor showcase
- **Chat Interface**: AI-powered medical assistant
- **Appointment Booking**: Multi-step appointment flow
- **Health Package Booking**: Health checkup packages
- **Patient Dashboard**: Patient management
- **Document Management**: File handling

---

## 🖥️ Frontend Component Flow

### 1. **App.js** - Main Application Router
```javascript
// File: frontend/src/App.js
// Routes Configuration:
/ → LandingPage
/chat → ProfessionalChatInterface + Navigation + FloatingChatbot
/patients → PatientDashboard + Navigation + FloatingChatbot
/documents → DocumentManagement + Navigation + FloatingChatbot
```

**Key Events:**
- `Route Change` → Loads different components based on URL
- `ThemeProvider` → Applies Material-UI theme globally
- `AppProvider` → Provides global state management

---

### 2. **LandingPage.js** - Marketing & Entry Point
```javascript
// File: frontend/src/components/LandingPage.js
```

**User Interactions & Events:**

#### 🎯 **Header Navigation**
- **Click Event**: `"Start Chat"` button
- **Handler**: `onClick={() => { setShowChatbot(true); setClearChat(true); }}`
- **Result**: Opens chatbot modal with `ChatInterface` component

#### 🎯 **Hero Section**
- **Click Event**: `"Start Health Assessment"` button
- **Handler**: `onClick={() => { setShowChatbot(true); setClearChat(true); }}`
- **Result**: Opens chatbot modal

- **Click Event**: `"Learn More"` button
- **Handler**: Currently no action (placeholder)

#### 🎯 **Doctors Section**
- **Click Event**: `"Start Chat"` button on each doctor card
- **Handler**: `onClick={() => handleStartChat(doctor)}`
- **Function**: 
  ```javascript
  const handleStartChat = (doctor) => {
    setSelectedDoctor(doctor);
    setShowChatbot(true);
    setClearChat(true);
    setTimeout(() => setClearChat(false), 100);
  };
  ```
- **Result**: Opens chatbot with pre-selected doctor

#### 🎯 **Features Section**
- **Click Event**: `"Try Our AI Assistant"` button
- **Handler**: `onClick={() => setShowChatbot(true)}`
- **Result**: Opens chatbot modal

#### 🎯 **Chatbot Modal**
- **Click Event**: Close button (×)
- **Handler**: `onClick={handleCloseChat}`
- **Function**:
  ```javascript
  const handleCloseChat = () => {
    setShowChatbot(false);
    setSelectedDoctor(null);
  };
  ```

---

### 3. **FloatingChatbot.js** - Persistent Chat Widget
```javascript
// File: frontend/src/components/FloatingChatbot.js
```

**User Interactions & Events:**

#### 🎯 **Floating Chat Button**
- **Click Event**: Floating action button
- **Handler**: `onClick={toggleChat}`
- **Function**:
  ```javascript
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setClearChat(true);
      setTimeout(() => setClearChat(false), 100);
    }
  };
  ```
- **Result**: Opens/closes chat widget

#### 🎯 **Chat Widget Header**
- **Click Event**: Close button
- **Handler**: `onClick={handleClose}`
- **Result**: Closes chat widget

---

### 4. **ChatInterface.js** - Main Chat Component
```javascript
// File: frontend/src/components/ChatInterface.js
```

**User Interactions & Events:**

#### 🎯 **Patient/Doctor Selection**
- **Change Event**: Patient dropdown
- **Handler**: `onChange={(e) => setSelectedPatient(e.target.value)}`
- **API Call**: None (uses local state)

- **Change Event**: Doctor dropdown
- **Handler**: `onChange={(e) => setSelectedDoctor(e.target.value)}`
- **API Call**: None (uses local state)

#### 🎯 **Message Input**
- **Key Press Event**: Enter key
- **Handler**: `onKeyPress={handleKeyPress}`
- **Function**:
  ```javascript
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
  ```

- **Click Event**: Send button
- **Handler**: `onClick={sendMessage}`
- **Function**: `sendMessage()` - Main message processing function

#### 🎯 **Welcome Options Buttons**
- **Click Event**: Any welcome option button
- **Handler**: `onClick={() => setInputMessage(option.action)}`
- **Result**: Sets input message and triggers `sendMessage()`

#### 🎯 **Restart Conversation**
- **Click Event**: "Restart Conversation" button
- **Handler**: `onClick={restartConversation}`
- **Function**:
  ```javascript
  const restartConversation = () => {
    setMessages([]);
    setInputMessage('');
    setError(null);
    setLoading(false);
    setAppointmentDialogOpen(false);
    setHealthPackageDialogOpen(false);
    setCallbackFlow(false);
    setTimeout(() => {
      const welcomeResponse = createGreetingResponse();
      setMessages([welcomeResponse]);
    }, 300);
  };
  ```

---

### 5. **ProfessionalChatInterface.js** - Enhanced Chat
```javascript
// File: frontend/src/components/ProfessionalChatInterface.js
```

**User Interactions & Events:**

#### 🎯 **Dynamic Chat Buttons**
- **Load Event**: Component mount
- **Handler**: `useEffect(() => { fetchDynamicButtons(); }, []);`
- **API Call**: `chatButtonService.getActiveButtons()`
- **Result**: Loads buttons from database

#### 🎯 **Chat Button Clicks**
- **Click Event**: Any dynamic chat button
- **Handler**: `onClick={() => handleButtonClick(button)}`
- **Function**: Routes to different actions based on `button_action`

#### 🎯 **Minimize/Maximize**
- **Click Event**: Minimize button
- **Handler**: `onClick={() => setIsMinimized(!isMinimized)}`
- **Result**: Toggles chat window size

---

### 6. **AppointmentFlow.js** - Appointment Booking
```javascript
// File: frontend/src/components/AppointmentFlow.js
```

**User Interactions & Events:**

#### 🎯 **Step Navigation**
- **Click Event**: Speciality selection
- **Handler**: `onClick={() => handleSpecialitySelect(speciality)}`
- **Function**:
  ```javascript
  const handleSpecialitySelect = (speciality) => {
    setSelectedSpeciality(speciality);
    setCurrentStep(1);
  };
  ```

- **Click Event**: Doctor selection
- **Handler**: `onClick={() => handleDoctorSelect(doctor)}`
- **Function**:
  ```javascript
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };
  ```

#### 🎯 **Back Navigation**
- **Click Event**: Back button
- **Handler**: `onClick={() => setCurrentStep(prev => prev - 1)}`
- **Result**: Goes to previous step

---

## 🔄 Backend API Flow

### 1. **Main Server** - `main.py`
```python
# File: backend/main.py
# Server: FastAPI with uvicorn
# Port: 8000 (configurable via environment)
```

**Key Endpoints:**

#### 🎯 **Health Check**
- **Endpoint**: `GET /health`
- **Handler**: `health_check()`
- **Response**: `{"status": "healthy", "message": "..."}`

#### 🎯 **Chat Message**
- **Endpoint**: `POST /chat`
- **Handler**: `send_message(message: ChatMessage)`
- **Process**:
  1. Validates message
  2. Calls RAG service
  3. Returns AI response
- **Response**: `ChatResponse` with AI-generated content

#### 🎯 **Specialities**
- **Endpoint**: `GET /specialities`
- **Handler**: `get_specialities(db: Session)`
- **Process**: Queries `Speciality` table
- **Response**: List of medical specialities

#### 🎯 **Doctors**
- **Endpoint**: `GET /doctors`
- **Handler**: `get_doctors(db: Session)`
- **Process**: Queries `Doctor` table with speciality info
- **Response**: List of doctors with specializations

#### 🎯 **Health Packages**
- **Endpoint**: `GET /health-packages`
- **Handler**: `get_health_packages(db: Session)`
- **Process**: Queries `HealthPackage` and `HealthPackageTest` tables
- **Response**: List of health packages with included tests

#### 🎯 **Time Slots**
- **Endpoint**: `GET /doctors/{doctor_id}/time-slots`
- **Handler**: `get_doctor_time_slots(doctor_id: int, db: Session)`
- **Process**: Queries `DoctorTimeSlots` table
- **Response**: Available time slots for doctor

#### 🎯 **Available Slots**
- **Endpoint**: `GET /doctors/{doctor_id}/available-slots/{date}`
- **Handler**: `get_available_slots(doctor_id: int, date: str, db: Session)`
- **Process**: 
  1. Gets doctor's time slots for day of week
  2. Checks existing appointments
  3. Returns available time slots
- **Response**: Available appointment times

#### 🎯 **Appointment Booking**
- **Endpoint**: `POST /appointments`
- **Handler**: `book_appointment(booking: AppointmentBookingRequest, db: Session)`
- **Process**:
  1. Validates booking request
  2. Checks slot availability
  3. Creates appointment record
- **Response**: Booking confirmation

#### 🎯 **Health Package Booking**
- **Endpoint**: `POST /health-package-bookings`
- **Handler**: `book_health_package(booking: HealthPackageBookingRequest, db: Session)`
- **Process**:
  1. Validates package booking
  2. Creates booking record
- **Response**: Package booking confirmation

#### 🎯 **Callback Requests**
- **Endpoint**: `POST /callback-requests`
- **Handler**: `create_callback_request(request: CallbackRequestCreate, db: Session)`
- **Process**: Creates callback request record
- **Response**: Callback confirmation

#### 🎯 **Chat Buttons**
- **Endpoint**: `GET /chat-buttons`
- **Handler**: `get_chat_buttons(db: Session)`
- **Process**: Queries `ChatButton` table
- **Response**: All chat buttons

- **Endpoint**: `GET /chat-buttons/active`
- **Handler**: `get_active_chat_buttons(db: Session)`
- **Process**: Queries active chat buttons only
- **Response**: Active chat buttons

---

## 🗄️ Database Operations

### 1. **Database Schema** - `models.py`
```python
# File: backend/models.py
```

**Key Tables:**
- `Patient` - Patient information
- `Doctor` - Doctor profiles
- `Speciality` - Medical specialities
- `Appointment` - Appointment bookings
- `HealthPackage` - Health checkup packages
- `HealthPackageTest` - Tests included in packages
- `HealthPackageBooking` - Package bookings
- `DoctorTimeSlots` - Doctor availability
- `CallbackRequest` - Callback requests
- `ChatButton` - Dynamic chat buttons
- `ChatSession` - Chat sessions
- `Document` - Document storage
- `Questionnaire` - Health questionnaires

### 2. **Database Initialization** - `init_db.py`
```python
# File: backend/init_db.py
# Creates all tables
# Populates with sample data
```

---

## 🚀 Complete User Journey

### **Scenario 1: Landing Page → Chat → Appointment Booking**

1. **User visits landing page** (`/`)
   - **Component**: `LandingPage.js`
   - **Event**: Page load
   - **API Calls**: 
     - `GET /doctors` (via AppContext)
     - `GET /patients` (via AppContext)

2. **User clicks "Start Chat"**
   - **Component**: `LandingPage.js`
   - **Event**: Button click
   - **Handler**: `handleStartChat()`
   - **Result**: Opens `ChatInterface` modal

3. **User types message in chat**
   - **Component**: `ChatInterface.js`
   - **Event**: Text input + Enter/Send
   - **Handler**: `sendMessage()`
   - **API Call**: `POST /chat`
   - **Process**: RAG service processes message
   - **Result**: AI response displayed

4. **User clicks "Book Appointment"**
   - **Component**: `ChatInterface.js`
   - **Event**: Button click
   - **Handler**: `setAppointmentDialogOpen(true)`
   - **Result**: Opens `AppointmentFlow` dialog

5. **User selects speciality**
   - **Component**: `SpecialitySelection.js`
   - **Event**: Speciality click
   - **API Call**: `GET /specialities`
   - **Handler**: `handleSpecialitySelect()`
   - **Result**: Moves to doctor selection

6. **User selects doctor**
   - **Component**: `DoctorSelection.js`
   - **Event**: Doctor click
   - **API Call**: `GET /doctors`
   - **Handler**: `handleDoctorSelect()`
   - **Result**: Moves to appointment booking

7. **User selects date and time**
   - **Component**: `AppointmentBooking.js`
   - **Event**: Date/time selection
   - **API Call**: `GET /doctors/{id}/available-slots/{date}`
   - **Result**: Shows available time slots

8. **User confirms booking**
   - **Component**: `AppointmentBooking.js`
   - **Event**: Submit button click
   - **API Call**: `POST /appointments`
   - **Result**: Booking confirmation

### **Scenario 2: Floating Chatbot → Health Package Booking**

1. **User clicks floating chat button**
   - **Component**: `FloatingChatbot.js`
   - **Event**: Button click
   - **Handler**: `toggleChat()`
   - **Result**: Opens `ProfessionalChatInterface`

2. **User clicks "Health Checkup" button**
   - **Component**: `ProfessionalChatInterface.js`
   - **Event**: Button click
   - **Handler**: `handleButtonClick()`
   - **Result**: Opens `HealthPackageBooking` dialog

3. **User selects health package**
   - **Component**: `HealthPackageBooking.js`
   - **Event**: Package selection
   - **API Call**: `GET /health-packages`
   - **Result**: Shows package details

4. **User books package**
   - **Component**: `HealthPackageBooking.js`
   - **Event**: Book button click
   - **API Call**: `POST /health-package-bookings`
   - **Result**: Booking confirmation

---

## 🛠️ Code Modification Guide

### **Adding New Chat Buttons**

1. **Database**: Add button to `ChatButton` table
2. **Backend**: No changes needed (uses existing endpoints)
3. **Frontend**: Buttons auto-load from API

```javascript
// To add a new button, insert into database:
INSERT INTO chat_buttons (button_text, button_action, button_value, button_icon, button_color, button_variant, display_order, is_active, category, description) 
VALUES ('New Action', 'custom', 'new_action', 'icon_name', 'primary', 'contained', 7, true, 'info', 'Description');
```

### **Adding New API Endpoints**

1. **Backend**: Add endpoint in `main.py`
2. **Frontend**: Add service method in `services/api.js`
3. **Frontend**: Add component method to use the service

```python
# Backend example:
@app.get("/new-endpoint")
async def new_endpoint(db: Session = Depends(get_db)):
    return {"data": "response"}
```

```javascript
// Frontend service example:
export const getNewData = async () => {
  const response = await apiService.get('/new-endpoint');
  return response.data;
};
```

### **Modifying Chat Flow**

1. **Message Processing**: Edit `sendMessage()` in `ChatInterface.js`
2. **Response Handling**: Modify response processing logic
3. **UI Updates**: Update message display components

### **Adding New Appointment Steps**

1. **Create new component** for the step
2. **Add to AppointmentFlow.js** steps array
3. **Add navigation logic** between steps
4. **Update API calls** as needed

### **Styling Changes**

1. **Global styles**: Edit `App.js` theme configuration
2. **Component styles**: Edit individual component CSS files
3. **Material-UI overrides**: Modify theme in `App.js`

---

## 📊 Event Flow Summary

| **User Action** | **Component** | **Event Handler** | **API Call** | **Database Operation** | **UI Update** |
|-----------------|---------------|-------------------|--------------|----------------------|----------------|
| Click "Start Chat" | LandingPage | handleStartChat | None | None | Open ChatInterface |
| Type message | ChatInterface | sendMessage | POST /chat | None | Show AI response |
| Click "Book Appointment" | ChatInterface | setAppointmentDialogOpen | None | None | Open AppointmentFlow |
| Select speciality | AppointmentFlow | handleSpecialitySelect | GET /specialities | None | Move to doctor selection |
| Select doctor | AppointmentFlow | handleDoctorSelect | GET /doctors | None | Move to booking |
| Select time slot | AppointmentBooking | handleTimeSelect | GET /available-slots | None | Show confirmation |
| Confirm booking | AppointmentBooking | handleSubmit | POST /appointments | INSERT appointment | Show success message |
| Click floating chat | FloatingChatbot | toggleChat | None | None | Open chat widget |
| Click chat button | ProfessionalChatInterface | handleButtonClick | GET /chat-buttons | None | Execute button action |

---

This documentation provides a complete reverse-engineering guide for understanding and modifying the healthcare chatbot application. Each user interaction is mapped to its corresponding component, event handler, API call, and database operation.
