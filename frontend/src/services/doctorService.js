/**
 * Doctor Service
 * Handles all API calls related to doctors
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class DoctorService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async getDoctors() {
    return this.request('/doctors');
  }

  async getDoctor(doctorId) {
    return this.request(`/doctors/${doctorId}`);
  }

  async getDoctorsBySpeciality(specialityId) {
    return this.request(`/doctors/speciality/${specialityId}`);
  }

  async getDoctorTimeSlots(doctorId, date = null) {
    const endpoint = date ? `/doctors/${doctorId}/available-slots?date=${date}` : `/doctors/${doctorId}/time-slots`;
    return this.request(endpoint);
  }
}

// Create and export singleton instance
const doctorService = new DoctorService();
export default doctorService;
