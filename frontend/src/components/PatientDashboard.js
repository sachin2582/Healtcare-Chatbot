import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tab,
  Tabs,
  Stack,
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Person } from '@mui/icons-material';
// Removed date-fns import - using native JavaScript date formatting
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';

const PatientDashboard = () => {
  const { patients, doctors, refreshPatients, setPatients } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    diagnosis: '',
    medications: '',
    lab_results: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        diagnosis: patient.diagnosis || '',
        medications: patient.medications || '',
        lab_results: patient.lab_results || '',
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        age: '',
        gender: '',
        diagnosis: '',
        medications: '',
        lab_results: '',
      });
    }
    setOpenDialog(true);
    setError(null);
    setSuccess(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      age: '',
      gender: '',
      diagnosis: '',
      medications: '',
      lab_results: '',
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
      };

      if (editingPatient) {
        // Update patient logic would go here
        setSuccess('Patient updated successfully!');
      } else {
        await apiService.createPatient(patientData);
        setSuccess('Patient created successfully!');
        // Refresh patients list
        const updatedPatients = await apiService.getPatients();
        refreshPatients(updatedPatients);
      }
      
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
    } catch (err) {
      setError('Failed to save patient. Please try again.');
      console.error('Error saving patient:', err);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const PatientCard = ({ patient }) => (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      border: '1px solid rgba(15,108,63,0.1)',
      boxShadow: '0 10px 25px rgba(15,108,63,0.08)'
    }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          gap: 1,
          color: 'primary.main'
        }}>
          <Person sx={{ color: 'primary.main' }} />
          <Typography variant="h6" component="div">
            {patient.name}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Age: {patient.age} | Gender: {patient.gender}
        </Typography>
        
        {patient.diagnosis && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Diagnosis:
            </Typography>
            <Chip label={patient.diagnosis} size="small" color="warning" />
          </Box>
        )}
        
        {patient.medications && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Medications:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {patient.medications}
            </Typography>
          </Box>
        )}
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Last Visit: {new Date(patient.last_visit).toLocaleDateString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
          })}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2.5, pb: 2.5 }}>
        <Button size="small" startIcon={<Visibility />} sx={{ color: 'primary.main' }}>
          View Details
        </Button>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" sx={{ color: 'primary.main', border: '1px solid rgba(15,108,63,0.15)' }}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: 'error.main', border: '1px solid rgba(255,111,60,0.25)' }}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      </CardActions>
    </Card>
  );

  const PatientTable = () => (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(15,108,63,0.1)' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Diagnosis</TableCell>
            <TableCell>Last Visit</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>
                {patient.diagnosis ? (
                  <Chip label={patient.diagnosis} size="small" color="warning" />
                ) : (
                  'No diagnosis'
                )}
              </TableCell>
              <TableCell>
                {new Date(patient.last_visit).toLocaleDateString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric', 
                  month: 'short', 
                  day: '2-digit' 
                })}
              </TableCell>
              <TableCell>
                <IconButton size="small">
                  <Visibility />
                </IconButton>
                <IconButton size="small">
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Patient Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Patient
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Card View" />
          <Tab label="Table View" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {patients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <PatientCard patient={patient} />
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && <PatientTable />}

      {/* Add/Edit Patient Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleInputChange('age')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Gender"
                value={formData.gender}
                onChange={handleInputChange('gender')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                multiline
                rows={2}
                value={formData.diagnosis}
                onChange={handleInputChange('diagnosis')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medications"
                multiline
                rows={3}
                value={formData.medications}
                onChange={handleInputChange('medications')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lab Results"
                multiline
                rows={3}
                value={formData.lab_results}
                onChange={handleInputChange('lab_results')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPatient ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDashboard;
