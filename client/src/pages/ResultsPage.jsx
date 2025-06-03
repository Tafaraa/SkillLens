import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SkillRadarChart from '../components/SkillRadarChart'
import SkillBarChart from '../components/SkillBarChart'
import RecommendationCard from '../components/RecommendationCard'
import LoadingSpinner from '../components/LoadingSpinner'
import SkillProgress from '../components/SkillProgress'
import FeedbackForm from '../components/FeedbackForm'
import { groupSkillsByCategory, getTopSkills } from '../utils/chartUtils'
import { getAnalysisResults, getRecentAnalyses } from '../utils/storageUtils'
import useUserPreferences from '../hooks/useUserPreferences'

const ResultsPage = () => {
  const [results, setResults] = useState(null)
  const [preferences] = useUserPreferences({ showProgressCharts: true })
  const navigate = useNavigate()

  useEffect(() => {
    // Get analysis results using our storage utility
    const storedResults = getAnalysisResults()
    
    if (storedResults) {
      setResults(storedResults)
    } else {
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
  const skillsByCategory = groupSkillsByCategory(results.skills)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Your Skill Analysis Results
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Based on your {results.language} code, we've analyzed your skills and prepared personalized recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Analysis Summary
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
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
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 p-4">
              <div className="h-80">
                <SkillRadarChart skills={results.skills} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills by Category */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Skills by Category</h2>
        
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
                  <SkillBarChart skills={skills} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Learning Recommendations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getTopSkills(results.skills, 3).map((skill, index) => (
            <RecommendationCard key={index} skill={skill} />
          ))}
        </div>
        
        {/* Skill Progress Section */}
        {getRecentAnalyses().length > 1 && preferences.showProgressCharts && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Skill Progress</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getTopSkills(results.skills, 2).map((skill, index) => (
                <SkillProgress key={index} skillName={skill.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Analyze Another File
        </button>
        <button
          onClick={() => window.print()}
          className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Results
        </button>
        
        <div className="ml-4">
          <FeedbackForm analysisId={results?.id} />
        </div>
      </div>
      
      {/* Print-only footer */}
      <div id="print-footer" className="hidden">
        <p>Generated by SkillLens | {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default ResultsPage
