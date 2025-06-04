import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useTransform, useScroll, useAnimate } from 'framer-motion'
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation'
import { useTheme } from '../../hooks/useTheme'

const HeroSection = () => {
  const { scrollYProgress } = useScroll()
  const [scope, animate] = useAnimate()
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const [showAnnotations, setShowAnnotations] = useState(false)
  const { isDarkMode, isSettingsOpen } = useTheme()

  useEffect(() => {
    animate(scope.current, { opacity: 1, y: 0 }, { duration: 0.8 })
    
    // Delay showing annotations until after component has mounted and rendered
    const timer = setTimeout(() => {
      setShowAnnotations(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [animate, scope])
  
  // Hide annotations when settings are open
  useEffect(() => {
    if (isSettingsOpen) {
      setShowAnnotations(false)
    } else {
      const timer = setTimeout(() => {
        setShowAnnotations(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isSettingsOpen])

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black transition-colors">

      {/* Animated Background Code Snippets */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          {[...Array(40)].map((_, i) => {
            const yStart = Math.random() * 90
            const xStart = Math.random() * 90
            const phraseList = [
              'function()', 'const data = []', 'import React',
              'export default', 'class App', '<Component />',
              'useState()', 'useEffect()', '{ code }', '// comment',
              'npm install', 'git commit', 'python -m venv', 'docker build',
              'async/await', 'try/catch', 'map()', 'filter()'
            ]
            const phrase = phraseList[Math.floor(Math.random() * phraseList.length)]

            return (
              <motion.div
                key={i}
                className="absolute text-[10px] sm:text-xs font-mono whitespace-nowrap text-gray-500 dark:text-blue-300/30"
                style={{ top: `${yStart}%`, left: `${xStart}%` }}
                animate={{
                  y: ["0%", "100%"],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10 + Math.random() * 5,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              >
                {phrase}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Hero Content */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ y: heroY }}
      >
        <div className="text-center">
          <RoughNotationGroup show={showAnnotations}>
            <motion.h1
              ref={scope}
              className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
            >
              <span className="block">Discover Your</span>
              <span className="mt-2 relative">
                <RoughNotation
                  type="highlight"
                  color={isDarkMode ? "#2563eb" : "#60a5fa"}
                  padding={[6, 4]}
                  strokeWidth={1}
                  animationDuration={800}
                >
                  <span className="relative z-10">Coding Strengths</span>
                </RoughNotation>
              </span>
            </motion.h1>

            {/* Paragraph with highlights & underlines */}
            <motion.p
              className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="relative inline-block">
                <RoughNotation type="highlight" color={isDarkMode ? "#854d0e" : "#fde68a"} padding={[2, 1]} strokeWidth={1}>
                  <span className="relative z-10">Upload your code or link your GitHub repository</span>
                </RoughNotation>
              </span>{' '}
              <span className="relative inline-block">
                <RoughNotation type="underline" color={isDarkMode ? "#d97706" : "#f59e0b"} strokeWidth={2}>
                  <span className="relative z-10">to analyze your programming skills,</span>
                </RoughNotation>
              </span>{' '}
              <span className="relative inline-block">
                <RoughNotation type="highlight" color={isDarkMode ? "#854d0e" : "#fde68a"} padding={[2, 1]} strokeWidth={1}>
                  <span className="relative z-10">identify strengths and weaknesses,</span>
                </RoughNotation>
              </span>{' '}
              and{' '}
              <span className="relative inline-block">
                <RoughNotation type="underline" color={isDarkMode ? "#d97706" : "#f59e0b"} strokeWidth={2}>
                  <span className="relative z-10">get personalized learning recommendations.</span>
                </RoughNotation>
              </span>
            </motion.p>
          </RoughNotationGroup>

          {/* Buttons */}
          <motion.div
            className="mt-8 md:mt-10 px-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
              <motion.div
                className="rounded-xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/analyze"
                  className="w-full flex items-center justify-center px-3 sm:px-6 py-3 border border-transparent text-xs sm:text-sm md:text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 relative group"
                >
                  <span className="mr-1 sm:mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Analyze Code</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-white/30 w-0 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>

              <motion.div
                className="rounded-xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/about"
                  className="w-full flex items-center justify-center px-3 sm:px-6 py-3 border border-transparent text-xs sm:text-sm md:text-base font-medium rounded-xl text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 relative group"
                >
                  <span className="mr-1 sm:mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Learn More</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 w-0 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
