import { useState, useEffect } from 'react'
import { getThemePreference, setThemePreference, THEMES } from '../utils/themeUtils'

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getThemePreference())

  useEffect(() => {
    // Update the theme state when the component mounts
    setTheme(getThemePreference())
  }, [])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setThemePreference(newTheme)
  }

  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Theme:</span>
      <div className="relative inline-block">
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 pl-3 pr-8 text-sm leading-tight focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          aria-label="Select theme"
        >
          <option value={THEMES.LIGHT}>Light</option>
          <option value={THEMES.DARK}>Dark</option>
          <option value={THEMES.SYSTEM}>System</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ThemeToggle
