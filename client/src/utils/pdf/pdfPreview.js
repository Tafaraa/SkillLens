/**
 * PDF preview utilities
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PDF_CONFIG } from '../constants';
import { fixEmojiAndSvgSizing, forceLightMode } from './pdfStyling';

/**
 * Preview PDF in a new window
 * @param {HTMLElement|string} elementOrId - Element or ID of element to preview
 * @param {string} filename - Filename for PDF preview
 * @returns {Promise<Window>} - The preview window
 */
export const previewPdf = async (elementOrId, filename = PDF_CONFIG.DEFAULT_FILENAME) => {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  
  if (!element) {
    throw new Error('Element is required for PDF preview');
  }
  
  try {
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Clone the content
    const clonedContent = element.cloneNode(true);
    tempContainer.appendChild(clonedContent);
    
    // Apply PDF styling and cleanup
    const { fixEmojiAndSvgSizing, forceLightMode, cleanupContentForPdf, optimizeChartLayout } = await import('./pdfStyling');
    
    // Clean up interactive elements
    cleanupContentForPdf(clonedContent);
    
    // Fix emoji and SVG sizing
    fixEmojiAndSvgSizing(clonedContent);
    
    // Force light mode
    forceLightMode(clonedContent);
    
    // Optimize chart layout
    optimizeChartLayout(clonedContent);
    
    // Open a new window for the preview
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SkillLens Analysis Report</title>
        <style>
          /* Base styles */
          body {
            margin: 0;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #ffffff;
            color: #212529;
            line-height: 1.5;
          }
          
          .preview-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .preview-header {
            background-color: #f1f5f9;
            padding: 15px 20px;
            border-bottom: 1px solid #e2e8f0;
            text-align: center;
          }
          
          .preview-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #334155;
            margin: 0;
          }
          
          .preview-subtitle {
            font-size: 1rem;
            color: #64748b;
            margin: 5px 0 0;
          }
          
          .preview-content {
            padding: 30px;
          }
          
          /* Chart layout */
          .charts-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .chart-wrapper {
            flex: 1 1 45%;
            min-width: 300px;
            max-width: 48%;
          }
          
          /* Recommendation styling */
          .recommendation-item {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 4px;
            background-color: #f8fafc;
          }
          
          .recommendation-title {
            font-weight: 600;
            margin-bottom: 5px;
          }
          
          /* Links styling */
          a {
            color: #3b82f6;
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          /* Print styles */
          @media print {
            .preview-container {
              box-shadow: none;
              max-width: 100%;
            }
            
            body {
              padding: 0;
              background-color: #fff;
            }
            
            a {
              color: #000;
              text-decoration: underline;
            }
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            <h1 class="preview-title">SkillLens Analysis Report</h1>
            <p class="preview-subtitle">Comprehensive Skill Assessment</p>
          </div>
          <div class="preview-content" id="report-content"></div>
        </div>
        
        <script>
          // Function to optimize content for reading
          function optimizeForReading() {
            // Fix emoji sizes
            document.querySelectorAll('.emoji, .react-emoji').forEach(emoji => {
              emoji.style.width = '1em';
              emoji.style.height = '1em';
              emoji.style.display = 'inline-block';
              emoji.style.verticalAlign = 'middle';
              emoji.style.fontSize = 'inherit';
            });
            
            // Fix SVG icons
            document.querySelectorAll('svg').forEach(svg => {
              // Ensure SVG has proper viewBox
              if (!svg.getAttribute('viewBox') && svg.getAttribute('width') && svg.getAttribute('height')) {
                svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('width') + ' ' + svg.getAttribute('height'));
              }
              
              // Set consistent size for icons
              if (svg.classList.contains('icon') || 
                  svg.parentElement?.classList.contains('icon') || 
                  svg.width.baseVal.value < 24) {
                svg.style.width = '1em';
                svg.style.height = '1em';
                svg.style.verticalAlign = 'middle';
              }
            });
            
            // Arrange charts side by side
            const chartContainers = document.querySelectorAll('.chart-section, .chart-container-wrapper, .chart-container');
            if (chartContainers.length > 1) {
              // Create a flex container for charts
              const chartsRow = document.createElement('div');
              chartsRow.className = 'charts-container';
              chartsRow.style.display = 'flex';
              chartsRow.style.flexWrap = 'wrap';
              chartsRow.style.justifyContent = 'space-between';
              chartsRow.style.gap = '20px';
              chartsRow.style.marginBottom = '30px';
              
              // Move charts into the flex container
              const parent = chartContainers[0].parentNode;
              chartContainers.forEach(container => {
                // Set width for side-by-side layout
                container.style.flex = '1 1 45%';
                container.style.minWidth = '300px';
                container.style.maxWidth = '48%';
                
                // Remove from original position
                if (container.parentNode) {
                  container.parentNode.removeChild(container);
                }
                
                // Add to flex container
                chartsRow.appendChild(container);
              });
              
              // Insert the flex container where the first chart was
              if (parent) {
                parent.insertBefore(chartsRow, parent.firstChild);
              }
            }
            
            // Remove interactive elements
            document.querySelectorAll('button, .btn, [role="button"], input[type="button"], input[type="submit"]').forEach(el => {
              // Keep buttons that are inside recommendation links
              const isRecommendationLink = el.closest('.recommendation-link, .resource-link, a[href]');
              if (!isRecommendationLink) {
                el.parentNode?.removeChild(el);
              }
            });
            
            // Remove feedback sections
            document.querySelectorAll('.feedback-section, .feedback-form, [id*="feedback"], [class*="feedback"]').forEach(el => {
              el.parentNode?.removeChild(el);
            });
            
            // Remove dropdowns
            document.querySelectorAll('select, .dropdown, .dropdown-menu, .dropdown-toggle').forEach(el => {
              el.parentNode?.removeChild(el);
            });
            
            // Force light mode
            document.querySelectorAll('.dark, .dark-mode').forEach(el => {
              el.classList.remove('dark', 'dark-mode');
            });
            
            document.body.classList.add('light', 'light-mode');
          }
          
          // Run when DOM is fully loaded
          document.addEventListener('DOMContentLoaded', optimizeForReading);
        </script>
      </body>
      </html>
    `);
    
    // Add the styles from the main document
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(stylesheet => {
      const newLink = printWindow.document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = stylesheet.href;
      printWindow.document.head.appendChild(newLink);
    });
    
    // Add print.css and pdf-export.css specifically
    const printCssLink = printWindow.document.createElement('link');
    printCssLink.rel = 'stylesheet';
    printCssLink.href = '/src/styles/print.css';
    printWindow.document.head.appendChild(printCssLink);
    
    // Add our specialized PDF export styles
    const pdfExportCssLink = printWindow.document.createElement('link');
    pdfExportCssLink.rel = 'stylesheet';
    pdfExportCssLink.href = '/src/styles/pdf-export.css';
    printWindow.document.head.appendChild(pdfExportCssLink);
    
    // Wait for the window to load
    printWindow.onload = () => {
      // Get the content container
      const contentContainer = printWindow.document.getElementById('report-content');
      
      // Create a structured wrapper for the content
      const structuredContent = printWindow.document.createElement('div');
      structuredContent.className = 'pdf-structured-content';
      
      // Copy the HTML content
      structuredContent.innerHTML = element.innerHTML;
      
      // Add the structured content to the container
      contentContainer.appendChild(structuredContent);
      
      // Run the emoji and SVG fixing function
      if (typeof printWindow.fixEmojiAndSvgSizing === 'function') {
        printWindow.fixEmojiAndSvgSizing();
      }
      
      // Clean up the temporary elements
      document.body.removeChild(tempContainer);
    };
    
    printWindow.document.close();
    return printWindow;
  } catch (error) {
    console.error('Error previewing PDF:', error);
    throw error;
  }
};
