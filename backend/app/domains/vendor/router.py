"""
Vendor domain router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
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


@router.get("/me")
async def get_my_vendor_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Ambil profil vendor milik user yang sedang login."""
    v = db.query(Vendor).filter(Vendor.user_id == current_user["user_id"]).first()
    if not v:
        return {"success": True, "data": None}
    return {"success": True, "data": _vendor_dict(v)}


@router.post("/setup")
async def setup_vendor_profile(
    body: dict,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Buat atau perbarui profil vendor untuk user yang sedang login."""
    if current_user.get("user_type") != "vendor":
        raise HTTPException(status_code=403, detail="Hanya akun vendor yang dapat mengatur profil vendor")

    vendor_name = (body.get("vendor_name") or "").strip()
    if not vendor_name:
        raise HTTPException(status_code=400, detail="Nama vendor wajib diisi")

    v = db.query(Vendor).filter(Vendor.user_id == current_user["user_id"]).first()
    if v:
        # Update
        for field in ("vendor_name", "business_category", "city", "province",
                      "address", "description", "primary_contact_person",
                      "primary_phone", "min_order_quantity", "average_lead_time_days"):
            if body.get(field) is not None:
                setattr(v, field, body[field])
        if body.get("product_categories"):
            v.product_categories = body["product_categories"]
        db.commit()
        db.refresh(v)
        return {"success": True, "message": "Profil vendor diperbarui", "data": _vendor_dict(v)}
    else:
        # Create
        v = Vendor(
            user_id=current_user["user_id"],
            vendor_name=vendor_name,
            business_category=body.get("business_category", ""),
            city=body.get("city", ""),
            province=body.get("province", ""),
            address=body.get("address", ""),
            description=body.get("description", ""),
            primary_contact_person=body.get("primary_contact_person", ""),
            primary_phone=body.get("primary_phone", ""),
            min_order_quantity=body.get("min_order_quantity"),
            average_lead_time_days=body.get("average_lead_time_days"),
            product_categories=body.get("product_categories", []),
            is_active=True,
            verification_status="pending",
        )
        db.add(v)
        db.commit()
        db.refresh(v)
        return {"success": True, "message": "Profil vendor berhasil dibuat", "data": _vendor_dict(v)}


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
    except ValueError:
        v = None

    if not v:
        return {"success": False, "message": "Vendor tidak ditemukan"}

    return {"success": True, "data": _vendor_dict(v)}
