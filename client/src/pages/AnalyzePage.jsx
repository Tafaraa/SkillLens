import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnalyzeForm from '../components/AnalyzeForm'
import LoadingSpinner from '../components/LoadingSpinner'
import RecentAnalyses from '../components/RecentAnalyses'
import { saveAnalysisResults } from '../utils/storageUtils'

const AnalyzePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleAnalysisComplete = (results) => {
    // Store results using our storage utility
    saveAnalysisResults(results)
    
    // Navigate to results page
    navigate('/results')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Analyze Your Code
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
          Upload your code files or link your GitHub repository to analyze your programming skills.
          Our system will identify languages, libraries, and frameworks you use to provide personalized insights.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your code is analyzed securely. We don't store your code after analysis is complete.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <AnalyzeForm 
            onAnalysisComplete={handleAnalysisComplete}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your code is analyzed securely. We don't store your code after analysis is complete.
        </p>
      </div>
      
      {/* Display recent analyses if available */}
      <RecentAnalyses />

      {isLoading && (
        <LoadingSpinner 
          fullScreen={true} 
          size="large" 
          message="Analyzing your code..."
        />
      )}
    </div>
  )
}

export default AnalyzePage
