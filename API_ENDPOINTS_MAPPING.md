# 🔌 API Endpoints Mapping Documentation

## 📋 Table of Contents
1. [Backend API Endpoints](#backend-api-endpoints)
2. [Frontend Service Calls](#frontend-service-calls)
3. [Request/Response Schemas](#requestresponse-schemas)
4. [Error Handling](#error-handling)
5. [Authentication & CORS](#authentication--cors)

---

## 🚀 Backend API Endpoints

### **Base URL**: `http://localhost:8000`

### 1. **Health & System Endpoints**

#### `GET /health`
- **Purpose**: Health check endpoint
- **Response**: 
  ```json
  {
    "status": "healthy",
    "message": "Healthcare Chatbot API is running"
  }
  ```

#### `GET /test-time-slots/{doctor_id}/{date}`
- **Purpose**: Test time slots functionality
- **Parameters**: 
  - `doctor_id` (int): Doctor ID
  - `date` (string): Date in YYYY-MM-DD format
- **Response**: Available time slots for testing

---

### 2. **Chat & AI Endpoints**

#### `POST /chat`
- **Purpose**: Send message to AI chatbot
- **Request Body**:
  ```json
  {
    "message": "string",
    "patient_id": "integer (optional)",
    "doctor_id": "integer (optional)",
    "session_id": "string (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "response": "string",
    "fallback_mode": "boolean",
    "current_question": "string (optional)",
    "session_id": "string",
    "patient_context": "object (optional)",
    "doctor_context": "object (optional)",
    "retrieved_documents": "array (optional)"
  }
  ```

---

### 3. **Medical Data Endpoints**

#### `GET /specialities`
- **Purpose**: Get all medical specialities
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Cardiology",
      "description": "Heart and cardiovascular system"
    }
  ]
  ```

#### `GET /doctors`
- **Purpose**: Get all doctors with speciality information
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Dr. Sarah Johnson",
      "specialization": "Cardiology",
      "contact": "+1-555-0101",
      "qualification": "MD, Cardiology",
      "experience_years": 15,
      "is_available": true,
      "speciality_id": 1,
      "speciality": {
        "id": 1,
        "name": "Cardiology"
      }
    }
  ]
  ```

#### `GET /doctors/{doctor_id}`
- **Purpose**: Get specific doctor details
- **Parameters**: `doctor_id` (int)
- **Response**: Single doctor object

---

### 4. **Appointment Management Endpoints**

#### `GET /doctors/{doctor_id}/time-slots`
- **Purpose**: Get doctor's available time slots
- **Parameters**: `doctor_id` (int)
- **Response**:
  ```json
  [
    {
      "id": 1,
      "doctor_id": 1,
      "day_of_week": 0,
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "slot_duration_minutes": 30,
      "is_available": true
    }
  ]
  ```

#### `GET /doctors/{doctor_id}/available-slots/{date}`
- **Purpose**: Get available appointment slots for specific date
- **Parameters**: 
  - `doctor_id` (int)
  - `date` (string): Date in YYYY-MM-DD format
- **Response**:
  ```json
  {
    "doctor_id": 1,
    "date": "2025-10-01",
    "available_slots": [
      {
        "time": "09:00",
        "available": true
      },
      {
        "time": "09:30",
        "available": false
      }
    ]
  }
  ```

#### `POST /appointments`
- **Purpose**: Book a new appointment
- **Request Body**:
  ```json
  {
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_date": "2025-10-01",
    "appointment_time": "09:00",
    "reason": "Regular checkup",
    "notes": "Optional notes"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_date": "2025-10-01T09:00:00",
    "reason": "Regular checkup",
    "status": "scheduled",
    "confirmation_number": "APT-2025-001"
  }
  ```

#### `GET /appointments`
- **Purpose**: Get all appointments
- **Query Parameters**:
  - `patient_id` (optional): Filter by patient
  - `doctor_id` (optional): Filter by doctor
  - `status` (optional): Filter by status
- **Response**: Array of appointment objects

#### `GET /appointments/{appointment_id}`
- **Purpose**: Get specific appointment
- **Parameters**: `appointment_id` (int)
- **Response**: Single appointment object

#### `PUT /appointments/{appointment_id}`
- **Purpose**: Update appointment
- **Parameters**: `appointment_id` (int)
- **Request Body**: Appointment update data
- **Response**: Updated appointment object

#### `DELETE /appointments/{appointment_id}`
- **Purpose**: Cancel appointment
- **Parameters**: `appointment_id` (int)
- **Response**: Success message

---

### 5. **Health Package Endpoints**

#### `GET /health-packages`
- **Purpose**: Get all health packages
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Basic Health Checkup",
      "description": "Comprehensive basic health screening",
      "price": 1500.00,
      "duration_minutes": 120,
      "is_active": true,
      "tests": [
        {
          "id": 1,
          "name": "Blood Pressure",
          "description": "Blood pressure measurement"
        }
      ]
    }
  ]
  ```

#### `GET /health-packages/{package_id}`
- **Purpose**: Get specific health package
- **Parameters**: `package_id` (int)
- **Response**: Single health package with tests

#### `POST /health-package-bookings`
- **Purpose**: Book a health package
- **Request Body**:
  ```json
  {
    "patient_id": 1,
    "package_id": 1,
    "booking_date": "2025-10-01",
    "booking_time": "10:00",
    "notes": "Optional notes"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "patient_id": 1,
    "package_id": 1,
    "booking_date": "2025-10-01T10:00:00",
    "total_amount": 1500.00,
    "status": "confirmed",
    "confirmation_number": "HPB-2025-001"
  }
  ```

#### `GET /health-package-bookings`
- **Purpose**: Get all health package bookings
- **Query Parameters**:
  - `patient_id` (optional): Filter by patient
  - `status` (optional): Filter by status
- **Response**: Array of booking objects

---

### 6. **Patient Management Endpoints**

#### `GET /patients`
- **Purpose**: Get all patients
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "age": 35,
      "gender": "Male",
      "phone": "+1-555-0123",
      "email": "john@example.com",
      "address": "123 Main St",
      "medical_history": "None",
      "allergies": "None",
      "emergency_contact": "+1-555-0124"
    }
  ]
  ```

#### `GET /patients/{patient_id}`
- **Purpose**: Get specific patient
- **Parameters**: `patient_id` (int)
- **Response**: Single patient object

#### `POST /patients`
- **Purpose**: Create new patient
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "age": 28,
    "gender": "Female",
    "phone": "+1-555-0125",
    "email": "jane@example.com",
    "address": "456 Oak St",
    "medical_history": "None",
    "allergies": "None",
    "emergency_contact": "+1-555-0126"
  }
  ```
- **Response**: Created patient object

#### `PUT /patients/{patient_id}`
- **Purpose**: Update patient
- **Parameters**: `patient_id` (int)
- **Request Body**: Patient update data
- **Response**: Updated patient object

#### `DELETE /patients/{patient_id}`
- **Purpose**: Delete patient
- **Parameters**: `patient_id` (int)
- **Response**: Success message

---

### 7. **Callback Request Endpoints**

#### `POST /callback-requests`
- **Purpose**: Create callback request
- **Request Body**:
  ```json
  {
    "mobile_number": "+1-555-0123",
    "notes": "Request for appointment callback"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "mobile_number": "+1-555-0123",
    "notes": "Request for appointment callback",
    "status": "pending",
    "created_at": "2025-09-30T10:00:00Z",
    "message": "Callback request submitted successfully"
  }
  ```

#### `GET /callback-requests`
- **Purpose**: Get all callback requests
- **Response**: Array of callback request objects

---

### 8. **Chat Button Endpoints**

#### `GET /chat-buttons`
- **Purpose**: Get all chat buttons
- **Response**:
  ```json
  [
    {
      "id": 1,
      "button_text": "Book Appointment",
      "button_action": "appointment",
      "button_value": "book_appointment",
      "button_icon": "calendar_today",
      "button_color": "primary",
      "button_variant": "contained",
      "display_order": 1,
      "is_active": true,
      "category": "booking",
      "description": "Book a doctor appointment"
    }
  ]
  ```

#### `GET /chat-buttons/active`
- **Purpose**: Get only active chat buttons
- **Response**: Array of active chat button objects

#### `POST /chat-buttons`
- **Purpose**: Create new chat button
- **Request Body**: Chat button data
- **Response**: Created chat button object

#### `PUT /chat-buttons/{button_id}`
- **Purpose**: Update chat button
- **Parameters**: `button_id` (int)
- **Request Body**: Chat button update data
- **Response**: Updated chat button object

#### `DELETE /chat-buttons/{button_id}`
- **Purpose**: Delete chat button
- **Parameters**: `button_id` (int)
- **Response**: Success message

---

## 🎯 Frontend Service Calls

### 1. **API Service** - `services/api.js`

```javascript
// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Generic API methods
export const apiService = {
  // GET request
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },

  // POST request
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // PUT request
  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // DELETE request
  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Send chat message
  async sendMessage(message, patientId, doctorId) {
    return this.post('/chat', {
      message,
      patient_id: patientId,
      doctor_id: doctorId
    });
  }
};
```

### 2. **Chat Service** - `services/chatService.js`

```javascript
// Chat-specific service methods
class ChatService {
  async sendMessage(message, patientId = null, doctorId = null) {
    return await apiService.sendMessage(message, patientId, doctorId);
  }
}
```

### 3. **Appointment Service** - `services/appointmentService.js`

```javascript
// Appointment-related API calls
export const appointmentService = {
  // Get specialities
  async getSpecialities() {
    return await apiService.get('/specialities');
  },

  // Get doctors
  async getDoctors() {
    return await apiService.get('/doctors');
  },

  // Get doctor time slots
  async getDoctorTimeSlots(doctorId) {
    return await apiService.get(`/doctors/${doctorId}/time-slots`);
  },

  // Get available slots
  async getAvailableSlots(doctorId, date) {
    return await apiService.get(`/doctors/${doctorId}/available-slots/${date}`);
  },

  // Book appointment
  async bookAppointment(bookingData) {
    return await apiService.post('/appointments', bookingData);
  },

  // Get appointments
  async getAppointments(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiService.get(`/appointments?${queryParams}`);
  }
};
```

### 4. **Health Package Service** - `services/healthPackageService.js`

```javascript
// Health package-related API calls
export const healthPackageService = {
  // Get health packages
  async getHealthPackages() {
    return await apiService.get('/health-packages');
  },

  // Get specific package
  async getHealthPackage(packageId) {
    return await apiService.get(`/health-packages/${packageId}`);
  },

  // Book health package
  async bookHealthPackage(bookingData) {
    return await apiService.post('/health-package-bookings', bookingData);
  },

  // Get bookings
  async getBookings(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiService.get(`/health-package-bookings?${queryParams}`);
  }
};
```

### 5. **Patient Service** - `services/patientService.js`

```javascript
// Patient-related API calls
export const patientService = {
  // Get patients
  async getPatients() {
    return await apiService.get('/patients');
  },

  // Get specific patient
  async getPatient(patientId) {
    return await apiService.get(`/patients/${patientId}`);
  },

  // Create patient
  async createPatient(patientData) {
    return await apiService.post('/patients', patientData);
  },

  // Update patient
  async updatePatient(patientId, patientData) {
    return await apiService.put(`/patients/${patientId}`, patientData);
  },

  // Delete patient
  async deletePatient(patientId) {
    return await apiService.delete(`/patients/${patientId}`);
  }
};
```

### 6. **Callback Service** - `services/callbackService.js`

```javascript
// Callback request API calls
export const callbackService = {
  // Create callback request
  async createCallbackRequest(requestData) {
    return await apiService.post('/callback-requests', requestData);
  },

  // Get callback requests
  async getCallbackRequests() {
    return await apiService.get('/callback-requests');
  },

  // Validate mobile number
  validateMobileNumber(number) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return {
      isValid: phoneRegex.test(number),
      message: phoneRegex.test(number) ? 'Valid mobile number' : 'Invalid mobile number format'
    };
  }
};
```

### 7. **Chat Button Service** - `services/chatButtonService.js`

```javascript
// Chat button API calls
export const chatButtonService = {
  // Get all chat buttons
  async getChatButtons() {
    return await apiService.get('/chat-buttons');
  },

  // Get active chat buttons
  async getActiveButtons() {
    return await apiService.get('/chat-buttons/active');
  },

  // Create chat button
  async createButton(buttonData) {
    return await apiService.post('/chat-buttons', buttonData);
  },

  // Update chat button
  async updateButton(buttonId, buttonData) {
    return await apiService.put(`/chat-buttons/${buttonId}`, buttonData);
  },

  // Delete chat button
  async deleteButton(buttonId) {
    return await apiService.delete(`/chat-buttons/${buttonId}`);
  }
};
```

---

## 📝 Request/Response Schemas

### **Common Response Format**

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

### **Error Response Format**

```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

