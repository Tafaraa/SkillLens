/**
 * Utility functions for handling theme preferences
 */
import { saveToLocalStorage, getFromLocalStorage } from './storageUtils'

const THEME_KEY = 'theme'
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

/**
 * Get the current theme preference
 * @returns {string} Current theme ('light', 'dark', or 'system')
 */
export const getThemePreference = () => {
  return getFromLocalStorage(THEME_KEY) || THEMES.SYSTEM
}

/**
 * Set the theme preference
 * @param {string} theme - Theme to set ('light', 'dark', or 'system')
 */
export const setThemePreference = (theme) => {
  if (!Object.values(THEMES).includes(theme)) {
    console.error(`Invalid theme: ${theme}. Must be one of: ${Object.values(THEMES).join(', ')}`)
    return
  }
  
  saveToLocalStorage(THEME_KEY, theme)
  applyTheme(theme)
}

/**
 * Apply the theme to the document
 * @param {string} theme - Theme to apply ('light', 'dark', or 'system')
 */
export const applyTheme = (theme) => {
  const root = window.document.documentElement
  
  // Remove any existing theme classes
  root.classList.remove('light', 'dark')
  
  // Apply the appropriate theme
  if (theme === THEMES.SYSTEM) {
    // Use system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark')
    } else {
      root.classList.add('light')
    }
  } else {
    // Use explicit preference
    root.classList.add(theme)
  }
}

/**
 * Initialize the theme based on saved preference or system default
 */
export const initializeTheme = () => {
  const savedTheme = getThemePreference()
  applyTheme(savedTheme)
  
  // Add listener for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = getThemePreference()
    if (currentTheme === THEMES.SYSTEM) {
      applyTheme(THEMES.SYSTEM)
    }
  })
}

export default {
  THEMES,
  getThemePreference,
  setThemePreference,
  applyTheme,
  initializeTheme
}
