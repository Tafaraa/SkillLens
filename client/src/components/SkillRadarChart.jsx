import React, { useState, useEffect } from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts'
import { prepareRadarChartData } from '../utils/chartUtils'
import { useTheme } from '../hooks/useTheme'
import { motion } from 'framer-motion'
import { QuestionMarkCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const SkillRadarChart = ({ skills }) => {
  // Handle null or undefined skills
  const safeSkills = skills || []
  
  // Use state to store processed chart data
  const [chartData, setChartData] = useState([])
  const { isDarkMode } = useTheme()
  const [showHelp, setShowHelp] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [error, setError] = useState(null)

  // Process skills data and check if we have valid data to display
  useEffect(() => {
    console.log('SkillRadarChart received skills:', skills)
    
    if (!Array.isArray(skills)) {
      setError('Skills data is not an array')
      setHasData(false)
      return
    }
    
    if (skills.length === 0) {
      setError('No skills detected in the analyzed code')
      setHasData(false)
      return
    }
    
    // Process the data
    try {
      const processedData = prepareRadarChartData(skills)
      console.log('Processed radar chart data:', processedData)
      setChartData(processedData)
      setHasData(processedData.length > 0)
      setError(null)
    } catch (err) {
      console.error('Error processing skills data for radar chart:', err)
      setError('Error processing skills data')
      setHasData(false)
    }
  }, [skills])

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const skill = payload[0].payload;
      const fullData = skill.fullData || {};
      const libraries = fullData.derivedFrom || [];

      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 shadow-lg rounded-md border max-w-xs`}
        >
          <p className="font-medium text-lg">{skill.name}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Category: {skill.category}</p>
          <p className={`text-sm ${isDarkMode ? 'text-primary-300' : 'text-primary-600'} font-medium mt-1`}>Score: {payload[0].value.toFixed(0)}%</p>
          
          {libraries.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                This was derived from use of:
              </p>
              <ul className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} list-disc pl-5`}>
                {libraries.map((lib, index) => (
                  <li key={index}>{lib}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )
    }
    return null
  }

  return (
    <div className="relative">
      {/* Chart description with toggle */}
      <div className="absolute top-0 right-0 z-10">
        <button 
          onClick={() => setShowHelp(prev => !prev)}
          className={`flex items-center text-xs ${isDarkMode ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'} transition-colors`}
          aria-label="Show chart explanation"
        >
          <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
          <span>What is this?</span>
        </button>
        
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute right-0 mt-2 p-3 rounded-md shadow-lg w-64 ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} text-sm z-20`}
          >
            <p className="font-medium mb-1">Skill Overview</p>
            <p className="text-xs mb-2">This radar chart provides a visual overview of your skills across different categories. The further a point is from the center, the higher your proficiency in that skill.</p>
            <p className="text-xs italic">Hover over each point to see detailed information about that skill.</p>
          </motion.div>
        )}
      </div>
      
      {error && (
        <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} mb-4`}>
          <div className="flex items-center">
            <ExclamationTriangleIcon className={`h-5 w-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'} mr-2`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{error}</p>
          </div>
          <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Try uploading a different file or repository with more code to analyze.
          </p>
        </div>
      )}
      
      {!hasData && !error ? (
        <div className={`flex flex-col items-center justify-center h-64 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-md p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>Waiting for skill data...</p>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm text-center mt-2`}>Upload a file or repository to analyze skills.</p>
        </div>
      ) : hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid 
              stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
            />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12, fontWeight: 500 }} 
              tickLine={{ stroke: isDarkMode ? '#6B7280' : '#9CA3AF' }}
              axisLine={{ strokeWidth: 1.5 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tickCount={5} 
              tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
              stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
              tickFormatter={(value) => `${value}%`}
            />
            <Radar
              name="Proficiency"
              dataKey="value"
              stroke={isDarkMode ? '#38BDF8' : '#0EA5E9'}
              fill={isDarkMode ? '#38BDF8' : '#0EA5E9'}
              fillOpacity={0.6}
              animationDuration={1200}
              animationEasing="ease-in-out"
            />
            <Tooltip 
              content={<CustomTooltip />} 
              animationDuration={300}
              animationEasing="ease-out"
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend 
              formatter={(value) => <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{value}</span>}
              iconSize={10}
              wrapperStyle={{ paddingTop: 10 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}

export default SkillRadarChart


