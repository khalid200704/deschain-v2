# AUDIT UI/UX DESCHAIN — LENGKAP
### Berbasis pemeriksaan visual langsung: landing, dashboard, AI matching, konsultasi AI (screenshot repo)

---

## NILAI KESELURUHAN: **A− (sangat baik — di atas ekspektasi tim mahasiswa)**

Produk ini **terlihat dan terasa seperti produk SaaS profesional**, bukan prototipe hackathon biasa. Brand konsisten, hierarki jelas, empty-state dipikirkan, ada micro-feedback dan bahkan disclaimer legal. Pengurangan nilai bukan karena estetika, tapi karena **pelabelan kejujuran data demo** dan beberapa detail lokalisasi/aksesibilitas yang belum terverifikasi.

### Kartu nilai per aspek

| Aspek | Nilai | Ringkasan |
|---|---|---|
| Visual design & branding | **A** | Palet hijau konsisten, tipografi rapi, whitespace enak, dark sidebar elegan. |
| Arsitektur informasi & navigasi | **A−** | Sidebar berikon logis (Dashboard, Cari Grup AI, Pengadaan, Vendor, Transaksi, Konsultasi AI, Profil). |
| Onboarding & empty states | **A** | "AI Siap Mencocokkan", "Halo! Saya siap membantu" + 6 chip pertanyaan — mengurangi kebingungan layar kosong. |
| Form & input | **A−** | Penanda wajib (*), format budget inline (Rp 3.000.000), urgensi berkode warna + teks. |
| Feedback & status | **B+** | Lonceng notifikasi + badge angka, badge "Aktif", tooltip grafik. |
| Data visualization | **A−** | Grafik tren penghematan dengan tooltip; timeline credit trail jelas. |
| Kejujuran data (trust) | **B−** | ⚠️ Data demo (penghematan, testimoni) belum dilabeli tegas sebagai simulasi/ilustrasi. |
| Aksesibilitas (WCAG) | **B?** | Belum terverifikasi — perlu cek kontras teks abu muda, focus state, keyboard nav. |
| Responsif/mobile | **B?** | Ada ikon hamburger (☰) → tampaknya responsif, tapi wajib diuji di HP (UMKM mobile-first). |

---

## ✅ KEKUATAN (sebutkan ke juri — ini nilai jual)

- **Landing page setara startup sungguhan:** hero + stat, bagian masalah (44 jt unbankable, >75% supply chain, 1,82% vs 13,52%), 3 fitur unggulan, "cara kerja 5 langkah", tabel perbandingan kompetitor, testimoni, pricing 3 tier, tim + roadmap, footer lengkap.
- **Dashboard product-grade:** 4 kartu KPI (Total Pengadaan, Penghematan, Transaksi Selesai, Skor Kredit), grafik tren, **timeline Credit Trail dengan badge "Data Nyata" + tombol Export**, panel Aksi Cepat, tip "Tahukah Anda?".
- **Empty state cerdas:** panel kanan matching memandu ("Isi form di kiri…"); konsultasi menyodorkan 6 pertanyaan contoh → discoverability tinggi.
- **Form matang:** format rupiah real-time, dropdown satuan, radio urgensi berwarna + label teks (bukan warna saja — bagus untuk aksesibilitas).
- **Disclaimer bertanggung jawab** di Konsultasi AI: *"Jawaban berdasarkan knowledge base Deschain — bukan nasihat hukum atau keuangan resmi."* → kematangan produk yang jarang di level hackathon; **poin plus di mata panel BI/OJK.**
- **Konsistensi komponen** (ikon lucide, kartu, warna) di seluruh halaman.

---

## 🔴 PRIORITAS TINGGI (perbaiki — terlihat juri saat coba app live)

**1. "15–25%" muncul di UI live (landing hero + tip dashboard)**
Hero landing: *"Hemat 15–25% Biaya Pengadaan"*; tip dashboard: *"rata-rata menghemat 15–25%"*. Padahal kode `_savings_rate` & proposal = **8–25%**, dan credit trail di dashboard sendiri menampilkan 8%–20%.
→ *Fix:* samakan **semua** teks UI ke **8–25%** (landing hero, meta, tip dashboard). Inkonsistensi di layar yang sama (tip bilang 15–25%, list di bawahnya 8–20%) mudah terlihat.

