#!/usr/bin/env python3
"""
Database migration script to create the callback_requests table
"""

from sqlalchemy import create_engine, text
from config import DATABASE_URL

def migrate_callback_requests():
    """Create the callback_requests table"""
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # SQL to create callback_requests table
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS callback_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mobile_number VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        preferred_time VARCHAR(50),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        contacted_at DATETIME,
        executive_notes TEXT
    );
    """
    
    # Create indexes for better performance
    create_indexes_sql = [
        "CREATE INDEX IF NOT EXISTS idx_callback_requests_status ON callback_requests(status);",
        "CREATE INDEX IF NOT EXISTS idx_callback_requests_created_at ON callback_requests(created_at);"
    ]
    
    try:
        with engine.connect() as connection:
            # Create the table
            connection.execute(text(create_table_sql))
            connection.commit()
            print("✅ callback_requests table created successfully!")
            
            # Create indexes
            for index_sql in create_indexes_sql:
                connection.execute(text(index_sql))
            connection.commit()
            print("✅ Indexes created successfully!")
            
    except Exception as e:
        print(f"❌ Error creating callback_requests table: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Starting callback_requests table migration...")
    success = migrate_callback_requests()
    
    if success:
        print("🎉 Migration completed successfully!")
    else:
        print("💥 Migration failed!")
