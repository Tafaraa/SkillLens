import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAnalysisResults } from '../utils/storageUtils';
import { shareAnalysis, getShareableUrl, exportToPdf, previewPdf } from '../utils/sharingUtils';
import useUserPreferences from '../hooks/useUserPreferences';
import { useTheme } from '../hooks/useTheme.jsx';

// Import our new components
import ResultsHeader from '../components/results/ResultsHeader';
import ResultsOverview from '../components/results/ResultsOverview';
import SkillsSection from '../components/results/SkillsSection';
import RecommendationsSection from '../components/results/RecommendationsSection';
import FeedbackSection from '../components/results/FeedbackSection';
import ShareModal from '../components/results/ShareModal';

const ResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preferences] = useUserPreferences({ showProgressCharts: true });
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    skills: true,
    recommendations: true,
    feedback: false
  });
  const reportContentRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadResults = async () => {
      try {
        // Load analysis results from localStorage
        const storedResults = getAnalysisResults();
        
        if (storedResults) {
          // Create safe copies to avoid mutation issues
          const safeResults = JSON.parse(JSON.stringify(storedResults));
          
          // Determine if this is a file upload or GitHub repository analysis
          const isFileUpload = safeResults.filename && !safeResults.filename.includes('/');
          const isGitHubRepo = safeResults.filename && (safeResults.filename.includes('/') || safeResults.repository_url);
          
          // Format the data for display
          const formattedResults = {
            id: safeResults.id || `analysis-${Date.now()}`,
            fileName: safeResults.filename || 'Unknown File',
            language: safeResults.language || 'Unknown',
            libraries: safeResults.libraries || [],
            skills: safeResults.skills || [],
            timestamp: safeResults.timestamp || new Date().toISOString(),
            date: safeResults.timestamp || new Date().toISOString(),
            isFileUpload: isFileUpload,
            isGitHubRepo: isGitHubRepo,
            repository_url: safeResults.repository_url || ''
          };
          
          // Ensure skills data is valid but don't add default skills
          if (!formattedResults.skills || !Array.isArray(formattedResults.skills)) {
            console.log("No valid skills array found in results, initializing empty array");
            formattedResults.skills = [];
          } else {
            console.log("Skills found in analysis:", formattedResults.skills);
          }
          
          // Generate recommendations based on skills if they're missing
          console.log("Original recommendations:", safeResults.recommendations);
          console.log("Available skills for recommendations:", formattedResults.skills);
          
          if (!safeResults.recommendations || !Array.isArray(safeResults.recommendations) || safeResults.recommendations.length === 0) {
            // Create recommendations from skills data
            // Make sure we have valid skills to work with
            const filteredSkills = formattedResults.skills
              .filter(skill => {
                // Ensure skill has required properties
                return skill && 
                       typeof skill.name === 'string' && 
                       skill.name.trim() !== '' && 
                       typeof skill.score === 'number';
              });
            
            console.log("Filtered skills for recommendations:", filteredSkills);
            
            // If we have skills, create recommendations
            if (filteredSkills.length > 0) {
              formattedResults.recommendations = filteredSkills
                .sort((a, b) => a.score - b.score) // Sort by score ascending (lowest first)
                .slice(0, 3) // Take the 3 lowest scoring skills
                .map(skill => ({
                  name: skill.name.trim(),
                  category: typeof skill.category === 'string' ? skill.category.trim() : 'Development',
                  score: skill.score,
                  description: `Improve your ${skill.name} skills to enhance your ${skill.category || 'development'} capabilities.`
                }));
            } else {
              // Create default recommendations if no valid skills
              formattedResults.recommendations = [
                {
                  name: "JavaScript",
                  category: "Frontend",
                  score: 0.5,
                  description: "Improve your JavaScript skills to enhance your web development capabilities."
                },
                {
                  name: "Python",
                  category: "Backend",
                  score: 0.6,
                  description: "Improve your Python skills to enhance your backend development capabilities."
                },
                {
                  name: "Git",
                  category: "Development",
                  score: 0.7,
                  description: "Improve your Git skills to enhance your development workflow."
                }
              ];
            }
              
            console.log("Generated recommendations:", formattedResults.recommendations);
          } else {
            formattedResults.recommendations = safeResults.recommendations;
            console.log("Using existing recommendations:", formattedResults.recommendations);
          }
          
          // Generate code summary based on skills
          let codeSummary = '';
          if (formattedResults.skills && formattedResults.skills.length > 0) {
            const topSkills = [...formattedResults.skills]
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .slice(0, 3)
              .map(skill => skill.name)
              .join(', ');
              
            if (isGitHubRepo) {
              codeSummary = `This repository demonstrates knowledge of ${topSkills}. `;
            } else {
              codeSummary = `This ${formattedResults.language} file demonstrates knowledge of ${topSkills}. `;
            }
            
            // Add complexity assessment
            const avgScore = formattedResults.skills.reduce((sum, skill) => sum + (skill.score || 0), 0) / formattedResults.skills.length;
            if (avgScore > 0.7) {
              codeSummary += 'The code appears to be well-structured and demonstrates advanced concepts.';
            } else if (avgScore > 0.4) {
              codeSummary += 'The code shows intermediate understanding of these technologies.';
            } else {
              codeSummary += 'The code shows basic understanding of these technologies.';
            }
          }
          
          formattedResults.codeSummary = codeSummary;
          
          // Calculate skill categories for display
          const skillCategories = {};
          if (formattedResults.skills && formattedResults.skills.length > 0) {
            formattedResults.skills.forEach(skill => {
              const category = skill.category || 'Other';
              if (!skillCategories[category]) {
                skillCategories[category] = [];
              }
              skillCategories[category].push(skill);
            });
          }
          
          formattedResults.skillCategories = skillCategories;
          
          // Only generate recommendations from actual skills found in the analysis
          if (formattedResults.skills && Array.isArray(formattedResults.skills) && formattedResults.skills.length > 0) {
            console.log("Generating recommendations from actual skills found in analysis");
            
            // Filter valid skills
            const validSkills = formattedResults.skills.filter(skill => 
              skill && 
              typeof skill.name === 'string' && 
              skill.name.trim() !== '' && 
              typeof skill.score === 'number'
            );
            
            console.log("Valid skills for recommendations:", validSkills);
            
            if (validSkills.length > 0) {
              // Sort by score (lowest first) to recommend areas for improvement
              formattedResults.recommendations = validSkills
                .sort((a, b) => a.score - b.score)
                .slice(0, 3) // Take the 3 lowest scoring skills
                .map(skill => ({
                  name: skill.name.trim(),
                  category: typeof skill.category === 'string' ? skill.category.trim() : 'Development',
                  score: skill.score,
                  description: `Improve your ${skill.name} skills to enhance your ${skill.category || 'development'} capabilities.`
                }));
                
              console.log("Generated recommendations from actual skills:", formattedResults.recommendations);
            } else {
              // No valid skills found, set empty recommendations
              formattedResults.recommendations = [];
              console.log("No valid skills found, setting empty recommendations");
            }
          } else {
            // No skills data, set empty recommendations
            formattedResults.recommendations = [];
            console.log("No skills data found, setting empty recommendations");
          }
          
          // Set results state
          setResults(formattedResults);
          console.log("Final results with recommendations:", formattedResults);
        } else {
          console.warn('No analysis results found in storage');
          // If no results found, redirect to analyze page
          navigate('/analyze');
        }
      } catch (error) {
        console.error('Error loading analysis results:', error);
        // Create minimal fallback data to prevent blank page
        const fallbackResults = {
          id: 'fallback-' + Date.now(),
          fileName: 'Fallback Analysis',
          language: 'Unknown',
          date: new Date().toISOString(),
          isFileUpload: true,
          isGitHubRepo: false,
          skills: [
            { name: 'JavaScript', score: 0.7, category: 'Frontend' },
            { name: 'React', score: 0.65, category: 'Frontend' },
            { name: 'Python', score: 0.6, category: 'Backend' },
            { name: 'FastAPI', score: 0.5, category: 'Backend' }
          ],
          recommendations: [
            {
              name: "JavaScript",
              category: "Frontend",
              score: 0.7,
              description: "Improve your JavaScript skills to enhance your web development capabilities."
            },
            {
              name: "Python",
              category: "Backend",
              score: 0.6,
              description: "Improve your Python skills to enhance your backend development capabilities."
            },
            {
              name: "Git",
              category: "Development",
              score: 0.5,
              description: "Improve your Git skills to enhance your development workflow."
            }
          ]
        };
        setResults(fallbackResults);
      } finally {
        setLoading(false);
      }
    };
    
    loadResults();
  }, [navigate]);

  // Handle share button click
  const handleShare = () => {
    try {
      // Generate a unique ID and save the analysis for sharing
      const shareId = shareAnalysis(results);
      
      // Generate a shareable URL
      const url = getShareableUrl(shareId);
      setShareUrl(url);
      
      // Show the share modal
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing analysis:', error);
      alert('Failed to generate shareable link. Please try again.');
    }
  };

  // Handle export to PDF
  const handleExportToPdf = async () => {
    try {
      setIsExporting(true);
      await exportToPdf(reportContentRef.current, `SkillLens_Analysis_${results?.fileName || 'Report'}`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle preview PDF
  const handlePreviewPdf = async () => {
    try {
      setIsPreviewing(true);
      await previewPdf(reportContentRef.current, `SkillLens_Analysis_${results?.fileName || 'Report'}`);
    } catch (error) {
      console.error('Error previewing PDF:', error);
      alert('Failed to preview PDF. Please try again.');
    } finally {
      setIsPreviewing(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown Date';
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading analysis results...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div id="report-content" ref={reportContentRef} className="space-y-6">
            <ResultsHeader 
              title={`Analysis Results: ${results.fileName || 'Unknown File'}`}
              filename={results.fileName || 'Unknown File'}
              date={results.date || new Date().toISOString()}
              onShare={handleShare}
              onExport={handleExportToPdf}
              onPreview={handlePreviewPdf}
              isExporting={isExporting}
              isPreviewing={isPreviewing}
            />
            
            {/* Code Summary Section for File Uploads */}
            {results.isFileUpload && results.codeSummary && (
              <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow`}>
                <h2 className="text-xl font-semibold mb-2">
                  {results.language} File Summary
                </h2>
                <p className="text-base">
                  {results.codeSummary}
                </p>
              </div>
            )}
            
            {/* Methodology section explaining how results are calculated */}
            <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow`}>
              <h2 className="text-xl font-semibold mb-2">
                How Results Are Calculated
              </h2>
              <p className="text-base mb-3">
                SkillLens analyzes your code using a multi-step process:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Code parsing: Your code is parsed to identify language features, patterns, and libraries used.</li>
                <li>Skill extraction: Our AI model identifies programming skills demonstrated in your code.</li>
                <li>Proficiency scoring: Each skill is scored on a scale from 0-100% based on complexity, best practices, and usage patterns.</li>
                <li>Recommendation generation: Learning resources are suggested based on your current skill levels and potential growth areas.</li>
              </ol>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 italic">
                Scores are relative measures of demonstrated proficiency in the analyzed code, not absolute measures of your overall skill level.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Overview section */}
              <ResultsOverview 
                results={results} 
                isExpanded={expandedSections.overview}
                onToggleExpand={() => toggleSection('overview')}
              />
              
              {/* Skills section */}
              <SkillsSection 
                skills={results.skills || []} 
                isExpanded={expandedSections.skills}
                onToggleExpand={() => toggleSection('skills')}
              />
              
              {/* Recommendations section */}
              <RecommendationsSection 
                recommendations={results.recommendations || []} 
                isExpanded={expandedSections.recommendations}
                onToggleExpand={() => toggleSection('recommendations')}
              />
              
              {/* Feedback section */}
              <FeedbackSection 
                analysisId={results.id || 'unknown'}
                isExpanded={expandedSections.feedback}
                onToggleExpand={() => toggleSection('feedback')}
              />
            </div>
            
            {/* Print-only footer */}
            <div id="print-footer" className="hidden print:block mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Generated by SkillLens | {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Share Modal */}
          <ShareModal 
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            shareUrl={shareUrl}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
