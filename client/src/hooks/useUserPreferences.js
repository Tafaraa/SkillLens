import { useState, useEffect } from 'react'
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storageUtils'

const PREFERENCES_KEY = 'userPreferences'

/**
 * Custom hook for managing user preferences
 * @param {Object} defaultPreferences - Default preferences to use if none are stored
 * @returns {[Object, Function]} - Current preferences and a function to update them
 */
export const useUserPreferences = (defaultPreferences = {}) => {
  const [preferences, setPreferences] = useState(() => {
    // Load preferences from localStorage on initial render
    const savedPreferences = getFromLocalStorage(PREFERENCES_KEY)
    return savedPreferences || defaultPreferences
  })

  // Update localStorage when preferences change
  useEffect(() => {
    saveToLocalStorage(PREFERENCES_KEY, preferences)
  }, [preferences])

  // Function to update preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }))
  }

  return [preferences, updatePreferences]
}

export default useUserPreferences
