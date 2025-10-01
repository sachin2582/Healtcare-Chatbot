import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  Schedule as ScheduleIcon,
  LocalHospital as PackageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const CompleteAdminPanel = () => {
  const [currentTab, setCurrentTab] = useState(0);
  
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [healthPackages, setHealthPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // API Configuration
  const API_BASE = 'http://localhost:8000';

  // Utility functions
  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Data loading functions
  const loadDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE}/doctors`);
      if (!response.ok) throw new Error('Failed to fetch doctors');
      return await response.json();
    } catch (error) {
      console.error('Error loading doctors:', error);
      return [];
    }
  };

  const loadSpecialties = async () => {
    try {
      const response = await fetch(`${API_BASE}/specialities`);
      if (!response.ok) throw new Error('Failed to fetch specialties');
      return await response.json();
    } catch (error) {
      console.error('Error loading specialties:', error);
      return [];
    }
  };

  const loadTimeSlots = async (doctors) => {
    try {
      const promises = doctors.map(doctor => 
        fetch(`${API_BASE}/doctors/${doctor.id}/time-slots`)
          .then(response => response.ok ? response.json() : [])
          .catch(() => [])
      );
      const results = await Promise.all(promises);
      return results.flat();
    } catch (error) {
      console.error('Error loading time slots:', error);
      return [];
    }
  };

  const loadHealthPackages = async () => {
    try {
      const response = await fetch(`${API_BASE}/health-packages`);
      if (!response.ok) throw new Error('Failed to fetch health packages');
      return await response.json();
    } catch (error) {
      console.error('Error loading health packages:', error);
      return [];
    }
  };

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [doctorsData, specialtiesData, packagesData] = await Promise.all([
        loadDoctors(),
        loadSpecialties(),
        loadHealthPackages()
      ]);

      const timeSlotsData = await loadTimeSlots(doctorsData);

      setDoctors(doctorsData);
      setSpecialties(specialtiesData);
      setTimeSlots(timeSlotsData);
      setHealthPackages(packagesData);

      console.log('Data loaded successfully:', {
        doctors: doctorsData.length,
        specialties: specialtiesData.length,
        timeSlots: timeSlotsData.length,
        packages: packagesData.length
      });

    } catch (err) {
      console.error('Error loading data:', err);
      showError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const createDoctor = async (data) => {
    try {
      console.log('Creating doctor with data:', data);
      const response = await fetch(`${API_BASE}/doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to create doctor: ${response.status} - ${errorText}`);
      }
      const result = await response.json();
      console.log('Doctor created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw new Error('Error creating doctor: ' + error.message);
    }
  };

  const updateDoctor = async (id, data) => {
    try {
      const response = await fetch(`${API_BASE}/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update doctor');
      return await response.json();
    } catch (error) {
      throw new Error('Error updating doctor: ' + error.message);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/doctors/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete doctor');
    } catch (error) {
      throw new Error('Error deleting doctor: ' + error.message);
    }
  };

  const createSpecialty = async (data) => {
    try {
      console.log('Creating specialty with data:', data);
      const response = await fetch(`${API_BASE}/specialities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Specialty response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Specialty response error:', errorText);
        throw new Error(`Failed to create specialty: ${response.status} - ${errorText}`);
      }
      const result = await response.json();
      console.log('Specialty created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating specialty:', error);
      throw new Error('Error creating specialty: ' + error.message);
    }
  };

  const updateSpecialty = async (id, data) => {
    try {
      const response = await fetch(`${API_BASE}/specialities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update specialty');
      return await response.json();
    } catch (error) {
      throw new Error('Error updating specialty: ' + error.message);
    }
  };

  const deleteSpecialty = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/specialities/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete specialty');
    } catch (error) {
      throw new Error('Error deleting specialty: ' + error.message);
    }
  };

  // Time Slot Operations
  const createTimeSlot = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/doctor-time-slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create time slot');
      return await response.json();
    } catch (error) {
      throw new Error('Error creating time slot: ' + error.message);
    }
  };

  const updateTimeSlot = async (id, data) => {
    try {
      const response = await fetch(`${API_BASE}/doctor-time-slots/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update time slot');
      return await response.json();
    } catch (error) {
      throw new Error('Error updating time slot: ' + error.message);
    }
  };

  const deleteTimeSlot = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/doctor-time-slots/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete time slot');
      return await response.json();
    } catch (error) {
      throw new Error('Error deleting time slot: ' + error.message);
    }
  };

  const toggleTimeSlot = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/doctor-time-slots/${id}/toggle`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to toggle time slot');
      return await response.json();
    } catch (error) {
      throw new Error('Error toggling time slot: ' + error.message);
    }
  };

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    console.log('handleOpenDialog called with:', { type, item });
    setDialogType(type);
    setEditingItem(item);
    const defaultData = getDefaultFormData(type);
    const finalData = item ? { ...defaultData, ...item } : defaultData;
    setFormData(finalData);
    setOpenDialog(true);
    console.log('Dialog opened:', { type, item, defaultData, finalData });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({});
    setDialogType('');
  };

  const getDefaultFormData = (type) => {
    switch (type) {
      case 'doctor':
        return {
          name: '',
          specialization: '',
          qualification: '',
          experience_years: '',
          contact: '',
          is_available: true
        };
      case 'specialty':
        return {
          name: '',
          description: '',
          icon: '',
          is_active: true
        };
      case 'timeslot':
        return {
          doctor_id: '',
          day_of_week: 0,
          start_time: '09:00',
          end_time: '17:00',
          slot_duration_minutes: 30,
          is_available: true
        };
      default:
        return {};
    }
  };

  const handleSave = async () => {
    try {
      console.log('handleSave called with:', { dialogType, formData, editingItem });
      setLoading(true);
      
      // Validate required fields
      if (dialogType === 'doctor') {
        if (!formData.name || !formData.specialization) {
          showError('Name and specialization are required');
          setLoading(false);
          return;
        }
        console.log('Doctor validation passed');
      } else if (dialogType === 'specialty') {
        if (!formData.name) {
          showError('Specialty name is required');
          setLoading(false);
          return;
        }
        console.log('Specialty validation passed');
      } else if (dialogType === 'timeslot') {
        if (!formData.doctor_id || formData.day_of_week === undefined || !formData.start_time || !formData.end_time || !formData.slot_duration_minutes) {
          showError('Doctor, day, start time, end time, and duration are required');
          setLoading(false);
          return;
        }
        console.log('Time slot validation passed');
      }
      
      if (dialogType === 'doctor') {
        if (editingItem) {
          await updateDoctor(editingItem.id, formData);
          showSuccess('Doctor updated successfully!');
        } else {
          await createDoctor(formData);
          showSuccess('Doctor created successfully!');
        }
      } else if (dialogType === 'specialty') {
        if (editingItem) {
          await updateSpecialty(editingItem.id, formData);
          showSuccess('Specialty updated successfully!');
        } else {
          await createSpecialty(formData);
          showSuccess('Specialty created successfully!');
        }
      } else if (dialogType === 'timeslot') {
        if (editingItem) {
          await updateTimeSlot(editingItem.id, formData);
          showSuccess('Time slot updated successfully!');
        } else {
          await createTimeSlot(formData);
          showSuccess('Time slot created successfully!');
        }
      }
      
      await loadAllData();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      setLoading(true);
      
      if (type === 'doctor') {
        await deleteDoctor(id);
        showSuccess('Doctor deleted successfully!');
      } else if (type === 'specialty') {
        await deleteSpecialty(id);
        showSuccess('Specialty deleted successfully!');
      } else if (type === 'timeslot') {
        await deleteTimeSlot(id);
        showSuccess('Time slot deleted successfully!');
      }
      
      await loadAllData();
    } catch (err) {
      console.error('Error deleting:', err);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Render functions
  const renderDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        📊 Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">{doctors.length}</Typography>
              <Typography variant="body2">Total Doctors</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="secondary">{specialties.length}</Typography>
              <Typography variant="body2">Total Specialties</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">{healthPackages.length}</Typography>
              <Typography variant="body2">Health Packages</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">{timeSlots.length}</Typography>
              <Typography variant="body2">Time Slots</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderDoctors = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">👨‍⚕️ Doctor Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            console.log('Add Doctor button clicked');
            handleOpenDialog('doctor');
          }}
          disabled={loading}
        >
          Add Doctor
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.qualification || '-'}</TableCell>
                <TableCell>{doctor.experience_years ? `${doctor.experience_years} years` : '-'}</TableCell>
                <TableCell>{doctor.contact || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={doctor.is_available ? 'Available' : 'Unavailable'} 
                    color={doctor.is_available ? 'success' : 'error'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog('doctor', doctor)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete('doctor', doctor.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderSpecialties = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">🏥 Specialty Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            console.log('Add Specialty button clicked');
            handleOpenDialog('specialty');
          }}
          disabled={loading}
        >
          Add Specialty
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Icon</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.map((specialty) => (
              <TableRow key={specialty.id}>
                <TableCell>{specialty.icon || '🏥'}</TableCell>
                <TableCell>{specialty.name}</TableCell>
                <TableCell sx={{ maxWidth: 200, wordWrap: 'break-word' }}>{specialty.description || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={specialty.is_active ? 'Active' : 'Inactive'} 
                    color={specialty.is_active ? 'success' : 'error'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog('specialty', specialty)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete('specialty', specialty.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderTimeSlots = () => (
    <Box>
      <Typography variant="h5" gutterBottom>⏰ Time Slot Management</Typography>
      <Box display="flex" gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog('timeslot')}
          disabled={loading}
        >
          Add Time Slot
        </Button>
        <Button
          variant="outlined"
          onClick={loadAllData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      {timeSlots.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    {doctors.find(d => d.id === slot.doctor_id)?.name || `Doctor ${slot.doctor_id}`}
                  </TableCell>
                  <TableCell>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][slot.day_of_week]}
                  </TableCell>
                  <TableCell>{slot.start_time}</TableCell>
                  <TableCell>{slot.end_time}</TableCell>
                  <TableCell>{slot.slot_duration_minutes} min</TableCell>
                  <TableCell>
                    <Chip 
                      label={slot.is_available ? 'Available' : 'Blocked'} 
                      color={slot.is_available ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog('timeslot', slot)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={async () => {
                        try {
                          await toggleTimeSlot(slot.id);
                          showSuccess(`Time slot ${slot.is_available ? 'blocked' : 'activated'} successfully!`);
                          await loadAllData();
                        } catch (err) {
                          showError(err.message);
                        }
                      }} 
                      size="small"
                      color={slot.is_available ? 'error' : 'success'}
                    >
                      {slot.is_available ? '🚫' : '✅'}
                    </IconButton>
                    <IconButton onClick={() => handleDelete('timeslot', slot.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No time slots found. Click "Add Time Slot" to create new slots.
        </Typography>
      )}
    </Box>
  );

  const renderHealthPackages = () => (
    <Box>
      <Typography variant="h5" gutterBottom>📦 Health Package Management</Typography>
      {healthPackages.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Original Price</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Age Group</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {healthPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell sx={{ maxWidth: 200, wordWrap: 'break-word' }}>{pkg.description?.substring(0, 50)}...</TableCell>
                  <TableCell>₹{pkg.price}</TableCell>
                  <TableCell>{pkg.original_price ? `₹${pkg.original_price}` : '-'}</TableCell>
                  <TableCell>{pkg.duration_hours} hrs</TableCell>
                  <TableCell>{pkg.age_group}</TableCell>
                  <TableCell>
                    <Chip 
                      label={pkg.is_active ? 'Active' : 'Inactive'} 
                      color={pkg.is_active ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No health packages found.
        </Typography>
      )}
    </Box>
  );

  const renderDialog = () => (
    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingItem ? 'Edit' : 'Add'} {
          dialogType === 'doctor' ? 'Doctor' : 
          dialogType === 'specialty' ? 'Specialty' : 
          dialogType === 'timeslot' ? 'Time Slot' : ''
        }
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Current form data: {JSON.stringify(formData, null, 2)}
        </Typography>
        {dialogType === 'doctor' && (
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Doctor Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Specialization"
              value={formData.specialization || ''}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Qualification"
              value={formData.qualification || ''}
              onChange={(e) => setFormData({...formData, qualification: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Experience (years)"
              type="number"
              value={formData.experience_years || ''}
              onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value)})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact"
              value={formData.contact || ''}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_available || false}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                />
              }
              label="Available"
            />
          </Box>
        )}
        {dialogType === 'specialty' && (
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Fill out the specialty information below:
            </Typography>
            <TextField
              fullWidth
              label="Specialty Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              margin="normal"
              multiline
              rows={3}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Icon (emoji)"
              value={formData.icon || ''}
              onChange={(e) => setFormData({...formData, icon: e.target.value})}
              margin="normal"
              variant="outlined"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active || false}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
              }
              label="Active"
            />
          </Box>
        )}
        {dialogType === 'timeslot' && (
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctor_id || ''}
                onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                required
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={formData.day_of_week || 0}
                onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
                required
              >
                <MenuItem value={0}>Monday</MenuItem>
                <MenuItem value={1}>Tuesday</MenuItem>
                <MenuItem value={2}>Wednesday</MenuItem>
                <MenuItem value={3}>Thursday</MenuItem>
                <MenuItem value={4}>Friday</MenuItem>
                <MenuItem value={5}>Saturday</MenuItem>
                <MenuItem value={6}>Sunday</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={formData.start_time || '09:00'}
              onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Time"
              type="time"
              value={formData.end_time || '17:00'}
              onChange={(e) => setFormData({...formData, end_time: e.target.value})}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Slot Duration (minutes)"
              type="number"
              value={formData.slot_duration_minutes || 30}
              onChange={(e) => setFormData({...formData, slot_duration_minutes: parseInt(e.target.value)})}
              margin="normal"
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_available || true}
                  onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                />
              }
              label="Available"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button 
          onClick={() => {
            console.log('Save button clicked');
            handleSave();
          }} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : (editingItem ? 'Update' : 'Add')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏥 Healthcare Admin Panel
          </Typography>
          <Button
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={loadAllData}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            color="inherit"
            onClick={async () => {
              try {
                console.log('Testing API connection...');
                const response = await fetch('http://localhost:8000/health');
                const data = await response.json();
                console.log('API test result:', data);
                showSuccess('✅ API connection working! Backend is running.');
              } catch (err) {
                console.error('API test failed:', err);
                showError('❌ API connection failed: ' + err.message);
              }
            }}
          >
            Test API
          </Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="admin tabs">
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<PeopleIcon />} label="Doctors" />
          <Tab icon={<MedicalIcon />} label="Specialties" />
          <Tab icon={<ScheduleIcon />} label="Time Slots" />
          <Tab icon={<PackageIcon />} label="Packages" />
        </Tabs>
      </Box>
      
      <Box sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        
        <Paper sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading data...</Typography>
            </Box>
          ) : (
            <>
              {currentTab === 0 && renderDashboard()}
              {currentTab === 1 && renderDoctors()}
              {currentTab === 2 && renderSpecialties()}
              {currentTab === 3 && renderTimeSlots()}
              {currentTab === 4 && renderHealthPackages()}
            </>
          )}
        </Paper>
      </Box>

      {renderDialog()}
    </Box>
  );
};

export default CompleteAdminPanel;
