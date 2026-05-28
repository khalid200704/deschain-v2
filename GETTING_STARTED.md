# Getting Started with Deschain

## Overview

Deschain is an **AI-powered collective procurement platform for Indonesian UMKM** (Micro, Small, Medium Enterprises). It helps small businesses:

1. **Combine purchase requests** to get bulk discounts
2. **Match with suppliers** automatically using AI
3. **Track transactions** as credit trail for financing
4. **Reduce costs** through collective buying power

## Architecture

The platform uses:

### Backend
- **FastAPI** (Python 3.11): High-performance REST API
- **PostgreSQL**: Reliable relational database
- **SQLAlchemy**: ORM for database management
- **JWT**: Secure token-based authentication

### Frontend  
- **React 18**: Modern UI framework
- **Vite**: Fast development server and build
- **Tailwind CSS**: Responsive design system
- **Zustand**: Simple state management

### Integrations
- **Midtrans**: Payment gateway for Indonesia
- **WhatsApp**: Notifications and updates
- **BPS/Kemenkop**: Future economic data integration

## Key Features

### Phase 1 (MVP)
✅ User authentication and UMKM profiles  
✅ Procurement request creation  
✅ Manual group formation  
✅ Vendor listings  
✅ Payment processing (Midtrans)  
✅ Transaction tracking  
✅ Dashboard with savings metrics  

### Phase 2 (Future)
🔮 AI-powered automatic group matching  
🔮 Supplier recommendation engine  
🔮 WhatsApp notifications  
🔮 Advanced analytics  
🔮 Credit scoring for financing  

## Color Scheme

- **Navy (#0F172A)**: Trust, authority, primary CTA
- **Gold (#F59E0B)**: Premium, opportunity, highlights
- **Ice (#F0F9FF)**: Clarity, backgrounds

## Data Flow

```
UMKM User
    ↓
Creates Procurement Request
    ↓
AI Finds Similar Requests
    ↓
Groups Requests Together
    ↓
Recommends Best Suppliers
    ↓
Group Selects Supplier
    ↓
Payment Processing
    ↓
Transaction Recorded
    ↓
Credit Trail Updated
```

## User Flows

### UMKM User Flow
1. Register and complete business profile
2. Create procurement request (product, quantity, budget, delivery)
3. System automatically finds similar requests
4. Join existing groups or start new one
5. Review and select supplier quotes
6. Complete payment via Midtrans
7. Track transaction and delivery
8. Build credit history

### Vendor Flow
1. Register and complete vendor profile
2. Browse available procurement groups
3. Submit quotes for interested groups
4. Monitor order status
5. Track payments

## Database Schema Highlights

- **Users**: Authentication and profiles
- **UMKMs**: Small business information
- **Vendors**: Supplier information
- **ProcurementRequests**: Individual purchase needs
- **ProcurementGroups**: Collective orders
- **Transactions**: Order and payment tracking
- **CreditTrail**: Financial history for UMKM

## API Endpoints (Sample)

```
POST   /auth/register           - Register new user
POST   /auth/login              - User login
GET    /umkm/me                 - Get my profile
POST   /procurement/request     - Create request
GET    /procurement/requests    - List my requests
POST   /procurement/group       - Create group
GET    /matching/vendors/{id}   - Get vendor suggestions
POST   /payment/order           - Create order
GET    /analytics/dashboard     - Dashboard metrics
```

See [API_DESIGN.md](docs/API_DESIGN.md) for complete endpoint documentation.

## AI Matching Algorithm

The system uses:
1. **Product Similarity**: Text-based matching of procurement needs
2. **Geographic Compatibility**: Location-based grouping
3. **Temporal Alignment**: Delivery date compatibility
4. **Volume Aggregation**: Bulk purchase potential
5. **Supplier Scoring**: Best match recommendations

Example matching:
- Request A: 100kg Rice, Bandung, June 10 → Similarity 0.92 → Request B
- Both joined in Group 1, total 250kg
- Get 12% bulk discount from supplier

## Deployment

### Development
```bash
docker-compose up -d
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

### Production
- Kubernetes for orchestration
- CloudSQL/RDS for database
- CDN for static assets
- Application Load Balancer
- SSL/TLS certificates

## Team & Roles

- **Backend Developer**: API and business logic
- **Frontend Developer**: UI and user experience
- **DevOps Engineer**: Deployment and infrastructure
- **Project Manager**: Coordination and planning

## Success Metrics

- 100+ UMKM registered in MVP
- 50+ procurement groups formed
- Average 10-15% cost reduction
- 99% transaction accuracy
- User satisfaction > 4/5

## Next Steps

1. **Read**: Review full documentation
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md)
   - [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)
   - [API_DESIGN.md](docs/API_DESIGN.md)
   - [MVP_ROADMAP.md](docs/MVP_ROADMAP.md)

2. **Setup**: Get development environment running
   - Clone repository
   - Install dependencies
   - Configure `.env` files
   - Start Docker containers

3. **Explore**: Understand the codebase
   - Backend structure: `backend/app/domains`
   - Frontend components: `frontend/src/components`
   - Database models: `backend/app/models`

4. **Develop**: Start implementing features
   - Pick a feature from MVP roadmap
   - Create feature branch
   - Write code and tests
   - Submit pull request

## Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://github.com/pmndrs/zustand

## Support

- Open GitHub Issues for bugs
- Start Discussions for questions
- Check documentation first
- Be respectful and constructive

---

**Version**: 0.1.0 (MVP)  
**Last Updated**: May 2026  
**Status**: 🔨 Active Development
