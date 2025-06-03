import React from 'react'

const LoadingSpinner = ({ size = 'medium', fullScreen = false, message = 'Loading...' }) => {
  // Size classes for the spinner
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-t-2 border-b-2',
    large: 'h-16 w-16 border-4'
  }

  // Base spinner component
  const spinner = (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary-500`}></div>
  )

  // If fullScreen is true, render the spinner in the center of the screen
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex flex-col items-center">
            {spinner}
            {message && <h3 className="mt-4 text-lg font-medium text-gray-900">{message}</h3>}
          </div>
        </div>
      </div>
    )
  }

  // Otherwise, render just the spinner with optional message
  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
