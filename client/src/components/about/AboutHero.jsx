import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTheme } from '../../hooks/useTheme'

const AboutHero = () => {
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
        
        {/* Animated shapes */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary-300/10 to-blue-300/10 dark:from-primary-500/10 dark:to-blue-500/10"
            style={{
              height: `${200 + i * 100}px`,
              width: `${200 + i * 100}px`,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 30}%`,
              filter: 'blur(60px)',
            }}
            animate={{
              x: [0, 10, 0],
              y: [0, 15, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
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
              About
            </span>
          </motion.div>

          <motion.h1
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            About SkillLens
          </motion.h1>

          <motion.div
            className="mt-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Discover your coding strengths and areas for improvement with our intelligent code analysis tool.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutHero
