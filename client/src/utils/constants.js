/**
 * Application-wide constants
 */

export const STORAGE_KEYS = {
  SHARED_ANALYSES: 'sharedAnalyses',
  USER_PREFERENCES: 'userPreferences',
  RECENT_ANALYSES: 'recentAnalyses'
};

export const PDF_CONFIG = {
  DEFAULT_FILENAME: 'skill-analysis',
  PAGE_FORMAT: 'a4',
  PAGE_ORIENTATION: 'portrait',
  UNIT: 'mm',
  PAGE_WIDTH: 210, // A4 width in mm
  PAGE_HEIGHT: 297, // A4 height in mm
  SCALE: 2, // Scale for better quality
  BACKGROUND_COLOR: '#ffffff'
};

export const DOCUMENT_METADATA = {
  TITLE: 'SkillLens Analysis Report',
  SUBJECT: 'Skill Analysis Results',
  AUTHOR: 'SkillLens',
  CREATOR: 'SkillLens Application'
};
