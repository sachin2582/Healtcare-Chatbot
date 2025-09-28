#!/usr/bin/env python3
"""
Database migration script to add doctor_time_slots table
"""

from sqlalchemy import create_engine, text
from config import DATABASE_URL
from models import Base, DoctorTimeSlots

def migrate_database():
    """Add doctor_time_slots table to the database"""
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Create the new table
        DoctorTimeSlots.__table__.create(engine, checkfirst=True)
        
        print("✅ Successfully created doctor_time_slots table")
        return True
        
    except Exception as e:
        print(f"❌ Error creating doctor_time_slots table: {e}")
        return False

if __name__ == "__main__":
    migrate_database()
