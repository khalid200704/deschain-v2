import React from 'react'
import { useAuthStore } from '../../stores'
import { useNavigate } from 'react-router-dom'

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }
    if (adminOnly && user?.user_type !== 'admin') {
      navigate('/dashboard')
    }
  }, [isAuthenticated, user, adminOnly, navigate])

  if (!isAuthenticated) return null
  if (adminOnly && user?.user_type !== 'admin') return null

  return children
}
