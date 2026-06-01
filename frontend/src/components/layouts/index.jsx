import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import {
  LayoutDashboard, Users, ShoppingCart, Store, CreditCard, User, LogOut, MessageCircle
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard,  label: 'Dashboard',     path: '/dashboard',            roles: ['umkm', 'vendor'] },
  { icon: Users,            label: 'Cari Grup AI',  path: '/procurement/matching', roles: ['umkm'] },
  { icon: ShoppingCart,     label: 'Pengadaan',      path: '/procurement',          roles: ['umkm'] },
  { icon: Store,            label: 'Vendor',         path: '/vendors',              roles: ['umkm'] },
  { icon: CreditCard,       label: 'Transaksi',      path: '/transactions',         roles: ['umkm', 'vendor'] },
  { icon: MessageCircle,    label: 'Konsultasi AI',  path: '/consultation',         roles: ['umkm'] },
  { icon: User,             label: 'Profil',         path: '/profile',              roles: ['umkm', 'vendor'] },
]

export const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <nav className="bg-navy-900 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <span
          className="text-xl font-bold text-gold-500 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Deschain
        </span>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden sm:block">
              {user.first_name} {user.last_name}
            </span>
            <button
              onClick={() => { logout(); navigate('/auth/login') }}
              className="flex items-center gap-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`bg-navy-900 text-white fixed left-0 top-[65px] bottom-0 w-60 z-40 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {menuItems
            .filter(item => item.roles.includes(user?.user_type))
            .map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); onClose?.() }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gold-500 text-white'
                      : 'text-gray-400 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              )
            })}
        </nav>

        <div className="px-5 py-4 border-t border-white border-opacity-10">
          <p className="text-xs text-gray-600">PIDI-DIGDAYA X 2026</p>
        </div>
      </aside>
    </>
  )
}

export const DashboardLayout = ({ children, sidebarOpen, onToggle }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={onToggle} />
      <main className={`flex-1 min-w-0 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  </div>
)
