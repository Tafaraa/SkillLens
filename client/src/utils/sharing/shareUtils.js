/**
 * Utilities for sharing analysis results
 */
import { v4 as uuidv4 } from 'uuid';
import { saveToLocalStorage, getFromLocalStorage } from '../storageUtils';
import { STORAGE_KEYS } from '../constants';

/**
 * Generate a unique ID for sharing
 * @returns {string} Unique ID
 */
export const generateShareId = () => {
  return uuidv4().substring(0, 8); // Use first 8 characters of UUID for shorter URLs
};

/**
 * Save analysis for sharing
 * @param {Object} analysis - Analysis results to share
 * @returns {string} Share ID
 */
export const shareAnalysis = (analysis) => {
  // Generate a unique ID for this shared analysis
  const shareId = generateShareId();
  
  // Get existing shared analyses
  const sharedAnalyses = getFromLocalStorage(STORAGE_KEYS.SHARED_ANALYSES) || {};
  
  // Add this analysis to shared analyses with timestamp
  sharedAnalyses[shareId] = {
    ...analysis,
    sharedAt: new Date().toISOString()
  };
  
  // Save back to localStorage
  saveToLocalStorage(STORAGE_KEYS.SHARED_ANALYSES, sharedAnalyses);
  
  return shareId;
};

/**
 * Get a shared analysis by ID
 * @param {string} shareId - Share ID
 * @returns {Object|null} Shared analysis or null if not found
 */
export const getSharedAnalysis = (shareId) => {
  const sharedAnalyses = getFromLocalStorage(STORAGE_KEYS.SHARED_ANALYSES) || {};
  return sharedAnalyses[shareId] || null;
};

/**
 * Generate a shareable URL for an analysis
 * @param {string} shareId - Share ID
 * @returns {string} Shareable URL
 */
export const getShareableUrl = (shareId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/report/${shareId}`;
};

/**
 * Delete a shared analysis by ID
 * @param {string} shareId - Share ID
 * @returns {boolean} Success status
 */
export const deleteSharedAnalysis = (shareId) => {
  try {
    const sharedAnalyses = getFromLocalStorage(STORAGE_KEYS.SHARED_ANALYSES) || {};
    
    if (!sharedAnalyses[shareId]) {
      return false;
    }
    
    delete sharedAnalyses[shareId];
    saveToLocalStorage(STORAGE_KEYS.SHARED_ANALYSES, sharedAnalyses);
    return true;
  } catch (error) {
    console.error('Error deleting shared analysis:', error);
    return false;
  }
};
