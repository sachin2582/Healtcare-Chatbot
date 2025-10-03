const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class CityService {
  async getCities() {
    try {
      const response = await fetch(`${API_BASE_URL}/cities`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  async getAvailableCities() {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/available`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching available cities:', error);
      throw error;
    }
  }

  async getCity(cityId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/${cityId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching city:', error);
      throw error;
    }
  }
}

const cityService = new CityService();
export default cityService;
