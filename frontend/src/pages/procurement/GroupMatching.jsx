import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layouts'
import { useUIStore } from '../../stores'
import { ProtectedRoute } from '../../components/common/ProtectedRoute'
import apiClient from '../../api/client'

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
    product_name: '',
    product_category: 'Sembako',
    quantity: '',
    unit: 'kg',
    budget: '',
    delivery_city: 'Pontianak',
    delivery_urgency: 'normal',
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.product_name || !form.quantity || !form.budget) {
      setError('Nama produk, kuantitas, dan budget wajib diisi.')
      return
    }
    setLoading(true)
    setResults(null)
    setError('')
    try {
      const res = await apiClient.post('/matching/groups/match', {
        ...form,
        quantity: parseFloat(form.quantity),
        budget: parseFloat(form.budget),
      })
      setResults(res.data)
    } catch (err) {
      setError(err?.detail || 'Gagal mencari grup. Pastikan Anda sudah login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen}>
        <button onClick={toggleSidebar} className="mb-4 p-2 bg-navy-900 text-white rounded-lg">☰ Menu</button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">🤖 AI Group Matching</h1>
          <p className="text-gray-600 mt-1">
            Masukkan kebutuhan pengadaan Anda. AI kami akan menemukan UMKM lain dengan kebutuhan serupa.
          </p>
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

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI sedang mencocokkan...
                    </span>
                  ) : '🤖 Cari Grup Sekarang'}
                </button>
              </form>
            </div>
          </div>

          {/* Hasil */}
          <div className="lg:col-span-3">
            {!results && !loading && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">AI Siap Mencocokkan</h3>
                <p className="text-gray-500 text-sm">
                  Isi form di kiri, lalu klik "Cari Grup Sekarang" untuk melihat rekomendasi grup pengadaan terbaik.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-navy-900 font-semibold">AI sedang menganalisis kebutuhan Anda...</p>
                <p className="text-gray-500 text-sm mt-2">Mencari UMKM dengan kebutuhan serupa di {form.delivery_city}</p>
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
                      <button className="flex-1 py-2 bg-gold-500 text-white font-semibold rounded-xl hover:bg-gold-600 transition-colors text-sm">
                        Gabung Grup
                      </button>
                      <button className="py-2 px-4 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 text-sm">
                        Detail
                      </button>
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