---

## ⚠️ Error Handling

### **HTTP Status Codes**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### **Common Error Scenarios**

1. **Validation Errors** (422)
   ```json
   {
     "detail": [
       {
         "loc": ["body", "email"],
         "msg": "field required",
         "type": "value_error.missing"
       }
     ]
   }
   ```

2. **Not Found Errors** (404)
   ```json
   {
     "detail": "Doctor not found"
   }
   ```

3. **Server Errors** (500)
   ```json
   {
     "detail": "Internal server error"
   }
   ```

---

## 🔐 Authentication & CORS

### **CORS Configuration**

```python
# Backend CORS settings (main.py)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Environment Variables**

```bash
# Backend (.env)
DATABASE_URL=sqlite:///./healthcare_chatbot.db
BACKEND_PORT=8000
FRONTEND_PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Frontend (.env)
REACT_APP_API_URL=http://localhost:8000
```

---

## 🚀 Usage Examples

### **Complete Appointment Booking Flow**

```javascript
// 1. Get specialities
const specialities = await appointmentService.getSpecialities();

// 2. Get doctors for selected speciality
const doctors = await appointmentService.getDoctors();

// 3. Get available slots for selected doctor and date
const availableSlots = await appointmentService.getAvailableSlots(1, '2025-10-01');

// 4. Book appointment
const booking = await appointmentService.bookAppointment({
  patient_id: 1,
  doctor_id: 1,
  appointment_date: '2025-10-01',
  appointment_time: '09:00',
  reason: 'Regular checkup'
});
```

### **Complete Health Package Booking Flow**

```javascript
// 1. Get health packages
const packages = await healthPackageService.getHealthPackages();

// 2. Book health package
const booking = await healthPackageService.bookHealthPackage({
  patient_id: 1,
  package_id: 1,
  booking_date: '2025-10-01',
  booking_time: '10:00'
});
```

### **Complete Chat Flow**

```javascript
// 1. Send message to AI
const response = await chatService.sendMessage(
  'I have a headache',
  1, // patient_id
  1  // doctor_id
);

// 2. Handle response
console.log(response.response); // AI response
console.log(response.fallback_mode); // Whether AI is in fallback mode
```

---

This API mapping documentation provides a complete reference for all backend endpoints and frontend service calls, making it easy to understand and modify the application's data flow.
