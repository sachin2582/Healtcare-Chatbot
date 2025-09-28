#!/usr/bin/env python3
"""
Script to populate the specialities table with medical specialities
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import Base, Speciality, Doctor
from sqlalchemy.orm import Session

def create_specialities():
    """Create specialities table and populate with data"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if specialities already exist
        if db.query(Speciality).count() > 0:
            print("Specialities already exist. Updating doctors...")
            update_doctors_with_specialities(db)
            return
        
        # Define specialities with icons
        specialities_data = [
            {
                "name": "Cardiology",
                "description": "Heart and cardiovascular system specialists",
                "icon": "❤️"
            },
            {
                "name": "Neurology", 
                "description": "Brain, spinal cord, and nervous system specialists",
                "icon": "🧠"
            },
            {
                "name": "Orthopedics",
                "description": "Bones, joints, and musculoskeletal system specialists", 
                "icon": "🦴"
            },
            {
                "name": "Pediatrics",
                "description": "Medical care for infants, children, and adolescents",
                "icon": "👶"
            },
            {
                "name": "Dermatology",
                "description": "Skin, hair, and nail condition specialists",
                "icon": "🩺"
            },
            {
                "name": "Gynecology",
                "description": "Women's reproductive health specialists",
                "icon": "👩"
            },
            {
                "name": "Ophthalmology",
                "description": "Eye and vision care specialists",
                "icon": "👁️"
            },
            {
                "name": "Psychiatry",
                "description": "Mental health and behavioral disorder specialists",
                "icon": "🧠"
            },
            {
                "name": "Gastroenterology",
                "description": "Digestive system and gastrointestinal specialists",
                "icon": "🫀"
            },
            {
                "name": "Urology",
                "description": "Urinary tract and male reproductive system specialists",
                "icon": "🔬"
            },
            {
                "name": "Oncology",
                "description": "Cancer diagnosis and treatment specialists",
                "icon": "🎗️"
            },
            {
                "name": "Emergency Medicine",
                "description": "Emergency and urgent care specialists",
                "icon": "🚨"
            }
        ]
        
        # Insert specialities
        for spec_data in specialities_data:
            speciality = Speciality(**spec_data)
            db.add(speciality)
        
        db.commit()
        print(f"Successfully created {len(specialities_data)} specialities")
        
        # Update existing doctors with speciality_id
        update_doctors_with_specialities(db)
        
    except Exception as e:
        print(f"Error creating specialities: {e}")
        db.rollback()
    finally:
        db.close()

def update_doctors_with_specialities(db: Session):
    """Update existing doctors with speciality_id based on specialization"""
    
    # Mapping of old specialization names to new speciality names
    specialization_mapping = {
        "Cardiologist": "Cardiology",
        "Cardiology": "Cardiology",
        "Neurologist": "Neurology", 
        "Neurology": "Neurology",
        "Orthopedic Surgeon": "Orthopedics",
        "Orthopaedics": "Orthopedics",
        "Pediatrician": "Pediatrics",
        "Pediatrics": "Pediatrics",
        "Dermatologist": "Dermatology",
        "Dermatology": "Dermatology",
        "Gynecologist": "Gynecology",
        "Gynecology": "Gynecology",
        "Ophthalmologist": "Ophthalmology",
        "Ophthalmology": "Ophthalmology",
        "Psychiatrist": "Psychiatry",
        "Psychiatry": "Psychiatry",
        "Gastroenterologist": "Gastroenterology",
        "Gastroenterology": "Gastroenterology",
        "Urologist": "Urology",
        "Urology": "Urology",
        "Oncologist": "Oncology",
        "Oncology": "Oncology",
        "Emergency Medicine": "Emergency Medicine",
        "Internal Medicine": "Cardiology",  # Map to closest match
        "Pulmonology": "Cardiology",  # Map to closest match
        "Endocrinology": "Cardiology"  # Map to closest match
    }
    
    # Get all specialities
    specialities = {spec.name: spec.id for spec in db.query(Speciality).all()}
    
    # Update doctors
    doctors = db.query(Doctor).all()
    updated_count = 0
    
    for doctor in doctors:
        if doctor.specialization in specialization_mapping:
            speciality_name = specialization_mapping[doctor.specialization]
            if speciality_name in specialities:
                doctor.speciality_id = specialities[speciality_name]
                # Add some sample data
                if not doctor.qualification:
                    doctor.qualification = f"MD in {speciality_name}"
                if not doctor.experience_years:
                    doctor.experience_years = 5 + (doctor.id % 15)  # 5-20 years experience
                if not doctor.image_url:
                    doctor.image_url = f"https://via.placeholder.com/200x200/1e3c72/ffffff?text=Dr.{doctor.name.split()[0]}"
                updated_count += 1
    
    db.commit()
    print(f"Updated {updated_count} doctors with speciality information")

if __name__ == "__main__":
    create_specialities()
