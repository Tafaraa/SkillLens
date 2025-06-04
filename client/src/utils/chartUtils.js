/**
 * Utility functions for chart data transformations
 */

/**
 * Transform skills data for radar chart
 * @param {Array} skills - Array of skill objects
 * @returns {Array} Transformed data for radar chart
 */
export const prepareRadarChartData = (skills) => {
  // Validate input
  if (!Array.isArray(skills) || skills.length === 0) {
    console.warn('prepareRadarChartData received empty or invalid skills array')
    return []
  }
  
  try {
    return skills.map(skill => ({
      name: skill.name || 'Unnamed Skill',
      value: Math.round((skill.score || 0) * 100), // Convert 0-1 score to 0-100 percentage
      category: skill.category || 'General',
      fullData: skill // Keep the full data for tooltips
    }))
  } catch (error) {
    console.error('Error preparing radar chart data:', error)
    return []
  }
}

/**
 * Transform skills data for bar chart
 * @param {Array} skills - Array of skill objects
 * @returns {Array} Transformed data for bar chart
 */
export const prepareBarChartData = (skills) => {
  // Validate input
  if (!Array.isArray(skills) || skills.length === 0) {
    console.warn('prepareBarChartData received empty or invalid skills array')
    return []
  }
  
  try {
    return skills.map(skill => ({
      name: skill.name || 'Unnamed Skill',
      score: Math.round((skill.score || 0) * 100), // Convert 0-1 score to 0-100 percentage
      fullData: skill // Keep the full data for tooltips
    }))
  } catch (error) {
    console.error('Error preparing bar chart data:', error)
    return []
  }
}

/**
 * Group skills by category
 * @param {Array} skills - Array of skill objects
 * @returns {Object} Skills grouped by category
 */
export const groupSkillsByCategory = (skills) => {
  // Validate input
  if (!Array.isArray(skills) || skills.length === 0) {
    console.warn('groupSkillsByCategory received empty or invalid skills array')
    return {}
  }
  
  try {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'General'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    }, {})
  } catch (error) {
    console.error('Error grouping skills by category:', error)
    return {}
  }
}

/**
 * Get top skills based on score
 * @param {Array} skills - Array of skill objects
 * @param {number} limit - Maximum number of skills to return
 * @returns {Array} Top skills
 */
export const getTopSkills = (skills, limit = 5) => {
  return [...skills]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Get skills that need improvement (lowest scores)
 * @param {Array} skills - Array of skill objects
 * @param {number} limit - Maximum number of skills to return
 * @returns {Array} Skills needing improvement
 */
export const getSkillsNeedingImprovement = (skills, limit = 5) => {
  return [...skills]
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
}

export default {
  prepareRadarChartData,
  prepareBarChartData,
  groupSkillsByCategory,
  getTopSkills,
  getSkillsNeedingImprovement
}
