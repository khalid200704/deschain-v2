"""
Transaction domain router
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.models import UMKM, GroupMembership, ProcurementGroup, Transaction, Vendor

router = APIRouter()


@router.get("/my")
async def get_my_transactions(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Riwayat transaksi pengguna dari keanggotaan grup"""
    umkm = db.query(UMKM).filter(UMKM.user_id == current_user["user_id"]).first()
    if not umkm:
        return {"success": True, "data": [], "summary": {"total": 0, "total_savings": 0, "completed": 0}}

    memberships = (
        db.query(GroupMembership)
        .filter(GroupMembership.umkm_id == umkm.id)
        .order_by(GroupMembership.joined_at.desc())
        .limit(30)
        .all()
    )

    group_ids = [m.group_id for m in memberships if m.group_id]
    groups_by_id = {}
    if group_ids:
        grps = db.query(ProcurementGroup).filter(ProcurementGroup.id.in_(group_ids)).all()
        groups_by_id = {g.id: g for g in grps}

    vendor_by_group = {}
    if group_ids:
        grps_with_vendor = db.query(ProcurementGroup).filter(
            ProcurementGroup.id.in_(group_ids),
            ProcurementGroup.selected_vendor_id.isnot(None),
        ).all()
        for g in grps_with_vendor:
            if g.selected_vendor_id:
                v = db.query(Vendor).filter(Vendor.id == g.selected_vendor_id).first()
                if v:
                    vendor_by_group[g.id] = v.vendor_name

    result = []
    total_savings = 0
    completed = 0

    for m in memberships:
        group = groups_by_id.get(m.group_id)
        savings_amt = (m.individual_budget or 0) * (m.savings_percentage or 0) / 100
        total_savings += savings_amt

        status = "completed" if m.status in ("completed", "confirmed") and group and group.status == "completed" else \
                 "active" if m.status == "confirmed" else "pending"

        if status == "completed":
            completed += 1

        result.append({
            "id": str(m.id),
            "group_name": group.group_name if group else "Grup Pengadaan",
            "group_status": group.status if group else "forming",
            "vendor": vendor_by_group.get(m.group_id, "Menunggu konfirmasi vendor"),
            "amount": m.individual_budget,
            "savings": round(savings_amt) if m.savings_percentage else 0,
            "savings_pct": m.savings_percentage or 0,
            "status": status,
            "date": m.joined_at.isoformat() if m.joined_at else None,
            "quantity": m.quantity,
        })

    return {
        "success": True,
        "data": result,
        "summary": {
            "total": len(result),
            "total_savings": round(total_savings),
            "completed": completed,
        },
    }
