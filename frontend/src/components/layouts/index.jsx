import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'

export const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <nav className="bg-navy-900 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-gold-500">Deschain</div>
        {user && (
          <div className="flex items-center gap-4">
            <span>{user.first_name || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-gold-500 hover:bg-gold-600 px-4 py-2 rounded-lg"
            >
              Keluar
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard', roles: ['umkm', 'vendor'] },
    { icon: '🤖', label: 'Cari Grup AI', path: '/procurement/matching', roles: ['umkm'] },
    { icon: '📋', label: 'Pengadaan', path: '/procurement', roles: ['umkm'] },
    { icon: '🏪', label: 'Vendor', path: '/vendors', roles: ['umkm'] },
    { icon: '💳', label: 'Transaksi', path: '/transactions', roles: ['umkm', 'vendor'] },
    { icon: '👤', label: 'Profil', path: '/profile', roles: ['umkm', 'vendor'] },
  ]

  return (
    <div className={`bg-navy-900 text-white min-h-screen w-64 fixed left-0 top-0 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8 text-gold-500">Deschain</h2>
        
        <nav className="space-y-2">
          {menuItems
            .filter(item => item.roles.includes(user?.user_type))
            .map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-navy-500 transition-colors"
              >
                {item.icon} {item.label}
              </button>
            ))}
        </nav>
      </div>
    </div>
  )
}

export const DashboardLayout = ({ children, sidebarOpen }) => (
  <div>
    <Navbar />
    <Sidebar isOpen={sidebarOpen} />
    <main className={`${sidebarOpen ? 'ml-64' : 'ml-0'} p-6`}>
      {children}
    </main>
  </div>
)
