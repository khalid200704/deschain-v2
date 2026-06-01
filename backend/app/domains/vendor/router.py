"""
Vendor domain router
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.models import Vendor, User

router = APIRouter()


def _vendor_dict(v: Vendor, user: User = None) -> dict:
    return {
        "id": str(v.id),
        "vendor_name": v.vendor_name,
        "business_category": v.business_category,
        "city": v.city,
        "province": v.province,
        "reliability_score": v.reliability_score,
        "total_orders": v.total_orders,
        "verification_status": v.verification_status,
        "is_active": v.is_active,
        "min_order_quantity": v.min_order_quantity,
        "average_lead_time_days": v.average_lead_time_days,
        "primary_contact_person": v.primary_contact_person,
        "description": v.description,
    }


@router.get("/")
async def list_vendors(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    search: str = Query(default=""),
    city: str = Query(default=""),
    category: str = Query(default=""),
):
    """Daftar semua vendor aktif"""
    q = db.query(Vendor).filter(Vendor.is_active == True)

    if search:
        q = q.filter(Vendor.vendor_name.ilike(f"%{search}%"))
    if city:
        q = q.filter(Vendor.city.ilike(f"%{city}%"))
    if category:
        q = q.filter(Vendor.business_category.ilike(f"%{category}%"))

    vendors = q.order_by(Vendor.reliability_score.desc()).limit(50).all()

    return {
        "success": True,
        "data": [_vendor_dict(v) for v in vendors],
        "total": len(vendors),
    }


@router.get("/{vendor_id}")
async def get_vendor(
    vendor_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Detail vendor"""
    import uuid
    try:
        v = db.query(Vendor).filter(Vendor.id == uuid.UUID(vendor_id)).first()
    except Exception:
        v = None

    if not v:
        return {"success": False, "message": "Vendor tidak ditemukan"}

    return {"success": True, "data": _vendor_dict(v)}
