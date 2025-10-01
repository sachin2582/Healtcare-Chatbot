import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

// Components
import LandingPage from './components/LandingPage';
import ProfessionalChatInterface from './components/ProfessionalChatInterface';
import FloatingChatbot from './components/FloatingChatbot';
import AdminDashboard from './components/admin/AdminDashboard';
import CompleteAdminPanel from './components/CompleteAdminPanel';

// Context
import { AppProvider } from './contexts/AppContext';

// Services
import { patientService } from './services/patientService';
import doctorService from './services/doctorService';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e40af',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [patientsData, doctorsData] = await Promise.all([
        patientService.getPatients(),
        doctorService.getDoctors()
      ]);
      
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    patients,
    doctors,
    loading,
    error,
    refreshData: loadInitialData
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
        >
          Loading...
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider value={contextValue}>
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat" element={<ProfessionalChatInterface />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<CompleteAdminPanel />} />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Floating Chatbot - Only show on non-admin routes */}
            {!window.location.pathname.startsWith('/admin') && <FloatingChatbot />}
          </Box>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;