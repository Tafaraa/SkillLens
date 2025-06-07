/**
 * PDF styling utilities
 */

/**
 * Apply styling to PDF content
 * @param {HTMLElement} element - Original element to style
 * @returns {Object} Object containing tempContainer and structuredContent elements
 */
export const applyPdfStyling = (element) => {
  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true);
  
  // Clean up the cloned content before adding it
  cleanupContentForPdf(clonedElement);
  
  // Create a temporary container with proper styling for PDF
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '800px'; // Fixed width for better PDF generation
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.color = '#000000';
  tempContainer.style.fontFamily = 'Arial, sans-serif';
  document.body.appendChild(tempContainer);
  
  // Create a structured wrapper for better PDF formatting
  const structuredContent = document.createElement('div');
  structuredContent.className = 'pdf-structured-content';
  structuredContent.style.padding = '20px';
  
  // Add header to the document
  const header = createHeader();
  structuredContent.appendChild(header);
  
  // Add the cleaned cloned content
  structuredContent.appendChild(clonedElement);
  
  // Add footer with generation date
  const footer = createFooter();
  structuredContent.appendChild(footer);
  
  // Fix emoji and SVG sizing
  fixEmojiAndSvgSizing(structuredContent);
  
  // Force light mode styling
  forceLightMode(structuredContent);
  
  // Optimize chart layout for side-by-side display
  optimizeChartLayout(structuredContent);
  
  // Add the structured content to the temporary container
  tempContainer.appendChild(structuredContent);
  
  return { tempContainer, structuredContent };
};

/**
 * Create a header for the PDF
 * @returns {HTMLElement} Header element
 */
const createHeader = () => {
  const header = document.createElement('div');
  header.style.textAlign = 'center';
  header.style.marginBottom = '20px';
  header.style.borderBottom = '2px solid #333';
  header.style.paddingBottom = '10px';
  
  // Add logo and title
  const logo = document.createElement('div');
  logo.innerHTML = `
    <h1 style="margin: 0; color: #333; font-size: 24px; font-weight: bold;">SkillLens Analysis Report</h1>
    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Comprehensive Skill Assessment</p>
  `;
  header.appendChild(logo);
  
  return header;
};

/**
 * Create a footer for the PDF
 * @returns {HTMLElement} Footer element
 */
const createFooter = () => {
  const footer = document.createElement('div');
  footer.style.marginTop = '30px';
  footer.style.borderTop = '1px solid #ddd';
  footer.style.paddingTop = '10px';
  footer.style.fontSize = '12px';
  footer.style.color = '#666';
  footer.style.textAlign = 'center';
  
  // Add generation date
  const date = new Date();
  const formattedDate = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  footer.innerHTML = `
    <p>Generated on ${formattedDate}</p>
    <p>SkillLens &copy; ${date.getFullYear()}</p>
  `;
  
  return footer;
};

/**
 * Fix emoji and SVG sizing in the content
 * @param {HTMLElement} element - Element to fix
 */
