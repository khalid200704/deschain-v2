# DESCHAIN — 3RD SUBMISSION (FORM RESMI PIDI DIGDAYA X 2026)
### Jawaban siap copy-paste per kolom. Angka di `[~x/maks]` = estimasi kata (di bawah batas).

> Semua angka konsisten: 65,5 jt UMKM · 44 jt unbankable · >75% supply chain · hemat **8–25% (simulasi)** · target 50.000 UMKM/3thn. Klaim teknis cocok dengan kode di GitHub.

---

## FIELD DROPDOWN & JUDUL

**ID Tim:** S0206
**Nama Tim:** Deschain

**Final Solution Title:**
> Deschain — Pengadaan Kolektif Berbasis AI & Credit Trail Digital untuk Inklusi Ekonomi UMKM

**Problem Statement:** Peningkatan Produktivitas, Ketahanan Pangan, dan Penciptaan Lapangan Kerja

**Sub-Problem Statement:** Inklusi Ekonomi (UMKM)

**Innovation Level:** **Level 3 — Prototype, Validasi, atau Implementasi Awal** ✅ (dikonfirmasi guidebook). Bukti pendukung sesuai definisi panitia: prototipe fungsional live (deschain-v2.vercel.app), source code repository terbuka, demo dengan input–output nyata (matching, credit trail), API berjalan, serta validasi awal (5 survei + 2 wawancara UMKM). *Lampirkan bukti-bukti ini di attachment.*

---

## 1. Final Team Composition — `[~92/100]`

Tim **Deschain** beranggotakan dua mahasiswa Rekayasa Sistem Komputer, Universitas Tanjungpura, Pontianak. **Abdullah Khalid Fadillah** (Ketua, Bisnis & Algoritma) berperan sebagai hustler yang memegang pengembangan bisnis dan kemitraan, sekaligus merancang algoritma inti Deschain seperti group matching, dynamic programming, dan forecasting. **Duta Satria Nugroho** (UI/UX & Promosi) membangun antarmuka dan pengalaman pengguna serta memimpin pemasaran dan pertumbuhan. Keduanya aktif penuh dan mengeksekusi produk dari hulu ke hilir secara mandiri. Rekam jejak tim konkret yaitu **Penerima Penghargaan Kategori Mahasiswa, Innovation Frontier 1, BI-OJK Hackathon 2025**, bukti kapasitas membawa solusi keuangan digital hingga dinilai regulator.

---

## 2. Final Solution Summary — `[~140/150]`

Deschain adalah platform pengadaan kolektif berbasis AI yang mengubah setiap transaksi bahan baku UMKM menjadi aset finansial melalui **credit trail digital**. Dari **65,5 juta UMKM** Indonesia, **44 juta unbankable** dan **lebih dari 75%** menyebut rantai pasok sebagai tantangan utama. Deschain menjawabnya dengan tiga lapisan: AI Group Matching dua tahap (similarity scoring + 0/1 Knapsack dynamic programming) untuk mengagregasi permintaan lintas-UMKM, batch optimizer vendor terverifikasi, dan asisten pengadaan berbahasa Indonesia yang otomatis mencatat jejak kredit. Simulasi internal menunjukkan potensi penghematan **8–25%** dan pemangkasan waktu pengadaan hingga 60%. Prototipe fungsional sudah live di deschain-v2.vercel.app: group matching, credit score dari riwayat transaksi nyata, notifikasi real-time, dan registrasi vendor mandiri berjalan. Deschain selaras dengan **Innovative Credit Scoring (POJK 29/2024)** dan **POJK 19/2025** tentang kemudahan akses pembiayaan UMKM—credit trail-nya menghasilkan data alternatif yang persis dipakai ICS, menjadikan UMKM unbankable layak dibiayai formal.

---

## 3. Progress and Change Log — `[~140/150]`

Sejak 2nd submission, Deschain berkembang dari rancangan menjadi **prototipe fungsional live** dengan peningkatan yang dapat diverifikasi di GitHub:

- **Algoritma matching berjalan di produksi:** similarity scoring 4-dimensi + **0/1 Knapsack DP** untuk komposisi grup optimal (`matching/router.py`), menggantikan pendekatan sederhana.
- **Credit score** kini dihitung dari riwayat transaksi nyata, bukan data seed statis.
- **Forecast** auto-kategorisasi dari riwayat order.
- **Lifecycle grup** lengkap: transisi status memicu notifikasi + email.
- **Notifikasi real-time** via Server-Sent Events dengan exponential backoff.
- **Registrasi vendor mandiri**, email SMTP opt-in, dan rate limiting login/register.

Fokus perbaikan menyasar dua kelemahan sebelumnya: kedalaman teknis dan bukti kebutuhan. Setiap peningkatan mengganti placeholder dengan logika sungguhan, menjaga produk defensibel saat juri memeriksa repositori. Gap tersisa (usability test skala penuh, integrasi pembayaran) dinyatakan terbuka.

---

## 4. Validated User Problem and Evidence — `[~235/250]`

**Pengguna utama & kapan.** Pemilik UMKM mikro-kecil (kuliner, ritel/warung, bahan pokok). Masalah muncul di dua momen rutin: saat membeli bahan baku eceran (volume kecil, harga mahal) dan saat mengajukan pembiayaan (ditolak karena tanpa riwayat kredit).

**Masalah utama.** UMKM Indonesia terjebak dua hambatan yang saling mengunci. Pertama, **lebih dari 75%** menyebut rantai pasok sebagai tantangan utama (Kadin, 2024): pembelian bahan baku dilakukan eceran, terfragmentasi, dan mahal karena tanpa daya tawar kolektif. Kedua, **44 juta UMKM unbankable** (PIP Kemenkeu RI) karena tidak memiliki jejak transaksi terstruktur yang dapat dinilai lembaga keuangan; kesenjangan melebar—per Maret 2025 kredit UMKM tumbuh hanya **~1,9%** vs korporasi **13,52%**, dan terus melemah hingga **kontraksi** pada akhir 2025 (Bank Indonesia, 2025). Akar keduanya sama: transaksi pengadaan UMKM tidak terdigitalisasi dan tidak teragregasi. Akibatnya UMKM membayar lebih mahal sekaligus tetap tak terlihat sistem pembiayaan formal—menghambat produktivitas dan penciptaan lapangan kerja.

**Bukti masalah nyata.** *Makro:* dari **65,5 juta UMKM** (61,9% PDB, 97% tenaga kerja; OJK Institute 2025), skala kedua hambatan terkonfirmasi data resmi. *Lapangan (validasi awal):* 5 survei terstruktur dan 2 wawancara mendalam via WhatsApp dengan UMKM Pontianak mengonfirmasi tiga hal—biaya pengadaan eceran dirasakan mahal, akses vendor terbatas, dan kepemilikan riwayat kredit dianggap berharga untuk pembiayaan. Ini **validasi awal**, bukan riset skala besar—dinyatakan apa adanya. **Penajaman sejak 2nd submission:** validasi mempertegas inti masalah bukan sekadar harga, tetapi ketiadaan daya tawar kolektif dan jejak kredit—keduanya langsung dijawab Deschain. Usability test 2 UMKM pada prototipe live sedang disiapkan. ⚠️ *Masukkan hasil usability test bila sudah ada.*

---

## 5. End-to-End Use Case and Feature-to-Pain Mapping — `[~285/300]`

**Alur end-to-end (contoh: Bu Siti, pemilik warung di Pontianak).**
1. **Input kebutuhan** — Bu Siti memasukkan kebutuhan: 50 kg beras, lokasi Pontianak, timeline minggu ini.
2. **Penyaringan kandidat** — sistem menghitung skor kesamaan empat dimensi (kategori 40%, kota 30%, budget 20%, urgensi 10%) untuk menemukan UMKM dengan kebutuhan serupa.
3. **Pembentukan grup optimal** — algoritma **0/1 Knapsack dynamic programming** memilih komposisi anggota yang memaksimalkan total penghematan kolektif.
4. **Harga kolektif** — makin besar grup, makin besar diskon (model group purchasing, 8–25% simulasi; konsisten dengan bukti empiris GPO global yang menghemat 10–30% pada pengadaan B2B).
5. **Pemilihan vendor** — batch optimizer memilih vendor terverifikasi terbaik (harga, performa pengiriman, lokasi) dengan tier diskon volume.
6. **Transaksi & credit trail** — transaksi selesai otomatis tercatat sebagai credit trail terstruktur yang dapat diekspor sebagai bukti kelayakan pembiayaan.
Sepanjang alur, **AI Procurement Assistant** berbahasa Indonesia memandu Bu Siti menjawab pertanyaan pengadaan.

**Pemetaan fitur → pain → manfaat:**
- *Pengadaan eceran mahal & terfragmentasi* → **AI Group Matching (DP)** → daya tawar naik, hemat 8–25% (simulasi).
- *Akses vendor terbatas* → **Vendor Recommendation + Batch Optimizer** → akses vendor terverifikasi naik, waktu pengadaan −60%.
- *UMKM unbankable* → **Credit Trail Digital otomatis** → bukti kelayakan untuk Innovative Credit Scoring OJK.
- *Literasi & kebingungan pengadaan* → **AI Assistant Bahasa Indonesia** → pengambilan keputusan lebih mudah.

Setiap fitur menyelesaikan pain spesifik, dan outputnya saling menguatkan: transaksi menghasilkan data yang memperbaiki matching sekaligus memperkaya credit trail.

---

## 6. Operational Context, Solution Boundary, and Adoption — `[~190/200]`

**Konteks operasional.** Deschain dipakai UMKM mikro-kecil (kuliner, ritel/warung, bahan pokok) yang rutin membeli bahan baku volume kecil-menengah dan sensitif harga. Antarmuka web responsif diakses tanpa instalasi; onboarding lewat WhatsApp dan koperasi lokal—kanal yang sudah dipercaya UMKM. Asisten AI berbahasa Indonesia menurunkan hambatan literasi digital.

**Batas solusi (dinyatakan jujur).** (1) Prototipe berjalan pada data ber-seed dan volume transaksi riil masih terbatas—akurasi matching meningkat seiring data (network effect). (2) **Integrasi payment gateway (Midtrans/Xendit) masih di luar scope**, direncanakan Fase 2. (3) Angka 8–25% adalah estimasi model, bukan data lapangan. (4) Verifikasi identitas penuh (NIB + e-KTP) dan MFA adalah item roadmap. (5) Untuk memicu matching bermakna dibutuhkan massa kritis UMKM-vendor per wilayah (cold-start).

**Adopsi.** Mitigasi cold-start via seeding vendor lokal dan onboarding berbasis komunitas per klaster kota, dimulai dari Pontianak. Manfaat langsung (penghematan) mendorong penggunaan berulang; credit trail dihasilkan otomatis tanpa beban input tambahan.

---

## 7. Current Technical Reality, Data, and Integration — `[~285/300]`

**Sudah dibangun & berjalan (dapat diperiksa di GitHub + live).**
- Prototipe live di **deschain-v2.vercel.app**; repo terbuka di github.com/khalid200704/Deschain-app.
- **Group matching dua tahap** berjalan di backend: similarity scoring 4-dimensi + **0/1 Knapsack DP** untuk komposisi grup + batch optimizer vendor berbasis tier diskon (`matching/router.py`).
- **Credit trail & credit score** dihitung dari riwayat transaksi nyata; alur input kebutuhan → grup → vendor → transaksi → credit trail berfungsi end-to-end.
- **Notifikasi real-time** (SSE, exponential backoff), lifecycle grup dengan email, registrasi vendor mandiri, rate limiting, email SMTP opt-in.
- **AI assistant** cascade: retrieval TF-IDF → Groq Llama-3.1 → Claude Haiku → model fine-tuned `deschain-umkm-7b` (Ollama) → template fallback.
- **Notebook tervalidasi:** partisi DP `dp_group_procurement`; suite forecasting (moving average, Holt-Winters, ARIMA, Prophet, LSTM, auto-select) + lot-sizing (EOQ, Wagner-Whitin, Silver-Meal).

**Stack.** React + Tailwind (frontend), FastAPI + Python (backend), PostgreSQL + Redis (data/cache), JWT auth. Keamanan: enkripsi AES-256, TLS 1.3, rencana MFA; compliance UU PDP No. 27/2022.

**Data & integrasi.** Data internal transaksi (bahan bakar matching & credit trail); rujukan publik harga BAPANAS dan verifikasi NIB via OSS; data vendor dari registrasi mandiri. **Kesiapan integrasi:** arsitektur modular berbasis REST/SSE memudahkan penyambungan API eksternal (OSS, BAPANAS, logistik JNE/SiCepat) dan payment gateway pada Fase 2. Seluruh komponen memakai teknologi matang/open-source—kelayakan teknis tinggi.

---

## 8. MVP Execution and Deployment Plan — `[~235/250]`

**Sasaran MVP:** pilot 100 UMKM aktif di Pontianak dengan alur pengadaan kolektif riil dan credit trail yang dapat diekspor untuk pembiayaan.

**Roadmap 6–12 bulan (prioritas):**
1. **Integrasi partisi-DP lanjutan** (`dp_group_procurement`) + suite forecasting/lot-sizing dari notebook ke aplikasi live untuk matching lebih optimal.
2. **Collaborative filtering vendor** dengan data transaksi riil (menggantikan skor performa dasar).
3. **Usability testing** dengan UMKM nyata untuk memvalidasi comprehension antarmuka dan iterasi produk.
4. **Integrasi payment gateway** (Midtrans/Xendit) end-to-end.
5. **Ekspor credit trail terformat** untuk pengajuan ke lembaga keuangan.
6. **Seeding vendor lokal** terverifikasi + onboarding UMKM via koperasi.

**Deployment.** Frontend di Vercel; backend containerized (Docker) siap deploy ke cloud dengan auto-scaling. Pemisahan lapisan memungkinkan tiap komponen dinaikkan independen.

**Urutan eksekusi:** menutup gap teknis (integrasi DP lanjutan) dan gap validasi (usability test) lebih dulu karena mengisi banyak dimensi penilaian sekaligus, lalu payment dan ekspor credit trail sebagai jembatan ke nilai bisnis. **Metrik keberhasilan pilot:** ≥100 UMKM aktif, ≥40% transaksi berulang/bulan, 100% pengguna aktif memiliki credit trail dapat diekspor.

---

## 9. Problem and System Complexity — `[~185/200]`

Masalah ini tidak dapat diselesaikan dengan cara sederhana (mis. marketplace pencarian pasif atau spreadsheet) karena empat sumber kompleksitas.

**Pertama, optimasi kombinatorial.** Membentuk grup pembelian yang memaksimalkan penghematan adalah masalah pemilihan subset dengan banyak kendala (kategori, lokasi, budget, timeline). Pencocokan naif tidak menghasilkan komposisi optimal—dibutuhkan **dynamic programming** (0/1 Knapsack) yang mempertimbangkan trade-off antar kandidat.

**Kedua, network effect & cold-start.** Kualitas matching bergantung pada kepadatan UMKM-vendor; sistem harus dirancang menumbuhkan dan memanfaatkan efek jaringan, bukan sekadar mendaftar transaksi.

**Ketiga, dua tujuan sekaligus.** Efisiensi pengadaan dan inklusi pembiayaan harus diselesaikan dalam satu alur—credit trail harus dihasilkan sebagai byproduct transaksi, terstruktur agar layak untuk Innovative Credit Scoring.

**Keempat, konteks UMKM mikro.** Literasi digital bervariasi dan margin tipis menuntut asisten AI hemat biaya (cascade model) dan antarmuka minim friksi. Kombinasi optimasi, efek jaringan, tujuan ganda, dan kendala pengguna inilah yang menuntut rancangan sistem, bukan solusi sederhana.

---

## 10. Processing Pipeline and Engineering Depth — `[~235/250]`

**Pipeline pemrosesan (per permintaan pengadaan):**
1. **Ingestion** — UMKM submit kebutuhan (kategori, kuantitas, kota, budget, urgensi) via API FastAPI; tersimpan di PostgreSQL.
2. **Similarity scoring** — `_compute_similarity` menghitung skor kesamaan berbobot (kategori 40%, kota 30%, budget 20%, urgensi 10%) terhadap kandidat, memakai Jaccard pada kategori dan pencocokan kota/rasio budget.
3. **Optimasi grup** — `_dp_optimal_group` menjalankan **0/1 Knapsack DP** (tabel dp[i][k], include-matrix, backtracking) memilih komposisi anggota yang memaksimalkan total penghematan; kompleksitas O(n×K).
4. **Penetapan penghematan** — `_savings_rate` step-function berbasis ukuran grup (model GPO).
5. **Optimasi vendor/batch** — `_segment_dp_optimize` mengelompokkan pesanan ke vendor mempertimbangkan tier diskon volume dan window pengiriman.
6. **Credit trail** — transaksi selesai memicu pencatatan terstruktur + notifikasi (SSE) + email (lifecycle grup).
7. **AI assistant** — jalur terpisah: retrieval TF-IDF pada knowledge base → cascade Groq → Claude Haiku → fine-tuned → template.

**Kedalaman engineering.** Arsitektur domain-driven (auth, matching, vendor, transaction, notification, consultation, analytics) dengan pemisahan concern jelas; caching Redis; rate limiting; uji otomatis (`tests/test_matching.py`, `test_auth.py`). Caching dan cascade model dirancang menekan latensi dan biaya inferensi—krusial untuk melayani UMKM mikro dalam skala.

---

## 11. Algorithm or Rule Quality and Decision Transparency — `[~285/300]`

Deschain sengaja memakai algoritma yang **deterministik dan dapat dijelaskan**, bukan black-box—penting untuk konteks keuangan yang diaudit regulator.

**1. Group matching berkualitas & transparan.** Tahap penyaringan memakai skor kesamaan dengan **bobot eksplisit** (kategori 40%, kota 30%, budget 20%, urgensi 10%), sehingga setiap keputusan "mengapa UMKM ini masuk grup" dapat dijelaskan angka per angka ke pengguna. Tahap komposisi memakai **0/1 Knapsack dynamic programming**: solusi optimal dijamin untuk fungsi tujuan (maksimasi penghematan), dan jalur keputusan dapat direkonstruksi lewat backtracking tabel DP—bukan tebakan heuristik.

**2. Aturan penghematan transparan.** Penghematan mengikuti step-function `_savings_rate` yang terbuka: ≥3 anggota→15%, ≥5→20%, ≥10→25%, di bawah itu 8% (model group purchasing). Pengguna tahu persis mengapa memperoleh angka tertentu; tidak ada "kotak hitam".

**3. Batch/vendor optimizer** memilih vendor via aturan tier diskon berbasis volume dan window pengiriman yang dapat ditelusuri.

**4. AI assistant berbasis RAG.** Jawaban dibangun dari retrieval TF-IDF atas knowledge base terkurasi (pengadaan, KUR, regulasi OJK/BI), lalu cascade Groq → Claude Haiku → model fine-tuned `deschain-umkm-7b` → template. Karena berbasis retrieval, jawaban dapat dirujuk ke sumber, menekan halusinasi.

**Alternatif, keterbatasan & pengukuran kualitas.** Pendekatan greedy/heuristik kemiripan sederhana sempat dipertimbangkan, tetapi tidak menjamin komposisi grup optimal—sehingga dipilih DP yang optimal untuk fungsi tujuan. Keterbatasan yang diakui: kualitas bergantung pada volume data (cold-start) dan bobot similarity masih statis (belum dipelajari dari data). Kualitas hasil diukur dari total penghematan grup, ukuran grup terbentuk, dan relevansi anggota; ke depan divalidasi dengan data transaksi riil dan usability test.

**Integritas & kejujuran.** Angka 8–25% ditegaskan sebagai **estimasi model/simulasi**, bukan data lapangan tervalidasi, dan akan dimutakhirkan dengan transaksi riil. Kombinasi bobot eksplisit, DP deterministik, aturan terbuka, dan RAG membuat setiap keputusan Deschain dapat diaudit.

---

## 12. User Flow, Usability Testing, and Product Iteration — `[~235/250]`

**User flow.** UMKM registrasi/login → lengkapi profil → input kebutuhan pengadaan → sistem menampilkan grup terbentuk + estimasi penghematan → pilih vendor rekomendasi → konfirmasi transaksi → pantau status via notifikasi real-time → lihat & ekspor credit trail di dashboard. Alur dirancang minim langkah; asisten AI membantu di titik kebingungan.

**Usability testing (status jujur).** Prototipe sudah dapat digunakan dan diakses publik dengan akun demo (`demo@deschain.id`). Usability test terstruktur dengan minimal 2 UMKM nyata—5 tugas terarah pada data ber-seed, form rekaman, dan skor comprehension—sedang dijalankan untuk mengukur seberapa mudah pengguna memahami pembentukan grup dan credit trail. ⚠️ *Masukkan temuan + perbaikan hasil test di sini bila sudah ada; ini mengisi dimensi penilaian usability secara langsung.*

**Iterasi produk (berbasis kejujuran & data).** Beberapa iterasi konkret telah dilakukan: credit score diubah dari data seed statis menjadi perhitungan dari riwayat transaksi nyata; forecast diubah dari default hardcoded menjadi auto-kategorisasi order; matching ditingkatkan ke similarity + DP; ditambahkan notifikasi real-time, lifecycle grup, dan rate limiting keamanan. Setiap iterasi mengganti placeholder dengan logika sungguhan—pola perbaikan yang akan dilanjutkan berdasarkan temuan usability test.

---

## 13. Team Capability and Execution Ownership — `[~230/250]`

**Kompetensi tim.** Deschain dieksekusi dua mahasiswa Rekayasa Sistem Komputer, Universitas Tanjungpura, dengan pembagian peran yang jelas mengikuti fungsi startup, yaitu bisnis, teknologi dan algoritma, produk, pengguna, serta promosi.

**Abdullah Khalid Fadillah (Ketua, Bisnis & Algoritma).** Berperan sebagai hustler yang memegang pengembangan bisnis, kemitraan, dan strategi (business dan partnership), sekaligus pemilik algoritma inti dan sisi teknis, mencakup similarity scoring dan 0/1 Knapsack DP, forecasting dan lot-sizing, arsitektur backend FastAPI, integrasi model AI cascade, serta keamanan. Bertanggung jawab atas keputusan bisnis dan teknis inti.

**Duta Satria Nugroho (UI/UX & Promosi).** Pemilik desain antarmuka dan pengalaman pengguna berbasis React dan Tailwind serta integrasi API dan notifikasi, memastikan solusi mudah diakses UMKM dengan literasi digital beragam. Juga memimpin promosi dan pertumbuhan, termasuk penyusunan materi dan kanal pemasaran.

**Bukti kapabilitas eksekusi.** Tim tidak berhenti di konsep. Prototipe fungsional live dengan repositori terbuka membuktikan kemampuan membangun dari hulu ke hilir secara mandiri. Rekam jejak **Innovation Frontier 1, BI-OJK Hackathon 2025** menunjukkan tim mampu membawa solusi keuangan digital hingga dinilai regulator. Pembagian bisnis-algoritma dan UI/UX-promosi yang tegas memungkinkan pengembangan produk dan pertumbuhan berjalan paralel, dengan tiap anggota akuntabel atas domainnya.

---

## 14. Continuation Readiness — `[~190/200]`

**Kelanjutan setelah hackathon.** Deschain bukan proyek sekali jalan—prototipe live, repositori terpelihara, dan roadmap MVP konkret sudah ada. Tim berencana melanjutkan ke **pilot 100 UMKM Pontianak** dengan urutan: integrasi DP lanjutan, usability test, payment gateway, lalu ekspor credit trail.

**Keberlanjutan teknis & biaya.** Cascade AI (TF-IDF dan model ringan di depan, model mahal hanya saat perlu) menekan biaya inferensi; teknologi open-source menekan lisensi; onboarding via koperasi/WhatsApp menekan CAC. Arsitektur modular siap diskalakan per wilayah dengan komponen yang dapat dipakai ulang.

**Jalur kemitraan.** Koperasi (kanal onboarding), vendor lokal (sisi pasokan), dan lembaga keuangan (pengguna credit trail, sejalan Innovative Credit Scoring OJK) menjadi mitra kelanjutan. ⚠️ *Nyatakan status tiap kemitraan jujur (dijajaki vs terikat).*

**Komitmen.** Tim berkomitmen mengembangkan Deschain pasca-hackathon karena selaras dengan agenda inklusi keuangan nasional dan memiliki jalur monetisasi yang jelas—menjadikan kelanjutan realistis, bukan sekadar niat.

---

## 15. Quantified Value, Business Model, and ROI — `[~285/300]`

**Nilai terukur (dengan baseline & target).**
| Dimensi | Baseline | Target 12 bln |
|---|---|---|
| Penghematan biaya/order | 0% (eceran) | 8–25% (simulasi) |
| Waktu siklus pengadaan | manual, berhari-hari | −60% |
| Akses vendor terverifikasi | 1–2 pemasok | +30% |
| UMKM aktif | 0 → prototipe | 100 (pilot) → 1.000 |
| UMKM dgn credit trail | 0 | 100% pengguna aktif |
| Transaksi berulang/bln | — | ≥40% |

**Model bisnis (forward-looking, belum operasional).** (1) Subscription freemium→berbayar (analitik lanjutan & ekspor credit trail premium, kisaran Rp99K–999K/bln); (2) transaction fee 1–2,5% dari nilai transaksi kolektif—tumbuh seiring keberhasilan pengguna; (3) vendor premium listing; (4) lisensi/data-as-a-service anonim (patuh PDP) ke lembaga keuangan mitra. Prioritas awal: transaction fee + subscription, paling langsung terkait manfaat yang dirasakan UMKM.

**ROI & unit economics (proyeksi model — rincian di lampiran).** Skenario Basis: **CAC Rp120.000**, ARPU ~Rp65.000/bln, **LTV ~Rp1,3 juta → LTV/CAC ~10:1** (ambang sehat >3), **payback ~2,6 bulan**, **break-even operasional ~2.700 UMKM aktif** (±18–24 bulan). Proyeksi Tahun 1→3: rugi wajar fase ramp → **profitabel Tahun 2** → pendapatan **~Rp23 M, margin EBITDA ~60% (Tahun 3)**. Asumsi diturunkan dari benchmark tervalidasi (take rate B2B 1,5–2%; belanja stok warung Rp7–21 jt/bln; GPO hemat 10–30%) dan akan diuji pada pilot 100 UMKM. Insentif selaras: Deschain hanya tumbuh bila UMKM benar-benar berhemat dan bertransaksi lebih banyak. Nilai publiknya melampaui efisiensi—mengubah aktivitas ekonomi riil menjadi infrastruktur data inklusi bagi 44 juta UMKM unbankable, mendukung target inklusi 90% (Roadmap Keuangan Inklusif OJK) dan POJK 19/2025.

---

## 16. Adoption, Growth Strategy, and Competitive Moat — `[~240/250]`

**Strategi akuisisi & pertumbuhan.** Beachhead di **Pontianak/Kalbar** (tim punya warm contact dan konteks lokal), lalu ekspansi klaster kota: Kalsel, Jateng, Sulsel. Akuisisi berbiaya rendah lewat **koperasi** (160.000 koperasi aktif sebagai simpul onboarding) dan **WhatsApp**—kanal yang sudah dipercaya UMKM. Pertumbuhan mengikuti pola: seeding vendor lokal per wilayah untuk memicu massa kritis, lalu network effect menaikkan kepadatan UMKM-vendor. Target realistis **50.000 UMKM aktif dalam 3 tahun**—penetrasi konservatif dari 65,5 juta UMKM, dibangun wilayah demi wilayah.

**Competitive moat.** Tiga hal yang tidak dimiliki kompetitor (Indotrading, Ralali—pasif; PaDi—UMKM sebagai penjual; Poolapack—tekstil, pasif; Mbiz—enterprise):
1. **Active AI matching multi-sektor** (similarity + DP), bukan browsing pasif.
2. **Network effect**—makin banyak pengguna, makin akurat matching dan makin kaya data; keunggulan yang menguat seiring skala, sulit ditiru pendatang baru.
3. **Credit trail by design**, selaras **Innovative Credit Scoring (POJK 29/2024)**—data transaksi (riwayat pembayaran & pengiriman) yang dikumpulkan Deschain persis jenis data alternatif yang diakui ICS untuk menilai UMKM unbankable. Data terstruktur yang terakumulasi jadi aset proprietari.

Kombinasi efek jaringan + data credit trail proprietari + keselarasan regulasi menciptakan moat yang mendalam seiring waktu—bukan sekadar fitur yang bisa disalin.

---

## VIDEO, ATTACHMENT & CV (field non-naratif)

- **Video Submission:** link YouTube **unlisted** Elevator Pitch → pakai script di `Deschain-Video-Pitch-Package.md`.
- **Link Attachment (publik, satu saja):** rekomendasi → live demo **https://deschain-v2.vercel.app** atau GitHub **https://github.com/khalid200704/Deschain-app**. ⚠️ *Jika unggah PDF: format PDF ≤5MB, nama file "S0206 - Deschain".*
- **CV/LinkedIn Ketua (wajib):** link LinkedIn/CV Khalid. ⚠️ *Isi.*
- **CV/LinkedIn Anggota:** link Duta (jika ada).

---

---

## LAMPIRAN — REFERENSI & SUMBER (untuk verifikasi juri / attachment)

**Skala & kontribusi UMKM**
- Kemenko Perekonomian RI — UMKM ~65 juta, kontribusi 61% PDB, dorongan ekosistem pembiayaan: https://www.ekon.go.id/publikasi/detail/6152/
- Suara Merdeka (data OJK Institute) — UMKM kontribusi **61,9% PDB** & serap **97% tenaga kerja**: https://www.suaramerdeka.com/ekonomi/0416348320/
- Kompas/Antara — Presiden: UMKM sokong 61% PDB: https://nasional.kompas.com/read/2024/03/07/14210691/

**UMKM unbankable (44 juta)**
- PIP Kemenkeu RI — Tujuh Tahun Mendukung Usaha Mikro (populasi unbankable): https://pip.kemenkeu.go.id/berita/142/
- Liputan6 — "Sumbang 61% ke PDB, Masih Banyak UMKM Belum Bankable": https://www.liputan6.com/bisnis/read/7025567/
- Holding Ultra Mikro (BRI-Pegadaian-PNM) targetkan 45 juta nasabah unbankable: https://www.sinarmassekuritas.co.id/di-2024-holding-ultra-mikro-bri-pegadaian-pnm-targetkan-layani-45-juta-nasabah-unbankable

**Innovative Credit Scoring & akses pembiayaan (regulasi kunci)**
- OJK — Siaran Pers: Peraturan Pemeringkat Kredit Alternatif (**POJK 29/2024**), data alternatif: transaksi e-commerce, riwayat pembayaran, telekomunikasi, alamat pengiriman: https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/OJK-Terbitkan-Peraturan-Pemeringkat-Kredit-Alternatif.aspx
- IDX Channel — Bank/LKNB boleh pakai credit scoring alternatif (**POJK 19/2025** Kemudahan Akses Pembiayaan UMKM): https://www.idxchannel.com/banking/ojk-permudah-pembiayaan-umkm-kini-perbankan-atau-lknb-bisa-pakai-credit-scoring-alternatif
- Prolegal — Mekanisme Innovative Credit Scoring (ICS): https://prolegal.id/ojk-resmi-terbitkan-aturan-innovative-credit-scoring-ics-begini-mekanismenya/

**Kesenjangan kredit UMKM vs korporasi (2025)**
- Kompas Money — Maret 2025: kredit UMKM tumbuh ~1,95% vs korporasi 13,52%: https://money.kompas.com/read/2025/05/10/070000726/
- Bisnis.com — Korporasi double digit, UMKM seret (Sept 2025): https://finansial.bisnis.com/read/20251107/90/1927045/
- Gemapos — Kredit UMKM anjlok 0,11% (Okt 2025): https://www.gemapos.id/bisnis/2781931384/

**Bukti empiris group buying / GPO (validasi angka 8–25%)**
- BizEquals — GPO hemat rata-rata **13,1%**; 85% peserta konsorsium hemat ≥10%: https://bizequals.com/blog/benefits-group-buying-maximising-sme-purchase-power
- Thrive BG — What Is Group Purchasing (2026 guide), pengadaan B2B hemat **10–30%**: https://www.thrivebg.com/post/what-is-group-purchasing-a-2026-guide-for-leaders
- Model group buying Pinduoduo (referensi skala): https://en.wikipedia.org/wiki/Group_buying

**Rantai pasok & supply chain**
- Kadin Indonesia (2024) — >75% UMKM sebut supply chain tantangan utama. *(sumber internal Tahap 1 — pertahankan link resmi Kadin bila ada)*

> Catatan: angka 8–25% adalah **hasil simulasi** yang konsisten dengan rentang empiris GPO (10–30%); LTV/CAC & break-even adalah **proyeksi** berbasis asumsi.

---

## ⚠️ CHECKLIST FINAL SEBELUM SUBMIT
1. **Innovation Level** — pilih **Level 3** (sudah dikonfirmasi sesuai definisi guidebook).
2. **Fix README GitHub** — headline "15–25%" → **8–25%** agar konsisten dengan proposal, video & kode.
3. **Nama tim Deschain** — pastikan tampil benar di form (Anda bilang web belum ganti).
4. **Usability test** — isi field #12 & #4 dengan hasil nyata bila sempat hari ini.
5. **Angka konsisten** — 8–25% (simulasi), LTV/CAC & break-even (proyeksi), 65,5 jt / 44 jt / 50.000.
6. **CV Ketua wajib** — jangan lupa link LinkedIn/CV.
7. **Video unlisted** + tautkan; **Attachment** satu link publik yang bisa diakses.
8. **Save as Draft berkala**, cek word-count portal per field sebelum Submit.
