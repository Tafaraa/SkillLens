import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import UserSettings from './UserSettings'
import { useTheme } from '../hooks/useTheme.jsx'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`${scrolled ? 'bg-white/90 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-gray-900'} transition-all duration-300 sticky top-0 z-50`}>
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
          <div className="-mr-2 flex items-center space-x-2 sm:hidden">
            <div className="flex items-center">
              <UserSettings />
            </div>
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 outline-none focus:outline-none active:scale-95"
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6 flex items-center justify-center">
                <motion.span
                  className={`absolute h-0.5 rounded-full bg-current transform transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${isMenuOpen ? 'w-5 rotate-45' : 'w-5 -translate-y-1.5'}`}
                ></motion.span>
                
                <motion.span
                  className={`absolute h-0.5 rounded-full bg-current transform transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${isMenuOpen ? 'w-0 opacity-0' : 'w-4 opacity-100'}`}
                ></motion.span>
                
                <motion.span
                  className={`absolute h-0.5 rounded-full bg-current transform transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${isMenuOpen ? 'w-5 -rotate-45' : 'w-5 translate-y-1.5'}`}
                ></motion.span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id="mobile-menu" 
            className="sm:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className="pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-200 border-t border-gray-100 dark:border-gray-800"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2, staggerChildren: 0.05, delayChildren: 0.05 }}
            >
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400 block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button rounded-r-lg" 
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:text-primary-400 block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button rounded-r-lg"
                  }
                  end
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
              </motion.div>
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <NavLink 
                  to="/analyze" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400 block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button rounded-r-lg" 
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:text-primary-400 block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button rounded-r-lg"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analyze
                </NavLink>
              </motion.div>
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400 block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button rounded-r-lg" 
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:text-primary-400 block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 hover:translate-x-1 font-button rounded-r-lg"
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
              </motion.div>
              
              {/* Settings in mobile menu */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="px-4 py-3 mt-2 border-t border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center justify-end">
                  <a 
                    href="https://github.com/Tafaraa/SkillLens" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                    aria-label="GitHub repository"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
