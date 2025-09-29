#!/usr/bin/env python3
"""
Migration script to create chat_buttons table and populate with default buttons
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import Base, ChatButton
from timezone_utils import get_local_now

def create_chat_buttons_table():
    """Create the chat_buttons table"""
    print("Creating chat_buttons table...")
    Base.metadata.create_all(bind=engine, tables=[ChatButton.__table__])
    print("chat_buttons table created successfully")

def populate_default_buttons():
    """Populate the chat_buttons table with default buttons"""
    print("Populating default chat buttons...")
    
    db = SessionLocal()
    try:
        # Check if buttons already exist
        existing_buttons = db.query(ChatButton).count()
        if existing_buttons > 0:
            print(f"{existing_buttons} buttons already exist, skipping population")
            return
        
        default_buttons = [
            {
                "button_text": "Book Appointment",
                "button_action": "appointment",
                "button_value": "book_appointment",
                "button_icon": "calendar_today",
                "button_color": "primary",
                "button_variant": "contained",
                "display_order": 1,
                "is_active": True,
                "category": "booking",
                "description": "Book a doctor appointment"
            },
            {
                "button_text": "Health Checkup",
                "button_action": "health_package",
                "button_value": "health_package_booking",
                "button_icon": "local_hospital",
                "button_color": "secondary",
                "button_variant": "contained",
                "display_order": 2,
                "is_active": True,
                "category": "booking",
                "description": "Book a health checkup package"
            },
            {
                "button_text": "Request Callback",
                "button_action": "callback",
                "button_value": "request_callback",
                "button_icon": "phone_callback",
                "button_color": "success",
                "button_variant": "contained",
                "display_order": 3,
                "is_active": True,
                "category": "support",
                "description": "Request a callback from our team"
            },
            {
                "button_text": "View Packages",
                "button_action": "custom",
                "button_value": "view_packages",
                "button_icon": "list_alt",
                "button_color": "info",
                "button_variant": "outlined",
                "display_order": 4,
                "is_active": True,
                "category": "info",
                "description": "View available health packages"
            },
            {
                "button_text": "Emergency",
                "button_action": "custom",
                "button_value": "emergency_contact",
                "button_icon": "emergency",
                "button_color": "error",
                "button_variant": "contained",
                "display_order": 5,
                "is_active": True,
                "category": "emergency",
                "description": "Emergency contact information"
            },
            {
                "button_text": "Find Doctors",
                "button_action": "custom",
                "button_value": "find_doctors",
                "button_icon": "search",
                "button_color": "primary",
                "button_variant": "outlined",
                "display_order": 6,
                "is_active": True,
                "category": "info",
                "description": "Search for doctors by specialty"
            }
        ]
        
        for button_data in default_buttons:
            button = ChatButton(**button_data)
            db.add(button)
        
        db.commit()
        print(f"{len(default_buttons)} default buttons created successfully")
        
    except Exception as e:
        db.rollback()
        print(f"Error populating default buttons: {str(e)}")
        raise
    finally:
        db.close()

def main():
    """Main migration function"""
    print("Starting chat buttons migration...")
    
    try:
        create_chat_buttons_table()
        populate_default_buttons()
        print("Chat buttons migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
