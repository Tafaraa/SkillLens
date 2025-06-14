/**
 * Utility for consistent error handling across the application
 */

/**
 * Format error messages from API responses or exceptions
 * @param {Error} error - The error object
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  // First check if our API service has already created a user-friendly message
  if (error.userMessage) {
    return error.userMessage;
  }
  
  // If it's an API error with a response
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response
    
    if (status === 413) {
      return 'File size exceeds the maximum allowed limit (5MB).'
    }
    
    if (status === 415) {
      return 'Unsupported file type. Please upload a valid code file.'
    }
    
    if (status === 422 && data.detail) {
      // Handle validation errors
      if (Array.isArray(data.detail)) {
        return data.detail.map(err => typeof err === 'object' ? (err.msg || JSON.stringify(err)) : String(err)).join(', ')
      }
      
      // Convert object or any other type to string
      if (typeof data.detail === 'object') {
        return JSON.stringify(data.detail)
      }
      
      return String(data.detail)
    }
    
    if (status === 429) {
      return 'Too many requests. Please try again later.'
    }
    
    if (status >= 500) {
      return 'Server error. Please try again later.'
    }
    
    // Default error message with status code
    return data.detail || `Error ${status}: ${data.message || 'Unknown error'}`
  } 
  
  // Network errors
  if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
    return 'Unable to connect to the server. Please check that both the frontend and backend servers are running.'
  }
  
  // The request was made but no response was received
  if (error.request) {
    return 'No response from server. Please check your connection and try again.'
  }
  
  // Something happened in setting up the request that triggered an Error
  return error.message || 'An unexpected error occurred. Please try again.'
}

/**
 * Log errors to console with additional context
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = '') => {
  console.error(`Error in ${context}:`, error)
  
  // Could be extended to send errors to a monitoring service
}

export default {
  formatErrorMessage,
  logError
}
