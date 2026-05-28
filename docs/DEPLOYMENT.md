"""
Deployment and Production Setup Guide
"""

# Deschain Deployment Guide

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose

### Start Development Environment

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or manually:
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Staging Deployment

### Using Docker Compose

```bash
# Build images
docker-compose build

# Push to registry (if using cloud container registry)
docker tag deschain-backend:latest registry.example.com/deschain-backend:latest
docker push registry.example.com/deschain-backend:latest

# Deploy
docker-compose up -d
```

### Environment Configuration

Create production `.env` files:

**backend/.env**:
```
DATABASE_URL=postgresql://user:password@db-host:5432/deschain_prod
SECRET_KEY=your-production-secret-key-min-256-chars
DEBUG=false
ENVIRONMENT=production
MIDTRANS_SERVER_KEY=your-midtrans-key
MIDTRANS_IS_PRODUCTION=false  # Set to true when ready
ENABLE_NOTIFICATION_WHATSAPP=true
```

**frontend/.env**:
```
VITE_API_URL=https://api.deschain.id/api/v1
```

## Production Deployment

### Option 1: Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deschain-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: deschain-backend
  template:
    metadata:
      labels:
        app: deschain-backend
    spec:
      containers:
      - name: backend
        image: registry.example.com/deschain-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: deschain-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

Deploy:
```bash
kubectl apply -f deployment.yaml
kubectl expose deployment deschain-backend --type=LoadBalancer --port=80 --target-port=8000
```

### Option 2: Cloud Platforms

#### Heroku
```bash
heroku login
heroku create deschain-app
heroku config:set SECRET_KEY=your-key
git push heroku main
heroku addons:create heroku-postgresql:standard-0
```

#### Railway
```bash
npm install -g railway
railway login
railway init
railway up
```

#### PythonAnywhere (Backend)
1. Upload code
2. Create virtual environment
3. Configure web app
4. Set environment variables
5. Reload app

### Option 3: VPS (DigitalOcean, Linode, AWS EC2)

```bash
# SSH into server
ssh root@your-server-ip

# Install dependencies
apt-get update && apt-get install -y python3.11 postgresql nodejs docker.io

# Clone repository
git clone your-repo.git deschain
cd deschain

# Setup backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup systemd service
sudo tee /etc/systemd/system/deschain.service > /dev/null <<EOF
[Unit]
Description=Deschain FastAPI Backend
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/root/deschain/backend
ExecStart=/root/deschain/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl start deschain
sudo systemctl enable deschain

# Setup Nginx reverse proxy
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/deschain
# ... (configure reverse proxy)
sudo systemctl restart nginx
```

## Database Migrations in Production

```bash
# Connect to production database
export DATABASE_URL=postgresql://user:password@prod-db:5432/deschain

# Run migrations
alembic upgrade head

# Backup before migration
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

## Monitoring & Logging

### Application Monitoring

```python
# Using Sentry
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

### Logging

```python
# Structured logging output
import structlog
logger = structlog.get_logger()
logger.info("event_name", key="value")
```

### Health Checks

```bash
curl https://api.deschain.id/health
curl https://deschain.id/api/v1/health
```

## Security Checklist

- [ ] Enable HTTPS/TLS (Let's Encrypt)
- [ ] Configure CORS properly
- [ ] Set secure headers (HSTS, CSP, X-Frame-Options)
- [ ] Database encryption at rest
- [ ] Secrets management (not in environment files)
- [ ] Regular security updates
- [ ] SQL injection protection (ORM handles this)
- [ ] Rate limiting configured
- [ ] CSRF protection enabled
- [ ] Dependency scanning (Snyk, Dependabot)
- [ ] Regular backups enabled
- [ ] WAF (Web Application Firewall) configured

## Performance Optimization

### Backend
- Database connection pooling
- Query caching with Redis
- API response compression
- CDN for static files

### Frontend
- Code splitting with Vite
- Image optimization
- Service workers for offline support
- Lazy loading

### Infrastructure
- Load balancing
- Auto-scaling
- CDN distribution
- Database read replicas

## Disaster Recovery

### Backup Strategy
```bash
# Daily database backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# S3 upload
aws s3 cp /backups/db-*.sql.gz s3://backup-bucket/deschain/
```

### Recovery Process
1. Stop application
2. Restore database from backup
3. Verify integrity
4. Restart application

## Scaling Strategy

### Horizontal Scaling
- Multiple backend instances behind load balancer
- Read replicas for database
- Separate worker for background tasks

### Vertical Scaling
- Increase server resources
- Optimize database indexes
- Cache frequently accessed data

---

**Last Updated**: May 2026
**Status**: Production Ready
