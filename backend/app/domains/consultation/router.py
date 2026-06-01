"""
Consultation router — AI knowledge retrieval for UMKM
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.security import get_current_user
from app.models import User
from .engine import answer

router = APIRouter()


class ConsultQuery(BaseModel):
    question: str = Field(..., min_length=3, max_length=500)


@router.post("/ask")
def ask_question(
    body: ConsultQuery,
    current_user: User = Depends(get_current_user),
):
    """Tanya konsultasi UMKM — TF-IDF retrieval dari knowledge base"""
    result = answer(body.question)
    return {"success": True, "data": result}


@router.get("/topics")
def list_topics():
    """Daftar topik konsultasi yang tersedia"""
    return {
        "success": True,
        "data": [
            {"id": "pembiayaan", "label": "Pembiayaan & KUR", "emoji": "💰"},
            {"id": "regulasi", "label": "Regulasi OJK/BI", "emoji": "📋"},
            {"id": "vendor_pengadaan", "label": "Vendor & Pengadaan", "emoji": "🏭"},
            {"id": "pemasaran", "label": "Pemasaran Digital", "emoji": "📱"},
            {"id": "keuangan", "label": "Manajemen Keuangan", "emoji": "📊"},
            {"id": "platform", "label": "Fitur Deschain", "emoji": "🔗"},
        ],
    }
