# DAFTAR ASET VIDEO DESCHAIN — & DI MANA MENDAPATKANNYA
### Untuk video Elevator Pitch (1 menit pitch + 2 menit demo, ≤180 dtk, 1080p 16:9)

> **Aturan lisensi guidebook (WAJIB):** gunakan materi visual, musik, dan aset yang **dimiliki sendiri atau memiliki izin**. Prioritaskan sumber **royalty-free / CC0**. Jika track/aset minta atribusi, cantumkan di deskripsi YouTube. **Hindari musik/pop berhak cipta** (kena Content ID YouTube).

---

## ✅ SUDAH ANDA MILIKI (tinggal pakai)

| Aset | Lokasi | Catatan |
|---|---|---|
| **Logo Deschain** | `frontend/public/deschain-icon.svg` | Export ke PNG transparan untuk CapCut (lihat cara di bawah). |
| **15 screenshot produk** | `screenshots/` (01_landing … 15_admin) | B-roll instan untuk demo/opening bila screen recording gagal. Pakai efek Ken Burns. |
| **Palet warna brand** | `frontend/tailwind.config.js` | Hijau utama **#49913E**, gelap **#0F1F0D**, terang **#F2F8F1**, aksen **#6DB863**. Pakai untuk semua teks & motion. |
| **Aplikasi live** | deschain-v2.vercel.app | Sumber screen recording utama. |
| **Akun demo** | `demo@deschain.id` / `Demo1234!` | Untuk merekam user journey. |
| **Seed data** | `backend/seed.py` | Jalankan agar grup & vendor muncul saat rekaman. |

> ⚠️ Catatan konsistensi: `index.html` (meta og:title) & README masih tertulis **"Hemat 15–25%"**. Di video pakai **8–25%**. Idealnya samakan meta jadi 8–25% sebelum juri buka repo/situs.

---

## 🎥 1. FOOTAGE (rekaman gambar)

### a. B-roll Problem (warung / pasar / uang) — Babak Pitch 5–15 dtk
**Paling kuat: rekam sendiri** (autentik & pasti berlisensi) — warung tetangga/pasar Pontianak, tangan menghitung uang receh, rak bahan baku, karung beras. HP 1080p, cahaya pagi.

**Jika perlu stock gratis (CC0, boleh komersial):**
- **Pexels Video** — pexels.com/videos · cari: `warung`, `traditional market indonesia`, `small shop owner`, `counting money`, `rice`, `vegetable market`
- **Pixabay Video** — pixabay.com/videos · cari: `market stall`, `spices`, `indonesia street`
- **Mixkit** — mixkit.co/free-stock-video · cari: `local market`, `cash`, `grocery`
- **Coverr** — coverr.co · **Videvo** — videvo.net (cek label lisensi "no attribution")

### b. Talking Head (Khalid + Duta) — Pitch 0–5 & 55–60, Demo 160–180
**Rekam sendiri.** Perlengkapan minimal:
- Kamera: HP (mode 1080p/4K, kunci fokus & eksposur).
- **Tripod/penyangga** HP (Rp20–50rb) atau tumpuk buku.
- **Cahaya:** hadap jendela (natural) atau ring light (Rp50–150rb).
- **Mic:** clip-on/lavalier murah (Rp30–80rb) atau mic earphone — jauh lebih baik dari mic internal.
- Latar: dinding polos/rapi; mata ke lensa.

### c. Screen Recording (demo produk) — Demo 60–160 dtk
Tools gratis:
- **OBS Studio** — obsproject.com (gratis, 1080p/60fps, terbaik)
- **Windows:** Game Bar bawaan (`Win + G` → Record)
- **ScreenPal** (screenpal.com) / **Loom** (loom.com) — mudah
Rekam di layar 1080p, kursor pelan; jalankan `python seed.py` dulu.

---

## 🔊 2. AUDIO

### a. Musik latar (royalty-free, aman Content ID)
Mood: **uplifting / corporate / hopeful / inspiring**, tempo sedang. Volume −18 s/d −22 dB.
- **YouTube Audio Library** — youtube.com/audiolibrary (login → Audio Library; filter "No copyright", cek kolom Attribution)
- **Pixabay Music** — pixabay.com/music (CC0, tanpa atribusi) · cari: `corporate inspiring`, `uplifting technology`, `hopeful`
- **Uppbeat** — uppbeat.io (gratis + kode kredit)
- **Mixkit Music** — mixkit.co/free-stock-music · **Bensound** — bensound.com · **Chosic** — chosic.com

### b. Sound effects (SFX)
- **Mixkit SFX** — mixkit.co/free-sound-effects · **Pixabay SFX** — pixabay.com/sound-effects · **Freesound** — freesound.org (cek lisensi CC0)
- Yang dibutuhkan: `whoosh`/`swoosh` (transisi babak), `pop`/`notification` (saat toast credit trail), `tick`/`counter` (count-up angka), `success chime` (akhir).

### c. Voice-over (VO)
- Rekam suara sendiri (Bahasa Indonesia) — HP di ruang senyap, mic dekat.
- Bersihkan noise: **Audacity** (audacityteam.org, gratis) atau **CapCut → Reduce Noise**.
- Naskah kata-per-kata sudah ada di `Deschain-Video-Pitch-Package.md`.

---

## 🎨 3. GRAFIS & VISUAL

### a. Logo → PNG transparan
Punya `deschain-icon.svg`. Konversi ke PNG (transparan, ukuran besar):
- Cepat: buka SVG di browser → screenshot, atau pakai **cloudconvert.com** (SVG→PNG), atau **Figma/Canva** (import SVG → export PNG 1024px).

### b. Font (untuk teks on-screen) — gratis
- **Google Fonts** (fonts.google.com): **Poppins** atau **Montserrat** (headline tebal), **Inter** (angka & body). Bold, kontras tinggi.

### c. Ikon untuk motion diagram 3-lapisan (Pitch 35–45 / Demo 100–130)
Ikon dibutuhkan: **grup/jabat tangan**, **toko/vendor**, **grafik/credit trail**, **karung beras**, **pin lokasi**, **centang**.
- **Lucide** — lucide.dev (aplikasi Anda sudah pakai lucide-react → konsisten, gratis, MIT)
- **Flaticon** — flaticon.com (gratis + atribusi) · **Icons8** — icons8.com · **Iconscout** — iconscout.com

### d. Ilustrasi (opsional, bisa diwarnai brand hijau)
- **unDraw** — undraw.co (CC0, warna bisa diganti ke #49913E) · **Storyset** — storyset.com

### e. Peta Indonesia (visual ekspansi regional)
- **Freepik** — freepik.com (cari `indonesia map vector`) · **Vecteezy** — vecteezy.com · **Wikimedia Commons** (SVG bebas)

### f. Foto pendukung (jika perlu)
- **Unsplash** — unsplash.com · **Pexels** — pexels.com · **Pixabay** (cari: `UMKM`, `indonesia small business`, `warung`)

---

## 🛠️ 4. TOOLS EDITING & MOTION

| Kebutuhan | Tool gratis |
|---|---|
| Editing utama + subtitle auto | **CapCut** (desktop/HP) — panduan sudah di paket video |
| Motion diagram / lower-third / intro-outro | **CapCut** built-in, atau **Canva** (canva.com, template video) |
| Count-up angka | CapCut (Teks + keyframe), atau template Canva |
| Konversi SVG→PNG | CloudConvert / Figma / Canva |
| Bersihkan audio | Audacity / CapCut Reduce Noise |

---

## 🗂️ 5. PEMETAAN ASET → ADEGAN (checklist rekam)

| Adegan (script) | Aset dibutuhkan | Sumber |
|---|---|---|
| Pitch 0–5 (hook) | Talking head + logo PNG | Rekam sendiri + logo repo |
| Pitch 5–15 (problem) | B-roll warung/pasar + teks angka | Rekam sendiri / Pexels-Pixabay |
| Pitch 15–35 (use case) | Screen recording singkat + musik | OBS + app live |
| Pitch 35–45 (cara kerja) | Motion diagram + ikon 3-lapisan | CapCut/Canva + Lucide |
| Pitch 45–55 (nilai) | Teks + ikon credit trail/POJK | CapCut + Flaticon |
| Pitch 55–60 (CTA) | Talking head + logo + URL | Rekam sendiri |
| Demo 60–160 (walkthrough) | Screen recording penuh + SFX pop | OBS + Mixkit SFX |
| Demo 100–130 (algoritma) | Motion overlay bobot 40/30/20/10 + tabel DP | CapCut/Canva |
| Demo 130–160 (credit trail) | Screen + toast SFX + teks validasi | OBS + SFX |
| Demo 160–180 (outro) | Count-up angka + logo + URL + musik naik | CapCut + logo |
| Sepanjang video | Subtitle, musik latar, font Poppins/Inter | CapCut auto-caption + Pixabay Music + Google Fonts |

---

## 💰 ANGGARAN (semua bisa Rp0)

- **Gratis total:** semua footage rekam sendiri + stock CC0 + musik Pixabay + CapCut + logo repo = **Rp0**.
- **Opsional tingkatkan kualitas:** mic clip-on (~Rp50rb) + ring light (~Rp100rb) = suara & wajah jauh lebih profesional. Investasi kecil, dampak besar untuk skor video (35%).

---

## ⚠️ CHECKLIST LISENSI SEBELUM UPLOAD
- [ ] Semua footage: rekam sendiri ATAU dari sumber CC0/royalty-free
- [ ] Musik: dari YouTube Audio Library / Pixabay (No copyright); atribusi (bila diminta) ditulis di deskripsi video
- [ ] SFX: CC0 (Mixkit/Pixabay/Freesound CC0)
- [ ] Font & ikon: Google Fonts / Lucide / Flaticon (dengan atribusi bila diminta)
- [ ] Tidak ada musik/pop berhak cipta
- [ ] Logo & screenshot = milik sendiri (aman)
