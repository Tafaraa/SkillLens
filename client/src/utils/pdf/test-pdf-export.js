/**
 * Test script for PDF export and preview functionality
 * This script can be used to verify that the PDF export and preview
 * functionality is working correctly with the read-only optimizations.
 */

import { exportToPdf } from './pdfGenerator';
import { previewPdf } from './pdfPreview';

/**
 * Test the PDF export functionality
 * @param {HTMLElement} element - The element to export
 */
const testPdfExport = async (element) => {
  console.log('Testing PDF export functionality...');
  
  try {
    // Test export to PDF
    console.log('Exporting to PDF...');
    await exportToPdf(element, 'SkillLens_Test_Export');
    console.log('PDF export successful!');
    
    // Test preview PDF
    console.log('Opening PDF preview...');
    await previewPdf(element, 'SkillLens_Test_Preview');
    console.log('PDF preview opened successfully!');
    
    return true;
  } catch (error) {
    console.error('Error testing PDF functionality:', error);
    return false;
  }
};

/**
 * Verify that interactive elements are removed
 * @param {HTMLElement} element - The element to check
 */
const verifyReadOnlyContent = (element) => {
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true);
  
  // Check for buttons
  const buttons = clone.querySelectorAll('button, .btn, [role="button"], input[type="button"], input[type="submit"]');
  const buttonCount = Array.from(buttons).filter(button => {
    // Exclude buttons inside recommendation links
    return !button.closest('.recommendation-link, .resource-link, a[href]');
  }).length;
  
  // Check for dropdowns
  const dropdowns = clone.querySelectorAll('select, .dropdown, .dropdown-menu, .dropdown-toggle');
  
  // Check for feedback sections
  const feedbackSections = clone.querySelectorAll('.feedback-section, .feedback-form, [id*="feedback"], [class*="feedback"]');
  
  // Check for sharing UI
  const sharingElements = clone.querySelectorAll('.share-button, .share-section, [id*="share"], [class*="share"]');
  
  // Check for forms
  const forms = clone.querySelectorAll('form, textarea, input:not([type="hidden"])');
  
  // Check for toggles
  const toggles = clone.querySelectorAll('.toggle, .switch, [role="switch"]');
  
  // Check for modals
  const modals = clone.querySelectorAll('.modal, dialog, [role="dialog"], [aria-modal="true"]');
  
  // Log results
  console.log('--- Interactive Elements Check ---');
  console.log(`Buttons (excluding in links): ${buttonCount}`);
  console.log(`Dropdowns: ${dropdowns.length}`);
  console.log(`Feedback sections: ${feedbackSections.length}`);
  console.log(`Sharing elements: ${sharingElements.length}`);
  console.log(`Forms: ${forms.length}`);
  console.log(`Toggles: ${toggles.length}`);
  console.log(`Modals: ${modals.length}`);
  
  // Check for recommendation links (these should still be present)
  const recommendationLinks = clone.querySelectorAll('a[href]');
  console.log(`Recommendation links: ${recommendationLinks.length}`);
  
  return {
    isReadOnly: (
      buttonCount === 0 &&
      dropdowns.length === 0 &&
      feedbackSections.length === 0 &&
      sharingElements.length === 0 &&
      forms.length === 0 &&
      toggles.length === 0 &&
      modals.length === 0
    ),
    hasRecommendationLinks: recommendationLinks.length > 0
  };
};

/**
 * Run a full test of the PDF functionality
 * @param {HTMLElement} element - The element to test
 */
export const runPdfTest = async (element) => {
  console.log('Running PDF functionality test...');
  
  // Check if the element is valid
  if (!element) {
    console.error('Element is required for testing');
    return false;
  }
  
  // Verify read-only content
  const { isReadOnly, hasRecommendationLinks } = verifyReadOnlyContent(element);
  console.log('Content is read-only:', isReadOnly);
  console.log('Has recommendation links:', hasRecommendationLinks);
  
  // Test PDF export and preview
  const exportResult = await testPdfExport(element);
  
  console.log('--- Test Results ---');
  console.log('Content is properly read-only:', isReadOnly);
  console.log('Recommendation links are preserved:', hasRecommendationLinks);
  console.log('PDF export and preview functionality:', exportResult ? 'PASSED' : 'FAILED');
  
  return isReadOnly && hasRecommendationLinks && exportResult;
};

// Export the test functions
export { testPdfExport, verifyReadOnlyContent };

// Example usage:
// import { runPdfTest } from './test-pdf-export';
// const reportElement = document.getElementById('report-content');
// runPdfTest(reportElement).then(result => {
//   console.log('Test passed:', result);
// });
