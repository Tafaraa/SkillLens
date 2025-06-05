import React from 'react'
import { useTheme } from '../../hooks/useTheme.jsx'
import { ShareIcon, DocumentArrowDownIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const ResultsHeader = ({ 
  title, 
  filename, 
  date, 
  onShare, 
  onExport, 
  onPreview,
  isExporting,
  isPreviewing
}) => {
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`mb-6 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center mb-2">
            <button
              onClick={() => navigate('/analyze')}
              className={`inline-flex items-center mr-3 px-2 py-1 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors duration-200`}
              aria-label="Go back to analyze page"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title || 'Analysis Results'}</h1>
          </div>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-4">
            {filename && (
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                {filename}
              </div>
            )}
            {date && (
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {formatDate(date)}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={onShare}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
          >
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </button>
          <button
            onClick={onPreview}
            disabled={isPreviewing || isExporting}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
              isPreviewing || isExporting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : `text-white ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200`
            }`}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            {isPreviewing ? 'Opening Preview...' : 'Preview'}
          </button>
          <button
            onClick={onExport}
            disabled={isExporting || isPreviewing}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
              isExporting || isPreviewing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : `text-white ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`
            }`}
          >
            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultsHeader
