/**
 * API Client Utilities
 * Helper functions for making authenticated API requests
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/api/protected')
 * @param {string} token - Firebase ID token
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<object>} - Response data
 */
export const authenticatedRequest = async (endpoint, token, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
};

/**
 * Make a GET request
 */
export const get = async (endpoint, token) => {
  return authenticatedRequest(endpoint, token, { method: 'GET' });
};

/**
 * Make a POST request
 */
export const post = async (endpoint, token, data) => {
  return authenticatedRequest(endpoint, token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Make a PUT request
 */
export const put = async (endpoint, token, data) => {
  return authenticatedRequest(endpoint, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Make a DELETE request
 */
export const del = async (endpoint, token) => {
  return authenticatedRequest(endpoint, token, { method: 'DELETE' });
};

/**
 * Make a public request (no authentication)
 */
export const publicRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
};
