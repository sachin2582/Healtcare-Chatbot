import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
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
      throw error;
    }
  },

  // Patient endpoints
  getPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  getPatient: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  },

  createPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
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
      throw error;
    }
  },

  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/doctor', doctorData);
      return response.data;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  },

  // Appointment endpoints
  getAppointments: async () => {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointment', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Document endpoints
  getDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  addDocument: async (documentData) => {
    try {
      const response = await api.post('/add-doc', documentData);
      return response.data;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  },

  getDocument: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  // Questionnaire endpoints
  getQuestionnaires: async (category = null) => {
    try {
      const response = await api.get('/questionnaires', {
        params: category ? { category } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      throw error;
    }
  },

  getQuestionnaire: async (id) => {
    try {
      const response = await api.get(`/questionnaires/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
      throw error;
    }
  },

  createQuestionnaire: async (questionnaireData) => {
    try {
      const response = await api.post('/questionnaires', questionnaireData);
      return response.data;
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      throw error;
    }
  },

  getQuestionnaireCategories: async () => {
    try {
      const response = await api.get('/questionnaires/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching questionnaire categories:', error);
      throw error;
    }
  },

  populateQuestionnaires: async () => {
    try {
      const response = await api.post('/populate-questionnaires');
      return response.data;
    } catch (error) {
      console.error('Error populating questionnaires:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

export default apiService;
export { api };
