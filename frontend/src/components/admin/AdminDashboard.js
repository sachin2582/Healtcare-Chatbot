import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MedicalServices as MedicalIcon,
  Schedule as ScheduleIcon,
  LocalHospital as PackageIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';

import DoctorManagement from './DoctorManagement';
import SpecialityManagement from './SpecialityManagement';
import TimeSlotManagement from './TimeSlotManagement';
import HealthPackageManagement from './HealthPackageManagement';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const statsData = await adminService.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const StatCard = ({ title, value, icon, color = "primary" }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {loading ? '...' : value}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Dashboard Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Doctors"
                  value={stats?.total_doctors}
                  icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Specialities"
                  value={stats?.total_specialities}
                  icon={<MedicalIcon sx={{ fontSize: 40 }} />}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Health Packages"
                  value={stats?.total_health_packages}
                  icon={<PackageIcon sx={{ fontSize: 40 }} />}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Appointments"
                  value={stats?.total_appointments}
                  icon={<ScheduleIcon sx={{ fontSize: 40 }} />}
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Appointments"
                  value={stats?.active_appointments}
                  icon={<ScheduleIcon sx={{ fontSize: 40 }} />}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Patients"
                  value={stats?.total_patients}
                  icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                  color="primary"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return <DoctorManagement />;
      case 2:
        return <SpecialityManagement />;
      case 3:
        return <TimeSlotManagement />;
      case 4:
        return <HealthPackageManagement />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Healthcare Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<PeopleIcon />} label="Doctors" />
          <Tab icon={<MedicalIcon />} label="Specialities" />
          <Tab icon={<ScheduleIcon />} label="Time Slots" />
          <Tab icon={<PackageIcon />} label="Health Packages" />
        </Tabs>
      </Paper>

      <Box sx={{ p: 3 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;


