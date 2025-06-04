import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import SkillRadarChart from '../components/SkillRadarChart'
import SkillBarChart from '../components/SkillBarChart'
import RecommendationCard from '../components/RecommendationCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { groupSkillsByCategory, getTopSkills } from '../utils/chartUtils'
import { getSharedAnalysis } from '../utils/sharingUtils'

const ReportPage = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { reportId } = useParams()

  useEffect(() => {
    // Get shared analysis by ID
    const sharedAnalysis = getSharedAnalysis(reportId)
    
    if (sharedAnalysis) {
      setReport(sharedAnalysis)
    } else {
      setError('Report not found. It may have expired or been removed.')
    }
    
    setLoading(false)
  }, [reportId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="medium" message="Loading shared report..." />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Report Not Found
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            {error || 'This report is no longer available.'}
          </p>
          <div className="mt-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Use utility function to group skills by category
  const skillsByCategory = groupSkillsByCategory(report.skills)

  return (
    <div id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full mb-4 dark:bg-blue-900 dark:text-blue-200">
          Shared Report
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
          Skill Analysis Report
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Based on {report.language} code analysis
          {report.sharedAt && (
            <span className="block text-sm mt-2">
              Shared on {new Date(report.sharedAt).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg dark:bg-gray-800">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                Analysis Summary
              </h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Filename</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{report.filename || 'Not specified'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{report.language}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Libraries Detected</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                    {report.libraries && report.libraries.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {report.libraries.map((lib, index) => (
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
                <SkillRadarChart skills={report.skills} />
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
          {getTopSkills(report.skills, 3).map((skill, index) => (
            <RecommendationCard key={index} skill={skill} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex justify-center space-x-4">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Go to SkillLens
        </Link>
        <button
          onClick={() => window.print()}
          className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>
      
      {/* Print-only footer */}
      <div id="print-footer" className="hidden">
        <p>Generated by SkillLens | {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default ReportPage
