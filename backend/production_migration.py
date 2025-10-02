#!/usr/bin/env python3
"""
Production Database Migration Script
This script handles database migration for production deployment
"""

import os
import sys
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import Base
from config import DATABASE_URL, IS_PRODUCTION

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_database_connection():
    """Test database connection"""
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("✅ Database connection successful")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False

def create_tables():
    """Create all database tables"""
    try:
        engine = create_engine(DATABASE_URL)
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        return False

def check_table_exists(table_name):
    """Check if a table exists in the database"""
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text(f"""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = '{table_name}'
                );
            """))
            return result.scalar()
    except Exception as e:
        logger.error(f"❌ Failed to check table {table_name}: {e}")
        return False

def get_table_count(table_name):
    """Get the number of records in a table"""
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            return result.scalar()
    except Exception as e:
        logger.error(f"❌ Failed to get count for table {table_name}: {e}")
        return 0

def populate_demo_data():
    """Populate database with demo data"""
    try:
        from add_data_to_database import main as populate_main
        populate_main()
        logger.info("✅ Demo data populated successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to populate demo data: {e}")
        return False

def verify_data():
    """Verify that data was populated correctly"""
    tables_to_check = [
        'doctors',
        'specialities', 
        'doctor_time_slots',
        'health_packages',
        'patients'
    ]
    
    logger.info("🔍 Verifying database data...")
    
    for table in tables_to_check:
        count = get_table_count(table)
        logger.info(f"📊 Table '{table}': {count} records")
        
        if count == 0:
            logger.warning(f"⚠️  Table '{table}' is empty")

def main():
    """Main migration function"""
    logger.info("🚀 Starting production database migration...")
    
    # Load environment variables
    load_dotenv()
    
    # Check environment
    if IS_PRODUCTION:
        logger.info("🌍 Running in PRODUCTION environment")
    else:
        logger.info("🔧 Running in DEVELOPMENT environment")
    
    # Test database connection
    if not test_database_connection():
        logger.error("❌ Cannot proceed without database connection")
        sys.exit(1)
    
    # Create tables
    if not create_tables():
        logger.error("❌ Cannot proceed without database tables")
        sys.exit(1)
    
    # Check if data already exists
    doctors_count = get_table_count('doctors')
    if doctors_count > 0:
        logger.info(f"📊 Database already contains {doctors_count} doctors")
        response = input("Do you want to repopulate the database? (y/N): ")
        if response.lower() != 'y':
            logger.info("⏭️  Skipping data population")
            verify_data()
            return
    
    # Populate demo data
    if not populate_demo_data():
        logger.error("❌ Failed to populate demo data")
        sys.exit(1)
    
    # Verify data
    verify_data()
    
    logger.info("🎉 Production database migration completed successfully!")

if __name__ == "__main__":
    main()
