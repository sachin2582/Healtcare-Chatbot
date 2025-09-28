#!/usr/bin/env python3
"""
Script to migrate the database to add new columns
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import Base
from sqlalchemy import text

def migrate_database():
    """Add new columns to existing tables"""
    
    db = SessionLocal()
    
    try:
        # Add new columns to doctors table
        migration_queries = [
            "ALTER TABLE doctors ADD COLUMN speciality_id INTEGER REFERENCES specialities(id)",
            "ALTER TABLE doctors ADD COLUMN qualification TEXT",
            "ALTER TABLE doctors ADD COLUMN experience_years INTEGER", 
            "ALTER TABLE doctors ADD COLUMN image_url TEXT",
            "ALTER TABLE doctors ADD COLUMN image_data BLOB",
            "ALTER TABLE doctors ADD COLUMN is_available BOOLEAN DEFAULT 1"
        ]
        
        for query in migration_queries:
            try:
                db.execute(text(query))
                print(f"Executed: {query}")
            except Exception as e:
                print(f"Error executing {query}: {e}")
                # Continue with other queries
        
        db.commit()
        print("Database migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_database()
