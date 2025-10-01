# Service layer for multi-tenant operations
from sqlalchemy.orm import Session
from models import Patient, Doctor, Appointment, HealthPackage, ChatButton

class TenantService:
    def __init__(self, db: Session, client_id: str):
        self.db = db
        self.client_id = client_id
    
    def get_patients(self):
        return self.db.query(Patient).filter(Patient.client_id == self.client_id).all()
    
    def get_doctors(self):
        return self.db.query(Doctor).filter(Doctor.client_id == self.client_id).all()
    
    def get_appointments(self):
        return self.db.query(Appointment).filter(Appointment.client_id == self.client_id).all()
    
    def get_health_packages(self):
        return self.db.query(HealthPackage).filter(HealthPackage.client_id == self.client_id).all()
    
    def get_chat_buttons(self):
        return self.db.query(ChatButton).filter(ChatButton.client_id == self.client_id).all()
    
    def create_patient(self, patient_data: dict):
        patient_data['client_id'] = self.client_id
        patient = Patient(**patient_data)
        self.db.add(patient)
        self.db.commit()
        return patient
    
    def create_appointment(self, appointment_data: dict):
        appointment_data['client_id'] = self.client_id
        appointment = Appointment(**appointment_data)
        self.db.add(appointment)
        self.db.commit()
        return appointment

# Usage in your FastAPI endpoints:
def get_patients_endpoint(request: Request, db: Session = Depends(get_db)):
    client_id = request.state.client_id
    tenant_service = TenantService(db, client_id)
    return tenant_service.get_patients()




