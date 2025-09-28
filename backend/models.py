from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, LargeBinary, Time, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, date

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=True)  # Allow null for appointment booking
    phone = Column(String(20), nullable=False)  # Phone is mandatory
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    date_of_birth = Column(Date)
    gender = Column(String(10), nullable=True)  # Allow null for appointment booking
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(20))
    medical_history = Column(Text)
    allergies = Column(Text)
    current_medications = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    appointments = relationship("Appointment", back_populates="patient")
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        if self.date_of_birth:
            today = datetime.now().date()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None

class Speciality(Base):
    __tablename__ = "specialities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    icon = Column(String(100))  # Icon name for UI
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    doctors = relationship("Doctor", back_populates="speciality")

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    specialization = Column(String(255), nullable=False)  # Keep for backward compatibility
    speciality_id = Column(Integer, ForeignKey("specialities.id"))
    qualification = Column(String(255))
    experience_years = Column(Integer)
    contact = Column(String(255))
    image_url = Column(String(500))  # URL to doctor's image
    image_data = Column(LargeBinary)  # Store image as binary data
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    speciality = relationship("Speciality", back_populates="doctors")
    appointments = relationship("Appointment", back_populates="doctor")
    time_slots = relationship("DoctorTimeSlots", back_populates="doctor")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    status = Column(String(50), default="scheduled")  # scheduled, completed, cancelled
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    document_type = Column(String(100), default="guideline")  # guideline, note, protocol
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Questionnaire(Base):
    __tablename__ = "questionnaires"
    
    id = Column(Integer, primary_key=True, index=True)
    trigger_keywords = Column(Text, nullable=False)  # Keywords that trigger this questionnaire
    question = Column(Text, nullable=False)  # The question to ask
    response_template = Column(Text, nullable=False)  # Template response based on user input
    category = Column(String(100), default="general")  # general, emergency, appointment, symptoms
    priority = Column(Integer, default=1)  # 1=highest, 5=lowest
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    session_data = Column(Text)  # JSON string to store conversation context
    current_questionnaire_id = Column(Integer, ForeignKey("questionnaires.id"))
    status = Column(String(50), default="active")  # active, completed, abandoned
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DoctorTimeSlots(Base):
    __tablename__ = "doctor_time_slots"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 1=Tuesday, ..., 6=Sunday
    start_time = Column(Time, nullable=False)  # e.g., 09:00:00
    end_time = Column(Time, nullable=False)    # e.g., 17:00:00
    slot_duration_minutes = Column(Integer, default=30)  # Duration of each slot
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="time_slots")

class HealthPackage(Base):
    __tablename__ = "health_packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)  # Price in currency units
    original_price = Column(Integer, nullable=True)  # Original price before discount
    duration_hours = Column(Integer, default=2)  # Duration of the health checkup in hours
    age_group = Column(String(100), nullable=False)  # e.g., "18-40", "40+", "All Ages"
    gender_specific = Column(String(20), nullable=True)  # "Male", "Female", or null for both
    fasting_required = Column(Boolean, default=False)
    home_collection_available = Column(Boolean, default=True)
    lab_visit_required = Column(Boolean, default=True)
    report_delivery_days = Column(Integer, default=1)  # Days to deliver report
    is_active = Column(Boolean, default=True)
    image_url = Column(String(500))  # URL to package image
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tests = relationship("HealthPackageTest", back_populates="package")

class HealthPackageTest(Base):
    __tablename__ = "health_package_tests"
    
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey("health_packages.id"), nullable=False)
    test_name = Column(String(255), nullable=False)
    test_category = Column(String(100), nullable=False)  # e.g., "Blood Test", "Imaging", "Cardiac"
    test_description = Column(Text, nullable=True)
    is_optional = Column(Boolean, default=False)  # Whether this test is optional in the package
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    package = relationship("HealthPackage", back_populates="tests")

class HealthPackageBooking(Base):
    __tablename__ = "health_package_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey("health_packages.id"), nullable=False)
    patient_name = Column(String(255), nullable=False)
    patient_email = Column(String(255), nullable=False)
    patient_phone = Column(String(20), nullable=False)
    patient_age = Column(Integer, nullable=False)
    patient_gender = Column(String(10), nullable=False)
    preferred_date = Column(Date, nullable=False)
    preferred_time = Column(String(10), nullable=False)  # e.g., "09:00"
    total_amount = Column(Integer, nullable=False)
    status = Column(String(20), default="confirmed")  # confirmed, completed, cancelled, rescheduled
    confirmation_number = Column(String(20), unique=True, nullable=False)
    payment_status = Column(String(20), default="pending")  # pending, paid, failed, refunded
    notes = Column(Text, nullable=True)  # Additional notes from user
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    booking_date = Column(DateTime, nullable=False)  # Actual booking datetime
    
    # Relationships
    package = relationship("HealthPackage")

class CallbackRequest(Base):
    __tablename__ = "callback_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    mobile_number = Column(String(20), nullable=False)
    status = Column(String(20), default="pending")  # pending, contacted, completed, cancelled
    preferred_time = Column(String(50), nullable=True)  # e.g., "Morning", "Afternoon", "Evening"
    notes = Column(Text, nullable=True)  # Additional notes from user
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    contacted_at = Column(DateTime, nullable=True)  # When the callback was made
    executive_notes = Column(Text, nullable=True)  # Notes from the executive who made the call
