"""
Knowledge base parser — membaca knowledge base Deschain.md dan membagi menjadi chunks
"""
import re
import os
from pathlib import Path

# Path ke knowledge base file
KB_PATH = Path(__file__).parent.parent.parent.parent.parent / "knowledge base Deschain.md"


def load_chunks() -> list[dict]:
    """Parse knowledge base menjadi list chunks untuk retrieval"""
    try:
        text = KB_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return _fallback_chunks()

    chunks = []
    # Split by --- separator
    sections = text.split("\n---\n")

    for section in sections:
        section = section.strip()
        if not section or len(section) < 50:
            continue

        # Ekstrak judul (baris bold pertama atau heading ##)
        title_match = re.search(r'\*\*(.+?)\*\*|^##+ (.+)', section, re.MULTILINE)
        title = ""
        if title_match:
            title = (title_match.group(1) or title_match.group(2) or "").strip()

        # Ekstrak kategori utama dari heading ## besar
        cat_match = re.search(r'^## (\d+\. .+)', section, re.MULTILINE)
        category = cat_match.group(1) if cat_match else "Umum"

        # Ekstrak URL sumber
        sources = re.findall(r'https?://[^\s\)]+', section)

        # Bersihkan teks (hapus markdown formatting)
        clean = re.sub(r'\*\*(.+?)\*\*', r'\1', section)
        clean = re.sub(r'\[.+?\]\(.+?\)', '', clean)
        clean = re.sub(r'🔗 Sumber:.+', '', clean)
        clean = re.sub(r'⚠️', '', clean)
        clean = re.sub(r'^\s*#+\s*', '', clean, flags=re.MULTILINE)
        clean = re.sub(r'\n{3,}', '\n\n', clean).strip()

        # Skip header/metadata sections
        is_header = (
            "KNOWLEDGE BASE DESCHAIN" in section
            or title in ("TL;DR", "Platform Pengadaan Kolektif AI untuk UMKM Indonesia", "")
            or clean.startswith("# KNOWLEDGE BASE")
            or re.match(r'^[\s\-\*•]+Regulasi kunci', clean)
        )

        if len(clean) > 80 and not is_header:
            chunks.append({
                "title": title,
                "category": category,
                "content": clean,
                "sources": sources[:3],
                "raw": section,
            })

    return chunks if chunks else _fallback_chunks()


def _fallback_chunks() -> list[dict]:
    """Fallback jika file tidak ditemukan"""
    return [
        {
            "title": "Tentang Deschain",
            "category": "Platform",
            "content": "Deschain adalah platform pengadaan kolektif bertenaga AI untuk UMKM Indonesia. "
                       "UMKM dapat bergabung grup pengadaan untuk mendapat harga grosir 15-25% lebih murah. "
                       "Setiap transaksi otomatis tercatat sebagai credit trail untuk akses pembiayaan.",
            "sources": [],
        }
    ]
