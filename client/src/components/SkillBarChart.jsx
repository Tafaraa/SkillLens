import React, { useContext } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { prepareBarChartData } from '../utils/chartUtils'
import { useTheme } from '../hooks/useTheme.jsx'

const SkillBarChart = ({ skills }) => {
  // Use utility function to transform skills data for bar chart
  const chartData = prepareBarChartData(skills)
  const { isDarkMode } = useTheme()

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 shadow-md rounded-md border`}>
          <p className="font-medium">{label}</p>
          <p className={`text-sm ${isDarkMode ? 'text-primary-300' : 'text-primary-600'}`}>Score: {payload[0].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
        />
        <XAxis 
          type="number" 
          domain={[0, 100]} 
          tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12 }}
          stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={100} 
          tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563', fontSize: 12 }}
          stroke={isDarkMode ? '#6B7280' : '#9CA3AF'}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          formatter={(value) => <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{value}</span>}
        />
        <Bar 
          dataKey="score" 
          fill={isDarkMode ? '#A78BFA' : '#8B5CF6'} 
          name="Skill Score" 
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SkillBarChart
