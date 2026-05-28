# Deschain MVP Roadmap

## Phase 0: Foundation (Weeks 1-2)

### Backend Setup ✅
- [x] FastAPI project initialization
- [x] PostgreSQL database setup
- [x] SQLAlchemy ORM configuration
- [x] Authentication infrastructure (JWT)
- [x] Environment configuration
- [x] Docker setup

### Frontend Setup ✅
- [x] React + Vite project
- [x] Tailwind CSS configuration
- [x] Zustand store setup
- [x] Axios API client
- [x] Project structure
- [x] Docker setup

### DevOps ✅
- [x] Docker Compose setup
- [x] Development environment
- [x] Database migration tools

---

## Phase 1: MVP Core (Weeks 3-6)

### Authentication & Authorization
**Duration**: 1 week

**Backend**:
- User registration and email verification
- Login with JWT tokens
- Password reset flow
- Role-based access control (UMKM, Vendor, Admin)
- Token refresh mechanism

**Frontend**:
- Login page
- Registration form
- Password reset flow
- Protected routes
- Token storage and management

**Endpoints**:
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/forgot-password` - Password reset
- `POST /auth/reset-password` - Confirm password reset

**API Responses**:
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "refresh_token": "string",
    "user": {
      "id": "uuid",
      "email": "string",
      "user_type": "umkm|vendor|admin"
    }
  }
}
```

### UMKM Onboarding & Profile
**Duration**: 1 week

**Backend**:
- UMKM registration form
- Business profile creation
- Document upload (business license, ID)
- Profile editing
- Profile retrieval
- Verification workflow

**Frontend**:
- Multi-step onboarding form
- Business details form
- Document upload component
- Profile view page
- Edit profile functionality

**Endpoints**:
- `POST /umkm/register` - Create UMKM profile
- `GET /umkm/{umkm_id}` - Get UMKM profile
- `PUT /umkm/{umkm_id}` - Update UMKM profile
- `GET /umkm/me` - Get current user's UMKM

### Vendor Management
**Duration**: 0.5 week

**Backend**:
- Vendor registration
- Vendor profile management
- Product category listing
- Vendor directory
- Vendor search and filtering

**Frontend**:
- Vendor registration form
- Vendor profile page
- Vendor directory listing
- Vendor search and filters
- Vendor details modal

**Endpoints**:
- `POST /vendor/register` - Register vendor
- `GET /vendor/{vendor_id}` - Get vendor details
- `PUT /vendor/{vendor_id}` - Update vendor
- `GET /vendor/list` - List all vendors
- `GET /vendor/search` - Search vendors by category/location

### Procurement Request System
**Duration**: 1.5 weeks

**Backend**:
- Create procurement request
- List requests for UMKM
- Edit request
- Cancel request
- Request status management
- Retrieve active requests across platform

**Frontend**:
- Procurement request form
- Request creation wizard
- My requests list
- Request details view
- Request editing
- Active requests discovery

**Endpoints**:
- `POST /procurement/request` - Create request
- `GET /procurement/request/{request_id}` - Get request
- `PUT /procurement/request/{request_id}` - Update request
- `DELETE /procurement/request/{request_id}` - Cancel request
- `GET /procurement/requests/my` - My requests
- `GET /procurement/requests/active` - All active requests

### Manual Procurement Group Creation
**Duration**: 1 week

**Backend**:
- Create procurement group manually
- Add requests/members to group
- Remove requests/members
- Group status management
- List groups for UMKM
- Group details retrieval

**Frontend**:
- Create group wizard
- Add members/requests to group
- Group dashboard view
- Group members list
- Member management interface

**Endpoints**:
- `POST /procurement/group` - Create group
- `GET /procurement/group/{group_id}` - Get group
- `POST /procurement/group/{group_id}/members` - Add members
- `DELETE /procurement/group/{group_id}/members/{umkm_id}` - Remove member
- `GET /procurement/groups/my` - My groups
- `PUT /procurement/group/{group_id}` - Update group

