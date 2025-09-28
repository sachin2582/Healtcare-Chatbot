#!/usr/bin/env python3
"""
Test script for health package booking functionality
"""

import requests
import json

def test_health_package_booking():
    """Test health package booking endpoint"""
    base_url = "http://localhost:8000"
    
    # Test data for booking
    booking_data = {
        "package_id": 1,
        "patient_name": "John Doe",
        "patient_email": "john.doe@example.com",
        "patient_phone": "9876543210",
        "patient_age": 30,
        "patient_gender": "Male",
        "preferred_date": "2025-10-15",
        "preferred_time": "09:00",
        "home_collection": False,
        "notes": "Test booking"
    }
    
    try:
        # Test booking endpoint
        print("Testing health package booking...")
        response = requests.post(
            f"{base_url}/health-packages/book",
            json=booking_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            booking_response = response.json()
            print("✅ Booking successful!")
            print(f"Booking ID: {booking_response['booking_id']}")
            print(f"Confirmation Number: {booking_response['confirmation_number']}")
            print(f"Package: {booking_response['package_name']}")
            print(f"Amount: ₹{booking_response['total_amount']}")
            print(f"Status: {booking_response['status']}")
            
            # Test getting the booking
            booking_id = booking_response['booking_id']
            print(f"\nTesting get booking by ID ({booking_id})...")
            
            get_response = requests.get(f"{base_url}/health-packages/bookings/{booking_id}")
            
            if get_response.status_code == 200:
                booking_details = get_response.json()
                print("✅ Retrieved booking details successfully!")
                print(f"Patient: {booking_details['patient_name']}")
                print(f"Email: {booking_details['patient_email']}")
                print(f"Phone: {booking_details['patient_phone']}")
            else:
                print(f"❌ Failed to get booking: {get_response.status_code} - {get_response.text}")
            
            # Test getting all bookings
            print("\nTesting get all bookings...")
            all_bookings_response = requests.get(f"{base_url}/health-packages/bookings")
            
            if all_bookings_response.status_code == 200:
                all_bookings = all_bookings_response.json()
                print(f"✅ Retrieved {len(all_bookings)} bookings successfully!")
                if all_bookings:
                    latest_booking = all_bookings[0]
                    print(f"Latest booking: {latest_booking['patient_name']} - {latest_booking['confirmation_number']}")
            else:
                print(f"❌ Failed to get all bookings: {all_bookings_response.status_code} - {all_bookings_response.text}")
                
        else:
            print(f"❌ Booking failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing booking: {e}")

if __name__ == "__main__":
    test_health_package_booking()
