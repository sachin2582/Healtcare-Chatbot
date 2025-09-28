import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
  InputAdornment
} from '@mui/material';
import { Search, PersonAdd, Person } from '@mui/icons-material';
import patientService from '../services/patientService';

const PatientSelection = ({ onPatientSelect, onBack, onNewPatient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Load all patients on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      console.error('Error loading patients:', err);
      setError('Failed to load patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPatients();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await patientService.searchPatients(searchQuery);
      setPatients(data);
    } catch (err) {
      console.error('Error searching patients:', err);
      setError('Failed to search patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSelectPatient = () => {
    if (selectedPatient) {
      onPatientSelect(selectedPatient);
    }
  };


  const getPatientAge = (patient) => {
    if (patient.age) {
      return `${patient.age} years old`;
    }
    return 'Age not specified';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center', color: '#1e3c72' }}>
        Select Patient
      </Typography>

      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Search Section */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Search Patients"
              placeholder="Search by name, email, or phone number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={loadPatients}
                disabled={loading}
              >
                Show All
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Patient List */}
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : patients.length > 0 ? (
              <List>
                {patients.map((patient) => (
                  <ListItem key={patient.id} disablePadding>
                    <ListItemButton
                      onClick={() => handlePatientClick(patient)}
                      selected={selectedPatient?.id === patient.id}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        border: selectedPatient?.id === patient.id ? '2px solid #1e3c72' : '1px solid #e0e0e0',
                        backgroundColor: selectedPatient?.id === patient.id ? '#f0f4ff' : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedPatient?.id === patient.id ? '#f0f4ff' : '#f5f5f5',
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Person color="primary" />
                            <Typography variant="h6" sx={{ color: '#1e3c72', fontWeight: 600 }}>
                              {patient.first_name} {patient.last_name}
                            </Typography>
                            <Chip 
                              label={getPatientAge(patient)} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              📧 {patient.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              📞 {patient.phone}
                            </Typography>
                            {patient.address && (
                              <Typography variant="body2" color="text.secondary">
                                🏠 {patient.address}
                                {patient.city && `, ${patient.city}`}
                                {patient.state && `, ${patient.state}`}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No patients found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery ? 'Try a different search term' : 'No patients in the system yet'}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onBack}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={onNewPatient}
                startIcon={<PersonAdd />}
              >
                New Patient
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSelectPatient}
                disabled={!selectedPatient}
              >
                Select Patient
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientSelection;
