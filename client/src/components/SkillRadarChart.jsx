import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts'
import { prepareRadarChartData } from '../utils/chartUtils'

const SkillRadarChart = ({ skills }) => {
  // Use utility function to transform skills data for radar chart
  const chartData = prepareRadarChartData(skills)

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">Category: {payload[0].payload.category}</p>
          <p className="text-sm text-primary-600">Score: {payload[0].value.toFixed(0)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={5} />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="#0EA5E9"
          fill="#0EA5E9"
          fillOpacity={0.6}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default SkillRadarChart
