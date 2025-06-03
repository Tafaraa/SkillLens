import { useState } from 'react'
import useUserPreferences from '../hooks/useUserPreferences'
import ThemeToggle from './ThemeToggle'

const UserSettings = () => {
  const [isOpen, setIsOpen] = useState(false)
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
        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-label="User settings"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings dropdown */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">User Settings</h3>
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
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
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
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="defaultAnalysisTab" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Default Analysis Tab
                </label>
                <select
                  id="defaultAnalysisTab"
                  value={preferences.defaultAnalysisTab}
                  onChange={(e) => updateSetting('defaultAnalysisTab', e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="file">File Upload</option>
                  <option value="github">GitHub Repository</option>
                </select>
              </div>
            </div>
            
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-sm text-center py-1 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSettings
