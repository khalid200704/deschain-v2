"""
Admin domain — platform management, statistik, verifikasi user
Hanya bisa diakses oleh user_type = 'admin'
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.security import get_current_user
from app.models import User, UMKM, Vendor, ProcurementGroup, GroupMembership, Transaction, ProcurementRequest

import structlog
logger = structlog.get_logger()
router = APIRouter()


def _require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Hanya admin yang diizinkan.")
    return current_user


@router.get("/stats")
async def get_platform_stats(
    db: Session = Depends(get_db),
    admin: dict = Depends(_require_admin),
):
    """Statistik keseluruhan platform"""
    total_users    = db.query(func.count(User.id)).scalar()
    total_umkm     = db.query(func.count(UMKM.id)).scalar()
    total_vendor   = db.query(func.count(Vendor.id)).scalar()
    total_groups   = db.query(func.count(ProcurementGroup.id)).scalar()
    active_groups  = db.query(func.count(ProcurementGroup.id)).filter(ProcurementGroup.status == "forming").scalar()
    done_groups    = db.query(func.count(ProcurementGroup.id)).filter(ProcurementGroup.status == "completed").scalar()
    total_members  = db.query(func.count(GroupMembership.id)).scalar()
    total_requests = db.query(func.count(ProcurementRequest.id)).scalar()

    total_savings  = db.query(func.sum(ProcurementGroup.total_savings)).scalar() or 0
    total_value    = db.query(func.sum(UMKM.total_procurement_value)).scalar() or 0

    verified_umkm  = db.query(func.count(UMKM.id)).filter(UMKM.verification_status == "verified").scalar()
    pending_umkm   = db.query(func.count(UMKM.id)).filter(UMKM.verification_status == "pending").scalar()
    verified_vendor= db.query(func.count(Vendor.id)).filter(Vendor.verification_status == "verified").scalar()
    pending_vendor = db.query(func.count(Vendor.id)).filter(Vendor.verification_status == "pending").scalar()

    # Kota dengan UMKM terbanyak
    cities = db.query(UMKM.city, func.count(UMKM.id).label("cnt")) \
               .group_by(UMKM.city).order_by(func.count(UMKM.id).desc()).limit(5).all()

    return {
        "success": True,
        "data": {
            "users": {"total": total_users, "umkm": total_umkm, "vendor": total_vendor},
            "groups": {"total": total_groups, "active": active_groups, "completed": done_groups, "members": total_members},
            "procurement": {"total_requests": total_requests, "total_value": total_value, "total_savings": total_savings},
            "verification": {
                "umkm_verified": verified_umkm, "umkm_pending": pending_umkm,
                "vendor_verified": verified_vendor, "vendor_pending": pending_vendor,
            },
            "top_cities": [{"city": c, "count": n} for c, n in cities],
        }
    }


@router.get("/users")
async def list_users(
    db: Session = Depends(get_db),
    admin: dict = Depends(_require_admin),
):
    """Daftar semua user + profil bisnis"""
    users = db.query(User).order_by(User.created_at.desc()).limit(100).all()
    result = []
    for u in users:
        row = {
            "id": str(u.id),
            "email": u.email,
            "name": f"{u.first_name or ''} {u.last_name or ''}".strip(),
            "user_type": u.user_type,
            "is_active": u.is_active,
            "is_verified": u.is_verified,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "business_name": None,
            "city": None,
            "verification_status": None,
            "credit_score": None,
        }
        if u.user_type == "umkm" and u.umkm:
            row.update({
                "business_name": u.umkm.business_name,
                "city": u.umkm.city,
                "verification_status": u.umkm.verification_status,
                "credit_score": u.umkm.credit_score,
            })
        elif u.user_type == "vendor" and u.vendor:
            row.update({
                "business_name": u.vendor.vendor_name,
                "city": u.vendor.city,
                "verification_status": u.vendor.verification_status,
            })
        result.append(row)
    return {"success": True, "data": result}


@router.put("/users/{user_id}/verify")
async def verify_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(_require_admin),
):
    """Verifikasi akun UMKM atau Vendor"""
    import uuid
    try:
        uid = uuid.UUID(user_id)
    except Exception:
        raise HTTPException(400, "ID tidak valid")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(404, "User tidak ditemukan")

    if user.user_type == "umkm" and user.umkm:
        user.umkm.verification_status = "verified"
        user.is_verified = True
        name = user.umkm.business_name
    elif user.user_type == "vendor" and user.vendor:
        user.vendor.verification_status = "verified"
        user.is_verified = True
        name = user.vendor.vendor_name
    else:
        raise HTTPException(400, "User tidak memiliki profil bisnis")

    db.commit()
    logger.info("user_verified", user_id=user_id, admin=admin["user_id"])
    return {"success": True, "message": f"{name} berhasil diverifikasi"}


@router.put("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: str,
    db: Session = Depends(get_db),
    admin: dict = Depends(_require_admin),
):
    """Aktifkan atau nonaktifkan akun user"""
    import uuid
    try:
        uid = uuid.UUID(user_id)
    except Exception:
        raise HTTPException(400, "ID tidak valid")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(404, "User tidak ditemukan")
    if user.user_type == "admin":
        raise HTTPException(400, "Tidak bisa menonaktifkan akun admin")

    user.is_active = not user.is_active
    db.commit()
    status = "diaktifkan" if user.is_active else "dinonaktifkan"
    return {"success": True, "message": f"Akun {user.email} {status}"}


@router.get("/groups")
async def list_groups(
    db: Session = Depends(get_db),
    admin: dict = Depends(_require_admin),
):
    """Daftar semua grup pengadaan"""
    groups = db.query(ProcurementGroup).order_by(ProcurementGroup.created_at.desc()).limit(50).all()
    return {
        "success": True,
        "data": [
            {
                "id": str(g.id),
                "group_name": g.group_name,
                "product_category": g.product_category,
                "delivery_city": g.delivery_city,
                "member_count": g.member_count,
                "total_quantity": g.total_quantity,
                "unit": g.unit,
                "total_budget": g.total_budget,
                "total_savings": g.total_savings,
                "status": g.status,
                "created_at": g.created_at.isoformat() if g.created_at else None,
            }
            for g in groups
        ]
    }
