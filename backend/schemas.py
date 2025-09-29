from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime, time, date
import re

# Patient Schemas
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None  # Allow null for appointment booking
    phone: str  # Phone is mandatory
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None  # Allow null for appointment booking
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    current_medications: Optional[str] = None
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v:
            raise ValueError('Phone number is required')
        
        # Remove all non-digit characters for validation
        phone_digits = re.sub(r'\D', '', v)
        
        # Check if phone number has at least 10 digits
        if len(phone_digits) < 10:
            raise ValueError('Phone number must have at least 10 digits')
        
        # Check if phone number has reasonable length (not more than 15 digits)
        if len(phone_digits) > 15:
            raise ValueError('Phone number cannot have more than 15 digits')
        
        return v

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    current_medications: Optional[str] = None

class Patient(PatientBase):
    id: int
    full_name: str
    age: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Patient Search Schema
class PatientSearch(BaseModel):
    query: str  # Search by name, email, or phone

# Speciality Schemas
class SpecialityBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True

class SpecialityCreate(SpecialityBase):
    pass

class Speciality(SpecialityBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Doctor Schemas
class DoctorBase(BaseModel):
    name: str
    specialization: str
    speciality_id: Optional[int] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    contact: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool = True

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int
    created_at: datetime
    speciality: Optional[Speciality] = None
    
    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    date: datetime
    status: str = "scheduled"
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Document Schemas
class DocumentBase(BaseModel):
    title: str
    content: str
    document_type: str = "guideline"

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Questionnaire Schemas
class QuestionnaireBase(BaseModel):
    trigger_keywords: str
    question: str
    response_template: str
    category: str = "general"
    priority: int = 1
    is_active: bool = True

class QuestionnaireCreate(QuestionnaireBase):
    pass

class Questionnaire(QuestionnaireBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Chat Session Schemas
class ChatSessionBase(BaseModel):
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    session_data: Optional[str] = None
    current_questionnaire_id: Optional[int] = None
    status: str = "active"

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Chat Schemas
class ChatMessage(BaseModel):
    message: str
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    patient_context: Optional[dict] = None
    doctor_context: Optional[dict] = None
    retrieved_documents: Optional[List[str]] = None
    current_question: Optional[str] = None
    session_id: Optional[int] = None
    fallback_mode: bool = False
    ai_confidence: Optional[float] = None

# Appointment Booking Schemas
class AppointmentBookingRequest(BaseModel):
    patient_id: int
    doctor_id: int
    preferred_date: str  # YYYY-MM-DD format
    preferred_time: str  # HH:MM format
    reason: Optional[str] = None
    notes: Optional[str] = None

class AppointmentBookingResponse(BaseModel):
    appointment_id: int
    doctor_name: str
    speciality: str
    appointment_date: str
    appointment_time: str
    status: str
    confirmation_number: str

# Doctor Time Slots Schemas
class DoctorTimeSlotBase(BaseModel):
    doctor_id: int
    day_of_week: int  # 0=Monday, 1=Tuesday, ..., 6=Sunday
    start_time: time
    end_time: time
    slot_duration_minutes: int = 30
    is_available: bool = True

class DoctorTimeSlotCreate(DoctorTimeSlotBase):
    pass

class DoctorTimeSlot(DoctorTimeSlotBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Available Time Slots Response
class AvailableTimeSlot(BaseModel):
    time: str  # HH:MM format
    is_available: bool
    slot_id: Optional[int] = None

class DoctorAvailableSlots(BaseModel):
    doctor_id: int
    doctor_name: str
    date: str  # YYYY-MM-DD format
    day_of_week: int
    available_slots: List[AvailableTimeSlot]

# Health Package Schemas
class HealthPackageTestBase(BaseModel):
    test_name: str
    test_category: str
    test_description: Optional[str] = None
    is_optional: bool = False

class HealthPackageTestCreate(HealthPackageTestBase):
    pass

class HealthPackageTest(HealthPackageTestBase):
    id: int
    package_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class HealthPackageBase(BaseModel):
    name: str
    description: str
    price: int
    original_price: Optional[int] = None
    duration_hours: int = 2
    age_group: str
    gender_specific: Optional[str] = None
    fasting_required: bool = False
    home_collection_available: bool = True
    lab_visit_required: bool = True
    report_delivery_days: int = 1
    is_active: bool = True
    image_url: Optional[str] = None

class HealthPackageCreate(HealthPackageBase):
    pass

class HealthPackage(HealthPackageBase):
    id: int
    created_at: datetime
    updated_at: datetime
    tests: List[HealthPackageTest] = []
    
    class Config:
        from_attributes = True

class HealthPackageWithTests(HealthPackage):
    tests: List[HealthPackageTest] = []
    
    class Config:
        from_attributes = True

# Health Package Booking Schemas
class HealthPackageBookingRequest(BaseModel):
    package_id: int
    patient_name: str
    patient_email: Optional[str] = None
    patient_phone: str
    patient_age: int
    patient_gender: str
    preferred_date: str  # YYYY-MM-DD format
    preferred_time: str  # HH:MM format
    home_collection: bool = False
    address: Optional[str] = None
    notes: Optional[str] = None

class HealthPackageBookingResponse(BaseModel):
    booking_id: int
    package_name: str
    total_amount: int
    booking_date: str
    booking_time: str
    status: str
    confirmation_number: str

# Health Package Booking Schemas
class HealthPackageBookingBase(BaseModel):
    package_id: int
    patient_name: str
    patient_email: str
    patient_phone: str
    patient_age: int
    patient_gender: str
    preferred_date: str
    preferred_time: str
    notes: Optional[str] = None

class HealthPackageBookingCreate(HealthPackageBookingBase):
    pass

class HealthPackageBooking(HealthPackageBookingBase):
    id: int
    total_amount: int
    status: str
    confirmation_number: str
    payment_status: str
    created_at: datetime
    updated_at: datetime
    booking_date: datetime

    class Config:
        from_attributes = True

# Callback Request Schemas
class CallbackRequestBase(BaseModel):
    mobile_number: str
    preferred_time: Optional[str] = None
    notes: Optional[str] = None
    
    @validator('mobile_number')
    def validate_mobile_number(cls, v):
        if not v:
            raise ValueError('Mobile number is required')
        
        # Remove all non-digit characters for validation
        mobile_digits = re.sub(r'\D', '', v)
        
        # Check if mobile number has at least 10 digits
        if len(mobile_digits) < 10:
            raise ValueError('Mobile number must have at least 10 digits')
        
        # Check if mobile number has reasonable length (not more than 15 digits)
        if len(mobile_digits) > 15:
            raise ValueError('Mobile number cannot have more than 15 digits')
        
        return v

class CallbackRequestCreate(CallbackRequestBase):
    pass

class CallbackRequestUpdate(BaseModel):
    status: Optional[str] = None
    preferred_time: Optional[str] = None
    notes: Optional[str] = None
    executive_notes: Optional[str] = None

class CallbackRequest(CallbackRequestBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    contacted_at: Optional[datetime] = None
    executive_notes: Optional[str] = None
    
    class Config:
        from_attributes = True

class CallbackRequestResponse(BaseModel):
    id: int
    mobile_number: str
    status: str
    message: str
    created_at: datetime

# Chat Button Schemas
class ChatButtonCreate(BaseModel):
    button_text: str
    button_action: str
    button_value: Optional[str] = None
    button_icon: Optional[str] = None
    button_color: str = "primary"
    button_variant: str = "contained"
    display_order: int = 0
    is_active: bool = True
    category: Optional[str] = None
    description: Optional[str] = None

class ChatButtonUpdate(BaseModel):
    button_text: Optional[str] = None
    button_action: Optional[str] = None
    button_value: Optional[str] = None
    button_icon: Optional[str] = None
    button_color: Optional[str] = None
    button_variant: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None
    category: Optional[str] = None
    description: Optional[str] = None

class ChatButtonSchema(BaseModel):
    id: int
    button_text: str
    button_action: str
    button_value: Optional[str] = None
    button_icon: Optional[str] = None
    button_color: str
    button_variant: str
    display_order: int
    is_active: bool
    category: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
