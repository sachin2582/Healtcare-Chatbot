#!/usr/bin/env python3
"""
Migration script to create health package tables
"""

import sqlite3
import os
from datetime import datetime

def migrate_health_packages():
    """Create health package tables"""
    
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
        print("Creating health packages table...")
        
        # Create health_packages table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS health_packages (
                id INTEGER PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                price INTEGER NOT NULL,
                original_price INTEGER,
                duration_hours INTEGER DEFAULT 2,
                age_group VARCHAR(100) NOT NULL,
                gender_specific VARCHAR(20),
                fasting_required BOOLEAN DEFAULT 0,
                home_collection_available BOOLEAN DEFAULT 1,
                lab_visit_required BOOLEAN DEFAULT 1,
                report_delivery_days INTEGER DEFAULT 1,
                is_active BOOLEAN DEFAULT 1,
                image_url VARCHAR(500),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        print("Creating health_package_tests table...")
        
        # Create health_package_tests table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS health_package_tests (
                id INTEGER PRIMARY KEY,
                package_id INTEGER NOT NULL,
                test_name VARCHAR(255) NOT NULL,
                test_category VARCHAR(100) NOT NULL,
                test_description TEXT,
                is_optional BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (package_id) REFERENCES health_packages (id)
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_health_packages_id ON health_packages (id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_health_packages_is_active ON health_packages (is_active)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_health_package_tests_id ON health_package_tests (id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS ix_health_package_tests_package_id ON health_package_tests (package_id)")
        
        conn.commit()
        print("✅ Health package tables created successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_health_packages()
