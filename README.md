# Deschain — Platform Pengadaan Kolektif AI untuk UMKM Indonesia

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Hackathon](https://img.shields.io/badge/PIDI--DIGDAYA_X-2026-gold)

**Semifinalis BI-OJK Hackathon 2025 · Innovation Frontier 1 · Peserta PIDI-DIGDAYA X 2026**

> Hemat 15–25% biaya pengadaan UMKM melalui group buying bertenaga AI.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **UMKM (Utama)** | `demo@deschain.id` | `Demo1234!` |
| **Vendor** | `vendor@deschain.id` | `Demo1234!` |
| UMKM Warung Bu Siti | `siti.warung@gmail.com` | `Demo1234!` |
| UMKM Toko Berkah Jaya | `berkah.toko@gmail.com` | `Demo1234!` |
| UMKM Koperasi Nelayan | `koperasi.nelayan@gmail.com` | `Demo1234!` |

> Seed data tersedia di `backend/seed.py` — jalankan `python seed.py` setelah database siap.

---

## 🎯 Quick Links

- **[Getting Started Guide](GETTING_STARTED.md)** - Start here!
- **[System Architecture](docs/ARCHITECTURE.md)** - Technical design
- **[Database Schema](docs/DATABASE_SCHEMA.md)** - Data model
- **[API Documentation](docs/API_DESIGN.md)** - REST endpoints
- **[AI Matching Algorithm](docs/AI_MATCHING.md)** - Matching logic
- **[MVP Roadmap](docs/MVP_ROADMAP.md)** - Project timeline
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production setup
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute

## 📊 Overview

Deschain solves a critical problem for Indonesian UMKM:
- **Problem**: Fragmented purchasing, high material costs, poor transaction records
- **Solution**: Platform to combine orders, negotiate better prices, build credit history
- **Impact**: Lower costs + operational efficiency + financing access

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend API** | FastAPI + Python 3.11 |
| **Frontend UI** | React 18 + Vite + Tailwind CSS |
| **Database** | PostgreSQL 14+ |
| **Authentication** | JWT + Bcrypt |
| **State Management** | Zustand |
| **Validation** | Pydantic V2 |
| **Payment** | Midtrans *(planned Phase 2)* |
| **Notifications** | WhatsApp, Email *(planned Phase 2)* |
| **Containers** | Docker + Docker Compose |

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose

### Development Setup

```bash
# Clone and setup
git clone https://github.com/yourusername/deschain.git
cd deschain

# Start full stack
docker-compose up -d

# Access
- Backend API: http://localhost:8000
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs
- Database: localhost:5432
```

### Manual Setup

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📈 Key Features

### MVP (Phase 1)
- ✅ User authentication (UMKM, Vendor, Admin)
- ✅ UMKM profiles and verification
- ✅ Procurement request management
- ✅ Vendor catalog and search
- ✅ Procurement group formation
- ✅ Supplier quote system
- ✅ Payment processing (Midtrans — planned Phase 2)
- ✅ Transaction tracking
- ✅ Credit trail analytics
- ✅ Dashboard with metrics
- ✅ Mobile-responsive design
- ✅ AI group matching (similarity scoring: kategori, lokasi, budget, urgency)
- ✅ AI consultation chatbot (RAG: TF-IDF retrieval + Claude Haiku / Groq)

### Future Features
- 🔮 Advanced recommendation engine
- 🔮 WhatsApp integration
- 🔮 Credit scoring for financing
- 🔮 BPS/Kemenkop data integration
- 🔮 Mobile app (React Native)
- 🔮 Multi-language support

## 📁 Project Structure

```
deschain/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── domains/      # Auth, UMKM, Vendor, Procurement, etc.
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── main.py       # Entry point
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── stores/       # Zustand stores
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DESIGN.md
│   └── ...
└── docker-compose.yml    # Full stack orchestration
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token

### UMKM (Buyer)
- `POST /umkm` - Create profile
- `GET /umkm/me` - Get my profile
- `PUT /umkm/me` - Update profile

### Procurement
- `POST /procurement/request` - Create request
- `GET /procurement/requests` - List requests
- `POST /procurement/group` - Create group
- `POST /procurement/group/{id}/members` - Add member

### Vendors
- `GET /vendor/list` - List vendors
- `GET /vendor/{id}` - Vendor details
- `GET /vendor/search` - Search vendors

### Matching
- `POST /matching/groups/match` - Cari grup dengan kebutuhan serupa
- `POST /matching/groups/join` - Bergabung ke grup pengadaan
- `POST /matching/batch-optimize` - Optimasi batch ke vendor

### Analytics
- `GET /analytics/dashboard` - Dashboard KPI metrics
- `GET /analytics/credit-trail` - Riwayat transaksi (credit trail)
- `GET /analytics/credit-trail/export` - Export JSON untuk KUR/ICS POJK 29/2024
- `GET /analytics/forecast` - Prediksi demand + rekomendasi lot sizing

### Consultation
- `POST /consultation/ask` - Tanya AI konsultan UMKM (RAG)
- `GET /consultation/topics` - Daftar topik yang tersedia

### Notification
- `GET /notification/list` - Daftar notifikasi
- `PUT /notification/{id}/read` - Tandai dibaca
- `PUT /notification/read-all` - Tandai semua dibaca

Full documentation: [API_DESIGN.md](docs/API_DESIGN.md)

## 🤖 Core Intelligence

Deschain menggunakan tiga lapis algoritma optimasi yang bekerja secara berlapis untuk memberikan hasil terbaik bagi setiap pengguna.

### 1. AI Group Matching
Mencocokkan permintaan pengadaan UMKM berdasarkan empat dimensi kesamaan:
- Kategori produk (bobot 40%)
- Kota pengiriman (30%)
- Kesesuaian budget (20%)
- Urgensi pengiriman (10%)

Hasil: rekomendasi grup dengan estimasi penghematan per anggota.

### 2. Optimal Group Composition
Setelah kandidat diidentifikasi, sistem menentukan komposisi grup yang memaksimalkan total penghematan kolektif — mempertimbangkan ukuran grup dan skala volume pembelian.

Hasil: penghematan meningkat seiring pertumbuhan anggota (8% → 25% pada skala tertentu).

### 3. Batch Procurement Optimizer
Mengoptimalkan pengelompokan batch pesanan ke vendor dengan mempertimbangkan discount tier berdasarkan volume dan window waktu pengiriman.

Hasil: total biaya pengadaan kolektif yang minimum dengan pemilihan vendor otomatis.

### 4. Demand Forecasting & Lot Sizing
Memprediksi kebutuhan pengadaan ke depan berdasarkan histori transaksi, dan menghitung ukuran order optimal yang meminimalkan total biaya pemesanan + penyimpanan.

Hasil: jadwal reorder dan kuantitas order yang direkomendasikan per UMKM.

---

Details: [AI_MATCHING.md](docs/AI_MATCHING.md)

## 🧠 AI Consultation (RAG + Fine-tuned Model)

Fitur konsultasi menggunakan Retrieval-Augmented Generation (RAG) dengan fallback berlapis:

1. **Retrieval**: TF-IDF + cosine similarity mengambil top-3 chunk relevan
   dari knowledge base 7 topik (pengadaan, KUR, OJK/BI, pemasaran, keuangan)
2. **Generation Layer 1**: Groq llama-3.1-8b-instant (gratis, latensi rendah)
3. **Generation Layer 2**: Claude Haiku (fallback jika Groq tidak tersedia)
4. **Generation Layer 3**: Fine-tuned Mistral-7B via Ollama (offline-capable)
5. **Generation Layer 4**: Template-based (fallback tanpa API key)

**Fine-tuned Model**: [`joezy99/deschain-umkm-7b`](https://huggingface.co/joezy99/deschain-umkm-7b)
- Base: Mistral-7B-Instruct-v0.3
- Metode: QLoRA (4-bit, LoRA r=16)
- Dilatih khusus untuk konteks regulasi BI/OJK, KUR 2026, supply chain UMKM Indonesia
- Training: NVIDIA T4 GPU via Google Colab

**Knowledge base**: 100+ data points regulasi OJK/BI terkini (2024–2026),
termasuk POJK No. 29/2024 (ICS) dan POJK No. 11/2024 (SLIK fintech)

Relevansi ke tema hackathon: credit trail Deschain berpotensi menjadi
**data alternatif untuk ICS (Innovative Credit Scoring)** sesuai POJK No. 29/2024.

## 💾 Database

PostgreSQL with 14 main entities:
- Users, UMKMs, Vendors
- ProcurementRequests, ProcurementGroups
- GroupMemberships, SupplierQuotes
- Transactions, Payments
- CreditTrail, Notifications
- Analytics, VendorRatings

Schema: [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

## 🎨 UI/UX Design

### Color Palette
- **Navy** (#0F172A): Trust, primary actions
- **Gold** (#F59E0B): Premium, highlights
- **Ice** (#F0F9FF): Clean backgrounds

### Key Pages
- Dashboard: Overview and metrics
- Procurement: Create and manage requests
- Groups: View and join groups
- Vendors: Browse and compare suppliers
- Profile: User and business settings
- Transactions: Order and payment history

## 📊 Dashboard Features

- **Key Metrics**: Total procurement value, savings, transactions
- **Credit Score**: Business reliability rating
- **Savings Tracker**: Visualize cost reductions
- **Active Groups**: Current procurement groups
- **Recent Transactions**: Order history
- **Analytics**: Performance trends

## 🔐 Security

- JWT authentication with refresh tokens
- Password hashing with Bcrypt
- Role-based access control (RBAC)
- SQL injection prevention (ORM)
- HTTPS/TLS in production
- CORS properly configured
- Rate limiting enabled
- Input validation with Pydantic

## 🚢 Deployment

### Docker Compose (Development/Staging)
```bash
docker-compose up -d
```

### Production Options
- **Kubernetes**: Scalable container orchestration
- **Cloud Platforms**: Heroku, Railway, Google Cloud, AWS
- **VPS**: DigitalOcean, Linode, AWS EC2

Setup guide: [DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 📈 Success Metrics

- **User Adoption**: 100+ UMKMs registered
- **Transaction Volume**: 50+ procurement groups formed
- **Cost Savings**: Average 10-15% reduction
- **Reliability**: 99% uptime, <500ms API response
- **Satisfaction**: User rating > 4/5 stars

## 🧪 Testing

**Backend**:
```bash
cd backend
pytest tests/ -v --cov
```

**Frontend**:
```bash
cd frontend
npm run test
npm run lint
```

## 📚 Documentation

- **[Getting Started](GETTING_STARTED.md)** - Quick setup guide
- **[Architecture](docs/ARCHITECTURE.md)** - System design
- **[Database](docs/DATABASE_SCHEMA.md)** - Data model
- **[API](docs/API_DESIGN.md)** - REST endpoints
- **[AI Matching](docs/AI_MATCHING.md)** - Algorithm details
- **[Roadmap](docs/MVP_ROADMAP.md)** - Feature timeline
- **[Deployment](docs/DEPLOYMENT.md)** - Production guide
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines

## 🤝 Contributing

We welcome contributions! Please:
1. Read [CONTRIBUTING.md](docs/CONTRIBUTING.md)
2. Fork the repository
3. Create feature branch
4. Submit pull request

## 📝 License

MIT License - See [LICENSE](LICENSE) file

## 👥 Team

Built with ❤️ for Indonesian UMKM

**Contributors**:
- Backend Developer(s)
- Frontend Developer(s)
- DevOps Engineer(s)
- Project Manager(s)

## 📧 Contact & Support

- **Issues**: Open GitHub issues for bugs
- **Questions**: Start GitHub discussions
- **Email**: support@deschain.id (future)
- **WhatsApp**: Coming soon

---

## 🚀 Project Status

| Phase | Status | Timeline |
|-------|--------|----------|
| **Phase 0: Foundation** | ✅ Complete | Weeks 1-2 |
| **Phase 1: MVP Core** | 🔨 In Progress | Weeks 3-6 |
| **Phase 2: AI Features** | 🔨 In Progress | Weeks 7-10 |
| **Phase 3: Polish** | 📋 Planned | Weeks 11-12 |
| **Phase 4: Deploy** | 📋 Planned | Weeks 13+ |

**Current**: Building core MVP  
**Next**: Authentication and UMKM onboarding  
**Target Launch**: July 2026

---

## 👥 Tim

| Nama | Peran | Kontak |
|------|-------|--------|
| **Abdullah Khalid Fadillah** | Fullstack Developer | h1051221107@student.untan.ac.id |
| **Duta Satria Nugroho** | Backend & AI Engineer | h1051221074@student.untan.ac.id |

**Institusi**: Universitas Tanjungpura (UNTAN), Pontianak, Kalimantan Barat
**Program Studi**: Informatika, Fakultas MIPA  
**Hackathon**: PIDI-DIGDAYA X 2026 — BI, OJK, AFTECH, ASPI, APUVINDO, LPPI  
**Deadline**: 4 Juni 2026

---

**Version**: 0.2.0 — MVP Sprint  
**Last Updated**: 28 Mei 2026  
**Status**: 🟢 Active Development

*Deschain — Kekuatan kolektif untuk UMKM Indonesia.*
