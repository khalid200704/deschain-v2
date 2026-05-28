import React from 'react'
import { analyticsAPI } from '../../api/endpoints'
import { Spinner } from '../common'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = (n) => n?.toLocaleString('id-ID') ?? '0'

export const DashboardMetrics = () => {
  const [metrics, setMetrics] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    analyticsAPI.getDashboard()
      .then((res) => { if (res.success) setMetrics(res.data) })
      .catch(() => setError('Gagal memuat metrik. Periksa koneksi Anda.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center py-12"><Spinner size="lg" /></div>
  )
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm flex items-center gap-3">
      <span>⚠️ {error}</span>
      <button onClick={() => window.location.reload()} className="text-red-700 underline text-xs">Muat ulang</button>
    </div>
  )

  const kpis = [
    {
      label: 'Total Pengadaan',
      value: `Rp ${fmt(Math.round((metrics?.total_procurement_value ?? 0) / 1_000_000))}M`,
      sub: 'Nilai kumulatif',
      icon: '📦',
      color: 'text-navy-900',
    },
    {
      label: 'Total Penghematan',
      value: `Rp ${fmt(Math.round((metrics?.total_savings ?? 0) / 1_000_000))}M`,
      sub: `${metrics?.average_savings_percentage ?? 0}% rata-rata`,
      icon: '💰',
      color: 'text-gold-500',
      badge: true,
    },
    {
      label: 'Transaksi Selesai',
      value: metrics?.total_transactions ?? 0,
      sub: 'Semua periode',
      icon: '✅',
      color: 'text-green-600',
    },
    {
      label: 'Skor Kredit',
      value: `${metrics?.credit_score ?? 0}/5`,
      sub: metrics?.credit_score >= 4 ? 'Sangat Baik' : metrics?.credit_score >= 3 ? 'Baik' : 'Sedang',
      icon: '⭐',
      color: 'text-navy-900',
      badge: true,
    },
  ]

  return (
    <div>
      {metrics?.is_demo && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-2 rounded-lg flex items-center gap-2">
          <span>📊</span>
          <span>Data demo — mulai pengadaan pertama Anda untuk melihat metrik nyata.</span>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="text-2xl mb-2">{k.icon}</div>
            <div className="text-xs font-medium text-gray-500 mb-1">{k.label}</div>
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-xs text-gray-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
        <h3 className="text-base font-bold text-navy-900 mb-4">Tren Penghematan</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics?.weekly_savings ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `Rp ${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11 }} width={70} />
            <Tooltip formatter={(v) => `Rp ${fmt(v)}`} />
            <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} name="Penghematan" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


const EVENT_STYLES = {
  completed: { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', label: 'Selesai' },
  joined:    { bg: 'bg-blue-50',  border: 'border-blue-200',  dot: 'bg-blue-500',  label: 'Bergabung' },
  requested: { bg: 'bg-gray-50',  border: 'border-gray-200',  dot: 'bg-gray-400',  label: 'Diminta' },
}

export const CreditTrail = () => {
  const [trail, setTrail] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    analyticsAPI.getCreditTrail()
      .then((res) => { if (res.success) setTrail(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const fmtDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) return <div className="py-8 text-center"><Spinner /></div>

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-navy-900">Credit Trail</h3>
        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Riwayat Pengadaan</span>
      </div>

      {trail.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-sm">Belum ada riwayat pengadaan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trail.map((item) => {
            const style = EVENT_STYLES[item.type] ?? EVENT_STYLES.requested
            return (
              <div key={item.id} className={`flex gap-3 p-4 rounded-xl border ${style.bg} ${style.border}`}>
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-navy-900">{item.event}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(item.date)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">{item.detail}</p>
                  {item.savings != null && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-semibold text-green-700">
                        Hemat Rp {fmt(Math.round(item.savings))}
                      </span>
                      <span className="text-xs text-green-600">({item.savings_pct}%)</span>
                    </div>
                  )}
                  {item.amount != null && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      Nilai: Rp {fmt(item.amount)}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
