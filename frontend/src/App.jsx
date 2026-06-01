import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/common/ErrorBoundary'

// Pages
import LandingPage from './pages/Landing'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'
import DashboardPage from './pages/dashboard'
import PrivacyPage from './pages/Privacy'
import NotFoundPage from './pages/NotFound'
import GroupMatchingPage from './pages/procurement/GroupMatching'
import ProcurementPage from './pages/procurement/Procurement'
import PricingPage from './pages/Pricing'
import AboutPage from './pages/About'
import AdminPage from './pages/Admin'
import VendorsPage from './pages/Vendors'
import TransactionsPage from './pages/Transactions'
import ProfilePage from './pages/Profile'
import ConsultationPage from './pages/Consultation'

// Styles
import './index.css'

function App() {
  React.useEffect(() => {
    const pingBackend = () => {
      fetch(`${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}/ping`)
        .catch(() => {})
    }
    pingBackend()
    const interval = setInterval(pingBackend, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/procurement/matching" element={<GroupMatchingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
