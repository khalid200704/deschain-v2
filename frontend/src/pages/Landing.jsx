import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, BarChart3, ShieldCheck, ArrowRight, Check, X,
  Building2, Link2, TrendingDown, UserCheck, ShoppingCart,
  Bot, Store, FileText, ChevronRight, Award
} from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="bg-navy-900 text-white px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold text-gold-500 cursor-pointer" onClick={() => navigate('/')}>
            Deschain
          </span>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#dampak" className="hover:text-white transition-colors">Dampak</a>
            <a href="#harga" className="hover:text-white transition-colors">Harga</a>
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Tentang</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/auth/login')} className="px-4 py-2 text-sm border border-white border-opacity-30 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              Masuk
            </button>
            <button onClick={() => navigate('/auth/register')} className="px-4 py-2 text-sm bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold">
              Daftar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-navy-900 text-white pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full px-4 py-1.5 text-gold-400 text-sm font-medium mb-8">
            <Award size={14} />
            Finalis PIDI-DIGDAYA X 2026 &middot; BI &middot; OJK &middot; AFTECH
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Hemat <span className="text-gold-400">15–25%</span> Biaya Pengadaan
            <br className="hidden md:block" />
            Bersama Komunitas UMKM
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Platform pengadaan kolektif bertenaga AI untuk UMKM &amp; koperasi Indonesia.
            Gabungkan order, dapatkan harga grosir, dan bangun rekam jejak kredit otomatis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <button
              onClick={() => navigate('/auth/register')}
              className="px-7 py-3.5 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-2"
            >
              Mulai Gratis 14 Hari
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/auth/login')}
              className="px-7 py-3.5 border border-white border-opacity-30 text-white font-medium rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Sudah punya akun? Masuk
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: '65,5 Juta', label: 'UMKM di Indonesia' },
              { value: '15–25%', label: 'Rata-rata penghematan' },
              { value: '60%', label: 'Efisiensi waktu pengadaan' },
              { value: '50.000', label: 'Target UMKM 3 tahun' },
            ].map((s) => (
              <div key={s.label} className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-4">
                <div className="text-xl font-bold text-gold-400">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MASALAH */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-xs uppercase tracking-widest">Masalah</span>
            <h2 className="text-3xl font-bold text-navy-900 mt-2">UMKM Indonesia Menghadapi Tantangan Besar</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                stat: '44 Juta',
                title: 'UMKM Unbankable',
                desc: 'Tidak dapat akses kredit formal karena tidak ada rekam jejak transaksi yang terverifikasi.',
                source: 'PIP Kemenkeu RI, 2024',
              },
              {
                icon: Link2,
                stat: '>75%',
                title: 'Kesulitan Rantai Pasok',
                desc: 'Lebih dari 75% UMKM mengalami kesulitan dalam manajemen supply chain dan pengadaan bahan baku.',
                source: 'Kadin Indonesia, 2024',
              },
              {
                icon: TrendingDown,
                stat: '1,82% vs 13,52%',
                title: 'Kredit UMKM Tertinggal',
                desc: 'Pertumbuhan kredit UMKM hanya 1,82% YoY dibanding kredit korporasi 13,52%.',
                source: 'Bank Indonesia, 2025',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-navy-900 mb-1">{item.stat}</div>
                  <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  <p className="text-gray-300 text-xs mt-3">Sumber: {item.source}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-xs uppercase tracking-widest">Solusi</span>
            <h2 className="text-3xl font-bold text-navy-900 mt-2">Tiga Fitur Unggulan Deschain</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm">
              Berbeda dari platform lain — Deschain aktif mencocokkan UMKM, bukan sekadar marketplace pasif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                badge: 'Fitur Utama',
                badgeCls: 'bg-gold-500 text-white',
                title: 'AI Group Matching',
                desc: 'Algoritma mencocokkan UMKM dengan kebutuhan serupa — komoditas, lokasi, kuantitas, dan timeline — lalu membentuk grup pengadaan optimal secara otomatis.',
                points: ['Penghematan rata-rata 15–25%', 'Cocok multi-sektor', 'Network effect semakin akurat'],
                iconBg: 'bg-amber-50 text-amber-600',
              },
              {
                icon: Store,
                badge: 'AI Powered',
                badgeCls: 'bg-navy-500 text-white',
                title: 'Smart Vendor Recommendation',
                desc: 'Rekomendasi vendor berdasarkan performa pengiriman, rating, harga kompetitif, lokasi terdekat, dan ketersediaan stok.',
                points: ['Vendor terverifikasi NIB', 'Rating transparan', 'Integrasi JNE & SiCepat'],
                iconBg: 'bg-blue-50 text-blue-600',
              },
              {
                icon: BarChart3,
                badge: 'Inovasi OJK',
                badgeCls: 'bg-green-600 text-white',
                title: 'Credit Trail Otomatis',
                desc: 'Setiap transaksi pengadaan otomatis direkam sebagai bukti riwayat bisnis untuk pengajuan kredit ke bank dan fintech mitra.',
                points: ['Ekspor PDF/JSON untuk bank', 'Selaras POJK 2025', 'Skor kredit real-time'],
                iconBg: 'bg-green-50 text-green-600',
              },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.iconBg}`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${f.badgeCls}`}>{f.badge}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
                  <ul className="space-y-1.5">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-navy-900">
                        <Check size={13} className="text-gold-500 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="py-20 px-6 bg-navy-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold-400 font-semibold text-xs uppercase tracking-widest">Cara Kerja</span>
            <h2 className="text-3xl font-bold mt-2">Dari Kebutuhan ke Penghematan dalam 5 Langkah</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {[
              { num: '1', icon: UserCheck, title: 'Daftar & Verifikasi', desc: 'Daftar dengan NIB, verifikasi otomatis via OSS' },
              { num: '2', icon: ShoppingCart, title: 'Input Kebutuhan', desc: 'Masukkan komoditas, kuantitas, lokasi, dan deadline' },
              { num: '3', icon: Bot, title: 'AI Mencocokkan', desc: 'Algoritma mencari UMKM lain dengan kebutuhan serupa' },
              { num: '4', icon: Store, title: 'Pilih Vendor', desc: 'AI merekomendasikan vendor terbaik untuk grup' },
              { num: '5', icon: BarChart3, title: 'Credit Trail', desc: 'Transaksi otomatis jadi rekam jejak kredit' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.num} className="flex flex-col items-center text-center relative">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500 bg-opacity-20 border border-gold-500 border-opacity-40 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-gold-400" />
                  </div>
                  <div className="text-xs font-bold text-gold-400 mb-1">LANGKAH {s.num}</div>
                  <div className="text-sm font-semibold text-white mb-1">{s.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{s.desc}</div>
                  {i < 4 && (
                    <ChevronRight size={16} className="hidden sm:block absolute -right-3 top-3 text-gold-500 opacity-40" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DAMPAK */}
      <section id="dampak" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-xs uppercase tracking-widest">Dampak</span>
            <h2 className="text-3xl font-bold text-navy-900 mt-2">Hasil Nyata untuk UMKM</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { value: '15–25%', label: 'Penghematan biaya pengadaan', color: 'text-gold-500' },
              { value: 'Hingga 60%', label: 'Pemangkasan waktu pengadaan', color: 'text-navy-900' },
              { value: '+30%', label: 'Peningkatan akses vendor terverifikasi', color: 'text-green-600' },
              { value: '50.000', label: 'Target UMKM aktif dalam 3 tahun', color: 'text-navy-500' },
            ].map((d) => (
              <div key={d.label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <div className={`text-3xl font-bold ${d.color} mb-1`}>{d.value}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{d.label}</div>
              </div>
            ))}
          </div>

          {/* Perbandingan */}
          <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
            <h3 className="text-base font-bold text-navy-900 mb-5">Deschain vs Platform Lain</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 text-gray-500 font-medium text-xs">Fitur</th>
                    <th className="py-3 px-4 text-center text-gold-500 font-bold text-xs">Deschain</th>
                    <th className="py-3 px-4 text-center text-gray-400 font-medium text-xs">Indotrading</th>
                    <th className="py-3 px-4 text-center text-gray-400 font-medium text-xs">Ralali</th>
                    <th className="py-3 px-4 text-center text-gray-400 font-medium text-xs">Poolapack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['AI Group Matching aktif', true, false, false, false],
                    ['Credit trail otomatis',   true, false, false, false],
                    ['Multi-sektor',            true, true,  true,  false],
                    ['Rekomendasi vendor AI',   true, false, false, false],
                    ['Khusus UMKM pembeli',     true, false, false, null],
                  ].map(([label, ...vals]) => (
                    <tr key={label}>
                      <td className="py-3 pr-4 text-gray-600 text-xs">{label}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="py-3 px-4 text-center">
                          {v === true  && <Check size={14} className="inline text-green-500" />}
                          {v === false && <X size={14} className="inline text-gray-300" />}
                          {v === null  && <span className="text-xs text-gray-300">Parsial</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-xs uppercase tracking-widest">Testimoni</span>
            <h2 className="text-3xl font-bold text-navy-900 mt-2">Kata UMKM Pilot Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Sejak gabung Deschain, saya hemat Rp 800 ribu per bulan beli bahan baku bareng 3 UMKM kuliner lain di Pontianak. Vendor sekarang lebih percaya karena ada rekam jejak transaksi saya.',
                name: 'Ibu Siti Rahayu',
                role: 'Warung Makan, Pontianak Kota',
                badge: 'Hemat Rp 800K/bulan',
              },
              {
                quote: 'Dulu beli beras 200 kg sendirian harganya mahal. Sekarang gabung grup 5 UMKM, total 1 ton, dapat harga lebih murah 20%. AI-nya cepat banget ngenalin kebutuhan yang sama.',
                name: 'Bapak Ahmad Fauzi',
                role: 'Toko Sembako, Kubu Raya',
                badge: 'Hemat 20%/transaksi',
              },
              {
                quote: 'Credit trail dari Deschain membantu saya ajukan KUR ke bank. Teller banknya bilang ini rekam jejak usaha yang bagus, padahal sebelumnya saya tidak pernah dapat kredit.',
                name: 'Ibu Maemunah',
                role: 'Pedagang Sayur, Pasar Flamboyan',
                badge: 'Berhasil akses KUR',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="text-3xl font-serif text-gold-400 leading-none mb-3">&ldquo;</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{t.quote}</p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-navy-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{t.role}</div>
                  </div>
                  <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-100 flex-shrink-0">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HARGA */}
      <section id="harga" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold-500 font-semibold text-xs uppercase tracking-widest">Harga</span>
            <h2 className="text-3xl font-bold text-navy-900 mt-2">Pilih Paket yang Tepat</h2>
            <p className="text-gray-500 mt-2 text-sm">Mulai gratis 14 hari. Tidak perlu kartu kredit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter', price: 'Rp 99.000', target: 'UMKM Mikro',
                highlight: false,
                features: ['Group matching dasar', '5 grup pengadaan/bulan', 'Dashboard sederhana', 'Credit trail dasar', 'Dukungan email'],
                cta: 'Mulai Gratis 14 Hari',
              },
              {
                name: 'Pro', price: 'Rp 299.000', target: 'UMKM Kecil–Menengah',
                highlight: true,
                features: ['Grup tidak terbatas', 'AI procurement assistant', 'Smart vendor recommendation', 'Credit trail + ekspor PDF', 'Analytics & laporan', 'Notifikasi WhatsApp', 'Prioritas dukungan'],
                cta: 'Pilih Pro',
              },
              {
                name: 'Enterprise', price: 'Rp 999.000', target: 'Koperasi & Asosiasi',
                highlight: false,
                features: ['Multi-tenant koperasi', 'Akses API penuh', 'Laporan kustom', 'Dedicated account manager', 'Integrasi lembaga keuangan', 'SLA uptime 99,9%'],
                cta: 'Hubungi Kami',
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border-2 flex flex-col relative ${
                  plan.highlight ? 'border-gold-500 shadow-xl' : 'border-gray-100'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Paling Populer
                  </div>
                )}
                <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-1">{plan.target}</div>
                <div className="text-xl font-bold text-navy-900 mb-1">{plan.name}</div>
                <div className="text-3xl font-bold text-navy-900 mb-1">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-400">/bulan</span>
                </div>
                <div className="border-t border-gray-100 my-5" />
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={13} className="text-gold-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/auth/register')}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-gold-500 text-white hover:bg-gold-600'
                      : 'border-2 border-gray-200 text-navy-900 hover:border-navy-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-xs mt-6">
            + Biaya transaksi 2,5% per transaksi pengadaan yang berhasil diselesaikan.
          </p>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="py-20 px-6 bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-gold-400 font-semibold text-xs uppercase tracking-widest">Tentang Kami</span>
            <h2 className="text-3xl font-bold mt-2 mb-5">
              Dibangun di Pontianak,<br />untuk 65 Juta UMKM Indonesia
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Deschain lahir dari Universitas Tanjungpura, Pontianak — dengan satu misi:
              mengubah setiap transaksi pengadaan UMKM menjadi aset finansial yang membuka
              akses ke ekosistem keuangan formal.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['BI Blueprint 2030', 'POJK Innovative Credit Scoring', 'UU PDP No. 27/2022', 'Asta Cita Presiden'].map((r) => (
                <span key={r} className="bg-white bg-opacity-10 text-xs px-3 py-1 rounded-full text-gray-300 border border-white border-opacity-10">
                  {r}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 p-4 bg-gold-500 bg-opacity-10 rounded-xl border border-gold-500 border-opacity-30">
              <div className="w-9 h-9 bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award size={18} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-gold-400 text-sm">Finalis PIDI-DIGDAYA X 2026</div>
                <div className="text-xs text-gray-400 mt-0.5">Bank Indonesia &middot; OJK &middot; AFTECH &middot; ASPI</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Abdullah Khalid Fadillah', role: 'Fullstack Developer & Product Lead', email: 'h1051221107@student.untan.ac.id' },
              { name: 'Duta Satria Nugroho', role: 'Backend Engineer & AI Specialist', email: '' },
            ].map((m) => (
              <div key={m.name} className="bg-white bg-opacity-5 rounded-xl p-5 border border-white border-opacity-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{m.name}</div>
                    <div className="text-gold-400 text-xs mt-0.5">{m.role}</div>
                    {m.email && <div className="text-gray-500 text-xs mt-0.5">{m.email}</div>}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white bg-opacity-5 rounded-xl p-5 border border-white border-opacity-10">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Roadmap</div>
              {[
                { phase: 'Fase 1 — Apr–Jun 2026', status: 'Sekarang', active: true,  desc: 'POC · 20 UMKM pilot Pontianak' },
                { phase: 'Fase 2 — Jul–Sep 2026', status: 'Segera',   active: false, desc: 'MVP · 100 UMKM aktif' },
                { phase: 'Fase 3 — Okt 2026+',    status: 'Rencana',  active: false, desc: 'Ekspansi Kalsel · Jateng · Sulsel' },
              ].map((p) => (
                <div key={p.phase} className="flex items-center gap-3 py-2.5 border-b border-white border-opacity-5 last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.active ? 'bg-gold-500' : 'bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium">{p.phase}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${p.active ? 'bg-gold-500 text-white' : 'bg-white bg-opacity-10 text-gray-400'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="py-20 px-6 bg-gold-500 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Siap Hemat Biaya Pengadaan?</h2>
          <p className="text-yellow-100 mb-8 text-sm">
            Bergabung dengan UMKM Pontianak yang sudah merasakan manfaat pengadaan kolektif. Gratis 14 hari.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/auth/register')}
              className="px-7 py-3 bg-white text-gold-600 font-bold rounded-xl hover:bg-yellow-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Daftar Gratis Sekarang
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/auth/login')}
              className="px-7 py-3 border-2 border-white border-opacity-50 text-white font-semibold rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Sudah punya akun
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="text-lg font-bold text-gold-500 mb-3">Deschain</div>
              <p className="text-xs text-gray-500 leading-relaxed">Mengubah setiap transaksi pengadaan UMKM menjadi aset finansial.</p>
              <p className="text-xs mt-3 text-gray-600">Universitas Tanjungpura, Pontianak</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Produk</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#fitur" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#harga" className="hover:text-white transition-colors">Harga</a></li>
                <li><button onClick={() => navigate('/auth/register')} className="hover:text-white transition-colors">Daftar</button></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Perusahaan</div>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Tentang Kami</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Tim &amp; Roadmap</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Harga Detail</button></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Legal</div>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Kebijakan Privasi</button></li>
                <li><span className="text-gray-600">UU PDP No. 27/2022</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white border-opacity-5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <span>&copy; 2026 Deschain &middot; Universitas Tanjungpura &middot; Pontianak</span>
            <span className="text-gray-600">BI Blueprint 2030 &middot; OJK POJK 2025 &middot; UU PDP No. 27/2022</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
