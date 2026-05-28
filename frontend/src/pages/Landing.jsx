import React from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ── */}
      <nav className="bg-navy-900 text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-gold-500">Deschain</div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#fitur" className="hover:text-gold-400 transition-colors">Fitur</a>
            <a href="#dampak" className="hover:text-gold-400 transition-colors">Dampak</a>
            <a href="#harga" className="hover:text-gold-400 transition-colors">Harga</a>
            <button onClick={() => navigate('/about')} className="hover:text-gold-400 transition-colors">Tentang</button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/auth/login')}
              className="px-4 py-2 text-sm border border-white rounded-lg hover:bg-white hover:text-navy-900 transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/auth/register')}
              className="px-4 py-2 text-sm bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors font-semibold"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-500 to-navy-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-gold-500 bg-opacity-20 border border-gold-400 rounded-full px-4 py-1 text-gold-400 text-sm font-medium mb-6">
            🏆 Pemenang BI-OJK Hackathon 2025 · Universitas Tanjungpura
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Hemat <span className="text-gold-400">15–25%</span> Biaya Pengadaan
            <br className="hidden md:block" />
            <span className="text-gold-400"> Bersama Komunitas UMKM</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Platform pengadaan kolektif bertenaga AI untuk UMKM & koperasi Indonesia.
            Gabungkan order, dapatkan harga grosir, dan bangun rekam jejak kredit otomatis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/auth/register')}
              className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold text-lg rounded-xl transition-colors shadow-lg"
            >
              Daftar Gratis Sekarang
            </button>
            <button
              onClick={() => navigate('/auth/login')}
              className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-navy-900 transition-colors"
            >
              Lihat Cara Kerja →
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: '65,5 Juta', label: 'UMKM di Indonesia' },
              { value: '15–25%', label: 'Rata-rata penghematan' },
              { value: '60%', label: 'Pemangkasan waktu pengadaan' },
              { value: '50.000', label: 'Target UMKM aktif 3 tahun' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white bg-opacity-10 rounded-xl p-4">
                <div className="text-2xl font-bold text-gold-400">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MASALAH ── */}
      <section className="py-20 px-6 bg-ice-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Masalah</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mt-2">
              UMKM Indonesia Menghadapi Tantangan Besar
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              Data resmi menunjukkan betapa kritisnya kondisi pengadaan UMKM saat ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏦',
                stat: '44 Juta',
                title: 'UMKM Unbankable',
                desc: 'Tidak dapat akses kredit formal karena tidak ada rekam jejak transaksi yang terverifikasi.',
                source: 'PIP Kemenkeu RI, 2024',
              },
              {
                icon: '⛓️',
                stat: '>75%',
                title: 'Kesulitan Rantai Pasok',
                desc: 'Lebih dari 75% UMKM mengalami kesulitan dalam manajemen supply chain dan pengadaan bahan baku.',
                source: 'Kadin Indonesia, 2024',
              },
              {
                icon: '💸',
                stat: '1,82% vs 13,52%',
                title: 'Kredit UMKM Jauh Tertinggal',
                desc: 'Pertumbuhan kredit UMKM hanya 1,82% YoY dibandingkan kredit korporasi yang tumbuh 13,52%.',
                source: 'Bank Indonesia, 2025',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-3xl font-bold text-navy-900 mb-2">{item.stat}</div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                <p className="text-gray-400 text-xs mt-3 italic">Sumber: {item.source}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUSI / FITUR ── */}
      <section id="fitur" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Solusi</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mt-2">
              Tiga Fitur Unggulan Deschain
            </h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              Berbeda dari Indotrading dan Ralali — Deschain aktif mencocokkan UMKM,
              bukan sekadar marketplace pasif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'AI Group Matching',
                badge: 'Fitur Utama',
                badgeColor: 'bg-gold-500',
                desc: 'Algoritma dynamic programming mencocokkan UMKM dengan kebutuhan serupa — komoditas, lokasi, kuantitas, dan timeline — lalu membentuk grup pengadaan optimal secara otomatis.',
                points: ['Penghematan rata-rata 15–25%', 'Cocok multi-sektor', 'Network effect semakin akurat'],
              },
              {
                icon: '🏪',
                title: 'Smart Vendor Recommendation',
                badge: 'AI Powered',
                badgeColor: 'bg-navy-500',
                desc: 'Rekomendasi vendor berdasarkan collaborative filtering: performa pengiriman, rating, harga kompetitif, lokasi terdekat, dan ketersediaan stok real-time.',
                points: ['Vendor terverifikasi NIB', 'Rating transparan', 'Integrasi JNE & SiCepat'],
              },
              {
                icon: '📊',
                title: 'Credit Trail Otomatis',
                badge: 'Inovasi OJK',
                badgeColor: 'bg-green-600',
                desc: 'Setiap transaksi pengadaan otomatis direkam sebagai bukti riwayat bisnis. Credit trail dapat diekspor untuk pengajuan kredit ke bank dan fintech mitra.',
                points: ['Ekspor PDF/JSON untuk bank', 'Selaras POJK 2025', 'Skor kredit real-time'],
              },
            ].map((f) => (
              <div key={f.title} className="bg-ice-50 rounded-2xl p-8 border border-ice-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{f.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-navy-900">{f.title}</h3>
                  <span className={`${f.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>{f.badge}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.desc}</p>
                <ul className="space-y-1">
                  {f.points.map((p) => (
                    <li key={p} className="text-sm text-navy-900 flex items-center gap-2">
                      <span className="text-gold-500">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section className="py-20 px-6 bg-navy-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold-400 font-semibold text-sm uppercase tracking-widest">Cara Kerja</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Dari Kebutuhan ke Penghematan dalam 5 Langkah</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-start">
            {[
              { step: '1', icon: '📝', title: 'Daftar & Verifikasi', desc: 'Daftar dengan NIB, verifikasi otomatis via OSS' },
              { step: '2', icon: '🛒', title: 'Input Kebutuhan', desc: 'Masukkan komoditas, kuantitas, lokasi, dan deadline' },
              { step: '3', icon: '🤖', title: 'AI Mencocokkan', desc: 'Algoritma cari UMKM lain dengan kebutuhan serupa' },
              { step: '4', icon: '🏪', title: 'Pilih Vendor', desc: 'AI rekomendasikan vendor terbaik untuk grup' },
              { step: '5', icon: '📊', title: 'Credit Trail', desc: 'Transaksi otomatis jadi rekam jejak kredit' },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center text-2xl mb-3 font-bold">
                  {s.icon}
                </div>
                {i < 4 && (
                  <div className="hidden sm:block absolute translate-x-20 -translate-y-8 text-gold-400 text-xl">→</div>
                )}
                <div className="text-xs font-bold text-gold-400 mb-1">LANGKAH {s.step}</div>
                <div className="font-semibold text-sm mb-1">{s.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAMPAK ── */}
      <section id="dampak" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Dampak</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mt-2">Hasil Nyata untuk UMKM</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '15–25%', label: 'Penghematan biaya pengadaan', color: 'text-gold-500' },
              { value: 'Hingga 60%', label: 'Pemangkasan waktu pengadaan', color: 'text-navy-900' },
              { value: '+30%', label: 'Peningkatan akses vendor terverifikasi', color: 'text-green-600' },
              { value: '50.000', label: 'Target UMKM aktif dalam 3 tahun', color: 'text-navy-500' },
            ].map((d) => (
              <div key={d.label} className="bg-ice-50 rounded-2xl p-6 text-center border border-ice-200">
                <div className={`text-4xl font-bold ${d.color} mb-2`}>{d.value}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{d.label}</div>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="bg-ice-50 rounded-2xl p-8 border border-ice-200">
            <h3 className="text-xl font-bold text-navy-900 mb-6 text-center">Deschain vs Platform Lain</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 text-gray-600 font-medium">Fitur</th>
                    <th className="py-3 px-4 text-center text-gold-500 font-bold">Deschain</th>
                    <th className="py-3 px-4 text-center text-gray-400">Indotrading</th>
                    <th className="py-3 px-4 text-center text-gray-400">Ralali</th>
                    <th className="py-3 px-4 text-center text-gray-400">Poolapack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['AI Group Matching aktif', '✅', '❌', '❌', '❌'],
                    ['Credit trail otomatis', '✅', '❌', '❌', '❌'],
                    ['Multi-sektor', '✅', '✅', '✅', '❌'],
                    ['Rekomendasi vendor AI', '✅', '❌', '❌', '❌'],
                    ['Khusus UMKM pembeli', '✅', '❌', '❌', '⚠️'],
                  ].map(([f, ...vals]) => (
                    <tr key={f}>
                      <td className="py-3 pr-4 text-gray-700">{f}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="py-3 px-4 text-center">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section className="py-20 px-6 bg-ice-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Testimoni</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mt-2">Kata UMKM Pilot Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: 'Sejak gabung Deschain, saya hemat Rp 800 ribu per bulan beli bahan baku bareng 3 UMKM kuliner lain di Pontianak. Vendor sekarang lebih percaya karena ada rekam jejak transaksi saya.',
                name: 'Ibu Siti Rahayu',
                role: 'Warung Makan Padang',
                location: 'Pontianak Kota',
                savings: 'Hemat Rp 800K/bulan',
              },
              {
                quote: 'Dulu beli beras 200 kg sendirian harganya mahal. Sekarang gabung grup 5 UMKM, total 1 ton, dapat harga lebih murah 20%. AI-nya cepat banget ngenalin kebutuhan yang sama.',
                name: 'Bapak Ahmad Fauzi',
                role: 'Toko Sembako Bersama',
                location: 'Sungai Raya, Kubu Raya',
                savings: 'Hemat 20% per transaksi',
              },
              {
                quote: 'Credit trail dari Deschain membantu saya ajukan KUR ke bank. Teller banknya bilang ini rekam jejak usaha yang bagus, padahal sebelumnya saya tidak pernah dapat kredit.',
                name: 'Ibu Maemunah',
                role: 'Pedagang Sayur & Buah',
                location: 'Pasar Flamboyan, Pontianak',
                savings: 'Berhasil akses KUR',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="text-gold-400 text-4xl mb-4">"</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">{t.quote}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-navy-900 text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role} · {t.location}</div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                    {t.savings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HARGA ── */}
      <section id="harga" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Harga</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mt-2">Pilih Paket yang Tepat</h2>
            <p className="text-gray-600 mt-3">Mulai gratis 14 hari. Tidak perlu kartu kredit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Rp 99.000',
                period: '/bulan',
                target: 'UMKM Mikro',
                color: 'border-gray-200',
                badge: null,
                features: [
                  'Group matching dasar',
                  '5 grup pengadaan/bulan',
                  'Dashboard sederhana',
                  'Credit trail dasar',
                  'Dukungan email',
                ],
                cta: 'Mulai Gratis 14 Hari',
                ctaStyle: 'border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white',
              },
              {
                name: 'Pro',
                price: 'Rp 299.000',
                period: '/bulan',
                target: 'UMKM Kecil–Menengah',
                color: 'border-gold-500 ring-2 ring-gold-500',
                badge: 'Paling Populer',
                features: [
                  'Grup pengadaan tidak terbatas',
                  'AI assistant pengadaan',
                  'Smart vendor recommendation',
                  'Credit trail + ekspor PDF',
                  'Analytics & laporan',
                  'Notifikasi WhatsApp',
                  'Prioritas dukungan',
                ],
                cta: 'Pilih Pro',
                ctaStyle: 'bg-gold-500 text-white hover:bg-gold-600',
              },
              {
                name: 'Enterprise',
                price: 'Rp 999.000',
                period: '/bulan',
                target: 'Koperasi & Asosiasi UMKM',
                color: 'border-gray-200',
                badge: null,
                features: [
                  'Multi-tenant (koperasi)',
                  'Akses API penuh',
                  'Laporan kustom',
                  'Dedicated account manager',
                  'Integrasi lembaga keuangan',
                  'SLA uptime 99,9%',
                  'Onboarding tatap muka',
                ],
                cta: 'Hubungi Kami',
                ctaStyle: 'border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white',
              },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border-2 ${plan.color} relative flex flex-col`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-1">{plan.target}</div>
                <div className="text-2xl font-bold text-navy-900 mb-1">{plan.name}</div>
                <div className="text-4xl font-bold text-navy-900 mb-6">
                  {plan.price}<span className="text-base font-normal text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-gold-500 font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/auth/register')}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            + Biaya transaksi 2,5% per transaksi pengadaan yang berhasil.
            <a href="#" className="text-gold-500 hover:underline ml-1">Pelajari detail harga →</a>
          </p>
        </div>
      </section>

      {/* ── TENTANG ── */}
      <section id="tentang" className="py-20 px-6 bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold-400 font-semibold text-sm uppercase tracking-widest">Tentang Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                Dibangun di Pontianak,<br />untuk 65 Juta UMKM Indonesia
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Deschain lahir dari Universitas Tanjungpura, Pontianak — dengan satu misi:
                mengubah setiap transaksi pengadaan UMKM menjadi aset finansial yang membuka
                akses ke ekosistem keuangan formal.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['BI Blueprint 2030', 'POJK Innovative Credit Scoring', 'UU PDP No. 27/2022', 'Asta Cita Presiden'].map((r) => (
                  <span key={r} className="bg-white bg-opacity-10 text-xs px-3 py-1 rounded-full text-gray-300 border border-white border-opacity-20">
                    {r}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 p-4 bg-gold-500 bg-opacity-20 rounded-xl border border-gold-400 border-opacity-50">
                <div className="text-3xl">🏆</div>
                <div>
                  <div className="font-bold text-gold-400">Pemenang BI-OJK Hackathon 2025</div>
                  <div className="text-sm text-gray-300">Innovation Frontier 1 · Kategori Mahasiswa</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Abdullah Khalid Fadillah', role: 'Product Architect & AI System', email: 'h1051221107@student.untan.ac.id' },
                { name: 'Duta Satria Nugroho', role: 'Web Developer & Frontend', email: '-' },
              ].map((m) => (
                <div key={m.name} className="bg-white bg-opacity-10 rounded-xl p-6 border border-white border-opacity-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-xl font-bold text-white">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-gold-400 text-sm">{m.role}</div>
                      <div className="text-gray-400 text-xs mt-1">Rekayasa Sistem Komputer · Untan</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white bg-opacity-10 rounded-xl p-4 border border-white border-opacity-10">
                <div className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">Roadmap</div>
                {[
                  { phase: 'Fase 1 (Apr–Jun 2026)', status: 'Sekarang', color: 'bg-gold-500', desc: 'POC · 20 UMKM pilot Pontianak' },
                  { phase: 'Fase 2 (Jul–Sep 2026)', status: 'Segera', color: 'bg-navy-500', desc: 'MVP · 100 UMKM aktif' },
                  { phase: 'Fase 3 (Okt 2026–Mar 2027)', status: 'Rencana', color: 'bg-gray-600', desc: 'Ekspansi Kalsel · Jateng · Sulsel' },
                ].map((p) => (
                  <div key={p.phase} className="flex items-center gap-3 py-2 border-b border-white border-opacity-10 last:border-0">
                    <div className={`w-2 h-2 rounded-full ${p.color} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="text-xs text-white font-medium">{p.phase}</div>
                      <div className="text-xs text-gray-400">{p.desc}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.color} text-white font-medium`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA AKHIR ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Hemat Biaya Pengadaan?
          </h2>
          <p className="text-lg mb-8 text-yellow-100">
            Bergabung dengan UMKM Pontianak yang sudah merasakan manfaat pengadaan kolektif.
            Daftar gratis, tidak perlu kartu kredit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/auth/register')}
              className="px-8 py-4 bg-white text-gold-600 font-bold text-lg rounded-xl hover:bg-yellow-50 transition-colors shadow-lg"
            >
              Daftar Gratis Sekarang
            </button>
            <a
              href="https://wa.me/6281234567890"
              className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-gold-600 transition-colors"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-navy-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="text-2xl font-bold text-gold-500 mb-3">Deschain</div>
              <p className="text-sm leading-relaxed">
                Mengubah setiap transaksi pengadaan UMKM menjadi aset finansial.
              </p>
              <p className="text-xs mt-3">Universitas Tanjungpura, Pontianak</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Produk</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#fitur" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#harga" className="hover:text-white transition-colors">Harga</a></li>
                <li><button onClick={() => navigate('/auth/register')} className="hover:text-white transition-colors">Daftar</button></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Perusahaan</div>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Tentang Kami</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">Tim & Roadmap</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-white transition-colors">Harga</button></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-3 text-sm">Legal</div>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Syarat Layanan</a></li>
                <li><span className="text-xs">Compliance UU PDP No. 27/2022</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white border-opacity-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span>© 2026 Deschain · Universitas Tanjungpura · Pontianak</span>
            <span>Selaras dengan BI Blueprint 2030 · OJK POJK 2025 · UU PDP No. 27/2022</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
