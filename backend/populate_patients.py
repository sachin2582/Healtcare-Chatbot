#!/usr/bin/env python3
"""
Populate patients table with sample patient data
"""

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import date
from config import DATABASE_URL
from models import Patient

def populate_patients():
    """Populate patients table with sample data"""
    try:
        # Create engine and session
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Sample patient data
        patients_data = [
            {
                "first_name": "John",
                "last_name": "Smith",
                "email": "john.smith@email.com",
                "phone": "+1-555-0101",
                "address": "123 Main Street",
                "city": "New York",
                "state": "NY",
                "postal_code": "10001",
                "date_of_birth": date(1985, 3, 15),
                "gender": "Male",
                "emergency_contact_name": "Jane Smith",
                "emergency_contact_phone": "+1-555-0102",
                "medical_history": "Hypertension, Diabetes Type 2",
                "allergies": "Penicillin, Shellfish",
                "current_medications": "Metformin, Lisinopril"
            },
            {
                "first_name": "Sarah",
                "last_name": "Johnson",
                "email": "sarah.johnson@email.com",
                "phone": "+1-555-0201",
                "address": "456 Oak Avenue",
                "city": "Los Angeles",
                "state": "CA",
                "postal_code": "90210",
                "date_of_birth": date(1990, 7, 22),
                "gender": "Female",
                "emergency_contact_name": "Mike Johnson",
                "emergency_contact_phone": "+1-555-0202",
                "medical_history": "Asthma",
                "allergies": "Dust, Pollen",
                "current_medications": "Albuterol inhaler"
            },
            {
                "first_name": "Michael",
                "last_name": "Brown",
                "email": "michael.brown@email.com",
                "phone": "+1-555-0301",
                "address": "789 Pine Street",
                "city": "Chicago",
                "state": "IL",
                "postal_code": "60601",
                "date_of_birth": date(1978, 11, 8),
                "gender": "Male",
                "emergency_contact_name": "Lisa Brown",
                "emergency_contact_phone": "+1-555-0302",
                "medical_history": "High Cholesterol",
                "allergies": "None",
                "current_medications": "Atorvastatin"
            },
            {
                "first_name": "Emily",
                "last_name": "Davis",
                "email": "emily.davis@email.com",
                "phone": "+1-555-0401",
                "address": "321 Elm Street",
                "city": "Houston",
                "state": "TX",
                "postal_code": "77001",
                "date_of_birth": date(1992, 5, 14),
                "gender": "Female",
                "emergency_contact_name": "Robert Davis",
                "emergency_contact_phone": "+1-555-0402",
                "medical_history": "None",
                "allergies": "Latex",
                "current_medications": "None"
            },
            {
                "first_name": "David",
                "last_name": "Wilson",
                "email": "david.wilson@email.com",
                "phone": "+1-555-0501",
                "address": "654 Maple Drive",
                "city": "Phoenix",
                "state": "AZ",
                "postal_code": "85001",
                "date_of_birth": date(1983, 9, 30),
                "gender": "Male",
                "emergency_contact_name": "Susan Wilson",
                "emergency_contact_phone": "+1-555-0502",
                "medical_history": "Arthritis",
                "allergies": "Ibuprofen",
                "current_medications": "Naproxen"
            }
        ]
        
        print(f"📋 Creating {len(patients_data)} sample patients...")
        
        for patient_data in patients_data:
            # Check if patient already exists
            existing_patient = db.query(Patient).filter(
                Patient.email == patient_data["email"]
            ).first()
            
            if existing_patient:
                print(f"   ⏭️  Patient {patient_data['first_name']} {patient_data['last_name']} already exists, skipping...")
                continue
            
            # Create new patient
            patient = Patient(**patient_data)
            db.add(patient)
            print(f"   ✅ Created patient: {patient_data['first_name']} {patient_data['last_name']}")
        
        # Commit all changes
        db.commit()
        print(f"✅ Successfully created sample patients")
        
        # Show summary
        total_patients = db.query(Patient).count()
        print(f"📊 Total patients in database: {total_patients}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error populating patients: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    populate_patients()
