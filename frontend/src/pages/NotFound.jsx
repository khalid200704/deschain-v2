import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ice-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-navy-900 mb-2">404</div>
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-navy-900 mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border-2 border-navy-900 text-navy-900 font-semibold rounded-xl hover:bg-navy-900 hover:text-white transition-colors"
          >
            Buka Dashboard
          </button>
        </div>
        <p className="mt-8 text-sm text-gray-400">
          <span className="font-semibold text-gold-500">Deschain</span> · Platform Pengadaan Kolektif UMKM
        </p>
      </div>
    </div>
  )
}

export default NotFound
