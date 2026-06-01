"""
Analytics domain — dashboard KPIs, credit trail, savings trends
"""
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.security import get_current_user
from app.models import User, UMKM, ProcurementRequest, GroupMembership, Transaction, ProcurementGroup

import structlog

logger = structlog.get_logger()
router = APIRouter()


def _demo_dashboard():
    """Realistic demo data for new/empty accounts"""
    return {
        "total_procurement_value": 48_500_000,
        "total_savings": 9_225_000,
        "average_savings_percentage": 19.0,
        "total_transactions": 7,
        "credit_score": 4.3,
        "weekly_savings": [
            {"week": "Minggu 1", "amount": 1_200_000},
            {"week": "Minggu 2", "amount": 2_450_000},
            {"week": "Minggu 3", "amount": 3_100_000},
            {"week": "Minggu 4", "amount": 2_475_000},
        ],
        "is_demo": True,
    }


def _demo_credit_trail():
    return [
        {
            "id": "ct-001",
            "date": (datetime.utcnow() - timedelta(days=2)).isoformat(),
            "event": "Transaksi Selesai",
            "detail": "Beras Premium Pandan Wangi — Grup Tani Sejahtera Pontianak",
            "amount": 4_250_000,
            "savings": 850_000,
            "savings_pct": 20.0,
            "type": "completed",
        },
        {
            "id": "ct-002",
            "date": (datetime.utcnow() - timedelta(days=9)).isoformat(),
            "event": "Bergabung Grup",
            "detail": "Minyak Goreng Kemasan — Grup Pedagang Pasar Sambas",
            "amount": 3_600_000,
            "savings": 540_000,
            "savings_pct": 15.0,
            "type": "joined",
        },
        {
            "id": "ct-003",
            "date": (datetime.utcnow() - timedelta(days=16)).isoformat(),
            "event": "Transaksi Selesai",
            "detail": "Tepung Terigu Protein Tinggi — Grup Bakeri Kalimantan",
            "amount": 2_800_000,
            "savings": 560_000,
            "savings_pct": 20.0,
            "type": "completed",
        },
        {
            "id": "ct-004",
            "date": (datetime.utcnow() - timedelta(days=23)).isoformat(),
            "event": "Permintaan Dibuat",
            "detail": "Gula Pasir 50 kg — menunggu pencocokan grup",
            "amount": 1_250_000,
            "savings": None,
            "savings_pct": None,
            "type": "requested",
        },
        {
            "id": "ct-005",
            "date": (datetime.utcnow() - timedelta(days=31)).isoformat(),
            "event": "Transaksi Selesai",
            "detail": "Kemasan Plastik Roll — Grup Produsen Makanan Pontianak",
            "amount": 3_100_000,
            "savings": 775_000,
            "savings_pct": 25.0,
            "type": "completed",
        },
    ]


@router.get("/dashboard")
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """KPI dashboard untuk pengguna yang sedang login"""
    user_id = current_user["user_id"]

    umkm = db.query(UMKM).filter(UMKM.user_id == user_id).first()
    if not umkm:
        return {"success": True, "data": _demo_dashboard()}

    total_procurement = db.query(func.sum(ProcurementRequest.budget)).filter(
        ProcurementRequest.umkm_id == umkm.id,
        ProcurementRequest.status.in_(["active", "matched", "completed"]),
    ).scalar() or 0

    memberships = db.query(GroupMembership).filter(
        GroupMembership.umkm_id == umkm.id,
        GroupMembership.status.in_(["confirmed", "completed"]),
    ).all()

    total_savings = sum(
        (m.individual_budget or 0) * (m.savings_percentage or 0) / 100
        for m in memberships
    )
    avg_savings_pct = (
        sum(m.savings_percentage or 0 for m in memberships) / len(memberships)
        if memberships else 0
    )

    total_tx = len(memberships)
    credit_score = umkm.credit_score or 0

    # Weekly savings — last 4 weeks
    weekly_savings = []
    for i in range(4, 0, -1):
        week_start = datetime.utcnow() - timedelta(weeks=i)
        week_end = datetime.utcnow() - timedelta(weeks=i - 1)
        week_data = [
            m for m in memberships
            if m.joined_at and week_start <= m.joined_at <= week_end
        ]
        week_savings = sum(
            (m.individual_budget or 0) * (m.savings_percentage or 0) / 100
            for m in week_data
        )
        weekly_savings.append({"week": f"Minggu {5 - i}", "amount": week_savings})

    if total_procurement == 0:
        return {"success": True, "data": _demo_dashboard()}

    return {
        "success": True,
        "data": {
            "total_procurement_value": total_procurement,
            "total_savings": total_savings,
            "average_savings_percentage": round(avg_savings_pct, 1),
            "total_transactions": total_tx,
            "credit_score": round(credit_score, 1),
            "weekly_savings": weekly_savings,
            "is_demo": False,
        },
    }


@router.get("/credit-trail")
async def get_credit_trail(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Riwayat aktivitas pengadaan (credit trail) pengguna"""
    user_id = current_user["user_id"]
    umkm = db.query(UMKM).filter(UMKM.user_id == user_id).first()

    if not umkm:
        return {"success": True, "data": _demo_credit_trail()}

    # Combine procurement requests + group memberships into a timeline
    trail = []

    requests = db.query(ProcurementRequest).filter(
        ProcurementRequest.umkm_id == umkm.id
    ).order_by(ProcurementRequest.created_at.desc()).limit(20).all()

    for req in requests:
        trail.append({
            "id": str(req.id),
            "date": req.created_at.isoformat() if req.created_at else None,
            "event": "Permintaan Dibuat" if req.status == "draft" else "Transaksi Selesai",
            "detail": f"{req.product_name} {req.quantity} {req.unit or ''} — {req.delivery_city or ''}",
            "amount": req.budget,
            "savings": None,
            "savings_pct": None,
            "type": "requested" if req.status == "draft" else "completed",
        })

    memberships = db.query(GroupMembership).filter(
        GroupMembership.umkm_id == umkm.id
    ).order_by(GroupMembership.joined_at.desc()).limit(20).all()

    # Batch-load groups to avoid N+1 query
    group_ids = [m.group_id for m in memberships if m.group_id]
    groups_by_id = {}
    if group_ids:
        groups = db.query(ProcurementGroup).filter(ProcurementGroup.id.in_(group_ids)).all()
        groups_by_id = {g.id: g for g in groups}

    for m in memberships:
        group = groups_by_id.get(m.group_id)
        savings_amt = (m.individual_budget or 0) * (m.savings_percentage or 0) / 100
        trail.append({
            "id": str(m.id),
            "date": m.joined_at.isoformat() if m.joined_at else None,
            "event": "Bergabung Grup",
            "detail": group.group_name if group else "Grup Pengadaan",
            "amount": m.individual_budget,
            "savings": savings_amt if m.savings_percentage else None,
            "savings_pct": m.savings_percentage,
            "type": "joined",
        })

    trail.sort(key=lambda x: (x["date"] or ""), reverse=True)
    if not trail:
        return {"success": True, "data": _demo_credit_trail()}

    return {"success": True, "data": trail[:15]}


@router.get("/savings")
async def get_savings(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Ringkasan penghematan pengguna"""
    return {"success": True, "data": {"message": "Coming soon"}}
