import React from 'react'
import { DashboardLayout } from '../components/layouts'
import { useUIStore } from '../stores'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { Search, Star, MapPin, Package, Menu, CheckCircle } from 'lucide-react'
import { vendorAPI } from '../api/endpoints'
import { Spinner } from '../components/common'

const Vendors = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [vendors, setVendors] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    vendorAPI.list()
      .then((res) => { if (res.success) setVendors(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = vendors.filter((v) =>
    v.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.business_category?.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarOpen={sidebarOpen} onToggle={toggleSidebar}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={toggleSidebar} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Menu size={18} className="text-navy-900" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-navy-900">Vendor</h1>
            <p className="text-gray-400 text-sm">Supplier terpercaya untuk kebutuhan pengadaan Anda</p>
          </div>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari vendor, kategori, atau kota..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-gold-500 text-sm"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-gold-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center">
                    <Package size={18} className="text-navy-900" />
                  </div>
                  {v.verification_status === 'verified' && (
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle size={12} />
                      Terverifikasi
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-navy-900 text-sm mb-1">{v.vendor_name}</h3>
                <p className="text-xs text-gold-500 font-medium mb-2">{v.business_category}</p>

                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                  <MapPin size={11} />
                  {v.city}{v.province ? `, ${v.province}` : ''}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-navy-900">{v.reliability_score?.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">/5</span>
                  </div>
                  <span className="text-xs text-gray-400">{v.total_orders} pesanan</span>
                </div>

                {v.min_order_quantity && (
                  <p className="text-xs text-gray-400 mt-2">Min. order: {v.min_order_quantity} unit</p>
                )}
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="col-span-3 text-center py-16 text-gray-400">
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">{search ? `Tidak ditemukan untuk "${search}"` : 'Belum ada vendor.'}</p>
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Vendors
