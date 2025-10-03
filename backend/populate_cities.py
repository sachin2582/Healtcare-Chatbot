#!/usr/bin/env python3
"""
Script to populate cities in the database for home collection services
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import City, Base

def populate_cities():
    """Populate cities table with sample data"""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Sample cities data including Chandigarh and surrounding areas
    cities_data = [
        # Major Indian cities
        {"name": "Mumbai", "is_available": True},
        {"name": "Delhi", "is_available": True},
        {"name": "Bangalore", "is_available": True},
        {"name": "Chennai", "is_available": True},
        {"name": "Hyderabad", "is_available": True},
        {"name": "Pune", "is_available": True},
        {"name": "Kolkata", "is_available": True},
        {"name": "Ahmedabad", "is_available": True},
        {"name": "Jaipur", "is_available": True},
        {"name": "Surat", "is_available": True},
        {"name": "Lucknow", "is_available": True},
        {"name": "Kanpur", "is_available": True},
        {"name": "Nagpur", "is_available": True},
        {"name": "Indore", "is_available": True},
        {"name": "Thane", "is_available": True},
        {"name": "Bhopal", "is_available": True},
        {"name": "Visakhapatnam", "is_available": True},
        {"name": "Pimpri-Chinchwad", "is_available": True},
        {"name": "Patna", "is_available": True},
        {"name": "Vadodara", "is_available": True},
        {"name": "Nashik", "is_available": True},
        {"name": "Faridabad", "is_available": True},
        {"name": "Rajkot", "is_available": True},
        {"name": "Kalyan-Dombivali", "is_available": True},
        {"name": "Vasai-Virar", "is_available": True},
        {"name": "Varanasi", "is_available": True},
        
        # Chandigarh and surrounding areas
        {"name": "Chandigarh", "is_available": True},
        {"name": "Mohali", "is_available": True},
        {"name": "Panchkula", "is_available": True},
        {"name": "Zirakpur", "is_available": True},
        {"name": "Kharar", "is_available": True},
        {"name": "Dera Bassi", "is_available": True},
        {"name": "Baddi", "is_available": True},
        {"name": "Nalagarh", "is_available": True},
        {"name": "Pinjore", "is_available": True},
        {"name": "Kalka", "is_available": True},
        {"name": "Parwanoo", "is_available": True},
        {"name": "Solan", "is_available": True},
        {"name": "Shimla", "is_available": True},
        {"name": "Kasauli", "is_available": True},
        {"name": "Dharamshala", "is_available": True},
        {"name": "Palampur", "is_available": True},
        {"name": "Mandi", "is_available": True},
        {"name": "Bilaspur", "is_available": True},
        {"name": "Una", "is_available": True},
        {"name": "Hamirpur", "is_available": True},
        {"name": "Kangra", "is_available": True},
        {"name": "Chamba", "is_available": True},
        {"name": "Sirmaur", "is_available": True},
        {"name": "Kinnaur", "is_available": True},
        {"name": "Lahaul and Spiti", "is_available": False},  # Remote area
        {"name": "Kullu", "is_available": True},
        {"name": "Manali", "is_available": True},
        {"name": "Dalhousie", "is_available": True},
        {"name": "Nahan", "is_available": True},
        {"name": "Paonta Sahib", "is_available": True},
        {"name": "Renuka", "is_available": True},
        {"name": "Sangrur", "is_available": True},
        {"name": "Patiala", "is_available": True},
        {"name": "Ludhiana", "is_available": True},
        {"name": "Jalandhar", "is_available": True},
        {"name": "Amritsar", "is_available": True},
        {"name": "Bathinda", "is_available": True},
        {"name": "Moga", "is_available": True},
        {"name": "Firozpur", "is_available": True},
        {"name": "Gurdaspur", "is_available": True},
        {"name": "Hoshiarpur", "is_available": True},
        {"name": "Kapurthala", "is_available": True},
        {"name": "Muktsar", "is_available": True},
        {"name": "Nawanshahr", "is_available": True},
        {"name": "Rupnagar", "is_available": True},
        {"name": "Sahibzada Ajit Singh Nagar", "is_available": True},
        {"name": "Tarn Taran", "is_available": True},
        {"name": "Fatehgarh Sahib", "is_available": True},
        {"name": "Barnala", "is_available": True},
        {"name": "Faridkot", "is_available": True},
        {"name": "Fazilka", "is_available": True},
        {"name": "Mansa", "is_available": True},
        {"name": "Sri Muktsar Sahib", "is_available": True},
        {"name": "Shahid Bhagat Singh Nagar", "is_available": True},
        
        # Some unavailable cities for testing
        {"name": "Ghaziabad", "is_available": False},
        {"name": "Agra", "is_available": False},
        {"name": "Meerut", "is_available": False},
    ]
    
    db = SessionLocal()
    try:
        # Clear existing cities and repopulate
        existing_cities = db.query(City).count()
        if existing_cities > 0:
            print(f"🗑️  Clearing {existing_cities} existing cities...")
            db.query(City).delete()
            db.commit()
            print("✅ Existing cities cleared.")
        
        # Add cities to database
        for city_data in cities_data:
            city = City(**city_data)
            db.add(city)
        
        db.commit()
        print(f"✅ Successfully populated {len(cities_data)} cities in the database!")
        
        # Show summary
        available_count = db.query(City).filter(City.is_available == True).count()
        unavailable_count = db.query(City).filter(City.is_available == False).count()
        print(f"📊 Summary:")
        print(f"   - Available cities: {available_count}")
        print(f"   - Unavailable cities: {unavailable_count}")
        print(f"   - Total cities: {available_count + unavailable_count}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error populating cities: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🏙️  Populating cities for home collection services...")
    populate_cities()
    print("🎉 City population completed!")
