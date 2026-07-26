# PROPOSAL 3RD SUBMISSION — PIDI DIGDAYA X HACKATHON 2026
### Deschain — Platform Pengadaan Kolektif AI untuk UMKM dengan Credit Trail Digital

> **Cara pakai dokumen ini:** setiap section diberi label batas kata resmi dan hitungan kata aktual `[xx/maks]`. Salin per-section ke portal submission. Semua angka sudah dikonsistenkan lintas-section. Bagian yang perlu Anda isi/verifikasi ditandai `⚠️`.

---

## A. IDENTITAS TIM

**Team ID:** S0206
**Team Name:** Geprek Zago ⚠️ *(pastikan sesuai pendaftaran resmi — catatan proyek menyebut "Geprek Zago", materi awal menyebut "Deschain")*
**Proposal Title:** Deschain — Pengadaan Kolektif Berbasis AI & Credit Trail Digital untuk Inklusi Ekonomi UMKM
**Problem Statement:** Peningkatan Produktivitas, Ketahanan Pangan, dan Penciptaan Lapangan Kerja
**Primary Sub-Problem:** Inklusi Ekonomi (UMKM) — B2B Matchmaking Bahan Baku & Pemanfaatan Data Alternatif/Credit Scoring

---

### 1. Team Composition — `[116/120]`

Tim Geprek Zago terdiri atas dua mahasiswa Rekayasa Sistem Komputer, Universitas Tanjungpura, Pontianak. **Abdullah Khalid Fadillah** (Ketua, Product Architect & AI System) bertanggung jawab atas perancangan algoritma group matching, forecasting, arsitektur sistem, dan integrasi model AI. **Duta Satria Nugroho** (Web Developer & Frontend) menangani antarmuka pengguna, integrasi API, serta pengalaman pengguna aplikasi. Tim membawa rekam jejak konkret: **Penerima Penghargaan Kategori Mahasiswa, Innovation Frontier 1 pada BI-OJK Hackathon 2025**. Track record ini menunjukkan kapasitas mengeksekusi solusi keuangan digital dari konsep hingga prototipe fungsional yang telah dinilai regulator. Kombinasi keahlian AI/backend dan frontend memungkinkan tim membangun serta mengiterasi produk end-to-end secara mandiri.

---

### 2. Executive Summary — `[149/150]`

Deschain adalah platform pengadaan kolektif berbasis AI yang mengubah setiap transaksi bahan baku UMKM menjadi aset finansial melalui credit trail digital. Dari **65,5 juta UMKM** Indonesia, **44 juta unbankable** dan **lebih dari 75%** menyebut rantai pasok sebagai tantangan utama. Deschain menjawabnya dengan tiga lapisan: AI Group Matching (dynamic programming) untuk mengagregasi permintaan lintas-UMKM, rekomendasi vendor hybrid, dan asisten pengadaan yang otomatis mencatat jejak kredit. Simulasi internal menunjukkan potensi penghematan **8–25%** dan pemangkasan waktu pengadaan hingga 60%. Prototipe fungsional sudah live di deschain-v2.vercel.app dengan notifikasi real-time, credit score dari riwayat transaksi nyata, dan registrasi vendor mandiri. Deschain selaras dengan Innovative Credit Scoring OJK 2025 dan target inklusi 90% Roadmap Keuangan Inklusif, menjadikan UMKM unbankable layak dibiayai formal.

---

## B. PROBLEM ALIGNMENT & REFINEMENT

### 3. Problem Validation — `[178/180]`

Indonesia memiliki **65,5 juta UMKM** yang menyumbang **61,9% PDB** dan menyerap **97% tenaga kerja** (OJK Institute, 2025), namun menghadapi dua hambatan struktural yang saling mengunci. Pertama, **lebih dari 75% UMKM** menyebut manajemen rantai pasok sebagai tantangan utama (Kadin, 2024): pembelian bahan baku dilakukan eceran, terfragmentasi, dan mahal karena tidak memiliki daya tawar kolektif. Kedua, **44 juta UMKM unbankable** (PIP Kemenkeu RI) karena tidak memiliki jejak transaksi terstruktur yang dapat dinilai lembaga keuangan; kesenjangan ini melebar, dengan kredit UMKM hanya tumbuh **1,82% YoY** dibanding kredit korporasi **13,52%** (Bank Indonesia, 2025). Keduanya berakar pada masalah yang sama: transaksi pengadaan UMKM tidak terdigitalisasi dan tidak teragregasi. Akibatnya UMKM membayar lebih mahal untuk bahan baku sekaligus tetap tak terlihat oleh sistem pembiayaan formal, menghambat produktivitas dan penciptaan lapangan kerja.

---

### 4. Problem-Solution Mapping — `[176/180]`

Deschain memetakan tiap akar masalah ke fitur dan outcome terukur:

1. **Pengadaan eceran mahal & terfragmentasi → AI Group Matching (dynamic programming):** mengelompokkan UMKM dengan kebutuhan barang, lokasi, dan timeline serupa menjadi satu order kolektif. *Outcome:* daya tawar naik, simulasi penghematan **8–25%**.
2. **Akses vendor terbatas → Smart Vendor Recommendation:** rekomendasi vendor terverifikasi berdasarkan performa pengiriman, harga, dan lokasi. *Outcome:* waktu pengadaan berkurang hingga 60%, akses vendor terverifikasi naik.
3. **UMKM unbankable → Credit Trail Digital otomatis:** setiap transaksi tercatat menjadi jejak kredit terstruktur yang dapat diekspor. *Outcome:* UMKM memiliki bukti kelayakan untuk Innovative Credit Scoring OJK.

Rantai logis ini menghubungkan langsung Problem Statement (produktivitas & lapangan kerja) dengan mekanisme solusi konkret, bukan klaim umum, sehingga tiap fitur dapat ditelusuri manfaatnya.

---

### 5. Ecosystem Alignment — `[149/150]`

Deschain memposisikan diri sebagai infrastruktur penghubung dalam ekosistem inklusi keuangan. **Stakeholder:** UMKM (pembeli kolektif), koperasi (kanal onboarding, 160.000 koperasi aktif), vendor/supplier (penerima order agregat), lembaga keuangan (pengguna credit trail), dan regulator. **Keselarasan regulasi:** mendukung **Innovative Credit Scoring** dan POJK Akses Pembiayaan UMKM (OJK, 2025) melalui data alternatif; berkontribusi pada target inklusi 90% **Roadmap Keuangan Inklusif OJK 2023–2027**; mendukung target 30 juta UMKM digital pada **Blueprint Sistem Pembayaran BI 2030**; serta patuh **UU PDP No. 27/2022**. Dengan menautkan transaksi pengadaan ke kelayakan kredit, Deschain menjadi jembatan antara aktivitas ekonomi riil UMKM dan sistem pembiayaan formal, memperkuat—bukan menggantikan—peran lembaga keuangan dan koperasi yang sudah ada.

---

## C. SOLUTION & IMPACT DEEP DIVE

### 6. Solution Approach & Mechanism — `[247/250]`

Deschain bekerja dalam tiga lapisan yang saling menguatkan.

**Lapisan 1 — AI Group Matching (dua tahap, berjalan di aplikasi live).** UMKM memasukkan kebutuhan (kategori, kuantitas, lokasi, timeline). Tahap pertama menghitung skor kesamaan empat dimensi—kategori produk (40%), kota (30%), budget (20%), urgensi (10%)—untuk menyaring kandidat relevan. Tahap kedua, algoritma **0/1 Knapsack dynamic programming** memilih komposisi grup yang memaksimalkan total penghematan kolektif (tabel DP + backtracking). Penghematan mengikuti model group purchasing: makin besar grup, makin besar diskon (8%→25%).

**Lapisan 2 — Vendor Recommendation & Batch Optimizer.** Setelah grup terbentuk, batch optimizer memilih vendor dan mengelompokkan pesanan dengan mempertimbangkan tier diskon berbasis volume dan window pengiriman, menekan total biaya pengadaan ke titik minimum. Modul forecasting terpisah (moving average, exponential smoothing, Holt-Winters, ARIMA, Prophet, LSTM dengan auto-select) plus lot-sizing (EOQ, Wagner-Whitin, Silver-Meal) memproyeksikan kebutuhan dan kuantitas order optimal.

**Lapisan 3 — AI Procurement Assistant & Credit Trail.** Asisten berbahasa Indonesia memandu UMKM menggunakan cascade model (TF-IDF → Groq Llama-3.1 → Claude Haiku → model fine-tuned → template fallback). Setiap transaksi yang selesai otomatis menghasilkan **credit trail** terstruktur—riwayat volume, ketepatan, dan nilai transaksi—yang dapat diekspor sebagai bukti kelayakan pembiayaan.

Ketiga lapisan menciptakan siklus: makin banyak UMKM bertransaksi, makin akurat matching dan makin kaya credit trail, memperkuat baik efisiensi biaya maupun akses pembiayaan secara bersamaan.

---

### 7. Impact Scale & Targets — `[224/230]`

Dampak Deschain diukur pada tiga dimensi—efisiensi, akses, dan inklusi—dengan target bertahap yang realistis terhadap kapasitas prototipe saat ini.

**Efisiensi biaya:** penghematan pengadaan **8–25%** (hasil simulasi internal, mengacu benchmark model group buying Pinduoduo yang terbukti hemat 30–50%, dcf.fm 2023) dan pemangkasan waktu pengadaan hingga 60%.

**Akses pasar:** peningkatan akses ke vendor terverifikasi sekitar 30% bagi UMKM yang sebelumnya bergantung pada satu-dua pemasok lokal.

**Inklusi keuangan:** setiap UMKM aktif menghasilkan credit trail yang dapat digunakan untuk pengajuan pembiayaan formal—menyasar langsung populasi **44 juta UMKM unbankable**.

**Target adopsi bertahap:** Fase MVP menargetkan 100 UMKM aktif di Pontianak dan sekitarnya; ekspansi regional 1.000 UMKM + 200 vendor terverifikasi dalam 12 bulan; target 3 tahun **50.000 UMKM aktif**. Penerima manfaat langsung adalah pemilik UMKM mikro-kecil di sektor kuliner, ritel, dan bahan pokok; penerima manfaat tidak langsung meliputi koperasi, vendor lokal, dan lembaga keuangan yang memperoleh basis debitur baru yang layak nilai.

