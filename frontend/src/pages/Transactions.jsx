import React from 'react'
import { DashboardLayout } from '../components/layouts'
import { useUIStore } from '../stores'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { Menu, CheckCircle, Clock, TrendingDown, ThumbsUp, PackageCheck } from 'lucide-react'
import { transactionAPI, matchingAPI } from '../api/endpoints'
import { Spinner } from '../components/common'

const fmt = (n) => (n || 0).toLocaleString('id-ID')

const StatusBadge = ({ status }) => {
  if (status === 'completed') return (
    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
      <CheckCircle size={10} /> Selesai
    </span>
  )
  if (status === 'active') return (
    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
      <Clock size={10} /> Aktif
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
      <Clock size={10} /> Menunggu
    </span>
  )
}

const Transactions = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [data, setData] = React.useState([])
  const [summary, setSummary] = React.useState({ total: 0, total_savings: 0, completed: 0 })
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState({})
  const [actionMsg, setActionMsg] = React.useState({})

  const reload = () => {
    transactionAPI.getMy()
      .then((res) => { if (res.success) { setData(res.data); setSummary(res.summary) } })
      .catch(() => {})
  }

  React.useEffect(() => {
    transactionAPI.getMy()
      .then((res) => {
        if (res.success) { setData(res.data); setSummary(res.summary) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleConfirm = async (tx) => {
    if (!tx.group_id) return
    setActionLoading(prev => ({ ...prev, [tx.id]: 'confirm' }))
    try {
      const res = await matchingAPI.confirmGroup(tx.group_id)
      setActionMsg(prev => ({ ...prev, [tx.id]: res.message || 'Dikonfirmasi' }))
      reload()
    } catch (e) {
      setActionMsg(prev => ({ ...prev, [tx.id]: e?.detail || 'Gagal mengkonfirmasi' }))
    } finally {
      setActionLoading(prev => ({ ...prev, [tx.id]: null }))
    }
  }

  const handleComplete = async (tx) => {
    if (!tx.group_id) return
    setActionLoading(prev => ({ ...prev, [tx.id]: 'complete' }))
    try {
      const res = await matchingAPI.completeGroup(tx.group_id)
      setActionMsg(prev => ({ ...prev, [tx.id]: res.message || 'Selesai' }))
      reload()
    } catch (e) {
      setActionMsg(prev => ({ ...prev, [tx.id]: e?.detail || 'Gagal menyelesaikan' }))
    } finally {
      setActionLoading(prev => ({ ...prev, [tx.id]: null }))
    }
  }

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen} onToggle={toggleSidebar}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={toggleSidebar} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Menu size={18} className="text-navy-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-navy-900">Transaksi</h1>
            <p className="text-gray-400 text-sm">Riwayat pengadaan kolektif Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Total Transaksi</div>
            <div className="text-2xl font-bold text-navy-900">{summary.total}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <TrendingDown size={11} /> Total Penghematan
            </div>
            <div className="text-2xl font-bold text-gold-500">Rp {fmt(summary.total_savings)}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <CheckCircle size={11} /> Selesai
            </div>
            <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-gray-400 text-sm">Belum ada transaksi. Bergabung ke grup pengadaan untuk mulai.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-navy-900">Semua Transaksi</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {data.map((tx) => (
                <div key={tx.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={tx.status} />
                      </div>
                      <div className="font-medium text-navy-900 text-sm truncate">{tx.group_name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{tx.vendor} · {fmtDate(tx.date)}</div>
                      {actionMsg[tx.id] && (
                        <div className="text-xs text-green-600 mt-1">{actionMsg[tx.id]}</div>
                      )}
                      <div className="flex gap-2 mt-2">
                        {tx.membership_status === 'pending' && tx.group_status !== 'completed' && (
                          <button
                            onClick={() => handleConfirm(tx)}
                            disabled={!!actionLoading[tx.id]}
                            className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            <ThumbsUp size={11} />
                            {actionLoading[tx.id] === 'confirm' ? 'Memproses...' : 'Konfirmasi Saya Ikut'}
                          </button>
                        )}
                        {tx.membership_status === 'confirmed' && tx.group_status !== 'completed' && (
                          <button
                            onClick={() => handleComplete(tx)}
                            disabled={!!actionLoading[tx.id]}
                            className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            <PackageCheck size={11} />
                            {actionLoading[tx.id] === 'complete' ? 'Memproses...' : 'Barang Diterima'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-navy-900 text-sm">Rp {fmt(tx.amount)}</div>
                      {tx.savings > 0 && (
                        <div className="text-xs text-green-600 font-medium mt-0.5">
                          Hemat Rp {fmt(tx.savings)} ({tx.savings_pct}%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Transactions
