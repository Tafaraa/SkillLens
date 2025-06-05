import axios from 'axios'

// Get API URL from environment variables or use default
// Use secure protocol when in production
const isProduction = import.meta.env.MODE === 'production'
// Check if we have an API URL from environment variables, otherwise use default
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? 'https://api.skilllens.com' : 'http://localhost:8000')

// Log the API URL for debugging
console.log('API URL:', API_URL)

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error)
    
    // Create user-friendly error message
    let errorMessage = 'An unexpected error occurred'
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Unable to connect to the server. Please check your connection and try again.'
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.detail || `Error ${error.response.status}: ${error.response.statusText}`
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. Please try again later.'
    }
    
    // Add user-friendly message to the error object
    error.userMessage = errorMessage
    
    return Promise.reject(error)
  }
)

// API service methods
const apiService = {
  // File analysis
  analyzeFile: (file) => {
    // Create a new FormData instance
    const formData = new FormData()
    
    // Append the file with the correct field name expected by the backend
    formData.append('file', file)
    
    console.log('API Service: Sending file for analysis:', file.name)
    
    // When sending multipart/form-data, let the browser set the Content-Type header
    // with the correct boundary parameter
    return apiClient.post('/analyze/file', formData, {
      headers: {
        'Content-Type': undefined, // Explicitly remove Content-Type for FormData
      }
    })
  },
  
  // GitHub repository analysis
  analyzeGitHub: (repoUrl) => {
    return apiClient.post('/analyze/github', { repository_url: repoUrl })
  },
  
  // Health check
  healthCheck: () => {
    console.log('Performing health check to:', `${API_URL}/health`)
    return apiClient.get('/health')
  },
  
  // Submit user feedback
  submitFeedback: ({ analysisId, rating, comment }) => {
    return apiClient.post('/feedback', {
      analysis_id: analysisId,
      rating,
      comment
    })
  }
}

export default apiService