---

### 8. Impact Measurement — `[264/270]`

Deschain mengukur dampak melalui KPI dengan baseline dan target eksplisit, agar kemajuan dapat diaudit, bukan diklaim.

| Dimensi | KPI | Baseline | Target 12 Bulan |
|---|---|---|---|
| Efisiensi | Rata-rata penghematan biaya pengadaan/order | 0% (beli eceran) | 8–25% (simulasi) |
| Efisiensi | Waktu siklus pengadaan | Manual, berhari-hari | –60% |
| Akses | Jumlah vendor terverifikasi diakses/UMKM | 1–2 pemasok | +30% |
| Adopsi | UMKM aktif bertransaksi | 0 → prototipe | 100 (MVP) → 1.000 |
| Inklusi | UMKM dengan credit trail dapat diekspor | 0 | 100% pengguna aktif |
| Retensi | UMKM transaksi berulang/bulan | — | ≥40% |

**Metode pengukuran:** penghematan dihitung dari selisih harga kolektif vs harga eceran per order dalam sistem; waktu siklus dicatat otomatis dari timestamp order; adopsi dan retensi ditarik dari database transaksi. **Catatan integritas data:** angka 8–25% berasal dari **model group purchasing** (step-function `_savings_rate` di kode: ≥3 anggota→15%, ≥5→20%, ≥10→25%, else 8%)—yakni estimasi model/simulasi, bukan data lapangan tervalidasi; akan dimutakhirkan dengan data transaksi riil begitu pilot berjalan. Validasi awal Tahap 2 (5 survei UMKM + 2 wawancara WhatsApp) menjadi baseline kebutuhan, dan slot hasil usability test disediakan untuk pemutakhiran. Pendekatan ini menjaga kredibilitas: Deschain melaporkan apa yang terukur, membedakan tegas antara proyeksi simulasi dan capaian nyata.

---

### 9. System & Public Value Proposition — `[196/200]`

Nilai publik Deschain melampaui efisiensi individual UMKM dan menyentuh tiga sasaran Problem Statement secara langsung.

**Produktivitas:** dengan menekan biaya dan waktu pengadaan, margin UMKM membaik dan modal kerja dapat dialihkan ke pertumbuhan, bukan tertahan di rantai pasok yang tidak efisien.

**Ketahanan pangan:** agregasi permintaan bahan pokok dan integrasi rujukan harga BAPANAS membantu UMKM sektor pangan memperoleh pasokan lebih stabil dan harga wajar, mengurangi kerentanan terhadap fluktuasi.

**Penciptaan lapangan kerja & inklusi:** credit trail digital membuka akses pembiayaan formal bagi 44 juta UMKM unbankable, memungkinkan mereka naik kelas dan menyerap tenaga kerja. Bagi ekosistem, Deschain menghasilkan data transaksi terstruktur yang dapat dimanfaatkan lembaga keuangan untuk Innovative Credit Scoring, memperluas basis debitur layak tanpa menaikkan risiko. Nilai sistemik inilah—mengubah aktivitas ekonomi riil menjadi infrastruktur inklusi keuangan—yang membedakan Deschain dari sekadar alat penghemat biaya, menjadikannya kontributor pada agenda inklusi nasional.

---

## D. INNOVATION & DIFFERENTIATION

### 10. Solution Originality — `[293/300]`

Orisinalitas Deschain terletak pada penggabungan tiga hal yang belum pernah disatukan pemain eksisting di pasar UMKM Indonesia: **agregasi permintaan aktif berbasis AI**, **lintas-sektor**, dan **credit trail by design**.

**Vs. marketplace B2B pasif (Indotrading, Ralali):** platform ini hanya mempertemukan penjual-pembeli secara pasif melalui pencarian; tidak ada agregasi permintaan, tidak ada AI matching, tidak ada jejak kredit. Deschain aktif mengelompokkan permintaan sehingga UMKM memperoleh harga kolektif tanpa harus mencari mitra sendiri.

**Vs. PaDi UMKM:** menempatkan UMKM sebagai penjual ke BUMN, bukan sebagai pembeli kolektif bahan baku—segmen kebutuhan yang berbeda.

**Vs. Poolapack:** group buying yang terbatas pada sektor tekstil dengan tiered pricing pasif, tanpa AI matching aktif dan tanpa credit trail. Deschain multi-sektor dan matching-nya dinamis.

**Vs. Mbiz:** fokus procurement korporasi/enterprise besar, bukan UMKM mikro-kecil.

Tiga diferensiator inti yang tidak dimiliki satu pun kompetitor: **(1) Active AI matching multi-sektor** menggunakan dynamic programming, bukan browsing pasif; **(2) Network effect**—makin banyak pengguna, makin akurat matching dan makin kaya data, menciptakan keunggulan yang menguat seiring skala; **(3) Credit trail by design** yang dirancang selaras dengan Innovative Credit Scoring OJK 2025, menjadikan tiap transaksi pengadaan sebagai aset finansial.

Kombinasi ini bukan fitur tambahan, melainkan arsitektur inti: Deschain menyelesaikan efisiensi pengadaan dan inklusi pembiayaan dalam satu alur, sebuah pendekatan yang belum ditawarkan pemain manapun di segmen ini.

