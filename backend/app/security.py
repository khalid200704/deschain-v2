"""
JWT Authentication and Security utilities
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
import structlog

from app.config import get_settings

settings = get_settings()
logger = structlog.get_logger()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()


class TokenData:
    """JWT Token data"""
    def __init__(self, user_id: str, email: str, user_type: str, exp: datetime = None):
        self.user_id = user_id
        self.email = email
        self.user_type = user_type
        self.exp = exp or datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: str, email: str, user_type: str) -> str:
    """Create JWT access token"""
    payload = {
        "sub": user_id,
        "email": email,
        "user_type": user_type,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token


def create_refresh_token(user_id: str, email: str, user_type: str) -> str:
    """Create JWT refresh token"""
    payload = {
        "sub": user_id,
        "email": email,
        "user_type": user_type,
        "type": "refresh",
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    }
    
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token


def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("token_expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        logger.warning("invalid_token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)) -> dict:
    """Dependency to get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    return {
        "user_id": payload["sub"],
        "email": payload["email"],
        "user_type": payload["user_type"],
    }


async def get_current_umkm_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency to get current UMKM user"""
    if current_user["user_type"] != "umkm":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This operation requires UMKM account",
        )
    return current_user


async def get_current_vendor_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency to get current Vendor user"""
    if current_user["user_type"] != "vendor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This operation requires Vendor account",
        )
    return current_user


async def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Dependency to get current Admin user"""
    if current_user["user_type"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This operation requires Admin account",
        )
    return current_user
