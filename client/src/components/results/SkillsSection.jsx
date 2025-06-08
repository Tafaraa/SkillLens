import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ChevronRightIcon, ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import SkillRadarChart from '../SkillRadarChart'
import SkillBarChart from '../SkillBarChart'
import { groupSkillsByCategory } from '../../utils/chartUtils'

const SkillsSection = ({ 
  skills, 
  isExpanded, 
  onToggleExpand 
}) => {
  const { isDarkMode } = useTheme()
  const [activeChartType, setActiveChartType] = useState('radar')
  const [hasValidSkills, setHasValidSkills] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  
  // Ensure skills is an array and validate it
  const skillsArray = Array.isArray(skills) ? skills : []
  const skillsByCategory = groupSkillsByCategory(skillsArray)
  
  // Validate skills data on component mount and when skills change
  useEffect(() => {
    console.log('SkillsSection received skills:', skills)
    
    if (!Array.isArray(skills)) {
      setErrorMessage('Skills data is not in the correct format')
      setHasValidSkills(false)
      return
    }
    
    if (skills.length === 0) {
      setErrorMessage('No skills detected in the analyzed code')
      setHasValidSkills(false)
      return
    }
    
    // Check if skills have the required properties
    const validSkills = skills.filter(skill => 
      skill && 
      typeof skill.name === 'string' && 
      skill.name.trim() !== '' && 
      typeof skill.score === 'number'
    )
    
    console.log('Valid skills for charts:', validSkills)
    
    if (validSkills.length === 0) {
      setErrorMessage('No valid skills found with required properties')
      setHasValidSkills(false)
      return
    }
    
    setHasValidSkills(true)
    setErrorMessage(null)
  }, [skills])
  
  return (
    <div className={`mb-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div 
        className={`px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          <span className={`p-1 rounded-md mr-2 ${isDarkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          Skills Analysis
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
            {/* Chart Type Selector */}
            <div className="mb-6 flex justify-center">
              <div className={`inline-flex rounded-md shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1`}>
                <button
                  type="button"
                  onClick={() => setActiveChartType('radar')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeChartType === 'radar'
                      ? `${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} shadow-sm`
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-650' : 'text-gray-700 hover:bg-gray-200'}`
                  } transition-colors duration-200`}
                >
                  Radar Chart
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChartType('bar')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeChartType === 'bar'
                      ? `${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} shadow-sm`
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-650' : 'text-gray-700 hover:bg-gray-200'}`
                  } transition-colors duration-200`}
                >
                  Bar Chart
                </button>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="h-96 mb-6">
              {errorMessage && (
                <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className={`h-5 w-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'} mr-2`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{errorMessage}</p>
                  </div>
                  <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Try uploading a different file or repository with more code to analyze.
                  </p>
                </div>
              )}
              
              {!errorMessage && activeChartType === 'radar' ? (
                <SkillRadarChart skills={skillsArray} />
              ) : !errorMessage ? (
                <SkillBarChart skills={skillsArray} />
              ) : null}
            </div>
            
            {/* Skills by Category */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills by Category</h4>
              
              {errorMessage && (
                <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-750 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                  No skill categories available. Try uploading a different file or repository.
                </div>
              )}
              
              {!errorMessage && Object.keys(skillsByCategory).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div 
                      key={category}
                      className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}
                    >
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">{category}</h5>
                      <ul className="space-y-2">
                        {categorySkills.map((skill, index) => {
                          const score = Math.round(skill.score * 100);
                          return (
                            <li key={index} className="flex items-center">
                              <div className="w-full">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                                  <span className={`text-xs font-semibold ${
                                    score >= 80 ? 'text-green-600 dark:text-green-400' :
                                    score >= 60 ? 'text-blue-600 dark:text-blue-400' :
                                    score >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {score}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      score >= 80 ? 'bg-green-500' :
                                      score >= 60 ? 'bg-blue-500' :
                                      score >= 40 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${score}%` }}
                                  ></div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No skill data available
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SkillsSection


