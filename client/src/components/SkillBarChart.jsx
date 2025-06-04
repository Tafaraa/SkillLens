import React, { useState, useEffect } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts'
import { prepareBarChartData } from '../utils/chartUtils'
import { useTheme } from '../hooks/useTheme.jsx'
import { motion } from 'framer-motion'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const SkillBarChart = ({ skills }) => {
  // Use utility function to transform skills data for bar chart
  const chartData = prepareBarChartData(skills || [])
  const { isDarkMode } = useTheme()
  const [showHelp, setShowHelp] = useState(false)
  const [hasData, setHasData] = useState(false)
  
  // Check if we have valid data to display
  useEffect(() => {
    console.log('SkillBarChart received skills:', skills)
    setHasData(Array.isArray(skills) && skills.length > 0 && Array.isArray(chartData) && chartData.length > 0)
  }, [skills, chartData])

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const skill = payload[0].payload;
      const fullData = skill.fullData || {};
      const libraries = fullData.derivedFrom || [];
      
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 shadow-lg rounded-md border max-w-xs`}
        >
          <p className="font-medium text-lg">{label}</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Category: {skill.category || 'General'}</p>
          <p className={`text-sm ${isDarkMode ? 'text-primary-300' : 'text-primary-600'} font-medium mt-1`}>Proficiency: {payload[0].value}%</p>
          
          {libraries && libraries.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Based on your use of:
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Skill Proficiency</h3>
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Toggle help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {showHelp && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-300">
          <p>This bar chart shows your proficiency level in various skills. The higher the bar, the more proficient you are in that skill.</p>
        </div>
      )}
      
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] bg-gray-50 dark:bg-gray-800 rounded-md p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-center">No skill data available to display.</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-2">Try uploading a different file or repository.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12 }}
              stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12, fontWeight: 500 }}
              stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: isDarkMode ? 'rgba(55, 65, 81, 0.4)' : 'rgba(229, 231, 235, 0.4)' }}
            />
            <Legend 
              formatter={(value) => <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{value}</span>}
              iconSize={10}
              wrapperStyle={{ paddingTop: 10 }}
            />
            <Bar 
              dataKey="score" 
              fill={isDarkMode ? '#A78BFA' : '#8B5CF6'} 
              name="Proficiency" 
              animationDuration={1200}
              animationEasing="ease-in-out"
              radius={[0, 4, 4, 0]}
            >
              <LabelList 
                dataKey="score" 
                position="right" 
                formatter={(value) => `${value}%`}
                fill={isDarkMode ? '#D1D5DB' : '#4B5563'}
                style={{ fontSize: '11px', fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default SkillBarChart
