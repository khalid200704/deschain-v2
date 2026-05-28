import React from 'react'
import { useNavigate } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: 'Rp 99.000',
    period: '/bulan',
    target: 'UMKM Mikro',
    highlight: false,
    trial: 'Coba Gratis 14 Hari',
    features: [
      { text: 'AI Group Matching dasar', included: true },
      { text: '5 grup pengadaan / bulan', included: true },
      { text: 'Dashboard penghematan', included: true },
      { text: 'Credit trail dasar', included: true },
      { text: 'Dukungan email', included: true },
      { text: 'AI Procurement Assistant', included: false },
      { text: 'Vendor recommendation', included: false },
      { text: 'Ekspor Credit Trail (PDF)', included: false },
      { text: 'Analytics lanjutan', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 'Rp 299.000',
    period: '/bulan',
    target: 'UMKM Kecil–Menengah',
    highlight: true,
    trial: 'Mulai 14 Hari Gratis',
    features: [
      { text: 'Semua fitur Starter', included: true },
      { text: 'Grup pengadaan tidak terbatas', included: true },
      { text: 'AI Procurement Assistant', included: true },
      { text: 'Smart Vendor Recommendation', included: true },
      { text: 'Credit trail + ekspor PDF/JSON', included: true },
      { text: 'Analytics & laporan bulanan', included: true },
      { text: 'Notifikasi WhatsApp', included: true },
      { text: 'Prioritas dukungan (< 4 jam)', included: true },
      { text: 'Multi-tenant koperasi', included: false },
    ],
  },
  {
    name: 'Enterprise',
    price: 'Rp 999.000',
    period: '/bulan',
    target: 'Koperasi & Asosiasi UMKM',
    highlight: false,
    trial: 'Hubungi Tim Sales',
    features: [
      { text: 'Semua fitur Pro', included: true },
      { text: 'Multi-tenant (koperasi, holding)', included: true },
      { text: 'Akses API penuh', included: true },
      { text: 'Laporan kustom & white-label', included: true },
      { text: 'Integrasi lembaga keuangan', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA uptime 99,9%', included: true },
      { text: 'Onboarding tatap muka', included: true },
      { text: 'Compliance OJK custom', included: true },
    ],
  },
]

const Pricing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ice-50">
      {/* Navbar */}
      <nav className="bg-navy-900 text-white px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-xl font-bold text-gold-500">Deschain</button>
          <div className="flex gap-3">
            <button onClick={() => navigate('/auth/login')} className="text-sm text-gray-300 hover:text-white">Masuk</button>
            <button onClick={() => navigate('/auth/register')} className="px-4 py-2 text-sm bg-gold-500 text-white rounded-lg font-semibold">Daftar Gratis</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Harga</span>
          <h1 className="text-4xl font-bold text-navy-900 mt-2 mb-3">Pilih Paket yang Tepat untuk Usaha Anda</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Mulai gratis 14 hari. Tidak perlu kartu kredit. Upgrade atau batalkan kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col relative border-2 ${
                plan.highlight
                  ? 'border-gold-500 bg-white shadow-xl ring-4 ring-gold-100'
                  : 'border-gray-200 bg-white shadow-md'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-xs font-bold px-5 py-1.5 rounded-full">
                  ✨ Paling Populer
                </div>
              )}

              <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-1">{plan.target}</div>
              <div className="text-2xl font-bold text-navy-900 mb-1">{plan.name}</div>
              <div className="text-4xl font-bold text-navy-900 mb-6">
                {plan.price}
                <span className="text-base font-normal text-gray-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className={`flex items-center gap-2 text-sm ${f.included ? 'text-gray-700' : 'text-gray-300'}`}>
                    <span className={f.included ? 'text-green-500 font-bold' : 'text-gray-300'}>
                      {f.included ? '✓' : '✕'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(plan.name === 'Enterprise' ? '/#tentang' : '/auth/register')}
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-gold-500 text-white hover:bg-gold-600'
                    : 'border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white'
                }`}
              >
                {plan.trial}
              </button>
            </div>
          ))}
        </div>

        {/* Revenue streams */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-gold-400 mb-4 text-center">Biaya Transaksi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-xl p-5">
              <div className="text-3xl font-bold text-gold-400 mb-2">2,5%</div>
              <div className="text-sm font-semibold mb-1">Transaction Fee</div>
              <div className="text-xs text-gray-400">Dikenakan per transaksi pengadaan yang berhasil diselesaikan melalui platform</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-xl p-5">
              <div className="text-3xl font-bold text-gold-400 mb-2">Gratis</div>
              <div className="text-sm font-semibold mb-1">Browsing & Matching</div>
              <div className="text-xs text-gray-400">Mencari grup, melihat vendor, dan AI recommendation tidak dikenakan biaya tambahan</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy-900 text-center mb-8">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Apakah gratis 14 hari benar-benar gratis?',
                a: 'Ya, 100% gratis. Tidak ada biaya tersembunyi. Kami tidak meminta kartu kredit saat pendaftaran.',
              },
              {
                q: 'Bisa upgrade atau downgrade paket?',
                a: 'Bisa kapan saja. Upgrade langsung aktif, downgrade berlaku di siklus tagihan berikutnya.',
              },
              {
                q: 'Bagaimana cara pembayaran?',
                a: 'Via QRIS, transfer bank, atau Virtual Account melalui Midtrans. Semua metode pembayaran Indonesia didukung.',
              },
              {
                q: 'Apakah data transaksi aman?',
                a: 'Ya. Kami menggunakan enkripsi AES-256, TLS 1.3, dan compliance penuh UU PDP No. 27/2022. Lihat Kebijakan Privasi kami.',
              },
              {
                q: 'Apakah koperasi bisa menggunakan Deschain?',
                a: 'Ya! Paket Enterprise dirancang khusus untuk koperasi dengan fitur multi-tenant dan API access penuh.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="font-semibold text-navy-900 mb-2">{faq.q}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/auth/register')}
            className="px-10 py-4 bg-gold-500 text-white font-bold text-lg rounded-xl hover:bg-gold-600 transition-colors shadow-lg"
          >
            Mulai Gratis Sekarang
          </button>
          <p className="text-gray-500 text-sm mt-3">Sudah punya akun? <button onClick={() => navigate('/auth/login')} className="text-gold-500 font-semibold hover:underline">Masuk</button></p>
        </div>
      </div>
    </div>
  )
}

export default Pricing
