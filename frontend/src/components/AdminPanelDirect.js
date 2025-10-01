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
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  Schedule as ScheduleIcon,
  LocalHospital as PackageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { adminService } from '../services/adminService';

const AdminPanelDirect = () => {
  const [currentTab, setCurrentTab] = useState(0);
  
  // Data states
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [healthPackages, setHealthPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Load data from API using working endpoints
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get doctors and specialties first
      const [doctorsResponse, specialtiesResponse, packagesResponse] = await Promise.all([
        fetch('http://localhost:8000/doctors'),
        fetch('http://localhost:8000/specialities'),
        fetch('http://localhost:8000/health-packages')
      ]);
      
      if (!doctorsResponse.ok) throw new Error('Failed to fetch doctors');
      if (!specialtiesResponse.ok) throw new Error('Failed to fetch specialties');
      
      const doctorsData = await doctorsResponse.json();
      const specialtiesData = await specialtiesResponse.json();
      const packagesData = packagesResponse.ok ? await packagesResponse.json() : [];
      
      // Get time slots for all doctors
      const timeSlotsPromises = doctorsData.map(doctor => 
        fetch(`http://localhost:8000/doctors/${doctor.id}/time-slots`)
          .then(response => response.ok ? response.json() : [])
          .catch(() => [])
      );
      
      const allTimeSlotsArrays = await Promise.all(timeSlotsPromises);
      const timeSlotsData = allTimeSlotsArrays.flat();
      
      setDoctors(doctorsData || []);
      setSpecialties(specialtiesData || []);
      setTimeSlots(timeSlotsData || []);
      setHealthPackages(packagesData || []);
      
      console.log('Loaded data:', {
        doctors: doctorsData?.length || 0,
        specialties: specialtiesData?.length || 0,
        timeSlots: timeSlotsData?.length || 0,
        packages: packagesData?.length || 0
      });
      
    } catch (err) {
      console.error('Error loading data:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Backend server is not running. Please start the backend server on port 8000.');
      } else {
        setError('Failed to load data from server: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Fallback data if backend is not available
  const getFallbackData = () => {
    return {
      doctors: [
        { id: 1, name: 'Dr. John Smith', specialization: 'Cardiology', qualification: 'MBBS, MD', experience: 10, contact: '+1-555-0123', is_available: true },
        { id: 2, name: 'Dr. Sarah Johnson', specialization: 'Pediatrics', qualification: 'MBBS, DCH', experience: 8, contact: '+1-555-0124', is_available: true }
      ],
      specialties: [
        { id: 1, name: 'Cardiology', description: 'Heart and cardiovascular system', icon: '❤️', is_active: true },
        { id: 2, name: 'Pediatrics', description: 'Medical care for infants and children', icon: '👶', is_active: true }
      ],
      timeSlots: [],
      packages: []
    };
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setDialogType('');
  };

  const handleSave = async (data) => {
    try {
      setLoading(true);
      if (dialogType === 'doctor') {
        if (editingItem) {
          // Update doctor - using PUT request
          const response = await fetch(`http://localhost:8000/doctors/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Failed to update doctor');
        } else {
          // Create doctor - using POST request
          const response = await fetch('http://localhost:8000/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Failed to create doctor');
        }
      } else if (dialogType === 'specialty') {
        if (editingItem) {
          // Update specialty - using PUT request
          const response = await fetch(`http://localhost:8000/specialities/${editingItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Failed to update specialty');
        } else {
          // Create specialty - using POST request
          const response = await fetch('http://localhost:8000/specialities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Failed to create specialty');
        }
      }
      await loadData(); // Reload data from server
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Failed to save data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      setLoading(true);
      if (type === 'doctor') {
        const response = await fetch(`http://localhost:8000/doctors/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete doctor');
      } else if (type === 'specialty') {
        const response = await fetch(`http://localhost:8000/specialities/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete specialty');
      }
      await loadData(); // Reload data from server
    } catch (err) {
      console.error('Error deleting data:', err);
      setError('Failed to delete data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              📊 Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4">{doctors.length}</Typography>
                    <Typography variant="body2">Total Doctors</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4">{specialties.length}</Typography>
                    <Typography variant="body2">Total Specialties</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4">{healthPackages.length}</Typography>
                    <Typography variant="body2">Health Packages</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4">{timeSlots.length}</Typography>
                    <Typography variant="body2">Time Slots</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                👨‍⚕️ Doctor Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('doctor')}
              >
                Add Doctor
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
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
                      <TableCell>{doctor.qualification}</TableCell>
                      <TableCell>{doctor.experience} years</TableCell>
                      <TableCell>{doctor.contact}</TableCell>
                      <TableCell>
                        <Chip 
                          label={doctor.is_available ? 'Available' : 'Unavailable'} 
                          color={doctor.is_available ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog('doctor', doctor)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete('doctor', doctor.id)}>
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
      case 2:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                🏥 Specialty Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('specialty')}
              >
                Add Specialty
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
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
                      <TableCell>{specialty.icon}</TableCell>
                      <TableCell>{specialty.name}</TableCell>
                      <TableCell>{specialty.description}</TableCell>
                      <TableCell>
                        <Chip 
                          label={specialty.is_active ? 'Active' : 'Inactive'} 
                          color={specialty.is_active ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog('specialty', specialty)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete('specialty', specialty.id)}>
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
      case 3:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              ⏰ Time Slot Management
            </Typography>
            {timeSlots.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doctor ID</TableCell>
                      <TableCell>Day of Week</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Duration (min)</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timeSlots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>{slot.doctor_id}</TableCell>
                        <TableCell>
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][slot.day_of_week]}
                        </TableCell>
                        <TableCell>{slot.start_time}</TableCell>
                        <TableCell>{slot.end_time}</TableCell>
                        <TableCell>{slot.slot_duration_minutes}</TableCell>
                        <TableCell>
                          <Chip 
                            label={slot.is_available ? 'Available' : 'Unavailable'} 
                            color={slot.is_available ? 'success' : 'error'} 
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
                No time slots found. Time slots are configured per doctor.
              </Typography>
            )}
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h5" gutterBottom>
              📦 Health Package Management
            </Typography>
            {healthPackages.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Original Price</TableCell>
                      <TableCell>Duration (hrs)</TableCell>
                      <TableCell>Age Group</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {healthPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>{pkg.name}</TableCell>
                        <TableCell>{pkg.description?.substring(0, 50)}...</TableCell>
                        <TableCell>₹{pkg.price}</TableCell>
                        <TableCell>{pkg.original_price ? `₹${pkg.original_price}` : '-'}</TableCell>
                        <TableCell>{pkg.duration_hours}</TableCell>
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
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏥 Healthcare Admin Panel
          </Typography>
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
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">{error}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Button onClick={loadData} size="small" variant="outlined">Retry</Button>
              <Button 
                onClick={() => {
                  const fallback = getFallbackData();
                  setDoctors(fallback.doctors);
                  setSpecialties(fallback.specialties);
                  setTimeSlots(fallback.timeSlots);
                  setHealthPackages(fallback.packages);
                  setError(null);
                }} 
                size="small" 
                variant="contained"
              >
                Use Demo Data
              </Button>
            </Box>
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading data from database...</Typography>
          </Box>
        ) : (
          <Paper sx={{ p: 2 }}>
            {renderTabContent()}
          </Paper>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit' : 'Add'} {dialogType === 'doctor' ? 'Doctor' : 'Specialty'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'doctor' && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Doctor Name"
                defaultValue={editingItem?.name || ''}
                margin="normal"
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              />
              <TextField
                fullWidth
                label="Specialization"
                defaultValue={editingItem?.specialization || ''}
                margin="normal"
                onChange={(e) => setEditingItem({...editingItem, specialization: e.target.value})}
              />
              <TextField
                fullWidth
                label="Qualification"
                defaultValue={editingItem?.qualification || ''}
                margin="normal"
                onChange={(e) => setEditingItem({...editingItem, qualification: e.target.value})}
              />
              <TextField
                fullWidth
                label="Experience (years)"
                type="number"
                defaultValue={editingItem?.experience || ''}
                margin="normal"
                onChange={(e) => setEditingItem({...editingItem, experience: parseInt(e.target.value)})}
              />
              <TextField
                fullWidth
                label="Contact"
                defaultValue={editingItem?.contact || ''}
                margin="normal"
                onChange={(e) => setEditingItem({...editingItem, contact: e.target.value})}
              />
            </Box>
          )}
          {dialogType === 'specialty' && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Specialty Name"
                defaultValue={editingItem?.name || ''}
                margin="normal"
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              />
              <TextField
                fullWidth
                label="Description"
                defaultValue={editingItem?.description || ''}
                margin="normal"
                multiline
                rows={3}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
              />
              <TextField
                fullWidth
                label="Icon (emoji)"
                defaultValue={editingItem?.icon || ''}
                margin="normal"
                onChange={(e) => setEditingItem({...editingItem, icon: e.target.value})}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={() => handleSave(editingItem)} variant="contained">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanelDirect;
