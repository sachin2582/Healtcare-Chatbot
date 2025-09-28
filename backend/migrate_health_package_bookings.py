#!/usr/bin/env python3
"""
Migration script to create health_package_bookings table
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from config import DATABASE_URL

def migrate_health_package_bookings():
    """Create health_package_bookings table"""
    try:
        # Create database engine
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            # Create the health_package_bookings table
            create_table_sql = """
            CREATE TABLE IF NOT EXISTS health_package_bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                package_id INTEGER NOT NULL,
                patient_name VARCHAR(255) NOT NULL,
                patient_email VARCHAR(255) NOT NULL,
                patient_phone VARCHAR(20) NOT NULL,
                patient_age INTEGER NOT NULL,
                patient_gender VARCHAR(10) NOT NULL,
                preferred_date DATE NOT NULL,
                preferred_time VARCHAR(10) NOT NULL,
                total_amount INTEGER NOT NULL,
                status VARCHAR(20) DEFAULT 'confirmed',
                confirmation_number VARCHAR(20) UNIQUE NOT NULL,
                payment_status VARCHAR(20) DEFAULT 'pending',
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                booking_date DATETIME NOT NULL,
                FOREIGN KEY (package_id) REFERENCES health_packages (id)
            );
            """
            
            conn.execute(text(create_table_sql))
            
            # Create indexes for better performance
            indexes = [
                "CREATE INDEX IF NOT EXISTS idx_health_package_bookings_package_id ON health_package_bookings(package_id);",
                "CREATE INDEX IF NOT EXISTS idx_health_package_bookings_confirmation_number ON health_package_bookings(confirmation_number);",
                "CREATE INDEX IF NOT EXISTS idx_health_package_bookings_status ON health_package_bookings(status);",
                "CREATE INDEX IF NOT EXISTS idx_health_package_bookings_payment_status ON health_package_bookings(payment_status);",
                "CREATE INDEX IF NOT EXISTS idx_health_package_bookings_created_at ON health_package_bookings(created_at);"
            ]
            
            for index_sql in indexes:
                conn.execute(text(index_sql))
            
            conn.commit()
            print("✅ Health package bookings table created successfully!")
            
    except Exception as e:
        print(f"❌ Error creating health package bookings table: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = migrate_health_package_bookings()
    if success:
        print("🎉 Migration completed successfully!")
    else:
        print("💥 Migration failed!")
        sys.exit(1)