---

### 11. Technological/Method Innovation — `[236/240]`

Inovasi metode Deschain berpusat pada penerapan teknik optimasi klasik yang tepat guna untuk masalah UMKM, bukan sekadar menempelkan label "AI".

**Dynamic Programming untuk komposisi grup (berjalan di produksi).** Deschain memformulasikan pemilihan anggota grup sebagai masalah optimasi dan menyelesaikannya dengan **0/1 Knapsack dynamic programming** langsung di backend live (`matching/router.py`): tabel DP menyimpan solusi sub-masalah dan backtracking merekonstruksi komposisi grup yang memaksimalkan total penghematan kolektif. Formulasi partisi DP lanjutan (`dp_group_procurement`, dengan parent pointer & backtracking) tervalidasi di notebook sebagai jalur optimasi berikutnya.

**Suite forecasting & lot-sizing.** Notebook `Forcasting_&_lot_sizing.ipynb` mengimplementasikan beragam model peramalan (moving average, exponential smoothing, Holt-Winters, ARIMA, Prophet, LSTM) dengan auto-selection, serta metode lot-sizing standar industri (EOQ, **Wagner-Whitin**, Silver-Meal) untuk kuantitas dan jadwal pemesanan berbiaya minimum—kedalaman operations research yang jarang tersedia bagi UMKM mikro.

**Cascade AI assistant** yang efisien biaya: TF-IDF untuk retrieval cepat, lalu Groq Llama-3.1-8b-instant, Claude Haiku, model fine-tuned (deschain-umkm-7b) sebagai fallback, dan template sebagai jaring pengaman. Hierarki ini menyeimbangkan kualitas jawaban, biaya, dan keandalan—memastikan asisten tetap berfungsi meski satu lapisan gagal.

---

### 12. Creativity in Implementation — `[243/250]`

Kreativitas Deschain tampak pada bagaimana keterbatasan sumber daya diubah menjadi keputusan desain yang cerdas dan berkelanjutan.

**Credit trail sebagai produk sampingan, bukan beban.** Alih-alih meminta UMKM mengisi data kredit secara terpisah (yang jarang mereka lakukan), Deschain menghasilkan jejak kredit secara otomatis sebagai byproduct dari transaksi yang memang mereka lakukan. Nilai inklusi keuangan tercipta tanpa friksi tambahan bagi pengguna.

**Cascade model yang hemat biaya.** Dengan menempatkan retrieval TF-IDF dan model ringan Groq di depan, sebagian besar kueri terjawab murah; model mahal hanya dipakai saat diperlukan. Ini membuat asisten AI layak secara ekonomi untuk melayani UMKM mikro dengan margin tipis.

**Onboarding via kanal yang sudah ada.** Alih-alih memaksa perubahan perilaku, Deschain memanfaatkan WhatsApp dan koperasi lokal sebagai jalur adopsi—infrastruktur sosial yang sudah dipercaya UMKM.

**Iterasi berbasis kejujuran.** Fitur dibangun bertahap mengikuti validasi nyata: credit score kini dihitung dari riwayat transaksi aktual (bukan data statis), forecast auto-kategori dari riwayat order, dan notifikasi real-time via SSE. Setiap peningkatan menggantikan placeholder dengan logika sungguhan, menjaga produk tetap defensibel saat ditinjau juri yang dapat memeriksa repositori GitHub.

---

## E. TECHNICAL VALIDATION

### 13. System Architecture — `[241/250]`

Arsitektur Deschain dirancang modular agar dapat diskalakan dan diaudit.

**Frontend:** React.js + Tailwind CSS, di-deploy di Vercel (live: deschain-v2.vercel.app), responsif untuk akses mobile UMKM.

**Backend:** Python + FastAPI menyediakan REST API dan endpoint Server-Sent Events (SSE) untuk notifikasi real-time dengan exponential backoff. Endpoint mencakup registrasi vendor mandiri, lifecycle grup dengan transisi status, dan pemicu notifikasi/email.

**Database:** PostgreSQL untuk data transaksi (sumber credit trail) dan Redis untuk caching guna menekan latensi.

**Lapisan AI/ML (berjalan di backend live):** similarity scoring 4-dimensi + **0/1 Knapsack DP** untuk komposisi grup, batch optimizer vendor berbasis tier diskon, dan cascade asisten (retrieval TF-IDF → Groq Llama-3.1 → Claude Haiku → fine-tuned `deschain-umkm-7b` via Ollama → template). Suite forecasting + lot-sizing (Wagner-Whitin, ARIMA, Prophet, LSTM) tervalidasi di notebook.

**Integrasi eksternal (roadmap):** BAPANAS (data harga komoditas), OSS Kementerian Investasi (verifikasi NIB), serta JNE/SiCepat (logistik). ⚠️ *Integrasi payment gateway (Midtrans/Xendit) masih di luar scope prototipe dan dinyatakan terbuka.*

**Notifikasi & komunikasi:** SSE real-time in-app dan email via SMTP (opt-in). Alur data: UMKM input kebutuhan → engine matching membentuk grup → rekomendasi vendor → transaksi → credit trail otomatis tercatat di PostgreSQL → dapat diekspor. Pemisahan lapisan yang jelas memudahkan penggantian komponen (mis. menaikkan engine matching) tanpa mengganggu keseluruhan sistem.

---

### 14. Data & Feasibility — `[197/200]`

**Sumber data.** Deschain mengandalkan tiga kategori data: (1) data transaksi internal yang dihasilkan pengguna—kebutuhan, order, dan penyelesaian—yang menjadi bahan bakar matching dan credit trail; (2) data referensi publik: harga komoditas BAPANAS dan verifikasi legalitas via OSS/NIB; (3) data vendor terverifikasi yang dikumpulkan melalui registrasi mandiri.

**Kelayakan teknis.** Prototipe sudah berjalan live dan membuktikan alur inti dapat dieksekusi: input kebutuhan, pembentukan grup, rekomendasi vendor, penyelesaian transaksi, dan pencatatan credit trail dari riwayat nyata. Algoritma inti telah divalidasi di notebook dan berjalan pada data ber-seed.

**Keterbatasan data yang diakui jujur.** Volume transaksi riil masih terbatas pada tahap prototipe; akurasi matching dan collaborative filtering akan meningkat seiring pertumbuhan data (network effect). Angka penghematan 8–25% berasal dari simulasi, bukan agregat lapangan. Strategi mitigasi cold-start: seeding vendor lokal terverifikasi dan onboarding UMKM berbasis komunitas/koperasi agar volume transaksi awal cukup untuk menghasilkan matching bermakna. Kelayakan diperkuat oleh fakta bahwa seluruh komponen menggunakan teknologi matang dan open-source yang terbukti.

---

### 15. Security & Compliance — `[195/200]`

Keamanan dan kepatuhan dirancang sejak awal, mengingat Deschain menangani data transaksi dan identitas UMKM.

**Keamanan data:** enkripsi AES-256 untuk data tersimpan, komunikasi TLS 1.3, serta autentikasi berbasis JWT dengan rencana MFA. Rate limiting telah diterapkan pada endpoint login dan register untuk mencegah penyalahgunaan—salah satu peningkatan konkret sejak Tahap 2.

**Verifikasi identitas:** rencana verifikasi berlapis via NIB (OSS) dan e-KTP untuk memastikan keaslian UMKM dan vendor, menekan risiko fraud dalam transaksi kolektif.

**Kepatuhan regulasi:** Deschain dirancang patuh **UU PDP No. 27/2022** melalui manajemen consent, minimisasi data, dan hak akses pengguna. Desain credit trail mengikuti prinsip Innovative Credit Scoring OJK sehingga data alternatif dapat dimanfaatkan lembaga keuangan secara sah.

**Batas yang diakui:** penetration testing berkala dan MFA penuh merupakan item roadmap, belum sepenuhnya diimplementasikan pada prototipe. Menyatakan batas ini secara terbuka lebih kuat daripada mengklaim kesiapan keamanan penuh, dan menunjukkan kesadaran tim terhadap tanggung jawab menangani data keuangan UMKM secara bertanggung jawab.

---

### 16. Implementation Readiness (MVP) — `[289/300]`

Deschain telah melewati tahap konsep: **prototipe fungsional live di deschain-v2.vercel.app** dengan repositori terbuka di GitHub (github.com/khalid200704/Deschain-app) yang dapat diperiksa juri.

**Sudah berfungsi (terverifikasi di prototipe):**
- Alur inti input kebutuhan → pembentukan grup → rekomendasi vendor → transaksi → credit trail.
- Notifikasi real-time via SSE dengan exponential backoff.
- Credit score dihitung dari riwayat transaksi nyata (menggantikan data seed statis).
- Forecast auto-kategorisasi dari riwayat order.
- Lifecycle grup dengan transisi status yang memicu notifikasi dan email.
- Registrasi vendor mandiri; email SMTP opt-in; rate limiting login/register.
- Group matching dua tahap: similarity 4-dimensi + **0/1 Knapsack DP** untuk komposisi grup — berjalan di backend live; batch optimizer vendor berbasis tier diskon volume.

**Roadmap MVP 6–12 bulan (prioritas):**
1. Integrasi partisi-DP lanjutan (`dp_group_procurement`) + suite forecasting/lot-sizing dari notebook ke aplikasi live.
2. Collaborative filtering vendor dengan data transaksi riil.
3. Usability testing dengan UMKM nyata untuk memvalidasi comprehension antarmuka.
4. Integrasi payment gateway (Midtrans/Xendit) — saat ini out of scope.
5. Ekspor credit trail terformat untuk pengajuan pembiayaan.
6. Pilot 100 UMKM aktif di Pontianak.

**Kesenjangan yang diakui jujur:** usability testing skala penuh dan integrasi pembayaran adalah dua gap terbesar menuju MVP (algoritma inti group matching + DP sudah berjalan di produksi). Untuk Innovation Level 3, pengujian pemahaman antarmuka dengan pengguna nyata pada data demo ber-seed sudah valid dan tidak memerlukan transaksi kolektif live multi-pihak. Kesiapan Deschain berada pada tingkat prototipe fungsional yang defensibel—cukup matang untuk didemonstrasikan, dengan jalur ke MVP yang jelas dan realistis.

---

## F. BUSINESS MODEL & SCALABILITY

### 17. Value Proposition — `[214/220]`

Deschain menawarkan nilai berbeda dan terukur bagi tiga segmen pengguna.

**Bagi UMKM (pembeli):** penghematan biaya bahan baku **8–25%** (simulasi) melalui pembelian kolektif, akses ke jaringan vendor terverifikasi yang lebih luas, waktu pengadaan lebih singkat, dan—yang paling strategis—**credit trail digital** yang membuka pintu pembiayaan formal. Bagi UMKM unbankable, ini mengubah aktivitas belanja rutin menjadi aset yang dapat dinilai bank.

**Bagi vendor/supplier:** akses ke permintaan yang teragregasi (order lebih besar, lebih efisien dilayani), visibilitas melalui rekomendasi berbasis performa, dan basis pelanggan UMKM yang loyal.

**Bagi lembaga keuangan & koperasi:** sumber data alternatif terstruktur untuk Innovative Credit Scoring, memperluas basis debitur layak nilai tanpa menaikkan biaya akuisisi risiko; koperasi memperoleh alat untuk memberdayakan anggotanya.

Inti proposisi nilai Deschain adalah menyelesaikan dua masalah dalam satu alur: efisiensi pengadaan *dan* inklusi pembiayaan. Kompetitor menyelesaikan paling banyak satu; Deschain menautkan keduanya sehingga nilai bagi setiap pihak saling memperkuat melalui network effect—makin ramai platform, makin besar penghematan dan makin kaya data kredit.

---

### 18. Model Revenue / Funding — `[198/200]`

Deschain merancang model pendapatan bertingkat yang selaras dengan kemampuan bayar UMKM dan baru diaktifkan setelah nilai terbukti—bukan monetisasi dini yang menghambat adopsi.

**Aliran pendapatan (desain forward-looking):**
1. **Subscription UMKM (freemium → berbayar):** akses dasar gratis untuk mendorong adopsi; fitur analitik lanjutan dan ekspor credit trail premium berbayar. Kisaran rencana Rp99K–999K/bulan sesuai tingkatan.
2. **Transaction fee 1–2,5%** dari nilai transaksi kolektif yang berhasil—pendapatan yang tumbuh seiring volume, selaras dengan keberhasilan pengguna.
3. **Vendor premium listing:** vendor membayar untuk visibilitas dan prioritas rekomendasi.
4. **Lisensi B2B/data-as-a-service:** ke depan, layanan analitik agregat (anonim, patuh PDP) bagi lembaga keuangan mitra.

**Catatan kejujuran:** seluruh aliran ini masih tahap desain, belum operasional. Prototipe saat ini berfokus membuktikan nilai, bukan menagih. Prioritas monetisasi awal adalah transaction fee dan subscription karena paling langsung terkait manfaat yang dirasakan UMKM. Struktur ini menjaga insentif tetap selaras: Deschain hanya tumbuh besar jika UMKM benar-benar berhemat dan bertransaksi lebih banyak.

---

### 19. Cost Structure & Sustainability — `[192/200]`

**Struktur biaya utama:** (1) infrastruktur cloud—hosting, database PostgreSQL, Redis, dan inferensi model AI; (2) pengembangan dan pemeliharaan produk; (3) akuisisi pengguna dan onboarding melalui koperasi/komunitas; (4) verifikasi vendor dan operasional dukungan.

**Efisiensi biaya berbasis desain.** Cascade AI (TF-IDF dan model ringan Groq di depan, model mahal hanya saat perlu) menekan biaya inferensi secara signifikan—krusial untuk melayani UMKM mikro dengan margin tipis. Penggunaan teknologi open-source dan matang menekan biaya lisensi. Onboarding via kanal sosial yang sudah ada (WhatsApp, koperasi) menekan CAC.

**Jalur keberlanjutan.** Dengan proyeksi CAC Rp120.000 dan LTV Rp3.200.000 (rasio LTV/CAC ~26,7:1) pada asumsi model matang, unit economics berpotensi sehat; break-even diproyeksikan pada sekitar 28.000 pengguna aktif. ⚠️ *Angka ini proyeksi berbasis asumsi, bukan realisasi—perlu dilabeli sebagai proyeksi saat presentasi.* Keberlanjutan bertumpu pada network effect: biaya marjinal per transaksi turun seiring skala, sementara nilai (penghematan + kualitas data kredit) naik, menciptakan model yang makin efisien saat bertumbuh.

---

### 20. Scalability — `[168/170]`

Skalabilitas Deschain didukung baik secara teknis maupun model bisnis.

**Teknis:** arsitektur modular berbasis FastAPI dengan PostgreSQL dan caching Redis dirancang untuk auto-scaling di cloud. Pemisahan lapisan (frontend, API, engine AI, database) memungkinkan tiap komponen diskalakan independen. Algoritma matching berbasis DP dapat dioptimasi dan diparalelkan seiring pertumbuhan volume.

**Model:** Deschain scalable secara horizontal antar-wilayah karena kebutuhan pengadaan kolektif UMKM bersifat universal di seluruh Indonesia. Ekspansi mengikuti pola klaster kota: mulai Pontianak, lalu Kalsel, Jateng, Sulsel. Setiap klaster baru memerlukan seeding vendor lokal, namun engine, algoritma, dan platform dapat dipakai ulang tanpa pengembangan ulang.

