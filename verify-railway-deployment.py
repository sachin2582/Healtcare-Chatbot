#!/usr/bin/env python3
"""
Railway Deployment Verification Script
This script verifies that your Railway deployment is working correctly
"""

import requests
import json
import sys
from datetime import datetime

def print_status(message, status="INFO"):
    """Print colored status messages"""
    colors = {
        "INFO": "\033[94m",    # Blue
        "SUCCESS": "\033[92m", # Green
        "ERROR": "\033[91m",   # Red
        "WARNING": "\033[93m"  # Yellow
    }
    reset = "\033[0m"
    print(f"{colors.get(status, '')}[{status}]{reset} {message}")

def test_endpoint(url, endpoint_name, expected_status=200):
    """Test a specific endpoint"""
    try:
        print_status(f"Testing {endpoint_name}...", "INFO")
        response = requests.get(url, timeout=10)
        
        if response.status_code == expected_status:
            print_status(f"✅ {endpoint_name} - Status: {response.status_code}", "SUCCESS")
            return True, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        else:
            print_status(f"❌ {endpoint_name} - Status: {response.status_code}", "ERROR")
            return False, None
    except requests.exceptions.RequestException as e:
        print_status(f"❌ {endpoint_name} - Error: {str(e)}", "ERROR")
        return False, None

def verify_railway_deployment(base_url):
    """Verify Railway deployment"""
    print_status("🚂 Starting Railway Deployment Verification", "INFO")
    print_status(f"Testing base URL: {base_url}", "INFO")
    print("=" * 60)
    
    # Test endpoints
    endpoints = [
        (f"{base_url}/health", "Health Check", 200),
        (f"{base_url}/admin/doctors", "Admin - Doctors API", 200),
        (f"{base_url}/admin/specialities", "Admin - Specialities API", 200),
        (f"{base_url}/admin/time-slots", "Admin - Time Slots API", 200),
        (f"{base_url}/admin/health-packages", "Admin - Health Packages API", 200),
    ]
    
    results = []
    
    for url, name, expected_status in endpoints:
        success, data = test_endpoint(url, name, expected_status)
        results.append((name, success))
        
        if success and data:
            if name == "Health Check":
                print_status(f"   Response: {json.dumps(data, indent=2)}", "SUCCESS")
            elif isinstance(data, list):
                print_status(f"   Found {len(data)} records", "SUCCESS")
            elif isinstance(data, dict):
                print_status(f"   Response received", "SUCCESS")
        
        print()
    
    # Summary
    print("=" * 60)
    print_status("📊 Deployment Verification Summary", "INFO")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print_status(f"{name}: {status}", "SUCCESS" if success else "ERROR")
    
    print()
    if passed == total:
        print_status("🎉 All tests passed! Your Railway deployment is working perfectly!", "SUCCESS")
        print_status("Your healthcare chatbot is ready for production use!", "SUCCESS")
        return True
    else:
        print_status(f"⚠️  {passed}/{total} tests passed. Some issues detected.", "WARNING")
        print_status("Check Railway dashboard logs for more details.", "WARNING")
        return False

def main():
    """Main function"""
    if len(sys.argv) != 2:
        print_status("Usage: python verify-railway-deployment.py <your-railway-url>", "ERROR")
        print_status("Example: python verify-railway-deployment.py https://your-app.railway.app", "ERROR")
        sys.exit(1)
    
    base_url = sys.argv[1].rstrip('/')
    
    print_status("Healthcare Chatbot - Railway Deployment Verifier", "INFO")
    print_status(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", "INFO")
    print()
    
    success = verify_railway_deployment(base_url)
    
    if success:
        print()
        print_status("🎯 Next Steps:", "INFO")
        print_status("1. Deploy your frontend to Vercel", "INFO")
        print_status("2. Update CORS settings in Railway", "INFO")
        print_status("3. Test the complete application", "INFO")
        print_status("4. Share your demo with healthcare clients!", "INFO")
        sys.exit(0)
    else:
        print()
        print_status("🔧 Troubleshooting Steps:", "INFO")
        print_status("1. Check Railway dashboard for deployment status", "INFO")
        print_status("2. Verify environment variables are set", "INFO")
        print_status("3. Check Railway logs for error messages", "INFO")
        print_status("4. Ensure database is connected", "INFO")
        sys.exit(1)

if __name__ == "__main__":
    main()
