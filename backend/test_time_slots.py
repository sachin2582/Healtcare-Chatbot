#!/usr/bin/env python3
"""
Test script for time slots functionality
"""

import requests
import json
from datetime import datetime, timedelta

def test_time_slots():
    """Test the time slots endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Time Slots Endpoints...")
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.status_code}")
        if response.status_code != 200:
            print(f"❌ Health check failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return False
    
    # Test 2: Get specialities
    try:
        response = requests.get(f"{base_url}/specialities")
        print(f"✅ Specialities: {response.status_code}")
        if response.status_code == 200:
            specialities = response.json()
            print(f"   Found {len(specialities)} specialities")
    except Exception as e:
        print(f"❌ Specialities failed: {e}")
    
    # Test 3: Get doctors for speciality 1
    try:
        response = requests.get(f"{base_url}/doctors/speciality/1")
        print(f"✅ Doctors for speciality 1: {response.status_code}")
        if response.status_code == 200:
            doctors = response.json()
            print(f"   Found {len(doctors)} doctors")
            if doctors:
                doctor_id = doctors[0]['id']
                print(f"   Testing with doctor ID: {doctor_id}")
                
                # Test 4: Get available slots for this doctor
                test_date = "2025-01-27"  # Monday
                try:
                    response = requests.get(f"{base_url}/doctors/{doctor_id}/available-slots/{test_date}")
                    print(f"✅ Available slots for doctor {doctor_id} on {test_date}: {response.status_code}")
                    if response.status_code == 200:
                        slots_data = response.json()
                        print(f"   Doctor: {slots_data.get('doctor_name', 'Unknown')}")
                        print(f"   Available slots: {len(slots_data.get('available_slots', []))}")
                        for slot in slots_data.get('available_slots', [])[:5]:  # Show first 5 slots
                            print(f"     - {slot['time']} ({'Available' if slot['is_available'] else 'Unavailable'})")
                    else:
                        print(f"❌ Available slots failed: {response.text}")
                except Exception as e:
                    print(f"❌ Available slots request failed: {e}")
        else:
            print(f"❌ Doctors request failed: {response.text}")
    except Exception as e:
        print(f"❌ Doctors request failed: {e}")
    
    print("\n🎯 Test completed!")

if __name__ == "__main__":
    test_time_slots()
