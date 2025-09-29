import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  Avatar,
  Grid,
  CircularProgress,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { LocalHospital, Person, Schedule } from '@mui/icons-material';
import appointmentService from '../services/appointmentService';
import PatientInfoForm from './PatientInfoForm';

const AppointmentBooking = ({ doctor, speciality, patientId, onPatientCreated, onBookingComplete, onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [patientInfo, setPatientInfo] = useState(null);

  // Load available slots when date changes
  const loadAvailableSlots = useCallback(async () => {
    if (!selectedDate || !doctor?.id) {
      setAvailableSlots([]);
      setSelectedTime('');
      return;
    }

    try {
      setLoadingSlots(true);
      setError(null);
      const slotsData = await appointmentService.getAvailableSlots(doctor.id, selectedDate);
      setAvailableSlots(slotsData.available_slots || []);
    } catch (err) {
      console.error('Error loading available slots:', err);
      const errorMessage = err?.message || err?.toString() || 'Unknown error';
      setError(`Failed to load available time slots: ${errorMessage}`);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, doctor?.id]);

  useEffect(() => {
    loadAvailableSlots();
  }, [loadAvailableSlots]);

  const handlePatientCreated = (patient) => {
    setPatientInfo(patient);
    if (onPatientCreated) {
      onPatientCreated(patient);
    }
    setActiveTab(1); // Switch to booking tab
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time for your appointment.');
      return;
    }

    if (!patientInfo && !patientId) {
      setError('Please provide patient information before booking.');
      setActiveTab(0); // Switch to patient info tab
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingData = {
        patient_id: patientInfo?.id || patientId,
        doctor_id: doctor.id,
        preferred_date: selectedDate,
        preferred_time: selectedTime,
        reason: reason,
        notes: notes
      };

      const result = await appointmentService.bookAppointment(bookingData);
      setSuccess(result);
      
      // Refresh available slots after successful booking
      await loadAvailableSlots();
      
      onBookingComplete(result);
    } catch (err) {
      const errorMessage = err?.message || err?.toString() || 'Failed to book appointment. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', color: '#1e3c72' }}>
        Book Appointment
      </Typography>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab 
            icon={<Person />} 
            label="Patient Information" 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab 
            icon={<Schedule />} 
            label="Schedule Appointment" 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 ? (
        // Patient Information Tab
        <PatientInfoForm
          onPatientCreated={handlePatientCreated}
          onBack={onBack}
        />
      ) : (
        // Appointment Booking Tab
        <Box>

        {/* Doctor Information */}
        <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  src={doctor.image_url}
                  sx={{ width: 60, height: 60, bgcolor: '#1e3c72' }}
                >
                  <LocalHospital />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6" sx={{ color: '#1e3c72', fontWeight: 600 }}>
                  {doctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {speciality.name} • {doctor.qualification}
                </Typography>
                {doctor.experience_years && (
                  <Typography variant="body2" color="text.secondary">
                    {doctor.experience_years} years experience
                  </Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card sx={{ position: 'relative' }}>
          {success && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(76, 175, 80, 0.05)',
              zIndex: 1,
              pointerEvents: 'none',
              borderRadius: 1
            }} />
          )}
          <CardContent sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Select Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={success}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>
              
                     {/* Time selection is now handled by the visual chips below */}

                     {/* Available Time Slots Display */}
                     {selectedDate && (
                       <Grid item xs={12}>
                         <Typography variant="h6" sx={{ mb: 2, color: '#1e3c72', fontWeight: 600 }}>
                           Select Your Preferred Time
                         </Typography>
                         
                         {/* Legend */}
                         <Box sx={{ 
                           display: 'flex', 
                           gap: 2, 
                           mb: 2, 
                           flexWrap: 'wrap',
                           justifyContent: 'center'
                         }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Box sx={{ 
                               width: 20, 
                               height: 20, 
                               backgroundColor: '#e3f2fd', 
                               border: '1px solid #2196f3',
                               borderRadius: 1
                             }} />
                             <Typography variant="caption" color="text.secondary">
                               Available
                             </Typography>
                           </Box>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Box sx={{ 
                               width: 20, 
                               height: 20, 
                               backgroundColor: '#1e3c72', 
                               border: '2px solid #1e3c72',
                               borderRadius: 1
                             }} />
                             <Typography variant="caption" color="text.secondary">
                               Selected
                             </Typography>
                           </Box>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Box sx={{ 
                               width: 20, 
                               height: 20, 
                               backgroundColor: '#ffebee', 
                               border: '1px solid #f44336',
                               borderRadius: 1,
                               position: 'relative'
                             }}>
                               <Box sx={{
                                 position: 'absolute',
                                 top: -2,
                                 right: -2,
                                 width: 8,
                                 height: 8,
                                 backgroundColor: '#f44336',
                                 borderRadius: '50%',
                                 fontSize: '6px',
                                 color: 'white',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center'
                               }}>
                                 ✕
                               </Box>
                             </Box>
                             <Typography variant="caption" color="text.secondary">
                               Booked
                             </Typography>
                           </Box>
                         </Box>
                         
                         {loadingSlots ? (
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                             <CircularProgress size={20} />
                             <Typography variant="body2" color="text.secondary">
                               Loading available time slots...
                             </Typography>
                           </Box>
                         ) : availableSlots.length > 0 ? (
                           <Box sx={{ 
                             display: 'grid', 
                             gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                             gap: 1.5,
                             mb: 2
                           }}>
                             {availableSlots.map((slot) => {
                               const isSelected = selectedTime === slot.time;
                               const isBooked = !slot.is_available;
                               
                               return (
                                 <Box key={slot.time} sx={{ position: 'relative' }}>
                                   <Chip
                                     label={
                                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                         <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                           {slot.time}
                                         </Typography>
                                         {isBooked && (
                                           <Typography variant="caption" sx={{ fontSize: '10px' }}>
                                             ✕
                                           </Typography>
                                         )}
                                       </Box>
                                     }
                                     onClick={() => !isBooked && !success && setSelectedTime(slot.time)}
                                     sx={{
                                       height: 48,
                                       fontSize: '14px',
                                       fontWeight: 600,
                                       cursor: (isBooked || success) ? 'not-allowed' : 'pointer',
                                       opacity: isBooked ? 0.6 : 1,
                                       backgroundColor: isSelected 
                                         ? '#1e3c72' 
                                         : isBooked 
                                           ? '#ffebee' 
                                           : '#e3f2fd',
                                       color: isSelected 
                                         ? '#ffffff' 
                                         : isBooked 
                                           ? '#d32f2f' 
                                           : '#1e3c72',
                                       border: isSelected 
                                         ? '2px solid #1e3c72' 
                                         : isBooked 
                                           ? '1px solid #f44336' 
                                           : '1px solid #2196f3',
                                       '&:hover': {
                                         backgroundColor: isBooked 
                                           ? '#ffebee' 
                                           : isSelected 
                                             ? '#1e3c72' 
                                             : '#bbdefb',
                                         transform: isBooked ? 'none' : 'translateY(-2px)',
                                         boxShadow: isBooked ? 'none' : '0 4px 12px rgba(33, 150, 243, 0.3)',
                                       },
                                       transition: 'all 0.2s ease-in-out',
                                       width: '100%',
                                       justifyContent: 'center',
                                     }}
                                   />
                                   {isBooked && (
                                     <Box
                                       sx={{
                                         position: 'absolute',
                                         top: -2,
                                         right: -2,
                                         width: 16,
                                         height: 16,
                                         backgroundColor: '#f44336',
                                         borderRadius: '50%',
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         fontSize: '10px',
                                         color: 'white',
                                         fontWeight: 'bold',
                                       }}
                                     >
                                       ✕
                                     </Box>
                                   )}
                                 </Box>
                               );
                             })}
                           </Box>
                         ) : (
                           <Box sx={{ 
                             textAlign: 'center', 
                             py: 3, 
                             border: '2px dashed #e0e0e0', 
                             borderRadius: 2,
                             backgroundColor: '#fafafa'
                           }}>
                             <Typography variant="body1" color="text.secondary">
                               No available time slots for this date
                             </Typography>
                             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                               Please select a different date
                             </Typography>
                           </Box>
                         )}
                         
                         {selectedTime && (
                           <Box sx={{ 
                             mt: 2, 
                             p: 2, 
                             backgroundColor: '#e8f5e8', 
                             borderRadius: 2,
                             border: '1px solid #4caf50'
                           }}>
                             <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                               ✓ Selected Time: {selectedTime}
                             </Typography>
                           </Box>
                         )}
                       </Grid>
                     )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reason for Visit (Optional)"
                  multiline
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe the reason for your appointment"
                  disabled={success}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes (Optional)"
                  multiline
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information you'd like to share"
                  disabled={success}
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Appointment Booked Successfully!
                </Typography>
                <Typography variant="body2">
                  <strong>Confirmation Number:</strong> {success.confirmation_number}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {success.appointment_date}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {success.appointment_time}
                </Typography>
                <Typography variant="body2">
                  <strong>Doctor:</strong> {success.doctor_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Speciality:</strong> {success.speciality}
                </Typography>
              </Alert>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={onBack} disabled={loading || success}>
                Back to Doctors
              </Button>
              <Button 
                variant="contained" 
                onClick={handleBooking}
                disabled={loading || !selectedDate || !selectedTime || success}
                sx={{ 
                  bgcolor: success ? '#4caf50' : '#1e3c72',
                  '&:hover': { bgcolor: success ? '#4caf50' : '#2a5298' }
                }}
              >
                {loading ? <CircularProgress size={24} /> : success ? 'Appointment Booked!' : 'Book Appointment'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentBooking;
