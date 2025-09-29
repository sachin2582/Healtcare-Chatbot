// Chat Button Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ChatButtonService {
  // Get all active chat buttons
  async getActiveButtons() {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons/active`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching active chat buttons:', error);
      throw new Error(error.message || error.toString() || 'Failed to fetch active chat buttons');
    }
  }

  // Get all chat buttons (for admin)
  async getAllButtons() {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all chat buttons:', error);
      throw new Error(error.message || error.toString() || 'Failed to fetch chat buttons');
    }
  }

  // Get buttons by category
  async getButtonsByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons?category=${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching buttons by category:', error);
      throw new Error(error.message || error.toString() || 'Failed to fetch buttons by category');
    }
  }

  // Create a new button (admin)
  async createButton(buttonData) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buttonData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating chat button:', error);
      throw new Error(error.message || error.toString() || 'Failed to create chat button');
    }
  }

  // Update a button (admin)
  async updateButton(buttonId, buttonData) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons/${buttonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buttonData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating chat button:', error);
      throw new Error(error.message || error.toString() || 'Failed to update chat button');
    }
  }

  // Delete a button (admin)
  async deleteButton(buttonId) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons/${buttonId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting chat button:', error);
      throw new Error(error.message || error.toString() || 'Failed to delete chat button');
    }
  }

  // Toggle button status (admin)
  async toggleButtonStatus(buttonId) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons/${buttonId}/toggle`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error toggling button status:', error);
      throw new Error(error.message || error.toString() || 'Failed to toggle button status');
    }
  }

  // Get a specific button by ID
  async getButtonById(buttonId) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat-buttons/${buttonId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching button by ID:', error);
      throw new Error(error.message || error.toString() || 'Failed to fetch button');
    }
  }
}

export default new ChatButtonService();
