from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import Patient, Doctor, Appointment, Document
from config import DATABASE_URL
from datetime import datetime, timedelta

fortis_doctors = [
    {
        "name": "Dr. Arjun Mehra",
        "specialization": "Cardiology",
        "contact": "+91-11-4550-0001"
    },
    {
        "name": "Dr. Nisha Kapoor",
        "specialization": "Endocrinology",
        "contact": "+91-11-4550-0002"
    },
    {
        "name": "Dr. Vivek Malhotra",
        "specialization": "Pulmonology",
        "contact": "+91-11-4550-0003"
    },
    {
        "name": "Dr. Alisha Bedi",
        "specialization": "Neurology",
        "contact": "+91-11-4550-0004"
    },
    {
        "name": "Dr. Rehan Suri",
        "specialization": "Orthopaedics",
        "contact": "+91-11-4550-0005"
    },
    {
        "name": "Dr. Priya Anand",
        "specialization": "Gastroenterology",
        "contact": "+91-11-4550-0006"
    }
]

fortis_patients = [
    {
        "name": "Rohit Sharma",
        "age": 52,
        "gender": "Male",
        "diagnosis": "Coronary Artery Disease, Hypertension",
        "medications": "Atorvastatin 40mg daily, Aspirin 81mg daily, Telmisartan 40mg daily",
        "lab_results": "ECG: Stable, Stress Echo: Mild ischemia, BP: 130/85 mmHg",
        "last_visit": datetime.now() - timedelta(days=12)
    },
    {
        "name": "Megha Singh",
        "age": 38,
        "gender": "Female",
        "diagnosis": "Type 2 Diabetes Mellitus",
        "medications": "Metformin 500mg BD, Dapagliflozin 10mg OD",
        "lab_results": "HbA1c: 7.8%, Fasting Glucose: 150 mg/dL",
        "last_visit": datetime.now() - timedelta(days=7)
    },
    {
        "name": "Aditya Narang",
        "age": 29,
        "gender": "Male",
        "diagnosis": "Severe Persistent Asthma",
        "medications": "Budesonide/Formoterol inhaler BID, Montelukast 10mg HS",
        "lab_results": "Spirometry: FEV1 65% predicted, Peak Flow: 320 L/min",
        "last_visit": datetime.now() - timedelta(days=5)
    },
    {
        "name": "Kavya Rao",
        "age": 46,
        "gender": "Female",
        "diagnosis": "Chronic Migraine",
        "medications": "Topiramate 50mg BD, Sumatriptan 50mg PRN",
        "lab_results": "MRI Brain: Normal, Vitamin D: 28 ng/mL",
        "last_visit": datetime.now() - timedelta(days=18)
    }
]

fortis_documents = [
    {
        "title": "Fortis Cardiac Wellness Protocol",
        "content": "Fortis Cardiology Care Pathway:\n\n1. Comprehensive cardiac profiling including ECG, 2D Echo, TMT\n2. Personalized medication titration with regular lipid monitoring\n3. Dietitian-guided heart healthy plans\n4. Fortis cardiac rehab sessions twice weekly\n5. Emergency red flag education for patients and families\n6. Annual CT coronary angiography for high-risk profiles\n7. 24x7 helpline for symptom triage",
        "document_type": "guideline"
    },
    {
        "title": "Fortis Diabetes Lifestyle Blueprint",
        "content": "Fortis Endocrinology Guidelines:\n\n1. Individualized glycemic targets (7-7.5% HbA1c)\n2. Smart glucose monitoring integration with the Fortis Health app\n3. Quarterly nutrition counselling sessions\n4. Pharmacotherapy ladder: Metformin -> SGLT2i/GLP-1 -> Basal insulin\n5. Annual retina, foot, nephropathy screening at Fortis centres\n6. Rapid response plan for hypoglycemia awareness",
        "document_type": "protocol"
    },
    {
        "title": "Fortis Respiratory Action Plan",
        "content": "Fortis Pulmonology Care Guide:\n\n1. Detailed trigger mapping and avoidance counselling\n2. Fortis BreathEase physiotherapy program\n3. Stepwise inhaled therapy with technique reinforcement\n4. Emergency escalation matrix for acute exacerbations\n5. Annual vaccination roadmap (Influenza, Pneumococcal)\n6. Teleconsult follow-ups during pollution spikes\n7. Customised exercise plans with Fortis respiratory therapists",
        "document_type": "guideline"
    }
]

fortis_appointments = [
    {
        "patient_index": 0,
        "doctor_index": 0,
        "date_offset": 4,
        "notes": "Post-angioplasty review and medication optimization"
    },
    {
        "patient_index": 1,
        "doctor_index": 1,
        "date_offset": 6,
        "notes": "CGM data review and nutrition counselling"
    },
    {
        "patient_index": 2,
        "doctor_index": 2,
        "date_offset": 3,
        "notes": "Asthma action plan reinforcement"
    },
    {
        "patient_index": 3,
        "doctor_index": 3,
        "date_offset": 10,
        "notes": "Migraine prophylaxis assessment"
    }
]

def create_sample_data():
    """Create sample data for testing"""
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Create sample patients
        patients = [
            Patient(**patient)
            for patient in fortis_patients
        ]

        # Create sample doctors
        doctors = [
            Doctor(**doctor)
            for doctor in fortis_doctors
        ]

        # Add to database
        for patient in patients:
            db.add(patient)
        for doctor in doctors:
            db.add(doctor)

        db.flush()  # assign IDs

        # Create sample appointments
        appointments = []
        for item in fortis_appointments:
            patient = patients[item["patient_index"]]
            doctor = doctors[item["doctor_index"]]
            appointments.append(
                Appointment(
                    patient_id=patient.id,
                    doctor_id=doctor.id,
                    date=datetime.now() + timedelta(days=item["date_offset"]),
                    status="scheduled",
                    notes=item["notes"]
                )
            )

        for appointment in appointments:
            db.add(appointment)

        # Create sample documents
        documents = [
            Document(**doc)
            for doc in fortis_documents
        ]

        for document in documents:
            db.add(document)

        db.commit()
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
