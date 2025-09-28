import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import { Person } from '@mui/icons-material';
import patientService from '../services/patientService';

const PatientInfoForm = ({ onPatientCreated, onBack, existingPatient = null }) => {
  const [formData, setFormData] = useState({
    first_name: existingPatient?.first_name || '',
    last_name: existingPatient?.last_name || '',
    phone: existingPatient?.phone || '',
    // Allow null values for appointment booking - will be filled later
    email: existingPatient?.email || null,
    gender: existingPatient?.gender || null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Basic validation - require first name, last name, and phone number
    if (!formData.first_name || !formData.last_name || !formData.phone) {
      setError('Please fill in all required fields (First Name, Last Name, Phone Number)');
      return;
    }

    // Phone number validation
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Phone number must have at least 10 digits');
      return;
    }
    if (phoneDigits.length > 15) {
      setError('Phone number cannot have more than 15 digits');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result;
      if (existingPatient) {
        // Update existing patient
        result = await patientService.updatePatient(existingPatient.id, formData);
        setSuccess('Patient information updated successfully!');
      } else {
        // Create new patient
        result = await patientService.createPatient(formData);
        setSuccess('Patient information saved successfully!');
      }

      if (onPatientCreated) {
        onPatientCreated(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to save patient information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', color: '#1e3c72' }}>
        {existingPatient ? 'Update Patient Information' : 'Patient Information for Appointment'}
      </Typography>

      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            {/* Essential Information Section */}
            <Typography variant="h6" sx={{ mb: 2, color: '#1e3c72', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> Essential Information
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please provide the following information to book your appointment:
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name *"
                  value={formData.first_name}
                  onChange={handleChange('first_name')}
                  required
                  placeholder="Enter your first name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
                  value={formData.last_name}
                  onChange={handleChange('last_name')}
                  required
                  placeholder="Enter your last name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  required
                  placeholder="Enter your phone number (e.g., +1-555-123-4567)"
                  helperText="We'll use this to contact you about your appointment. Must have at least 10 digits."
                  inputProps={{
                    pattern: "[0-9\\+\\-\\(\\)\\s]*",
                    title: "Enter a valid phone number with at least 10 digits"
                  }}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {onBack && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onBack}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ ml: 'auto' }}
              >
                {loading ? <CircularProgress size={24} /> : (existingPatient ? 'Update Information' : 'Continue to Booking')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientInfoForm;
