/**
 * Utility functions for chart data transformations
 */

/**
 * Transform skills data for radar chart
 * @param {Array} skills - Array of skill objects
 * @returns {Array} Transformed data for radar chart
 */
export const prepareRadarChartData = (skills) => {
  return skills.map(skill => ({
    name: skill.name,
    value: Math.round(skill.score * 100), // Convert 0-1 score to 0-100 percentage
    category: skill.category,
    fullData: skill // Keep the full data for tooltips
  }))
}

/**
 * Transform skills data for bar chart
 * @param {Array} skills - Array of skill objects
 * @returns {Array} Transformed data for bar chart
 */
export const prepareBarChartData = (skills) => {
  return skills.map(skill => ({
    name: skill.name,
    score: Math.round(skill.score * 100), // Convert 0-1 score to 0-100 percentage
    fullData: skill // Keep the full data for tooltips
  }))
}

/**
 * Group skills by category
 * @param {Array} skills - Array of skill objects
 * @returns {Object} Skills grouped by category
 */
export const groupSkillsByCategory = (skills) => {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})
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
