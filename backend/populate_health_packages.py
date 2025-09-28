#!/usr/bin/env python3
"""
Script to populate health packages with Fortis Healthcare style packages
"""

from database import SessionLocal
from models import HealthPackage, HealthPackageTest
from datetime import datetime

# Fortis Healthcare style health packages
fortis_health_packages = [
    {
        "name": "Basic Health Checkup",
        "description": "Essential health screening for general wellness and early detection of common health issues.",
        "price": 1500,
        "original_price": 2000,
        "duration_hours": 2,
        "age_group": "18-40",
        "gender_specific": None,
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 1,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Blood Sugar (Fasting)", "test_category": "Blood Test", "test_description": "Measures fasting blood glucose levels", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Urine Routine", "test_category": "Urine Test", "test_description": "Basic urine analysis", "is_optional": False},
            {"test_name": "ECG", "test_category": "Cardiac", "test_description": "Electrocardiogram for heart health", "is_optional": False},
            {"test_name": "Chest X-Ray", "test_category": "Imaging", "test_description": "Chest X-ray for lung health", "is_optional": False},
        ]
    },
    {
        "name": "Executive Health Package",
        "description": "Comprehensive health assessment for working professionals with advanced screening tests.",
        "price": 3500,
        "original_price": 4500,
        "duration_hours": 3,
        "age_group": "25-50",
        "gender_specific": None,
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 1,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Blood Sugar (Fasting & PP)", "test_category": "Blood Test", "test_description": "Fasting and post-prandial blood glucose", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Liver Function Test", "test_category": "Blood Test", "test_description": "Liver enzyme and function tests", "is_optional": False},
            {"test_name": "Kidney Function Test", "test_category": "Blood Test", "test_description": "Creatinine, urea, and kidney function", "is_optional": False},
            {"test_name": "Thyroid Function Test", "test_category": "Blood Test", "test_description": "TSH, T3, T4 levels", "is_optional": False},
            {"test_name": "Vitamin B12 & D", "test_category": "Blood Test", "test_description": "Vitamin deficiency screening", "is_optional": False},
            {"test_name": "Urine Routine", "test_category": "Urine Test", "test_description": "Basic urine analysis", "is_optional": False},
            {"test_name": "ECG", "test_category": "Cardiac", "test_description": "Electrocardiogram for heart health", "is_optional": False},
            {"test_name": "Chest X-Ray", "test_category": "Imaging", "test_description": "Chest X-ray for lung health", "is_optional": False},
            {"test_name": "Ultrasound Abdomen", "test_category": "Imaging", "test_description": "Abdominal organ screening", "is_optional": False},
            {"test_name": "Eye Checkup", "test_category": "Specialist", "test_description": "Basic eye examination", "is_optional": False},
        ]
    },
    {
        "name": "Women's Health Package",
        "description": "Comprehensive health screening specifically designed for women's health needs.",
        "price": 2800,
        "original_price": 3500,
        "duration_hours": 3,
        "age_group": "18-65",
        "gender_specific": "Female",
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 1,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Blood Sugar (Fasting)", "test_category": "Blood Test", "test_description": "Fasting blood glucose levels", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Thyroid Function Test", "test_category": "Blood Test", "test_description": "TSH, T3, T4 levels", "is_optional": False},
            {"test_name": "Iron Studies", "test_category": "Blood Test", "test_description": "Iron, ferritin, TIBC levels", "is_optional": False},
            {"test_name": "Vitamin D", "test_category": "Blood Test", "test_description": "Vitamin D deficiency screening", "is_optional": False},
            {"test_name": "Pap Smear", "test_category": "Gynecological", "test_description": "Cervical cancer screening", "is_optional": False},
            {"test_name": "Breast Examination", "test_category": "Gynecological", "test_description": "Clinical breast examination", "is_optional": False},
            {"test_name": "Urine Routine", "test_category": "Urine Test", "test_description": "Basic urine analysis", "is_optional": False},
            {"test_name": "ECG", "test_category": "Cardiac", "test_description": "Electrocardiogram for heart health", "is_optional": False},
            {"test_name": "Bone Density Scan", "test_category": "Imaging", "test_description": "DEXA scan for osteoporosis", "is_optional": True},
        ]
    },
    {
        "name": "Senior Citizen Health Package",
        "description": "Comprehensive health screening for senior citizens with age-specific tests and monitoring.",
        "price": 4500,
        "original_price": 5500,
        "duration_hours": 4,
        "age_group": "60+",
        "gender_specific": None,
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 2,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Blood Sugar (Fasting & PP)", "test_category": "Blood Test", "test_description": "Fasting and post-prandial blood glucose", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Liver Function Test", "test_category": "Blood Test", "test_description": "Liver enzyme and function tests", "is_optional": False},
            {"test_name": "Kidney Function Test", "test_category": "Blood Test", "test_description": "Creatinine, urea, and kidney function", "is_optional": False},
            {"test_name": "Thyroid Function Test", "test_category": "Blood Test", "test_description": "TSH, T3, T4 levels", "is_optional": False},
            {"test_name": "Cardiac Markers", "test_category": "Blood Test", "test_description": "Troponin, CK-MB for heart health", "is_optional": False},
            {"test_name": "Vitamin B12 & D", "test_category": "Blood Test", "test_description": "Vitamin deficiency screening", "is_optional": False},
            {"test_name": "Urine Routine", "test_category": "Urine Test", "test_description": "Basic urine analysis", "is_optional": False},
            {"test_name": "ECG", "test_category": "Cardiac", "test_description": "Electrocardiogram for heart health", "is_optional": False},
            {"test_name": "Echocardiogram", "test_category": "Cardiac", "test_description": "Heart ultrasound", "is_optional": False},
            {"test_name": "Chest X-Ray", "test_category": "Imaging", "test_description": "Chest X-ray for lung health", "is_optional": False},
            {"test_name": "Ultrasound Abdomen", "test_category": "Imaging", "test_description": "Abdominal organ screening", "is_optional": False},
            {"test_name": "Eye Checkup", "test_category": "Specialist", "test_description": "Comprehensive eye examination", "is_optional": False},
            {"test_name": "Bone Density Scan", "test_category": "Imaging", "test_description": "DEXA scan for osteoporosis", "is_optional": True},
        ]
    },
    {
        "name": "Diabetic Care Package",
        "description": "Specialized health monitoring package for diabetic patients with comprehensive glucose and complication screening.",
        "price": 2200,
        "original_price": 2800,
        "duration_hours": 2,
        "age_group": "All Ages",
        "gender_specific": None,
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 1,
        "tests": [
            {"test_name": "HbA1c", "test_category": "Blood Test", "test_description": "3-month average blood sugar", "is_optional": False},
            {"test_name": "Blood Sugar (Fasting & PP)", "test_category": "Blood Test", "test_description": "Fasting and post-prandial blood glucose", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Kidney Function Test", "test_category": "Blood Test", "test_description": "Creatinine, urea, and kidney function", "is_optional": False},
            {"test_name": "Microalbumin", "test_category": "Urine Test", "test_description": "Early kidney damage detection", "is_optional": False},
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "ECG", "test_category": "Cardiac", "test_description": "Electrocardiogram for heart health", "is_optional": False},
            {"test_name": "Eye Checkup", "test_category": "Specialist", "test_description": "Diabetic retinopathy screening", "is_optional": False},
            {"test_name": "Foot Examination", "test_category": "Specialist", "test_description": "Diabetic foot screening", "is_optional": False},
        ]
    },
    {
        "name": "Cardiac Health Package",
        "description": "Comprehensive cardiac screening package for heart health assessment and risk evaluation.",
        "price": 5500,
        "original_price": 7000,
        "duration_hours": 4,
        "age_group": "35+",
        "gender_specific": None,
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 2,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Cardiac Markers", "test_category": "Blood Test", "test_description": "Troponin, CK-MB for heart health", "is_optional": False},
            {"test_name": "CRP (High Sensitivity)", "test_category": "Blood Test", "test_description": "Inflammation marker for heart disease", "is_optional": False},
            {"test_name": "Homocysteine", "test_category": "Blood Test", "test_description": "Heart disease risk marker", "is_optional": False},
            {"test_name": "ECG", "test_category": "Cardiac", "test_description": "Electrocardiogram for heart health", "is_optional": False},
            {"test_name": "Echocardiogram", "test_category": "Cardiac", "test_description": "Heart ultrasound", "is_optional": False},
            {"test_name": "Treadmill Test", "test_category": "Cardiac", "test_description": "Stress test for heart function", "is_optional": False},
            {"test_name": "Chest X-Ray", "test_category": "Imaging", "test_description": "Chest X-ray for lung health", "is_optional": False},
            {"test_name": "CT Calcium Score", "test_category": "Imaging", "test_description": "Coronary artery calcium screening", "is_optional": True},
        ]
    },
    {
        "name": "Thyroid Health Package",
        "description": "Comprehensive thyroid function assessment with detailed hormonal analysis and imaging.",
        "price": 1800,
        "original_price": 2200,
        "duration_hours": 2,
        "age_group": "All Ages",
        "gender_specific": None,
        "fasting_required": False,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 1,
        "tests": [
            {"test_name": "TSH (Thyroid Stimulating Hormone)", "test_category": "Blood Test", "test_description": "Primary thyroid function test", "is_optional": False},
            {"test_name": "T3 (Triiodothyronine)", "test_category": "Blood Test", "test_description": "Active thyroid hormone", "is_optional": False},
            {"test_name": "T4 (Thyroxine)", "test_category": "Blood Test", "test_description": "Main thyroid hormone", "is_optional": False},
            {"test_name": "Free T3", "test_category": "Blood Test", "test_description": "Unbound T3 hormone", "is_optional": False},
            {"test_name": "Free T4", "test_category": "Blood Test", "test_description": "Unbound T4 hormone", "is_optional": False},
            {"test_name": "Anti-TPO", "test_category": "Blood Test", "test_description": "Thyroid peroxidase antibodies", "is_optional": False},
            {"test_name": "Anti-TG", "test_category": "Blood Test", "test_description": "Thyroglobulin antibodies", "is_optional": False},
            {"test_name": "Thyroid Ultrasound", "test_category": "Imaging", "test_description": "Thyroid gland imaging", "is_optional": False},
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
        ]
    },
    {
        "name": "Pre-Marital Health Package",
        "description": "Comprehensive health screening for couples planning to get married with genetic and health compatibility tests.",
        "price": 3200,
        "original_price": 4000,
        "duration_hours": 3,
        "age_group": "18-45",
        "gender_specific": None,
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 2,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Blood Sugar (Fasting)", "test_category": "Blood Test", "test_description": "Fasting blood glucose levels", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Liver Function Test", "test_category": "Blood Test", "test_description": "Liver enzyme and function tests", "is_optional": False},
            {"test_name": "Kidney Function Test", "test_category": "Blood Test", "test_description": "Creatinine, urea, and kidney function", "is_optional": False},
            {"test_name": "Thyroid Function Test", "test_category": "Blood Test", "test_description": "TSH, T3, T4 levels", "is_optional": False},
            {"test_name": "Hepatitis B & C", "test_category": "Blood Test", "test_description": "Hepatitis virus screening", "is_optional": False},
            {"test_name": "HIV Screening", "test_category": "Blood Test", "test_description": "HIV virus screening", "is_optional": False},
            {"test_name": "VDRL", "test_category": "Blood Test", "test_description": "Syphilis screening", "is_optional": False},
            {"test_name": "Blood Group & Rh Factor", "test_category": "Blood Test", "test_description": "Blood type and Rh compatibility", "is_optional": False},
            {"test_name": "Urine Routine", "test_category": "Urine Test", "test_description": "Basic urine analysis", "is_optional": False},
            {"test_name": "ECG", "test_category": "Cardiac", "test_description": "Electrocardiogram for heart health", "is_optional": False},
            {"test_name": "Chest X-Ray", "test_category": "Imaging", "test_description": "Chest X-ray for lung health", "is_optional": False},
            {"test_name": "Genetic Counseling", "test_category": "Specialist", "test_description": "Genetic compatibility consultation", "is_optional": True},
        ]
    },
    {
        "name": "Child Health Package",
        "description": "Comprehensive health screening package designed specifically for children with age-appropriate tests.",
        "price": 1200,
        "original_price": 1500,
        "duration_hours": 1,
        "age_group": "0-18",
        "gender_specific": None,
        "fasting_required": False,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 1,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Blood Sugar (Random)", "test_category": "Blood Test", "test_description": "Random blood glucose levels", "is_optional": False},
            {"test_name": "Iron Studies", "test_category": "Blood Test", "test_description": "Iron, ferritin levels", "is_optional": False},
            {"test_name": "Vitamin D", "test_category": "Blood Test", "test_description": "Vitamin D deficiency screening", "is_optional": False},
            {"test_name": "Urine Routine", "test_category": "Urine Test", "test_description": "Basic urine analysis", "is_optional": False},
            {"test_name": "Stool Routine", "test_category": "Stool Test", "test_description": "Basic stool analysis", "is_optional": False},
            {"test_name": "Growth Assessment", "test_category": "Specialist", "test_description": "Height, weight, BMI evaluation", "is_optional": False},
            {"test_name": "Eye Checkup", "test_category": "Specialist", "test_description": "Basic eye examination", "is_optional": False},
            {"test_name": "Dental Checkup", "test_category": "Specialist", "test_description": "Basic dental examination", "is_optional": False},
            {"test_name": "Immunization Review", "test_category": "Specialist", "test_description": "Vaccination status review", "is_optional": False},
        ]
    },
    {
        "name": "Weight Management Package",
        "description": "Comprehensive health assessment for weight management with metabolic and hormonal analysis.",
        "price": 2500,
        "original_price": 3200,
        "duration_hours": 3,
        "age_group": "18-60",
        "gender_specific": None,
        "fasting_required": True,
        "home_collection_available": True,
        "lab_visit_required": False,
        "report_delivery_days": 1,
        "tests": [
            {"test_name": "Complete Blood Count (CBC)", "test_category": "Blood Test", "test_description": "Measures different components of blood", "is_optional": False},
            {"test_name": "Blood Sugar (Fasting & PP)", "test_category": "Blood Test", "test_description": "Fasting and post-prandial blood glucose", "is_optional": False},
            {"test_name": "Lipid Profile", "test_category": "Blood Test", "test_description": "Cholesterol and triglyceride levels", "is_optional": False},
            {"test_name": "Liver Function Test", "test_category": "Blood Test", "test_description": "Liver enzyme and function tests", "is_optional": False},
            {"test_name": "Kidney Function Test", "test_category": "Blood Test", "test_description": "Creatinine, urea, and kidney function", "is_optional": False},
            {"test_name": "Thyroid Function Test", "test_category": "Blood Test", "test_description": "TSH, T3, T4 levels", "is_optional": False},
            {"test_name": "Insulin Levels", "test_category": "Blood Test", "test_description": "Fasting insulin and insulin resistance", "is_optional": False},
            {"test_name": "Vitamin B12 & D", "test_category": "Blood Test", "test_description": "Vitamin deficiency screening", "is_optional": False},
            {"test_name": "Body Composition Analysis", "test_category": "Specialist", "test_description": "BMR, muscle mass, fat percentage", "is_optional": False},
            {"test_name": "Nutritional Counseling", "test_category": "Specialist", "test_description": "Diet and nutrition consultation", "is_optional": False},
            {"test_name": "Exercise Physiology", "test_category": "Specialist", "test_description": "Fitness assessment and planning", "is_optional": True},
        ]
    }
]

def populate_health_packages():
    """Populate health packages with Fortis Healthcare style data"""
    
    db = SessionLocal()
    
    try:
        # Clear existing health packages
        db.query(HealthPackageTest).delete()
        db.query(HealthPackage).delete()
        db.commit()
        
        print("Creating health packages...")
        
        for package_data in fortis_health_packages:
            # Extract tests data
            tests_data = package_data.pop('tests')
            
            # Create health package
            package = HealthPackage(**package_data)
            db.add(package)
            db.flush()  # Get the package ID
            
            print(f"Created package: {package.name}")
            
            # Create tests for this package
            for test_data in tests_data:
                test = HealthPackageTest(
                    package_id=package.id,
                    **test_data
                )
                db.add(test)
            
            print(f"  Added {len(tests_data)} tests")
        
        db.commit()
        print(f"\n✅ Successfully created {len(fortis_health_packages)} health packages!")
        
    except Exception as e:
        print(f"❌ Error creating health packages: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    populate_health_packages()
