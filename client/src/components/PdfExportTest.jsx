import React, { useRef, useState } from 'react';
import { exportToPdf, previewPdf } from '../utils/pdf';
import { runPdfTest } from '../utils/pdf/test-pdf-export';

/**
 * Test component for PDF export and preview functionality
 * This component can be used to verify that the PDF export and preview
 * functionality is working correctly with the read-only optimizations.
 */
const PdfExportTest = () => {
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsExporting(true);
      await exportToPdf(reportRef.current, 'SkillLens_Test_Export');
      alert('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. See console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreviewPdf = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsPreviewing(true);
      await previewPdf(reportRef.current, 'SkillLens_Test_Preview');
    } catch (error) {
      console.error('Error previewing PDF:', error);
      alert('Failed to preview PDF. See console for details.');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleRunTest = async () => {
    if (!reportRef.current) return;
    
    try {
      const results = await runPdfTest(reportRef.current);
      setTestResults(results);
    } catch (error) {
      console.error('Error running test:', error);
      alert('Failed to run test. See console for details.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF Export Test</h1>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleExportPdf}
          disabled={isExporting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export to PDF'}
        </button>
        
        <button
          onClick={handlePreviewPdf}
          disabled={isPreviewing}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isPreviewing ? 'Opening Preview...' : 'Preview PDF'}
        </button>
        
        <button
          onClick={handleRunTest}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Run Test
        </button>
      </div>
      
      {testResults !== null && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Test Results</h2>
          <div className={`text-${testResults ? 'green' : 'red'}-600 font-bold`}>
            {testResults ? 'PASSED' : 'FAILED'}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            See console for detailed results.
          </p>
        </div>
      )}
      
      <div 
        ref={reportRef}
        className="border p-6 bg-white rounded shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Sample Report Content</h2>
        
        {/* Sample charts section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Skill Analysis</h3>
          
          <div className="chart-section mb-4">
            <h4 className="font-medium mb-1">Bar Chart</h4>
            <div className="chart-container bg-gray-100 h-40 flex items-center justify-center">
              [Bar Chart Placeholder]
            </div>
          </div>
          
          <div className="chart-section mb-4">
            <h4 className="font-medium mb-1">Radar Chart</h4>
            <div className="chart-container bg-gray-100 h-40 flex items-center justify-center">
              [Radar Chart Placeholder]
            </div>
          </div>
        </div>
        
        {/* Sample recommendations section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
          
          <div className="recommendation-item p-3 bg-blue-50 rounded mb-3">
            <h4 className="font-medium">Improve JavaScript Skills</h4>
            <p className="text-sm mb-2">Based on your analysis, we recommend focusing on JavaScript.</p>
            <a href="https://example.com/js" className="recommendation-link text-blue-600 text-sm hover:underline">
              View Resources
            </a>
          </div>
          
          <div className="recommendation-item p-3 bg-blue-50 rounded mb-3">
            <h4 className="font-medium">Learn React</h4>
            <p className="text-sm mb-2">React would be a valuable addition to your skillset.</p>
            <a href="https://example.com/react" className="recommendation-link text-blue-600 text-sm hover:underline">
              View Resources
            </a>
          </div>
        </div>
        
        {/* Sample feedback section (should be removed in PDF) */}
        <div className="feedback-section mb-8 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">Provide Feedback</h3>
          <p className="mb-2">How useful was this analysis?</p>
          <div className="flex gap-2 mb-3">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Very Useful</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Somewhat Useful</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Not Useful</button>
          </div>
          <textarea 
            className="w-full p-2 border rounded" 
            placeholder="Additional comments..."
            rows="3"
          ></textarea>
          <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm">Submit Feedback</button>
        </div>
        
        {/* Sample sharing section (should be removed in PDF) */}
        <div className="share-section mb-8">
          <h3 className="text-lg font-semibold mb-2">Share Results</h3>
          <div className="flex gap-2">
            <button className="share-button px-3 py-1 bg-green-600 text-white rounded text-sm">Share via Email</button>
            <button className="share-button px-3 py-1 bg-blue-600 text-white rounded text-sm">Share via Link</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfExportTest;
