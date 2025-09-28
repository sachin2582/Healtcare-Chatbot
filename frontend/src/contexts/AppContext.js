import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Centralized state
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Centralized data fetching
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [patientsData, doctorsData, questionnairesData] = await Promise.all([
        apiService.getPatients().catch(err => {
          console.warn('Failed to fetch patients:', err);
          return [];
        }),
        apiService.getDoctors(true).catch(err => {
          console.warn('Failed to fetch doctors:', err);
          return [];
        }),
        apiService.getQuestionnaires().catch(err => {
          console.warn('Failed to fetch questionnaires:', err);
          return [];
        })
      ]);

      setPatients(patientsData || []);
      setDoctors(doctorsData || []);
      setQuestionnaires(questionnairesData || []);
      
    } catch (err) {
      console.error('Error fetching application data:', err);
      setError(err.message || 'Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh specific data
  const refreshPatients = async () => {
    try {
      const patientsData = await apiService.getPatients();
      setPatients(patientsData || []);
    } catch (err) {
      console.error('Error refreshing patients:', err);
    }
  };

  const refreshDoctors = async () => {
    try {
      const doctorsData = await apiService.getDoctors(true);
      setDoctors(doctorsData || []);
    } catch (err) {
      console.error('Error refreshing doctors:', err);
    }
  };

  const refreshQuestionnaires = async () => {
    try {
      const questionnairesData = await apiService.getQuestionnaires();
      setQuestionnaires(questionnairesData || []);
    } catch (err) {
      console.error('Error refreshing questionnaires:', err);
    }
  };

  // Utility functions
  const getPatientById = (id) => {
    return patients.find(patient => patient.id === parseInt(id));
  };

  const getDoctorById = (id) => {
    return doctors.find(doctor => doctor.id === parseInt(id));
  };

  const getQuestionnaireById = (id) => {
    return questionnaires.find(questionnaire => questionnaire.id === parseInt(id));
  };

  // Initialize data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const value = {
    // Data
    patients,
    doctors,
    questionnaires,
    loading,
    error,
    
    // Actions
    fetchAllData,
    refreshPatients,
    refreshDoctors,
    refreshQuestionnaires,
    setPatients,
    setDoctors,
    setQuestionnaires,
    
    // Utilities
    getPatientById,
    getDoctorById,
    getQuestionnaireById,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
