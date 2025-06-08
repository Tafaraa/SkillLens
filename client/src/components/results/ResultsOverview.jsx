import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const ResultsOverview = ({ 
  results, 
  isExpanded, 
  onToggleExpand 
}) => {
  const { isDarkMode } = useTheme()

  // Calculate overall score
  const calculateOverallScore = () => {
    if (!results?.skills || !Array.isArray(results.skills) || results.skills.length === 0) {
      return 0
    }
    
    const sum = results.skills.reduce((acc, skill) => acc + (skill.score || 0), 0)
    return Math.round((sum / results.skills.length) * 100)
  }

  // Get top skills
  const getTopSkills = () => {
    if (!results?.skills || !Array.isArray(results.skills)) {
      return []
    }
    
    return [...results.skills]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(skill => ({
        name: skill.name,
        score: Math.round(skill.score * 100)
      }))
  }

  const overallScore = calculateOverallScore()
  const topSkills = getTopSkills()

  return (
    <div className={`mb-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div 
        className={`px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          <span className={`p-1 rounded-md mr-2 ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          Analysis Overview
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Score */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Overall Score</h4>
                <div className="flex items-center">
                  <div className={`text-3xl font-bold ${
                    overallScore >= 80 ? 'text-green-600 dark:text-green-400' :
                    overallScore >= 60 ? 'text-blue-600 dark:text-blue-400' :
                    overallScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {overallScore}%
                  </div>
                  <div className="ml-2 flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        overallScore >= 80 ? 'bg-green-500' :
                        overallScore >= 60 ? 'bg-blue-500' :
                        overallScore >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${overallScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Top Skills */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Top Skills</h4>
                <ul className="space-y-2">
                  {topSkills.length > 0 ? (
                    topSkills.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className={`text-sm font-semibold ${
                          skill.score >= 80 ? 'text-green-600 dark:text-green-400' :
                          skill.score >= 60 ? 'text-blue-600 dark:text-blue-400' :
                          skill.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {skill.score}%
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 dark:text-gray-400">No skills data available</li>
                  )}
                </ul>
              </div>
              
              {/* Analysis Summary */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Summary</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {results?.summary || 
                   `This analysis identified ${results?.skills?.length || 0} skills across ${Object.keys(results?.skillsByCategory || {}).length || 0} categories. 
                   Review the detailed breakdown below for more insights.`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ResultsOverview


