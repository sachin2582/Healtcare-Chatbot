import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Stack,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore,
  LocalHospital,
  Home,
  AccessTime,
  CheckCircle,
  ArrowBack,
  Visibility,
  Info,
  Close,
} from '@mui/icons-material';
import healthPackageService from '../services/healthPackageService';

const HealthPackageBooking = ({ onBookingComplete, onBack }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [packageDetailsDialogOpen, setPackageDetailsDialogOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    package_id: null,
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    patient_age: '',
    patient_gender: '',
    preferred_date: '',
    preferred_time: '',
    home_collection: false,
    address: '',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Load health packages on component mount
  useEffect(() => {
    loadHealthPackages();
  }, []);

  const loadHealthPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await healthPackageService.getHealthPackages();
      setPackages(data);
    } catch (err) {
      const errorMessage = err?.message || err?.toString() || 'Failed to load health packages';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = async (packageId) => {
    try {
      const packageData = await healthPackageService.getHealthPackage(packageId);
      setSelectedPackage(packageData);
      setBookingData(prev => ({ ...prev, package_id: packageId }));
      setBookingDialogOpen(true);
    } catch (err) {
      const errorMessage = err?.message || err?.toString() || 'Failed to load package details';
      setError(errorMessage);
    }
  };

  const handleViewDetails = async (packageId) => {
    try {
      const packageData = await healthPackageService.getHealthPackage(packageId);
      setSelectedPackage(packageData);
      setPackageDetailsDialogOpen(true);
    } catch (err) {
      const errorMessage = err?.message || err?.toString() || 'Failed to load package details';
      setError(errorMessage);
    }
  };

  const handleBookingSubmit = async () => {
    try {
      setBookingLoading(true);
      setError(null);

      // Basic validation
      if (!bookingData.patient_name || !bookingData.patient_phone || !bookingData.patient_age || !bookingData.patient_gender || !bookingData.preferred_date || !bookingData.preferred_time) {
        setError('Please fill in all required fields');
        return;
      }

      const result = await healthPackageService.bookHealthPackage(bookingData);
      setBookingSuccess(result);
      setBookingDialogOpen(false);
      
      if (onBookingComplete) {
        onBookingComplete(result);
      }
    } catch (err) {
      const errorMessage = err?.message || err?.toString() || 'Failed to book health package';
      setError(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${hours * 60} minutes`;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const getDiscountPercentage = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const PackageCard = ({ pkg }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.2s ease',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: '#1e3c72',
        }
      }}
    >
      {/* Discount Badge */}
      {pkg.original_price && (
        <Chip
          label={`${getDiscountPercentage(pkg.original_price, pkg.price)}% OFF`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            fontWeight: 600,
            fontSize: '0.65rem',
            height: 20,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: '#1e3c72', 
              mr: 1, 
              width: 28, 
              height: 28,
              fontSize: '0.85rem'
            }}
          >
            <LocalHospital />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ 
              color: '#1e3c72', 
              fontWeight: 600,
              mb: 0,
              fontSize: '0.85rem',
              lineHeight: 1.1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {pkg.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {pkg.age_group} • {formatDuration(pkg.duration_hours)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" sx={{ 
          mb: 1, 
          color: '#4a5568',
          lineHeight: 1.3,
          minHeight: '2em',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          fontSize: '0.7rem'
        }}>
          {pkg.description}
        </Typography>

        {/* Price Section */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.25 }}>
            <Typography variant="subtitle1" sx={{ 
              color: '#2d3748', 
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              {formatPrice(pkg.price)}
            </Typography>
            {pkg.original_price && (
              <Typography variant="caption" sx={{ 
                textDecoration: 'line-through', 
                color: 'text.secondary',
                fontSize: '0.7rem'
              }}>
                {formatPrice(pkg.original_price)}
              </Typography>
            )}
          </Box>
          
          {pkg.original_price && (
            <Chip 
              label={`Save ${formatPrice(pkg.original_price - pkg.price)}`} 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.65rem', height: 18 }}
            />
          )}
        </Box>

        {/* Features - Compact */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`${pkg.report_delivery_days}D`} 
            size="small" 
            variant="outlined" 
            sx={{ fontSize: '0.65rem', height: 18, color: '#4a5568' }}
          />
          {pkg.home_collection_available && (
            <Chip 
              label="Home" 
              size="small" 
              variant="outlined" 
              color="primary"
              sx={{ fontSize: '0.65rem', height: 18 }}
            />
          )}
          {pkg.fasting_required && (
            <Chip 
              label="Fasting" 
              size="small" 
              variant="outlined" 
              color="warning"
              sx={{ fontSize: '0.65rem', height: 18 }}
            />
          )}
        </Box>

        {/* Test Count - Compact */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          mb: 1,
          p: 0.5,
          bgcolor: '#f8fafc',
          borderRadius: 1,
          border: '1px solid #e2e8f0'
        }}>
          <CheckCircle sx={{ color: '#10b981', fontSize: 10 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.65rem' }}>
            {pkg.tests?.length || 0} tests
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 1, pt: 0, gap: 0.5 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewDetails(pkg.id)}
          sx={{
            flexGrow: 1,
            borderColor: '#1e3c72',
            color: '#1e3c72',
            fontSize: '0.7rem',
            py: 0.25,
            px: 1,
            minHeight: 28,
            '&:hover': {
              borderColor: '#2a5298',
              bgcolor: '#f8fafc'
            }
          }}
        >
          View
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => handlePackageSelect(pkg.id)}
          sx={{
            flexGrow: 1,
            bgcolor: '#1e3c72',
            fontSize: '0.7rem',
            py: 0.25,
            px: 1,
            minHeight: 28,
            '&:hover': { bgcolor: '#2a5298' },
            fontWeight: 600
          }}
        >
          Book
        </Button>
      </CardActions>
    </Card>
  );

  const PackageDetailsDialog = () => (
    <Dialog 
      open={packageDetailsDialogOpen} 
      onClose={() => setPackageDetailsDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospital sx={{ color: '#1e3c72' }} />
            <Typography variant="h6">{selectedPackage?.name}</Typography>
          </Box>
          <IconButton onClick={() => setPackageDetailsDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {selectedPackage && (
          <Box>
            {/* Package Info */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8fafc' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#1e3c72', mb: 2 }}>
                    Package Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Price</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {formatPrice(selectedPackage.price)}
                        {selectedPackage.original_price && (
                          <Typography component="span" sx={{ 
                            ml: 1, 
                            textDecoration: 'line-through', 
                            color: 'text.secondary',
                            fontSize: '0.9rem'
                          }}>
                            {formatPrice(selectedPackage.original_price)}
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Duration</Typography>
                      <Typography variant="body1">{formatDuration(selectedPackage.duration_hours)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Age Group</Typography>
                      <Typography variant="body1">{selectedPackage.age_group}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Report Delivery</Typography>
                      <Typography variant="body1">
                        {selectedPackage.report_delivery_days} day{selectedPackage.report_delivery_days > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#1e3c72', mb: 2 }}>
                    Features
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {selectedPackage.home_collection_available ? (
                        <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                      ) : (
                        <Close sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2">Home Collection</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {selectedPackage.lab_visit_required ? (
                        <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                      ) : (
                        <Close sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2">Lab Visit Required</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {selectedPackage.fasting_required ? (
                        <CheckCircle sx={{ color: '#f59e0b', fontSize: 16 }} />
                      ) : (
                        <Close sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2">Fasting Required</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Tests List */}
            <Typography variant="h6" sx={{ color: '#1e3c72', mb: 2 }}>
              Tests Included ({selectedPackage.tests?.length || 0})
            </Typography>
            
            {selectedPackage.tests && selectedPackage.tests.length > 0 ? (
              <Box>
                {Object.entries(
                  selectedPackage.tests.reduce((acc, test) => {
                    if (!acc[test.test_category]) {
                      acc[test.test_category] = [];
                    }
                    acc[test.test_category].push(test);
                    return acc;
                  }, {})
                ).map(([category, tests]) => (
                  <Accordion key={category} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {category}
                        </Typography>
                        <Chip 
                          label={tests.length} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {tests.map((test, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {test.test_name}
                                  </Typography>
                                  {test.is_optional && (
                                    <Chip label="Optional" size="small" color="warning" variant="outlined" />
                                  )}
                                </Box>
                              }
                              secondary={test.test_description && (
                                <Typography variant="caption" color="text.secondary">
                                  {test.test_description}
                                </Typography>
                              )}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ) : (
              <Alert severity="info">No tests available for this package.</Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setPackageDetailsDialogOpen(false)}>
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={() => {
            setPackageDetailsDialogOpen(false);
            handlePackageSelect(selectedPackage.id);
          }}
          sx={{ bgcolor: '#1e3c72', '&:hover': { bgcolor: '#2a5298' } }}
        >
          Book This Package
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 400,
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading Health Packages...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={loadHealthPackages}>
          Retry
        </Button>
      </Box>
    );
  }

  if (bookingSuccess) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Health Package Booked Successfully! 🎉
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Confirmation Number:</strong> {bookingSuccess.confirmation_number}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Package:</strong> {bookingSuccess.package_name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Amount:</strong> {formatPrice(bookingSuccess.total_amount)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Date:</strong> {bookingSuccess.booking_date}
          </Typography>
          <Typography variant="body2">
            <strong>Time:</strong> {bookingSuccess.booking_time}
          </Typography>
        </Alert>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={() => setBookingSuccess(null)}>
            Book Another Package
          </Button>
          {onBack && (
            <Button 
              variant="contained" 
              onClick={onBack}
              sx={{ bgcolor: '#1e3c72', '&:hover': { bgcolor: '#2a5298' } }}
            >
              Back to Chat
            </Button>
          )}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header Section - Compact */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {onBack && (
              <IconButton 
                onClick={onBack}
                size="small"
                sx={{ 
                  bgcolor: '#1e3c72', 
                  color: 'white',
                  width: 32,
                  height: 32,
                  '&:hover': { bgcolor: '#2a5298' }
                }}
              >
                <ArrowBack fontSize="small" />
              </IconButton>
            )}
            <Box>
              <Typography variant="h6" sx={{ 
                color: '#1e3c72', 
                fontWeight: 700,
                mb: 0,
                fontSize: '1.25rem'
              }}>
                Health Checkup Packages
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Choose from our comprehensive health screening packages
              </Typography>
            </Box>
          </Box>
          
          <Chip 
            label={`${packages.length} Packages`} 
            color="primary" 
            variant="outlined"
            size="small"
            icon={<LocalHospital />}
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
      </Paper>

      {/* Packages Grid - Tighter */}
      <Grid container spacing={1.5}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pkg.id}>
            <PackageCard pkg={pkg} />
          </Grid>
        ))}
      </Grid>

      {/* Back to Chat Button - Fixed Position */}
      {onBack && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          zIndex: 1000
        }}>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{
              bgcolor: '#1e3c72',
              '&:hover': { bgcolor: '#2a5298' },
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(30, 60, 114, 0.3)',
            }}
          >
            Back to Chat
          </Button>
        </Box>
      )}

      {/* Package Details Dialog */}
      <PackageDetailsDialog />

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialogOpen} 
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospital sx={{ color: '#1e3c72' }} />
            Book Health Package
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPackage && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#1e3c72', mb: 1 }}>
                {selectedPackage.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedPackage.description}
              </Typography>
              <Typography variant="h6" sx={{ color: '#2d3748' }}>
                {formatPrice(selectedPackage.price)}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patient Name *"
                value={bookingData.patient_name}
                onChange={(e) => setBookingData(prev => ({ ...prev, patient_name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                value={bookingData.patient_phone}
                onChange={(e) => setBookingData(prev => ({ ...prev, patient_phone: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email (Optional)"
                type="email"
                value={bookingData.patient_email}
                onChange={(e) => setBookingData(prev => ({ ...prev, patient_email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age *"
                type="number"
                value={bookingData.patient_age}
                onChange={(e) => setBookingData(prev => ({ ...prev, patient_age: e.target.value }))}
                inputProps={{ min: 1, max: 120 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender *</InputLabel>
                <Select
                  value={bookingData.patient_gender}
                  onChange={(e) => setBookingData(prev => ({ ...prev, patient_gender: e.target.value }))}
                  label="Gender *"
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Date *"
                type="date"
                value={bookingData.preferred_date}
                onChange={(e) => setBookingData(prev => ({ ...prev, preferred_date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Time *"
                type="time"
                value={bookingData.preferred_time}
                onChange={(e) => setBookingData(prev => ({ ...prev, preferred_time: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bookingData.home_collection}
                    onChange={(e) => setBookingData(prev => ({ ...prev, home_collection: e.target.checked }))}
                  />
                }
                label="Home collection available"
              />
            </Grid>
            {bookingData.home_collection && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address for Home Collection"
                  multiline
                  rows={3}
                  value={bookingData.address}
                  onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes (Optional)"
                multiline
                rows={2}
                value={bookingData.notes}
                onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)} disabled={bookingLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleBookingSubmit} 
            variant="contained"
            disabled={bookingLoading}
            sx={{ bgcolor: '#1e3c72', '&:hover': { bgcolor: '#2a5298' } }}
          >
            {bookingLoading ? <CircularProgress size={24} /> : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthPackageBooking;