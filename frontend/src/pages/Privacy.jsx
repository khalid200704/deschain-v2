import React from 'react'
import { useNavigate } from 'react-router-dom'

const Privacy = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ice-50">
      {/* Navbar minimal */}
      <nav className="bg-navy-900 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-xl font-bold text-gold-500">Deschain</button>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-300 hover:text-white">← Kembali</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Kebijakan Privasi</h1>
          <p className="text-gray-500 text-sm mb-8">Terakhir diperbarui: 28 Mei 2026 · Berlaku sesuai UU PDP No. 27/2022</p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-8">

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">1. Pengenalan</h2>
              <p className="leading-relaxed">
                Deschain ("Kami", "Platform", atau "Layanan") berkomitmen melindungi privasi dan keamanan data
                pribadi pengguna sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022.
                Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data Anda.
              </p>
              <p className="leading-relaxed mt-3">
                Platform Deschain dikelola oleh Tim Deschain, Universitas Tanjungpura, Pontianak. Pertanyaan terkait
                privasi dapat disampaikan kepada Data Protection Officer kami di:
                <strong> h1051221107@student.untan.ac.id</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">2. Data yang Kami Kumpulkan</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-200 rounded-lg">
                  <thead className="bg-ice-50">
                    <tr>
                      <th className="text-left p-3 border border-gray-200 font-semibold text-navy-900">Kategori Data</th>
                      <th className="text-left p-3 border border-gray-200 font-semibold text-navy-900">Jenis Data</th>
                      <th className="text-left p-3 border border-gray-200 font-semibold text-navy-900">Tujuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ['Identitas', 'Nama, email, nomor HP, NIB, e-KTP', 'Verifikasi akun & kepatuhan regulasi'],
                      ['Bisnis', 'Nama usaha, sektor, lokasi, bank account', 'Profil UMKM & proses pengadaan'],
                      ['Transaksi', 'Riwayat order, jumlah, vendor, tanggal', 'Credit trail & analytics penghematan'],
                      ['Teknis', 'IP address, browser, device type', 'Keamanan & debug sistem'],
                      ['Lokasi', 'Kota/provinsi pengiriman', 'Pencocokan grup pengadaan terdekat'],
                    ].map(([cat, types, purpose]) => (
                      <tr key={cat} className="hover:bg-gray-50">
                        <td className="p-3 border border-gray-200 font-medium">{cat}</td>
                        <td className="p-3 border border-gray-200">{types}</td>
                        <td className="p-3 border border-gray-200 text-gray-600">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">3. Dasar Hukum Pemrosesan</h2>
              <p className="leading-relaxed mb-3">Kami memproses data berdasarkan (Pasal 20 UU PDP):</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Persetujuan eksplisit</strong>: Anda memberikan izin saat mendaftar</li>
                <li><strong>Pelaksanaan perjanjian</strong>: Diperlukan untuk menyediakan layanan pengadaan</li>
                <li><strong>Kewajiban hukum</strong>: Pelaporan kepada otoritas yang berwenang (BI, OJK)</li>
                <li><strong>Kepentingan sah</strong>: Pencegahan fraud dan peningkatan layanan</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">4. Keamanan Data</h2>
              <p className="leading-relaxed mb-3">Kami menerapkan standar keamanan tinggi:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: '🔐', title: 'Enkripsi AES-256', desc: 'Data sensitif (NIB, nomor rekening, e-KTP) dienkripsi sebelum disimpan' },
                  { icon: '🔒', title: 'Komunikasi TLS 1.3', desc: 'Seluruh data dalam perjalanan dilindungi dengan protokol TLS 1.3' },
                  { icon: '🪪', title: 'JWT + MFA', desc: 'Autentikasi berlapis dengan JSON Web Token dan Multi-Factor Authentication' },
                  { icon: '📋', title: 'Audit Log', desc: 'Setiap akses ke data sensitif dicatat dan dapat diperiksa' },
                ].map((s) => (
                  <div key={s.title} className="flex gap-3 p-4 bg-ice-50 rounded-xl border border-ice-200">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className="font-semibold text-navy-900 text-sm">{s.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">5. Hak Anda sebagai Subjek Data</h2>
              <p className="leading-relaxed mb-3">Sesuai Pasal 5-15 UU PDP No. 27/2022, Anda memiliki hak:</p>
              <ul className="space-y-2 text-sm">
                {[
                  ['Hak Akses', 'Meminta salinan data pribadi yang kami simpan'],
                  ['Hak Koreksi', 'Memperbarui data yang tidak akurat atau usang'],
                  ['Hak Hapus', 'Meminta penghapusan data jika tidak lagi diperlukan'],
                  ['Hak Portabilitas', 'Menerima data dalam format terstruktur (JSON/CSV)'],
                  ['Hak Keberatan', 'Menolak pemrosesan tertentu untuk tujuan pemasaran'],
                  ['Hak Penarikan Izin', 'Menarik persetujuan kapan saja tanpa konsekuensi'],
                ].map(([right, desc]) => (
                  <li key={right} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gold-500 font-bold">✓</span>
                    <div><strong>{right}</strong>: {desc}</div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Untuk menggunakan hak Anda, kirim permintaan ke: <strong>h1051221107@student.untan.ac.id</strong>.
                Kami akan merespons dalam 14 hari kerja.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">6. Retensi Data</h2>
              <p className="leading-relaxed">
                Data akun aktif disimpan selama akun berstatus aktif. Data transaksi dan credit trail disimpan
                minimal 5 tahun sesuai ketentuan OJK. Data akun yang dihapus akan dianonimkan dalam 30 hari,
                kecuali diwajibkan hukum untuk disimpan lebih lama.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">7. Berbagi Data dengan Pihak Ketiga</h2>
              <p className="leading-relaxed mb-3">
                Kami <strong>tidak menjual</strong> data Anda. Data dapat dibagikan hanya kepada:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Vendor pengadaan yang dipilih pengguna (nama, kuantitas order, lokasi pengiriman)</li>
                <li>Lembaga keuangan mitra untuk verifikasi credit trail (atas permintaan pengguna)</li>
                <li>Otoritas regulasi (BI, OJK) jika diwajibkan hukum</li>
                <li>Penyedia infrastruktur teknis (Google Cloud Platform) yang terikat perjanjian kerahasiaan</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">8. Cookie dan Teknologi Pelacakan</h2>
              <p className="leading-relaxed">
                Kami menggunakan cookie esensial untuk autentikasi (JWT) dan preferensi tampilan. Kami tidak
                menggunakan cookie pihak ketiga untuk pelacakan iklan. Anda dapat mengatur preferensi cookie
                melalui pengaturan browser.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">9. Perubahan Kebijakan</h2>
              <p className="leading-relaxed">
                Kami dapat memperbarui kebijakan ini. Perubahan material akan diberitahukan melalui email dan
                notifikasi dalam aplikasi minimal 30 hari sebelum berlaku.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 mb-3">10. Kontak Data Protection Officer</h2>
              <div className="bg-navy-900 text-white rounded-xl p-6">
                <div className="font-bold text-gold-400 mb-2">Data Protection Officer (DPO)</div>
                <p className="text-sm text-gray-300">Abdullah Khalid Fadillah</p>
                <p className="text-sm text-gray-300">Email: h1051221107@student.untan.ac.id</p>
                <p className="text-sm text-gray-300">Universitas Tanjungpura, Pontianak, Kalimantan Barat</p>
                <p className="text-sm text-gray-300 mt-2">Respons dalam 14 hari kerja</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
