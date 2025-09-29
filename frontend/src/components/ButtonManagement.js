import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ToggleOn,
  ToggleOff,
  Refresh
} from '@mui/icons-material';
import chatButtonService from '../services/chatButtonService';

const ButtonManagement = () => {
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [formData, setFormData] = useState({
    button_text: '',
    button_action: '',
    button_value: '',
    button_icon: '',
    button_color: 'primary',
    button_variant: 'contained',
    display_order: 0,
    is_active: true,
    category: '',
    description: ''
  });

  const buttonActions = [
    { value: 'appointment', label: 'Appointment Booking' },
    { value: 'health_package', label: 'Health Package' },
    { value: 'callback', label: 'Request Callback' },
    { value: 'custom', label: 'Custom Action' }
  ];

  const buttonColors = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'info', label: 'Info' }
  ];

  const buttonVariants = [
    { value: 'contained', label: 'Contained' },
    { value: 'outlined', label: 'Outlined' },
    { value: 'text', label: 'Text' }
  ];

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatButtonService.getAllButtons();
      setButtons(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch buttons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (button = null) => {
    if (button) {
      setEditingButton(button);
      setFormData({
        button_text: button.button_text || '',
        button_action: button.button_action || '',
        button_value: button.button_value || '',
        button_icon: button.button_icon || '',
        button_color: button.button_color || 'primary',
        button_variant: button.button_variant || 'contained',
        display_order: button.display_order || 0,
        is_active: button.is_active !== undefined ? button.is_active : true,
        category: button.category || '',
        description: button.description || ''
      });
    } else {
      setEditingButton(null);
      setFormData({
        button_text: '',
        button_action: '',
        button_value: '',
        button_icon: '',
        button_color: 'primary',
        button_variant: 'contained',
        display_order: 0,
        is_active: true,
        category: '',
        description: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingButton(null);
    setFormData({
      button_text: '',
      button_action: '',
      button_value: '',
      button_icon: '',
      button_color: 'primary',
      button_variant: 'contained',
      display_order: 0,
      is_active: true,
      category: '',
      description: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingButton) {
        await chatButtonService.updateButton(editingButton.id, formData);
      } else {
        await chatButtonService.createButton(formData);
      }
      await fetchButtons();
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to save button');
    }
  };

  const handleDelete = async (buttonId) => {
    if (window.confirm('Are you sure you want to delete this button?')) {
      try {
        await chatButtonService.deleteButton(buttonId);
        await fetchButtons();
      } catch (err) {
        setError(err.message || 'Failed to delete button');
      }
    }
  };

  const handleToggleStatus = async (buttonId) => {
    try {
      await chatButtonService.toggleButtonStatus(buttonId);
      await fetchButtons();
    } catch (err) {
      setError(err.message || 'Failed to toggle button status');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Chat Button Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchButtons}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Button
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Text</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buttons.map((button) => (
              <TableRow key={button.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {button.button_icon && <span>{button.button_icon}</span>}
                    <Typography variant="body2" fontWeight="medium">
                      {button.button_text}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={button.button_action}
                    size="small"
                    color={button.button_color}
                    variant={button.button_variant}
                  />
                </TableCell>
                <TableCell>
                  {button.category && (
                    <Chip label={button.category} size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>{button.display_order}</TableCell>
                <TableCell>
                  <Chip
                    label={button.is_active ? 'Active' : 'Inactive'}
                    color={button.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleStatus(button.id)}
                    color={button.is_active ? 'warning' : 'success'}
                  >
                    {button.is_active ? <ToggleOff /> : <ToggleOn />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(button)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(button.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingButton ? 'Edit Button' : 'Add New Button'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Button Text"
                value={formData.button_text}
                onChange={(e) => handleInputChange('button_text', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Action Type</InputLabel>
                <Select
                  value={formData.button_action}
                  onChange={(e) => handleInputChange('button_action', e.target.value)}
                >
                  {buttonActions.map((action) => (
                    <MenuItem key={action.value} value={action.value}>
                      {action.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Button Value/Action"
                value={formData.button_value}
                onChange={(e) => handleInputChange('button_value', e.target.value)}
                helperText="The action or message sent when button is clicked"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Icon (Emoji or Icon Name)"
                value={formData.button_icon}
                onChange={(e) => handleInputChange('button_icon', e.target.value)}
                helperText="e.g., 🏥 or calendar_today"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={formData.button_color}
                  onChange={(e) => handleInputChange('button_color', e.target.value)}
                >
                  {buttonColors.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      {color.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Variant</InputLabel>
                <Select
                  value={formData.button_variant}
                  onChange={(e) => handleInputChange('button_variant', e.target.value)}
                >
                  {buttonVariants.map((variant) => (
                    <MenuItem key={variant.value} value={variant.value}>
                      {variant.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Display Order"
                type="number"
                value={formData.display_order}
                onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                helperText="Optional category for grouping buttons"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                helperText="Optional description shown on the button"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingButton ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ButtonManagement;
