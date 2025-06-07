/**
 * Utilities for sharing analysis results and generating PDFs
 * This file re-exports all functionality from the modular structure
 * for backward compatibility
 */

// Import from sharing module
import { 
  generateShareId,
  shareAnalysis,
  getSharedAnalysis,
  getShareableUrl,
  deleteSharedAnalysis
} from './sharing';

// Import from PDF module
import {
  generatePdfFromElement,
  exportToPdf,
  previewPdf
} from './pdf';

// Export all functions individually
export {
  generateShareId,
  shareAnalysis,
  getSharedAnalysis,
  getShareableUrl,
  deleteSharedAnalysis,
  generatePdfFromElement,
  exportToPdf,
  previewPdf
};

// Export as default object for backward compatibility
export default {
  generateShareId,
  shareAnalysis,
  getSharedAnalysis,
  getShareableUrl,
  deleteSharedAnalysis,
  generatePdfFromElement,
  exportToPdf,
  previewPdf
};
