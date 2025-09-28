#!/usr/bin/env python3
"""
Migration script to make patient phone number mandatory
"""

import sqlite3
import os
from datetime import datetime

def migrate_phone_mandatory():
    """Migrate patient table to make phone number mandatory"""
    
    db_path = "healthcare_chatbot.db"
    
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found!")
        return
    
    # Create backup
    backup_path = f"healthcare_chatbot_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
    import shutil
    shutil.copy2(db_path, backup_path)
    print(f"Database backed up to: {backup_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if we need to migrate
        cursor.execute("PRAGMA table_info(patients)")
        columns = cursor.fetchall()
        
        # Find phone column
        phone_col = next((col for col in columns if col[1] == 'phone'), None)
        
        if not phone_col:
            print("Phone column not found in patients table!")
            return
        
        # Check if migration is needed (phone is already nullable=False)
        if phone_col[3] == 1:  # 1 means NOT NULL
            print("Migration not needed - phone column is already mandatory")
            return
        
        print("Starting migration to make phone mandatory...")
        
        # First, update any null phone numbers with a default value
        cursor.execute("UPDATE patients SET phone = '0000000000' WHERE phone IS NULL")
        updated_count = cursor.rowcount
        print(f"Updated {updated_count} patients with null phone numbers")
        
        # Create new table with mandatory phone column
        cursor.execute("""
            CREATE TABLE patients_new (
                id INTEGER PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NULL,
                phone VARCHAR(20) NOT NULL,
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(100),
                postal_code VARCHAR(20),
                date_of_birth DATE,
                gender VARCHAR(10) NULL,
                emergency_contact_name VARCHAR(100),
                emergency_contact_phone VARCHAR(20),
                medical_history TEXT,
                allergies TEXT,
                current_medications TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Copy data from old table to new table
        cursor.execute("""
            INSERT INTO patients_new (
                id, first_name, last_name, email, phone, address, city, state,
                postal_code, date_of_birth, gender, emergency_contact_name,
                emergency_contact_phone, medical_history, allergies,
                current_medications, created_at, updated_at
            )
            SELECT 
                id, first_name, last_name, email, phone, address, city, state,
                postal_code, date_of_birth, gender, emergency_contact_name,
                emergency_contact_phone, medical_history, allergies,
                current_medications, created_at, updated_at
            FROM patients
        """)
        
        # Drop old table
        cursor.execute("DROP TABLE patients")
        
        # Rename new table
        cursor.execute("ALTER TABLE patients_new RENAME TO patients")
        
        # Recreate indexes
        cursor.execute("CREATE UNIQUE INDEX ix_patients_email ON patients (email)")
        cursor.execute("CREATE INDEX ix_patients_id ON patients (id)")
        
        conn.commit()
        print("Migration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_phone_mandatory()