### Basic Vendor Matching
**Duration**: 1 week

**Backend**:
- Keyword-based matching (no ML yet)
- Suggest vendors for request
- Match similar requests (simple similarity)
- Get matching recommendations

**Frontend**:
- Suggested vendors section
- Similar requests notification
- Matching recommendations display

**Endpoints**:
- `GET /matching/vendors/{request_id}` - Get vendor suggestions
- `GET /matching/requests/{request_id}` - Get similar requests
- `POST /matching/groups/{request_id}` - Get group suggestions

### Transaction & Payment Tracking
**Duration**: 1.5 weeks

**Backend**:
- Order creation from group
- Midtrans payment integration
- Payment callback handling
- Transaction status tracking
- Payment reconciliation
- Invoice generation

**Frontend**:
- Order confirmation page
- Payment page (redirect to Midtrans)
- Payment success page
- Transaction history page
- Invoice download

**Endpoints**:
- `POST /payment/order` - Create order
- `POST /payment/initiate` - Initiate payment
- `GET /payment/callback` - Payment webhook
- `GET /transaction/{transaction_id}` - Get transaction
- `GET /transaction/history` - Transaction history
- `GET /transaction/{transaction_id}/invoice` - Get invoice

### Basic Dashboard
**Duration**: 1 week

**Backend**:
- Dashboard metrics calculation
- User statistics
- Recent activity
- Savings calculation

**Frontend**:
- Dashboard layout
- Key metrics display
- Recent transactions
- Active groups
- Quick action buttons

**Endpoints**:
- `GET /dashboard/metrics` - Dashboard metrics
- `GET /dashboard/recent-activity` - Recent activity
- `GET /dashboard/savings` - Savings summary

### Mobile Responsive UI (Ongoing)
- Tailwind CSS mobile-first design
- Responsive navigation
- Mobile-optimized forms
- Touch-friendly buttons

---

## Phase 2: AI & Advanced Features (Weeks 7-10)

### AI-Powered Request Matching
**Duration**: 2 weeks

**Features**:
- Product embedding generation (using FastText or TF-IDF)
- Semantic similarity matching
- Automatic group formation
- Quality score calculation
- Continuous learning from matches

**Backend**:
- Embedding service
- Similarity calculation
- Group recommendation engine
- Match quality feedback

**Frontend**:
- Match suggestion notifications
- Auto-group acceptance interface
- Match quality display

**Endpoints**:
- `GET /matching/auto-groups/{request_id}` - Get auto-match suggestions
- `POST /matching/accept` - Accept AI recommendation

### Supplier Recommendation Engine
**Duration**: 1.5 weeks

**Features**:
- Supplier scoring based on:
  - Historical performance
  - Price competitiveness
  - Delivery reliability
  - Rating scores
- Personalized recommendations

**Backend**:
- Supplier scoring algorithm
- Historical data aggregation
- Recommendation ranking

**Frontend**:
- Recommended suppliers section
- Supplier comparison
- Rating display

**Endpoints**:
- `GET /recommendation/suppliers/{group_id}` - Get supplier recommendations
- `GET /recommendation/best-match/{group_id}` - Get best supplier match

### Credit Trail & Analytics
**Duration**: 1.5 weeks

**Features**:
- Transaction history analytics
- Credit score tracking
- Payment reliability metrics
- Procurement patterns
- Savings analytics
- Performance trends

**Backend**:
- Analytics calculations
- Credit score algorithm
- Report generation

**Frontend**:
- Analytics dashboard
- Credit score display
- Performance charts
- Report generation

**Endpoints**:
- `GET /analytics/umkm/{umkm_id}` - UMKM analytics
- `GET /analytics/credit-score/{umkm_id}` - Credit score
- `GET /analytics/savings` - Savings summary
- `GET /analytics/trends` - Trend analysis

### Real-time Notifications
**Duration**: 1 week

