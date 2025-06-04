import React, { useState } from 'react'
import useUserPreferences from '../hooks/useUserPreferences'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../hooks/useTheme.jsx'

const UserSettings = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode } = useTheme()
  const [preferences, updatePreferences] = useUserPreferences({
    showRecentAnalyses: true,
    showProgressCharts: true,
    defaultAnalysisTab: 'file' // 'file' or 'github'
  })

  const toggleSetting = (key) => {
    updatePreferences({ [key]: !preferences[key] })
  }

  const updateSetting = (key, value) => {
    updatePreferences({ [key]: value })
  }

  return (
    <div className="relative">
      {/* Settings button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-500 hover:text-indigo dark:text-gray-400 dark:hover:text-indigo focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1 transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="User settings"
        aria-expanded={isOpen ? "true" : "false"}
        aria-controls="settings-dropdown"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings dropdown */}
      <div 
        id="settings-dropdown"
        className={`origin-top-right absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-in-out transform ${isOpen ? 'opacity-100 scale-100 animate-slide-in' : 'opacity-0 scale-95 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-heading"
      >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 id="settings-heading" className="text-sm font-medium text-gray-900 dark:text-gray-100">User Settings</h3>
            </div>
            
            <div className="px-4 py-2">
              <div className="mb-4">
                <ThemeToggle />
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="showRecentAnalyses" className="text-sm text-gray-700 dark:text-gray-300">
                  Show Recent Analyses
                </label>
                <input
                  id="showRecentAnalyses"
                  type="checkbox"
                  checked={preferences.showRecentAnalyses}
                  onChange={() => toggleSetting('showRecentAnalyses')}
                  className="h-4 w-4 text-indigo focus:ring-2 focus:ring-blue-400 border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:checked:bg-indigo rounded transition-all duration-200 hover:scale-125 cursor-pointer"
                  aria-label="Show recent analyses"
                />
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="showProgressCharts" className="text-sm text-gray-700 dark:text-gray-300">
                  Show Progress Charts
                </label>
                <input
                  id="showProgressCharts"
                  type="checkbox"
                  checked={preferences.showProgressCharts}
                  onChange={() => toggleSetting('showProgressCharts')}
                  className="h-4 w-4 text-indigo focus:ring-2 focus:ring-blue-400 border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:checked:bg-indigo rounded transition-all duration-200 hover:scale-125 cursor-pointer"
                  aria-label="Show progress charts"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="defaultAnalysisTab" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Default Analysis Tab
                </label>
                <div className="relative">
                  <select
                    id="defaultAnalysisTab"
                    value={preferences.defaultAnalysisTab}
                    onChange={(e) => updateSetting('defaultAnalysisTab', e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 text-sm py-2 pl-3 pr-8 shadow-sm transition-all duration-200 ease-in-out hover:border-indigo hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:border-indigo bg-white cursor-pointer"
                    aria-label="Default analysis tab"
                  >
                    <option value="file" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">File Upload</option>
                    <option value="github" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">GitHub Repository</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo dark:text-indigo">
                    <svg className="fill-current h-4 w-4 transition-transform duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-sm text-center py-2 text-indigo hover:text-amber dark:text-indigo dark:hover:text-amber transition-all duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105 active:scale-95 font-button"
                aria-label="Close settings"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      
    </div>
  )
}

export default UserSettings
