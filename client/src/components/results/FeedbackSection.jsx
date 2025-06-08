import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import FeedbackForm from '../FeedbackForm'

const FeedbackSection = ({ 
  analysisId, 
  isExpanded, 
  onToggleExpand 
}) => {
  const { isDarkMode } = useTheme()
  
  return (
    <div className={`mb-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div 
        className={`px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          <span className={`p-1 rounded-md mr-2 ${isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </span>
          Feedback
        </h3>
        {isExpanded ? 
          <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
          <ChevronRightIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
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
          <div className="px-4 py-5 sm:p-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Your feedback helps us improve our analysis and recommendations. Please let us know what you think!
              </p>
              <FeedbackForm analysisId={analysisId} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FeedbackSection


