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
      // Add more specific information about server connection
      error.isServerConnectionError = true
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.detail || `Error ${error.response.status}: ${error.response.statusText}`
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server. Please try again later.'
      // Also mark as connection error
      error.isServerConnectionError = true
    }
    
    // Add user-friendly message to the error object
    error.userMessage = errorMessage
    
    return Promise.reject(error)
  }
)

// API service methods
const apiService = {
  // Get stored analysis results
  getAnalysisResults: () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null
      
      const item = localStorage.getItem('analysisResults')
      if (!item) return null
      
      // Parse the stored results
      const results = JSON.parse(item)
      
      // Validate the results
      if (!results || typeof results !== 'object') {
        console.error('Invalid analysis results format in local storage')
        return null
      }
      
      return results
    } catch (error) {
      console.error('Error getting analysis results:', error)
      return null
    }
  },
  
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
  
  // Health check with improved error handling
  healthCheck: async () => {
    console.log('Performing health check to:', `${API_URL}/health`)
    try {
      const response = await apiClient.get('/health', { timeout: 5000 }) // 5 second timeout for faster feedback
      console.log('Health check response:', response.data)
      return response
    } catch (error) {
      console.error('Health check failed:', error)
      // Add more specific error information
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        error.userMessage = 'Unable to connect to the backend server. Please ensure the server is running at ' + API_URL
        error.isServerConnectionError = true
      }
      throw error
    }
  },
  
  // Get mock data for offline development
  getMockData: (type) => {
    console.warn('Using mock data for', type)
    
    const mockData = {
      analysis: {
        id: 'mock-analysis-123',
        fileName: 'example.js',
        fileType: 'JavaScript',
        fileSize: '2.4 KB',
        timestamp: new Date().toISOString(),
        skills: [
          { name: 'JavaScript', score: 0.85, category: 'Frontend' },
          { name: 'React', score: 0.75, category: 'Frontend' },
          { name: 'CSS', score: 0.65, category: 'Frontend' },
          { name: 'HTML', score: 0.80, category: 'Frontend' },
          { name: 'Node.js', score: 0.60, category: 'Backend' }
        ],
        recommendations: [
          { title: 'Improve code organization', description: 'Consider using more modular components' },
          { title: 'Add more comments', description: 'Some functions lack proper documentation' },
          { title: 'Optimize performance', description: 'Consider memoizing expensive calculations' }
        ]
      },
      developerRank: {
        rank: 'Intermediate',
        percentile: 65,
        strengths: ['Frontend Development', 'UI Design'],
        areas_to_improve: ['Testing', 'Performance Optimization']
      },
      skillProgress: {
        data: [
          { name: 'Week 1', JavaScript: 0.5, React: 0.3, CSS: 0.6 },
          { name: 'Week 2', JavaScript: 0.6, React: 0.4, CSS: 0.65 },
          { name: 'Week 3', JavaScript: 0.7, React: 0.5, CSS: 0.7 },
          { name: 'Week 4', JavaScript: 0.85, React: 0.75, CSS: 0.65 }
        ]
      },
      uploadSummary: {
        totalFiles: 1,
        totalLines: 245,
        languages: [
          { name: 'JavaScript', percentage: 85 },
          { name: 'CSS', percentage: 15 }
        ],
        complexity: 'Medium'
      }
    }
    
    return mockData[type] || null
  },
  
  // Submit user feedback
  submitFeedback: ({ analysisId, rating, comment }) => {
    return apiClient.post('/feedback', {
      analysis_id: analysisId,
      rating,
      comment
    })
  },

  // NEW DATA SCIENCE FEATURES

  // Developer ranking analysis
  getDeveloperRank: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post('/api/developer_rank', formData, {
      headers: {
        'Content-Type': undefined, // Explicitly remove Content-Type for FormData
      }
    })
  },
  
  // Skill progress chart
  getSkillProgressChart: () => {
    return apiClient.post('/api/skill_progress_chart')
  },
  
  // Upload analysis summary
  getUploadSummary: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post('/api/upload_summary', formData, {
      headers: {
        'Content-Type': undefined, // Explicitly remove Content-Type for FormData
      }
    })
  },

  // Check password for access
  checkPassword: (password) => {
    return apiClient.post('/api/check-password', { password })
  }
}

export default apiService
