---
title: Deschain Backend
emoji: 🌿
colorFrom: green
colorTo: green
sdk: docker
pinned: false
---

# Deschain Backend

Python FastAPI backend for the Deschain collective procurement platform.

## Quick Start

### Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Initialize database
alembic upgrade head

# Run development server
uvicorn app.main:app --reload
```

## Project Structure

- `app/` - Main application package
  - `main.py` - FastAPI entry point
  - `config.py` - Configuration management
  - `database.py` - Database setup
  - `security.py` - Authentication and JWT
  - `domains/` - Domain modules (auth, umkm, vendor, etc.)
  - `models/` - SQLAlchemy models
  - `schemas/` - Pydantic request/response schemas
  - `repositories/` - Data access layer
  - `services/` - Business logic layer
  - `utils/` - Utility functions

- `migrations/` - Alembic database migrations
- `tests/` - Test suite

## Environment Variables

See `.env.example` for all available configuration options.

## API Documentation

When running locally, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- OpenAPI JSON: http://localhost:8000/openapi.json

## Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Revert last migration
alembic downgrade -1
```

## Testing

```bash
pytest tests/ -v
```

## Docker

```bash
docker build -t deschain-backend:latest .
docker run -p 8000:8000 deschain-backend:latest
```
