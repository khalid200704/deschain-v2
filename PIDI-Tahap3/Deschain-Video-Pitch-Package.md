# PAKET VIDEO — DESCHAIN (FORMAT RESMI GUIDEBOOK PIDI 3RD SUBMISSION)
### Elevator Pitch ≤ 180 detik · struktur panitia: 1-Menit Pitch + 2-Menit Demo

> **Spek wajib (guidebook hlm. 20):** durasi **maks 180 detik** (termasuk opening/credit) · resolusi **min 1920×1080 (Full HD 1080p)** · rasio **16:9 horizontal** · audio narasi jelas, musik tidak menutupi suara · **subtitle sangat direkomendasikan** · upload YouTube (form: **unlisted** & bisa diakses publik lewat link).
>
> **Prinsip panitia:** tunjukkan use case jelas, demo nyata, jelaskan algoritma/AI sederhana, pakai data yang bisa dipertanggungjawabkan, **jujur** soal yang sudah/belum berfungsi. Label "hasil simulasi" untuk 8–25%.

---

## PETA WAKTU (ringkas)

| Bagian | Waktu | Fokus |
|---|---|---|
| **PITCH** | 0–60 dtk | Masalah → solusi → nilai → ajakan (verbal + visual) |
| **DEMO** | 60–180 dtk | Bukti nyata: walkthrough produk + cara kerja + validasi |

---

# BAGIAN 1 — ONE-MINUTE PITCH (0–60 dtk)

### 0–5 dtk · Nama tim, judul, hook
> *(Talking head Khalid / logo Deschain)*
**Khalid:** "Kami **Deschain** — mengubah setiap transaksi belanja UMKM menjadi aset finansial."
*(Teks: **DESCHAIN** · Pengadaan Kolektif AI + Credit Trail)*

### 5–15 dtk · Pengguna utama, pain point, dampak
> *(B-roll warung/pasar)*
**VO:** "65 juta UMKM Indonesia. Lebih dari 75% kesulitan mendapat bahan baku murah, dan 44 juta unbankable — ditolak bank karena tak punya jejak transaksi."
*(Teks: **75% sulit bahan baku** · **44 JT unbankable**)*

### 15–35 dtk · Use case utama + cuplikan demo
> *(Cut ke screen recording singkat)*
**VO:** "Bu Siti, pemilik warung, cukup memasukkan kebutuhannya. AI Deschain langsung mengelompokkannya dengan UMKM lain berkebutuhan sama menjadi satu pembelian besar — harga turun, simulasi menghemat 8 sampai 25 persen."
*(Klik singkat: input → grup terbentuk → angka hemat. Teks kecil: **"hasil simulasi"**)*

### 35–45 dtk · Cara kerja inti, data, teknologi, feasibility
**VO:** "Di balik layar: skor kesamaan berbobot memilih kandidat, lalu algoritma dynamic programming menyusun grup paling optimal. Semua sudah berjalan di aplikasi live, bukan sekadar mockup."
*(Teks: **Similarity + 0/1 Knapsack DP** · **Prototype LIVE**)*

### 45–55 dtk · Nilai utama, dampak, ROI, pihak yang mengadopsi
**VO:** "Setiap transaksi otomatis membangun credit trail — data alternatif yang persis diakui Innovative Credit Scoring OJK. UMKM unbankable akhirnya punya jalan ke pembiayaan formal. Koperasi dan lembaga keuangan jadi mitra."
*(Teks: **Credit Trail → akses pembiayaan** · selaras **POJK 29/2024**)*

### 55–60 dtk · Status, kesiapan tim, milestone, collaboration ask
**VO:** "Tim kami peraih Innovation Frontier BI-OJK 2025. Prototipe siap dicoba; langkah berikutnya pilot 100 UMKM Pontianak. Mari berkolaborasi."
*(Teks: **Coba: deschain-v2.vercel.app** · **Ayo kolaborasi**)*

---

# BAGIAN 2 — TWO-MINUTE DEMO (60–180 dtk)

> *(Screen recording deschain-v2.vercel.app. Login demo: `demo@deschain.id` / `Demo1234!`. Seed data terisi. 1080p, kursor pelan.)*

### 60–70 dtk · Pengantar deep dive
**VO:** "Sekarang kita masuk ke produk nyatanya. Saya akan tunjukkan satu perjalanan lengkap: dari UMKM memasukkan kebutuhan hingga terbentuk credit trail."
*(Tampilkan dashboard UMKM)*

### 70–100 dtk · Bukti utama inovasi — user journey (input → proses → output)
**VO:** "Langkah satu: Bu Siti input kebutuhan — 50 kg beras, Pontianak, minggu ini."
*(Klik: form kebutuhan → submit)*
**VO:** "Langkah dua: sistem menemukan UMKM serupa dan membentuk grup pembelian, lengkap dengan estimasi penghematan."
*(Klik: grup terbentuk → highlight angka. Teks: **"8–25% — hasil simulasi"**)*
**VO:** "Langkah tiga: Deschain merekomendasikan vendor terverifikasi terbaik berdasarkan harga, performa, dan lokasi."
*(Klik: daftar vendor → pilih → konfirmasi)*

