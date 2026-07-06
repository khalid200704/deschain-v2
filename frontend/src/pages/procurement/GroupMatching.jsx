import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layouts'
import { useUIStore } from '../../stores'
import { ProtectedRoute } from '../../components/common/ProtectedRoute'
import apiClient from '../../api/client'
import { matchingAPI } from '../../api/endpoints'
import { Menu, Search, Users, CheckCircle, Layers } from 'lucide-react'

const CATEGORIES = [
  'Sembako', 'Beras & Biji-bijian', 'Minyak & Lemak', 'Sayur & Buah',
  'Daging & Ikan', 'Bumbu & Rempah', 'Tekstil & Kain', 'Plastik & Kemasan',
  'Peralatan Dapur', 'Bahan Bangunan', 'Elektronik', 'Lainnya',
]

const UNITS = ['kg', 'liter', 'ton', 'kwintal', 'karton', 'dus', 'pcs', 'meter', 'lusin']

const URGENCIES = [
  { value: 'urgent', label: '🔴 Mendesak (< 3 hari)' },
  { value: 'normal', label: '🟡 Normal (1-2 minggu)' },
  { value: 'flexible', label: '🟢 Fleksibel (> 2 minggu)' },
]

const GroupMatching = () => {
  const navigate = useNavigate()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const [form, setForm] = useState({
    product_name: 'Beras Premium',
    product_category: 'Beras & Biji-bijian',
    quantity: '200',
    unit: 'kg',
    budget: '3000000',
    delivery_city: 'Pontianak',
    delivery_urgency: 'normal',
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [batchResult, setBatchResult] = useState(null)
  const [mode, setMode] = useState('match') // 'match' | 'batch'
  const [errors, setErrors] = useState({})
  const [joining, setJoining] = useState(null)
  const [joined, setJoined] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.product_name.trim()) e.product_name = 'Nama produk wajib diisi'
    if (!form.quantity || parseFloat(form.quantity) <= 0) e.quantity = 'Kuantitas harus lebih dari 0'
    if (!form.budget || parseFloat(form.budget) <= 0) e.budget = 'Budget harus lebih dari 0'
    if (!form.delivery_city.trim()) e.delivery_city = 'Kota pengiriman wajib diisi'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setMode('match')
    setLoading(true)
    setResults(null)
    setBatchResult(null)
    try {
      const res = await apiClient.post('/matching/groups/match', {
        ...form,
        quantity: parseFloat(form.quantity),
        budget: parseFloat(form.budget),
      })
      if (res.success) setResults(res.data)
      else setErrors({ general: res.message || 'Gagal mencari grup.' })
    } catch (err) {
      setErrors({ general: err?.detail || 'Gagal mencari grup. Pastikan Anda sudah login.' })
    } finally {
      setLoading(false)
    }
  }

  const handleBatchOptimize = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setErrors({})
    setLoading(true)
    setResults(null)
    setBatchResult(null)
    try {
      const res = await matchingAPI.batchOptimize({
        ...form,
        quantity: parseFloat(form.quantity),
        budget: parseFloat(form.budget),
      })
      if (res.success) setBatchResult(res.data)
      else setErrors({ general: res.message || 'Gagal optimasi batch.' })
    } catch (err) {
      setErrors({ general: err?.detail || 'Gagal optimasi batch.' })
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (group) => {
    setJoining(group.id)
    try {
      const res = await matchingAPI.joinGroup({
        product_name: form.product_name,
        product_category: form.product_category,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        budget: parseFloat(form.budget),
        delivery_city: form.delivery_city,
        delivery_urgency: form.delivery_urgency,
        group_id: group.id,
        group_name: group.group_name,
      })
      if (res.success) {
        setJoined((prev) => ({ ...prev, [group.id]: res.data }))
      } else {
        setErrors({ general: res.message || 'Gagal bergabung.' })
      }
    } catch (err) {
      setErrors({ general: err?.detail || 'Gagal bergabung ke grup.' })
    } finally {
      setJoining(null)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen} onToggle={toggleSidebar}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={toggleSidebar} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Menu size={18} className="text-navy-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-navy-900">AI Group Matching</h1>
            <p className="text-gray-400 text-sm">Temukan UMKM lain dengan kebutuhan pengadaan serupa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-navy-900 mb-5">Input Kebutuhan Pengadaan</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-1">Nama Produk *</label>
                  <input
                    name="product_name"
                    value={form.product_name}
                    onChange={handleChange}
                    placeholder="cth: Beras Premium Pandan Wangi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 text-sm"
                  />
                  {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-1">Kategori</label>
                  <select
                    name="product_category"
                    value={form.product_category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 text-sm"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-1">Kuantitas *</label>
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 text-sm"
                    />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-900 mb-1">Satuan</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 text-sm"
                    >
                      {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-1">Budget (Rp) *</label>
                  <input
                    name="budget"
                    type="number"
                    min="1"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="5000000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 text-sm"
                  />
                  {form.budget && (
                    <p className="text-xs text-gray-500 mt-1">
                      Rp {parseInt(form.budget).toLocaleString('id-ID')}
                    </p>
                  )}
                  {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-1">Kota Pengiriman</label>
                  <input
                    name="delivery_city"
                    value={form.delivery_city}
                    onChange={handleChange}
                    placeholder="Pontianak"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 text-sm"
                  />
                  {errors.delivery_city && <p className="text-red-500 text-xs mt-1">{errors.delivery_city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-1">Urgensi</label>
                  <div className="space-y-2">
                    {URGENCIES.map((u) => (
                      <label key={u.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery_urgency"
                          value={u.value}
                          checked={form.delivery_urgency === u.value}
                          onChange={handleChange}
                          className="accent-gold-500"
                        />
                        <span className="text-sm">{u.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50"
                  >
                    {loading && mode === 'match' ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mencari grup...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Search size={15} />
                        Cari Grup (AI Match)
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => { setMode('batch'); handleBatchOptimize() }}
                    className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors disabled:opacity-50"
                  >
                    {loading && mode === 'batch' ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengoptimasi...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Layers size={15} />
                        Optimasi Batch
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Hasil */}
          <div className="lg:col-span-3">
            {!results && !loading && (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-navy-900" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">AI Siap Mencocokkan</h3>
                <p className="text-gray-400 text-sm">
                  Isi form di kiri, lalu klik "Cari Grup Sekarang" untuk melihat rekomendasi grup terbaik.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-navy-900 font-medium text-sm">Menganalisis kebutuhan Anda...</p>
                <p className="text-gray-400 text-xs mt-1">Mencari UMKM dengan kebutuhan serupa di {form.delivery_city}</p>
              </div>
            )}

            {/* Batch Optimize Results */}
            {batchResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-navy-900">Hasil Optimasi Batch</h2>
                </div>

                {/* Summary */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Budget</div>
                      <div className="font-bold text-navy-900 text-sm">
                        Rp {batchResult.total_original_cost?.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Setelah Diskon</div>
                      <div className="font-bold text-green-700 text-sm">
                        Rp {batchResult.total_optimized_cost?.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Total Hemat</div>
                      <div className="font-bold text-green-600 text-lg">
                        {batchResult.savings_pct}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Batch cards */}
                {batchResult.batches?.map((batch, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-navy-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-navy-900 text-sm">Batch {i + 1}</div>
                          <div className="text-xs text-gray-400">{batch.member_count} anggota · {batch.total_quantity} unit total</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold">{batch.discount_pct}% diskon</div>
                        <div className="text-xs text-gray-400">dari vendor</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-xs text-gray-500">Vendor</div>
                        <div className="font-medium text-navy-900 text-xs mt-0.5">{batch.vendor_name}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2">
                        <div className="text-xs text-gray-500">Penghematan</div>
                        <div className="font-bold text-green-700 text-xs mt-0.5">
                          Rp {batch.savings?.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {batch.earliest_deadline && (
                      <div className="text-xs text-gray-400">
                        📅 {batch.earliest_deadline}
                        {batch.latest_deadline && batch.latest_deadline !== batch.earliest_deadline
                          ? ` — ${batch.latest_deadline}`
                          : ''}
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}

            {results && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-navy-900">
                    {results.groups?.length} Grup Ditemukan
                  </h2>
                  <span className="text-sm text-gray-500">
                    untuk: <strong>{results.query?.product_name}</strong>
                  </span>
                </div>

                {results.groups?.map((group, idx) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:border-gold-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {idx === 0 && (
                            <span className="bg-gold-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              ⭐ Terbaik
                            </span>
                          )}
                          <h3 className="font-bold text-navy-900">{group.group_name}</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          📍 {group.delivery_city} · {group.member_count} anggota · {group.total_quantity} {group.unit} total
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{group.estimated_savings_pct}%</div>
                        <div className="text-xs text-gray-500">estimasi hemat</div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                      <div className="text-sm font-semibold text-green-800">
                        💰 Estimasi penghematan Anda: Rp {group.estimated_savings_amount?.toLocaleString('id-ID')}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Dibandingkan beli sendiri di harga pasar
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Anggota Grup</div>
                      <div className="space-y-1">
                        {group.member_details?.slice(0, 3).map((m) => (
                          <div key={m.id} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-2 h-2 bg-gold-400 rounded-full flex-shrink-0" />
                            {m.product_name} — {m.quantity} {m.unit}
                          </div>
                        ))}
                        {group.member_details?.length > 3 && (
                          <div className="text-xs text-gray-400">+{group.member_details.length - 3} anggota lainnya</div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {joined[group.id] ? (
                        <div className="flex-1 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                          <CheckCircle size={14} />
                          Berhasil Bergabung — Hemat {joined[group.id].estimated_savings_pct}%
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoin(group)}
                          disabled={joining === group.id}
                          className="flex-1 py-2 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {joining === group.id ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Users size={14} />
                          )}
                          {joining === group.id ? 'Memproses...' : 'Gabung Grup'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default GroupMatching
