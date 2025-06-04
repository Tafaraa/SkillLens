/**
 * Utility functions for handling theme preferences
 */
import { saveToLocalStorage, getFromLocalStorage } from './storageUtils'

const THEME_KEY = 'theme'
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

/**
 * Get the current theme preference
 * @returns {string} Current theme ('light', 'dark', or 'system')
 */
export const getThemePreference = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return THEMES.SYSTEM
    }
    return getFromLocalStorage(THEME_KEY) || THEMES.SYSTEM
  } catch (error) {
    console.error('Error getting theme preference:', error)
    return THEMES.SYSTEM
  }
}

/**
 * Set the theme preference
 * @param {string} theme - Theme to set ('light', 'dark', or 'system')
 */
export const setThemePreference = (theme) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return
  
  try {
    if (!Object.values(THEMES).includes(theme)) {
      console.error(`Invalid theme: ${theme}. Must be one of: ${Object.values(THEMES).join(', ')}`)
      return
    }
    
    saveToLocalStorage(THEME_KEY, theme)
    applyTheme(theme)
  } catch (error) {
    console.error('Error setting theme preference:', error)
  }
}

/**
 * Apply the theme to the document
 * @param {string} theme - Theme to apply ('light', 'dark', or 'system')
 */
export const applyTheme = (theme) => {
  // Check if window and document are defined (browser environment)
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  
  try {
    const root = window.document.documentElement
    const isDarkMode = theme === THEMES.DARK || 
      (theme === THEMES.SYSTEM && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    // Force a complete removal of theme classes first
    root.classList.remove('light', 'dark')
    
    // Apply the appropriate theme with a small delay to ensure DOM updates
    setTimeout(() => {
      if (theme === THEMES.SYSTEM) {
        // Use system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark')
          document.body.style.backgroundColor = '#111827' // gray-900
          document.body.style.color = '#f3f4f6' // gray-100
        } else {
          root.classList.add('light')
          document.body.style.backgroundColor = '#ffffff'
          document.body.style.color = '#111827' // gray-900
        }
      } else {
        // Use explicit preference
        root.classList.add(theme)
        
        if (theme === THEMES.DARK) {
          document.body.style.backgroundColor = '#111827' // gray-900
          document.body.style.color = '#f3f4f6' // gray-100
        } else {
          document.body.style.backgroundColor = '#ffffff'
          document.body.style.color = '#111827' // gray-900
        }
      }
      
      // Dispatch a custom event that components can listen for
      const themeChangeEvent = new CustomEvent('themechange', { 
        detail: { theme, isDarkMode } 
      })
      window.dispatchEvent(themeChangeEvent)
    }, 0)
  } catch (error) {
    console.error('Error applying theme:', error)
  }
}

/**
 * Initialize the theme based on saved preference or system default
 */
export const initializeTheme = () => {
  // Check if window is defined (browser environment)
  if (typeof window === 'undefined') return
  
  const savedTheme = getFromLocalStorage(THEME_KEY) || THEMES.SYSTEM
  
  // Apply theme immediately on page load
  applyTheme(savedTheme)
  
  // Add listener for system preference changes
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', () => {
        const currentTheme = getThemePreference()
        if (currentTheme === THEMES.SYSTEM) {
          applyTheme(THEMES.SYSTEM)
        }
      })
    }
    
    // Add a listener for storage changes (in case theme is changed in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === THEME_KEY) {
        applyTheme(event.newValue || THEMES.SYSTEM)
      }
    })
  } catch (error) {
    console.error('Error setting up theme listeners:', error)
  }
}

export default {
  THEMES,
  getThemePreference,
  setThemePreference,
  applyTheme,
  initializeTheme
}
