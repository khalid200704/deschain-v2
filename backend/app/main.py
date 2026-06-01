"""
Main FastAPI application entry point
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import structlog

from app.config import get_settings
from app.database import engine, Base
from app.utils.logging_config import setup_logging

setup_logging()
logger = structlog.get_logger()
settings = get_settings()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("application_startup", app_name=settings.APP_NAME, version=settings.APP_VERSION)
    Base.metadata.create_all(bind=engine)
    yield
    logger.info("application_shutdown")


app = FastAPI(
    title=settings.APP_NAME,
    description="Platform pengadaan kolektif bertenaga AI untuk UMKM & koperasi Indonesia",
    version=settings.APP_VERSION,
    docs_url=settings.API_DOCS_URL,
    openapi_url=settings.API_OPENAPI_URL,
    lifespan=lifespan,
)

# Rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.deschain.id", "*.vercel.app", "*.hf.space", "*.huggingface.co"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Security headers untuk setiap response"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# ── Routers ──
from app.domains.auth.router import router as auth_router
from app.domains.procurement.router import router as procurement_router
from app.domains.matching.router import router as matching_router
from app.domains.analytics.router import router as analytics_router
from app.domains.vendor.router import router as vendor_router
from app.domains.transaction.router import router as transaction_router
from app.domains.admin.router import router as admin_router
from app.domains.consultation.router import router as consultation_router

app.include_router(auth_router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["Autentikasi"])
app.include_router(procurement_router, prefix=f"{settings.API_V1_PREFIX}/procurement", tags=["Pengadaan"])
app.include_router(matching_router, prefix=f"{settings.API_V1_PREFIX}/matching", tags=["AI Matching"])
app.include_router(analytics_router, prefix=f"{settings.API_V1_PREFIX}/analytics", tags=["Analytics"])
app.include_router(vendor_router, prefix=f"{settings.API_V1_PREFIX}/vendors", tags=["Vendor"])
app.include_router(transaction_router, prefix=f"{settings.API_V1_PREFIX}/transactions", tags=["Transaksi"])
app.include_router(admin_router, prefix=f"{settings.API_V1_PREFIX}/admin", tags=["Admin"])
app.include_router(consultation_router, prefix=f"{settings.API_V1_PREFIX}/consultation", tags=["Konsultasi AI"])


@app.get("/ping")
async def ping():
    """Lightweight ping untuk keep-alive HF Space"""
    return {"pong": True}


@app.get("/health")
async def health_check():
    return {
        "status": "sehat",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/")
async def root():
    return {
        "nama": settings.APP_NAME,
        "versi": settings.APP_VERSION,
        "deskripsi": "Platform pengadaan kolektif bertenaga AI untuk UMKM & koperasi Indonesia",
        "dokumentasi": settings.API_DOCS_URL,
        "api": settings.API_V1_PREFIX,
    }


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Terjadi kesalahan pada server. Silakan coba lagi.",
            "error": {"code": "INTERNAL_ERROR"},
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
