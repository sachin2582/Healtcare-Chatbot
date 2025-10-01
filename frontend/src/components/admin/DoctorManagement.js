import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';

import { adminService } from '../../services/adminService';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    speciality_id: '',
    qualification: '',
    experience_years: '',
    contact: '',
    is_available: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [doctorsData, specialitiesData] = await Promise.all([
        adminService.getDoctors(),
        adminService.getSpecialities()
      ]);
      setDoctors(doctorsData);
      setSpecialities(specialitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        speciality_id: doctor.speciality_id || '',
        qualification: doctor.qualification || '',
        experience_years: doctor.experience_years || '',
        contact: doctor.contact || '',
        is_available: doctor.is_available
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        specialization: '',
        speciality_id: '',
        qualification: '',
        experience_years: '',
        contact: '',
        is_available: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDoctor(null);
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        speciality_id: formData.speciality_id ? parseInt(formData.speciality_id) : null
      };

      if (editingDoctor) {
        await adminService.updateDoctor(editingDoctor.id, data);
      } else {
        await adminService.createDoctor(data);
      }

      await loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminService.deleteDoctor(doctorId);
        await loadData();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const handleImageUpload = async (doctorId, file) => {
    try {
      await adminService.uploadDoctorImage(doctorId, file);
      await loadData();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Doctor Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Doctor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Speciality</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={doctor.image_url}
                      sx={{ width: 40, height: 40 }}
                    />
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id={`upload-${doctor.id}`}
                      type="file"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(doctor.id, e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor={`upload-${doctor.id}`}>
                      <IconButton
                        color="primary"
                        component="span"
                        size="small"
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                  </Box>
                </TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>
                  {doctor.speciality?.name || 'N/A'}
                </TableCell>
                <TableCell>
                  {doctor.experience_years ? `${doctor.experience_years} years` : 'N/A'}
                </TableCell>
                <TableCell>{doctor.contact || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={doctor.is_available ? 'Available' : 'Unavailable'}
                    color={doctor.is_available ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(doctor)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(doctor.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Doctor Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                value={formData.specialization}
                onChange={handleInputChange('specialization')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Speciality</InputLabel>
                <Select
                  value={formData.speciality_id}
                  onChange={handleInputChange('speciality_id')}
                  label="Speciality"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {specialities.map((speciality) => (
                    <MenuItem key={speciality.id} value={speciality.id}>
                      {speciality.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={formData.qualification}
                onChange={handleInputChange('qualification')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience (Years)"
                type="number"
                value={formData.experience_years}
                onChange={handleInputChange('experience_years')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact"
                value={formData.contact}
                onChange={handleInputChange('contact')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.is_available}
                  onChange={handleInputChange('is_available')}
                  label="Status"
                >
                  <MenuItem value={true}>Available</MenuItem>
                  <MenuItem value={false}>Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDoctor ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorManagement;


