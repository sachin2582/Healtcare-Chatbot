from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from database import get_db, init_db
from models import Patient, Doctor, Appointment, Document, Questionnaire, ChatSession, Speciality, DoctorTimeSlots, HealthPackage, HealthPackageTest, HealthPackageBooking, CallbackRequest, ChatButton
from schemas import (
    Patient as PatientSchema, PatientCreate, PatientUpdate,
    Doctor as DoctorSchema, DoctorCreate,
    Appointment as AppointmentSchema, AppointmentCreate,
    Document as DocumentSchema, DocumentCreate,
    Questionnaire as QuestionnaireSchema, QuestionnaireCreate,
    ChatSession as ChatSessionSchema, ChatSessionCreate,
    Speciality as SpecialitySchema, SpecialityCreate,
    ChatMessage, ChatResponse,
    AppointmentBookingRequest, AppointmentBookingResponse,
    DoctorTimeSlot as DoctorTimeSlotSchema, DoctorTimeSlotCreate,
    DoctorAvailableSlots, AvailableTimeSlot,
    HealthPackage as HealthPackageSchema, HealthPackageCreate,
    HealthPackageTest as HealthPackageTestSchema, HealthPackageTestCreate,
    HealthPackageWithTests, HealthPackageBookingRequest, HealthPackageBookingResponse,
    HealthPackageBooking as HealthPackageBookingSchema, HealthPackageBookingCreate,
    CallbackRequest as CallbackRequestSchema, CallbackRequestCreate, CallbackRequestResponse,
    ChatButtonSchema, ChatButtonCreate, ChatButtonUpdate
)
from rag_service_enhanced import EnhancedRAGService
from config import CORS_ORIGINS
from text_config import SystemMessages, ErrorMessages
from timezone_utils import get_local_now

# Initialize FastAPI app
app = FastAPI(
    title="Healthcare Chatbot API",
    description="A comprehensive healthcare chatbot with RAG capabilities",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Enhanced RAG service
rag_service = EnhancedRAGService()

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": SystemMessages.HEALTH_CHECK_MESSAGE}

# Test endpoint for time slots
@app.get("/test-time-slots/{doctor_id}/{date}")
async def test_time_slots(doctor_id: int, date: str, db: Session = Depends(get_db)):
    """Test endpoint for time slots functionality"""
    try:
        from datetime import datetime, timedelta
        
        # Parse date
        appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
        day_of_week = appointment_date.weekday()
        
        # Get doctor
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if not doctor:
            return {"error": "Doctor not found"}
        
        # Get time slots for this day of week
        time_slots = db.query(DoctorTimeSlots).filter(
            DoctorTimeSlots.doctor_id == doctor_id,
            DoctorTimeSlots.day_of_week == day_of_week,
            DoctorTimeSlots.is_available == True
        ).all()
        
        # Generate available time slots
        available_slots = []
        for time_slot in time_slots:
            current_time = time_slot.start_time
            end_time = time_slot.end_time
            
            while current_time < end_time:
                slot_time_str = current_time.strftime("%H:%M")
                
                # Check for existing appointments at this specific time
                # Create datetime for comparison
                slot_datetime = datetime.combine(appointment_date, current_time)
                
                existing_appointments = db.query(Appointment).filter(
                    Appointment.doctor_id == doctor_id,
                    Appointment.date == slot_datetime,
                    Appointment.status.in_(["scheduled", "confirmed"])
                ).all()
                
                # Check if this specific time slot is booked
                is_available = len(existing_appointments) == 0
                
                available_slots.append({
                    "time": slot_time_str,
                    "is_available": is_available,
                    "slot_id": time_slot.id
                })
                
                # Move to next slot
                current_time = (datetime.combine(appointment_date, current_time) + 
                              timedelta(minutes=time_slot.slot_duration_minutes)).time()
        
        return {
            "doctor_id": doctor_id,
            "doctor_name": doctor.name,
            "date": date,
            "day_of_week": day_of_week,
            "available_slots": available_slots
        }
        
    except Exception as e:
        return {"error": str(e)}

# Chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage, db: Session = Depends(get_db)):
    """
    Main chat endpoint that processes user messages with enhanced RAG and fallback system
    """
    try:
        result = rag_service.process_query_with_fallback(
            query=message.message,
            db=db,
            patient_id=message.patient_id,
            doctor_id=message.doctor_id
        )
        
        return ChatResponse(
            response=result["response"],
            patient_context=result.get("patient_context"),
            doctor_context=result.get("doctor_context"),
            retrieved_documents=result.get("retrieved_documents", []),
            current_question=result.get("current_question"),
            session_id=result.get("session_id"),
            fallback_mode=result.get("fallback_mode", False),
            ai_confidence=result.get("ai_confidence")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{SystemMessages.ERROR_PROCESSING_CHAT}: {str(e)}"
        )

# Patient endpoints
@app.get("/patient/{patient_id}", response_model=PatientSchema)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Get patient details by ID"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=SystemMessages.PATIENT_NOT_FOUND
        )
    return patient

@app.get("/patients", response_model=List[PatientSchema])
async def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all patients with pagination"""
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@app.post("/patient", response_model=PatientSchema)
async def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient"""
    try:
        # Create new patient (allow null values for appointment booking)
        db_patient = Patient(**patient.dict())
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        
        # Convert to Pydantic schema for response
        return PatientSchema.from_orm(db_patient)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating patient: {str(e)}")

# Doctor endpoints
@app.get("/doctors", response_model=List[DoctorSchema])
async def get_doctors(skip: int = 0, limit: int = 100, include_select: bool = False, db: Session = Depends(get_db)):
    """Get all doctors"""
    doctors = db.query(Doctor).offset(skip).limit(limit).all()
    if include_select:
        return [
            DoctorSchema(
                id=doc.id,
                name=doc.name,
                specialization=doc.specialization,
                contact=doc.contact,
                created_at=doc.created_at
            )
            for doc in doctors
        ]
    return doctors

@app.post("/doctor", response_model=DoctorSchema)
async def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    """Create a new doctor"""
    db_doctor = Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

# Appointment endpoints
@app.get("/appointments", response_model=List[AppointmentSchema])
async def get_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all appointments"""
    appointments = db.query(Appointment).offset(skip).limit(limit).all()
    return appointments

@app.post("/appointment", response_model=AppointmentSchema)
async def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    """Create a new appointment"""
    db_appointment = Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

# Document management endpoints
@app.post("/add-doc", response_model=DocumentSchema)
async def add_document(document: DocumentCreate, db: Session = Depends(get_db)):
    """
    Add hospital guidelines or notes into knowledge base
    This endpoint adds documents both to the database and vector store
    """
    try:
        # Add to database
        db_document = Document(**document.dict())
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        # Add to vector store
        success = rag_service.add_document(
            title=document.title,
            content=document.content,
            doc_type=document.document_type
        )
        
        if not success:
            # If vector store addition fails, we should log it but not fail the request
            print(ErrorMessages.VECTOR_STORE_WARNING.format(title=document.title))
        
        return db_document
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{SystemMessages.ERROR_ADDING_DOCUMENT}: {str(e)}"
        )

@app.get("/documents", response_model=List[DocumentSchema])
async def get_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all documents"""
    documents = db.query(Document).offset(skip).limit(limit).all()
    return documents

@app.get("/documents/{document_id}", response_model=DocumentSchema)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get document by ID"""
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=SystemMessages.DOCUMENT_NOT_FOUND
        )
    return document

# Questionnaire endpoints
@app.get("/questionnaires", response_model=List[QuestionnaireSchema])
async def get_questionnaires(
    skip: int = 0, 
    limit: int = 100, 
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all questionnaires with optional filtering"""
    query = db.query(Questionnaire).filter(Questionnaire.is_active == True)
    
    if category:
        query = query.filter(Questionnaire.category == category)
    
    questionnaires = query.order_by(Questionnaire.priority.asc()).offset(skip).limit(limit).all()
    return questionnaires

@app.get("/questionnaires/{questionnaire_id}", response_model=QuestionnaireSchema)
async def get_questionnaire(questionnaire_id: int, db: Session = Depends(get_db)):
    """Get questionnaire by ID"""
    questionnaire = db.query(Questionnaire).filter(Questionnaire.id == questionnaire_id).first()
    if not questionnaire:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=SystemMessages.QUESTIONNAIRE_NOT_FOUND
        )
    return questionnaire

