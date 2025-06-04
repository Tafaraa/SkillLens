import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTheme } from '../../hooks/useTheme'
import { getRecentAnalyses, saveAnalysisResults } from '../../utils/storageUtils'
import useUserPreferences from '../../hooks/useUserPreferences'
import { formatDistanceToNow, format } from 'date-fns'

const RecentAnalysesSection = () => {
  const { isDarkMode } = useTheme()
  const [recentAnalyses, setRecentAnalyses] = useState([])
  const [preferences] = useUserPreferences({ showRecentAnalyses: true })
  const navigate = useNavigate()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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

  // Format date to readable string with relative time and exact time
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  // Format relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }
  
  // Format time of day (e.g., "3:42 PM")
  const formatTimeOfDay = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'h:mm a')
  }

  // If no recent analyses or user has disabled this feature, don't render anything
  if (recentAnalyses.length === 0 || !preferences.showRecentAnalyses) {
    return null
  }

  return (
    <section ref={ref} className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="px-6 py-5 bg-gradient-to-r from-primary-600 to-blue-600">
            <motion.h2 
              className="text-lg leading-6 font-medium text-white font-heading"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Recent Analyses
            </motion.h2>
            <motion.p 
              className="mt-1 max-w-2xl text-sm text-white opacity-80"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Previous code analysis results
            </motion.p>
          </div>
          
          <div className="max-h-96 overflow-y-auto overflow-x-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700" role="list">
              {recentAnalyses.map((analysis, index) => (
                <motion.li 
                  key={index} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                  whileHover={{ x: 5 }}
                >
                  <button
                    onClick={() => handleSelectAnalysis(analysis)}
                    className="w-full text-left px-4 py-6 sm:px-6 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 font-button transition-all duration-200"
                    aria-label={`View analysis for ${analysis.filename || analysis.repository || 'Unnamed Analysis'} from ${analysis.timestamp ? formatDate(analysis.timestamp) : 'Unknown date'}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 w-full overflow-hidden">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                          <svg className="h-6 w-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4 space-y-2">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {analysis.filename || analysis.repository || 'Unnamed Analysis'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {analysis.timestamp ? formatDate(analysis.timestamp) : 'Unknown date'}
                          </div>
                          {analysis.timestamp && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 max-w-full">
                                <svg className="mr-1.5 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8">
                                  <circle cx="4" cy="4" r="3" />
                                </svg>
                                <span className="whitespace-normal break-words">Analyzed {formatRelativeTime(analysis.timestamp)} at {formatTimeOfDay(analysis.timestamp)}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 sm:mt-0 pl-14 sm:pl-0">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                          {analysis.skills?.length || 0} skills detected
                        </div>
                        <svg className="h-5 w-5 text-gray-400 transition-all duration-200" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default RecentAnalysesSection
