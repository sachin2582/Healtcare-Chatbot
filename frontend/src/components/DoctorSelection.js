import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  Rating
} from '@mui/material';
import { LocalHospital, Star, Work } from '@mui/icons-material';
import appointmentService from '../services/appointmentService';

const DoctorSelection = ({ speciality, onDoctorSelect, onBack }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (speciality) {
      loadDoctors();
    }
  }, [speciality]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getDoctorsBySpeciality(speciality.id);
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors. Please try again.');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorClick = (doctor) => {
    onDoctorSelect(doctor);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 1, textAlign: 'center', color: '#1e3c72' }}>
        {speciality.icon} {speciality.name} Specialists
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
        Select a doctor for your appointment
      </Typography>

      {doctors.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No doctors available for this speciality at the moment.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleDoctorClick(doctor)}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={doctor.image_url}
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mx: 'auto', 
                        mb: 2,
                        bgcolor: '#1e3c72',
                        fontSize: '2rem'
                      }}
                    >
                      <LocalHospital />
                    </Avatar>
                    
                    <Typography variant="h6" sx={{ mb: 1, color: '#1e3c72', fontWeight: 600 }}>
                      {doctor.name}
                    </Typography>
                    
                    {doctor.qualification && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {doctor.qualification}
                      </Typography>
                    )}
                    
                    {doctor.experience_years && (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <Work sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.experience_years} years experience
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Rating value={4.5} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        4.5 (120 reviews)
                      </Typography>
                    </Box>
                    
                    <Chip 
                      label="Available" 
                      color="success" 
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="outlined" onClick={onBack}>
          Back to Specialities
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorSelection;