export const fixEmojiAndSvgSizing = (element) => {
  // Fix emoji sizes
  const emojis = element.querySelectorAll('.emoji, .react-emoji');
  emojis.forEach(emoji => {
    emoji.style.width = '1em';
    emoji.style.height = '1em';
    emoji.style.display = 'inline-block';
    emoji.style.verticalAlign = 'middle';
    emoji.style.fontSize = 'inherit';
  });
  
  // Fix SVG icons
  const svgs = element.querySelectorAll('svg');
  svgs.forEach(svg => {
    // Ensure SVG has proper viewBox
    if (!svg.getAttribute('viewBox') && svg.getAttribute('width') && svg.getAttribute('height')) {
      svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`);
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
  
  // Fix chart sizing and arrange side by side
  const chartContainers = element.querySelectorAll('.chart-section, .chart-container-wrapper');
  if (chartContainers.length > 1) {
    // Create a flex container for charts
    const chartsRow = document.createElement('div');
    chartsRow.style.display = 'flex';
    chartsRow.style.flexDirection = 'row';
    chartsRow.style.flexWrap = 'wrap';
    chartsRow.style.justifyContent = 'space-between';
    chartsRow.style.gap = '20px';
    chartsRow.style.marginBottom = '30px';
    chartsRow.style.pageBreakInside = 'avoid';
    
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
  
  // Ensure all charts have consistent styling
  const charts = element.querySelectorAll('.recharts-wrapper, .chart-container');
  charts.forEach(chart => {
    chart.style.maxWidth = '100%';
    chart.style.height = 'auto';
    chart.style.pageBreakInside = 'avoid';
  });
};

/**
 * Force light mode styling for PDF content
 * @param {HTMLElement} element - Element to apply light mode to
 */
export const forceLightMode = (element) => {
  // Remove dark mode classes
  element.querySelectorAll('.dark, .dark-mode').forEach(el => {
    el.classList.remove('dark', 'dark-mode');
  });
  
  // Apply light mode classes
  element.classList.add('light', 'light-mode');
  
  // Override dark background colors with light ones
  const darkElements = element.querySelectorAll('[class*="bg-gray-"], [class*="bg-slate-"], [class*="bg-zinc-"], [class*="bg-neutral-"]');
  darkElements.forEach(el => {
    // Check if it has a dark background
    const classes = [...el.classList];
    const darkBgClasses = classes.filter(cls => 
      cls.match(/bg-(gray|slate|zinc|neutral)-(700|800|900|950)/)
    );
    
    if (darkBgClasses.length > 0) {
      // Remove dark background classes
      darkBgClasses.forEach(cls => el.classList.remove(cls));
      
      // Add light background class
      el.classList.add('bg-white');
    }
  });
  
  // Override dark text colors with light ones
  const darkTextElements = element.querySelectorAll('[class*="text-white"], [class*="text-gray-"], [class*="text-slate-"]');
  darkTextElements.forEach(el => {
    // Check if it has light text on dark background
    const classes = [...el.classList];
    const lightTextClasses = classes.filter(cls => 
      cls === 'text-white' || cls.match(/text-(gray|slate|zinc|neutral)-(100|200|300)/)
    );
    
    if (lightTextClasses.length > 0) {
      // Remove light text classes
      lightTextClasses.forEach(cls => el.classList.remove(cls));
      
      // Add dark text class
      el.classList.add('text-gray-800');
    }
  });
};

/**
 * Clean up content for PDF export by removing interactive elements
 * @param {HTMLElement} element - Element to clean up
 */
export const cleanupContentForPdf = (element) => {
  if (!element) return;
  
  // Remove all buttons except links in recommendations
  const buttons = element.querySelectorAll('button, .btn, [role="button"], input[type="button"], input[type="submit"]');
  buttons.forEach(button => {
    // Keep buttons that are inside recommendation links
    const isRecommendationLink = button.closest('.recommendation-link, .resource-link, a[href]');
    if (!isRecommendationLink) {
      button.parentNode?.removeChild(button);
    }
  });
  
  // Remove all dropdowns and select elements
  const dropdowns = element.querySelectorAll('select, .dropdown, .dropdown-menu, .dropdown-toggle');
  dropdowns.forEach(dropdown => dropdown.parentNode?.removeChild(dropdown));
  
  // Remove feedback sections
  const feedbackSections = element.querySelectorAll('.feedback-section, .feedback-form, [id*="feedback"], [class*="feedback"]');
  feedbackSections.forEach(section => section.parentNode?.removeChild(section));
  
  // Remove sharing UI elements
  const sharingElements = element.querySelectorAll('.share-button, .share-section, [id*="share"], [class*="share"]');
  sharingElements.forEach(el => el.parentNode?.removeChild(el));
  
  // Remove any form elements
  const forms = element.querySelectorAll('form, textarea, input:not([type="hidden"])');
  forms.forEach(form => form.parentNode?.removeChild(form));
  
  // Remove any toggle/switch elements
  const toggles = element.querySelectorAll('.toggle, .switch, [role="switch"]');
  toggles.forEach(toggle => toggle.parentNode?.removeChild(toggle));
  
  // Remove any modal dialogs
  const modals = element.querySelectorAll('.modal, dialog, [role="dialog"], [aria-modal="true"]');
  modals.forEach(modal => modal.parentNode?.removeChild(modal));
  
  // Convert any remaining interactive elements to static text where appropriate
  const interactiveElements = element.querySelectorAll('details, summary, [aria-expanded]');
  interactiveElements.forEach(el => {
    // If it's a details/summary, make sure it's expanded
    if (el.tagName === 'DETAILS') {
      el.setAttribute('open', 'true');
      el.style.display = 'block';
    }
    
    // Remove interactive attributes
    el.removeAttribute('aria-expanded');
    el.removeAttribute('aria-controls');
    el.removeAttribute('aria-haspopup');
    el.removeAttribute('tabindex');
    el.removeAttribute('role');
    
    // Remove event listeners by cloning and replacing
    const clone = el.cloneNode(true);
    if (el.parentNode) {
      el.parentNode.replaceChild(clone, el);
    }
  });
};

/**
 * Optimize chart layout for side-by-side display in PDF
 * @param {HTMLElement} element - The element containing charts
 */
export const optimizeChartLayout = (element) => {
  // Find chart containers
  const chartContainers = element.querySelectorAll('.chart-section, .chart-container-wrapper, .chart-container, .recharts-wrapper');
  
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
    const chartsToMove = Array.from(chartContainers);
    
    chartsToMove.forEach(container => {
      // Set width for side-by-side layout
      container.style.flex = '1 1 45%';
      container.style.minWidth = '300px';
      container.style.maxWidth = '48%';
      container.style.pageBreakInside = 'avoid';
      
      // Clone the container to remove event listeners
      const clone = container.cloneNode(true);
      
      // Remove from original position
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      
      // Add to flex container
      chartsRow.appendChild(clone);
    });
    
    // Insert the flex container where the first chart was
    if (parent) {
      parent.insertBefore(chartsRow, parent.firstChild);
    }
  }
};
