import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useTransform, useScroll, useAnimate } from 'framer-motion'
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation'
import { useTheme } from '../../hooks/useTheme'
import { AnimatePresence, motion as fmMotion } from 'framer-motion'

const roles = [
  'developer',
  'data scientist',
  'engineer',
  'student',
  'team lead',
]

const HeroSection = () => {
  const { scrollYProgress } = useScroll()
  const [scope, animate] = useAnimate()
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const [showAnnotations, setShowAnnotations] = useState(false)
  const { isDarkMode } = useTheme()
  const [roleIndex, setRoleIndex] = useState(0)

  // Responsive subheadline for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const subheadline = isMobile
    ? 'Unlock your potential as a'
    : 'Analyze your codebase and unlock your full potential as a';

  useEffect(() => {
    animate(scope.current, { opacity: 1, y: 0 }, { duration: 0.8 })
    const timer = setTimeout(() => setShowAnnotations(true), 500)
    return () => clearTimeout(timer)
  }, [animate, scope])

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-10 sm:py-14 md:py-20 relative overflow-hidden bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black transition-colors">
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
                animate={{ y: ["0%", "100%"], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 10 + Math.random() * 5, ease: "easeInOut", delay: Math.random() * 2 }}
              >
                {phrase}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Hero Content */}
      <motion.div
        className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10"
        style={{ y: heroY }}
      >
        <div className="text-center">
          <RoughNotationGroup show={showAnnotations}>
            {/* Main Headline */}
            <motion.h1
              ref={scope}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-gray-100 leading-tight mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="block">Discover Your</span>
              <span className="block mt-2 relative">
                <RoughNotation
                  type="highlight"
                  color={isDarkMode ? "#2563eb" : "#60a5fa"}
                  padding={[6, 4]}
                  strokeWidth={2}
                  animationDuration={900}
                >
                  <span className="relative z-10">Coding Strengths</span>
                </RoughNotation>
              </span>
            </motion.h1>
            {/* Subheadline with animated role */}
            <motion.h2
              className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 mt-2 flex flex-wrap items-baseline justify-center gap-x-1 gap-y-0.5 sm:gap-2 min-h-[2.2rem] sm:min-h-[2.5rem] px-1 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="block sm:inline whitespace-normal sm:whitespace-nowrap w-full sm:w-auto">
                {subheadline}&nbsp;
              </span>
              <span className="inline-block relative align-baseline" style={{ minWidth: '8.5em', maxWidth: '8.5em', width: '8.5em' }}>
                <AnimatePresence mode="wait">
                  <fmMotion.span
                    key={roles[roleIndex]}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                    className="text-primary-600 dark:text-primary-400 font-bold whitespace-nowrap relative"
                  >
                    {roles[roleIndex]}.
                  </fmMotion.span>
                </AnimatePresence>
              </span>
            </motion.h2>
            {/* Pyramid Paragraph */}
            <motion.div
              className="mt-3 sm:mt-4 max-w-xs xs:max-w-md sm:max-w-2xl mx-auto flex flex-col items-center gap-1 xs:gap-1.5 sm:gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="w-full text-sm xs:text-base md:text-lg text-gray-700 dark:text-gray-300 text-center">
                <RoughNotation type="highlight" color={isDarkMode ? "#854d0e" : "#fde68a"} padding={[2, 1]} strokeWidth={1}>
                  <span className="relative z-10">Upload your code or link your GitHub</span>
                </RoughNotation>
              </span>
              <span className="w-10/12 text-sm xs:text-base md:text-lg text-gray-700 dark:text-gray-300 text-center">
                <RoughNotation type="underline" color={isDarkMode ? "#d97706" : "#f59e0b"} strokeWidth={2}>
                  <span className="relative z-10">repository to get started</span>
                </RoughNotation>
              </span>
              <span className="w-8/12 text-sm xs:text-base md:text-lg text-gray-700 dark:text-gray-300 text-center">
                <RoughNotation type="highlight" color={isDarkMode ? "#854d0e" : "#fde68a"} padding={[2, 1]} strokeWidth={1}>
                  <span className="relative z-10">Analyze your code quality</span>
                </RoughNotation>
              </span>
              <span className="w-6/12 text-sm xs:text-base md:text-lg text-gray-700 dark:text-gray-300 text-center">
                <RoughNotation type="underline" color={isDarkMode ? "#d97706" : "#f59e0b"} strokeWidth={2}>
                  <span className="relative z-10">Get recommendations</span>
                </RoughNotation>
              </span>
            </motion.div>
          </RoughNotationGroup>

          {/* Buttons */}
          <motion.div
            className="mt-7 sm:mt-10 px-2 sm:px-4 max-w-xs xs:max-w-sm sm:max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
              <motion.div
                className="rounded-xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/analyze"
                  className="w-full flex items-center justify-center px-2 xs:px-3 sm:px-6 py-2 xs:py-3 border border-transparent text-xs xs:text-sm md:text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-300 relative group"
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Analyze Code</span>
                  <motion.div className="absolute bottom-0 left-0 h-1 bg-white/30 w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
              <motion.div
                className="rounded-xl shadow-lg overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/about"
                  className="w-full flex items-center justify-center px-2 xs:px-3 sm:px-6 py-2 xs:py-3 border border-transparent text-xs xs:text-sm md:text-base font-medium rounded-xl text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 relative group"
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Learn More</span>
                  <motion.div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 w-0 group-hover:w-full transition-all duration-300" />
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
