import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

const CTASection = () => {
  const { isDarkMode } = useTheme();

  return (
    <section className="relative bg-gradient-to-r from-primary-700 to-primary-800 overflow-hidden py-12 lg:py-16">
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-0" />

      {/* Animated Background Code */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          {[...Array(40)].map((_, i) => {
            const yStart = Math.random() * 90
            const xStart = Math.random() * 90
            const phraseList = [
              'function()', 'const data = []', 'import React',
              'export default', 'class App', '<Component />',
              'useState()', 'useEffect()', '{ code }', '// comment'
            ];
            const phrase = phraseList[Math.floor(Math.random() * phraseList.length)];

            return (
              <motion.div
                key={i}
                className="absolute text-[10px] sm:text-xs text-primary-300 opacity-25 font-mono whitespace-nowrap
                           w-full h-full lg:left-1/2 lg:w-1/2" // Right half only on lg+
                style={{
                  top: `${yStart}%`,
                  left: `calc(${xStart}% + ${window.innerWidth >= 1024 ? 50 : 0}%)`, // shift X right on lg
                }}
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
            );
          })}
        </div>
      </div>

      {/* CTA Content - Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:w-2/3"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                Ready to analyze your code?
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-blue-200">
                Start your skill assessment today.
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-primary-100 max-w-xl">
              Discover coding strengths, identify areas for growth, and get personalized recommendations to enhance development skills.
            </p>
          </motion.div>

          {/* Right: Button */}
          <motion.div
            className="mt-6 lg:mt-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 shadow-md transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500 w-0 group-hover:w-full transition-all duration-300"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
