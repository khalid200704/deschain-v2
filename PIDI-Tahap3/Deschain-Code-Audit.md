# AUDIT KODE DESCHAIN — LENGKAP
### Backend FastAPI · Frontend React · Algoritma · Keamanan · Test · Konfigurasi
Berbasis pemeriksaan langsung repo `Deschain-app` (bukan asumsi).

---

## NILAI KESELURUHAN: **B (Baik untuk tahap prototipe/MVP)**

Kode ini **jauh di atas rata-rata proyek hackathon**: terstruktur domain-driven, keamanan dasar benar, algoritma inti nyata. Kelemahan utamanya normal untuk tahap prototipe: **test tipis, beberapa hardening produksi belum ada, dan reproduktibilitas skema DB**. Tak ada temuan yang memalukan bila juri membuka repo — asalkan beberapa hal di bawah dirapikan.

### Kartu nilai per kategori

| Kategori | Nilai | Ringkasan |
|---|---|---|
| Arsitektur & struktur | **A−** | Domain-driven rapi (auth, matching, vendor, transaction, notification, consultation, analytics, admin). |
| Keamanan | **B** | Dasar benar (bcrypt, JWT ter-pin algoritma, rate limit, TrustedHost). Ada beberapa lubang hardening. |
| Algoritma/kebenaran | **B+** | DP & cascade AI nyata dan berjalan. Kurang: uji unit & beberapa asumsi hardcoded. |
| **Testing** | **D+** | **Kelemahan terbesar.** Total ~85 baris; `test_matching.py` hanya 7 baris — IP inti nyaris tak diuji. |
| Kualitas kode | **B** | Bersih, tanpa TODO/secret; tapi 9 `except Exception` beberapa menelan diam-diam. |
| Docs & reproduktibilitas | **B−** | README bagus, tapi **tak ada file migrasi Alembic** & angka README tidak konsisten. |
| Frontend | **B** | Env-driven, tanpa secret hardcoded; token di localStorage (risiko XSS). |

---

## 🔴 PRIORITAS TINGGI (perbaiki sebelum submit / sebelum juri buka repo)

**1. `SECRET_KEY` default tanpa penjaga startup** — `backend/app/config.py:23`
`SECRET_KEY = "your-secret-key-change-in-production"`. Jika di-deploy tanpa env, **token JWT bisa dipalsukan siapa pun**.
→ *Fix:* tolak boot bila `ENVIRONMENT != "development"` dan SECRET_KEY masih default. Contoh di `main.py` lifespan/startup:
```python
if settings.ENVIRONMENT != "development" and settings.SECRET_KEY == "your-secret-key-change-in-production":
    raise RuntimeError("SECRET_KEY wajib di-set di production")
```
Pastikan env var SECRET_KEY (acak kuat) sudah di-set di hosting.

**2. Uji unit algoritma inti (IP utama) hampir kosong** — `backend/tests/test_matching.py` (7 baris)
DP group matching + `_savings_rate` + `_compute_similarity` adalah nilai jual Deschain, tapi nyaris tak ada test.
→ *Fix:* tambah test kasus batas: kandidat kosong, 1 anggota, grup ≥10 (rate 25%), bobot similarity (kategori 40/kota 30/budget 20/urgensi 10), dan backtracking DP memilih subset benar. Ini **langsung menaikkan skor "Algorithm Quality"** dan kredibilitas teknis.

**3. Tidak ada file migrasi Alembic** — `backend/alembic/versions/` kosong
README menyuruh `alembic upgrade head`, tapi tak ada versi migrasi → skema tak tervervsi/tak reprodusibel.
→ *Fix:* generate migrasi awal (`alembic revision --autogenerate -m "init"`) **atau** dokumentasikan bahwa skema dibuat via `Base.metadata.create_all` + `seed.py`.

**4. Angka tidak konsisten di repo (juri pasti lihat)** — `README.md` & `frontend/index.html`
Headline README & meta `og:title` masih **"Hemat 15–25%"**, padahal body README + kode = **8–25%**.
→ *Fix:* samakan semua ke **8–25%** (README headline, index.html meta og:title/description).

---

## 🟠 PRIORITAS MENENGAH (hardening produksi)

**5. Token di `localStorage` (frontend)** — `frontend/src/api/client.js:14,71` dll.
`accessToken` & `refreshToken` di localStorage → rentan dicuri lewat XSS.
→ *Fix (arah):* simpan refresh token di cookie `httpOnly`; atau minimal terapkan Content-Security-Policy ketat + sanitasi input. Untuk sekarang, **akui sebagai known-limitation** di proposal (Security & Compliance).

