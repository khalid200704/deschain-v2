import React from 'react'
import { DashboardLayout } from '../components/layouts'
import { useUIStore } from '../stores'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { Search, Star, MapPin, Package, Menu, CheckCircle, X, Clock, User } from 'lucide-react'
import { vendorAPI } from '../api/endpoints'
import { Spinner } from '../components/common'

const Vendors = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [vendors, setVendors] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [selectedVendor, setSelectedVendor] = React.useState(null)
  const [loadingDetail, setLoadingDetail] = React.useState(false)

  React.useEffect(() => {
    vendorAPI.list()
      .then((res) => { if (res.success) setVendors(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleVendorClick = async (vendorId) => {
    setLoadingDetail(true)
    try {
      const res = await vendorAPI.getDetails(vendorId)
      if (res.success) setSelectedVendor(res.data)
    } catch {}
    finally { setLoadingDetail(false) }
  }

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
              <div
                key={v.id}
                onClick={() => handleVendorClick(v.id)}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-gold-300 hover:shadow-md transition-all cursor-pointer"
              >
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

        {selectedVendor && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVendor(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-navy-900">{selectedVendor.vendor_name}</h2>
                  <p className="text-sm text-gold-500 font-medium">{selectedVendor.business_category}</p>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {selectedVendor.description && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{selectedVendor.description}</p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  {selectedVendor.city}{selectedVendor.province ? `, ${selectedVendor.province}` : ''}
                </div>
                {selectedVendor.primary_contact_person && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={14} className="text-gray-400 flex-shrink-0" />
                    {selectedVendor.primary_contact_person}
                  </div>
                )}
                {selectedVendor.min_order_quantity && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package size={14} className="text-gray-400 flex-shrink-0" />
                    Min. order: {selectedVendor.min_order_quantity} unit
                  </div>
                )}
                {selectedVendor.average_lead_time_days && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} className="text-gray-400 flex-shrink-0" />
                    Lead time: {selectedVendor.average_lead_time_days} hari
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-navy-900">{selectedVendor.reliability_score?.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">/5 · {selectedVendor.total_orders} pesanan</span>
                </div>
                {selectedVendor.verification_status === 'verified' && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle size={12} /> Terverifikasi
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default Vendors