**Network effect sebagai mesin skala:** makin banyak UMKM dan vendor per wilayah, makin akurat matching dan makin kaya credit trail—keunggulan yang menguat, bukan melemah, seiring skala. Ini menjadikan pertumbuhan Deschain memperkuat dirinya sendiri.

---

### 21. Partnership & Distribution — `[167/170]`

**Strategi distribusi berbasis komunitas.** Alih-alih akuisisi berbiaya tinggi, Deschain menjangkau UMKM melalui kanal yang sudah dipercaya: **koperasi lokal** (160.000 koperasi aktif sebagai simpul onboarding) dan **WhatsApp** sebagai saluran komunikasi utama UMKM. Pendekatan ini menekan CAC sekaligus membangun kepercayaan lebih cepat.

**Kemitraan strategis (peta jalan):**
- **Koperasi & komunitas UMKM** — kanal onboarding dan edukasi.
- **Vendor/supplier lokal** — sisi pasokan, di-seed per wilayah ekspansi.
- **Lembaga keuangan** — pengguna credit trail untuk pembiayaan UMKM, sejalan Innovative Credit Scoring OJK.
- **Instansi & program pemerintah** — keselarasan dengan agenda inklusi BI/OJK.

⚠️ *Nyatakan status tiap kemitraan secara jujur (dijajaki vs. sudah terikat) — hindari melebih-lebihkan.* Distribusi berlapis ini—komunitas untuk sisi permintaan, seeding untuk sisi pasokan, lembaga keuangan untuk monetisasi nilai kredit—membuat pertumbuhan Deschain tidak bergantung pada belanja iklan besar, melainkan pada jaringan sosial dan kelembagaan yang sudah ada di ekosistem UMKM.

---

## G. MARKET VALIDATION

### 22. Problem-Market Fit — `[118/120]`

Kebutuhan yang disasar Deschain bersifat masif dan terbukti: **lebih dari 75% dari 65,5 juta UMKM** menyebut rantai pasok sebagai tantangan utama (Kadin, 2024), dan **44 juta UMKM unbankable** membutuhkan jalan menuju pembiayaan formal (PIP Kemenkeu). Kedua masalah ini nyata, besar, dan belum terselesaikan oleh pemain eksisting yang bersifat pasif. Deschain menautkan solusi langsung ke keduanya melalui pengadaan kolektif dan credit trail. Kesesuaian ini diperkuat validasi awal Tahap 2 (5 survei + 2 wawancara UMKM) yang mengonfirmasi keluhan biaya pengadaan tinggi dan kesulitan akses vendor. Segmen pasar jelas, masalah terverifikasi data resmi, dan solusi memetakan langsung ke kebutuhan—fondasi problem-market fit yang kuat.

---

### 23. Evidence of Demand — `[216/220]`

Bukti permintaan Deschain dibangun dari data resmi dan validasi lapangan awal, dengan pembedaan jujur antara keduanya.

**Bukti makro (data resmi):** 65,5 juta UMKM, lebih dari 75% kesulitan rantai pasok (Kadin, 2024), 44 juta unbankable (PIP Kemenkeu), dan kesenjangan kredit yang melebar (pertumbuhan kredit UMKM 1,82% vs korporasi 13,52%, BI 2025). Skala kebutuhan tidak diragukan.

**Validasi lapangan awal (Tahap 2):** 5 survei terstruktur UMKM dan 2 wawancara mendalam via WhatsApp dengan UMKM Pontianak mengonfirmasi tiga hal: pengadaan eceran dirasakan mahal, akses vendor terbatas, dan kepemilikan riwayat kredit dianggap berharga untuk pembiayaan. Ini adalah **validasi awal**, bukan riset pasar skala besar—dinyatakan apa adanya.

**Slot pemutakhiran:** usability testing dengan minimal 2 UMKM nyata pada prototipe live sedang disiapkan untuk mengukur pemahaman antarmuka dan minat penggunaan; hasilnya akan mengisi bukti demand berbasis interaksi produk nyata. ⚠️ *Masukkan hasil usability test di sini jika sudah tersedia sebelum submit.* Kombinasi bukti makro yang kuat dan validasi mikro yang jujur menunjukkan permintaan riil tanpa melebih-lebihkan capaian.

---

### 24. Target Market — `[147/150]`

**Target primer:** UMKM mikro dan kecil sektor kuliner, ritel/warung, dan bahan pokok yang rutin membeli bahan baku dalam volume kecil-menengah dan sensitif terhadap harga—kelompok yang paling diuntungkan pembelian kolektif. Fokus geografis awal: **Pontianak dan Kalimantan Barat**, tempat tim memiliki jaringan warm contact dan pemahaman konteks lokal, sebelum ekspansi ke Kalsel, Jateng, dan Sulsel.

**Target sekunder:** vendor/supplier lokal yang ingin mengakses permintaan teragregasi, serta koperasi sebagai mitra onboarding.

**Beachhead strategy:** memulai dari klaster kota terfokus memungkinkan kepadatan UMKM-vendor yang cukup untuk memicu matching bermakna dan network effect, alih-alih menyebar tipis secara nasional. Dari 65,5 juta UMKM nasional, target realistis 3 tahun adalah **50.000 UMKM aktif**—penetrasi yang konservatif namun bermakna, dibangun wilayah demi wilayah dengan pendekatan komunitas.

---

### 25. Adoption Readiness — `[176/180]`

Kesiapan adopsi Deschain bertumpu pada penurunan friksi dan pemanfaatan perilaku yang sudah ada.

**Faktor pendukung adopsi:** (1) antarmuka web responsif yang dapat diakses tanpa instalasi, live dan dapat dicoba; (2) onboarding via WhatsApp dan koperasi—kanal yang sudah akrab bagi UMKM; (3) credit trail dihasilkan otomatis tanpa beban input tambahan; (4) manfaat langsung terasa (penghematan biaya) yang mendorong penggunaan berulang.

**Hambatan yang diakui & mitigasi:** literasi digital yang bervariasi diatasi dengan asisten AI berbahasa Indonesia dan pendampingan koperasi; masalah cold-start (butuh massa kritis untuk matching) diatasi dengan seeding vendor dan onboarding berbasis komunitas per wilayah; kepercayaan dibangun melalui verifikasi NIB/e-KTP.

**Sinyal kesiapan:** validasi awal menunjukkan minat, dan prototipe sudah dapat digunakan. Usability testing yang sedang berjalan akan mengukur seberapa mudah UMKM nyata memahami dan mengadopsi antarmuka—langkah terakhir untuk mengonfirmasi kesiapan adopsi sebelum pilot skala penuh. Pendekatan bertahap ini menjaga adopsi tetap realistis dan terukur.

---

## H. PROGRESS UPDATE & ATTACHMENT

### 26. Progress Since 1st/2nd Submission — `[149/150]`

Sejak submission sebelumnya, Deschain berkembang dari konsep menjadi **prototipe fungsional live** dengan peningkatan konkret yang dapat diverifikasi di GitHub:

- **Algoritma:** group matching dua tahap—similarity 4-dimensi + **0/1 Knapsack DP**—berjalan di backend live; partisi-DP lanjutan + suite forecasting/lot-sizing (Wagner-Whitin, ARIMA, Prophet, LSTM, dll.) tervalidasi di notebook.
- **Notifikasi real-time** via SSE dengan exponential backoff.
- **Credit score** kini dihitung dari riwayat transaksi nyata, bukan data seed statis.
- **Forecast** auto-kategorisasi dari riwayat order.
- **Lifecycle grup** lengkap dengan transisi status yang memicu notifikasi dan email.
- **Registrasi vendor mandiri**, email SMTP opt-in, dan rate limiting login/register.

Fokus perbaikan menyasar dua kelemahan utama sebelumnya: bukti demand dan kedalaman teknis. Setiap peningkatan mengganti placeholder dengan logika sungguhan—menjaga produk tetap defensibel saat juri memeriksa repositori. Gap yang tersisa (usability test skala penuh, integrasi pembayaran) dinyatakan terbuka.

---

### 27. Current Status — `[49/50]`

Prototipe fungsional **live di deschain-v2.vercel.app**: group matching dua tahap (similarity + 0/1 Knapsack DP), batch optimizer vendor, dan credit trail dari transaksi nyata sudah berjalan di backend. Formulasi DP lanjutan & forecasting tervalidasi di notebook. Repositori terbuka; usability test & integrasi pembayaran langkah berikutnya.

---

### Attachment (link — lampirkan di portal)

- **Live prototype:** https://deschain-v2.vercel.app
- **GitHub POC:** https://github.com/khalid200704/Deschain-app
- **Algoritma notebooks:** `Grub_Pengadaan.ipynb` (DP group matching), `Forcasting_&_lot_sizing.ipynb` (Wagner-Whitin)
- **Video pitch:** ⚠️ *(tautkan setelah upload)*
- **Hasil validasi/usability test:** ⚠️ *(lampirkan jika sudah ada)*

---

## ⚠️ CATATAN VERIFIKASI SEBELUM SUBMIT (baca cepat)

1. **Nama tim** — "Geprek Zago" (catatan proyek) vs "Deschain" (materi awal). Pastikan sesuai pendaftaran resmi S0206.
2. **Angka hemat** — dokumen ini konsisten pakai **8–25% (hasil simulasi)**. Pastikan materi lain (deck, video) juga 8–25%, jangan campur dengan 15–25%.
3. **Status DP** — sudah dikoreksi sesuai kode: **0/1 Knapsack DP berjalan di backend live** (`matching/router.py`); partisi-DP lanjutan di notebook. Ini akurat & bisa diverifikasi juri.
4. **⚠️ FIX GITHUB:** headline `README.md` masih tertulis "Hemat 15–25%" padahal body README & kode = **8–25%**. Samakan headline jadi 8–25% sebelum submit agar konsisten saat juri buka repo.
5. **Payment gateway** — dinyatakan out of scope secara jujur. Pertahankan.
6. **Angka LTV/CAC & break-even** — labeli sebagai proyeksi, bukan realisasi.
7. **Batas kata** — semua section sudah di bawah maksimal. Cek ulang jika portal menghitung berbeda (mis. termasuk heading).
