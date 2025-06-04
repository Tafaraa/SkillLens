import React from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts'
import { prepareRadarChartData } from '../utils/chartUtils'
import { useTheme } from '../hooks/useTheme.jsx'
import { motion } from 'framer-motion'

const SkillRadarChart = ({ skills }) => {
  // Use utility function to transform skills data for radar chart
  const chartData = prepareRadarChartData(skills)
  const { isDarkMode } = useTheme()

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
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid 
          stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
        />
        <PolarAngleAxis 
          dataKey="name" 
          tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12 }} 
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 100]} 
          tickCount={5} 
          tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
          stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
        />
        <Radar
          name="Skills"
          dataKey="value"
          stroke={isDarkMode ? '#38BDF8' : '#0EA5E9'}
          fill={isDarkMode ? '#38BDF8' : '#0EA5E9'}
          fillOpacity={0.6}
        />
        <Tooltip 
          content={<CustomTooltip />} 
          animationDuration={300}
          animationEasing="ease-out"
          wrapperStyle={{ outline: 'none' }}
        />
        <Legend 
          formatter={(value) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{value}</span>}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default SkillRadarChart
