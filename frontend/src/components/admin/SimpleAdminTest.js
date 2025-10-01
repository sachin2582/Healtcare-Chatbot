import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SimpleAdminTest = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          🎉 Admin Panel Test
        </Typography>
        <Typography variant="body1">
          If you can see this, the admin route is working!
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Backend API: {process.env.REACT_APP_API_URL || 'http://localhost:8000'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SimpleAdminTest;
