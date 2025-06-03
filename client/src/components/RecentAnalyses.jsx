import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecentAnalyses, saveAnalysisResults } from '../utils/storageUtils'
import useUserPreferences from '../hooks/useUserPreferences'

const RecentAnalyses = () => {
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [preferences] = useUserPreferences({ showRecentAnalyses: true })
  const navigate = useNavigate()

  useEffect(() => {
    // Get recent analyses from localStorage
    const analyses = getRecentAnalyses()
    setRecentAnalyses(analyses)
  }, [])

  const handleSelectAnalysis = (analysis) => {
    // Save the selected analysis to session storage and navigate to results
    saveAnalysisResults(analysis)
    navigate('/results')
  }

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }

  // If no recent analyses or user has disabled this feature, don't render anything
  if (recentAnalyses.length === 0 || !preferences.showRecentAnalyses) {
    return null
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-secondary-600">
        <h3 className="text-lg leading-6 font-medium text-white">Recent Analyses</h3>
        <p className="mt-1 max-w-2xl text-sm text-white opacity-80">
          Your previous code analysis results
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentAnalyses.map((analysis, index) => (
            <li key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <button
                onClick={() => handleSelectAnalysis(analysis)}
                className="w-full text-left px-4 py-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {analysis.filename || analysis.repository || 'Unnamed Analysis'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {analysis.timestamp ? formatDate(analysis.timestamp) : 'Unknown date'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                      {analysis.skills?.length || 0} skills detected
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RecentAnalyses