@app.post("/questionnaires", response_model=QuestionnaireSchema)
async def create_questionnaire(questionnaire: QuestionnaireCreate, db: Session = Depends(get_db)):
    """Create a new questionnaire"""
    db_questionnaire = Questionnaire(**questionnaire.dict())
    db.add(db_questionnaire)
    db.commit()
    db.refresh(db_questionnaire)
    return db_questionnaire

@app.get("/questionnaires/categories", response_model=List[str])
async def get_questionnaire_categories(db: Session = Depends(get_db)):
    """Get all unique questionnaire categories"""
    categories = db.query(Questionnaire.category).distinct().all()
    return [cat[0] for cat in categories]

@app.post("/populate-questionnaires")
async def populate_questionnaires(db: Session = Depends(get_db)):
    """Populate the database with sample questionnaires"""
    try:
        from populate_questionnaires import populate_questionnaires
        populate_questionnaires()
        return {"message": SystemMessages.QUESTIONNAIRES_POPULATED}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{SystemMessages.ERROR_POPULATING_QUESTIONNAIRES}: {str(e)}"
        )

# Speciality endpoints
@app.get("/specialities", response_model=List[SpecialitySchema])
async def get_specialities(db: Session = Depends(get_db)):
    """Get all active specialities"""
    specialities = db.query(Speciality).filter(Speciality.is_active == True).all()
    return specialities

@app.get("/specialities/{speciality_id}", response_model=SpecialitySchema)
async def get_speciality(speciality_id: int, db: Session = Depends(get_db)):
    """Get a specific speciality by ID"""
    speciality = db.query(Speciality).filter(Speciality.id == speciality_id).first()
    if not speciality:
        raise HTTPException(status_code=404, detail="Speciality not found")
    return speciality

# Doctor endpoints by speciality
@app.get("/doctors/speciality/{speciality_id}", response_model=List[DoctorSchema])
async def get_doctors_by_speciality(speciality_id: int, db: Session = Depends(get_db)):
    """Get all doctors for a specific speciality"""
    doctors = db.query(Doctor).filter(
        Doctor.speciality_id == speciality_id,
        Doctor.is_available == True
    ).all()
    return doctors

@app.get("/doctors/{doctor_id}", response_model=DoctorSchema)
async def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Get a specific doctor by ID"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

