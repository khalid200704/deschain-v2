"""
AI Group Matching router — algoritma pencocokan permintaan pengadaan serupa
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.security import get_current_user
from app.models import ProcurementRequest, UMKM, ProcurementGroup, GroupMembership
import uuid as _uuid

import structlog

logger = structlog.get_logger()
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


def _compute_similarity(req_a: ProcurementRequest, req_b: ProcurementRequest) -> float:
    """
    Hitung skor kesamaan antara dua permintaan pengadaan.
    Faktor: kategori produk (40%), kota (30%), budget range (20%), urgency (10%)
    """
    score = 0.0

    # Kesamaan kategori produk (bobot 40%)
    if req_a.product_category and req_b.product_category:
        if req_a.product_category.lower() == req_b.product_category.lower():
            score += 0.40
        elif req_a.product_category.lower()[:4] == req_b.product_category.lower()[:4]:
            score += 0.20

    # Kesamaan kota (bobot 30%)
    if req_a.delivery_city and req_b.delivery_city:
        if req_a.delivery_city.lower() == req_b.delivery_city.lower():
            score += 0.30

    # Budget dalam range yang serupa (bobot 20%)
    if req_a.budget and req_b.budget and req_a.budget > 0:
        ratio = min(req_a.budget, req_b.budget) / max(req_a.budget, req_b.budget)
        if ratio >= 0.5:
            score += 0.20 * ratio

    # Urgency sama (bobot 10%)
    if req_a.delivery_urgency == req_b.delivery_urgency:
        score += 0.10

    return round(score, 3)


def _estimate_savings(member_count: int, total_quantity: float) -> float:
    """Estimasi penghematan berdasarkan skala grup (Pinduoduo model)"""
    if member_count >= 10:
        return 0.25
    elif member_count >= 5:
        return 0.20
    elif member_count >= 3:
        return 0.15
    return 0.08


class MatchRequest(BaseModel):
    product_name: str
    product_category: str
    quantity: float
    unit: str
    budget: float
    delivery_city: str
    delivery_urgency: str = "normal"


@router.post("/groups/match")
@limiter.limit("20/minute")
async def match_groups(
    request: Request,
    body: MatchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    AI Group Matching — temukan permintaan pengadaan serupa dan rekomendasikan grup.
    Algoritma: similarity scoring berbasis kategori, lokasi, budget range, dan urgency.
    """
    # Ambil semua request aktif dari pengguna lain (selain diri sendiri)
    umkm = db.query(UMKM).filter(UMKM.user_id == current_user["user_id"]).first()
    my_umkm_id = umkm.id if umkm else None

    active_requests = (
        db.query(ProcurementRequest)
        .filter(
            ProcurementRequest.status == "active",
            ProcurementRequest.umkm_id != my_umkm_id,
        )
        .order_by(ProcurementRequest.created_at.desc())
        .limit(100)
        .all()
    )

    # Buat pseudo-request dari input untuk perbandingan
    pseudo = ProcurementRequest(
        product_category=body.product_category,
        delivery_city=body.delivery_city,
        budget=body.budget,
        delivery_urgency=body.delivery_urgency,
    )

    # Hitung skor kesamaan dan kelompokkan berdasarkan cluster
    scored = []
    for req in active_requests:
        sim = _compute_similarity(pseudo, req)
        if sim >= 0.35:  # Ambang batas minimal
            scored.append((sim, req))

    scored.sort(key=lambda x: x[0], reverse=True)

    # Bentuk grup dari request dengan skor tertinggi
    groups = []
    used_categories = set()

    for sim, req in scored[:15]:
        cat_key = f"{req.product_category}_{req.delivery_city}"

        # Cari grup yang sudah ada untuk kategori ini
        existing_group = next((g for g in groups if g["_key"] == cat_key), None)

        if existing_group:
            existing_group["member_count"] += 1
            existing_group["total_quantity"] += req.quantity
            existing_group["member_details"].append({
                "id": str(req.id),
                "product_name": req.product_name,
                "quantity": req.quantity,
                "unit": req.unit,
            })
        else:
            member_count = 2  # user saat ini + 1 yang ditemukan
            total_qty = body.quantity + req.quantity
            savings_pct = _estimate_savings(member_count, total_qty)

            groups.append({
                "_key": cat_key,
                "id": f"grp_{str(req.id)[:8]}",
                "group_name": f"Grup {body.product_category} {body.delivery_city}",
                "product_category": req.product_category,
                "delivery_city": req.delivery_city,
                "member_count": member_count,
                "total_quantity": total_qty,
                "unit": req.unit or body.unit,
                "similarity_score": sim,
                "estimated_savings_pct": round(savings_pct * 100, 1),
                "estimated_savings_amount": round(body.budget * savings_pct),
                "status": "open",
                "member_details": [
                    {
                        "id": str(req.id),
                        "product_name": req.product_name,
                        "quantity": req.quantity,
                        "unit": req.unit,
                    }
                ],
            })

    # Jika tidak ada data real, kembalikan grup demo dengan data seeded
    if not groups:
        groups = _generate_demo_groups(body)

    # Bersihkan field internal sebelum return
    for g in groups:
        g.pop("_key", None)

    logger.info(
        "group_matching_completed",
        product=body.product_name,
        city=body.delivery_city,
        groups_found=len(groups),
    )

    return {
        "success": True,
        "message": f"Ditemukan {len(groups)} grup pengadaan yang cocok",
        "data": {
            "query": {
                "product_name": body.product_name,
                "product_category": body.product_category,
                "quantity": body.quantity,
                "unit": body.unit,
                "delivery_city": body.delivery_city,
            },
            "groups": groups[:5],  # Maksimal 5 rekomendasi
        },
    }


