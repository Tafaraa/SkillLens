import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import UserSettings from './UserSettings'
import { useTheme } from '../hooks/useTheme.jsx'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode } = useTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md transition-all duration-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center transition-transform duration-200 hover:scale-105">
              <span className="text-indigo dark:text-indigo font-bold text-xl transition-all duration-200 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:bg-gradient-to-l animate-gradient-text bg-gradient-size">SkillLens</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? "border-indigo text-indigo dark:text-indigo dark:border-indigo inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 font-button hover:scale-105" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 font-button hover:scale-105"
                }
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/analyze" 
                className={({ isActive }) => 
                  isActive 
                    ? "border-indigo text-indigo dark:text-indigo dark:border-indigo inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 font-button hover:scale-105" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 font-button hover:scale-105"
                }
              >
                Analyze
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  isActive 
                    ? "border-indigo text-indigo dark:text-indigo dark:border-indigo inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 font-button hover:scale-105" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200 font-button hover:scale-105"
                }
              >
                About
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <UserSettings />
            <a 
              href="https://github.com/Tafaraa/SkillLens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md p-1 transition-all duration-200 hover:scale-110 group"
              aria-label="GitHub Repository"
            >
              <svg className="h-6 w-6 transition-all duration-200 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6 transition-transform duration-300 ease-in-out animate-wiggle" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6 transition-transform duration-300 ease-in-out hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`${isMenuOpen ? 'block animate-slide-in' : 'hidden animate-slide-out'} sm:hidden transition-all duration-300 ease-in-out overflow-hidden`}>
        <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 transition-colors duration-200">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive 
                ? "bg-indigo/10 dark:bg-indigo/20 border-indigo text-indigo dark:text-indigo dark:border-indigo block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button" 
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:text-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button"
            }
            end
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/analyze" 
            className={({ isActive }) => 
              isActive 
                ? "bg-indigo/10 dark:bg-indigo/20 border-indigo text-indigo dark:text-indigo dark:border-indigo block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button" 
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:text-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            Analyze
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              isActive 
                ? "bg-indigo/10 dark:bg-indigo/20 border-indigo text-indigo dark:text-indigo dark:border-indigo block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button" 
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:text-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button"
            }
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
