import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { THEMES, getThemePreference, setThemePreference, applyTheme } from '../utils/themeUtils'

// Create a context for theme state
const ThemeContext = createContext()

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => getThemePreference())
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const currentTheme = getThemePreference()
    return currentTheme === THEMES.DARK || 
      (currentTheme === THEMES.SYSTEM && 
       window.matchMedia && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  // Listen for theme change events
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.detail) {
        setTheme(event.detail.theme)
        setIsDarkMode(event.detail.isDarkMode)
      }
    }
    
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === THEMES.SYSTEM) {
        const newIsDarkMode = mediaQuery.matches
        setIsDarkMode(newIsDarkMode)
        
        // Force a re-application of the theme
        applyTheme(THEMES.SYSTEM)
      }
    }
    
    if (mediaQuery && typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Update theme preference
  const updateTheme = useCallback((newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) {
      console.error(`Invalid theme: ${newTheme}`)
      return
    }
    
    // Apply the theme first - this will trigger the themechange event
    setThemePreference(newTheme)
    
    // The state will be updated by the themechange event listener
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default useTheme
