import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const DeveloperRankSection = ({ 
  developerRank, 
  isExpanded, 
  onToggleExpand,
  isLoading = false
}) => {
  const { isDarkMode } = useTheme()

  // Helper function to get color based on rank
  const getRankColor = (rank) => {
    switch (rank?.toLowerCase()) {
      case 'expert':
        return isDarkMode ? 'text-purple-400' : 'text-purple-600'
      case 'advanced':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600'
      case 'intermediate':
        return isDarkMode ? 'text-green-400' : 'text-green-600'
      case 'beginner':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
      default:
        return isDarkMode ? 'text-gray-300' : 'text-gray-600'
    }
  }

  // Helper function to get background color based on rank
  const getRankBgColor = (rank) => {
    switch (rank?.toLowerCase()) {
      case 'expert':
        return isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
      case 'advanced':
        return isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
      case 'intermediate':
        return isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
      case 'beginner':
        return isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'
      default:
        return isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
    }
  }

  return (
    <div className={`mb-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div 
        className={`px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          <span className={`p-1 rounded-md mr-2 ${isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          Developer Ranking
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
            ) : developerRank ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Developer Rank */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Developer Rank</h4>
                  <div className={`text-3xl font-bold ${getRankColor(developerRank.rank)}`}>
                    {developerRank.rank || 'Unknown'}
                  </div>
                  <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${getRankBgColor(developerRank.rank)} ${getRankColor(developerRank.rank)}`}>
                    {developerRank.rank || 'Unknown'} Developer
                  </div>
                </div>
                
                {/* Complexity Score */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Complexity Score</h4>
                  <div className="flex items-center">
                    <div className={`text-3xl font-bold ${
                      developerRank.complexity_score >= 4.0 ? 'text-purple-600 dark:text-purple-400' :
                      developerRank.complexity_score >= 3.0 ? 'text-blue-600 dark:text-blue-400' :
                      developerRank.complexity_score >= 2.0 ? 'text-green-600 dark:text-green-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {developerRank.complexity_score.toFixed(1)}
                    </div>
                    <div className="ml-2 flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          developerRank.complexity_score >= 4.0 ? 'bg-purple-500' :
                          developerRank.complexity_score >= 3.0 ? 'bg-blue-500' :
                          developerRank.complexity_score >= 2.0 ? 'bg-green-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(developerRank.complexity_score / 5 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    Based on cyclomatic complexity analysis
                  </p>
                </div>
                
                {/* Diversity Score */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Tech Diversity</h4>
                  <div className="flex items-center">
                    <div className={`text-3xl font-bold ${
                      developerRank.diversity_score >= 8 ? 'text-purple-600 dark:text-purple-400' :
                      developerRank.diversity_score >= 5 ? 'text-blue-600 dark:text-blue-400' :
                      developerRank.diversity_score >= 3 ? 'text-green-600 dark:text-green-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {developerRank.diversity_score}
                    </div>
                    <div className="ml-2 flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          developerRank.diversity_score >= 8 ? 'bg-purple-500' :
                          developerRank.diversity_score >= 5 ? 'bg-blue-500' :
                          developerRank.diversity_score >= 3 ? 'bg-green-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.min(developerRank.diversity_score / 10 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                    Languages and frameworks detected
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Developer ranking data not available
              </div>
            )}
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">How is this calculated?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Developer ranking is based on two key metrics:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li><span className="font-medium">Complexity Score:</span> Measures the cyclomatic complexity of your code, indicating the sophistication of your programming logic.</li>
                <li><span className="font-medium">Tech Diversity:</span> Counts the number of different languages and frameworks you use, showing your technical versatility.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DeveloperRankSection


