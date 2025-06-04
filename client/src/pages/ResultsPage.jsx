import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SkillRadarChart from '../components/SkillRadarChart'
import SkillBarChart from '../components/SkillBarChart'
import RecommendationCard from '../components/RecommendationCard'
import LoadingSpinner from '../components/LoadingSpinner'
import SkillProgress from '../components/SkillProgress'
import FeedbackForm from '../components/FeedbackForm'
import { groupSkillsByCategory, getTopSkills } from '../utils/chartUtils'
import { getAnalysisResults, getRecentAnalyses } from '../utils/storageUtils'
import { shareAnalysis, getShareableUrl, exportToPdf } from '../utils/sharingUtils'
import useUserPreferences from '../hooks/useUserPreferences'

const ResultsPage = () => {
  const [results, setResults] = useState(null)
  const [preferences] = useUserPreferences({ showProgressCharts: true })
  const [shareUrl, setShareUrl] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const reportContentRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get analysis results using our storage utility
    const storedResults = getAnalysisResults()
    
    if (storedResults) {
      console.log('Analysis results loaded:', storedResults)
      // Check if skills array exists and has valid data
      if (!storedResults.skills || !Array.isArray(storedResults.skills) || storedResults.skills.length === 0) {
        console.warn('Skills data is missing or empty in the analysis results')
        // Add fallback data for testing if skills are missing
        storedResults.skills = [
          { name: 'JavaScript', score: 0.75, category: 'Frontend' },
          { name: 'React', score: 0.65, category: 'Frontend' },
          { name: 'CSS', score: 0.8, category: 'Frontend' },
          { name: 'Python', score: 0.6, category: 'Backend' },
          { name: 'FastAPI', score: 0.5, category: 'Backend' }
        ]
      }
      setResults(storedResults)
    } else {
      console.warn('No analysis results found in storage')
      // If no results found, redirect to analyze page
      navigate('/analyze')
    }
  }, [navigate])

  if (!results) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="medium" message="Loading analysis results..." />
      </div>
    )
  }

  // Use utility function to group skills by category
  // Ensure skills is an array before grouping
  const skills = Array.isArray(results.skills) ? results.skills : []
  console.log('Skills being processed for charts:', skills)
  const skillsByCategory = groupSkillsByCategory(skills)

  // Handle share button click
  const handleShare = () => {
    try {
      // Generate a unique ID and save the analysis for sharing
      const shareId = shareAnalysis(results)
      
      // Generate a shareable URL
      const url = getShareableUrl(shareId)
      setShareUrl(url)
      
      // Show the share modal
      setShowShareModal(true)
    } catch (error) {
      console.error('Error sharing analysis:', error)
      alert('Failed to generate shareable link. Please try again.')
    }
  }
  
  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        // Visual feedback that link was copied
        const copyButton = document.getElementById('copy-link-button')
        if (copyButton) {
          copyButton.textContent = 'Copied!'
          setTimeout(() => {
            copyButton.textContent = 'Copy Link'
          }, 2000)
        }
      })
      .catch(err => {
        console.error('Failed to copy link:', err)
        alert('Failed to copy link to clipboard')
      })
  }
  
  // Handle export to PDF
  const handleExportToPdf = async () => {
    if (!reportContentRef.current) return
    
    try {
      setIsExporting(true)
      await exportToPdf('report-content', `skilllens-report-${results.filename || 'analysis'}.pdf`)
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      alert('Failed to export to PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div id="report-content" ref={reportContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
          Your Skill Analysis Results
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Based on your {results.language} code, we've analyzed your skills and prepared personalized recommendations.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 dark:text-primary-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none transition-all duration-200 hover:scale-105"
            aria-label="Start new analysis"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Analysis Summary
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Filename</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{results.filename}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{results.language}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Libraries Detected</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                    {results.libraries.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {results.libraries.map((lib, index) => (
                          <li key={index}>{lib}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No libraries detected</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-gray-800">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Skill Distribution
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                This chart shows your overall skill proficiency across different areas. The further a point extends from the center, the higher your proficiency.  
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 p-4">
              <div className="h-80">
                <SkillRadarChart skills={Array.isArray(results.skills) ? results.skills : []} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills by Category */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Skills by Category</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-3xl">
          Your skills are grouped by category below. Each chart shows your proficiency level for skills within that category. 
          Hover over any bar for more details about that specific skill.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category} className="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-gray-800">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  {category}
                </h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 p-4">
                <div className="h-64">
                  <SkillBarChart skills={Array.isArray(skills) ? skills : []} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Learning Recommendations</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-3xl">
          Based on your skill analysis, we've identified areas where you could focus your learning efforts. 
          These recommendations are personalized to help you grow your skills most effectively.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getTopSkills(Array.isArray(results.skills) ? results.skills : [], 3).map((skill, index) => (
            <RecommendationCard key={index} skill={skill} />
          ))}
        </div>
        
        {/* Skill Progress Section */}
        {getRecentAnalyses().length > 1 && preferences.showProgressCharts && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Skill Progress</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getTopSkills(Array.isArray(results.skills) ? results.skills : [], 2).map((skill, index) => (
                <SkillProgress key={index} skillName={skill.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 mb-12">
        <button
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 hover:scale-105"
          aria-label="Start new analysis"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          New Analysis
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-all duration-200 hover:scale-105"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Results
        </button>
        <button
          onClick={handleExportToPdf}
          disabled={isExporting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
        >
          {isExporting ? (
            <>
              <LoadingSpinner size="small" />
              <span className="ml-2">Exporting...</span>
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to PDF
            </>
          )}
        </button>
      </div>
      
      {/* Additional Actions */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 hover:scale-105"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Results
        </button>
        
        <div>
          <FeedbackForm analysisId={results?.id} />
        </div>
      </div>
      
      {/* Print-only footer */}
      <div id="print-footer" className="hidden">
        <p>Generated by SkillLens | {new Date().toLocaleDateString()}</p>
      </div>
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowShareModal(false)}
            ></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                    Share Your Analysis
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your analysis report is now available at the link below. Anyone with this link can view your results.                      
                    </p>
                    
                    <div className="mt-4">
                      <label htmlFor="share-url" className="sr-only">Share URL</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="share-url"
                          id="share-url"
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          value={shareUrl}
                          readOnly
                        />
                        <button
                          id="copy-link-button"
                          type="button"
                          onClick={handleCopyLink}
                          className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 text-sm font-medium rounded-r-md text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsPage
