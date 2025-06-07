/**
 * Core PDF generation utilities
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PDF_CONFIG, DOCUMENT_METADATA } from '../constants';
import { applyPdfStyling } from './pdfStyling';

/**
 * Generate PDF from element
 * @param {HTMLElement} element - Element to export
 * @returns {Promise<{pdf: jsPDF, imgData: string, imgWidth: number, imgHeight: number}>}
 */
export const generatePdfFromElement = async (element) => {
  if (!element) {
    throw new Error('Element not provided');
  }
  
  try {
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: PDF_CONFIG.PAGE_ORIENTATION,
      unit: PDF_CONFIG.UNIT,
      format: PDF_CONFIG.PAGE_FORMAT,
      compress: true
    });
    
    // Set up PDF document properties
    pdf.setProperties({
      title: DOCUMENT_METADATA.TITLE,
      subject: DOCUMENT_METADATA.SUBJECT,
      author: DOCUMENT_METADATA.AUTHOR,
      creator: DOCUMENT_METADATA.CREATOR
    });
    
    // Apply styling to the element - this includes cleanup, chart optimization, and light mode
    const { tempContainer, structuredContent } = applyPdfStyling(element);
    
    // Create a canvas from the styled content
    const canvas = await html2canvas(structuredContent, {
      scale: PDF_CONFIG.SCALE,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: PDF_CONFIG.BACKGROUND_COLOR
    });
    
    // Clean up the temporary elements
    document.body.removeChild(tempContainer);
    
    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit the canvas in A4
    const imgWidth = PDF_CONFIG.PAGE_WIDTH;
    const pageHeight = PDF_CONFIG.PAGE_HEIGHT;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // If content is longer than one page, add additional pages
    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight; // Starting position for the next page
      let pageCount = 1;
      
      while (heightLeft > 0) {
        pdf.addPage();
        pageCount++;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        
        // Add page number to each page
        addPageNumber(pdf, pageCount);
        
        heightLeft -= pageHeight;
        position -= pageHeight;
      }
      
      // Add page number to first page
      pdf.setPage(1);
      addPageNumber(pdf, 1);
    }
    
    return { pdf, imgData, imgWidth, imgHeight };
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Add page number to the PDF
 * @param {jsPDF} pdf - PDF document
 * @param {number} pageNumber - Page number to add
 */
const addPageNumber = (pdf, pageNumber) => {
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    `Page ${pageNumber}`, 
    pdf.internal.pageSize.getWidth() - 25, 
    pdf.internal.pageSize.getHeight() - 10
  );
};

/**
 * Export element to PDF
 * @param {HTMLElement|string} elementOrId - Element or ID of element to export
 * @param {string} filename - Filename for PDF
 * @returns {Promise<boolean>}
 */
export const exportToPdf = async (elementOrId, filename = `${PDF_CONFIG.DEFAULT_FILENAME}.pdf`) => {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  
  if (!element) {
    throw new Error(`Element ${typeof elementOrId === 'string' ? 'with ID "' + elementOrId + '"' : ''} not found`);
  }
  
  try {
    const { pdf } = await generatePdfFromElement(element);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};
