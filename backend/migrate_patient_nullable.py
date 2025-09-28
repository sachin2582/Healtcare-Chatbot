#!/usr/bin/env python3
"""
Migration script to make patient email, phone, and gender nullable for appointment booking
"""

import sqlite3
import os
from datetime import datetime

def migrate_patient_schema():
    """Migrate patient table to allow null values for email, phone, and gender"""
    
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
        
        # Find email, phone, and gender columns
        email_col = next((col for col in columns if col[1] == 'email'), None)
        phone_col = next((col for col in columns if col[1] == 'phone'), None)
        gender_col = next((col for col in columns if col[1] == 'gender'), None)
        
        if not email_col or not phone_col or not gender_col:
            print("Required columns not found in patients table!")
            return
        
        # Check if migration is needed
        if email_col[3] == 0 and phone_col[3] == 0 and gender_col[3] == 0:
            print("Migration not needed - columns are already nullable")
            return
        
        print("Starting migration...")
        
        # Create new table with nullable columns
        cursor.execute("""
            CREATE TABLE patients_new (
                id INTEGER PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NULL,
                phone VARCHAR(20) NULL,
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
        
        # Update any existing patients with null emails to have unique emails
        cursor.execute("SELECT id FROM patients WHERE email IS NULL")
        null_email_patients = cursor.fetchall()
        
        for i, (patient_id,) in enumerate(null_email_patients):
            cursor.execute(
                "UPDATE patients SET email = ? WHERE id = ?",
                (f"appointment_{patient_id}@temp.com", patient_id)
            )
        
        conn.commit()
        print("Migration completed successfully!")
        print(f"Updated {len(null_email_patients)} patients with null emails")
        
    except Exception as e:
        conn.rollback()
        print(f"Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_patient_schema()
