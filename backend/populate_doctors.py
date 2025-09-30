#!/usr/bin/env python3
"""
Populate doctors table with sample data
"""

from database import get_db
from models import Doctor, Speciality
from sqlalchemy.orm import Session
import random

def populate_doctors():
    """Populate doctors table with sample data"""
    db = next(get_db())
    
    try:
        # Get all specialities
        specialities = db.query(Speciality).all()
        if not specialities:
            print("No specialities found. Please populate specialities first.")
            return
        
        # Sample doctors data
        doctors_data = [
            {
                "name": "Dr. Sarah Johnson",
                "specialization": "Cardiology",
                "contact": "+1-555-0101",
                "qualification": "MD, Cardiology",
                "experience_years": 15,
                "is_available": True
            },
            {
                "name": "Dr. Michael Chen",
                "specialization": "Neurology", 
                "contact": "+1-555-0102",
                "qualification": "MD, Neurology",
                "experience_years": 12,
                "is_available": True
            },
            {
                "name": "Dr. Emily Rodriguez",
                "specialization": "Dermatology",
                "contact": "+1-555-0103", 
                "qualification": "MD, Dermatology",
                "experience_years": 10,
                "is_available": True
            },
            {
                "name": "Dr. James Wilson",
                "specialization": "Orthopedics",
                "contact": "+1-555-0104",
                "qualification": "MD, Orthopedics",
                "experience_years": 18,
                "is_available": True
            },
            {
                "name": "Dr. Lisa Anderson",
                "specialization": "Pediatrics",
                "contact": "+1-555-0105",
                "qualification": "MD, Pediatrics",
                "experience_years": 14,
                "is_available": True
            },
            {
                "name": "Dr. Robert Brown",
                "specialization": "Internal Medicine",
                "contact": "+1-555-0106",
                "qualification": "MD, Internal Medicine",
                "experience_years": 20,
                "is_available": True
            },
            {
                "name": "Dr. Maria Garcia",
                "specialization": "Gynecology",
                "contact": "+1-555-0107",
                "qualification": "MD, Gynecology",
                "experience_years": 16,
                "is_available": True
            },
            {
                "name": "Dr. David Lee",
                "specialization": "Ophthalmology",
                "contact": "+1-555-0108",
                "qualification": "MD, Ophthalmology",
                "experience_years": 13,
                "is_available": True
            },
            {
                "name": "Dr. Jennifer Taylor",
                "specialization": "Psychiatry",
                "contact": "+1-555-0109",
                "qualification": "MD, Psychiatry",
                "experience_years": 11,
                "is_available": True
            },
            {
                "name": "Dr. Christopher Davis",
                "specialization": "Urology",
                "contact": "+1-555-0110",
                "qualification": "MD, Urology",
                "experience_years": 17,
                "is_available": True
            },
            {
                "name": "Dr. Amanda White",
                "specialization": "Endocrinology",
                "contact": "+1-555-0111",
                "qualification": "MD, Endocrinology",
                "experience_years": 9,
                "is_available": True
            },
            {
                "name": "Dr. Kevin Martinez",
                "specialization": "Gastroenterology",
                "contact": "+1-555-0112",
                "qualification": "MD, Gastroenterology",
                "experience_years": 19,
                "is_available": True
            }
        ]
        
        print(f"Creating {len(doctors_data)} sample doctors...")
        
        for doctor_data in doctors_data:
            # Find matching speciality
            speciality = None
            for spec in specialities:
                if spec.name.lower() == doctor_data["specialization"].lower():
                    speciality = spec
                    break
            
            if speciality:
                doctor = Doctor(
                    name=doctor_data["name"],
                    specialization=doctor_data["specialization"],
                    contact=doctor_data["contact"],
                    qualification=doctor_data["qualification"],
                    experience_years=doctor_data["experience_years"],
                    is_available=doctor_data["is_available"],
                    speciality_id=speciality.id
                )
            else:
                # Create doctor without speciality reference
                doctor = Doctor(
                    name=doctor_data["name"],
                    specialization=doctor_data["specialization"],
                    contact=doctor_data["contact"],
                    qualification=doctor_data["qualification"],
                    experience_years=doctor_data["experience_years"],
                    is_available=doctor_data["is_available"]
                )
            
            db.add(doctor)
        
        db.commit()
        print(f"Successfully created {len(doctors_data)} doctors!")
        
    except Exception as e:
        db.rollback()
        print(f"Error populating doctors: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    populate_doctors()
