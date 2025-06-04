import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { useInView } from 'react-intersection-observer'

const FeaturesSection = () => {
  const { isDarkMode } = useTheme();
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background pattern - modernized */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 z-0">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary-100/20 to-transparent dark:from-primary-900/20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-100/20 to-transparent dark:from-blue-900/20"></div>
        {[...Array(6)].map((_, i) => (
          <motion.div 
            key={i} 
            className="absolute bg-gradient-to-br from-primary-500/20 to-blue-500/20 dark:from-primary-700/20 dark:to-blue-700/20"
            style={{
              height: `${Math.random() * 300 + 150}px`,
              width: `${Math.random() * 300 + 150}px`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: -1
            }}
            animate={{
              x: [0, Math.random() * 10 - 5],
              y: [0, Math.random() * 10 - 5],
              rotate: [0, Math.random() * 5 - 2.5],
              scale: [1, 1 + Math.random() * 0.05],
              filter: ['blur(30px)', 'blur(40px)', 'blur(30px)'],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 10 + Math.random() * 10,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={sectionInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">
              Features
            </span>
          </motion.div>
          
          <motion.h2 
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How SkillLens Works
          </motion.h2>
          
          <motion.div 
            className="mt-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Analyze your code and discover your programming skills in three simple steps.
            </p>
          </motion.div>
        </motion.div>

        <div className="mt-16 md:mt-24 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Feature 1 */}
            <FeatureCard 
              title="Upload Your Code"
              description="Upload your code files or link your GitHub repository to get started with the analysis."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />}
              gradientFrom="from-primary-100 to-blue-100"
              gradientDark="from-primary-900/30 to-blue-900/30"
              iconGradient="from-primary-500 to-primary-600"
              borderGradient="from-primary-500 to-blue-500"
              delay={0}
            />

            {/* Feature 2 */}
            <FeatureCard 
              title="Analyze Skills"
              description="Our system analyzes your code to identify programming languages, libraries, and frameworks you use."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
              gradientFrom="from-blue-100 to-purple-100"
              gradientDark="from-blue-900/30 to-purple-900/30"
              iconGradient="from-blue-500 to-blue-600"
              borderGradient="from-blue-500 to-purple-500"
              delay={0.2}
              iconRotate={-5}
            />

            {/* Feature 3 */}
            <FeatureCard 
              title="Get Recommendations"
              description="Receive personalized learning recommendations based on your skill strengths and areas for improvement."
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
              gradientFrom="from-purple-100 to-primary-100"
              gradientDark="from-purple-900/30 to-primary-900/30"
              iconGradient="from-purple-500 to-purple-600"
              borderGradient="from-purple-500 to-primary-500"
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// Feature Card Component
const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  gradientFrom, 
  gradientDark, 
  iconGradient, 
  borderGradient,
  delay = 0,
  iconRotate = 5
}) => {
  const { isDarkMode } = useTheme();
  const [cardRef, cardInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <motion.div 
      ref={cardRef}
      className="relative p-6 sm:p-8 bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden group border border-gray-100 dark:border-gray-700/50"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.6, delay: delay * 0.2 }}
      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
    >
      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 ${isDarkMode ? `dark:bg-gradient-to-br ${gradientDark}` : ''}`}></div>
      
      {/* Icon */}
      <motion.div 
        className={`relative z-10 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-r ${iconGradient} text-white mb-6 mx-auto shadow-lg`}
        whileHover={{ scale: 1.1, rotate: iconRotate }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.svg 
          className="h-8 w-8 sm:h-10 sm:w-10" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay * 0.5 }}
        >
          {icon}
        </motion.svg>
      </motion.div>
      
      {/* Content */}
      <div className="text-center relative z-10">
        <h3 className="text-xl sm:text-2xl leading-6 font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white mb-4">
          {title}
        </h3>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-100 leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Bottom border animation */}
      <motion.div 
        className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${borderGradient} w-0 group-hover:w-full transition-all duration-500 rounded-full`}
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
      />
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10 bg-gradient-to-br from-primary-500/10 to-blue-500/10 dark:from-primary-500/5 dark:to-blue-500/5 rounded-full"></div>
    </motion.div>
  )
}

export default FeaturesSection
