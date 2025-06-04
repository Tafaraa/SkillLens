import React from 'react'
import { useTheme } from '../hooks/useTheme.jsx'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import CTASection from '../components/home/CTASection'


const HomePage = () => {
  const { theme } = useTheme()
  
  return (
    <>
   
      
      {/* Main Content */}
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* CTA Section */}
        <CTASection />
      </div>
      
     
    </>
  )
}

export default HomePage