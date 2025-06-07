import React from 'react'
import { useTheme } from '../../hooks/useTheme.jsx'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import RecommendationCard from '../RecommendationCard'

const RecommendationsSection = ({ 
  recommendations, 
  isExpanded, 
  onToggleExpand 
}) => {
  const { isDarkMode } = useTheme()
  
  // Ensure recommendations is an array and filter out any empty or invalid items
  let recommendationsArray = [];
  
  if (Array.isArray(recommendations) && recommendations.length > 0) {
    // Filter valid recommendations
    recommendationsArray = recommendations.filter(item => {
      return item && (typeof item.name === 'string' || typeof item.category === 'string');
    });
  }
  
  return (
    <div className={`mb-4 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div 
        className={`px-3 py-3 sm:px-4 flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <h3 className="text-base leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          <span className={`p-1 rounded-md mr-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </span>
          Learning Recommendations
        </h3>
        {isExpanded ? 
          <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
          <ChevronRightIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        }
      </div>

      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-200 dark:border-gray-700"
        >
          {Array.isArray(recommendationsArray) && recommendationsArray.length > 0 ? (
            <div className="p-2 sm:p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                {recommendationsArray.map((recommendation, index) => (
                  recommendation && <RecommendationCard 
                    key={index}
                    skill={recommendation}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-block p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                <svg className="h-8 w-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">No skill recommendations available</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                We couldn't identify any skills that need improvement in your current code analysis.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => window.location.href = '/analyze'}
                >
                  Try with different code
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default RecommendationsSection
