import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authAPI } from '../../api/endpoints'
import { Button, Input, Card } from '../../components/common'

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm()
  const navigate = useNavigate()
  const [apiError, setApiError] = React.useState('')
  const userType = watch('user_type', 'umkm')

  const onSubmit = async (data) => {
    try {
      const response = await authAPI.register(data)
      if (response.success) {
        navigate('/auth/login')
      }
    } catch (error) {
      setApiError(error?.message || 'Registration failed')
    }
  }

  return (
    <div className="bg-ice-50 min-h-screen py-12 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-navy-900">Join Deschain</h2>
        
        {apiError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{apiError}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-navy-900 mb-2">Account Type</label>
            <select
              {...register('user_type')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500"
            >
              <option value="umkm">UMKM (Buyer)</option>
              <option value="vendor">Vendor (Supplier)</option>
            </select>
          </div>
          
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
          
          <Input
            label="First Name"
            type="text"
            placeholder="John"
            {...register('first_name', { required: 'First name is required' })}
            error={errors.first_name?.message}
          />
          
          <Input
            label="Last Name"
            type="text"
            placeholder="Doe"
            {...register('last_name')}
            error={errors.last_name?.message}
          />
          
          <Input
            label="Phone"
            type="tel"
            placeholder="+62812345678"
            {...register('phone')}
            error={errors.phone?.message}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
            error={errors.password?.message}
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <a href="/auth/login" className="text-gold-500 hover:underline">Login here</a>
        </p>
      </Card>
    </div>
  )
}

export default RegisterPage
