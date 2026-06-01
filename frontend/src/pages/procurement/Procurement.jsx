import React from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layouts'
import { useUIStore } from '../../stores'
import { ProtectedRoute } from '../../components/common/ProtectedRoute'
import { Menu, Plus, Search, Clock, CheckCircle, AlertCircle, XCircle, Users } from 'lucide-react'
import apiClient from '../../api/client'

const STATUS_MAP = {
  draft:     { label: 'Draft',     icon: Clock,         cls: 'bg-gray-100 text-gray-600' },
  active:    { label: 'Aktif',     icon: AlertCircle,   cls: 'bg-blue-100 text-blue-600' },
  matched:   { label: 'Dicocokkan', icon: CheckCircle,  cls: 'bg-amber-100 text-amber-600' },
  completed: { label: 'Selesai',   icon: CheckCircle,   cls: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Dibatalkan', icon: XCircle,      cls: 'bg-red-100 text-red-600' },
}

const fmt = (n) => n?.toLocaleString('id-ID') ?? '0'

const Procurement = () => {
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [requests, setRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    apiClient.get('/procurement/requests/my')
      .then((res) => { if (res.success) setRequests(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = requests.filter((r) =>
    r.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.product_category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen} onToggle={toggleSidebar}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Menu size={18} className="text-navy-900" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-navy-900">Pengadaan</h1>
              <p className="text-gray-400 text-sm">Daftar permintaan pengadaan Anda</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/procurement/matching')}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white text-sm font-semibold rounded-xl hover:bg-gold-600 transition-colors"
          >
            <Plus size={15} />
            Buat Permintaan
          </button>
        </div>

        <div className="relative mb-5 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk atau kategori..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-gold-500 text-sm"
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Memuat...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-navy-900 mb-1">
              {search ? 'Tidak ada hasil' : 'Belum ada permintaan'}
            </p>
            <p className="text-gray-400 text-sm mb-5">
              {search ? `Tidak ditemukan untuk "${search}"` : 'Buat permintaan pengadaan pertama Anda'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/procurement/matching')}
                className="px-5 py-2 bg-gold-500 text-white text-sm font-semibold rounded-xl hover:bg-gold-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={14} />
                Buat Permintaan
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filtered.map((req) => {
                const s = STATUS_MAP[req.status] ?? STATUS_MAP.draft
                const StatusIcon = s.icon
                return (
                  <div key={req.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
                            <StatusIcon size={10} />
                            {s.label}
                          </span>
                          <span className="text-xs text-gray-300">{req.product_category}</span>
                        </div>
                        <div className="font-medium text-navy-900 text-sm">{req.product_name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {req.quantity} {req.unit} &middot; {req.delivery_city}
                        </div>
                        {(req.status === 'active' || req.status === 'draft') && (
                          <button
                            onClick={() => navigate('/procurement/matching')}
                            className="mt-2 text-xs text-gold-500 font-medium hover:underline flex items-center gap-1"
                          >
                            <Users size={11} />
                            Cari Grup AI →
                          </button>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-semibold text-navy-900 text-sm">Rp {fmt(req.budget)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(req.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Procurement