**Features**:
- In-app notifications
- Email notifications
- SMS/WhatsApp notifications (basic)
- Notification preferences
- Notification history

**Backend**:
- Notification service
- Multi-channel delivery
- Template system
- Notification preferences

**Frontend**:
- Notification bell with count
- Notification center
- Notification preferences page
- Toast notifications

**Endpoints**:
- `GET /notification/list` - Get notifications
- `PUT /notification/{notification_id}/read` - Mark as read
- `PUT /notification/preferences` - Update preferences

### Group Quote Management
**Duration**: 1 week

**Features**:
- Supplier quote submission
- Quote comparison
- Quote selection workflow
- Quote expiration management

**Backend**:
- Quote storage and retrieval
- Quote comparison logic
- Selection workflow

**Frontend**:
- Quote submission form (for vendors)
- Quote comparison dashboard
- Quote selection interface
- Quote details view

**Endpoints**:
- `POST /procurement/quote` - Submit quote
- `GET /procurement/quote/{quote_id}` - Get quote
- `GET /procurement/group/{group_id}/quotes` - Group quotes
- `PUT /procurement/quote/{quote_id}/status` - Update quote status

---

## Phase 3: Polish & Optimization (Weeks 11-12)

### Performance Optimization
- Database query optimization
- API response caching
- Frontend code splitting
- Image optimization
- Lazy loading

### Testing
- Unit tests (50%+ coverage)
- Integration tests
- E2E tests for critical flows
- Load testing

### Documentation
- API documentation (Swagger)
- User guides
- Developer guides
- Deployment guide

### Bug Fixes & UX Improvements
- User feedback implementation
- Bug fixes
- UI/UX refinements
- Accessibility improvements

---

## Phase 4: Deployment Preparation (Weeks 13+)

### Environment Setup
- Production database setup
- Secrets management
- CDN configuration
- Monitoring setup

### Deployment
- Docker image optimization
- Kubernetes setup (optional)
- CI/CD pipeline
- Monitoring and logging

### Security Audit
- Dependency scanning
- Security testing
- OWASP compliance
- Data protection compliance

---

## MVP Success Criteria

✅ **Functional Requirements**:
- User authentication works reliably
- UMKM can create procurement requests
- Groups can be formed manually or automatically
- Transactions can be processed via Midtrans
- Credit trail is maintained accurately
- Dashboard shows real metrics

✅ **Non-Functional Requirements**:
- API response time < 500ms
- System handles 100+ concurrent users
- 99% uptime during testing
- Mobile UI is responsive
- No critical security issues

✅ **Business Requirements**:
- At least 5 UMKMs registered
- At least 10 procurement requests created
- Average cost reduction demonstrated
- Credit trail accurate and usable
- User satisfaction > 4/5

---

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 0: Foundation | 2 weeks | ✅ To Start |
| Phase 1: MVP Core | 4 weeks | 📋 Planned |
| Phase 2: AI & Advanced | 4 weeks | 🔮 Future |
| Phase 3: Polish | 2 weeks | 🔮 Future |
| Phase 4: Deployment | 2 weeks | 🔮 Future |
| **Total** | **~14 weeks** | **MVP Ready** |

---

## Resource Requirements

### Development Team
- 1 Backend Developer (FastAPI/Python)
- 1 Frontend Developer (React)
- 1 DevOps Engineer (part-time)
- 1 Project Manager (part-time)

### Infrastructure
- Development VPS ($5-10/month)
- Database hosting ($15-30/month)
- Domain name ($1-15/year)
- SSL certificate (free with Let's Encrypt)

---

## Post-MVP Roadmap (Phase 2+)

- WhatsApp business integration
- Mobile app (React Native)
- BPS dataset integration
- Financing marketplace
- Advanced ML matching
- Multi-language support
- B2B integrations

---

**Last Updated**: May 2026
**Current Phase**: Foundation (Phase 0)
**Estimated MVP Launch**: July 2026
