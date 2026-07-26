"""
Email notification utility — SMTP-based, runs via BackgroundTasks.
Silently no-ops when SMTP is not configured or ENABLE_NOTIFICATION_EMAIL=False.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import structlog

logger = structlog.get_logger()


def _settings():
    from app.config import get_settings
    return get_settings()


def _base_html(content: str) -> str:
    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:20px}}
.card{{max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.07)}}
.hdr{{background:#0F172A;padding:24px 32px}}.logo{{color:#F59E0B;font-size:22px;font-weight:700}}
.bd{{padding:32px;color:#374151}}h2{{margin:0 0 12px;color:#0F172A;font-size:20px}}
p{{margin:0 0 16px;font-size:15px;line-height:1.6;color:#6B7280}}
.box{{background:#FEF3C7;border-radius:10px;padding:16px 20px;margin:20px 0}}
.box strong{{color:#0F172A;font-size:16px}}
.btn{{display:inline-block;background:#F59E0B;color:#fff;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px}}
.ft{{padding:20px 32px;border-top:1px solid #F3F4F6;color:#9CA3AF;font-size:12px}}
</style></head><body><div class="card">
<div class="hdr"><span class="logo">Deschain</span></div>
<div class="bd">{content}</div>
<div class="ft">Platform Pengadaan Kolektif AI untuk UMKM Indonesia &nbsp;·&nbsp;
<a href="https://deschain.id" style="color:#F59E0B">deschain.id</a></div>
</div></body></html>"""


def _send(to: str, subject: str, html: str) -> bool:
    s = _settings()
    if not s.SMTP_HOST or not s.SMTP_USER or not s.ENABLE_NOTIFICATION_EMAIL:
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Deschain <{s.SMTP_FROM_EMAIL}>"
        msg["To"] = to
        msg.attach(MIMEText(html, "html", "utf-8"))
        with smtplib.SMTP(s.SMTP_HOST, s.SMTP_PORT, timeout=10) as srv:
            srv.ehlo()
            srv.starttls()
            srv.login(s.SMTP_USER, s.SMTP_PASSWORD)
            srv.send_message(msg)
        logger.info("email_sent", to=to, subject=subject)
        return True
    except Exception as exc:
        logger.warning("email_failed", to=to, error=str(exc))
        return False


def send_welcome_email(email: str, name: str, user_type: str) -> None:
    label = "UMKM" if user_type == "umkm" else "Vendor"
    next_step = (
        "Buat permintaan pengadaan pertama Anda dan biarkan AI mencarikan grup yang cocok."
        if user_type == "umkm"
        else "Lengkapi profil vendor Anda di halaman Profil agar mudah ditemukan UMKM."
    )
    content = f"""<h2>Selamat datang, {name}!</h2>
<p>Akun {label} Anda di Deschain berhasil dibuat.</p>
<div class="box"><strong>Langkah berikutnya</strong>
<p style="margin:8px 0 0">{next_step}</p></div>
<a href="https://deschain-v2.vercel.app/dashboard" class="btn">Mulai Sekarang</a>"""
    _send(email, "Selamat datang di Deschain!", _base_html(content))


def send_group_join_email(email: str, name: str, group_name: str, savings_pct: float) -> None:
    content = f"""<h2>Berhasil bergabung ke grup!</h2>
<p>Hei {name}, Anda berhasil bergabung ke grup pengadaan kolektif.</p>
<div class="box"><strong>{group_name}</strong>
<p style="margin:6px 0 0">Estimasi penghematan: <strong style="color:#059669">{savings_pct:.0f}%</strong> dari harga pasar</p></div>
<p>Pantau status pengadaan Anda di halaman Transaksi.</p>
<a href="https://deschain-v2.vercel.app/transactions" class="btn">Lihat Transaksi</a>"""
    _send(email, f"Bergabung ke {group_name} — Deschain", _base_html(content))


def send_group_complete_email(
    email: str, name: str, group_name: str, savings: float, savings_pct: float
) -> None:
    content = f"""<h2>Pengadaan selesai!</h2>
<p>Hei {name}, pengadaan kolektif Anda telah berhasil diselesaikan.</p>
<div class="box"><strong>{group_name}</strong>
<p style="margin:6px 0 0">Total penghematan Anda: <strong style="color:#059669">Rp {savings:,.0f}
({savings_pct:.0f}%)</strong></p></div>
<p>Data ini otomatis tercatat di Credit Trail Anda dan dapat digunakan sebagai bukti pengajuan KUR.</p>
<a href="https://deschain-v2.vercel.app/transactions" class="btn">Lihat Credit Trail</a>"""
    _send(email, f"Pengadaan {group_name} selesai — Deschain", _base_html(content))
