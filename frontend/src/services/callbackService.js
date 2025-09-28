import api from './api';

class CallbackService {
  /**
   * Create a new callback request
   * @param {Object} callbackData - The callback request data
   * @param {string} callbackData.mobile_number - Mobile number
   * @param {string} [callbackData.preferred_time] - Preferred callback time
   * @param {string} [callbackData.notes] - Additional notes
   * @returns {Promise<Object>} Response with callback request details
   */
  async createCallbackRequest(callbackData) {
    try {
      const response = await api.post('/callback-requests', callbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating callback request:', error);
      throw error;
    }
  }

  /**
   * Get all callback requests (admin function)
   * @param {Object} [filters] - Optional filters
   * @param {string} [filters.status] - Filter by status
   * @returns {Promise<Array>} List of callback requests
   */
  async getCallbackRequests(filters = {}) {
    try {
      const response = await api.get('/callback-requests', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching callback requests:', error);
      throw error;
    }
  }

  /**
   * Update a callback request status (admin function)
   * @param {number} callbackId - Callback request ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated callback request
   */
  async updateCallbackRequest(callbackId, updateData) {
    try {
      const response = await api.put(`/callback-requests/${callbackId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating callback request:', error);
      throw error;
    }
  }

  /**
   * Validate mobile number format
   * @param {string} mobileNumber - Mobile number to validate
   * @returns {Object} Validation result with isValid and message
   */
  validateMobileNumber(mobileNumber) {
    if (!mobileNumber) {
      return { isValid: false, message: 'Mobile number is required' };
    }

    // Remove all non-digit characters
    const digits = mobileNumber.replace(/\D/g, '');
    
    if (digits.length < 10) {
      return { isValid: false, message: 'Mobile number must have at least 10 digits' };
    }
    
    if (digits.length > 15) {
      return { isValid: false, message: 'Mobile number cannot have more than 15 digits' };
    }

    return { isValid: true, message: 'Valid mobile number' };
  }
}

const callbackService = new CallbackService();
export default callbackService;
