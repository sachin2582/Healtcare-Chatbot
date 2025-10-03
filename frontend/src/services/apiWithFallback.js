import axios from 'axios';
import { getFallbackData, isApiAvailable } from '../utils/fallbackData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to handle API availability
api.interceptors.request.use(
  async (config) => {
    // Check if API is available before making request
    const apiAvailable = await isApiAvailable(API_BASE_URL);
    
    if (!apiAvailable) {
      // Return a promise that resolves with fallback data
      return Promise.resolve({
        data: getFallbackData(config.url),
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If API request fails, return fallback data
    if (error.code === 'ECONNABORTED' || error.message.includes('Failed to fetch')) {
      console.log('API unavailable, returning fallback data for:', error.config?.url);
      
      const fallbackData = getFallbackData(error.config?.url);
      
      return Promise.resolve({
        data: fallbackData,
        status: 200,
        statusText: 'OK (Fallback)',
        headers: {},
        config: error.config,
        request: error.request
      });
    }
    
    return Promise.reject(error);
  }
);

export const apiServiceWithFallback = {
  // Chat endpoints
  sendMessage: async (message, patientId = null, doctorId = null) => {
    try {
      const response = await api.post('/chat', {
        message,
        patient_id: patientId,
        doctor_id: doctorId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      // Return a fallback response for chat
      return {
        response: "I'm currently in demo mode. This is a sample response to your message: " + message,
        suggestions: [
          "Book an appointment",
          "Find a doctor",
          "View health packages"
        ]
      };
    }
  },

  // Patient endpoints
  getPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return getFallbackData('/patients');
    }
  },

  getPatient: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      return getFallbackData('/patients').find(p => p.id === id) || null;
    }
  },

  createPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      // Return mock created patient
      return {
        id: Date.now(),
        ...patientData,
        created_at: new Date().toISOString()
      };
    }
  },

  // Doctor endpoints
  getDoctors: async (includeSelect = false) => {
    try {
      const response = await api.get('/doctors', {
        params: { include_select: includeSelect }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return getFallbackData('/doctors');
    }
  },

  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/doctor', doctorData);
      return response.data;
    } catch (error) {
      console.error('Error creating doctor:', error);
      // Return mock created doctor
      return {
        id: Date.now(),
        ...doctorData,
        created_at: new Date().toISOString()
      };
    }
  },

  // Admin endpoints
  getAdminDoctors: async () => {
    try {
      const response = await api.get('/admin/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin doctors:', error);
      return getFallbackData('/admin/doctors');
    }
  },

  getAdminSpecialities: async () => {
    try {
      const response = await api.get('/admin/specialities');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin specialities:', error);
      return getFallbackData('/admin/specialities');
    }
  },

  getAdminTimeSlots: async () => {
    try {
      const response = await api.get('/admin/time-slots');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin time slots:', error);
      return getFallbackData('/admin/time-slots');
    }
  },

  getAdminHealthPackages: async () => {
    try {
      const response = await api.get('/admin/health-packages');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin health packages:', error);
      return getFallbackData('/admin/health-packages');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return getFallbackData('/health');
    }
  }
};

export default apiServiceWithFallback;

