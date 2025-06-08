/**
 * Utility functions for working with browser storage (localStorage and sessionStorage)
 */

export const STORAGE_KEYS = {
  ANALYSIS_RESULTS: 'analysisResults',
  RECENT_ANALYSES: 'recentAnalyses',
  USER_PREFERENCES: 'userPreferences'
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export const saveToLocalStorage = (key, data) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {any} Stored data or null if not found
 */
export const getFromLocalStorage = (key) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null
  
  try {
    const item = localStorage.getItem(key)
    if (!item) return null
    
    // Handle case where the value might be a simple string rather than JSON
    try {
      return JSON.parse(item)
    } catch (parseError) {
      // If it's not valid JSON, return the raw string value
      return item
    }
  } catch (error) {
    console.error('Error getting from localStorage:', error)
    return null
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeFromLocalStorage = (key) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

/**
 * Save data to sessionStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export const saveToSessionStorage = (key, data) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return
  
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to sessionStorage:', error)
  }
}

/**
 * Get data from sessionStorage
 * @param {string} key - Storage key
 * @returns {any} Stored data or null if not found
 */
export const getFromSessionStorage = (key) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return null
  
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error getting from sessionStorage:', error)
    return null
  }
}

/**
 * Remove data from sessionStorage
 * @param {string} key - Storage key
 */
export const removeFromSessionStorage = (key) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return
  
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from sessionStorage:', error)
  }
}

// This function is implemented below

// This function is implemented as saveAnalysisResultsToSessionStorage below

/**
 * Save analysis results to localStorage
 * @param {Object} results - Analysis results
 * @param {File} [originalFile] - Original file for data science features
 */
export const saveAnalysisResults = (results, originalFile = null) => {
  try {
    // Validate results before saving
    if (!results) {
      console.error('Cannot save null or undefined analysis results')
      return
    }
    
    // Ensure skills array exists and is valid
    if (!results.skills || !Array.isArray(results.skills)) {
      console.warn('Analysis results have missing or invalid skills array, adding empty array')
      results.skills = []
    }
    
    // Log the data being saved
    console.log('Saving analysis results to local storage:', results)
    
    // Save to localStorage instead of sessionStorage for persistence
    saveToLocalStorage(STORAGE_KEYS.ANALYSIS_RESULTS, results)
    
    // Save the original file for data science features if provided
    if (originalFile && originalFile instanceof File) {
      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onload = function(e) {
        const base64data = e.target.result.split(',')[1] // Remove data URL prefix
        const fileData = {
          name: originalFile.name,
          type: originalFile.type,
          data: base64data
        }
        saveToLocalStorage('originalFile', JSON.stringify(fileData))
        console.log('Original file saved for data science features')
      }
      reader.readAsDataURL(originalFile)
    }
    
    // Also save to recent analyses in localStorage (keep last 5)
    const recentAnalyses = getFromLocalStorage(STORAGE_KEYS.RECENT_ANALYSES) || []
    
    // Add timestamp to results
    const resultsWithTimestamp = {
      ...results,
      timestamp: new Date().toISOString()
    }
    
    // Add to beginning of array and limit to 5 items
    const updatedRecent = [
      resultsWithTimestamp,
      ...recentAnalyses.filter(item => item.filename !== results.filename)
    ].slice(0, 5)
    
    saveToLocalStorage(STORAGE_KEYS.RECENT_ANALYSES, updatedRecent)
  } catch (error) {
    console.error('Error saving analysis results:', error)
  }
}

/**
 * Get analysis results from localStorage
 * @returns {Object|null} Analysis results or null if not found
 */
export const getAnalysisResults = () => {
  try {
    const results = getFromLocalStorage(STORAGE_KEYS.ANALYSIS_RESULTS)
    if (!results) {
      console.warn('No analysis results found in local storage')
      return null
    }
    
    console.log('Retrieved analysis results from local storage:', results)
    
    // Validate the retrieved data
    if (!results || typeof results !== 'object') {
      console.error('Invalid analysis results format in local storage')
      return null
    }
    
    // Ensure skills array exists
    if (!results.skills || !Array.isArray(results.skills)) {
      console.warn('Retrieved analysis results have missing or invalid skills array')
      results.skills = []
    }
    
    return results
  } catch (error) {
    console.error('Error getting analysis results from local storage:', error)
    return null
  }
}

/**
 * Get recent analyses from localStorage
 * @returns {Array} Recent analyses or empty array if none found
 */
export const getRecentAnalyses = () => {
  return getFromLocalStorage(STORAGE_KEYS.RECENT_ANALYSES) || []
}
