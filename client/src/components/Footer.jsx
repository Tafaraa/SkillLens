import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-800 text-white dark:bg-gray-900 transition-colors duration-200" role="contentinfo">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 font-heading">SkillLens</h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm">
              Analyze your code to identify skill strengths and weaknesses, and get personalized learning recommendations.
            </p>
            <p className="text-gray-300 dark:text-gray-400 text-sm mt-4">
              Powered by SkillLens
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1">
                  Analyze Code
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 font-heading">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com/Tafaraa/SkillLens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1"
                  aria-label="GitHub Repository"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 dark:text-gray-500">
          <p>© {currentYear} SkillLens. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Made by <a href="https://mutsvedutafara.com/" target="_blank" rel="noopener noreferrer" className="animate-gradient-text font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1">Tafara Mutsvedu</a></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
