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
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

import { adminService } from '../../services/adminService';

const TimeSlotManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [formData, setFormData] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
    slot_duration_minutes: 30,
    is_available: true
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      loadTimeSlots(selectedDoctor);
    }
  }, [selectedDoctor]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await adminService.getDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error loading doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async (doctorId) => {
    try {
      const slotsData = await adminService.getDoctorTimeSlots(doctorId);
      setTimeSlots(slotsData);
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const handleOpenDialog = (slot = null, doctorId = null) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        slot_duration_minutes: slot.slot_duration_minutes,
        is_available: slot.is_available
      });
    } else {
      setEditingSlot(null);
      setFormData({
        day_of_week: '',
        start_time: '',
        end_time: '',
        slot_duration_minutes: 30,
        is_available: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlot(null);
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
      if (editingSlot) {
        await adminService.updateTimeSlot(editingSlot.id, formData);
      } else {
        await adminService.createTimeSlot(selectedDoctor, formData);
      }

      await loadTimeSlots(selectedDoctor);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving time slot:', error);
    }
  };

  const handleDelete = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await adminService.deleteTimeSlot(slotId);
        await loadTimeSlots(selectedDoctor);
      } catch (error) {
        console.error('Error deleting time slot:', error);
      }
    }
  };

  const getDayName = (dayNumber) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Unknown';
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    let current = new Date(start);
    while (current < end) {
      const slotEnd = new Date(current.getTime() + duration * 60000);
      if (slotEnd <= end) {
        slots.push({
          start: current.toTimeString().slice(0, 5),
          end: slotEnd.toTimeString().slice(0, 5)
        });
      }
      current = slotEnd;
    }
    
    return slots;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Time Slot Management</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Doctor
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  label="Doctor"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedDoctor && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog(null, selectedDoctor)}
                  sx={{ mt: 2 }}
                >
                  Add Time Slot
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedDoctor && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Time Slots Preview
                </Typography>
                {timeSlots.length > 0 ? (
                  <Box>
                    {timeSlots.map((slot) => {
                      const generatedSlots = generateTimeSlots(
                        slot.start_time,
                        slot.end_time,
                        slot.slot_duration_minutes
                      );
                      return (
                        <Accordion key={slot.id}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography>{getDayName(slot.day_of_week)}</Typography>
                              <Chip
                                label={slot.is_available ? 'Active' : 'Inactive'}
                                color={slot.is_available ? 'success' : 'default'}
                                size="small"
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="body2" gutterBottom>
                              <strong>Time:</strong> {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Duration:</strong> {slot.slot_duration_minutes} minutes
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              <strong>Total Slots:</strong> {generatedSlots.length}
                            </Typography>
                            <Box mt={2}>
                              <Grid container spacing={1}>
                                {generatedSlots.slice(0, 6).map((generatedSlot, index) => (
                                  <Grid item key={index}>
                                    <Chip
                                      label={`${formatTime(generatedSlot.start)}`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Grid>
                                ))}
                                {generatedSlots.length > 6 && (
                                  <Grid item>
                                    <Chip
                                      label={`+${generatedSlots.length - 6} more`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                            <Box mt={2}>
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenDialog(slot)}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(slot.id)}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    No time slots found for this doctor.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Time Slot Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Day of Week</InputLabel>
                <Select
                  value={formData.day_of_week}
                  onChange={handleInputChange('day_of_week')}
                  label="Day of Week"
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
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={formData.start_time}
                onChange={handleInputChange('start_time')}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={formData.end_time}
                onChange={handleInputChange('end_time')}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Slot Duration (Minutes)"
                type="number"
                value={formData.slot_duration_minutes}
                onChange={handleInputChange('slot_duration_minutes')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Available</Typography>
                <Switch
                  checked={formData.is_available}
                  onChange={handleInputChange('is_available')}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSlot ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeSlotManagement;


