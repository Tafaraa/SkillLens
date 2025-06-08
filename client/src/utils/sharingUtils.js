/**
 * Utility functions for handling shared analysis reports
 */

/**
 * Retrieves a shared analysis report by its ID
 * @param {string} reportId - The ID of the shared report
 * @returns {Object|null} The shared report data or null if not found
 */
export const getSharedAnalysis = (reportId) => {
  try {
    // Get shared reports from localStorage
    const sharedReports = JSON.parse(localStorage.getItem('sharedReports') || '{}');
    
    // Return the specific report if it exists
    return sharedReports[reportId] || null;
  } catch (error) {
    console.error('Error retrieving shared analysis:', error);
    return null;
  }
};

/**
 * Saves a report for sharing
 * @param {string} reportId - The ID to use for the shared report
 * @param {Object} reportData - The report data to share
 * @returns {boolean} Whether the save was successful
 */
export const saveSharedAnalysis = (reportId, reportData) => {
  try {
    // Get existing shared reports
    const sharedReports = JSON.parse(localStorage.getItem('sharedReports') || '{}');
    
    // Add timestamp to the report
    const reportWithTimestamp = {
      ...reportData,
      sharedAt: new Date().toISOString()
    };
    
    // Save the new report
    sharedReports[reportId] = reportWithTimestamp;
    localStorage.setItem('sharedReports', JSON.stringify(sharedReports));
    
    return true;
  } catch (error) {
    console.error('Error saving shared analysis:', error);
    return false;
  }
};

/**
 * Removes a shared report
 * @param {string} reportId - The ID of the report to remove
 * @returns {boolean} Whether the removal was successful
 */
export const removeSharedAnalysis = (reportId) => {
  try {
    const sharedReports = JSON.parse(localStorage.getItem('sharedReports') || '{}');
    delete sharedReports[reportId];
    localStorage.setItem('sharedReports', JSON.stringify(sharedReports));
    return true;
  } catch (error) {
    console.error('Error removing shared analysis:', error);
    return false;
  }
}; 