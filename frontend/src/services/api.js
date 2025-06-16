import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(` API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log(' Request Data:', config.data);
      }
    }

    return config;
  },
  (error) => {
    console.error(' Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response scenarios
API.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(` API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log(' Response Data:', response.data);
    }

    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      console.error(` API Error ${status}:`, data?.message || error.message);

      // Handle specific error cases
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.warn(' Unauthorized access - clearing authentication');
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - insufficient permissions
          console.warn(' Access forbidden - insufficient permissions');
          break;

        case 404:
          // Not found
          console.warn(' Resource not found');
          break;

        case 422:
          // Validation error
          console.warn(' Validation error:', data?.errors || data?.message);
          break;

        case 500:
          // Server error
          console.error(' Server error - please try again later');
          break;

        default:
          console.error(' Unexpected error:', status, data?.message);
      }

      // Enhance error object with user-friendly messages
      error.userMessage = getUserFriendlyErrorMessage(status, data?.message);

    } else if (error.request) {
      // Network error - no response received
      console.error(' Network Error:', error.message);
      error.userMessage = 'Network error. Please check your internet connection and try again.';

    } else {
      // Something else happened
      console.error(' Unexpected Error:', error.message);
      error.userMessage = 'An unexpected error occurred. Please try again.';
    }

    return Promise.reject(error);
  }
);

// Helper function to get user-friendly error messages
function getUserFriendlyErrorMessage(status, message) {
  const errorMessages = {
    400: 'Invalid request. Please check your input and try again.',
    401: 'Please log in to continue.',
    403: 'You don\'t have permission to perform this action.',
    404: 'The requested resource was not found.',
    422: message || 'Please check your input and try again.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
  };

  return errorMessages[status] || message || 'An error occurred. Please try again.';
}

// Helper functions for common API patterns
export const apiHelpers = {
  // Handle API calls with loading states
  async handleApiCall(apiFunction, setLoading = null) {
    try {
      if (setLoading) setLoading(true);
      const response = await apiFunction();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || error.message,
        details: error.response?.data
      };
    } finally {
      if (setLoading) setLoading(false);
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user data
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Format FormData for file uploads
  createFormData(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }
};

// Export configured axios instance as default
export default API;