// Halaman login — wrapper tipis di atas LoginForm yang menangani auth flow lengkap
import React from 'react'
import { LoginForm } from '../../components/forms/LoginForm'

const LoginPage = () => {
  return (
    <div className="bg-ice-50 min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  )
}

export default LoginPage
