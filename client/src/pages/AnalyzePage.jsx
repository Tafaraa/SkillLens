import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import AnalyzeHero from '../components/analyze/AnalyzeHero'
import AnalyzeFormSection from '../components/analyze/AnalyzeFormSection'
import RecentAnalysesSection from '../components/analyze/RecentAnalysesSection'
import ErrorDisplay from '../components/analyze/ErrorDisplay'
import AnalyzeLoading from '../components/analyze/AnalyzeLoading'
import { saveAnalysisResults } from '../utils/storageUtils'

const AnalyzePage = () => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleAnalysisComplete = (results, originalFile = null) => {
    // Store results using our storage utility
    // Also pass the original file for data science features
    saveAnalysisResults(results, originalFile)
    
    // Navigate to results page
    navigate('/results')
  }

  const handleDismissError = () => {
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="overflow-hidden">
        {/* Hero Section */}
        <AnalyzeHero />
        
        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorDisplay error={error} onDismiss={handleDismissError} />
          </div>
        )}
        
        {/* Form Section */}
        <AnalyzeFormSection 
          onAnalysisComplete={handleAnalysisComplete}
          setIsLoading={setIsLoading}
          setError={setError}
        />
        
        {/* Recent Analyses Section */}
        <RecentAnalysesSection />
      </main>
      {/* Loading Overlay */}
      {isLoading && <AnalyzeLoading message="Analyzing code..." />}
    </div>
  )
}

export default AnalyzePage
