import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';
import { Close, ArrowBack } from '@mui/icons-material';
import SpecialitySelection from './SpecialitySelection';
import DoctorSelection from './DoctorSelection';
import AppointmentBooking from './AppointmentBooking';
import { UI_MESSAGES } from '../config/textConfig';

const AppointmentFlow = ({ open, onClose, patientId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

  const steps = [
    UI_MESSAGES.APPOINTMENT_FLOW.SELECT_SPECIALITY,
    UI_MESSAGES.APPOINTMENT_FLOW.SELECT_DOCTOR,
    UI_MESSAGES.APPOINTMENT_FLOW.BOOK_APPOINTMENT
  ];

  const handleSpecialitySelect = (speciality) => {
    setSelectedSpeciality(speciality);
    setCurrentStep(1);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  const handlePatientCreated = (patient) => {
    setPatientInfo(patient);
  };

  const handleBookingComplete = (result) => {
    // Keep the dialog open to show confirmation
    console.log('Booking completed:', result);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedSpeciality(null);
    setSelectedDoctor(null);
    setPatientInfo(null);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SpecialitySelection
            onSpecialitySelect={handleSpecialitySelect}
            onBack={onClose}
          />
        );
      case 1:
        return (
          <DoctorSelection
            speciality={selectedSpeciality}
            onDoctorSelect={handleDoctorSelect}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <AppointmentBooking
            doctor={selectedDoctor}
            speciality={selectedSpeciality}
            patientId={patientInfo?.id || patientId}
            onPatientCreated={handlePatientCreated}
            onBookingComplete={handleBookingComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '600px'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#1e3c72', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {currentStep > 0 && (
            <IconButton 
              onClick={handleBack} 
              sx={{ color: 'white', mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6">
            {UI_MESSAGES.APPOINTMENT_FLOW.BOOK_APPOINTMENT}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Progress Stepper */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8fafc' }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content */}
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentFlow;
