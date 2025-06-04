import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useTheme } from '../../hooks/useTheme'

const AboutFeatures = () => {
  const { isDarkMode } = useTheme()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* How It Works */}
          <FeatureCard 
            title="How It Works"
            items={[
              { title: "Upload Code", description: "Submit a file or link to a GitHub repository." },
              { title: "Static Analysis", description: "Code is analyzed without execution, identifying languages, libraries, and frameworks." },
              { title: "Skill Mapping", description: "Detected technologies are mapped to skills and proficiency levels." },
              { title: "Visualization", description: "Skills are displayed as an interactive radar chart and bar graphs." },
              { title: "Recommendations", description: "Personalized learning resources based on the skill profile." }
            ]}
            iconColor="from-primary-500 to-blue-500"
            delay={0}
          />

          {/* Privacy & Security */}
          <FeatureCard 
            title="Privacy & Security"
            items={[
              { title: "No Code Execution", description: "Code is never executed, ensuring complete safety." },
              { title: "Temporary Storage", description: "Uploaded files are analyzed and then immediately deleted." },
              { title: "No Personal Data", description: "No collection or storage of personal information." },
              { title: "Secure Analysis", description: "All analysis is performed using static code analysis techniques." },
              { title: "Open Source", description: "The codebase is open for review to ensure transparency." }
            ]}
            iconColor="from-blue-500 to-purple-500"
            delay={0.2}
          />
        </motion.div>
      </div>
    </section>
  )
}

const FeatureCard = ({ title, items, iconColor, delay = 0 }) => {
  const { isDarkMode } = useTheme()
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={cardRef}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700/50 group"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="px-6 py-8 sm:px-8 sm:py-10 relative">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-20 -translate-y-20 bg-gradient-to-br from-primary-500/10 to-blue-500/10 dark:from-primary-500/5 dark:to-blue-500/5 rounded-full"></div>
        
        <div className="relative">
          <motion.div 
            className={`h-1.5 w-16 bg-gradient-to-r ${iconColor} mb-6 rounded-full`}
            initial={{ width: 0 }}
            animate={cardInView ? { width: "4rem" } : { width: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          />
          
          <motion.h2
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: delay + 0.1 }}
          >
            {title}
          </motion.h2>
          
          <motion.ul
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={cardInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
          >
            {items.map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={cardInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: delay + 0.3 + (index * 0.1) }}
              >
                <div className={`mt-1 mr-3 flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r ${iconColor} text-white`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
      
      {/* Bottom border animation */}
      <motion.div 
        className={`h-1.5 bg-gradient-to-r ${iconColor} w-0 group-hover:w-full transition-all duration-500`}
        initial={{ width: "0%" }}
        whileHover={{ width: "100%" }}
      />
    </motion.div>
  )
}

export default AboutFeatures
