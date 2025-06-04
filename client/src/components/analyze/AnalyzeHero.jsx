import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTheme } from '../../hooks/useTheme'

const AnalyzeHero = () => {
  const { isDarkMode } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section 
      ref={ref} 
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-blue-50/30 dark:from-primary-900/20 dark:to-blue-900/20 opacity-70"></div>
        
        {/* Animated code symbols in background */}
        {[...Array(10)].map((_, i) => {
          const symbols = ['{ }', '( )', '[ ]', '< >', '//', '/*', '*/', '=>', ';;', '""']
          return (
            <motion.div
              key={i}
              className="absolute text-primary-300/20 dark:text-primary-500/10 font-mono text-4xl sm:text-5xl md:text-6xl font-bold"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, Math.random() * 10 - 5]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              {symbols[i % symbols.length]}
            </motion.div>
          )
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-3 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">
              Code Analysis
            </span>
          </motion.div>

          <motion.h1
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Analyze Code
          </motion.h1>

          <motion.div
            className="mt-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Upload code files or link a GitHub repository to analyze programming skills.
              The system identifies languages, libraries, and frameworks to provide personalized insights.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AnalyzeHero
