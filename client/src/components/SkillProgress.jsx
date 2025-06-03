import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getRecentAnalyses } from '../utils/storageUtils'

const SkillProgress = ({ skillName }) => {
  const [progressData, setProgressData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get all recent analyses
    const analyses = getRecentAnalyses()
    
    if (analyses.length > 0) {
      // Extract the skill progress data for the specified skill
      const data = analyses
        .filter(analysis => analysis.timestamp) // Ensure we have a timestamp
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort by date
        .map(analysis => {
          // Find the skill in this analysis
          const skill = analysis.skills?.find(s => s.name === skillName)
          
          return {
            date: new Date(analysis.timestamp).toLocaleDateString(),
            score: skill ? skill.score : 0,
            analysis: analysis.filename || analysis.repository || 'Unnamed Analysis'
          }
        })
      
      setProgressData(data)
    }
    
    setIsLoading(false)
  }, [skillName])

  // If no data or still loading, show a message
  if (isLoading) {
    return <div className="text-center py-4">Loading progress data...</div>
  }
  
  if (progressData.length <= 1) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Not enough historical data to show progress for {skillName}.
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {skillName} Progress Over Time
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={progressData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value) => [`${value}%`, 'Score']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              name="Skill Score" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SkillProgress
