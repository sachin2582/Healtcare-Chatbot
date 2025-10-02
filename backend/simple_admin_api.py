"""
Simple Admin Panel API Endpoints
Fixed version without complex schema issues
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import Doctor, Speciality, DoctorTimeSlots, HealthPackage

# Create router
admin_router = APIRouter(prefix="/admin", tags=["admin"])

# =============================================================================
# SIMPLE DOCTOR ENDPOINTS
# =============================================================================

@admin_router.get("/doctors")
async def get_doctors(db: Session = Depends(get_db)):
    """Get all doctors"""
    try:
        doctors = db.query(Doctor).all()
        return [
            {
                "id": doctor.id,
                "name": doctor.name,
                "specialization": doctor.specialization,
                "speciality_id": doctor.speciality_id,
                "qualification": doctor.qualification,
                "experience_years": doctor.experience_years,
                "contact": doctor.contact,
                "image_url": doctor.image_url,
                "is_available": doctor.is_available,
                "created_at": doctor.created_at.isoformat() if doctor.created_at else None
            }
            for doctor in doctors
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching doctors: {str(e)}")

@admin_router.post("/doctors")
async def create_doctor(
    name: str,
    specialization: str,
    qualification: Optional[str] = None,
    experience_years: Optional[int] = None,
    contact: Optional[str] = None,
    is_available: bool = True,
    db: Session = Depends(get_db)
):
    """Create a new doctor"""
    try:
        doctor = Doctor(
            name=name,
            specialization=specialization,
            qualification=qualification,
            experience_years=experience_years,
            contact=contact,
            is_available=is_available
        )
        db.add(doctor)
        db.commit()
        db.refresh(doctor)
        return {
            "id": doctor.id,
            "name": doctor.name,
            "specialization": doctor.specialization,
            "qualification": doctor.qualification,
            "experience_years": doctor.experience_years,
            "contact": doctor.contact,
            "is_available": doctor.is_available,
            "created_at": doctor.created_at.isoformat() if doctor.created_at else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating doctor: {str(e)}")

# =============================================================================
# SIMPLE SPECIALTY ENDPOINTS
# =============================================================================

@admin_router.get("/specialities")
async def get_specialities(db: Session = Depends(get_db)):
    """Get all specialties"""
    try:
        specialities = db.query(Speciality).all()
        return [
            {
                "id": speciality.id,
                "name": speciality.name,
                "description": speciality.description,
                "icon": speciality.icon,
                "is_active": speciality.is_active,
                "created_at": speciality.created_at.isoformat() if speciality.created_at else None
            }
            for speciality in specialities
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching specialties: {str(e)}")

@admin_router.post("/specialities")
async def create_speciality(
    name: str,
    description: Optional[str] = None,
    icon: Optional[str] = None,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    """Create a new specialty"""
    try:
        speciality = Speciality(
            name=name,
            description=description,
            icon=icon,
            is_active=is_active
        )
        db.add(speciality)
        db.commit()
        db.refresh(speciality)
        return {
            "id": speciality.id,
            "name": speciality.name,
            "description": speciality.description,
            "icon": speciality.icon,
            "is_active": speciality.is_active,
            "created_at": speciality.created_at.isoformat() if speciality.created_at else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating specialty: {str(e)}")

# =============================================================================
# SIMPLE TIME SLOTS ENDPOINTS
# =============================================================================

@admin_router.get("/time-slots")
async def get_time_slots(db: Session = Depends(get_db)):
    """Get all time slots"""
    try:
        time_slots = db.query(DoctorTimeSlots).all()
        return [
            {
                "id": slot.id,
                "doctor_id": slot.doctor_id,
                "day_of_week": slot.day_of_week,
                "start_time": slot.start_time.isoformat() if slot.start_time else None,
                "end_time": slot.end_time.isoformat() if slot.end_time else None,
                "slot_duration_minutes": slot.slot_duration_minutes,
                "is_available": slot.is_available,
                "created_at": slot.created_at.isoformat() if slot.created_at else None
            }
            for slot in time_slots
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching time slots: {str(e)}")

# =============================================================================
# SIMPLE HEALTH PACKAGES ENDPOINTS
# =============================================================================

@admin_router.get("/health-packages")
async def get_health_packages(db: Session = Depends(get_db)):
    """Get all health packages"""
    try:
        packages = db.query(HealthPackage).all()
        return [
            {
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
                "created_at": package.created_at.isoformat() if package.created_at else None
            }
            for package in packages
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching health packages: {str(e)}")

# =============================================================================
# DASHBOARD STATS
# =============================================================================

@admin_router.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    try:
        total_doctors = db.query(Doctor).count()
        total_specialities = db.query(Speciality).count()
        total_time_slots = db.query(DoctorTimeSlots).count()
        total_health_packages = db.query(HealthPackage).count()
        
        return {
            "total_doctors": total_doctors,
            "total_specialities": total_specialities,
            "total_time_slots": total_time_slots,
            "total_health_packages": total_health_packages,
            "total_appointments": 0,  # Will be implemented later
            "active_appointments": 0,  # Will be implemented later
            "completed_appointments": 0,  # Will be implemented later
            "total_patients": 0  # Will be implemented later
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")

