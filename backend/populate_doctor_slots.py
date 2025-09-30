#!/usr/bin/env python3
"""
Populate doctor time slots table with sample data
"""

from database import get_db
from models import Doctor, DoctorTimeSlots
from sqlalchemy.orm import Session
from datetime import time

def populate_doctor_slots():
    """Populate doctor time slots table with sample data"""
    db = next(get_db())
    
    try:
        # Get all doctors
        doctors = db.query(Doctor).all()
        if not doctors:
            print("No doctors found. Please populate doctors first.")
            return
        
        print(f"Creating time slots for {len(doctors)} doctors...")
        
        # Time slots for each day of the week (0=Monday, 6=Sunday)
        time_slots_data = [
            # Monday (0)
            {
                "day_of_week": 0,
                "start_time": time(9, 0),  # 9:00 AM
                "end_time": time(17, 0),   # 5:00 PM
                "slot_duration_minutes": 30,
                "is_available": True
            },
            # Tuesday (1)
            {
                "day_of_week": 1,
                "start_time": time(9, 0),
                "end_time": time(17, 0),
                "slot_duration_minutes": 30,
                "is_available": True
            },
            # Wednesday (2)
            {
                "day_of_week": 2,
                "start_time": time(9, 0),
                "end_time": time(17, 0),
                "slot_duration_minutes": 30,
                "is_available": True
            },
            # Thursday (3)
            {
                "day_of_week": 3,
                "start_time": time(9, 0),
                "end_time": time(17, 0),
                "slot_duration_minutes": 30,
                "is_available": True
            },
            # Friday (4)
            {
                "day_of_week": 4,
                "start_time": time(9, 0),
                "end_time": time(17, 0),
                "slot_duration_minutes": 30,
                "is_available": True
            },
            # Saturday (5) - Half day
            {
                "day_of_week": 5,
                "start_time": time(9, 0),
                "end_time": time(13, 0),  # 1:00 PM
                "slot_duration_minutes": 30,
                "is_available": True
            }
        ]
        
        slots_created = 0
        
        for doctor in doctors:
            print(f"Adding time slots for Dr. {doctor.name}...")
            
            for slot_data in time_slots_data:
                time_slot = DoctorTimeSlots(
                    doctor_id=doctor.id,
                    day_of_week=slot_data["day_of_week"],
                    start_time=slot_data["start_time"],
                    end_time=slot_data["end_time"],
                    slot_duration_minutes=slot_data["slot_duration_minutes"],
                    is_available=slot_data["is_available"]
                )
                db.add(time_slot)
                slots_created += 1
        
        db.commit()
        print(f"Successfully created {slots_created} time slots for {len(doctors)} doctors!")
        
    except Exception as e:
        db.rollback()
        print(f"Error populating doctor time slots: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    populate_doctor_slots()
