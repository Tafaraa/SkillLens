import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useTheme } from '../hooks/useTheme';
import apiService from '../services/api';
import { notifyError } from '../components/common/Notification';
import { getFromLocalStorage, STORAGE_KEYS } from '../utils/storageUtils';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import ResultsHeader from '../components/results/ResultsHeader';
import ResultsOverview from '../components/results/ResultsOverview';
import SkillsSection from '../components/results/SkillsSection';
import RecommendationsSection from '../components/results/RecommendationsSection';
import FeedbackSection from '../components/results/FeedbackSection';
import DeveloperRankSection from '../components/results/DeveloperRankSection';
import SkillProgressChartSection from '../components/results/SkillProgressChartSection';
import UploadSummarySection from '../components/results/UploadSummarySection';
import ShareModal from '../components/results/ShareModal';
import ResultsPDF from '../components/results/ResultsPDF';

// Icons
import { ArrowLeftIcon, ShareIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // State
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Data science features state
  const [developerRank, setDeveloperRank] = useState(null);
  const [skillProgress, setSkillProgress] = useState(null);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [dsLoading, setDsLoading] = useState({
    developerRank: true,
    skillProgress: true,
    uploadSummary: true
  });
  
  // UI state
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    skills: true,
    developerRank: true,
    skillProgress: false,
    uploadSummary: false,
    recommendations: false,
    feedback: false
  });
  
  // Refs
  const reportContentRef = useRef(null);

  // Load data science features
  const loadDataScienceFeatures = async (file) => {
    if (!file || !(file instanceof File)) {
      console.error('Invalid file object provided to loadDataScienceFeatures');
      setDsLoading({
        developerRank: false,
        skillProgress: false,
        uploadSummary: false
      });
      return;
    }
    
    console.log('Loading data science features with file:', file.name);
    
    // Check if server is available
    let serverAvailable = true;
    try {
      await apiService.healthCheck();
    } catch (error) {
      if (error.isServerConnectionError) {
        console.warn('Server connection error detected, will use mock data for data science features');
        serverAvailable = false;
      }
    }
    
    // Load developer rank
    try {
      setDsLoading(prev => ({ ...prev, developerRank: true }));
      let devRankData;
      
      if (serverAvailable) {
        try {
          const devRankRes = await apiService.getDeveloperRank(file);
          devRankData = devRankRes.data;
          console.log('Developer rank data loaded successfully');
        } catch (error) {
          if (error.isServerConnectionError) {
            console.warn('Server connection error during developer rank API call, using mock data');
            serverAvailable = false;
          } else {
            throw error;
          }
        }
      }
      
      // If server is not available or the API call failed with connection error, use mock data
      if (!serverAvailable || !devRankData) {
        console.log('Using mock data for developer rank');
        devRankData = apiService.getMockData('developerRank');
      }
      
      setDeveloperRank(devRankData);
    } catch (error) {
      console.error('Error loading developer rank:', error);
    } finally {
      setDsLoading(prev => ({ ...prev, developerRank: false }));
    }
    
    // Load skill progress chart
    try {
      setDsLoading(prev => ({ ...prev, skillProgress: true }));
      let skillProgressData;
      
      if (serverAvailable) {
        try {
          const skillProgressRes = await apiService.getSkillProgressChart();
          skillProgressData = skillProgressRes.data;
          console.log('Skill progress data loaded successfully');
        } catch (error) {
          if (error.isServerConnectionError) {
            console.warn('Server connection error during skill progress API call, using mock data');
            serverAvailable = false;
          } else {
            throw error;
          }
        }
      }
      
      // If server is not available or the API call failed with connection error, use mock data
      if (!serverAvailable || !skillProgressData) {
        console.log('Using mock data for skill progress');
        skillProgressData = apiService.getMockData('skillProgress');
      }
      
      setSkillProgress(skillProgressData);
    } catch (error) {
      console.error('Error loading skill progress chart:', error);
    } finally {
      setDsLoading(prev => ({ ...prev, skillProgress: false }));
    }
    
    // Load upload summary
    try {
      setDsLoading(prev => ({ ...prev, uploadSummary: true }));
      let uploadSummaryData;
      
      if (serverAvailable) {
        try {
          const uploadSummaryRes = await apiService.getUploadSummary(file);
          uploadSummaryData = uploadSummaryRes.data;
          console.log('Upload summary data loaded successfully');
        } catch (error) {
          if (error.isServerConnectionError) {
            console.warn('Server connection error during upload summary API call, using mock data');
            serverAvailable = false;
          } else {
            throw error;
          }
        }
      }
      
      // If server is not available or the API call failed with connection error, use mock data
      if (!serverAvailable || !uploadSummaryData) {
        console.log('Using mock data for upload summary');
        uploadSummaryData = apiService.getMockData('uploadSummary');
      }
      
      setUploadSummary(uploadSummaryData);
    } catch (error) {
      console.error('Error loading upload summary:', error);
    } finally {
      setDsLoading(prev => ({ ...prev, uploadSummary: false }));
    }
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle share button click
  const handleShare = () => {
    try {
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing analysis:', error);
      notifyError('Failed to generate shareable link');
    }
  };
  
  // Handle export to PDF
  const handleExportToPdf = async () => {
    try {
      setIsExporting(true);
      setTimeout(() => setIsExporting(false), 1500);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      notifyError('Failed to export PDF');
      setIsExporting(false);
    }
  };

  // Load results from localStorage
  useEffect(() => {
    const loadResults = async () => {
      try {
        const parsedResults = apiService.getAnalysisResults ? 
          await apiService.getAnalysisResults() : 
          getFromLocalStorage(STORAGE_KEYS.ANALYSIS_RESULTS)
        
        if (parsedResults) {
          const formattedResults = {
            ...parsedResults,
            timestamp: new Date(parsedResults.timestamp || Date.now()).toLocaleString(),
            skills: parsedResults.skills || [],
            recommendations: parsedResults.recommendations || []
          }
          
          setResults(formattedResults)
          
          const shareId = formattedResults.id || 'demo'
          setShareUrl(`${window.location.origin}/shared/${shareId}`)
          
          const originalFile = localStorage.getItem('originalFile')
          if (originalFile) {
            console.log('Original file available, loading data science features')
            try {
              const fileData = JSON.parse(originalFile)
              await loadDataScienceFeatures(fileData)
            } catch (error) {
              console.error('Error loading data science features:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error loading results:', error)
        notifyError('Failed to load analysis results')
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading results..." />
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">No Results Found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Please run an analysis first.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go to Analysis
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={reportContentRef}>
        {/* Results Header */}
        <ResultsHeader 
          title="Analysis Results"
          filename={results?.fileName || results?.filename}
          date={results?.timestamp}
          onShare={handleShare}
          onExport={handleExportToPdf}
          isExporting={isExporting}
        />
        {/* Results Overview */}
        <ResultsOverview 
          results={results}
          isExpanded={expandedSections.overview}
          onToggle={() => toggleSection('overview')}
        />
        {/* Skills Section */}
        <SkillsSection 
          skills={results.skills}
          isExpanded={expandedSections.skills}
          onToggle={() => toggleSection('skills')}
        />
        {/* Developer Rank Section */}
        <DeveloperRankSection 
          data={developerRank}
          isLoading={dsLoading.developerRank}
          isExpanded={expandedSections.developerRank}
          onToggle={() => toggleSection('developerRank')}
        />
        {/* Skill Progress Chart Section */}
        <SkillProgressChartSection 
          data={skillProgress}
          isLoading={dsLoading.skillProgress}
          isExpanded={expandedSections.skillProgress}
          onToggle={() => toggleSection('skillProgress')}
        />
        {/* Upload Summary Section */}
        <UploadSummarySection 
          data={uploadSummary}
          isLoading={dsLoading.uploadSummary}
          isExpanded={expandedSections.uploadSummary}
          onToggle={() => toggleSection('uploadSummary')}
        />
        {/* Recommendations Section */}
        <RecommendationsSection 
          recommendations={results.recommendations}
          isExpanded={expandedSections.recommendations}
          onToggle={() => toggleSection('recommendations')}
        />
        {/* Feedback Section */}
        <FeedbackSection 
          isExpanded={expandedSections.feedback}
          onToggle={() => toggleSection('feedback')}
        />
      </main>
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
      />
      {/* PDF Export Link */}
      <div className="hidden">
        <PDFDownloadLink
          document={<ResultsPDF results={results} />}
          fileName="skilllens-analysis.pdf"
        >
          {({ loading }) => loading ? 'Generating PDF...' : 'Download PDF'}
        </PDFDownloadLink>
      </div>
    </div>
  )
}

export default ResultsPage

