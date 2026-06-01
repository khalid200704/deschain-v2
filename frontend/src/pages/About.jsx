import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, GraduationCap, Handshake, TrendingUp } from 'lucide-react'

const TEAM = [
  {
    name: 'Abdullah Khalid Fadillah',
    role: 'Fullstack Developer & Product Lead',
    nim: 'H1051221107',
    email: 'h1051221107@student.untan.ac.id',
    avatar: '👨‍💻',
    skills: ['React', 'FastAPI', 'PostgreSQL', 'UI/UX'],
    bio: 'Mahasiswa Informatika Universitas Tanjungpura. Berpengalaman membangun platform digital untuk UMKM Kalimantan Barat.',
  },
  {
    name: 'Duta Satria Nugroho',
    role: 'Backend Engineer & AI Specialist',
    nim: '—',
    email: '—',
    avatar: '👨‍🔬',
    skills: ['Python', 'Machine Learning', 'DevOps', 'API Design'],
    bio: 'Spesialis backend dan AI matching algorithm. Fokus pada skalabilitas sistem untuk jutaan pengguna UMKM Indonesia.',
  },
]

const ROADMAP = [
  {
    phase: 'Fase 1',
    title: 'MVP Core',
    status: 'current',
    date: 'Mei–Jun 2026',
    items: [
      'AI Group Matching (aktif)',
      'Dashboard + Credit Trail',
      'Auth UMKM & Vendor',
      'Pricing 3-tier',
      'Compliance UU PDP',
    ],
  },
  {
    phase: 'Fase 2',
    title: 'Monetisasi',
    status: 'planned',
    date: 'Jul–Sep 2026',
    items: [
      'Integrasi Midtrans (QRIS/VA)',
      'Transaction fee 2,5%',
      'Notifikasi WhatsApp',
      'Vendor onboarding',
      'Analytics lanjutan',
    ],
  },
  {
    phase: 'Fase 3',
    title: 'Skalabilitas',
    status: 'planned',
    date: 'Okt–Des 2026',
    items: [
      'Integrasi BPS data UMKM',
      'Credit scoring → KUR/pinjaman',
      'Multi-kota Kalimantan',
      'Mobile app (React Native)',
      'API publik untuk koperasi',
    ],
  },
  {
    phase: 'Fase 4',
    title: 'Ekspansi',
    status: 'planned',
    date: '2027+',
    items: [
      'Seluruh Indonesia',
      'Integrasi OJK/BI data',
      'Pembiayaan supply chain',
      'Marketplace vendor',
      'Sertifikasi ISO 27001',
    ],
  },
]

const ACHIEVEMENTS = [
  { icon: Award,       iconCls: 'text-amber-600 bg-amber-50',  label: 'PIDI-DIGDAYA X 2026', desc: 'Finalis · Tahap 2 Submission' },
  { icon: GraduationCap, iconCls: 'text-blue-600 bg-blue-50', label: 'Universitas Tanjungpura', desc: 'Pontianak, Kalimantan Barat' },
  { icon: Handshake,   iconCls: 'text-green-600 bg-green-50',  label: 'PIDI-DIGDAYA X 2026', desc: 'Finalis · BI · OJK · AFTECH' },
  { icon: TrendingUp,  iconCls: 'text-purple-600 bg-purple-50', label: '65,5 Juta Target', desc: 'UMKM Indonesia berpotensi' },
]

const About = () => {
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

      {/* Hero */}
      <section className="bg-navy-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500 bg-opacity-20 border border-gold-400 rounded-full px-4 py-1.5 text-gold-400 text-sm font-medium mb-6">
            🏆 Finalis PIDI-DIGDAYA X 2026 · BI · OJK · AFTECH · Universitas Tanjungpura
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Deschain</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Platform pengadaan kolektif bertenaga AI yang memungkinkan UMKM Indonesia menghemat
            biaya 15–25% melalui kekuatan pembelian bersama.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Mission */}
        <div className="text-center mb-16">
          <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Misi Kami</span>
          <h2 className="text-3xl font-bold text-navy-900 mt-2 mb-4">
            Demokratisasi Akses ke Harga Grosir
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            44 juta UMKM Indonesia membayar harga eceran meskipun bisa mendapat harga grosir jika membeli bersama.
            Deschain menggunakan AI untuk mencocokkan UMKM dengan kebutuhan serupa, membentuk grup pengadaan otomatis,
            dan membangun credit trail digital yang membuka akses ke pembiayaan formal.
          </p>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {ACHIEVEMENTS.map((a) => {
            const Icon = a.icon
            return (
              <div key={a.label} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${a.iconCls}`}>
                  <Icon size={20} />
                </div>
                <div className="font-bold text-navy-900 text-sm mb-1">{a.label}</div>
                <div className="text-xs text-gray-500">{a.desc}</div>
              </div>
            )
          })}
        </div>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
            <h3 className="text-xl font-bold text-red-800 mb-4">Masalah yang Kami Selesaikan</h3>
            <ul className="space-y-3">
              {[
                '44 juta UMKM membayar harga eceran, bukan grosir',
                '>75% tidak memiliki catatan transaksi digital',
                'Hanya 1,82% mendapat akses kredit formal (vs 13,52% di negara maju)',
                'Proses negosiasi dengan vendor manual, lambat, tidak transparan',
                'Tanpa data historis, sulit dapat pinjaman di bank',
              ].map((p) => (
                <li key={p} className="flex gap-2 text-sm text-red-700">
                  <span className="flex-shrink-0 font-bold">✕</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-4">Solusi Deschain</h3>
            <ul className="space-y-3">
              {[
                'AI mencocokkan UMKM dengan kebutuhan serupa otomatis',
                'Grup pengadaan kolektif → diskon 15–25% dari vendor',
                'Setiap transaksi tercatat di credit trail digital',
                'Dashboard analitik penghematan real-time',
                'Credit trail membuka akses KUR dan pembiayaan formal',
              ].map((s) => (
                <li key={s} className="flex gap-2 text-sm text-green-700">
                  <span className="flex-shrink-0 font-bold text-green-500">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Tim Kami</span>
            <h2 className="text-3xl font-bold text-navy-900 mt-2">Dibangun oleh Mahasiswa, untuk UMKM</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg">{member.name}</h3>
                    <p className="text-gold-500 text-sm font-semibold">{member.role}</p>
                    {member.nim !== '—' && (
                      <p className="text-gray-400 text-xs mt-0.5">NIM: {member.nim}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {member.skills.map((s) => (
                    <span key={s} className="bg-navy-50 text-navy-900 text-xs px-2.5 py-1 rounded-full font-medium border border-navy-100">
                      {s}
                    </span>
                  ))}
                </div>
                {member.email !== '—' && (
                  <a href={`mailto:${member.email}`} className="text-xs text-gray-400 hover:text-gold-500">
                    ✉️ {member.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="text-gold-500 font-semibold text-sm uppercase tracking-widest">Roadmap</span>
            <h2 className="text-3xl font-bold text-navy-900 mt-2">Perjalanan Membangun Deschain</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {ROADMAP.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-2xl p-6 border-2 ${
                  phase.status === 'current'
                    ? 'border-gold-500 bg-white shadow-xl'
                    : 'border-gray-200 bg-white shadow-sm opacity-75'
                }`}
              >
                {phase.status === 'current' && (
                  <div className="bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                    🚀 Sekarang
                  </div>
                )}
                <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-1">{phase.phase}</div>
                <h3 className="font-bold text-navy-900 text-lg mb-1">{phase.title}</h3>
                <p className="text-xs text-gray-400 mb-4">{phase.date}</p>
                <ul className="space-y-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs text-gray-600">
                      <span className={phase.status === 'current' ? 'text-green-500 font-bold' : 'text-gray-300'}>
                        {phase.status === 'current' ? '✓' : '○'}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Hackathon context */}
        <div className="bg-navy-900 text-white rounded-2xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gold-400 mb-3">PIDI-DIGDAYA X Hackathon 2026</h2>
            <p className="text-gray-300 mb-6">
              Deschain dikembangkan sebagai kontribusi nyata untuk ekosistem UMKM Indonesia dalam rangka
              Hackathon PIDI-DIGDAYA X yang diselenggarakan oleh Bank Indonesia, OJK, AFTECH, ASPI, APUVINDO, dan LPPI.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {['Bank Indonesia', 'OJK', 'AFTECH', 'ASPI', 'APUVINDO', 'LPPI'].map((org) => (
                <div key={org} className="bg-white bg-opacity-10 rounded-xl py-3 px-4 font-semibold">
                  {org}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-3">Bergabunglah Bersama Kami</h2>
          <p className="text-gray-600 mb-8">Bersama kita bisa membangun ekosistem pengadaan yang lebih adil untuk UMKM Indonesia.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/auth/register')}
              className="px-8 py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-colors shadow-lg"
            >
              Daftar Gratis Sekarang
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 border-2 border-navy-900 text-navy-900 font-bold rounded-xl hover:bg-navy-900 hover:text-white transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2026 Deschain · Universitas Tanjungpura · PIDI-DIGDAYA X · Pontianak, Kalimantan Barat</p>
          <div className="flex gap-6 justify-center mt-3">
            <button onClick={() => navigate('/privacy')} className="hover:text-white">Kebijakan Privasi</button>
            <button onClick={() => navigate('/pricing')} className="hover:text-white">Harga</button>
            <button onClick={() => navigate('/about')} className="hover:text-white">Tentang Kami</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default About
