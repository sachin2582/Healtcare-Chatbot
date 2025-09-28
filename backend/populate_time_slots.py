#!/usr/bin/env python3
"""
Populate doctor_time_slots table with sample data
"""

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import time
from config import DATABASE_URL
from models import Doctor, DoctorTimeSlots

def populate_time_slots():
    """Populate doctor time slots with sample data"""
    try:
        # Create engine and session
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Get all doctors
        doctors = db.query(Doctor).all()
        
        if not doctors:
            print("❌ No doctors found. Please populate doctors first.")
            return False
        
        print(f"📋 Found {len(doctors)} doctors. Creating time slots...")
        
        # Sample time slots for each doctor
        time_slots_data = [
            # Monday to Friday: 9:00 AM - 5:00 PM (30-minute slots)
            {"day": 0, "start": "09:00", "end": "17:00", "duration": 30},  # Monday
            {"day": 1, "start": "09:00", "end": "17:00", "duration": 30},  # Tuesday
            {"day": 2, "start": "09:00", "end": "17:00", "duration": 30},  # Wednesday
            {"day": 3, "start": "09:00", "end": "17:00", "duration": 30},  # Thursday
            {"day": 4, "start": "09:00", "end": "17:00", "duration": 30},  # Friday
            # Saturday: 9:00 AM - 1:00 PM (30-minute slots)
            {"day": 5, "start": "09:00", "end": "13:00", "duration": 30},  # Saturday
        ]
        
        slots_created = 0
        
        for doctor in doctors:
            print(f"👨‍⚕️ Creating time slots for Dr. {doctor.name}")
            
            for slot_data in time_slots_data:
                # Check if slot already exists
                existing_slot = db.query(DoctorTimeSlots).filter(
                    DoctorTimeSlots.doctor_id == doctor.id,
                    DoctorTimeSlots.day_of_week == slot_data["day"]
                ).first()
                
                if existing_slot:
                    print(f"   ⏭️  Slot for day {slot_data['day']} already exists, skipping...")
                    continue
                
                # Create new time slot
                time_slot = DoctorTimeSlots(
                    doctor_id=doctor.id,
                    day_of_week=slot_data["day"],
                    start_time=time.fromisoformat(slot_data["start"]),
                    end_time=time.fromisoformat(slot_data["end"]),
                    slot_duration_minutes=slot_data["duration"],
                    is_available=True
                )
                
                db.add(time_slot)
                slots_created += 1
        
        # Commit all changes
        db.commit()
        print(f"✅ Successfully created {slots_created} time slots")
        
        # Show summary
        total_slots = db.query(DoctorTimeSlots).count()
        print(f"📊 Total time slots in database: {total_slots}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error populating time slots: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    populate_time_slots()
