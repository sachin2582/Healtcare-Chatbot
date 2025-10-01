import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
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
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  PhotoCamera as PhotoCameraIcon,
  AddBox as AddTestIcon,
  Delete as DeleteTestIcon
} from '@mui/icons-material';

import { adminService } from '../../services/adminService';

const HealthPackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    duration_hours: 2,
    age_group: '',
    gender_specific: '',
    fasting_required: false,
    home_collection_available: true,
    lab_visit_required: true,
    report_delivery_days: 1,
    is_active: true
  });
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({
    test_name: '',
    test_category: '',
    test_description: '',
    is_optional: false
  });
  const [openTestDialog, setOpenTestDialog] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const packagesData = await adminService.getHealthPackages();
      setPackages(packagesData);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (packageData = null) => {
    if (packageData) {
      setEditingPackage(packageData);
      setFormData({
        name: packageData.name,
        description: packageData.description,
        price: packageData.price,
        original_price: packageData.original_price || '',
        duration_hours: packageData.duration_hours,
        age_group: packageData.age_group,
        gender_specific: packageData.gender_specific || '',
        fasting_required: packageData.fasting_required,
        home_collection_available: packageData.home_collection_available,
        lab_visit_required: packageData.lab_visit_required,
        report_delivery_days: packageData.report_delivery_days,
        is_active: packageData.is_active
      });
      setTests(packageData.tests || []);
    } else {
      setEditingPackage(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        duration_hours: 2,
        age_group: '',
        gender_specific: '',
        fasting_required: false,
        home_collection_available: true,
        lab_visit_required: true,
        report_delivery_days: 1,
        is_active: true
      });
      setTests([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPackage(null);
    setTests([]);
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
      const data = {
        ...formData,
        price: parseInt(formData.price),
        original_price: formData.original_price ? parseInt(formData.original_price) : null,
        duration_hours: parseInt(formData.duration_hours),
        report_delivery_days: parseInt(formData.report_delivery_days),
        gender_specific: formData.gender_specific || null
      };

      let packageId;
      if (editingPackage) {
        await adminService.updateHealthPackage(editingPackage.id, data);
        packageId = editingPackage.id;
      } else {
        const newPackage = await adminService.createHealthPackage(data);
        packageId = newPackage.id;
      }

      // Save tests
      for (const test of tests) {
        if (test.id) {
          // Update existing test
          await adminService.updatePackageTest(test.id, test);
        } else {
          // Create new test
          await adminService.createPackageTest(packageId, test);
        }
      }

      await loadPackages();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this health package?')) {
      try {
        await adminService.deleteHealthPackage(packageId);
        await loadPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const handleImageUpload = async (packageId, file) => {
    try {
      await adminService.uploadPackageImage(packageId, file);
      await loadPackages();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAddTest = () => {
    setNewTest({
      test_name: '',
      test_category: '',
      test_description: '',
      is_optional: false
    });
    setOpenTestDialog(true);
  };

  const handleSaveTest = () => {
    setTests(prev => [...prev, { ...newTest, id: Date.now() }]);
    setOpenTestDialog(false);
  };

  const handleDeleteTest = (testId) => {
    setTests(prev => prev.filter(test => test.id !== testId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Health Package Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Package
        </Button>
      </Box>

      <Grid container spacing={3}>
        {packages.map((packageData) => (
          <Grid item xs={12} md={6} lg={4} key={packageData.id}>
            <Card sx={{ height: '100%' }}>
              {packageData.image_url && (
                <CardMedia
                  component="img"
                  height="200"
                  image={packageData.image_url}
                  alt={packageData.name}
                />
              )}
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Typography variant="h6" component="div">
                    {packageData.name}
                  </Typography>
                  <Chip
                    label={packageData.is_active ? 'Active' : 'Inactive'}
                    color={packageData.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {packageData.description}
                </Typography>

                <Box mb={2}>
                  <Typography variant="h6" color="primary">
                    {formatPrice(packageData.price)}
                  </Typography>
                  {packageData.original_price && (
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      {formatPrice(packageData.original_price)}
                    </Typography>
                  )}
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <Chip label={packageData.age_group} size="small" />
                  {packageData.gender_specific && (
                    <Chip label={packageData.gender_specific} size="small" />
                  )}
                  <Chip label={`${packageData.duration_hours}h`} size="small" />
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(packageData)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(packageData.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id={`upload-${packageData.id}`}
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(packageData.id, e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor={`upload-${packageData.id}`}>
                    <IconButton
                      color="primary"
                      component="span"
                      size="small"
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </label>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Package Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPackage ? 'Edit Health Package' : 'Add New Health Package'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Package Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age Group"
                value={formData.age_group}
                onChange={handleInputChange('age_group')}
                placeholder="e.g., 18-40, 40+, All Ages"
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
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original Price (Optional)"
                type="number"
                value={formData.original_price}
                onChange={handleInputChange('original_price')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (Hours)"
                type="number"
                value={formData.duration_hours}
                onChange={handleInputChange('duration_hours')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Report Delivery (Days)"
                type="number"
                value={formData.report_delivery_days}
                onChange={handleInputChange('report_delivery_days')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender Specific</InputLabel>
                <Select
                  value={formData.gender_specific}
                  onChange={handleInputChange('gender_specific')}
                  label="Gender Specific"
                >
                  <MenuItem value="">
                    <em>Both</em>
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Active</Typography>
                <Switch
                  checked={formData.is_active}
                  onChange={handleInputChange('is_active')}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Fasting Required</Typography>
                <Switch
                  checked={formData.fasting_required}
                  onChange={handleInputChange('fasting_required')}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Home Collection</Typography>
                <Switch
                  checked={formData.home_collection_available}
                  onChange={handleInputChange('home_collection_available')}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Lab Visit Required</Typography>
                <Switch
                  checked={formData.lab_visit_required}
                  onChange={handleInputChange('lab_visit_required')}
                />
              </Box>
            </Grid>
            
            {/* Tests Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Package Tests</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddTestIcon />}
                  onClick={handleAddTest}
                >
                  Add Test
                </Button>
              </Box>
              
              <List>
                {tests.map((test, index) => (
                  <ListItem key={test.id || index}>
                    <ListItemText
                      primary={test.test_name}
                      secondary={`${test.test_category}${test.is_optional ? ' (Optional)' : ''}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteTest(test.id || index)}
                      >
                        <DeleteTestIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPackage ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={openTestDialog} onClose={() => setOpenTestDialog(false)}>
        <DialogTitle>Add Test</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Name"
                value={newTest.test_name}
                onChange={(e) => setNewTest(prev => ({ ...prev, test_name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Category"
                value={newTest.test_category}
                onChange={(e) => setNewTest(prev => ({ ...prev, test_category: e.target.value }))}
                placeholder="e.g., Blood Test, Imaging, Cardiac"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Test Description"
                multiline
                rows={2}
                value={newTest.test_description}
                onChange={(e) => setNewTest(prev => ({ ...prev, test_description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Optional Test</Typography>
                <Switch
                  checked={newTest.is_optional}
                  onChange={(e) => setNewTest(prev => ({ ...prev, is_optional: e.target.checked }))}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTestDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveTest} variant="contained">Add Test</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthPackageManagement;