**6. Swagger `/docs` & `/openapi.json` terbuka tanpa syarat** — `backend/app/main.py:35-36`
Membuka seluruh peta API ke publik di production (info disclosure).
→ *Fix:* `docs_url = None if settings.ENVIRONMENT=="production" else "/docs"` (idem openapi_url).

**7. `except Exception:` menelan error diam-diam (9 tempat)** — admin, consultation, matching, notification, vendor
Beberapa blok menangkap semua error tanpa logging → sulit debug & bisa menyembunyikan bug.
→ *Fix:* log dengan `structlog` sebelum menangani; tangkap tipe error spesifik bila memungkinkan; jangan `pass` diam.

**8. `TrustedHostMiddleware` terlalu longgar** — `main.py:56`
`*.vercel.app`, `*.hf.space`, `*.huggingface.co` menerima Host header dari subdomain apa pun.
→ *Fix:* persempit ke host spesifik milik Anda (mis. `deschain-v2.vercel.app`).

**9. Konfigurasi token ganda/membingungkan** — `config.py`
Ada `ACCESS_TOKEN_EXPIRE_MINUTES=15` **dan** `JWT_EXPIRATION_HOURS=24`, `ALGORITHM` **dan** `JWT_ALGORITHM`. Yang dipakai hanya `ACCESS_TOKEN_EXPIRE_MINUTES` & `ALGORITHM`; sisanya dead-config berpotensi salah pakai.
→ *Fix:* hapus yang tak terpakai, sisakan satu sumber kebenaran.

**10. `_savings_rate` step-function hardcoded** — `matching/router.py`
Angka 8/15/20/25% ditanam di kode. Benar sebagai model, tapi harus jelas ini **asumsi simulasi**.
→ *Fix:* pindah ke config + komentar `# ASUMSI SIMULASI (GPO), bukan data lapangan`. Konsisten dengan pelabelan 8–25% di proposal/video.

---

## 🟡 PRIORITAS RENDAH (rapikan bila sempat)

11. **Dependensi sebagian `>=`** (numpy, scikit-learn, anthropic, groq, pydantic) — pin versi untuk reproduktibilitas build.
12. **passlib 1.7.4 + bcrypt 4.x** — kombinasi ini memicu warning kompatibilitas; pin `bcrypt<4.1` atau update passlib.
13. **CORS `methods`/`headers` = `*`** dengan credentials — aman karena origins eksplisit, tapi bisa dipersempit.
14. **Rate limiting** sudah ada di login/register — perluas ke endpoint sensitif lain (mis. pembentukan grup, konsultasi) untuk cegah abuse.
15. **`reload=settings.DEBUG`** di `uvicorn.run` — pastikan DEBUG=False di production (default sudah False ✔).

---

## ✅ YANG SUDAH BENAR (kekuatan — sebutkan ke juri)

- **Struktur domain-driven** bersih & mudah dinavigasi — jarang pada proyek hackathon.
- **JWT aman:** `jwt.decode(..., algorithms=[ALGORITHM])` mencegah *algorithm confusion*; menangani `ExpiredSignatureError` & `InvalidTokenError`.
- **Password:** bcrypt via passlib (bukan plaintext/hash lemah).
- **Anti user-enumeration** di login: pesan generik "Email atau password salah."
- **Rate limiting** aktif (slowapi) di endpoint auth.
- **Algoritma nyata di produksi:** similarity 4-dimensi + 0/1 Knapsack DP + batch optimizer; cascade AI dengan fallback berlapis (tak crash saat API key kosong).
- **Konfigurasi via environment** (pydantic-settings); **`.gitignore` menutup `.env`, `*.db`, `venv`, `node_modules`** — tak ada secret ter-commit.
- **Structured logging** (structlog), **CORS + TrustedHost** middleware terpasang.
- **Requirements** mayoritas ter-pin.

---

## RINGKAS: 4 PERBAIKAN CEPAT SEBELUM SUBMIT (dampak/effort terbaik)
1. **Samakan angka 15–25% → 8–25%** di README + index.html meta (5 menit, tapi paling terlihat juri).
2. **Penjaga `SECRET_KEY`** di startup (10 menit, tutup lubang keamanan paling serius).
3. **Tambah 5–8 unit test algoritma** di `test_matching.py` (naikkan skor "Algorithm Quality").
4. **Gate `/docs` & persempit TrustedHost** untuk production (hardening cepat).

Selebihnya jujur nyatakan sebagai *known limitations* di Field 7 (Current Technical Reality) & Field 15 Security proposal — panel BI/OJK menghargai keterbukaan, dan audit ini menunjukkan Anda paham sistem sendiri.

---
*Catatan: audit ini berbasis pembacaan statis kode. Tidak dijalankan penetration test dinamis. Untuk produksi berskala, tambahkan CI (lint+test), dependency scanning, dan pen-test berkala.*
