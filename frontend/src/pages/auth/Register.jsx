import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authAPI } from '../../api/endpoints'
import { useAuthStore } from '../../stores'
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm()
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const [apiError, setApiError] = React.useState('')

  const onSubmit = async (data) => {
    setApiError('')
    try {
      const response = await authAPI.register(data)
      if (response.success) {
        setToken(response.data.access_token)
        setUser(response.data.user)
        navigate('/dashboard')
      }
    } catch (error) {
      setApiError(error?.detail || error?.message || 'Pendaftaran gagal. Coba lagi.')
    }
  }

  const Field = ({ icon: Icon, label, name, type = 'text', placeholder, rules, autoComplete }) => (
    <div>
      <label className="block text-sm font-medium text-navy-900 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(name, rules)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100 text-sm transition-colors"
        />
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
    </div>
  )

  return (
    <div className="bg-ice-50 min-h-screen py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-gold-500 mb-1">Deschain</div>
          <h1 className="text-xl font-bold text-navy-900">Buat akun baru</h1>
          <p className="text-gray-500 text-sm mt-1">Gratis 14 hari, tidak perlu kartu kredit</p>
        </div>

        {apiError && (
          <div className="mb-4 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={15} className="flex-shrink-0" />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-900 mb-1.5">Tipe Akun</label>
            <select
              {...register('user_type')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-gold-500 text-sm bg-white"
            >
              <option value="umkm">UMKM (Pembeli)</option>
              <option value="vendor">Vendor (Supplier)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field icon={User} label="Nama Depan" name="first_name" placeholder="Budi" rules={{ required: 'Wajib diisi' }} autoComplete="given-name" />
            <Field icon={User} label="Nama Belakang" name="last_name" placeholder="Santoso" autoComplete="family-name" />
          </div>

          <Field icon={Mail} label="Email" name="email" type="email" placeholder="nama@email.com" rules={{ required: 'Wajib diisi' }} autoComplete="email" />
          <Field icon={Phone} label="Nomor HP" name="phone" type="tel" placeholder="081234567890" autoComplete="tel" />
          <Field
            icon={Lock}
            label="Password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            rules={{ required: 'Wajib diisi', minLength: { value: 8, message: 'Minimal 8 karakter' } }}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50 text-sm mt-2"
          >
            {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-500">
          Sudah punya akun?{' '}
          <button
            onClick={() => navigate('/auth/login')}
            className="text-gold-500 font-semibold hover:underline"
          >
            Masuk
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
