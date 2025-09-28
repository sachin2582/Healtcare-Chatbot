import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack, IconButton, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocalHospital, Chat, People, Description, PhoneInTalk } from '@mui/icons-material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Chat', path: '/chat', icon: <Chat /> },
    { label: 'Patients', path: '/patients', icon: <People /> },
    { label: 'Documents', path: '/documents', icon: <Description /> },
  ];

  return (
    <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #0f6c3f 0%, #13824d 100%)' }}>
      <Toolbar sx={{ py: 1.5 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 44, height: 44 }}>
            <LocalHospital />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Fortis Care Navigator
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Trusted guidance from Fortis Healthcare experts
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', gap: 1.5, mr: 3 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                px: 2.5,
                py: 1,
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.18)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Fortis 24x7 Helpline
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PhoneInTalk />}
            sx={{ borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            1800-102-5555
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
