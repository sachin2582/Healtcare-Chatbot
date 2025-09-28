#!/usr/bin/env python3
"""
Debug script to check appointments in database
"""

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
from config import DATABASE_URL
from models import Appointment, Doctor

def debug_appointments():
    """Debug appointments in database"""
    try:
        # Create engine and session
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        print("🔍 Debugging Appointments...")
        
        # Get all appointments
        appointments = db.query(Appointment).all()
        print(f"📊 Total appointments in database: {len(appointments)}")
        
        for appointment in appointments:
            print(f"   - ID: {appointment.id}, Doctor: {appointment.doctor_id}, Date: {appointment.date}, Status: {appointment.status}")
        
        # Check specific doctor and date
        doctor_id = 7
        test_date = datetime(2025, 1, 27).date()
        
        print(f"\n🔍 Checking appointments for doctor {doctor_id} on {test_date}...")
        
        specific_appointments = db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.date >= test_date,
            Appointment.date < test_date.replace(day=test_date.day + 1)
        ).all()
        
        print(f"📊 Found {len(specific_appointments)} appointments for this doctor on this date")
        
        for appointment in specific_appointments:
            print(f"   - Time: {appointment.date.time()}, Status: {appointment.status}")
        
        # Check 09:00 specifically
        test_datetime = datetime.combine(test_date, datetime.strptime("09:00", "%H:%M").time())
        print(f"\n🔍 Checking 09:00 slot specifically...")
        print(f"   Looking for datetime: {test_datetime}")
        
        slot_appointments = db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.date == test_datetime
        ).all()
        
        print(f"📊 Found {len(slot_appointments)} appointments at 09:00")
        
        for appointment in slot_appointments:
            print(f"   - Status: {appointment.status}, Date: {appointment.date}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    debug_appointments()
