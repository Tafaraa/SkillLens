import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import ResultsPage from './pages/ResultsPage'
import ReportPage from './pages/ReportPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import SecurityPage from './pages/SecurityPage'
import { RouteTransition } from './components/RouteTransition'
import { ThemeProvider } from './hooks/useTheme'
import AuthGuard from './components/auth/AuthGuard'
import { NotificationContainer } from './components/common/Notification'

function App() {
  return (
    <ThemeProvider>
      <AuthGuard>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <NotificationContainer />
          <RouteTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/report/:reportId" element={<ReportPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </RouteTransition>
          <Footer />
        </div>
      </AuthGuard>
    </ThemeProvider>
  )
}

export default App
