import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores'
import ErrorBoundary from './components/common/ErrorBoundary'

// Pages
import LandingPage from './pages/Landing'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'
import DashboardPage from './pages/dashboard'
import PrivacyPage from './pages/Privacy'
import NotFoundPage from './pages/NotFound'
import GroupMatchingPage from './pages/procurement/GroupMatching'
import PricingPage from './pages/Pricing'
import AboutPage from './pages/About'

// Styles
import './index.css'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/procurement/matching" element={<GroupMatchingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