# Appointment booking endpoints
@app.post("/appointments/book", response_model=AppointmentBookingResponse)
async def book_appointment(booking_request: AppointmentBookingRequest, db: Session = Depends(get_db)):
    """Book an appointment with a doctor"""
    try:
        from datetime import datetime
        import random
        import string
        
        # Get doctor details
        doctor = db.query(Doctor).filter(Doctor.id == booking_request.doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        # Get speciality name
        speciality_name = doctor.specialization
        if doctor.speciality:
            speciality_name = doctor.speciality.name
        
        # Parse date and time
        appointment_datetime = datetime.strptime(
            f"{booking_request.preferred_date} {booking_request.preferred_time}",
            "%Y-%m-%d %H:%M"
        )
        
        # Create appointment
        appointment = Appointment(
            patient_id=booking_request.patient_id,
            doctor_id=booking_request.doctor_id,
            date=appointment_datetime,
            status="scheduled",
            notes=booking_request.notes
        )
        
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        
        # Generate confirmation number
        confirmation_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        return AppointmentBookingResponse(
            appointment_id=appointment.id,
            doctor_name=doctor.name,
            speciality=speciality_name,
            appointment_date=booking_request.preferred_date,
            appointment_time=booking_request.preferred_time,
            status="scheduled",
            confirmation_number=confirmation_number
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid date or time format")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error booking appointment: {str(e)}")

# Doctor Time Slots endpoints
@app.get("/doctors/{doctor_id}/time-slots", response_model=List[DoctorTimeSlotSchema])
async def get_doctor_time_slots(doctor_id: int, db: Session = Depends(get_db)):
    """Get all time slots for a specific doctor"""
    time_slots = db.query(DoctorTimeSlots).filter(
        DoctorTimeSlots.doctor_id == doctor_id,
        DoctorTimeSlots.is_available == True
    ).all()
    return time_slots

@app.post("/doctors/{doctor_id}/time-slots", response_model=DoctorTimeSlotSchema)
async def create_doctor_time_slot(
    doctor_id: int, 
    time_slot: DoctorTimeSlotCreate, 
    db: Session = Depends(get_db)
):
    """Create a new time slot for a doctor"""
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Create time slot
    db_time_slot = DoctorTimeSlots(**time_slot.dict())
    db.add(db_time_slot)
    db.commit()
    db.refresh(db_time_slot)
    return db_time_slot

@app.get("/doctors/{doctor_id}/available-slots/{date}", response_model=DoctorAvailableSlots)
async def get_available_slots(doctor_id: int, date: str, db: Session = Depends(get_db)):
    """Get available time slots for a doctor on a specific date"""
    from datetime import datetime, timedelta
    
    try:
        # Parse date
        appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
        day_of_week = appointment_date.weekday()  # 0=Monday, 6=Sunday
        
        # Get doctor
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        # Get time slots for this day of week
        time_slots = db.query(DoctorTimeSlots).filter(
            DoctorTimeSlots.doctor_id == doctor_id,
            DoctorTimeSlots.day_of_week == day_of_week,
            DoctorTimeSlots.is_available == True
        ).all()
        
        if not time_slots:
            return DoctorAvailableSlots(
                doctor_id=doctor_id,
                doctor_name=doctor.name,
                date=date,
                day_of_week=day_of_week,
                available_slots=[]
            )
        
        # Generate available time slots
        available_slots = []
        
        for time_slot in time_slots:
            # Generate slots within the time range
            current_time = time_slot.start_time
            end_time = time_slot.end_time
            
            while current_time < end_time:
                # Check if this slot is already booked
                slot_time_str = current_time.strftime("%H:%M")
                
                # Check for existing appointments at this specific time
                # Create datetime for comparison
                slot_datetime = datetime.combine(appointment_date, current_time)
                
                existing_appointments = db.query(Appointment).filter(
                    Appointment.doctor_id == doctor_id,
                    Appointment.date == slot_datetime,
                    Appointment.status.in_(["scheduled", "confirmed"])
                ).all()
                
                # Check if this specific time slot is booked
                is_available = len(existing_appointments) == 0
                
                available_slots.append(AvailableTimeSlot(
                    time=slot_time_str,
                    is_available=is_available,
                    slot_id=time_slot.id
                ))
                
                # Move to next slot
                current_time = (datetime.combine(appointment_date, current_time) + 
                              timedelta(minutes=time_slot.slot_duration_minutes)).time()
        
        return DoctorAvailableSlots(
            doctor_id=doctor_id,
            doctor_name=doctor.name,
            date=date,
            day_of_week=day_of_week,
            available_slots=available_slots
        )
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting available slots: {str(e)}")

# Patient Management Endpoints
@app.post("/patients", response_model=PatientSchema)
async def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient"""
    import time
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            # Create new patient (allow duplicate emails for appointment booking)
            db_patient = Patient(**patient.dict())
            db.add(db_patient)
            db.commit()
            db.refresh(db_patient)
            
            # Convert to Pydantic schema for response
            return PatientSchema.from_orm(db_patient)
        except Exception as e:
            db.rollback()
            error_msg = str(e)
            
            # Handle database lock with retry
            if "database is locked" in error_msg and attempt < max_retries - 1:
                time.sleep(0.1 * (2 ** attempt))  # Exponential backoff
                continue
            else:
                raise HTTPException(status_code=500, detail=f"Error creating patient: {error_msg}")

@app.get("/patients", response_model=List[PatientSchema])
async def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all patients with pagination"""
    try:
        patients = db.query(Patient).offset(skip).limit(limit).all()
        return [PatientSchema.from_orm(patient) for patient in patients]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching patients: {str(e)}")

@app.get("/patients/{patient_id}", response_model=PatientSchema)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Get a specific patient by ID"""
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return PatientSchema.from_orm(patient)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching patient: {str(e)}")

@app.put("/patients/{patient_id}", response_model=PatientSchema)
async def update_patient(patient_id: int, patient_update: PatientUpdate, db: Session = Depends(get_db)):
    """Update a patient's information"""
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Update only provided fields
        update_data = patient_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(patient, field, value)
        
        db.commit()
        db.refresh(patient)
        return PatientSchema.from_orm(patient)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating patient: {str(e)}")

@app.get("/patients/search/{query}", response_model=List[PatientSchema])
async def search_patients(query: str, db: Session = Depends(get_db)):
    """Search patients by name, email, or phone"""
    try:
        patients = db.query(Patient).filter(
            (Patient.first_name.ilike(f"%{query}%")) |
            (Patient.last_name.ilike(f"%{query}%")) |
            (Patient.email.ilike(f"%{query}%")) |
            (Patient.phone.ilike(f"%{query}%"))
        ).all()
        return [PatientSchema.from_orm(patient) for patient in patients]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching patients: {str(e)}")

@app.get("/patients/{patient_id}/appointments", response_model=List[AppointmentSchema])
async def get_patient_appointments(patient_id: int, db: Session = Depends(get_db)):
    """Get all appointments for a specific patient"""
    try:
        appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).all()
        return [AppointmentSchema.from_orm(appointment) for appointment in appointments]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching patient appointments: {str(e)}")