def _generate_demo_groups(body: MatchRequest) -> list:
    """Grup demo untuk keperluan demonstrasi saat belum ada data real"""
    city = body.delivery_city or "Pontianak"
    cat = body.product_category or "Sembako"

    return [
        {
            "_key": "demo_1",
            "id": "grp_demo_001",
            "group_name": f"Grup {cat} {city} — Paket Hemat",
            "product_category": cat,
            "delivery_city": city,
            "member_count": 5,
            "total_quantity": body.quantity * 4,
            "unit": body.unit,
            "similarity_score": 0.92,
            "estimated_savings_pct": 20.0,
            "estimated_savings_amount": round(body.budget * 0.20),
            "status": "open",
            "member_details": [
                {"id": "req_demo_1", "product_name": f"{cat} — Warung Bu Siti", "quantity": body.quantity * 0.8, "unit": body.unit},
                {"id": "req_demo_2", "product_name": f"{cat} — Toko Pak Fauzi", "quantity": body.quantity * 1.2, "unit": body.unit},
                {"id": "req_demo_3", "product_name": f"{cat} — UD Makmur Jaya", "quantity": body.quantity, "unit": body.unit},
            ],
        },
        {
            "_key": "demo_2",
            "id": "grp_demo_002",
            "group_name": f"Grup {cat} {city} — Komunitas UMKM",
            "product_category": cat,
            "delivery_city": city,
            "member_count": 8,
            "total_quantity": body.quantity * 7,
            "unit": body.unit,
            "similarity_score": 0.85,
            "estimated_savings_pct": 22.0,
            "estimated_savings_amount": round(body.budget * 0.22),
            "status": "open",
            "member_details": [
                {"id": "req_demo_4", "product_name": f"{cat} — CV Berkah", "quantity": body.quantity * 1.5, "unit": body.unit},
                {"id": "req_demo_5", "product_name": f"{cat} — Koperasi Maju", "quantity": body.quantity * 2, "unit": body.unit},
            ],
        },
        {
            "_key": "demo_3",
            "id": "grp_demo_003",
            "group_name": f"Grup {cat} {city} — Express Delivery",
            "product_category": cat,
            "delivery_city": city,
            "member_count": 3,
            "total_quantity": body.quantity * 2.5,
            "unit": body.unit,
            "similarity_score": 0.78,
            "estimated_savings_pct": 15.0,
            "estimated_savings_amount": round(body.budget * 0.15),
            "status": "open",
            "member_details": [
                {"id": "req_demo_6", "product_name": f"{cat} — Depot Mulia", "quantity": body.quantity * 0.5, "unit": body.unit},
            ],
        },
    ]


