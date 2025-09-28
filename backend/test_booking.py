#!/usr/bin/env python3
"""
Test script to verify booking functionality and slot availability
"""

import requests
import json
from datetime import datetime, timedelta

def test_booking_flow():
    """Test the complete booking flow"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Booking Flow...")
    
    # Test 1: Get available slots before booking
    doctor_id = 7
    test_date = "2025-01-27"  # Monday
    
    print(f"\n1️⃣ Getting available slots for doctor {doctor_id} on {test_date}...")
    try:
        response = requests.get(f"{base_url}/test-time-slots/{doctor_id}/{test_date}")
        if response.status_code == 200:
            slots_before = response.json()
            print(f"   ✅ Found {len(slots_before['available_slots'])} slots")
            available_before = [slot for slot in slots_before['available_slots'] if slot['is_available']]
            print(f"   📊 Available slots: {len(available_before)}")
            
            # Show first few available slots
            for slot in available_before[:5]:
                print(f"      - {slot['time']} ({'Available' if slot['is_available'] else 'Booked'})")
        else:
            print(f"   ❌ Failed to get slots: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # Test 2: Book an appointment
    if available_before:
        test_time = available_before[0]['time']
        print(f"\n2️⃣ Booking appointment for {test_time}...")
        
        booking_data = {
            "patient_id": 1,
            "doctor_id": doctor_id,
            "preferred_date": test_date,
            "preferred_time": test_time,
            "reason": "Test appointment",
            "notes": "Testing booking functionality"
        }
        
        try:
            response = requests.post(f"{base_url}/appointments/book", json=booking_data)
            if response.status_code == 200:
                booking_result = response.json()
                print(f"   ✅ Appointment booked successfully!")
                print(f"   📋 Confirmation: {booking_result.get('confirmation_number', 'N/A')}")
            else:
                print(f"   ❌ Booking failed: {response.text}")
                return
        except Exception as e:
            print(f"   ❌ Booking error: {e}")
            return
    else:
        print("   ⚠️ No available slots to book")
        return
    
    # Test 3: Check slots after booking
    print(f"\n3️⃣ Checking slots after booking...")
    try:
        response = requests.get(f"{base_url}/test-time-slots/{doctor_id}/{test_date}")
        if response.status_code == 200:
            slots_after = response.json()
            available_after = [slot for slot in slots_after['available_slots'] if slot['is_available']]
            print(f"   📊 Available slots after booking: {len(available_after)}")
            
            # Check if the booked slot is now unavailable
            booked_slot = next((slot for slot in slots_after['available_slots'] if slot['time'] == test_time), None)
            if booked_slot:
                if not booked_slot['is_available']:
                    print(f"   ✅ Booked slot {test_time} is now correctly marked as unavailable")
                else:
                    print(f"   ❌ Booked slot {test_time} is still showing as available!")
            else:
                print(f"   ⚠️ Could not find slot {test_time} in results")
        else:
            print(f"   ❌ Failed to get slots after booking: {response.text}")
    except Exception as e:
        print(f"   ❌ Error checking slots after booking: {e}")
    
    print("\n🎯 Test completed!")

if __name__ == "__main__":
    test_booking_flow()
