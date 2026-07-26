"""
Notification domain router
"""
import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.security import get_current_user, verify_token
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
    except ValueError:
        notif = None

    if not notif:
        return {"success": False, "message": "Notifikasi tidak ditemukan"}

    notif.is_read = True
    db.commit()
    return {"success": True, "message": "Notifikasi ditandai sudah dibaca"}


@router.get("/stream")
async def notification_stream(token: str):
    """SSE: push unread count + notifikasi terbaru setiap 15 detik."""
    try:
        payload = verify_token(token)
    except HTTPException:
        async def _unauthorized():
            yield f"data: {json.dumps({'error': 'unauthorized'})}\n\n"
        return StreamingResponse(_unauthorized(), media_type="text/event-stream", status_code=401)

    user_id = payload["sub"]

    async def generator():
        last_count = -1
        while True:
            db = SessionLocal()
            try:
                unread_count = db.query(Notification).filter(
                    Notification.user_id == user_id,
                    Notification.is_read == False,
                ).count()
                if unread_count != last_count:
                    last_count = unread_count
                    notifs = db.query(Notification).filter(
                        Notification.user_id == user_id,
                    ).order_by(Notification.created_at.desc()).limit(5).all()
                    data = {
                        "unread_count": unread_count,
                        "notifications": [
                            {
                                "id": str(n.id),
                                "title": n.title,
                                "message": n.message,
                                "is_read": n.is_read,
                                "notification_type": n.notification_type,
                                "created_at": n.created_at.isoformat() if n.created_at else None,
                            }
                            for n in notifs
                        ],
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                else:
                    yield ": ping\n\n"
            finally:
                db.close()
            await asyncio.sleep(15)

    return StreamingResponse(
        generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


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
