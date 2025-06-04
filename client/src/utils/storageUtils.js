/**
 * Utility functions for working with browser storage (localStorage and sessionStorage)
 */

const STORAGE_KEYS = {
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
 * Save analysis results to sessionStorage
 * @param {Object} results - Analysis results
 */
export const saveAnalysisResults = (results) => {
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
    console.log('Saving analysis results to session storage:', results)
    
    // Save to session storage
    saveToSessionStorage(STORAGE_KEYS.ANALYSIS_RESULTS, results)
    
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
 * Get analysis results from sessionStorage
 * @returns {Object|null} Analysis results or null if not found
 */
export const getAnalysisResults = () => {
  try {
    const results = getFromSessionStorage(STORAGE_KEYS.ANALYSIS_RESULTS)
    if (!results) {
      console.warn('No analysis results found in session storage')
      return null
    }
    
    console.log('Retrieved analysis results from session storage:', results)
    
    // Validate the retrieved data
    if (!results || typeof results !== 'object') {
      console.error('Invalid analysis results format in session storage')
      return null
    }
    
    // Ensure skills array exists
    if (!results.skills || !Array.isArray(results.skills)) {
      console.warn('Retrieved analysis results have missing or invalid skills array')
      results.skills = []
    }
    
    return results
  } catch (error) {
    console.error('Error getting analysis results from session storage:', error)
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

export default {
  STORAGE_KEYS,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToSessionStorage,
  getFromSessionStorage,
  removeFromSessionStorage,
  saveAnalysisResults,
  getAnalysisResults,
  getRecentAnalyses
}