### 100–130 dtk · Cara kerja & kedalaman (algoritma, transparansi, human-in-the-loop)
**VO:** "Bagaimana keputusannya dibuat? Transparan. Skor kesamaan memakai bobot eksplisit — kategori 40%, kota 30%, budget 20%, urgensi 10%. Lalu 0/1 Knapsack dynamic programming memilih komposisi grup dengan penghematan maksimum. Aturan diskonnya terbuka: makin besar grup, makin besar hemat. Bukan kotak hitam — setiap angka bisa dijelaskan ke pengguna, dan pengguna tetap yang memutuskan bergabung."
*(Motion diagram: bobot 40/30/20/10 → tabel DP → aturan diskon. Teks: **Deterministik & dapat diaudit**)*

### 130–160 dtk · Output inti + bukti validasi
**VO:** "Langkah empat, inti inovasi: transaksi yang selesai otomatis tercatat sebagai credit trail terstruktur — riwayat volume, ketepatan, dan nilai — yang bisa diekspor sebagai bukti kelayakan pembiayaan."
*(Klik: dashboard credit trail → tombol ekspor. Toast: "Transaksi tercatat")*
**VO:** "Validasi awal dari survei dan wawancara UMKM Pontianak mengonfirmasi kebutuhan ini; angka penghematan kami konsisten dengan bukti group purchasing global yang menghemat 10 sampai 30 persen."
*(Teks: **Validasi awal 5 survei + 2 wawancara** · **benchmark GPO 10–30%**)*

### 160–180 dtk · Nilai, roadmap, kesiapan tim, closing + collaboration ask
**VO:** "Dampaknya: hemat biaya, waktu pengadaan turun hingga 60%, dan yang terpenting — 44 juta UMKM unbankable punya jalan ke pembiayaan formal. Prototipe sudah live; berikutnya pilot 100 UMKM lalu ekspansi regional. Deschain — mengubah transaksi UMKM jadi aset finansial. Coba sekarang di deschain-v2.vercel.app."
*(Layar akhir: logo + **deschain-v2.vercel.app** + GitHub. Teks kecil: target 50.000 UMKM/3thn — proyeksi)*

---

## SHOT LIST / STORYBOARD

| # | Bagian | Tipe shot | Yang direkam | Catatan |
|---|---|---|---|---|
| 1 | Pitch 0–5 | Talking head / logo | Khalid + logo | Hook to the point, energik. |
| 2 | Pitch 5–15 | B-roll | Warung/pasar, tangan hitung uang | 3–4 klip @sekitar 4 dtk, cahaya pagi. |
| 3 | Pitch 15–35 | Screen (singkat) | Input → grup → hemat | Potongan cepat, bukan penuh. |
| 4 | Pitch 35–55 | Motion + teks | Diagram + label nilai | CapCut. |
| 5 | Pitch 55–60 | Talking head | Khalid: status + ajakan | Boleh berdua dgn Duta. |
| 6 | Demo 60–160 | Screen record | User journey penuh + credit trail | 1080p, kursor pelan, zoom elemen penting. |
| 7 | Demo 100–130 | Motion overlay | Bobot 40/30/20/10 + tabel DP | Visual algoritma sederhana. |
| 8 | Demo 160–180 | Motion + outro | Count-up dampak + logo/URL | Hold 3 dtk. |

**Sebelum rekam demo:** login akun demo, jalankan `python seed.py`, bersihkan tab, matikan notifikasi OS, zoom browser 100–110%.

---

## PANDUAN EDITING CAPCUT

1. **Proyek:** 16:9, **1080p**, 30fps. Timeline urut: Pitch (0–60) → Demo (60–180). **Jangan lewat 180 dtk.**
2. **Audio:** VO direkam terpisah (ruang senyap); musik instrumental −18 s/d −22 dB; aktifkan Reduce Noise; jaga volume antarbagian konsisten (syarat guidebook).
3. **Subtitle:** WAJIB pasang (auto-caption CapCut → koreksi manual). Guidebook sangat menyarankan; teks harus sesuai narasi & terbaca.
4. **Motion:** Ken Burns pada B-roll; count-up angka di outro; overlay teks untuk tiap angka penting (juri sering menonton tanpa suara).
5. **Label kejujuran:** "hasil simulasi" dekat 8–25%; "proyeksi" dekat target/ROI.
6. **Demo:** percepat momen loading 1.5–2×; zoom-in pada angka hemat & tombol ekspor credit trail; highlight kursor saat klik penting.
7. **Export:** 1080p, 30fps, bitrate ≥ 8 Mbps. Tonton sekali tanpa suara (cek keterbacaan), lalu upload **unlisted** & tautkan di form.

---

## ⚠️ CHECKLIST KONSISTENSI (Video ↔ Proposal ↔ GitHub)
- [ ] Durasi ≤ **180 dtk**, 1080p, 16:9, subtitle ada
- [ ] Angka **8–25% (simulasi)** & benchmark GPO 10–30% konsisten dgn proposal
- [ ] Nama tim **Deschain**; klaim **DP live** akurat (`matching/router.py`)
- [ ] Sebut **POJK 29/2024 (ICS)** — selaras credit trail
- [ ] **Fix README** 15–25% → 8–25% sebelum juri buka repo
- [ ] Klaim **BI-OJK 2025 (Innovation Frontier 1)** akurat
- [ ] URL live & GitHub bisa diakses; video **unlisted** tertaut di form
