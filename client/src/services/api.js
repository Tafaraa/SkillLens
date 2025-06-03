import axios from 'axios'

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    return Promise.reject(error)
  }
)

// API service methods
const apiService = {
  // File analysis
  analyzeFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post('/analyze/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // GitHub repository analysis
  analyzeGitHub: (repoUrl) => {
    return apiClient.post('/analyze/github', { repository_url: repoUrl })
  },
  
  // Health check
  healthCheck: () => {
    return apiClient.get('/health')
  }
}

export default apiService
