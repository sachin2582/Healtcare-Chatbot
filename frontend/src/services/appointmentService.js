/**
 * Service for appointment booking functionality
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class AppointmentService {
  /**
   * Get all available specialities
   */
  async getSpecialities() {
    try {
      console.log('🔍 Fetching specialities from:', `${API_BASE_URL}/specialities`);
      const response = await fetch(`${API_BASE_URL}/specialities`);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch specialities: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Specialities data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching specialities:', error);
      throw error;
    }
  }

  /**
   * Get doctors by speciality ID
   */
  async getDoctorsBySpeciality(specialityId) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/speciality/${specialityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  /**
   * Get doctor details by ID
   */
  async getDoctor(doctorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for a doctor on a specific date
   */
  async getAvailableSlots(doctorId, date) {
    try {
      console.log(`🔍 Fetching available slots for doctor ${doctorId} on ${date}`);
      // Try the main endpoint first, fallback to test endpoint
      let response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/available-slots/${date}`);
      
      if (!response.ok) {
        console.log('🔄 Main endpoint failed, trying test endpoint...');
        response = await fetch(`${API_BASE_URL}/test-time-slots/${doctorId}/${date}`);
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch available slots: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Available slots received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching available slots:', error);
      throw error;
    }
  }

  /**
   * Book an appointment
   */
  async bookAppointment(bookingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to book appointment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