class JoinGroupBody(BaseModel):
    product_name: str
    product_category: str
    quantity: float
    unit: str
    budget: float
    delivery_city: str
    delivery_urgency: str = "normal"
    # Group info (bisa dari matching result)
    group_id: Optional[str] = None
    group_name: Optional[str] = None


def _get_or_create_umkm(db: Session, user_id: str) -> UMKM:
    """Buat profil UMKM dasar jika belum ada"""
    from app.models import User
    umkm = db.query(UMKM).filter(UMKM.user_id == user_id).first()
    if umkm:
        return umkm
    user = db.query(User).filter(User.id == user_id).first()
    umkm = UMKM(
        user_id=user_id,
        business_name=f"Usaha {user.first_name}" if user else "UMKM",
        industry_category="Perdagangan",
        city="Pontianak",
        province="Kalimantan Barat",
        verification_status="pending",
        credit_score=3.0,
        total_transactions=0,
        total_procurement_value=0,
    )
    db.add(umkm)
    db.flush()
    return umkm


@router.post("/groups/join")
async def join_group(
    body: JoinGroupBody,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Bergabung ke grup pengadaan — buat permintaan + keanggotaan grup"""
    umkm = _get_or_create_umkm(db, current_user["user_id"])

    # Cari atau buat ProcurementGroup
    group = None
    if body.group_id:
        try:
            group = db.query(ProcurementGroup).filter(
                ProcurementGroup.id == _uuid.UUID(body.group_id)
            ).first()
        except Exception:
            pass

    if not group:
        # Cari grup terbuka yang cocok di DB
        group = db.query(ProcurementGroup).filter(
            ProcurementGroup.product_category == body.product_category,
            ProcurementGroup.delivery_city == body.delivery_city,
            ProcurementGroup.status == "forming",
        ).first()

    if not group:
        # Buat grup baru
        group = ProcurementGroup(
            group_name=body.group_name or f"Grup {body.product_category} {body.delivery_city}",
            product_category=body.product_category,
            unit=body.unit,
            total_quantity=body.quantity,
            total_budget=body.budget,
            delivery_city=body.delivery_city,
            status="forming",
            member_count=0,
            total_savings=0,
            created_by_umkm_id=umkm.id,
        )
        db.add(group)
        db.flush()

    # Cek apakah sudah bergabung
    existing = db.query(GroupMembership).filter(
        GroupMembership.group_id == group.id,
        GroupMembership.umkm_id == umkm.id,
    ).first()
    if existing:
        return {"success": False, "message": "Anda sudah bergabung di grup ini."}

    # Buat ProcurementRequest untuk user ini
    req = ProcurementRequest(
        umkm_id=umkm.id,
        product_name=body.product_name,
        product_category=body.product_category,
        quantity=body.quantity,
        unit=body.unit,
        budget=body.budget,
        delivery_city=body.delivery_city,
        delivery_urgency=body.delivery_urgency,
        status="matched",
    )
    db.add(req)
    db.flush()

    # Buat keanggotaan grup
    savings_pct = _estimate_savings(group.member_count + 1, group.total_quantity + body.quantity) * 100
    membership = GroupMembership(
        group_id=group.id,
        umkm_id=umkm.id,
        request_id=req.id,
        quantity=body.quantity,
        individual_budget=body.budget,
        savings_percentage=round(savings_pct, 1),
        status="confirmed",
    )
    db.add(membership)

    # Update group stats
    group.member_count = (group.member_count or 0) + 1
    group.total_quantity = (group.total_quantity or 0) + body.quantity
    group.total_budget = (group.total_budget or 0) + body.budget
    group.total_savings = (group.total_savings or 0) + body.budget * savings_pct / 100

    # Update UMKM stats
    umkm.total_transactions = (umkm.total_transactions or 0) + 1
    umkm.total_procurement_value = (umkm.total_procurement_value or 0) + body.budget

    db.commit()

    logger.info("group_joined", group_id=str(group.id), umkm_id=str(umkm.id))

    return {
        "success": True,
        "message": f"Berhasil bergabung ke {group.group_name}",
        "data": {
            "group_id": str(group.id),
            "group_name": group.group_name,
            "member_count": group.member_count,
            "estimated_savings_pct": round(savings_pct, 1),
            "estimated_savings_amount": round(body.budget * savings_pct / 100),
        },
    }
