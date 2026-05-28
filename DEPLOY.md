# Panduan Deploy Deschain

## Frontend → Vercel

1. **Push ke GitHub** (jika belum):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/deschain.git
   git push -u origin main
   ```

2. **Deploy di Vercel:**
   - Login ke [vercel.com](https://vercel.com) → "New Project"
   - Import repository GitHub
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-backend.up.railway.app/api/v1
     ```
   - Klik Deploy

3. `vercel.json` sudah ada di `frontend/` — SPA routing + security headers otomatis aktif.

---

## Backend → Railway

1. **Login ke [railway.app](https://railway.app)** → "New Project" → "Deploy from GitHub"

2. **Tambah services:**
   - Service 1: Backend (pilih folder `backend`)
   - Service 2: Add "PostgreSQL" plugin

3. **Environment Variables backend** (Settings → Variables):
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SECRET_KEY=ganti-dengan-random-256-karakter
   ENVIRONMENT=production
   DEBUG=false
   CORS_ORIGINS=["https://your-app.vercel.app"]
   ```

4. `railway.toml` dan `Procfile` sudah ada di `backend/`.

5. **Seed data** setelah deploy:
   ```bash
   railway run python seed.py
   ```

---

## Setelah Deploy

Update `VITE_API_URL` di Vercel dengan URL Railway yang baru, lalu redeploy frontend.

### URL Demo
- Frontend: `https://deschain.vercel.app`
- Backend API: `https://deschain-backend.up.railway.app`
- API Docs: `https://deschain-backend.up.railway.app/docs`

---

## Security Checklist
- [x] Security headers (X-Frame-Options, CSP, etc.) via middleware
- [x] Rate limiting via slowapi
- [x] JWT auth + bcrypt password hashing
- [x] CORS dikonfigurasi untuk domain production
- [x] HTTPS via Vercel/Railway (otomatis)
- [x] UU PDP No. 27/2022 compliance page
- [x] `npm audit`: 2 moderate (dev-only, esbuild in vite dev server, tidak mempengaruhi production)

---

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| UMKM | `demo@deschain.id` | `Demo1234!` |
| Vendor | `vendor@deschain.id` | `Demo1234!` |