# Health Package Endpoints
@app.get("/health-packages", response_model=List[HealthPackageSchema])
async def get_health_packages(
    age_group: Optional[str] = None,
    gender: Optional[str] = None,
    max_price: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all active health packages with optional filters"""
    try:
        query = db.query(HealthPackage).filter(HealthPackage.is_active == True)
        
        if age_group:
            query = query.filter(HealthPackage.age_group == age_group)
        
        if gender:
            query = query.filter(
                (HealthPackage.gender_specific == gender) | 
                (HealthPackage.gender_specific.is_(None))
            )
        
        if max_price:
            query = query.filter(HealthPackage.price <= max_price)
        
        packages = query.order_by(HealthPackage.price).all()
        return packages
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching health packages: {str(e)}")

# Health Package Booking Endpoints (must come before /health-packages/{package_id})
@app.get("/health-packages/bookings", response_model=List[HealthPackageBookingSchema])
async def get_health_package_bookings(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all health package bookings with optional filters"""
    try:
        query = db.query(HealthPackageBooking)
        
        if status:
            query = query.filter(HealthPackageBooking.status == status)
        
        bookings = query.offset(skip).limit(limit).all()
        return bookings
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching health package bookings: {str(e)}")

@app.get("/health-packages/bookings/{booking_id}", response_model=HealthPackageBookingSchema)
async def get_health_package_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get a specific health package booking by ID"""
    try:
        booking = db.query(HealthPackageBooking).filter(HealthPackageBooking.id == booking_id).first()
        
        if not booking:
            raise HTTPException(status_code=404, detail="Health package booking not found")
        
        return booking
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching health package booking: {str(e)}")

@app.put("/health-packages/bookings/{booking_id}", response_model=HealthPackageBookingSchema)
async def update_health_package_booking(
    booking_id: int,
    booking_update: HealthPackageBookingCreate,
    db: Session = Depends(get_db)
):
    """Update a health package booking"""
    try:
        booking = db.query(HealthPackageBooking).filter(HealthPackageBooking.id == booking_id).first()
        
        if not booking:
            raise HTTPException(status_code=404, detail="Health package booking not found")
        
        # Update booking fields
        for field, value in booking_update.dict().items():
            if hasattr(booking, field):
                setattr(booking, field, value)
        
        from timezone_utils import get_local_now
        booking.updated_at = get_local_now()
        
        db.commit()
        db.refresh(booking)
        
        return booking
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating health package booking: {str(e)}")

@app.get("/health-packages/{package_id}", response_model=HealthPackageWithTests)
async def get_health_package(package_id: int, db: Session = Depends(get_db)):
    """Get a specific health package with all its tests"""
    try:
        package = db.query(HealthPackage).filter(
            HealthPackage.id == package_id,
            HealthPackage.is_active == True
        ).first()
        
        if not package:
            raise HTTPException(status_code=404, detail="Health package not found")
        
        # Get all tests for this package
        tests = db.query(HealthPackageTest).filter(
            HealthPackageTest.package_id == package_id
        ).all()
        
        # Convert to response format
        package_dict = {
            "id": package.id,
            "name": package.name,
            "description": package.description,
            "price": package.price,
            "original_price": package.original_price,
            "duration_hours": package.duration_hours,
            "age_group": package.age_group,
            "gender_specific": package.gender_specific,
            "fasting_required": package.fasting_required,
            "home_collection_available": package.home_collection_available,
            "lab_visit_required": package.lab_visit_required,
            "report_delivery_days": package.report_delivery_days,
            "is_active": package.is_active,
            "image_url": package.image_url,
            "created_at": package.created_at,
            "updated_at": package.updated_at,
            "tests": tests
        }
        
        return package_dict
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching health package: {str(e)}")

@app.post("/health-packages/book", response_model=HealthPackageBookingResponse)
async def book_health_package(booking_request: HealthPackageBookingRequest, db: Session = Depends(get_db)):
    """Book a health package"""
    try:
        from datetime import datetime, date
        import random
        import string
        
        # Get health package details
        package = db.query(HealthPackage).filter(
            HealthPackage.id == booking_request.package_id,
            HealthPackage.is_active == True
        ).first()
        
        if not package:
            raise HTTPException(status_code=404, detail="Health package not found")
        
        # Parse date and time
        booking_datetime = datetime.strptime(
            f"{booking_request.preferred_date} {booking_request.preferred_time}",
            "%Y-%m-%d %H:%M"
        )
        
        # Generate unique confirmation number
        confirmation_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        # Ensure confirmation number is unique
        while db.query(HealthPackageBooking).filter(HealthPackageBooking.confirmation_number == confirmation_number).first():
            confirmation_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        # Create booking record in database
        booking = HealthPackageBooking(
            package_id=booking_request.package_id,
            patient_name=booking_request.patient_name,
            patient_email=booking_request.patient_email,
            patient_phone=booking_request.patient_phone,
            patient_age=booking_request.patient_age,
            patient_gender=booking_request.patient_gender,
            preferred_date=date.fromisoformat(booking_request.preferred_date),
            preferred_time=booking_request.preferred_time,
            total_amount=package.price,
            status="confirmed",
            confirmation_number=confirmation_number,
            payment_status="pending",
            booking_date=booking_datetime,
            notes=booking_request.notes
        )
        
        db.add(booking)
        db.commit()
        db.refresh(booking)
        
        return HealthPackageBookingResponse(
            booking_id=booking.id,
            package_name=package.name,
            total_amount=package.price,
            booking_date=booking_request.preferred_date,
            booking_time=booking_request.preferred_time,
            status="confirmed",
            confirmation_number=confirmation_number
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error booking health package: {str(e)}")

# Callback Request Endpoints
@app.post("/callback-requests", response_model=CallbackRequestResponse)
async def create_callback_request(callback_request: CallbackRequestCreate, db: Session = Depends(get_db)):
    """Create a new callback request"""
    try:
        # Create new callback request
        db_callback = CallbackRequest(
            mobile_number=callback_request.mobile_number,
            preferred_time=callback_request.preferred_time,
            notes=callback_request.notes,
            status="pending"
        )
        
        db.add(db_callback)
        db.commit()
        db.refresh(db_callback)
        
        return CallbackRequestResponse(
            id=db_callback.id,
            mobile_number=db_callback.mobile_number,
            status=db_callback.status,
            message="Thank you for your callback request! Our healthcare executive will contact you shortly.",
            created_at=db_callback.created_at
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating callback request: {str(e)}")

@app.get("/callback-requests", response_model=List[CallbackRequestSchema])
async def get_callback_requests(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all callback requests with optional status filter"""
    try:
        query = db.query(CallbackRequest)
        
        if status:
            query = query.filter(CallbackRequest.status == status)
        
        callback_requests = query.order_by(CallbackRequest.created_at.desc()).all()
        return callback_requests
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching callback requests: {str(e)}")

@app.put("/callback-requests/{callback_id}", response_model=CallbackRequestSchema)
async def update_callback_request(
    callback_id: int,
    callback_update: dict,
    db: Session = Depends(get_db)
):
    """Update a callback request status"""
    try:
        callback_request = db.query(CallbackRequest).filter(CallbackRequest.id == callback_id).first()
        
        if not callback_request:
            raise HTTPException(status_code=404, detail="Callback request not found")
        
        # Update fields if provided
        for field, value in callback_update.items():
            if hasattr(callback_request, field):
                setattr(callback_request, field, value)
        
        db.commit()
        db.refresh(callback_request)
        
        return callback_request
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating callback request: {str(e)}")

# Chat Button Endpoints
@app.get("/chat-buttons", response_model=List[ChatButtonSchema])
async def get_chat_buttons(
    is_active: Optional[bool] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all chat buttons, optionally filtered by active status and category"""
    try:
        query = db.query(ChatButton)
        
        if is_active is not None:
            query = query.filter(ChatButton.is_active == is_active)
        
        if category:
            query = query.filter(ChatButton.category == category)
        
        buttons = query.order_by(ChatButton.display_order, ChatButton.created_at).all()
        return buttons
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat buttons: {str(e)}")

@app.get("/chat-buttons/active", response_model=List[ChatButtonSchema])
async def get_active_chat_buttons(db: Session = Depends(get_db)):
    """Get all active chat buttons ordered by display_order"""
    try:
        buttons = db.query(ChatButton).filter(
            ChatButton.is_active == True
        ).order_by(ChatButton.display_order, ChatButton.created_at).all()
        return buttons
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching active chat buttons: {str(e)}")

@app.post("/chat-buttons", response_model=ChatButtonSchema)
async def create_chat_button(
    button: ChatButtonCreate,
    db: Session = Depends(get_db)
):
    """Create a new chat button"""
    try:
        db_button = ChatButton(**button.dict())
        db.add(db_button)
        db.commit()
        db.refresh(db_button)
        return db_button
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating chat button: {str(e)}")

@app.get("/chat-buttons/{button_id}", response_model=ChatButtonSchema)
async def get_chat_button(button_id: int, db: Session = Depends(get_db)):
    """Get a specific chat button by ID"""
    try:
        button = db.query(ChatButton).filter(ChatButton.id == button_id).first()
        if not button:
            raise HTTPException(status_code=404, detail="Chat button not found")
        return button
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat button: {str(e)}")

@app.put("/chat-buttons/{button_id}", response_model=ChatButtonSchema)
async def update_chat_button(
    button_id: int,
    button_update: ChatButtonUpdate,
    db: Session = Depends(get_db)
):
    """Update a chat button"""
    try:
        button = db.query(ChatButton).filter(ChatButton.id == button_id).first()
        if not button:
            raise HTTPException(status_code=404, detail="Chat button not found")
        
        # Update fields if provided
        update_data = button_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            if hasattr(button, field):
                setattr(button, field, value)
        
        button.updated_at = get_local_now()
        db.commit()
        db.refresh(button)
        
        return button
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating chat button: {str(e)}")

@app.delete("/chat-buttons/{button_id}")
async def delete_chat_button(button_id: int, db: Session = Depends(get_db)):
    """Delete a chat button"""
    try:
        button = db.query(ChatButton).filter(ChatButton.id == button_id).first()
        if not button:
            raise HTTPException(status_code=404, detail="Chat button not found")
        
        db.delete(button)
        db.commit()
        
        return {"message": "Chat button deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting chat button: {str(e)}")

@app.patch("/chat-buttons/{button_id}/toggle", response_model=ChatButtonSchema)
async def toggle_chat_button_status(button_id: int, db: Session = Depends(get_db)):
    """Toggle the active status of a chat button"""
    try:
        button = db.query(ChatButton).filter(ChatButton.id == button_id).first()
        if not button:
            raise HTTPException(status_code=404, detail="Chat button not found")
        
        button.is_active = not button.is_active
        button.updated_at = get_local_now()
        db.commit()
        db.refresh(button)
        
        return button
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error toggling chat button status: {str(e)}")

if __name__ == "__main__":
    from config import BACKEND_PORT
    uvicorn.run(app, host="0.0.0.0", port=BACKEND_PORT)
