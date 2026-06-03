"""
Notification domain router
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.models import Notification

router = APIRouter()


@router.get("/list")
async def list_notifications(
    unread: bool = False,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Daftar notifikasi pengguna"""
    q = db.query(Notification).filter(
        Notification.user_id == current_user["user_id"]
    )
    if unread:
        q = q.filter(Notification.is_read == False)

    notifs = q.order_by(Notification.created_at.desc()).limit(limit).all()

    data = []
    for n in notifs:
        data.append({
            "id": str(n.id),
            "title": n.title,
            "message": n.message,
            "notification_type": n.notification_type,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        })

    unread_count = db.query(Notification).filter(
        Notification.user_id == current_user["user_id"],
        Notification.is_read == False,
    ).count()

    return {
        "success": True,
        "data": data,
        "unread_count": unread_count,
    }


@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Tandai notifikasi sebagai sudah dibaca"""
    import uuid
    try:
        notif = db.query(Notification).filter(
            Notification.id == uuid.UUID(notification_id),
            Notification.user_id == current_user["user_id"],
        ).first()
    except Exception:
        notif = None

    if not notif:
        return {"success": False, "message": "Notifikasi tidak ditemukan"}

    notif.is_read = True
    db.commit()
    return {"success": True, "message": "Notifikasi ditandai sudah dibaca"}


@router.put("/read-all")
async def mark_all_read(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Tandai semua notifikasi sebagai sudah dibaca"""
    db.query(Notification).filter(
        Notification.user_id == current_user["user_id"],
        Notification.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return {"success": True, "message": "Semua notifikasi sudah dibaca"}
