import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const UploadSummarySection = ({ 
  uploadSummary, 
  isExpanded, 
  onToggleExpand,
  isLoading = false
}) => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`mb-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div 
        className={`px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          <span className={`p-1 rounded-md mr-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          Upload Analysis Summary
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
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
              </div>
            ) : uploadSummary ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File Statistics */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">File Statistics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Files</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {uploadSummary.total_files}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lines of Code</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {uploadSummary.lines_of_code.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Processing Time</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {(uploadSummary.processing_time_ms / 1000).toFixed(2)}s
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Language Distribution */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Language Distribution</h4>
                  {Object.keys(uploadSummary.most_used_languages).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(uploadSummary.most_used_languages)
                        .sort(([, a], [, b]) => b - a)
                        .map(([language, lines], index) => {
                          // Calculate percentage
                          const percentage = Math.round((lines / uploadSummary.lines_of_code) * 100);
                          
                          // Get color based on index
                          const colors = [
                            'bg-blue-500 dark:bg-blue-600',
                            'bg-green-500 dark:bg-green-600',
                            'bg-purple-500 dark:bg-purple-600',
                            'bg-yellow-500 dark:bg-yellow-600',
                            'bg-red-500 dark:bg-red-600',
                          ];
                          
                          const color = colors[index % colors.length];
                          
                          return (
                            <div key={language} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-medium text-gray-700 dark:text-gray-300">{language}</span>
                                <span className="text-gray-500 dark:text-gray-400">{lines.toLocaleString()} lines ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`${color} h-2 rounded-full`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No language data available
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Upload analysis data not available
              </div>
            )}
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Data Science Insights</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This analysis uses advanced algorithms to process your code in real-time, providing instant insights without storing any of your code on our servers. The language detection and line counting are performed using statistical analysis techniques commonly used in data science applications.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default UploadSummarySection


