#!/usr/bin/env python3
"""
Simple script to add doctors, specialties, and time slots to the database
Run this script to populate your database with sample data
"""

import sqlite3
import os
from datetime import datetime

# Database path
DB_PATH = os.path.join('backend', 'healthcare_chatbot.db')

def add_sample_data():
    """Add sample doctors, specialties, and time slots to the database"""
    
    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Add specialties first
        specialties = [
            ('Cardiology', 'Heart and cardiovascular system specialists', '❤️', True),
            ('Neurology', 'Brain and nervous system specialists', '🧠', True),
            ('Pediatrics', 'Children\'s health specialists', '👶', True),
            ('Dermatology', 'Skin, hair, and nail specialists', '🧴', True),
            ('Orthopedics', 'Bone and joint specialists', '🦴', True),
        ]
        
        print("Adding specialties...")
        for specialty in specialties:
            cursor.execute("""
                INSERT OR IGNORE INTO specialities (name, description, icon, is_active, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (*specialty, datetime.now()))
        
        # Add doctors
        doctors = [
            ('Dr. John Smith', 'Cardiology', 1, 'MD, Cardiology', 10, '+1-555-0101', True),
            ('Dr. Sarah Johnson', 'Neurology', 2, 'MD, Neurology', 8, '+1-555-0102', True),
            ('Dr. Mike Brown', 'Pediatrics', 3, 'MD, Pediatrics', 12, '+1-555-0103', True),
            ('Dr. Emily Davis', 'Dermatology', 4, 'MD, Dermatology', 6, '+1-555-0104', True),
            ('Dr. Robert Wilson', 'Orthopedics', 5, 'MD, Orthopedics', 15, '+1-555-0105', True),
        ]
        
        print("Adding doctors...")
        for doctor in doctors:
            cursor.execute("""
                INSERT OR IGNORE INTO doctors (name, specialization, speciality_id, qualification, experience_years, contact, is_available, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (*doctor, datetime.now()))
        
        # Add time slots
        time_slots = [
            # Dr. John Smith (ID 1) - Cardiology
            (1, 0, '09:00', '17:00', 30, True),  # Monday
            (1, 1, '09:00', '17:00', 30, True),  # Tuesday
            (1, 2, '09:00', '17:00', 30, True),  # Wednesday
            (1, 3, '09:00', '17:00', 30, True),  # Thursday
            (1, 4, '09:00', '13:00', 30, True),  # Friday
            
            # Dr. Sarah Johnson (ID 2) - Neurology
            (2, 0, '10:00', '16:00', 45, True),  # Monday
            (2, 2, '10:00', '16:00', 45, True),  # Wednesday
            (2, 4, '10:00', '16:00', 45, True),  # Friday
            
            # Dr. Mike Brown (ID 3) - Pediatrics
            (3, 1, '08:00', '15:00', 30, True),  # Tuesday
            (3, 3, '08:00', '15:00', 30, True),  # Thursday
            (3, 5, '09:00', '14:00', 30, True),  # Saturday
            
            # Dr. Emily Davis (ID 4) - Dermatology
            (4, 0, '09:00', '17:00', 30, True),  # Monday
            (4, 2, '09:00', '17:00', 30, True),  # Wednesday
            (4, 4, '09:00', '17:00', 30, True),  # Friday
            
            # Dr. Robert Wilson (ID 5) - Orthopedics
            (5, 1, '08:00', '17:00', 45, True),  # Tuesday
            (5, 3, '08:00', '17:00', 45, True),  # Thursday
        ]
        
        print("Adding time slots...")
        for slot in time_slots:
            cursor.execute("""
                INSERT OR IGNORE INTO doctor_time_slots (doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available)
                VALUES (?, ?, ?, ?, ?, ?)
            """, slot)
        
        # Commit changes
        conn.commit()
        
        print("\nSUCCESS! Sample data added to database:")
        print(f"Database location: {DB_PATH}")
        print("Added:")
        print("   - 5 Specialties")
        print("   - 5 Doctors")
        print("   - 17 Time slots")
        
        # Show what was added
        cursor.execute("SELECT COUNT(*) FROM specialities")
        spec_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM doctors")
        doc_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM doctor_time_slots")
        slot_count = cursor.fetchone()[0]
        
        print(f"\nCurrent database stats:")
        print(f"   - Specialties: {spec_count}")
        print(f"   - Doctors: {doc_count}")
        print(f"   - Time slots: {slot_count}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("Healthcare Database Populator")
    print("=" * 40)
    
    if not os.path.exists(DB_PATH):
        print(f"ERROR: Database not found at: {DB_PATH}")
        print("Make sure you're running this from the ChatBot root directory")
        exit(1)
    
    add_sample_data()
    print("\nSUCCESS! Your database is now populated with sample data.")
    print("You can now use the admin panel or chatbot with real data.")
