import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore, useAuthStore } from '../../stores'
import { DashboardLayout } from '../../components/layouts'
import { DashboardMetrics, CreditTrail, ForecastWidget } from '../../components/dashboard'
import { ProtectedRoute } from '../../components/common/ProtectedRoute'
import { Users, ShoppingCart, Store, Menu } from 'lucide-react'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user } = useAuthStore()

  const quickActions = [
    {
      icon: Users,
      title: 'Cari Grup Pengadaan',
      desc: 'AI mencocokkan kebutuhan Anda dengan UMKM lain',
      path: '/procurement/matching',
      color: 'hover:border-gold-300 hover:bg-amber-50',
    },
    {
      icon: ShoppingCart,
      title: 'Buat Permintaan',
      desc: 'Ajukan kebutuhan baru untuk dicocokkan',
      path: '/procurement',
      color: 'hover:border-blue-200 hover:bg-blue-50',
    },
    {
      icon: Store,
      title: 'Jelajahi Vendor',
      desc: 'Temukan supplier terpercaya di daerah Anda',
      path: '/vendors',
      color: 'hover:border-green-200 hover:bg-green-50',
    },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen} onToggle={toggleSidebar}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Menu size={18} className="text-navy-900" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-navy-900">
                Selamat datang, {user?.first_name || 'Pengguna'}
              </h1>
              <p className="text-gray-400 text-sm">Dashboard pengadaan kolektif Anda</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/procurement/matching')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gold-500 text-white text-sm font-semibold rounded-xl hover:bg-gold-600 transition-colors"
          >
            <Users size={15} />
            Cari Grup AI
          </button>
        </div>

        <DashboardMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CreditTrail />
          </div>
          <ForecastWidget />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-navy-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-2">
              {quickActions.map((a) => {
                const Icon = a.icon
                return (
                  <button
                    key={a.title}
                    onClick={() => navigate(a.path)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 transition-colors text-left ${a.color}`}
                  >
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={17} className="text-navy-900" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-navy-900">{a.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{a.desc}</div>
                    </div>
                  </button>
                )
              })}

              <div className="mt-4 p-4 bg-navy-50 rounded-xl border border-navy-100">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold text-navy-900">Tahukah Anda?</span> UMKM yang bergabung
                  grup pengadaan rata-rata menghemat <span className="font-semibold">15–25%</span> biaya
                  dibandingkan beli sendiri.
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
