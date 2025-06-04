import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

const AnalyzeLoading = ({ message = 'Analyzing code...' }) => {
  const { isDarkMode } = useTheme()

  // Animation variants for the loading dots
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -10, 0] },
  }

  // Animation variants for the code symbols
  const symbolVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  // Code symbols to animate
  const codeSymbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '*', '=', ';']

  return (
    <div className="fixed inset-0 bg-gray-900/70 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden">
          {codeSymbols.map((symbol, index) => (
            <motion.div
              key={index}
              className="absolute text-primary-200/20 dark:text-primary-700/10 font-mono text-3xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={symbolVariants}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: index * 0.2,
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Loading spinner */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-16 h-16 border-4 border-primary-200 dark:border-primary-700 border-t-primary-600 dark:border-t-primary-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Loading message */}
          <motion.h3
            className="text-xl text-center font-medium text-gray-900 dark:text-gray-100 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.h3>

          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: dot * 0.2,
                }}
              />
            ))}
          </div>

          {/* Progress info */}
          <motion.div
            className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p>This may take a moment depending on the size of your code.</p>
            <p className="mt-2">The system is identifying languages, patterns, and skills.</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AnalyzeLoading
