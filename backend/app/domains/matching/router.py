"""
AI Group Matching router — algoritma pencocokan permintaan pengadaan serupa.
Menggunakan Jaccard similarity untuk filtering + 0/1 Knapsack DP untuk
memilih komposisi grup yang memaksimalkan total penghematan kolektif.
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.security import get_current_user
from app.models import ProcurementRequest, UMKM, ProcurementGroup, GroupMembership, Vendor
import uuid as _uuid

import structlog

logger = structlog.get_logger()
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


def _jaccard(a: str, b: str) -> float:
    set_a = set(a.lower().split())
    set_b = set(b.lower().split())
    if not set_a or not set_b:
        return 0.0
    return len(set_a & set_b) / len(set_a | set_b)


def _compute_similarity(req_a, req_b) -> float:
    """
    Skor kesamaan dua permintaan pengadaan.
    Bobot: kategori 40%, kota 30%, budget 20%, urgency 10%.
    """
    score = 0.0
    if req_a.product_category and req_b.product_category:
        cat_sim = _jaccard(req_a.product_category, req_b.product_category)
        if cat_sim >= 0.8:    score += 0.40
        elif cat_sim >= 0.4:  score += 0.25
        elif cat_sim >= 0.2:  score += 0.15
        elif req_a.product_category.lower()[:4] == req_b.product_category.lower()[:4]:
            score += 0.10
    if req_a.delivery_city and req_b.delivery_city:
        city_a = req_a.delivery_city.lower().strip()
        city_b = req_b.delivery_city.lower().strip()
        if city_a == city_b:                         score += 0.30
        elif city_a in city_b or city_b in city_a:  score += 0.15
    if req_a.budget and req_b.budget and req_a.budget > 0:
        ratio = min(req_a.budget, req_b.budget) / max(req_a.budget, req_b.budget)
        if ratio >= 0.5:
            score += 0.20 * ratio
    if req_a.delivery_urgency == req_b.delivery_urgency:
        score += 0.10
    return round(score, 3)


def _savings_rate(total_members: int) -> float:
    """Step-function penghematan kolektif berdasarkan skala grup (model GPO)."""
    if total_members >= 10: return 0.25
    if total_members >= 5:  return 0.20
    if total_members >= 3:  return 0.15
    return 0.08


def _dp_optimal_group(candidates: list, user_budget: float, max_size: int = 9) -> Optional[dict]:
    """
    0/1 Knapsack DP — pilih subset k kandidat yang memaksimalkan total penghematan.

    Nilai item = similarity × budget (prioritaskan kandidat relevan berbudget besar).
    Untuk setiap k yang valid, backtrack dan hitung savings nyata, lalu pilih k* terbaik.

    State:   dp[i][k] = nilai DP maksimum menggunakan tepat k item dari i pertama
    Transisi: dp[i][k] = max(dp[i-1][k],  dp[i-1][k-1] + val_i)
    Kompleksitas: O(n × K) waktu dan ruang, n = |candidates|, K = max_size
    """
    n = len(candidates)
    if n == 0:
        return None

    K = min(max_size, n)
    NEG_INF = float('-inf')

    # Nilai item = sim × budget sebagai proxy "kontribusi anggota ke kualitas grup"
    items = [(sim * (req.budget or user_budget), sim, req) for sim, req in candidates]

    # Bangun tabel DP
    dp      = [[NEG_INF] * (K + 1) for _ in range(n + 1)]
    include = [[False]   * (K + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = 0.0

    for i in range(1, n + 1):
        val, _, _ = items[i - 1]
        for k in range(min(i, K), 0, -1):
            without   = dp[i - 1][k]
            with_item = (dp[i - 1][k - 1] + val) if dp[i - 1][k - 1] != NEG_INF else NEG_INF
            if with_item > without:
                dp[i][k]      = with_item
                include[i][k] = True
            else:
                dp[i][k] = without

    # Cari k* yang memaksimalkan (user_budget + Σbudget_terpilih) × savings_rate(k+1)
    best: dict = {"savings": -1.0, "k": 0, "members": [], "rate": 0.0}

    for k in range(1, K + 1):
        if dp[n][k] == NEG_INF:
            continue

        # Backtrack: temukan anggota yang terpilih untuk grup ukuran k
        selected: list = []
        rem = k
        for i in range(n, 0, -1):
            if rem == 0:
                break
            if include[i][rem]:
                _, sim_i, req_i = items[i - 1]
                selected.append((sim_i, req_i))
                rem -= 1
        selected.reverse()

        total_budget = user_budget + sum((r.budget or user_budget) for _, r in selected)
        rate         = _savings_rate(k + 1)   # k anggota lain + 1 user = k+1 total
        savings      = total_budget * rate

        if savings > best["savings"]:
            best = {"savings": savings, "k": k, "members": selected, "rate": rate}

    return best if best["k"] > 0 else None


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

    # Hitung similarity, filter, urutkan
    scored: list[tuple[float, any]] = []
    for req in active_requests:
        sim = _compute_similarity(pseudo, req)
        if sim >= 0.35:
            scored.append((sim, req))
    scored.sort(key=lambda x: x[0], reverse=True)

    # Cluster kandidat berdasarkan (kategori, kota)
    clusters: dict[str, list] = {}
    for sim, req in scored[:50]:
        key = f"{req.product_category}_{req.delivery_city}"
        clusters.setdefault(key, []).append((sim, req))

    # Jalankan 0/1 Knapsack DP per cluster — temukan komposisi grup optimal
    groups = []
    for candidates in clusters.values():
        result = _dp_optimal_group(candidates, body.budget)
        if not result:
            continue

        members  = result["members"]
        k        = result["k"]
        rate     = result["rate"]
        rep      = members[0][1]  # anggota representatif

        total_qty   = body.quantity + sum(r.quantity or 0 for _, r in members)
        savings_pct = round(rate * 100, 1)
        savings_amt = round(body.budget * rate)

        groups.append({
            "id": f"grp_{str(rep.id)[:8]}",
            "group_name": f"Grup {body.product_category} {body.delivery_city}",
            "product_category": rep.product_category,
            "delivery_city": rep.delivery_city,
            "member_count": k + 1,
            "total_quantity": round(total_qty, 2),
            "unit": rep.unit or body.unit,
            "similarity_score": round(members[0][0], 3),
            "estimated_savings_pct": savings_pct,
            "estimated_savings_amount": savings_amt,
            "status": "open",
            "member_details": [
                {"id": str(r.id), "product_name": r.product_name, "quantity": r.quantity, "unit": r.unit}
                for _, r in members
            ],
        })

    groups.sort(key=lambda g: g["estimated_savings_amount"], reverse=True)

    if not groups:
        groups = _generate_demo_groups(body)

    logger.info(
        "group_matching_dp_completed",
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
    savings_pct = _savings_rate(group.member_count + 1) * 100
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


# ---------------------------------------------------------------------------
# Segment DP — Batch Procurement Optimizer (dari Grub_Pengadaan.ipynb)
# ---------------------------------------------------------------------------

TIME_TOLERANCE_DAYS = 3


def _group_by_time(requests: list, tolerance_days: int = TIME_TOLERANCE_DAYS) -> list:
    """
    Kelompokkan request berdasarkan window waktu ±tolerance_days (seperti group_candidates
    di notebook Grub_Pengadaan). Request tanpa tanggal dimasukkan ke grup terakhir.
    """
    now = datetime.utcnow()
    reqs = sorted(requests, key=lambda r: r.preferred_delivery_date or now)
    groups, used = [], set()

    for req in reqs:
        if id(req) in used:
            continue
        base = req.preferred_delivery_date or now
        group = [
            r for r in reqs
            if id(r) not in used and (
                r.preferred_delivery_date is None or
                abs((r.preferred_delivery_date - base).days) <= tolerance_days
            )
        ]
        if group:
            groups.append(group)
            for r in group:
                used.add(id(r))

    return groups


def _vendor_discount(vendor, total_qty: float) -> float:
    """Ambil diskon terbaik dari tabel tier vendor berdasarkan total kuantitas batch."""
    tiers = (vendor.discount_tiers or []) if hasattr(vendor, "discount_tiers") else []
    discount = 0.0
    for tier in sorted(tiers, key=lambda t: t.get("min_qty", 0)):
        if total_qty >= tier.get("min_qty", 0):
            discount = tier.get("discount", 0.0)
    return discount


def _segment_dp_optimize(groups: list, vendors: list, fallback_budget: float) -> dict:
    """
    Segment DP: minimasi total biaya pengadaan dengan batching optimal ke vendor.

    State:    DP[i] = biaya minimum memproses i grup pertama
    Transisi: DP[i] = min over j < i of (DP[j] + cost(batch[j..i-1]))
    cost      = total_budget × (1 − diskon_tier_terbaik_vendor)

    Jika tidak ada vendor yang memenuhi MOQ, biaya = total_budget (tanpa diskon).
    Kompleksitas: O(n² × |vendors|), n = jumlah time-window grup
    """
    n = len(groups)
    if n == 0:
        return {"batches": [], "total_original_cost": 0, "total_optimized_cost": 0,
                "total_savings": 0, "savings_pct": 0.0}

    INF = float("inf")
    dp          = [INF] * (n + 1)
    parent      = [-1]  * (n + 1)
    vendor_sel  = [None] * (n + 1)
    dp[0]       = 0.0

    for i in range(1, n + 1):
        for j in range(i):
            batch        = [r for g in groups[j:i] for r in g]
            total_qty    = sum(r.quantity or 0          for r in batch)
            total_budget = sum(r.budget   or fallback_budget for r in batch)

            # Cari vendor terbaik (diskon tertinggi yang memenuhi MOQ)
            best_cost, best_v = INF, None
            for v in vendors:
                moq = v.min_order_quantity or 0
                if total_qty < moq:
                    continue
                disc = _vendor_discount(v, total_qty)
                cost = total_budget * (1.0 - disc)
                if cost < best_cost:
                    best_cost, best_v = cost, (v, disc)

            # Fallback: tidak ada vendor → bayar penuh
            if best_v is None:
                best_cost = total_budget

            if dp[j] + best_cost < dp[i]:
                dp[i]      = dp[j] + best_cost
                parent[i]  = j
                vendor_sel[i] = best_v

    # Backtrack untuk rekonstruksi solusi
    batches, idx = [], n
    while idx > 0:
        prev         = parent[idx]
        if prev < 0:
            break
        batch        = [r for g in groups[prev:idx] for r in g]
        total_qty    = sum(r.quantity or 0          for r in batch)
        total_budget = sum(r.budget   or fallback_budget for r in batch)
        v_info       = vendor_sel[idx]
        disc         = v_info[1] if v_info else 0.0
        v            = v_info[0] if v_info else None

        batches.append({
            "member_count"        : len(batch),
            "total_quantity"      : round(total_qty, 2),
            "total_budget"        : round(total_budget),
            "vendor_id"           : str(v.id)          if v else None,
            "vendor_name"         : v.vendor_name       if v else "Tanpa vendor cocok",
            "discount_pct"        : round(disc * 100, 1),
            "cost_after_discount" : round(total_budget * (1.0 - disc)),
            "savings"             : round(total_budget * disc),
            "earliest_deadline"   : min(
                (r.preferred_delivery_date.strftime("%Y-%m-%d") for r in batch if r.preferred_delivery_date),
                default=None,
            ),
            "latest_deadline"     : max(
                (r.preferred_delivery_date.strftime("%Y-%m-%d") for r in batch if r.preferred_delivery_date),
                default=None,
            ),
        })
        idx = prev

    batches.reverse()
    total_original  = sum(b["total_budget"]       for b in batches)
    total_optimized = round(dp[n])  if dp[n] != INF else total_original
    total_savings   = round(total_original - total_optimized)

    return {
        "batches"             : batches,
        "total_original_cost" : total_original,
        "total_optimized_cost": total_optimized,
        "total_savings"       : total_savings,
        "savings_pct"         : round(total_savings / total_original * 100, 1) if total_original > 0 else 0.0,
    }


@router.post("/batch-optimize")
@limiter.limit("10/minute")
async def batch_optimize(
    request: Request,
    body: MatchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Segment DP Batch Optimizer — cari batching optimal permintaan pengadaan ke vendor.

    Berbeda dari /match (0/1 Knapsack → maksimalkan penghematan satu user),
    endpoint ini mengoptimalkan seluruh permintaan aktif di kategori+kota yang sama:
    DP[i] = min(DP[j] + cost(batch[j..i])) → minimasi total biaya kolektif.
    """
    umkm = db.query(UMKM).filter(UMKM.user_id == current_user["user_id"]).first()
    my_umkm_id = umkm.id if umkm else None

    # Ambil semua request aktif untuk kategori + kota yang sama
    active = (
        db.query(ProcurementRequest)
        .filter(
            ProcurementRequest.status == "active",
            ProcurementRequest.product_category == body.product_category,
            ProcurementRequest.delivery_city == body.delivery_city,
        )
        .order_by(ProcurementRequest.preferred_delivery_date)
        .limit(50)
        .all()
    )

    # Tambahkan request user saat ini sebagai pseudo-request
    pseudo = ProcurementRequest(
        umkm_id=my_umkm_id,
        product_name=body.product_name,
        product_category=body.product_category,
        quantity=body.quantity,
        budget=body.budget,
        delivery_city=body.delivery_city,
        delivery_urgency=body.delivery_urgency,
        preferred_delivery_date=datetime.utcnow() + timedelta(days=7),
    )
    all_requests = active + [pseudo]

    # Kelompokkan berdasarkan window waktu 3 hari
    groups = _group_by_time(all_requests)

    # Ambil vendor aktif di kota yang sama
    vendors = (
        db.query(Vendor)
        .filter(Vendor.city == body.delivery_city, Vendor.is_active == True)
        .all()
    )

    result = _segment_dp_optimize(groups, vendors, body.budget)

    logger.info(
        "batch_optimize_completed",
        product=body.product_name,
        city=body.delivery_city,
        batches=len(result["batches"]),
        savings=result["total_savings"],
    )

    return {
        "success": True,
        "message": (
            f"Optimasi selesai: {len(result['batches'])} batch, "
            f"hemat Rp {result['total_savings']:,.0f} ({result['savings_pct']}%)"
        ),
        "data": {
            "query": {
                "product_name"    : body.product_name,
                "product_category": body.product_category,
                "quantity"        : body.quantity,
                "unit"            : body.unit,
                "delivery_city"   : body.delivery_city,
            },
            **result,
        },
    }