**2. Testimoni bernama dengan angka spesifik di landing**
"Ibu Siti Rahayu — Hemat Rp 800 ribu", "Bapak Ahmad Fauzi — Hemat 20%", "Ibu Maemunah — Berhasil akses KUR". Jika **bukan** pengguna pilot nyata, ini berisiko dianggap **fabrikasi** oleh panel BI/OJK.
→ *Fix:* beri label **"Ilustrasi/skenario pilot"** secara jujur, ATAU ganti dengan kutipan asli dari 5 survei + 2 wawancara Anda (lebih kuat & jujur).

**3. Angka demo tampil seolah nyata**
Dashboard: "Total Penghematan **Rp 6M**", "16.2% rata-rata", "Skor Kredit 4.3/5" pada akun demo (data seed). Juri yang mencoba app bisa mengira ini capaian riil.
→ *Fix:* tampilkan badge kecil **"Data demo/simulasi"** pada dashboard akun demo. (Anda sudah punya badge "Data Nyata" pada credit trail — buat padanannya untuk menandai data seed.)

---

## 🟠 PRIORITAS MENENGAH

**4. ⚠️ Ambiguitas "M" vs "jt" (lokalisasi krusial untuk UMKM)**
Dashboard menulis "Rp 49M", "Rp 6M" (maksudnya juta). Di Indonesia, **"M" umum dibaca "miliar"**, sedangkan juta = "jt". Pemilik warung bisa salah baca "Rp 49M" sebagai Rp 49 miliar.
→ *Fix:* pakai **"Rp 49 jt"** / "Rp 6 jt" (atau tulis penuh "Rp 49.000.000"). Detail kecil, tapi penting untuk kepercayaan pengguna target.

**5. Aksesibilitas (WCAG 2.1 AA) belum terverifikasi**
Beberapa teks sekunder abu-muda di atas putih tampak **kontras rendah** (mis. subjudul, teks kartu). Focus state keyboard, alt text ikon, dan navigasi keyboard tak terlihat dari screenshot.
→ *Fix:* cek kontras ≥ 4,5:1 (tool: WebAIM Contrast Checker); pastikan focus ring terlihat; label ARIA pada ikon-tombol.

**6. Mobile-first belum terkonfirmasi**
UMKM mayoritas akses via HP. Ada hamburger (☰) → kemungkinan responsif, tapi sidebar + tabel + grafik perlu diuji di layar kecil.
→ *Fix:* uji di HP nyata; pastikan tabel perbandingan & grafik tetap terbaca; target tap ≥ 44px.

**7. Konsistensi angka lintas-komponen**
Tip "15–25%" bertabrakan dengan penghematan aktual 8–20% di list yang sama. (Bagian dari #1, tapi tegaskan pengecekan menyeluruh.)

---

## 🟡 PRIORITAS RENDAH (polish)

8. **Badge notifikasi "3"** — pastikan bisa diklik & ter-clear (jangan dekoratif).
9. **Skor Kredit "4.3/5 Sangat Baik"** — beri tooltip "dihitung dari riwayat transaksi" agar transparan (selaras nilai jual credit trail).
10. **Loading/skeleton state** — pastikan ada saat AI matching memproses (hindari layar diam).
11. **Pengosongan form & validasi error** — pastikan pesan error inline ramah (mis. budget kosong).

---

## RINGKAS: 3 QUICK-WIN UI/UX SEBELUM SUBMIT
1. **Samakan 15–25% → 8–25%** di landing hero, meta, dan tip dashboard (paling terlihat juri).
2. **Labeli data demo & testimoni** sebagai simulasi/ilustrasi (tutup risiko kejujuran) — atau ganti testimoni dengan kutipan validasi asli.
3. **Ganti "M" → "jt"** pada angka rupiah (hindari salah baca miliar/juta).

Selebihnya, **pamerkan kekuatan UI/UX ini di video demo dan Field 12 (User Flow & Usability)** — kualitas antarmuka ini adalah aset nyata yang membedakan Deschain dari prototipe hackathon lain.

---
*Catatan: penilaian berbasis 4 screenshot kunci (landing, dashboard, matching, konsultasi). Aksesibilitas & mobile perlu pengujian langsung untuk konfirmasi. Untuk audit UX formal, jalankan usability test 2 UMKM (sudah direncanakan) — hasilnya mengisi Field 12 sekaligus.*
