import React from 'react'
import { useTheme } from '../hooks/useTheme'
import AboutHero from '../components/about/AboutHero'
import AboutMission from '../components/about/AboutMission'
import AboutFeatures from '../components/about/AboutFeatures'
import CTASection from '../components/home/CTASection'

const AboutPage = () => {
  const { isDarkMode } = useTheme()
  
  return (
    <>
      {/* Main Content */}
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Hero Section */}
        <AboutHero />
        
        {/* Mission Section */}
        <AboutMission />
        
        {/* Features Section */}
        <AboutFeatures />
        
        {/* CTA Section - Reused from home components */}
        <CTASection />
      </div>
    </>
  )
}

export default AboutPage
