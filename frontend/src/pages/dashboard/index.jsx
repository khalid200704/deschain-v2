import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../stores'
import { DashboardLayout } from '../../components/layouts'
import { DashboardMetrics, CreditTrail } from '../../components/dashboard'
import { ProtectedRoute } from '../../components/common/ProtectedRoute'
import { useAuthStore } from '../../stores'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user } = useAuthStore()

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen}>
        <button onClick={toggleSidebar} className="mb-4 p-2 bg-navy-900 text-white rounded-lg">☰ Menu</button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              Selamat datang, {user?.first_name || 'Pengguna'} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Dashboard pengadaan kolektif Anda</p>
          </div>
          <button
            onClick={() => navigate('/procurement/matching')}
            className="px-4 py-2 bg-gold-500 text-white text-sm font-semibold rounded-xl hover:bg-gold-600 transition-colors"
          >
            🤖 Cari Grup AI
          </button>
        </div>

        <DashboardMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreditTrail />

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-base font-bold text-navy-900 mb-5">Aksi Cepat</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/procurement/matching')}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gold-300 hover:bg-gold-50 transition-colors text-left"
              >
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="font-semibold text-navy-900 text-sm">Cari Grup Pengadaan</div>
                  <div className="text-xs text-gray-500">AI mencocokkan kebutuhan Anda dengan UMKM lain</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors text-left">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-semibold text-navy-900 text-sm">Buat Permintaan Pengadaan</div>
                  <div className="text-xs text-gray-500">Ajukan kebutuhan baru untuk dicocokkan</div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors text-left">
                <span className="text-2xl">🏪</span>
                <div>
                  <div className="font-semibold text-navy-900 text-sm">Jelajahi Vendor</div>
                  <div className="text-xs text-gray-500">Temukan supplier terpercaya di daerah Anda</div>
                </div>
              </button>

              <div className="p-4 bg-navy-50 rounded-xl border border-navy-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-navy-900">💡 Tahukah Anda?</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  UMKM yang bergabung grup pengadaan rata-rata menghemat <strong>15-25%</strong> biaya
                  dibandingkan beli sendiri. Semakin besar grup, semakin besar diskon dari vendor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default DashboardPage
