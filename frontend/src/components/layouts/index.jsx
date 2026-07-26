import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, useNotificationStore } from '../../stores'
import { notificationAPI } from '../../api/endpoints'
import {
  LayoutDashboard, Users, ShoppingCart, Store, CreditCard, User, LogOut, MessageCircle, Bell
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

const SSE_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout, token } = useAuthStore()
  const { notifications, unreadCount, setNotifications, setUnreadCount, markAsRead } = useNotificationStore()
  const [showNotif, setShowNotif] = React.useState(false)

  React.useEffect(() => {
    if (!user || !token) return

    let es = null
    let retryTimeout = null
    let retryDelay = 5000

    const connect = () => {
      es = new EventSource(
        `${SSE_BASE}/notification/stream?token=${encodeURIComponent(token)}`
      )

      es.onopen = () => { retryDelay = 5000 }

      es.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data)
          if (d.error) return
          if (Array.isArray(d.notifications)) setNotifications(d.notifications)
          if (typeof d.unread_count === 'number') setUnreadCount(d.unread_count)
        } catch {}
      }

      es.onerror = () => {
        es.close()
        notificationAPI.list()
          .then(res => { if (res.success) setNotifications(res.data) })
          .catch(() => {})
        retryTimeout = setTimeout(() => {
          retryDelay = Math.min(retryDelay * 2, 60_000)
          connect()
        }, retryDelay)
      }
    }

    connect()
    return () => {
      es?.close()
      clearTimeout(retryTimeout)
    }
  }, [user, token])

  React.useEffect(() => {
    if (!showNotif) return
    const handler = (e) => {
      if (!e.target.closest('.notif-dropdown')) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showNotif])

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
            <div className="notif-dropdown relative">
              <button
                onClick={() => setShowNotif(v => !v)}
                className="relative p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full text-xs flex items-center justify-center font-bold text-white leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-10 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy-900">Notifikasi</span>
                    {unreadCount > 0 && (
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={() => {
                          notificationAPI.markAllRead().catch(() => {})
                          setNotifications(notifications.map(n => ({ ...n, is_read: true })))
                        }}
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-400 text-sm">
                        Tidak ada notifikasi
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-blue-50' : ''}`}
                          onClick={() => {
                            if (!n.is_read) {
                              notificationAPI.markAsRead(n.id).catch(() => {})
                              markAsRead(n.id)
                            }
                          }}
                        >
                          <div className="font-medium text-navy-900">{n.title}</div>
                          <div className="text-gray-500 text-xs mt-0.5 line-clamp-2">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
      <aside className={`bg-navy-900 text-white fixed left-0 top-[65px] bottom-0 w-60 z-40 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
  <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={onToggle} />
      <main className="flex-1 min-w-0 overflow-y-auto p-6 lg:ml-60 transition-all duration-300">
        {children}
      </main>
    </div>
  </div>
)
