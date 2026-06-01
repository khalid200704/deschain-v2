import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { Spinner } from '../components/common'
import apiClient from '../api/client'
import {
  Users, Package, TrendingUp, CheckCircle, Clock,
  ShieldCheck, XCircle, BarChart3, MapPin, LogOut
} from 'lucide-react'

const fmt = (n) => (n || 0).toLocaleString('id-ID')

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-navy-900', iconBg = 'bg-blue-50 text-blue-600' }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
      <Icon size={18} />
    </div>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
  </div>
)

const Admin = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [stats, setStats] = React.useState(null)
  const [users, setUsers] = React.useState([])
  const [groups, setGroups] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [tab, setTab] = React.useState('overview')
  const [verifying, setVerifying] = React.useState(null)

  React.useEffect(() => {
    Promise.all([
      apiClient.get('/admin/stats'),
      apiClient.get('/admin/users'),
      apiClient.get('/admin/groups'),
    ]).then(([s, u, g]) => {
      if (s.success) setStats(s.data)
      if (u.success) setUsers(u.data)
      if (g.success) setGroups(g.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleVerify = async (userId) => {
    setVerifying(userId)
    try {
      const res = await apiClient.put(`/admin/users/${userId}/verify`)
      if (res.success) {
        setUsers((prev) => prev.map((u) =>
          u.id === userId ? { ...u, verification_status: 'verified', is_verified: true } : u
        ))
      }
    } finally {
      setVerifying(null)
    }
  }

  const handleToggleActive = async (userId) => {
    try {
      const res = await apiClient.put(`/admin/users/${userId}/toggle-active`)
      if (res.success) {
        setUsers((prev) => prev.map((u) =>
          u.id === userId ? { ...u, is_active: !u.is_active } : u
        ))
      }
    } catch {}
  }

  const fmtDate = (iso) => iso
    ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  const pending = users.filter((u) => u.verification_status === 'pending' && u.user_type !== 'admin')

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-navy-900 text-white px-6 py-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gold-500">Deschain</span>
              <span className="text-xs bg-gold-500 text-white px-2 py-0.5 rounded-full font-bold">ADMIN</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">{user?.first_name} {user?.last_name}</span>
              <button
                onClick={() => { logout(); navigate('/') }}
                className="flex items-center gap-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-lg text-sm"
              >
                <LogOut size={14} /> Keluar
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-0.5">Manajemen platform Deschain</p>
            </div>
            {pending.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-2 rounded-xl">
                <Clock size={14} />
                {pending.length} akun menunggu verifikasi
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'users', label: `User (${users.length})`, icon: Users },
              { key: 'groups', label: `Grup (${groups.length})`, icon: Package },
            ].map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.key ? 'bg-navy-900 text-white' : 'text-gray-500 hover:text-navy-900'
                  }`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {tab === 'overview' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Total UMKM" value={stats.users.umkm} iconBg="bg-blue-50 text-blue-600" />
                    <StatCard icon={Package} label="Total Vendor" value={stats.users.vendor} iconBg="bg-purple-50 text-purple-600" />
                    <StatCard icon={TrendingUp} label="Total Penghematan" value={`Rp ${fmt(Math.round(stats.procurement.total_savings / 1000))}K`} color="text-gold-500" iconBg="bg-amber-50 text-amber-600" />
                    <StatCard icon={CheckCircle} label="Grup Selesai" value={stats.groups.completed} color="text-green-600" iconBg="bg-green-50 text-green-600" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-navy-900 mb-4">Status Verifikasi</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">UMKM Terverifikasi</span>
                          <span className="font-semibold text-green-600">{stats.verification.umkm_verified}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">UMKM Menunggu</span>
                          <span className="font-semibold text-amber-600">{stats.verification.umkm_pending}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Vendor Terverifikasi</span>
                          <span className="font-semibold text-green-600">{stats.verification.vendor_verified}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Vendor Menunggu</span>
                          <span className="font-semibold text-amber-600">{stats.verification.vendor_pending}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-navy-900 mb-4">Statistik Grup</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Grup</span>
                          <span className="font-semibold">{stats.groups.total}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Grup Aktif</span>
                          <span className="font-semibold text-blue-600">{stats.groups.active}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Keanggotaan</span>
                          <span className="font-semibold">{stats.groups.members}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Permintaan</span>
                          <span className="font-semibold">{stats.procurement.total_requests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-semibold text-navy-900 mb-4">
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> Top Kota</span>
                      </h3>
                      <div className="space-y-2">
                        {stats.top_cities.map((c, i) => (
                          <div key={c.city} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 bg-navy-50 rounded-lg flex items-center justify-center text-xs font-bold text-navy-900">{i + 1}</span>
                              <span className="text-gray-600">{c.city || '—'}</span>
                            </div>
                            <span className="font-semibold text-navy-900">{c.count} UMKM</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {tab === 'users' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-navy-900">Semua Pengguna</h3>
                    <span className="text-xs text-gray-400">{users.length} total</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-50 bg-gray-50">
                          <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium">Nama / Email</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Tipe</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Bisnis</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Kota</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Daftar</th>
                          <th className="px-4 py-3 text-xs text-gray-500 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {users.map((u) => (
                          <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${!u.is_active ? 'opacity-50' : ''}`}>
                            <td className="px-6 py-3">
                              <div className="font-medium text-navy-900">{u.name || '—'}</div>
                              <div className="text-xs text-gray-400">{u.email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                u.user_type === 'admin' ? 'bg-purple-100 text-purple-700' :
                                u.user_type === 'vendor' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {u.user_type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-xs">{u.business_name || '—'}</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">{u.city || '—'}</td>
                            <td className="px-4 py-3">
                              {u.verification_status === 'verified' ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle size={11} /> Terverifikasi
                                </span>
                              ) : u.verification_status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                  <Clock size={11} /> Menunggu
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(u.created_at)}</td>
                            <td className="px-4 py-3">
                              {u.user_type !== 'admin' && (
                                <div className="flex items-center gap-2">
                                  {u.verification_status === 'pending' && (
                                    <button
                                      onClick={() => handleVerify(u.id)}
                                      disabled={verifying === u.id}
                                      className="flex items-center gap-1 text-xs bg-green-500 text-white px-2.5 py-1 rounded-lg hover:bg-green-600 disabled:opacity-50"
                                    >
                                      {verifying === u.id
                                        ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                        : <ShieldCheck size={11} />}
                                      Verifikasi
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleToggleActive(u.id)}
                                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                                      u.is_active
                                        ? 'border-red-200 text-red-500 hover:bg-red-50'
                                        : 'border-green-200 text-green-600 hover:bg-green-50'
                                    }`}
                                  >
                                    {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* GROUPS TAB */}
              {tab === 'groups' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-navy-900">Semua Grup Pengadaan</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-50 bg-gray-50">
                          <th className="text-left px-6 py-3 text-xs text-gray-500 font-medium">Nama Grup</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Kategori</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Kota</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Anggota</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Total Nilai</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Penghematan</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {groups.map((g) => (
                          <tr key={g.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 font-medium text-navy-900 text-sm">{g.group_name}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{g.product_category}</td>
                            <td className="px-4 py-3 text-xs text-gray-500">{g.delivery_city}</td>
                            <td className="px-4 py-3 text-sm font-semibold">{g.member_count}</td>
                            <td className="px-4 py-3 text-xs text-gray-600">Rp {fmt(g.total_budget)}</td>
                            <td className="px-4 py-3 text-xs text-green-600 font-medium">Rp {fmt(Math.round(g.total_savings))}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                g.status === 'completed' ? 'bg-green-100 text-green-700' :
                                g.status === 'forming' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {g.status === 'completed' ? 'Selesai' :
                                 g.status === 'forming' ? 'Membentuk' : g.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Admin
