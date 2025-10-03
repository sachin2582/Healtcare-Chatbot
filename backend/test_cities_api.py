#!/usr/bin/env python3
"""
Test script to verify cities API is working with updated database
"""

import requests
import json

def test_cities_api():
    """Test the cities API endpoint"""
    try:
        # Test health endpoint first
        print("Testing health endpoint...")
        health_response = requests.get("http://localhost:8000/health")
        print(f"Health status: {health_response.status_code}")
        
        # Test cities endpoint
        print("\nTesting cities endpoint...")
        cities_response = requests.get("http://localhost:8000/cities")
        print(f"Cities status: {cities_response.status_code}")
        
        if cities_response.status_code == 200:
            data = cities_response.json()
            print(f"Total cities: {len(data)}")
            
            # Check specific cities
            test_cities = ['Nagpur', 'Agra', 'Chandigarh', 'Ghaziabad']
            print("\nTest cities status:")
            for city_name in test_cities:
                city = next((c for c in data if c['name'] == city_name), None)
                if city:
                    print(f"  {city['name']}: {city['is_available']} (Type: {type(city['is_available'])})")
                else:
                    print(f"  {city_name}: Not found")
                    
            print("\nCities with is_available = false:")
            unavailable = [c for c in data if c['is_available'] == False]
            for city in unavailable[:5]:  # Show first 5
                print(f"  {city['id']}: {city['name']} - Available: {city['is_available']}")
            print(f"Total unavailable: {len(unavailable)}")
        else:
            print(f"Error: {cities_response.status_code} - {cities_response.text}")
            
    except Exception as e:
        print(f"Error testing API: {e}")

if __name__ == "__main__":
    test_cities_api()
