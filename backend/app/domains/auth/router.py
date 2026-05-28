"""
Authentication domain router — register, login, refresh, me
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    get_current_user,
)
from app.models import User
from app.schemas.models import UserCreate, LoginRequest

import structlog

logger = structlog.get_logger()
router = APIRouter()


def _user_to_dict(user: User) -> dict:
    return {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "user_type": user.user_type,
        "is_verified": user.is_verified,
        "is_active": user.is_active,
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Daftar pengguna baru (UMKM, Vendor, atau Admin)"""
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar. Silakan gunakan email lain.",
        )

    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        user_type=user_data.user_type,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info("user_registered", user_id=str(user.id), user_type=user.user_type)

    return {
        "success": True,
        "message": "Registrasi berhasil",
        "data": {
            "access_token": create_access_token(str(user.id), user.email, user.user_type),
            "refresh_token": create_refresh_token(str(user.id), user.email, user.user_type),
            "token_type": "bearer",
            "user": _user_to_dict(user),
        },
    }


@router.post("/login")
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Masuk dengan email dan password"""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        logger.warning("login_failed", email=credentials.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda telah dinonaktifkan. Hubungi dukungan.",
        )

    user.last_login = datetime.utcnow()
    db.commit()

    logger.info("user_login", user_id=str(user.id))

    return {
        "success": True,
        "message": "Login berhasil",
        "data": {
            "access_token": create_access_token(str(user.id), user.email, user.user_type),
            "refresh_token": create_refresh_token(str(user.id), user.email, user.user_type),
            "token_type": "bearer",
            "user": _user_to_dict(user),
        },
    }


@router.post("/refresh")
async def refresh(body: dict, db: Session = Depends(get_db)):
    """Perbarui access token menggunakan refresh token"""
    token = body.get("refresh_token")
    if not token:
        raise HTTPException(status_code=400, detail="refresh_token wajib diisi")

    data = verify_token(token)
    if data.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token tidak valid")

    user = db.query(User).filter(User.id == data["sub"]).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Pengguna tidak ditemukan")

    return {
        "success": True,
        "data": {
            "access_token": create_access_token(str(user.id), user.email, user.user_type),
            "token_type": "bearer",
        },
    }


@router.get("/me")
async def get_me(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Ambil data pengguna yang sedang login"""
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Pengguna tidak ditemukan")
    return {"success": True, "data": _user_to_dict(user)}
