#!/usr/bin/env python3
"""
Migration script to add city_id column to health_package_bookings table
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database import engine

def migrate_add_city_id():
    """Add city_id column to health_package_bookings table"""
    
    try:
        with engine.connect() as connection:
            # Check if city_id column already exists
            result = connection.execute(text("""
                SELECT COUNT(*) as count 
                FROM pragma_table_info('health_package_bookings') 
                WHERE name = 'city_id'
            """))
            
            column_exists = result.fetchone()[0] > 0
            
            if column_exists:
                print("⚠️  city_id column already exists in health_package_bookings table")
                return
            
            # Add city_id column
            connection.execute(text("""
                ALTER TABLE health_package_bookings 
                ADD COLUMN city_id INTEGER REFERENCES cities(id)
            """))
            
            connection.commit()
            print("✅ Successfully added city_id column to health_package_bookings table")
            
    except Exception as e:
        print(f"❌ Error adding city_id column: {str(e)}")
        raise

if __name__ == "__main__":
    print("🔄 Migrating database to add city_id column...")
    migrate_add_city_id()
    print("🎉 Migration completed!")
