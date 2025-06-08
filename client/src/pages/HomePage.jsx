import React from 'react'
import { useTheme } from '../hooks/useTheme'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import CTASection from '../components/home/CTASection'
import { motion } from 'framer-motion'

const HomePage = () => {
  const { theme } = useTheme()
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <main className="overflow-hidden">
        {/* Hero Section */}
        <HeroSection />
        {/* Features Section */}
        <FeaturesSection />
        {/* CTA Section */}
        <CTASection />
      </main>
    </motion.div>
  )
}

export default HomePage

