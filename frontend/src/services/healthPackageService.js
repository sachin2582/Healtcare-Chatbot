/**
 * Service for health package functionality
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class HealthPackageService {
  /**
   * Get all health packages with optional filters
   */
  async getHealthPackages(filters = {}) {
    try {
      console.log('🔍 Fetching health packages with filters:', filters);
      
      const queryParams = new URLSearchParams();
      if (filters.ageGroup) queryParams.append('age_group', filters.ageGroup);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice);
      
      const url = `${API_BASE_URL}/health-packages${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch health packages: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Health packages data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching health packages:', error);
      throw error;
    }
  }

  /**
   * Get a specific health package with all its tests
   */
  async getHealthPackage(packageId) {
    try {
      console.log(`🔍 Fetching health package with ID: ${packageId}`);
      const response = await fetch(`${API_BASE_URL}/health-packages/${packageId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch health package: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Health package data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching health package:', error);
      throw error;
    }
  }

  /**
   * Book a health package
   */
  async bookHealthPackage(bookingData) {
    try {
      console.log('🚀 Booking health package:', bookingData);
      const response = await fetch(`${API_BASE_URL}/health-packages/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Booking error:', errorData);
        throw new Error(errorData.detail || 'Failed to book health package');
      }

      const data = await response.json();
      console.log('✅ Health package booked successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error booking health package:', error);
      throw error;
    }
  }
}

const healthPackageService = new HealthPackageService();
export default healthPackageService;
