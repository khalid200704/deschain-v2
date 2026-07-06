import React from 'react'
import { analyticsAPI } from '../../api/endpoints'
import { Spinner } from '../common'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Package, Wallet, CheckCircle, Star, TrendingUp, Clock, Download, BarChart2, ShoppingBag } from 'lucide-react'
import apiClient from '../../api/client'

const fmt = (n) => n?.toLocaleString('id-ID') ?? '0'

export const DashboardMetrics = () => {
  const [metrics, setMetrics] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    analyticsAPI.getDashboard()
      .then((res) => { if (res.success) setMetrics(res.data) })
      .catch(() => setError('Gagal memuat metrik.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center py-16"><Spinner size="lg" /></div>
  )
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center justify-between">
      <span>{error}</span>
      <button onClick={() => window.location.reload()} className="text-red-700 underline text-xs">Muat ulang</button>
    </div>
  )

  const kpis = [
    {
      label: 'Total Pengadaan',
      value: `Rp ${fmt(Math.round((metrics?.total_procurement_value ?? 0) / 1_000_000))} Jt`,
      sub: 'Nilai kumulatif',
      icon: Package,
      color: 'text-navy-900',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Penghematan',
      value: `Rp ${fmt(Math.round((metrics?.total_savings ?? 0) / 1_000_000))} Jt`,
      sub: `${metrics?.average_savings_percentage ?? 0}% rata-rata`,
      icon: Wallet,
      color: 'text-gold-500',
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Transaksi Selesai',
      value: metrics?.total_transactions ?? 0,
      sub: 'Semua periode',
      icon: CheckCircle,
      color: 'text-green-600',
      iconBg: 'bg-green-50 text-green-600',
    },
    {
      label: 'Skor Kredit',
      value: `${metrics?.credit_score ?? 0}/5`,
      sub: metrics?.credit_score >= 4 ? 'Sangat Baik' : metrics?.credit_score >= 3 ? 'Baik' : 'Sedang',
      icon: Star,
      color: 'text-navy-900',
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div>
      {metrics?.is_demo && (
        <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
          <TrendingUp size={14} />
          Data demo — buat pengadaan pertama untuk melihat metrik nyata Anda.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.iconBg}`}>
                <Icon size={18} />
              </div>
              <div className="text-xs text-gray-500 mb-1">{k.label}</div>
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-xs text-gray-400 mt-1">{k.sub}</div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-navy-900 mb-4">Tren Penghematan</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={metrics?.weekly_savings ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `Rp ${(v / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={72} />
            <Tooltip
              formatter={(v) => [`Rp ${fmt(v)}`, 'Penghematan']}
              contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
            />
            <Line type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3, fill: '#F59E0B' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const TRAIL_STYLES = {
  completed: { dot: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-100' },
  joined:    { dot: 'bg-blue-500',  bg: 'bg-blue-50',  border: 'border-blue-100'  },
  requested: { dot: 'bg-gray-300',  bg: 'bg-gray-50',  border: 'border-gray-100'  },
}

export const CreditTrail = () => {
  const [trail, setTrail] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [isDemo, setIsDemo] = React.useState(false)

  React.useEffect(() => {
    analyticsAPI.getCreditTrail()
      .then((res) => {
        if (res.success) {
          setTrail(res.data)
          setIsDemo(res.is_demo || false)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const fmtDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return isNaN(d) ? '—' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex justify-center py-12">
      <Spinner />
    </div>
  )

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-navy-900">Credit Trail</h3>
          <button
            onClick={async () => {
              try {
                const res = await apiClient.get('/analytics/credit-trail/export')
                const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'credit-trail-deschain.json'
                a.click()
                URL.revokeObjectURL(url)
              } catch {}
            }}
            className="flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700 bg-gold-50 hover:bg-gold-100 px-2 py-1 rounded-lg transition-colors"
            title="Export untuk pengajuan KUR"
          >
            <Download size={11} />
            Export
          </button>
          {isDemo ? (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Demo</span>
          ) : (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Data Nyata
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={12} />
          Riwayat Pengadaan
        </div>
      </div>

      {trail.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">Belum ada riwayat pengadaan.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trail.map((item) => {
            const s = TRAIL_STYLES[item.type] ?? TRAIL_STYLES.requested
            return (
              <div key={item.id} className={`flex gap-3 p-3.5 rounded-xl border ${s.bg} ${s.border}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-navy-900">{item.event}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(item.date)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.detail}</p>
                  {item.savings != null && (
                    <p className="text-xs font-medium text-green-700 mt-1">
                      Hemat Rp {fmt(Math.round(item.savings))} ({item.savings_pct}%)
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {isDemo && (
        <p className="text-xs text-amber-600 mt-3 text-center">
          💡 Bergabung ke grup pengadaan untuk memulai credit trail nyata Anda
        </p>
      )}
    </div>
  )
}

export const ForecastWidget = () => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    analyticsAPI.getForecast(null, 4)
      .then((res) => { if (res.success) setData(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex justify-center py-12">
      <Spinner />
    </div>
  )
  if (!data) return null

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <BarChart2 size={15} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-900">Prediksi Demand</h3>
            <p className="text-xs text-gray-400">{data.product_category}</p>
          </div>
        </div>
        {data.is_demo && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Demo</span>
        )}
      </div>

      {/* EOQ Highlight */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-center gap-3">
        <ShoppingBag size={16} className="text-blue-600 flex-shrink-0" />
        <div>
          <div className="text-xs text-blue-600 font-medium">Rekomendasi Order (EOQ)</div>
          <div className="text-lg font-bold text-blue-800">
            {data.eoq?.recommended_order_qty?.toLocaleString('id-ID')} unit/order
          </div>
          <div className="text-xs text-blue-500">
            Rata-rata demand: {data.eoq?.weekly_avg_demand?.toLocaleString('id-ID')} unit/minggu
          </div>
        </div>
      </div>

      {/* Forecast table */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">4 Minggu ke Depan</div>
        {data.forecast?.map((row, i) => (
          <div
            key={row.week}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
              i === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
            }`}
          >
            <span className="text-gray-500 text-xs">{row.date}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-xs">demand: <strong>{row.predicted_demand}</strong></span>
              <span className="text-blue-700 text-xs font-semibold">order: {row.recommended_order}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
