import React, { useState } from 'react'
import apiService from '../services/api'
import { formatErrorMessage } from '../utils/errorHandler'

const FeedbackForm = ({ analysisId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Call the API to submit feedback
      await apiService.submitFeedback({ analysisId, rating, comment })
      
      setSubmitSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSubmitSuccess(false)
        setRating(0)
        setComment('')
      }, 2000)
    } catch (error) {
      setError(formatErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1 transition-all duration-200 hover:scale-125"
          aria-label={`Rate ${i} out of 5 stars`}
          aria-pressed={i <= rating ? 'true' : 'false'}
        >
          <svg 
            className={`h-8 w-8 ${i <= rating ? 'text-yellow-400 animate-pulse' : 'text-gray-300 dark:text-gray-600'} transition-colors duration-200`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      )
    }
    return stars
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1 transition-all duration-200 hover:scale-110 active:scale-95 font-button"
        aria-label="Open feedback form"
      >
        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Provide Feedback
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-scale transition-all duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 id="feedback-title" className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Analysis Feedback
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1 transition-all duration-200 hover:rotate-90"
            aria-label="Close feedback form"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {submitSuccess ? (
          <div className="text-center py-6 animate-bounce-once">
            <svg className="h-12 w-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How would you rate the analysis results?
              </label>
              <div className="flex space-x-1">
                {renderStars()}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comments or suggestions (optional)
              </label>
              <textarea
                id="comment"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md transition-all duration-200 hover:border-indigo focus:scale-[1.02]"
                placeholder="Tell us what you think about the analysis results..."
              />
            </div>
            
            {error && (
              <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 hover:scale-105 active:scale-95 font-button"
                aria-label="Cancel feedback submission"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 font-button transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                aria-label="Submit feedback"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default FeedbackForm
