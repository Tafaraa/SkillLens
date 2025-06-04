import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTheme } from '../../hooks/useTheme'

const AboutMission = () => {
  const { isDarkMode } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-6 py-8 sm:px-8 sm:py-10 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-20 -translate-y-20 bg-gradient-to-br from-primary-500/10 to-blue-500/10 dark:from-primary-500/5 dark:to-blue-500/5 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 transform -translate-x-20 translate-y-20 bg-gradient-to-tr from-blue-500/10 to-primary-500/10 dark:from-blue-500/5 dark:to-primary-500/5 rounded-full"></div>
            
            <div className="relative">
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Mission
              </motion.h2>
              
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  SkillLens was created to help developers understand their skill profile based on the code they write.
                  By analyzing the libraries, frameworks, and patterns in code, the system identifies strengths
                  and suggests areas where knowledge expansion might be beneficial.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  The goal is to provide personalized learning recommendations that help developers grow,
                  focusing on skills most relevant to current projects and interests.
                </p>
              </motion.div>
            </div>
          </div>
          
          {/* Bottom border animation */}
          <motion.div 
            className="h-1.5 bg-gradient-to-r from-primary-500 to-blue-500 w-0"
            initial={{ width: "0%" }}
            animate={inView ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
      </div>
    </section>
  )
}

export default AboutMission
