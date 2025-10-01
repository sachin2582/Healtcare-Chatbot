"""
Admin Panel Schemas - Fixed version without circular references
Pydantic models for admin panel API requests and responses
"""

from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import time, date
from enum import Enum

# =============================================================================
# SPECIALITY SCHEMAS
# =============================================================================

class SpecialityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True

class SpecialityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None

class SpecialityResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    icon: Optional[str]
    is_active: bool
    created_at: str

    class Config:
        from_attributes = True

# =============================================================================
# DOCTOR SCHEMAS
# =============================================================================

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    speciality_id: Optional[int] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    contact: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool = True

    @validator('experience_years')
    def validate_experience(cls, v):
        if v is not None and v < 0:
            raise ValueError('Experience years cannot be negative')
        return v

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    speciality_id: Optional[int] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    contact: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None

    @validator('experience_years')
    def validate_experience(cls, v):
        if v is not None and v < 0:
            raise ValueError('Experience years cannot be negative')
        return v

class DoctorResponse(BaseModel):
    id: int
    name: str
    specialization: str
    speciality_id: Optional[int]
    qualification: Optional[str]
    experience_years: Optional[int]
    contact: Optional[str]
    image_url: Optional[str]
    is_available: bool
    created_at: str
    speciality: Optional[SpecialityResponse] = None

    class Config:
        from_attributes = True

# =============================================================================
# TIME SLOT SCHEMAS
# =============================================================================

class TimeSlotCreate(BaseModel):
    day_of_week: int
    start_time: str  # Format: "HH:MM"
    end_time: str    # Format: "HH:MM"
    slot_duration_minutes: int = 30
    is_available: bool = True

    @validator('day_of_week')
    def validate_day_of_week(cls, v):
        if v < 0 or v > 6:
            raise ValueError('Day of week must be between 0 (Monday) and 6 (Sunday)')
        return v

    @validator('start_time', 'end_time')
    def validate_time_format(cls, v):
        try:
            time.fromisoformat(v)
        except ValueError:
            raise ValueError('Time must be in HH:MM format')
        return v

    @validator('slot_duration_minutes')
    def validate_slot_duration(cls, v):
        if v <= 0 or v > 480:  # Max 8 hours
            raise ValueError('Slot duration must be between 1 and 480 minutes')
        return v

class TimeSlotUpdate(BaseModel):
    day_of_week: Optional[int] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    slot_duration_minutes: Optional[int] = None
    is_available: Optional[bool] = None

    @validator('day_of_week')
    def validate_day_of_week(cls, v):
        if v is not None and (v < 0 or v > 6):
            raise ValueError('Day of week must be between 0 (Monday) and 6 (Sunday)')
        return v

    @validator('start_time', 'end_time')
    def validate_time_format(cls, v):
        if v is not None:
            try:
                time.fromisoformat(v)
            except ValueError:
                raise ValueError('Time must be in HH:MM format')
        return v

    @validator('slot_duration_minutes')
    def validate_slot_duration(cls, v):
        if v is not None and (v <= 0 or v > 480):
            raise ValueError('Slot duration must be between 1 and 480 minutes')
        return v

class TimeSlotResponse(BaseModel):
    id: int
    doctor_id: int
    day_of_week: int
    start_time: str
    end_time: str
    slot_duration_minutes: int
    is_available: bool
    created_at: str

    class Config:
        from_attributes = True

# =============================================================================
# HEALTH PACKAGE TEST SCHEMAS (Define first to avoid circular reference)
# =============================================================================

class HealthPackageTestCreate(BaseModel):
    test_name: str
    test_category: str
    test_description: Optional[str] = None
    is_optional: bool = False

class HealthPackageTestResponse(BaseModel):
    id: int
    package_id: int
    test_name: str
    test_category: str
    test_description: Optional[str]
    is_optional: bool
    created_at: str

    class Config:
        from_attributes = True

# =============================================================================
# HEALTH PACKAGE SCHEMAS
# =============================================================================

class HealthPackageCreate(BaseModel):
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

    @validator('price', 'original_price')
    def validate_price(cls, v):
        if v is not None and v < 0:
            raise ValueError('Price cannot be negative')
        return v

    @validator('duration_hours')
    def validate_duration(cls, v):
        if v <= 0 or v > 24:
            raise ValueError('Duration must be between 1 and 24 hours')
        return v

    @validator('report_delivery_days')
    def validate_report_delivery(cls, v):
        if v <= 0 or v > 30:
            raise ValueError('Report delivery days must be between 1 and 30')
        return v

    @validator('gender_specific')
    def validate_gender(cls, v):
        if v is not None and v not in ['Male', 'Female']:
            raise ValueError('Gender specific must be "Male", "Female", or null')
        return v

class HealthPackageUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    original_price: Optional[int] = None
    duration_hours: Optional[int] = None
    age_group: Optional[str] = None
    gender_specific: Optional[str] = None
    fasting_required: Optional[bool] = None
    home_collection_available: Optional[bool] = None
    lab_visit_required: Optional[bool] = None
    report_delivery_days: Optional[int] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None

    @validator('price', 'original_price')
    def validate_price(cls, v):
        if v is not None and v < 0:
            raise ValueError('Price cannot be negative')
        return v

    @validator('duration_hours')
    def validate_duration(cls, v):
        if v is not None and (v <= 0 or v > 24):
            raise ValueError('Duration must be between 1 and 24 hours')
        return v

    @validator('report_delivery_days')
    def validate_report_delivery(cls, v):
        if v is not None and (v <= 0 or v > 30):
            raise ValueError('Report delivery days must be between 1 and 30')
        return v

    @validator('gender_specific')
    def validate_gender(cls, v):
        if v is not None and v not in ['Male', 'Female']:
            raise ValueError('Gender specific must be "Male", "Female", or null')
        return v

class HealthPackageResponse(BaseModel):
    id: int
    name: str
    description: str
    price: int
    original_price: Optional[int]
    duration_hours: int
    age_group: str
    gender_specific: Optional[str]
    fasting_required: bool
    home_collection_available: bool
    lab_visit_required: bool
    report_delivery_days: int
    is_active: bool
    image_url: Optional[str]
    created_at: str
    tests: List[HealthPackageTestResponse] = []

    class Config:
        from_attributes = True

# =============================================================================
# DASHBOARD SCHEMAS
# =============================================================================

class DashboardStats(BaseModel):
    total_doctors: int
    total_specialities: int
    total_health_packages: int
    total_appointments: int
    active_appointments: int
    completed_appointments: int
    total_patients: int

# =============================================================================
# BULK OPERATION SCHEMAS
# =============================================================================

class BulkTimeSlotCreate(BaseModel):
    doctor_id: int
    time_slots: List[TimeSlotCreate]

class BulkTestCreate(BaseModel):
    package_id: int
    tests: List[HealthPackageTestCreate]
