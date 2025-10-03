#!/usr/bin/env python3
"""
Script to update Nagpur's availability status in the database
"""

from database import SessionLocal
from models import City

def update_nagpur():
    """Update Nagpur's is_available status to False"""
    db = SessionLocal()
    try:
        # Find Nagpur
        nagpur = db.query(City).filter(City.name == 'Nagpur').first()
        if nagpur:
            print(f"Before update - Nagpur is_available: {nagpur.is_available}")
            
            # Update to False
            nagpur.is_available = False
            db.commit()
            
            # Verify the update
            updated_nagpur = db.query(City).filter(City.name == 'Nagpur').first()
            print(f"After update - Nagpur is_available: {updated_nagpur.is_available}")
            print("✅ Successfully updated Nagpur to is_available = False")
        else:
            print("❌ Nagpur not found in database")
    except Exception as e:
        print(f"❌ Error updating Nagpur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_nagpur()
