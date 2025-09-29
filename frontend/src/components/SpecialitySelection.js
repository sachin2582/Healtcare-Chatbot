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
  CardActionArea
} from '@mui/material';
import appointmentService from '../services/appointmentService';

const SpecialitySelection = ({ onSpecialitySelect, onBack }) => {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSpecialities();
  }, []);

  const loadSpecialities = async () => {
    try {
      console.log('🚀 Starting to load specialities...');
      setLoading(true);
      setError(null);
      
      const data = await appointmentService.getSpecialities();
      console.log('📊 Specialities loaded successfully:', data);
      setSpecialities(data);
    } catch (err) {
      console.error('❌ Error loading specialities:', err);
      const errorMessage = err?.message || err?.toString() || 'Unknown error';
      setError(`Failed to load specialities: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialityClick = (speciality) => {
    onSpecialitySelect(speciality);
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
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', color: '#1e3c72' }}>
        Select a Medical Speciality
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
        Choose the medical speciality you need for your appointment
      </Typography>

      <Grid container spacing={2}>
        {specialities.map((speciality) => (
          <Grid item xs={12} sm={6} md={4} key={speciality.id}>
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
                onClick={() => handleSpecialityClick(speciality)}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    {speciality.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1, color: '#1e3c72', fontWeight: 600 }}>
                    {speciality.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {speciality.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {onBack && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="outlined" onClick={onBack}>
            Back to Main Menu
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SpecialitySelection;
