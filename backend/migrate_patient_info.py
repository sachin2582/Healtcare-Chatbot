#!/usr/bin/env python3
"""
Database migration script to update patients table with new patient information fields
"""

from sqlalchemy import create_engine, text
from config import DATABASE_URL
from models import Base, Patient

def migrate_patient_table():
    """Update patients table with new patient information fields"""
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Drop the old patients table and recreate with new structure
        with engine.connect() as conn:
            # Drop the old table
            conn.execute(text("DROP TABLE IF EXISTS patients"))
            conn.commit()
            
            # Create the new table
            Patient.__table__.create(engine, checkfirst=True)
            
        print("✅ Successfully updated patients table with new structure")
        return True
        
    except Exception as e:
        print(f"❌ Error updating patients table: {e}")
        return False

if __name__ == "__main__":
    migrate_patient_table()
