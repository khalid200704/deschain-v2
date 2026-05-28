import React from 'react'
import { useAuthStore } from '../stores'
import { useNavigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
    }
  }, [isAuthenticated, navigate])

  return isAuthenticated ? children : null
}
