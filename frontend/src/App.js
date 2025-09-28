import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import { AppProvider } from './contexts/AppContext';
import LandingPage from './components/LandingPage';
import ProfessionalChatInterface from './components/ProfessionalChatInterface';
import PatientDashboard from './components/PatientDashboard';
import DocumentManagement from './components/DocumentManagement';
import Navigation from './components/Navigation';
import FloatingChatbot from './components/FloatingChatbot';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f6c3f',
    },
    secondary: {
      main: '#ff6f3c',
    },
    background: {
      default: '#f3f7f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          paddingInline: 20,
        },
      },
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/chat" 
              element={
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Navigation />
                  <Box sx={{ flex: 1 }}>
                    <ProfessionalChatInterface />
                  </Box>
                  <FloatingChatbot />
                </Box>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Navigation />
                  <Box sx={{ flex: 1 }}>
                    <PatientDashboard />
                  </Box>
                  <FloatingChatbot />
                </Box>
              } 
            />
            <Route 
              path="/documents" 
              element={
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Navigation />
                  <Box sx={{ flex: 1 }}>
                    <DocumentManagement />
                  </Box>
                  <FloatingChatbot />
                </Box>
              } 
            />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
