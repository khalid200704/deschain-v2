import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/endpoints'
import { useAuthStore } from '../../stores'
import { Button, Input, Card } from '../common'

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const [apiError, setApiError] = React.useState('')

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.login(data.email, data.password)
      if (response.success) {
        setToken(response.data.access_token)
        setUser(response.data.user)
        navigate('/dashboard')
      }
    } catch (error) {
      setApiError(error?.message || 'Login failed')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-navy-900">Deschain Login</h2>
      
      {apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{apiError}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
        />
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isSubmitting}
        >
          Login
        </Button>
      </form>
      
      <p className="text-center mt-4 text-gray-600">
        Don't have an account? <a href="/auth/register" className="text-gold-500 hover:underline">Register here</a>
      </p>
    </Card>
  )
}
