"""
Analytics domain — dashboard KPIs, credit trail, savings trends, demand forecast (SMA + EOQ).
"""
from collections import defaultdict
from datetime import datetime, timedelta
from math import sqrt
from typing import Optional
from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
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
        return {"success": True, "data": _demo_credit_trail(), "is_demo": True}

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
        return {"success": True, "data": _demo_credit_trail(), "is_demo": True}

    return {"success": True, "data": trail[:15], "is_demo": False}


@router.get("/savings")
async def get_savings(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Ringkasan penghematan pengguna"""
    return {"success": True, "data": {"message": "Coming soon"}}


@router.get("/credit-trail/export")
async def export_credit_trail(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Export credit trail sebagai JSON — bisa digunakan untuk pengajuan KUR/pembiayaan.

    Data ini sesuai dengan kebutuhan ICS (Innovative Credit Scoring) per POJK No. 29/2024.
    """
    user_id = current_user["user_id"]
    umkm = db.query(UMKM).filter(UMKM.user_id == user_id).first()

    trail_data = []
    total_savings = 0
    total_value = 0

    if umkm:
        requests = db.query(ProcurementRequest).filter(
            ProcurementRequest.umkm_id == umkm.id
        ).order_by(ProcurementRequest.created_at.desc()).all()

        memberships = db.query(GroupMembership).filter(
            GroupMembership.umkm_id == umkm.id,
            GroupMembership.status == "completed",
        ).all()

        group_ids = [m.group_id for m in memberships if m.group_id]
        groups_by_id = {}
        if group_ids:
            groups = db.query(ProcurementGroup).filter(ProcurementGroup.id.in_(group_ids)).all()
            groups_by_id = {g.id: g for g in groups}

        for req in requests:
            trail_data.append({
                "tanggal": req.created_at.isoformat() if req.created_at else None,
                "jenis": "Permintaan Pengadaan",
                "produk": req.product_name,
                "nilai_rp": req.budget,
                "status": req.status,
            })
            total_value += req.budget or 0

        for m in memberships:
            group = groups_by_id.get(m.group_id)
            savings = (m.individual_budget or 0) * (m.savings_percentage or 0) / 100
            trail_data.append({
                "tanggal": m.joined_at.isoformat() if m.joined_at else None,
                "jenis": "Transaksi Kolektif",
                "produk": group.group_name if group else "Grup Pengadaan",
                "nilai_rp": m.individual_budget,
                "penghematan_rp": round(savings),
                "penghematan_persen": m.savings_percentage,
                "status": "selesai",
            })
            total_savings += savings

    export = {
        "dokumen": "Credit Trail Deschain",
        "versi_pojk": "POJK No. 29/2024 (ICS — Innovative Credit Scoring)",
        "platform": "Deschain — Platform Pengadaan Kolektif AI untuk UMKM",
        "pemilik": {
            "nama": f"{umkm.owner_name}" if umkm else current_user.get("email"),
            "usaha": umkm.business_name if umkm else "-",
            "kota": umkm.city if umkm else "-",
            "credit_score": umkm.credit_score if umkm else 0,
        },
        "ringkasan": {
            "total_transaksi": len(trail_data),
            "total_nilai_rp": total_value,
            "total_penghematan_rp": round(total_savings),
            "periode": "Sejak bergabung Deschain",
        },
        "riwayat": sorted(trail_data, key=lambda x: x.get("tanggal") or "", reverse=True),
        "diekspor_pada": datetime.utcnow().isoformat(),
        "catatan": "Dokumen ini merupakan rekam jejak transaksi digital UMKM yang dapat digunakan sebagai data alternatif pengajuan kredit/pembiayaan.",
    }

    return JSONResponse(
        content={"success": True, "data": export},
        headers={"Content-Disposition": "attachment; filename=credit-trail-deschain.json"},
    )


# ---------------------------------------------------------------------------
# Demand Forecasting — SMA + EOQ (dari Forcasting_&_lot_sizing.ipynb)
# ---------------------------------------------------------------------------

def _sma(series: list, window: int) -> list:
    """
    Simple Moving Average: rata-rata bergerak dari window terakhir.
    Sesuai implementasi notebook AutoSelectorSystem.
    """
    result = []
    for i in range(len(series)):
        start = max(0, i - window + 1)
        result.append(round(sum(series[start : i + 1]) / (i - start + 1), 2))
    return result


def _forecast_sma(series: list, window: int, horizon: int) -> list:
    """Project SMA ke depan sejumlah horizon langkah."""
    if not series:
        return [0.0] * horizon
    last_avg = sum(series[-window:]) / min(window, len(series))
    return [round(last_avg, 2)] * horizon


def _eoq(annual_demand: float, ordering_cost: float = 50_000,
          holding_rate: float = 0.20, avg_unit_price: float = 10_000) -> int:
    """
    Economic Order Quantity: EOQ = sqrt(2 × D × S / H)
    D = permintaan tahunan, S = biaya pesan per order, H = biaya simpan per unit/tahun.
    Implementasi langsung dari economic_order_quantity() di notebook.
    """
    H = holding_rate * max(avg_unit_price, 1)
    if H <= 0 or annual_demand <= 0:
        return 0
    return max(1, int(sqrt(2 * annual_demand * ordering_cost / H)))


def _demo_forecast(product_category: Optional[str], horizon_weeks: int = 4) -> dict:
    """Demo forecast data untuk akun baru."""
    cat = product_category or "Sembako"
    today = datetime.utcnow()
    return {
        "product_category": cat,
        "historical_weeks": 0,
        "weekly_history": [],
        "smoothed": [],
        "forecast": [
            {
                "week": (today + timedelta(weeks=i + 1)).strftime("%Y-W%U"),
                "date": (today + timedelta(weeks=i + 1)).strftime("%Y-%m-%d"),
                "predicted_demand": round(50 + i * 5, 1),
                "recommended_order": 120,
            }
            for i in range(horizon_weeks)
        ],
        "eoq": {
            "recommended_order_qty": 120,
            "weekly_avg_demand": 50.0,
            "annual_demand_estimate": 2600.0,
        },
        "is_demo": True,
    }


@router.get("/forecast")
async def get_forecast(
    product_category: Optional[str] = Query(None),
    horizon_weeks: int = Query(4, ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Demand forecast menggunakan Simple Moving Average (window = 7 minggu) + EOQ.

    Sumber data: riwayat ProcurementRequest UMKM dikelompokkan per minggu.
    Algoritma:
      1. SMA(7) untuk smoothing dan proyeksi demand ke depan
      2. EOQ = sqrt(2DS/H) untuk ukuran order optimal (minimasi biaya pesan + simpan)
    """
    umkm = db.query(UMKM).filter(UMKM.user_id == current_user["user_id"]).first()
    if not umkm:
        return {"success": True, "data": _demo_forecast(product_category, horizon_weeks)}

    q = db.query(ProcurementRequest).filter(ProcurementRequest.umkm_id == umkm.id)
    if product_category:
        q = q.filter(ProcurementRequest.product_category == product_category)
    history = q.order_by(ProcurementRequest.created_at).all()

    if not history:
        return {"success": True, "data": _demo_forecast(product_category, horizon_weeks)}

    # Kelompokkan quantity per minggu (YYYY-WNN)
    weekly: dict = defaultdict(float)
    for req in history:
        if req.created_at and req.quantity:
            week_key = req.created_at.strftime("%Y-W%U")
            weekly[week_key] += req.quantity

    sorted_weeks = sorted(weekly.keys())
    series = [weekly[w] for w in sorted_weeks]

    if not series:
        return {"success": True, "data": _demo_forecast(product_category, horizon_weeks)}

    WINDOW = 7
    smoothed    = _sma(series, WINDOW)
    forecasted  = _forecast_sma(series, WINDOW, horizon_weeks)

    # EOQ — unit price = total budget / total quantity (Rp per unit)
    weekly_avg     = sum(series) / len(series)
    annual_dem     = weekly_avg * 52
    total_qty_all  = sum(r.quantity or 1 for r in history)
    total_budg_all = sum(r.budget  or 0 for r in history)
    unit_price     = max(total_budg_all / max(total_qty_all, 1), 1_000)
    eoq_qty     = _eoq(annual_dem, avg_unit_price=unit_price)

    today = datetime.utcnow()
    reorder_schedule = [
        {
            "week"            : (today + timedelta(weeks=i + 1)).strftime("%Y-W%U"),
            "date"            : (today + timedelta(weeks=i + 1)).strftime("%Y-%m-%d"),
            "predicted_demand": forecasted[i],
            "recommended_order": eoq_qty,
        }
        for i in range(horizon_weeks)
    ]

    return {
        "success": True,
        "data": {
            "product_category": product_category or "Semua Kategori",
            "historical_weeks": len(series),
            "weekly_history"  : [{"week": w, "quantity": weekly[w]} for w in sorted_weeks[-12:]],
            "smoothed"        : smoothed[-12:],
            "forecast"        : reorder_schedule,
            "eoq": {
                "recommended_order_qty": eoq_qty,
                "weekly_avg_demand"    : round(weekly_avg, 2),
                "annual_demand_estimate": round(annual_dem, 2),
            },
            "is_demo": False,
        },
    }
