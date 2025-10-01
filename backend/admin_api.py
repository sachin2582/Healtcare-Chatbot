"""
Admin Panel API Endpoints
Provides CRUD operations for managing doctors, specialties, time slots, and health packages
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, time, date
import json
import base64

from database import get_db
from models import Doctor, Speciality, DoctorTimeSlots, HealthPackage, HealthPackageTest, Appointment, Patient, HealthPackageBooking
from admin_schemas import (
    DoctorCreate, DoctorUpdate, DoctorResponse,
    SpecialityCreate, SpecialityUpdate, SpecialityResponse,
    TimeSlotCreate, TimeSlotUpdate, TimeSlotResponse,
    HealthPackageCreate, HealthPackageUpdate, HealthPackageResponse,
    HealthPackageTestCreate, HealthPackageTestResponse
)

admin_router = APIRouter(prefix="/admin", tags=["admin"])

# =============================================================================
# SPECIALITY MANAGEMENT
# =============================================================================

@admin_router.get("/specialities", response_model=List[SpecialityResponse])
async def get_specialities(db: Session = Depends(get_db)):
    """Get all specialties"""
    specialities = db.query(Speciality).all()
    return [
        {
            **speciality.__dict__,
            "created_at": speciality.created_at.isoformat() if speciality.created_at else None
        }
        for speciality in specialities
    ]

@admin_router.post("/specialities", response_model=SpecialityResponse)
async def create_speciality(speciality: SpecialityCreate, db: Session = Depends(get_db)):
    """Create a new specialty"""
    db_speciality = Speciality(**speciality.dict())
    db.add(db_speciality)
    db.commit()
    db.refresh(db_speciality)
    return db_speciality

@admin_router.put("/specialities/{speciality_id}", response_model=SpecialityResponse)
async def update_speciality(
    speciality_id: int, 
    speciality: SpecialityUpdate, 
    db: Session = Depends(get_db)
):
    """Update a specialty"""
    db_speciality = db.query(Speciality).filter(Speciality.id == speciality_id).first()
    if not db_speciality:
        raise HTTPException(status_code=404, detail="Specialty not found")
    
    update_data = speciality.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_speciality, field, value)
    
    db.commit()
    db.refresh(db_speciality)
    return db_speciality

@admin_router.delete("/specialities/{speciality_id}")
async def delete_speciality(speciality_id: int, db: Session = Depends(get_db)):
    """Delete a specialty"""
    db_speciality = db.query(Speciality).filter(Speciality.id == speciality_id).first()
    if not db_speciality:
        raise HTTPException(status_code=404, detail="Specialty not found")
    
    # Check if specialty has doctors
    doctors_count = db.query(Doctor).filter(Doctor.speciality_id == speciality_id).count()
    if doctors_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete specialty. {doctors_count} doctors are associated with this specialty."
        )
    
    db.delete(db_speciality)
    db.commit()
    return {"message": "Specialty deleted successfully"}

# =============================================================================
# DOCTOR MANAGEMENT
# =============================================================================

@admin_router.get("/doctors", response_model=List[DoctorResponse])
async def get_doctors(db: Session = Depends(get_db)):
    """Get all doctors with their specialties"""
    doctors = db.query(Doctor).all()
    return [
        {
            **doctor.__dict__,
            "created_at": doctor.created_at.isoformat() if doctor.created_at else None
        }
        for doctor in doctors
    ]

@admin_router.post("/doctors", response_model=DoctorResponse)
async def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    """Create a new doctor"""
    # Validate specialty exists
    if doctor.speciality_id:
        speciality = db.query(Speciality).filter(Speciality.id == doctor.speciality_id).first()
        if not speciality:
            raise HTTPException(status_code=404, detail="Specialty not found")
    
    db_doctor = Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@admin_router.post("/doctors/{doctor_id}/image")
async def upload_doctor_image(
    doctor_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload doctor image"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Read and store image data
    image_data = await file.read()
    doctor.image_data = image_data
    doctor.image_url = f"/api/admin/doctors/{doctor_id}/image"
    
    db.commit()
    return {"message": "Image uploaded successfully", "image_url": doctor.image_url}

@admin_router.get("/doctors/{doctor_id}/image")
async def get_doctor_image(doctor_id: int, db: Session = Depends(get_db)):
    """Get doctor image"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor or not doctor.image_data:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return Response(content=doctor.image_data, media_type="image/jpeg")

@admin_router.put("/doctors/{doctor_id}", response_model=DoctorResponse)
async def update_doctor(
    doctor_id: int,
    doctor_update: DoctorUpdate,
    db: Session = Depends(get_db)
):
    """Update a doctor"""
    db_doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = doctor_update.dict(exclude_unset=True)
    
    # Validate specialty if provided
    if 'speciality_id' in update_data and update_data['speciality_id']:
        speciality = db.query(Speciality).filter(Speciality.id == update_data['speciality_id']).first()
        if not speciality:
            raise HTTPException(status_code=404, detail="Specialty not found")
    
    for field, value in update_data.items():
        setattr(db_doctor, field, value)
    
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@admin_router.delete("/doctors/{doctor_id}")
async def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Delete a doctor"""
    db_doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Check if doctor has appointments
    appointments_count = db.query(Appointment).filter(Appointment.doctor_id == doctor_id).count()
    if appointments_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete doctor. {appointments_count} appointments are associated with this doctor."
        )
    
    db.delete(db_doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}

# =============================================================================
# TIME SLOT MANAGEMENT
# =============================================================================

@admin_router.get("/doctors/{doctor_id}/time-slots", response_model=List[TimeSlotResponse])
async def get_doctor_time_slots(doctor_id: int, db: Session = Depends(get_db)):
    """Get all time slots for a doctor"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return db.query(DoctorTimeSlots).filter(DoctorTimeSlots.doctor_id == doctor_id).all()

@admin_router.post("/doctors/{doctor_id}/time-slots", response_model=TimeSlotResponse)
async def create_time_slot(
    doctor_id: int,
    time_slot: TimeSlotCreate,
    db: Session = Depends(get_db)
):
    """Create a new time slot for a doctor"""
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Check if time slot already exists for this doctor and day
    existing_slot = db.query(DoctorTimeSlots).filter(
        DoctorTimeSlots.doctor_id == doctor_id,
        DoctorTimeSlots.day_of_week == time_slot.day_of_week
    ).first()
    
    if existing_slot:
        raise HTTPException(
            status_code=400,
            detail=f"Time slot already exists for this doctor on day {time_slot.day_of_week}"
        )
    
    db_time_slot = DoctorTimeSlots(
        doctor_id=doctor_id,
        **time_slot.dict()
    )
    db.add(db_time_slot)
    db.commit()
    db.refresh(db_time_slot)
    return db_time_slot

@admin_router.put("/time-slots/{slot_id}", response_model=TimeSlotResponse)
async def update_time_slot(
    slot_id: int,
    time_slot: TimeSlotUpdate,
    db: Session = Depends(get_db)
):
    """Update a time slot"""
    db_time_slot = db.query(DoctorTimeSlots).filter(DoctorTimeSlots.id == slot_id).first()
    if not db_time_slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    
    update_data = time_slot.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_time_slot, field, value)
    
    db.commit()
    db.refresh(db_time_slot)
    return db_time_slot

@admin_router.delete("/time-slots/{slot_id}")
async def delete_time_slot(slot_id: int, db: Session = Depends(get_db)):
    """Delete a time slot"""
    db_time_slot = db.query(DoctorTimeSlots).filter(DoctorTimeSlots.id == slot_id).first()
    if not db_time_slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    
    db.delete(db_time_slot)
    db.commit()
    return {"message": "Time slot deleted successfully"}

# =============================================================================
# HEALTH PACKAGE MANAGEMENT
# =============================================================================

@admin_router.get("/health-packages", response_model=List[HealthPackageResponse])
async def get_health_packages(db: Session = Depends(get_db)):
    """Get all health packages"""
    return db.query(HealthPackage).all()

@admin_router.post("/health-packages", response_model=HealthPackageResponse)
async def create_health_package(
    package: HealthPackageCreate,
    db: Session = Depends(get_db)
):
    """Create a new health package"""
    db_package = HealthPackage(**package.dict())
    db.add(db_package)
    db.commit()
    db.refresh(db_package)
    return db_package

@admin_router.post("/health-packages/{package_id}/image")
async def upload_package_image(
    package_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload health package image"""
    package = db.query(HealthPackage).filter(HealthPackage.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Health package not found")
    
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_data = await file.read()
    package.image_data = base64.b64encode(image_data).decode('utf-8')
    package.image_url = f"/api/admin/health-packages/{package_id}/image"
    
    db.commit()
    return {"message": "Image uploaded successfully", "image_url": package.image_url}

@admin_router.put("/health-packages/{package_id}", response_model=HealthPackageResponse)
async def update_health_package(
    package_id: int,
    package_update: HealthPackageUpdate,
    db: Session = Depends(get_db)
):
    """Update a health package"""
    db_package = db.query(HealthPackage).filter(HealthPackage.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Health package not found")
    
    update_data = package_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_package, field, value)
    
    db.commit()
    db.refresh(db_package)
    return db_package

@admin_router.delete("/health-packages/{package_id}")
async def delete_health_package(package_id: int, db: Session = Depends(get_db)):
    """Delete a health package"""
    db_package = db.query(HealthPackage).filter(HealthPackage.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Health package not found")
    
    # Check if package has bookings
    bookings_count = db.query(HealthPackageBooking).filter(
        HealthPackageBooking.package_id == package_id
    ).count()
    if bookings_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete package. {bookings_count} bookings are associated with this package."
        )
    
    db.delete(db_package)
    db.commit()
    return {"message": "Health package deleted successfully"}

# =============================================================================
# HEALTH PACKAGE TESTS MANAGEMENT
# =============================================================================

@admin_router.get("/health-packages/{package_id}/tests", response_model=List[HealthPackageTestResponse])
async def get_package_tests(package_id: int, db: Session = Depends(get_db)):
    """Get all tests for a health package"""
    package = db.query(HealthPackage).filter(HealthPackage.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Health package not found")
    
    return db.query(HealthPackageTest).filter(HealthPackageTest.package_id == package_id).all()

@admin_router.post("/health-packages/{package_id}/tests", response_model=HealthPackageTestResponse)
async def create_package_test(
    package_id: int,
    test: HealthPackageTestCreate,
    db: Session = Depends(get_db)
):
    """Add a test to a health package"""
    package = db.query(HealthPackage).filter(HealthPackage.id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Health package not found")
    
    db_test = HealthPackageTest(
        package_id=package_id,
        **test.dict()
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test

@admin_router.put("/health-package-tests/{test_id}", response_model=HealthPackageTestResponse)
async def update_package_test(
    test_id: int,
    test_update: HealthPackageTestCreate,
    db: Session = Depends(get_db)
):
    """Update a health package test"""
    db_test = db.query(HealthPackageTest).filter(HealthPackageTest.id == test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    update_data = test_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_test, field, value)
    
    db.commit()
    db.refresh(db_test)
    return db_test

@admin_router.delete("/health-package-tests/{test_id}")
async def delete_package_test(test_id: int, db: Session = Depends(get_db)):
    """Delete a health package test"""
    db_test = db.query(HealthPackageTest).filter(HealthPackageTest.id == test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    db.delete(db_test)
    db.commit()
    return {"message": "Test deleted successfully"}

# =============================================================================
# ADMIN DASHBOARD STATS
# =============================================================================

@admin_router.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    stats = {
        "total_doctors": db.query(Doctor).count(),
        "total_specialities": db.query(Speciality).count(),
        "total_health_packages": db.query(HealthPackage).count(),
        "total_appointments": db.query(Appointment).count(),
        "active_appointments": db.query(Appointment).filter(
            Appointment.status.in_(["scheduled", "confirmed"])
        ).count(),
        "completed_appointments": db.query(Appointment).filter(
            Appointment.status == "completed"
        ).count(),
        "total_patients": db.query(Patient).count(),
    }
    return stats


