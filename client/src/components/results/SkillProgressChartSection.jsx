import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const SkillProgressChartSection = ({ 
  skillProgress, 
  isExpanded, 
  onToggleExpand,
  isLoading = false
}) => {
  const { isDarkMode } = useTheme()

  // Prepare data for the level distribution pie chart
  const getLevelDistributionData = () => {
    if (!skillProgress?.level_distribution) return [];
    
    return Object.entries(skillProgress.level_distribution).map(([name, value]) => ({
      name,
      value
    }));
  }

  // Prepare data for the frontend/backend comparison bar chart
  const getComparisonData = () => {
    if (!skillProgress) return [];
    
    return [
      {
        name: 'Frontend',
        value: skillProgress.frontend_avg || 0
      },
      {
        name: 'Backend',
        value: skillProgress.backend_avg || 0
      }
    ];
  }

  // Colors for the pie chart
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];
  
  // Colors for the bar chart
  const barColors = {
    Frontend: isDarkMode ? '#3B82F6' : '#2563EB',
    Backend: isDarkMode ? '#10B981' : '#059669'
  };

  return (
    <div className={`mb-6 rounded-lg shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div 
        className={`px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
        onClick={onToggleExpand}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
          <span className={`p-1 rounded-md mr-2 ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          Skill Progress Chart
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
            ) : skillProgress ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frontend vs Backend Comparison */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">Frontend vs Backend Skills</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getComparisonData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }} 
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }} 
                          label={{ 
                            value: 'Skill Level', 
                            angle: -90, 
                            position: 'insideLeft',
                            fill: isDarkMode ? '#D1D5DB' : '#4B5563'
                          }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                            color: isDarkMode ? '#F9FAFB' : '#111827'
                          }} 
                          formatter={(value) => [`${value}%`, 'Skill Level']}
                        />
                        <Legend wrapperStyle={{ color: isDarkMode ? '#D1D5DB' : '#4B5563' }} />
                        <Bar 
                          dataKey="value" 
                          name="Skill Level" 
                          radius={[4, 4, 0, 0]}
                        >
                          {getComparisonData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={barColors[entry.name]} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Skill Level Distribution */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-750' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">Skill Level Distribution</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getLevelDistributionData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {getLevelDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [value, name]}
                          contentStyle={{ 
                            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                            color: isDarkMode ? '#F9FAFB' : '#111827'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {getLevelDistributionData().map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                          <div 
                            className="w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                Skill progress data not available
              </div>
            )}
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">About Skill Progress</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This chart shows your current skill distribution based on the code you've uploaded. The frontend vs backend comparison highlights your relative strengths in each area, while the level distribution shows how your skills are spread across different proficiency levels.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SkillProgressChartSection


