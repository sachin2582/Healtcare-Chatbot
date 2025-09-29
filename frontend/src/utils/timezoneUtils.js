/**
 * Timezone utilities for frontend
 */

/**
 * Convert UTC timestamp to local time for display
 * @param {string} utcTimestamp - UTC timestamp string
 * @returns {string} - Local time formatted string
 */
export const formatTimestampForDisplay = (utcTimestamp) => {
  if (!utcTimestamp) return '';
  
  try {
    const date = new Date(utcTimestamp);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return utcTimestamp;
  }
};

/**
 * Format date for display in local timezone
 * @param {string} utcTimestamp - UTC timestamp string
 * @returns {string} - Formatted date string
 */
export const formatDateForDisplay = (utcTimestamp) => {
  if (!utcTimestamp) return '';
  
  try {
    const date = new Date(utcTimestamp);
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return utcTimestamp;
  }
};

/**
 * Format time for display in local timezone
 * @param {string} utcTimestamp - UTC timestamp string
 * @returns {string} - Formatted time string
 */
export const formatTimeForDisplay = (utcTimestamp) => {
  if (!utcTimestamp) return '';
  
  try {
    const date = new Date(utcTimestamp);
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return utcTimestamp;
  }
};

/**
 * Get current local time
 * @returns {Date} - Current local time
 */
export const getCurrentLocalTime = () => {
  return new Date();
};

/**
 * Get timezone offset in hours
 * @returns {number} - Timezone offset in hours
 */
export const getTimezoneOffset = () => {
  return new Date().getTimezoneOffset() / -60;
};

/**
 * Check if a timestamp is in the past
 * @param {string} timestamp - Timestamp to check
 * @returns {boolean} - True if timestamp is in the past
 */
export const isPastTimestamp = (timestamp) => {
  if (!timestamp) return false;
  
  try {
    const date = new Date(timestamp);
    return date < new Date();
  } catch (error) {
    console.error('Error checking timestamp:', error);
    return false;
  }
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string} timestamp - Timestamp to format
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};
