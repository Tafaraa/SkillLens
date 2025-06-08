import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { motion } from 'framer-motion'

const ShareModal = ({ 
  isOpen, 
  onClose, 
  shareUrl 
}) => {
  const { isDarkMode } = useTheme()
  const [copied, setCopied] = useState(false)
  
  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy link:', err)
        alert('Failed to copy link to clipboard')
      })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></motion.div>
        
        {/* Modal panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
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
                      className={`focus:ring-primary-500 focus:border-primary-500 block w-full rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
                      value={shareUrl}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 text-sm font-medium rounded-r-md ${
                        copied 
                          ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900' 
                          : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500'
                      } focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200`}
                    >
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can also share directly to:
                  </p>
                  <div className="mt-2 flex justify-center space-x-4">
                    {/* Social sharing buttons */}
                    <button 
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                      aria-label="Share on Twitter"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button 
                      className="text-blue-800 dark:text-blue-500 hover:text-blue-900 dark:hover:text-blue-400 transition-colors duration-200"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </button>
                    <button 
                      className="text-gray-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-200"
                      aria-label="Share via Email"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors duration-200`}
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ShareModal


