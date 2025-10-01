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
  Grid,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import { adminService } from '../../services/adminService';

const SpecialityManagement = () => {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSpeciality, setEditingSpeciality] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    is_active: true
  });

  useEffect(() => {
    loadSpecialities();
  }, []);

  const loadSpecialities = async () => {
    try {
      setLoading(true);
      const specialitiesData = await adminService.getSpecialities();
      setSpecialities(specialitiesData);
    } catch (error) {
      console.error('Error loading specialities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (speciality = null) => {
    if (speciality) {
      setEditingSpeciality(speciality);
      setFormData({
        name: speciality.name,
        description: speciality.description || '',
        icon: speciality.icon || '',
        is_active: speciality.is_active
      });
    } else {
      setEditingSpeciality(null);
      setFormData({
        name: '',
        description: '',
        icon: '',
        is_active: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSpeciality(null);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingSpeciality) {
        await adminService.updateSpeciality(editingSpeciality.id, formData);
      } else {
        await adminService.createSpeciality(formData);
      }

      await loadSpecialities();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving speciality:', error);
    }
  };

  const handleDelete = async (specialityId) => {
    if (window.confirm('Are you sure you want to delete this speciality?')) {
      try {
        await adminService.deleteSpeciality(specialityId);
        await loadSpecialities();
      } catch (error) {
        console.error('Error deleting speciality:', error);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Speciality Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Speciality
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
            {specialities.map((speciality) => (
              <TableRow key={speciality.id}>
                <TableCell>
                  {speciality.icon && (
                    <Typography variant="h5">{speciality.icon}</Typography>
                  )}
                </TableCell>
                <TableCell>{speciality.name}</TableCell>
                <TableCell>{speciality.description || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={speciality.is_active ? 'Active' : 'Inactive'}
                    color={speciality.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(speciality)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(speciality.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSpeciality ? 'Edit Speciality' : 'Add New Speciality'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Speciality Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Icon (Emoji)"
                value={formData.icon}
                onChange={handleInputChange('icon')}
                placeholder="e.g., 🩺, 💊, 🏥"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Active</Typography>
                <Switch
                  checked={formData.is_active}
                  onChange={handleInputChange('is_active')}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSpeciality ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecialityManagement;


