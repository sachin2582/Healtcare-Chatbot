/**
 * Patient Service - Handles all patient-related API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class PatientService {
  /**
   * Create a new patient
   */
  async createPatient(patientData) {
    try {
      console.log('🚀 Creating new patient:', patientData);
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to create patient: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Patient created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating patient:', error);
      throw error;
    }
  }

  /**
   * Get all patients with pagination
   */
  async getPatients(skip = 0, limit = 100) {
    try {
      console.log(`🔍 Fetching patients (skip: ${skip}, limit: ${limit})`);
      const response = await fetch(`${API_BASE_URL}/patients?skip=${skip}&limit=${limit}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch patients: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Patients fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
      throw error;
    }
  }

  /**
   * Get a specific patient by ID
   */
  async getPatient(patientId) {
    try {
      console.log(`🔍 Fetching patient with ID: ${patientId}`);
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch patient: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Patient fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching patient:', error);
      throw error;
    }
  }

  /**
   * Update a patient's information
   */
  async updatePatient(patientId, patientData) {
    try {
      console.log(`🔄 Updating patient ${patientId}:`, patientData);
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to update patient: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Patient updated successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating patient:', error);
      throw error;
    }
  }

  /**
   * Search patients by name, email, or phone
   */
  async searchPatients(query) {
    try {
      console.log(`🔍 Searching patients with query: ${query}`);
      const response = await fetch(`${API_BASE_URL}/patients/search/${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to search patients: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Patient search completed:', data);
      return data;
    } catch (error) {
      console.error('❌ Error searching patients:', error);
      throw error;
    }
  }

  /**
   * Get all appointments for a specific patient
   */
  async getPatientAppointments(patientId) {
    try {
      console.log(`🔍 Fetching appointments for patient ${patientId}`);
      const response = await fetch(`${API_BASE_URL}/patients/${patientId}/appointments`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch patient appointments: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Patient appointments fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching patient appointments:', error);
      throw error;
    }
  }
}

const patientService = new PatientService();
export default patientService;
export { patientService };
