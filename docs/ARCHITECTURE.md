# Deschain System Architecture

## 1. High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                    │
│  ┌────────────────────┬─────────────────────┬──────────────────────┐     │
│  │  React SPA         │  Mobile Responsive  │  Zustand State Mgmt  │     │
│  │  (Vite)            │  Tailwind CSS       │  Real-time Updates   │     │
│  └────────────────────┴─────────────────────┴──────────────────────┘     │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │ REST API (JSON)
                               │ Axios HTTP Client
┌──────────────────────────────▼───────────────────────────────────────────┐
│                       API LAYER (FastAPI)                                 │
│  ┌────────────────────┬────────────────────┬──────────────────────┐      │
│  │  Auth Routes       │  UMKM Routes       │  Procurement Routes  │      │
│  │  /auth/*           │  /umkm/*           │  /procurement/*      │      │
│  │                    │                    │                      │      │
│  │  Vendor Routes     │  Matching Routes   │  Payment Routes      │      │
│  │  /vendor/*         │  /matching/*       │  /payment/*          │      │
│  │                    │                    │                      │      │
│  │  Analytics Routes  │  Notification Rts. │                      │      │
│  │  /analytics/*      │  /notify/*         │                      │      │
│  └────────────────────┴────────────────────┴──────────────────────┘      │
│                                                                            │
│  ┌───────────────┐ ┌─────────────────┐ ┌──────────────────┐             │
│  │ JWT Auth      │ │ Pydantic        │ │ Request Logging  │             │
│  │ Middleware    │ │ Validation      │ │ Error Handling   │             │
│  └───────────────┘ └─────────────────┘ └──────────────────┘             │
└──────────────┬───────────────────────────────────────────────────────────┘
               │
    ┌──────────┴──────────┬──────────────────┬───────────────┐
    │                     │                  │               │
    ▼                     ▼                  ▼               ▼
┌────────────┐      ┌──────────────┐  ┌────────────┐  ┌──────────────┐
│ Business   │      │ External API │  │ Message    │  │ File Storage │
│ Logic      │      │ Integration  │  │ Queue      │  │ (Optional)   │
│ Services   │      │ (Midtrans,   │  │ (Redis)    │  │              │
│            │      │ WhatsApp)    │  │            │  │              │
└────────────┘      └──────────────┘  └────────────┘  └──────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────┐
│              DATA ACCESS LAYER                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  SQLAlchemy ORM + Repositories                       │ │
│  │  - User Repository                                   │ │
│  │  - UMKM Repository                                   │ │
│  │  - Vendor Repository                                │ │
│  │  - Procurement Repository                           │ │
│  │  - Transaction Repository                           │ │
│  └──────────────────────────────────────────────────────┘ │
└───────────────┬──────────────────────────────────────────┘
                │
                ▼
        ┌─────────────────┐
        │  PostgreSQL     │
        │  Database       │
        │  (14+)          │
        └─────────────────┘
```

## 2. Domain-Driven Design Structure

### Authentication Domain
```
auth/
├── models.py           # User, Role entities
├── schemas.py          # LoginSchema, TokenSchema, etc.
├── router.py           # /auth/* endpoints
├── service.py          # Authentication logic
├── repository.py       # User CRUD operations
└── dependencies.py     # Security dependencies
```

**Responsibilities**:
- User registration and login
- JWT token generation and validation
- Password hashing and verification
- Role-based access control

### UMKM Domain
```
umkm/
├── models.py           # UMKM, UMKMProfile entities
├── schemas.py          # UMKMSchema, ProfileSchema
├── router.py           # /umkm/* endpoints
├── service.py          # UMKM business logic
├── repository.py       # UMKM data access
└── onboarding.py       # Onboarding workflow
```

**Responsibilities**:
- UMKM profile management
- Onboarding process
- Business metrics tracking
- Credit score calculation

### Vendor Domain
```
vendor/
├── models.py           # Vendor, VendorCategory entities
├── schemas.py          # VendorSchema, etc.
├── router.py           # /vendor/* endpoints
├── service.py          # Vendor management logic
├── repository.py       # Vendor data access
└── rating_service.py   # Rating and review logic
```

**Responsibilities**:
- Vendor catalog management
- Rating and review system
- Capacity and availability tracking
- Performance analytics

### Procurement Domain
```
procurement/
├── models.py           # Request, Group, Quote entities
├── schemas.py          # ProcurementSchema, etc.
├── router.py           # /procurement/* endpoints
├── service.py          # Procurement orchestration
├── repository.py       # Procurement data access
└── workflow.py         # State transitions
```

**Responsibilities**:
- Procurement request creation
- Group formation and management
- Quote collection
- Order execution
- Group state management

### Matching Service (AI)
```
matching/
├── models.py           # Match, Recommendation entities
├── schemas.py          # MatchSchema, etc.
├── router.py           # /matching/* endpoints
├── service.py          # Matching algorithm
├── repository.py       # Match data access
├── algorithms/
│   ├── similarity.py   # Product similarity matching
│   ├── grouping.py     # Optimal group formation
│   └── recommendation.py # Supplier recommendation
└── embeddings.py       # Product embeddings
```

**Responsibilities**:
- Similar request matching
- Optimal group formation
- Supplier recommendation
- Matching quality metrics

### Payment Domain
```
payment/
├── models.py           # Transaction, Payment entities
├── schemas.py          # PaymentSchema, etc.
├── router.py           # /payment/* endpoints
├── service.py          # Payment orchestration
├── repository.py       # Payment data access
├── providers/
│   ├── midtrans.py     # Midtrans integration
│   └── base.py         # Payment provider interface
└── reconciliation.py   # Payment reconciliation
```

**Responsibilities**:
- Payment processing
- Transaction tracking
- Payment status updates
- Reconciliation with suppliers

### Notification Domain
```
notification/
├── models.py           # Notification entity
├── schemas.py          # NotificationSchema, etc.
├── router.py           # /notify/* endpoints
├── service.py          # Notification logic
├── repository.py       # Notification data access
├── channels/
│   ├── email.py        # Email notifications
│   ├── sms.py          # SMS/WhatsApp notifications
│   └── in_app.py       # In-app notifications
└── templates/          # Notification templates
```

**Responsibilities**:
- Notification delivery
- Multi-channel support
- Notification preferences
- Delivery tracking

### Analytics Domain
```
analytics/
├── models.py           # Analytics, Report entities
├── schemas.py          # AnalyticsSchema, etc.
├── router.py           # /analytics/* endpoints
├── service.py          # Analytics logic
├── repository.py       # Analytics data access
└── calculators/
    ├── savings.py      # Savings calculation
    ├── metrics.py      # KPI calculation
    └── trends.py       # Trend analysis
```

**Responsibilities**:
- Procurement metrics
- Savings calculation
- Credit trail analytics
- Trend analysis and forecasting

## 3. Data Flow

### Procurement Workflow Flow
```
User Creates Request
    ↓
Request Validation & Storage
    ↓
Matching Engine Searches Similar Requests
    ↓
AI Recommends Suppliers
    ↓
System Creates Procurement Group
    ↓
Group Reviews & Selects Supplier
    ↓
Order Aggregated & Sent
    ↓
Supplier Confirms & Sets Delivery
    ↓
Payment Processing (Midtrans)
    ↓
Transaction Recorded
    ↓
Credit Trail Updated
    ↓
Notification to All Members
```

### Authentication Flow
```
User Credentials
    ↓
Backend Validates & Hashes Password
    ↓
JWT Token Generated
    ↓
Client Stores Token
    ↓
Token Sent in Auth Header
    ↓
Middleware Validates Token
    ↓
Request Processed
```

## 4. External Integrations

### Midtrans Payment Gateway
```
App ─→ Midtrans API (Payment Processing)
      ← Callback (Payment Status)
      
Integration Point: `payment/providers/midtrans.py`
```

### WhatsApp Notifications
```
App ─→ WhatsApp Business API
      ← Message Delivery Status
      
Integration Point: `notification/channels/sms.py`
```

### Future: BPS & Kemenkop Integration
```
App ─→ BPS API (Economic Data)
App ─→ Kemenkop API (UMKM Programs)

Integration Point: `integrations/external_apis.py`
```

## 5. Scalability Considerations

### Database Optimization
- Connection pooling (SQLAlchemy pool_pre_ping)
- Indexing on frequently queried columns
- Query optimization and N+1 prevention
- Read replicas for analytics queries

### API Performance
- Response caching (Redis)
- Pagination for list endpoints
- Asynchronous request handling
- Rate limiting per user/IP

### Frontend Optimization
- Code splitting by page
- Lazy loading of components
- Image optimization
- Service workers for caching

### Background Tasks (Future)
```
Celery Tasks:
- Send notifications asynchronously
- Calculate analytics metrics
- Generate reports
- Sync with external APIs
```

## 6. Security Architecture

### Authentication & Authorization
```
JWT-based stateless authentication:
├── Access Token (short-lived, 15 min)
├── Refresh Token (long-lived, 30 days)
└── Role-based Access Control (RBAC)
```

### Data Protection
- Password hashing: bcrypt
- Sensitive data encryption at rest
- HTTPS/TLS in transit
- SQL injection prevention via ORM

### API Security
- CORS configuration
- Rate limiting
- Input validation (Pydantic)
- Output sanitization

## 7. Deployment Architecture

### Docker Containerization
```
docker-compose.yml
├── backend (FastAPI service)
├── frontend (Vite + Nginx)
├── postgres (Database)
├── redis (Cache/Message Queue)
└── nginx (Reverse Proxy)
```

### Production Deployment (Recommended)
- Kubernetes for orchestration
- CloudSQL/RDS for database
- S3 for file storage
- CDN for static assets
- Application Load Balancer

## 8. Technology Decisions & Rationale

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Backend Framework | FastAPI | High performance, auto docs, async support |
| ORM | SQLAlchemy | Flexibility, relationship management |
| Frontend Framework | React + Vite | Component reusability, fast build |
| State Management | Zustand | Minimal boilerplate, easy learning curve |
| Styling | Tailwind CSS | Rapid UI development, responsive design |
| Database | PostgreSQL | ACID compliance, relational data, reliability |
| Auth | JWT | Stateless, scalable, industry standard |
| Payment | Midtrans | Indonesia-focused, comprehensive features |

---

**Last Updated**: May 2026
**Status**: Architecture Finalized
