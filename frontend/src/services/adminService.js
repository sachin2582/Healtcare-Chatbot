/**
 * Admin Service
 * Handles all API calls for the admin panel
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const ADMIN_API_URL = process.env.REACT_APP_ADMIN_API_URL || `${API_BASE_URL}/admin`;

class AdminService {
  constructor() {
    this.baseUrl = ADMIN_API_URL;
  }

  // Generic request method
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

      // Handle empty responses
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

  // =============================================================================
  // DASHBOARD
  // =============================================================================

  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // =============================================================================
  // SPECIALITIES
  // =============================================================================

  async getSpecialities() {
    return this.request('/specialities');
  }

  async createSpeciality(specialityData) {
    return this.request('/specialities', {
      method: 'POST',
      body: JSON.stringify(specialityData),
    });
  }

  async updateSpeciality(specialityId, specialityData) {
    return this.request(`/specialities/${specialityId}`, {
      method: 'PUT',
      body: JSON.stringify(specialityData),
    });
  }

  async deleteSpeciality(specialityId) {
    return this.request(`/specialities/${specialityId}`, {
      method: 'DELETE',
    });
  }

  // =============================================================================
  // DOCTORS
  // =============================================================================

  async getDoctors() {
    return this.request('/doctors');
  }

  async createDoctor(doctorData) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  async updateDoctor(doctorId, doctorData) {
    return this.request(`/doctors/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  }

  async deleteDoctor(doctorId) {
    return this.request(`/doctors/${doctorId}`, {
      method: 'DELETE',
    });
  }

  async uploadDoctorImage(doctorId, file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(`/doctors/${doctorId}/image`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // =============================================================================
  // TIME SLOTS
  // =============================================================================

  async getDoctorTimeSlots(doctorId) {
    return this.request(`/doctors/${doctorId}/time-slots`);
  }

  async createTimeSlot(doctorId, timeSlotData) {
    return this.request(`/doctors/${doctorId}/time-slots`, {
      method: 'POST',
      body: JSON.stringify(timeSlotData),
    });
  }

  async updateTimeSlot(slotId, timeSlotData) {
    return this.request(`/time-slots/${slotId}`, {
      method: 'PUT',
      body: JSON.stringify(timeSlotData),
    });
  }

  async deleteTimeSlot(slotId) {
    return this.request(`/time-slots/${slotId}`, {
      method: 'DELETE',
    });
  }

  // =============================================================================
  // HEALTH PACKAGES
  // =============================================================================

  async getHealthPackages() {
    return this.request('/health-packages');
  }

  async createHealthPackage(packageData) {
    return this.request('/health-packages', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });
  }

  async updateHealthPackage(packageId, packageData) {
    return this.request(`/health-packages/${packageId}`, {
      method: 'PUT',
      body: JSON.stringify(packageData),
    });
  }

  async deleteHealthPackage(packageId) {
    return this.request(`/health-packages/${packageId}`, {
      method: 'DELETE',
    });
  }

  async uploadPackageImage(packageId, file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(`/health-packages/${packageId}/image`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // =============================================================================
  // HEALTH PACKAGE TESTS
  // =============================================================================

  async getPackageTests(packageId) {
    return this.request(`/health-packages/${packageId}/tests`);
  }

  async createPackageTest(packageId, testData) {
    return this.request(`/health-packages/${packageId}/tests`, {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async updatePackageTest(testId, testData) {
    return this.request(`/health-package-tests/${testId}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  async deletePackageTest(testId) {
    return this.request(`/health-package-tests/${testId}`, {
      method: 'DELETE',
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  // Get day name from number
  getDayName(dayNumber) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Unknown';
  }

  // Format time for display
  formatTime(timeString) {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  }

  // Format price for display
  formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone format
  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}

// Create and export singleton instance
const adminService = new AdminService();
export { adminService };


