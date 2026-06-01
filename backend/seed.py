"""
Seed script — data demo realistis untuk hackathon Deschain
Jalankan: python seed.py

Demo credentials:
  UMKM  : demo@deschain.id  / Demo1234!
  Vendor: vendor@deschain.id / Demo1234!
"""
import sys
import os
from datetime import datetime, timedelta
import uuid

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app.models import (
    User, UMKM, Vendor, ProcurementRequest,
    ProcurementGroup, GroupMembership, Transaction, Notification,
)
from app.security import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def clear_data():
    db.query(Notification).delete()
    db.query(GroupMembership).delete()
    db.query(Transaction).delete()
    db.query(ProcurementGroup).delete()
    db.query(ProcurementRequest).delete()
    db.query(UMKM).delete()
    db.query(Vendor).delete()
    db.query(User).delete()
    db.commit()
    print("Data lama dihapus.")


def create_user(email, password, first_name, last_name, phone, user_type):
    u = User(
        id=uuid.uuid4(),
        email=email,
        password_hash=hash_password(password),
        first_name=first_name,
        last_name=last_name,
        phone=phone,
        user_type=user_type,
        is_active=True,
        is_verified=True,
        created_at=datetime.utcnow(),
    )
    db.add(u)
    return u


def seed():
    clear_data()

    # ── Admin ─────────────────────────────────────────────────
    create_user(
        "admin@deschain.id", "Admin1234!", "Abdullah", "Khalid",
        "081234567890", "admin"
    )

    # ── Users UMKM ───────────────────────────────────────────
    demo_user = create_user(
        "demo@deschain.id", "Demo1234!", "Budi", "Santoso",
        "08112345678", "umkm"
    )
    u2 = create_user("siti.warung@gmail.com", "Demo1234!", "Siti", "Rahayu", "08223456789", "umkm")
    u3 = create_user("berkah.toko@gmail.com", "Demo1234!", "Ahmad", "Fauzi", "08334567890", "umkm")
    u4 = create_user("maju.jaya@gmail.com", "Demo1234!", "Dewi", "Lestari", "08445678901", "umkm")
    u5 = create_user("rizki.catering@gmail.com", "Demo1234!", "Rizki", "Pratama", "08556789012", "umkm")
    u6 = create_user("harapan.usaha@gmail.com", "Demo1234!", "Fatimah", "Zahra", "08667890123", "umkm")
    u7 = create_user("koperasi.nelayan@gmail.com", "Demo1234!", "Hendra", "Wijaya", "08778901234", "umkm")
    u8 = create_user("aneka.batik@gmail.com", "Demo1234!", "Nurul", "Hidayah", "08889012345", "umkm")
    u9 = create_user("mitra.sembako@gmail.com", "Demo1234!", "Rudi", "Hermawan", "08990123456", "umkm")
    u10 = create_user("surya.elektronik@gmail.com", "Demo1234!", "Maya", "Putri", "08101234567", "umkm")

    # ── Users Vendor ─────────────────────────────────────────
    v_user1 = create_user("vendor@deschain.id", "Demo1234!", "Agro", "Nusantara", "02112345678", "vendor")
    v_user2 = create_user("indo.grosir@gmail.com", "Demo1234!", "Indo", "Grosir", "02223456789", "vendor")
    v_user3 = create_user("kaltim.supply@gmail.com", "Demo1234!", "Kaltim", "Supply", "02334567890", "vendor")
    v_user4 = create_user("tekstil.borneo@gmail.com", "Demo1234!", "Tekstil", "Borneo", "02445678901", "vendor")
    v_user5 = create_user("mitra.kemasan@gmail.com", "Demo1234!", "Mitra", "Kemasan", "02556789012", "vendor")

    db.flush()

    # ── UMKM Profiles ─────────────────────────────────────────
    def mk_umkm(user, biz_name, category, city, province, revenue, employees, credit=4.2, txs=7, proc_val=48_500_000):
        u = UMKM(
            id=uuid.uuid4(),
            user_id=user.id,
            business_name=biz_name,
            industry_category=category,
            city=city,
            province=province,
            annual_revenue=revenue,
            employees_count=employees,
            owner_name=f"{user.first_name} {user.last_name}",
            verification_status="verified",
            credit_score=credit,
            total_transactions=txs,
            total_procurement_value=proc_val,
            created_at=datetime.utcnow() - timedelta(days=180),
        )
        db.add(u)
        return u

    demo_umkm = mk_umkm(demo_user, "Toko Sembako Pak Budi", "Sembako", "Pontianak", "Kalimantan Barat", 480_000_000, 5, 4.3, 7, 48_500_000)
    umkm2 = mk_umkm(u2, "Warung Bu Siti", "Sembako", "Pontianak", "Kalimantan Barat", 320_000_000, 3, 4.0, 5, 32_000_000)
    umkm3 = mk_umkm(u3, "Toko Berkah Jaya", "Sembako", "Pontianak", "Kalimantan Barat", 250_000_000, 4, 3.8, 4, 28_000_000)
    umkm4 = mk_umkm(u4, "Usaha Maju Dewi", "Bahan Bangunan", "Singkawang", "Kalimantan Barat", 600_000_000, 8, 4.5, 10, 62_000_000)
    umkm5 = mk_umkm(u5, "Rizki Catering & Katering", "Makanan & Minuman", "Pontianak", "Kalimantan Barat", 180_000_000, 6, 3.9, 3, 18_000_000)
    umkm6 = mk_umkm(u6, "Harapan Usaha Fatimah", "Tekstil & Kain", "Sambas", "Kalimantan Barat", 290_000_000, 4, 4.1, 6, 31_000_000)
    umkm7 = mk_umkm(u7, "Koperasi Nelayan Maju", "Perikanan", "Mempawah", "Kalimantan Barat", 850_000_000, 12, 4.7, 15, 95_000_000)
    umkm8 = mk_umkm(u8, "Aneka Batik Khatulistiwa", "Tekstil & Kain", "Pontianak", "Kalimantan Barat", 210_000_000, 5, 3.7, 4, 22_000_000)
    umkm9 = mk_umkm(u9, "Mitra Sembako Pak Rudi", "Sembako", "Kubu Raya", "Kalimantan Barat", 370_000_000, 4, 4.2, 8, 41_000_000)
    umkm10 = mk_umkm(u10, "Surya Elektronik & Spare Part", "Elektronik", "Pontianak", "Kalimantan Barat", 520_000_000, 7, 4.4, 9, 55_000_000)

    # ── Vendor Profiles ───────────────────────────────────────
    def mk_vendor(user, name, category, city, province, rel_score=4.5, orders=120):
        v = Vendor(
            id=uuid.uuid4(),
            user_id=user.id,
            vendor_name=name,
            business_category=category,
            city=city,
            province=province,
            verification_status="verified",
            reliability_score=rel_score,
            total_orders=orders,
            is_active=True,
            min_order_quantity=50,
            average_lead_time_days=3,
            created_at=datetime.utcnow() - timedelta(days=365),
        )
        db.add(v)
        return v

    vendor1 = mk_vendor(v_user1, "PT Agro Nusantara Mandiri", "Sembako & Pertanian", "Pontianak", "Kalimantan Barat", 4.8, 250)
    vendor2 = mk_vendor(v_user2, "UD Indo Grosir Utama", "Sembako", "Pontianak", "Kalimantan Barat", 4.5, 180)
    vendor3 = mk_vendor(v_user3, "CV Kaltim Supply Chain", "Bahan Bangunan", "Balikpapan", "Kalimantan Timur", 4.3, 120)
    vendor4 = mk_vendor(v_user4, "PT Tekstil Borneo Indah", "Tekstil & Kain", "Pontianak", "Kalimantan Barat", 4.6, 95)
    vendor5 = mk_vendor(v_user5, "UD Mitra Kemasan Plastik", "Plastik & Kemasan", "Kubu Raya", "Kalimantan Barat", 4.2, 78)

    db.flush()

    # ── Procurement Requests ──────────────────────────────────
    def mk_req(umkm, name, category, qty, unit, budget, city, urgency="normal", status="active", days_ago=0):
        r = ProcurementRequest(
            id=uuid.uuid4(),
            umkm_id=umkm.id,
            product_name=name,
            product_category=category,
            quantity=qty,
            unit=unit,
            budget=budget,
            delivery_city=city,
            delivery_urgency=urgency,
            status=status,
            created_at=datetime.utcnow() - timedelta(days=days_ago),
        )
        db.add(r)
        return r

    req1  = mk_req(demo_umkm, "Beras Premium Pandan Wangi", "Beras & Biji-bijian", 500, "kg", 7_500_000, "Pontianak", "normal", "completed", 35)
    req2  = mk_req(demo_umkm, "Minyak Goreng Kemasan 2L", "Minyak & Lemak", 200, "karton", 6_400_000, "Pontianak", "normal", "completed", 20)
    req3  = mk_req(demo_umkm, "Tepung Terigu Protein Tinggi", "Sembako", 300, "kg", 3_600_000, "Pontianak", "urgent", "completed", 10)
    req4  = mk_req(demo_umkm, "Gula Pasir GKP", "Sembako", 100, "kg", 1_800_000, "Pontianak", "normal", "active", 3)
    req5  = mk_req(umkm2, "Beras Pulen Wangi 50kg", "Beras & Biji-bijian", 300, "kg", 4_500_000, "Pontianak", "normal", "active", 5)
    req6  = mk_req(umkm3, "Minyak Goreng Curah", "Minyak & Lemak", 150, "liter", 2_700_000, "Pontianak", "urgent", "active", 2)
    req7  = mk_req(umkm4, "Semen Portland 50kg", "Bahan Bangunan", 200, "karton", 12_000_000, "Singkawang", "normal", "active", 7)
    req8  = mk_req(umkm5, "Tepung Terigu Cakra Kembar", "Sembako", 400, "kg", 4_800_000, "Pontianak", "normal", "active", 4)
    req9  = mk_req(umkm6, "Kain Batik Motif Dayak", "Tekstil & Kain", 100, "meter", 8_000_000, "Sambas", "flexible", "active", 6)
    req10 = mk_req(umkm9, "Gula Pasir Rafinasi 25kg", "Sembako", 200, "kg", 3_600_000, "Kubu Raya", "normal", "active", 8)

    db.flush()

    # ── Procurement Groups ────────────────────────────────────
    def mk_group(name, category, qty, unit, budget, city, creator_id, vendor_id, member_count, savings, status="forming", days_ago=30):
        g = ProcurementGroup(
            id=uuid.uuid4(),
            group_name=name,
            product_category=category,
            total_quantity=qty,
            unit=unit,
            total_budget=budget,
            delivery_city=city,
            created_by_umkm_id=creator_id,
            selected_vendor_id=vendor_id,
            member_count=member_count,
            total_savings=savings,
            status=status,
            created_at=datetime.utcnow() - timedelta(days=days_ago),
        )
        db.add(g)
        return g

    grp1 = mk_group("Grup Beras Pontianak Barat", "Beras & Biji-bijian", 1500, "kg", 22_500_000, "Pontianak", demo_umkm.id, vendor1.id, 5, 3_375_000, "completed", 40)
    grp2 = mk_group("Kolektif Minyak Goreng Pedagang Pasar", "Minyak & Lemak", 800, "karton", 25_600_000, "Pontianak", umkm2.id, vendor2.id, 4, 3_840_000, "completed", 25)
    grp3 = mk_group("Grup Tepung Bakeri Kalimantan", "Sembako", 1200, "kg", 14_400_000, "Pontianak", umkm3.id, vendor1.id, 3, 2_160_000, "completed", 15)
    grp4 = mk_group("Grup Sembako Aktif Q2", "Sembako", 600, "kg", 9_000_000, "Pontianak", demo_umkm.id, None, 3, 0, "forming", 5)
    grp5 = mk_group("Grup Bahan Bangunan Singkawang", "Bahan Bangunan", 500, "karton", 30_000_000, "Singkawang", umkm4.id, vendor3.id, 6, 4_500_000, "completed", 60)
    grp6 = mk_group("Grup Beras Pontianak Tengah", "Beras & Biji-bijian", 900, "kg", 13_500_000, "Pontianak", umkm2.id, None, 2, 0, "forming", 3)
    grp7 = mk_group("Kolektif Minyak Goreng Pontianak", "Minyak & Lemak", 400, "karton", 12_800_000, "Pontianak", umkm5.id, None, 2, 0, "forming", 2)

    db.flush()

    # ── Group Memberships (demo user joins 3 completed groups) ─
    def mk_member(group, umkm, request, qty, ind_budget, savings_pct, status="completed", days_ago=35):
        unit_price = (ind_budget * (1 - savings_pct / 100)) / qty if qty > 0 else 0
        total = unit_price * qty
        savings_amt = ind_budget * savings_pct / 100
        m = GroupMembership(
            id=uuid.uuid4(),
            group_id=group.id,
            umkm_id=umkm.id,
            request_id=request.id if request else None,
            quantity=qty,
            individual_budget=ind_budget,
            unit_price=unit_price,
            total_price=total,
            savings_percentage=savings_pct,
            status=status,
            joined_at=datetime.utcnow() - timedelta(days=days_ago),
        )
        db.add(m)
        return m

    # Spread demo user memberships merata di 4 minggu terakhir → chart tidak ada gap
    mk_member(grp1, demo_umkm, req1, 500, 7_500_000, 20.0, "completed", 26)  # Minggu 1 (21-28 hari lalu)
    mk_member(grp1, umkm2,     req5, 300, 4_500_000, 20.0, "completed", 26)
    mk_member(grp1, umkm3,     None, 300, 4_500_000, 20.0, "completed", 26)
    mk_member(grp1, umkm9,     req10, 200, 3_000_000, 20.0, "completed", 26)
    mk_member(grp1, umkm5,     None,  200, 3_000_000, 20.0, "completed", 26)

    mk_member(grp2, demo_umkm, req2, 200, 6_400_000, 15.0, "completed", 18)  # Minggu 2 (14-21 hari lalu)
    mk_member(grp2, umkm6,     None, 150, 4_800_000, 15.0, "completed", 18)
    mk_member(grp2, umkm8,     None, 250, 8_000_000, 15.0, "completed", 18)
    mk_member(grp2, umkm10,    None, 200, 6_400_000, 15.0, "completed", 18)

    mk_member(grp3, demo_umkm, req3, 300, 3_600_000, 20.0, "completed", 10)  # Minggu 3 (7-14 hari lalu)
    mk_member(grp3, umkm5,     req8, 400, 4_800_000, 20.0, "completed", 10)
    mk_member(grp3, umkm2,     None, 500, 6_000_000, 20.0, "completed", 10)

    mk_member(grp4, demo_umkm, req4, 100, 1_800_000, 18.0, "completed", 4)   # Minggu 4 (0-7 hari lalu)
    mk_member(grp4, umkm3,     req6, 150, 2_700_000, 15.0, "pending",   3)
    mk_member(grp4, umkm9,     None, 200, 3_600_000, 15.0, "pending",   3)

    mk_member(grp5, umkm4,     req7, 200, 12_000_000, 15.0, "completed", 58)
    mk_member(grp5, umkm7,     None, 100,  6_000_000, 15.0, "completed", 58)

    db.flush()

    # ── Transactions ──────────────────────────────────────────
    def mk_tx(group, vendor, amount, qty, unit, days_ago=35):
        t = Transaction(
            id=uuid.uuid4(),
            group_id=group.id,
            vendor_id=vendor.id,
            order_number=f"DSC-{datetime.utcnow().strftime('%Y%m')}-{str(group.id)[:6].upper()}",
            total_amount=amount,
            tax_amount=amount * 0.11,
            delivery_fee=500_000,
            final_amount=amount + amount * 0.11 + 500_000,
            quantity=qty,
            unit=unit,
            payment_status="paid",
            delivery_status="delivered",
            order_status="completed",
            created_at=datetime.utcnow() - timedelta(days=days_ago),
            completed_at=datetime.utcnow() - timedelta(days=days_ago - 5),
        )
        db.add(t)
        return t

    mk_tx(grp1, vendor1, 18_000_000, 1500, "kg", 35)
    mk_tx(grp2, vendor2, 21_760_000, 800,  "karton", 20)
    mk_tx(grp3, vendor1, 11_520_000, 1200, "kg", 10)
    mk_tx(grp5, vendor3, 25_500_000, 500,  "karton", 55)

    # ── Notifications ─────────────────────────────────────────
    notifs = [
        (demo_user.id, "Transaksi Selesai! 🎉", "Grup Beras Pontianak Barat telah menyelesaikan pengadaan. Penghematan Anda: Rp 1.500.000.", "transaction_completed"),
        (demo_user.id, "Grup Baru Cocok untuk Anda", "AI menemukan grup pengadaan Minyak Goreng yang cocok dengan kebutuhan Anda.", "group_match"),
        (demo_user.id, "Konfirmasi Bergabung Grup", "Anda berhasil bergabung ke Grup Tepung Bakeri Kalimantan.", "group_joined"),
    ]
    for uid, title, msg, ntype in notifs:
        n = Notification(
            id=uuid.uuid4(),
            user_id=uid,
            title=title,
            message=msg,
            notification_type=ntype,
            is_read=False,
            channel="in_app",
            created_at=datetime.utcnow() - timedelta(hours=2),
        )
        db.add(n)

    db.commit()

    print("\n=== SEED BERHASIL ===")
    print(f"Demo UMKM  : demo@deschain.id / Demo1234!")
    print(f"Demo Vendor: vendor@deschain.id / Demo1234!")
    print(f"Total users   : {db.query(User).count()}")
    print(f"Total UMKM    : {db.query(UMKM).count()}")
    print(f"Total Vendor  : {db.query(Vendor).count()}")
    print(f"Total Grup    : {db.query(ProcurementGroup).count()}")
    print(f"Total Request : {db.query(ProcurementRequest).count()}")
    print("====================\n")


if __name__ == "__main__":
    seed()
    db.close()
