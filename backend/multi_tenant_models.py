# Multi-tenant database modifications
# Add these fields to existing models for multi-client support

from sqlalchemy import Column, String, ForeignKey
from models import Base

# Add to existing models - example modifications:

class Patient(Base):
    # ... existing fields ...
    client_id = Column(String(100), nullable=False, index=True)  # Add this
    
class Doctor(Base):
    # ... existing fields ...
    client_id = Column(String(100), nullable=False, index=True)  # Add this
    
class Appointment(Base):
    # ... existing fields ...
    client_id = Column(String(100), nullable=False, index=True)  # Add this

class HealthPackage(Base):
    # ... existing fields ...
    client_id = Column(String(100), nullable=False, index=True)  # Add this

class ChatButton(Base):
    # ... existing fields ...
    client_id = Column(String(100), nullable=False, index=True)  # Add this

# New model for client management
class Client(Base):
    __tablename__ = "clients"
    
    id = Column(String(100), primary_key=True)  # client_id
    name = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=True)  # Allowed domains
    api_key = Column(String(255), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    config = Column(Text)  # JSON config for branding, colors, etc.
    created_at = Column(DateTime, default=get_local_now)
    updated_at = Column(DateTime, default=get_local_now, onupdate=get_local_now)




