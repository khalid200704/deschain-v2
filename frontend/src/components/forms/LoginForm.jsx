import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/endpoints'
import { useAuthStore } from '../../stores'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const [apiError, setApiError] = React.useState('')
  const [isSlowLoading, setIsSlowLoading] = React.useState(false)

  const onSubmit = async (data) => {
    setApiError('')
    setIsSlowLoading(false)
    const slowTimer = setTimeout(() => setIsSlowLoading(true), 3000)
    try {
      const response = await authAPI.login(data.email, data.password)
      clearTimeout(slowTimer)
      if (response.success) {
        setToken(response.data.access_token)
        setUser(response.data.user)
        if (response.data.refresh_token) {
          localStorage.setItem('refreshToken', response.data.refresh_token)
        }
        navigate('/dashboard')
      }
    } catch (error) {
      clearTimeout(slowTimer)
      setIsSlowLoading(false)
      setApiError(
        error?.detail ||
        error?.message ||
        error?.error?.message ||
        'Email atau password salah. Coba lagi.'
      )
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-center">
        <div className="text-2xl font-bold text-gold-500 mb-1">Deschain</div>
        <h1 className="text-xl font-bold text-navy-900">Masuk ke akun Anda</h1>
        <p className="text-gray-500 text-sm mt-1">Platform pengadaan kolektif UMKM</p>
      </div>

      {apiError && (
        <div className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={15} className="flex-shrink-0" />
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              {...register('email', { required: 'Email wajib diisi' })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100 text-sm transition-colors"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-900 mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Masukkan password"
              autoComplete="current-password"
              {...register('password', { required: 'Password wajib diisi' })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100 text-sm transition-colors"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 text-sm mt-2"
        >
          {isSubmitting ? (
            <div className="text-center">
              <span className="block">{isSlowLoading ? 'Membangunkan server...' : 'Memproses...'}</span>
              {isSlowLoading && (
                <span className="text-xs text-white text-opacity-75 block mt-0.5">
                  Server sedang aktif, mohon tunggu ~30 detik
                </span>
              )}
            </div>
          ) : 'Masuk'}
        </button>
      </form>

      <p className="text-center mt-5 text-sm text-gray-500">
        Belum punya akun?{' '}
        <button
          onClick={() => navigate('/auth/register')}
          className="text-gold-500 font-semibold hover:underline"
        >
          Daftar gratis
        </button>
      </p>
    </div>
  )
}
