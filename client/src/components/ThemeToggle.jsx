import React from 'react'
import { THEMES } from '../utils/themeUtils'
import { useTheme } from '../hooks/useTheme.jsx'

const ThemeToggle = () => {
  const { theme, updateTheme, isDarkMode } = useTheme()

  const handleThemeChange = (newTheme) => {
    updateTheme(newTheme)
  }

  return (
    <div className="flex items-center group transition-all duration-200 hover:scale-105">
      <span className="text-sm text-gray-700 dark:text-gray-300 mr-2 transition-all duration-200 group-hover:text-indigo dark:group-hover:text-indigo font-button">Theme:</span>
      <div className="relative inline-block w-24">
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-8 text-sm font-medium shadow-sm transition-all duration-200 ease-in-out hover:border-indigo hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-indigo text-gray-800 dark:text-gray-200 cursor-pointer font-button"
          aria-label="Select theme"
          id="theme-selector"
        >
          <option value={THEMES.LIGHT} className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer font-button">Light</option>
          <option value={THEMES.DARK} className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer font-button">Dark</option>
          <option value={THEMES.SYSTEM} className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer font-button">System</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo dark:text-indigo transition-all duration-200">
          <svg className="fill-current h-4 w-4 transition-transform duration-300 ease-in-out group-hover:rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ThemeToggle
