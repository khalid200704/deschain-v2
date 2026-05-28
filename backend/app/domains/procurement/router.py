"""
Procurement domain router — buat permintaan pengadaan, cari grup
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.security import get_current_user
from app.models import UMKM, ProcurementRequest

import structlog

logger = structlog.get_logger()
router = APIRouter()


class ProcurementRequestCreate(BaseModel):
    product_name: str
    product_category: str
    quantity: float
    unit: str
    budget: float
    delivery_city: str
    delivery_address: str
    product_description: Optional[str] = None
    quality_specifications: Optional[str] = None
    preferred_delivery_date: Optional[datetime] = None
    delivery_urgency: str = "normal"
    special_requirements: Optional[str] = None


@router.post("/request", status_code=status.HTTP_201_CREATED)
async def create_request(
    data: ProcurementRequestCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Buat permintaan pengadaan baru"""
    umkm = db.query(UMKM).filter(UMKM.user_id == current_user["user_id"]).first()
    if not umkm:
        raise HTTPException(400, "Profil UMKM belum dibuat. Lengkapi profil terlebih dahulu.")

    req = ProcurementRequest(
        umkm_id=umkm.id,
        product_name=data.product_name,
        product_category=data.product_category,
        product_description=data.product_description,
        quantity=data.quantity,
        unit=data.unit,
        budget=data.budget,
        delivery_city=data.delivery_city,
        delivery_address=data.delivery_address,
        quality_specifications=data.quality_specifications,
        preferred_delivery_date=data.preferred_delivery_date,
        delivery_urgency=data.delivery_urgency,
        special_requirements=data.special_requirements,
        status="active",
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    logger.info("procurement_request_created", request_id=str(req.id))
    return {
        "success": True,
        "message": "Permintaan pengadaan berhasil dibuat",
        "data": {
            "id": str(req.id),
            "product_name": req.product_name,
            "product_category": req.product_category,
            "quantity": req.quantity,
            "unit": req.unit,
            "status": req.status,
            "created_at": req.created_at.isoformat(),
        },
    }


@router.get("/requests/my")
async def get_my_requests(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Ambil daftar permintaan pengadaan milik pengguna"""
    umkm = db.query(UMKM).filter(UMKM.user_id == current_user["user_id"]).first()
    if not umkm:
        return {"success": True, "data": []}

    requests = (
        db.query(ProcurementRequest)
        .filter(ProcurementRequest.umkm_id == umkm.id)
        .order_by(ProcurementRequest.created_at.desc())
        .limit(20)
        .all()
    )

    return {
        "success": True,
        "data": [
            {
                "id": str(r.id),
                "product_name": r.product_name,
                "product_category": r.product_category,
                "quantity": r.quantity,
                "unit": r.unit,
                "budget": r.budget,
                "delivery_city": r.delivery_city,
                "status": r.status,
                "created_at": r.created_at.isoformat(),
            }
            for r in requests
        ],
    }
