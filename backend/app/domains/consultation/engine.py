"""
Consultation engine — TF-IDF retrieval + Claude Haiku response generation (RAG)
"""
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .knowledge_base import load_chunks

# ── Load & index saat module dimuat ──────────────────────────────
_chunks = load_chunks()
_corpus = [f"{c['title']} {c['content']}" for c in _chunks]

_vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    min_df=1,
    stop_words=None,
    sublinear_tf=True,
)
_tfidf_matrix = _vectorizer.fit_transform(_corpus)

_SYSTEM_PROMPT = """Kamu adalah asisten konsultasi Deschain — platform pengadaan kolektif bertenaga AI untuk UMKM Indonesia.

Tugasmu: menjawab pertanyaan seputar pengadaan kolektif, KUR/pembiayaan, regulasi OJK/BI, pemasaran digital, manajemen keuangan, dan fitur Deschain.

Aturan menjawab:
- Jawab dalam Bahasa Indonesia yang jelas, hangat, dan praktis
- Gunakan **bold** untuk poin penting
- Berikan jawaban spesifik dan actionable, bukan generik
- Jika relevan, tambahkan 💡 tips praktis di akhir
- Jangan sebut bahwa kamu menggunakan "knowledge base" atau "konteks" — langsung jawab saja
- Jika informasi tidak ada dalam konteks, jawab jujur bahwa kamu belum punya informasi tersebut
- Jangan memberikan nasihat hukum atau keuangan yang bersifat final — selalu anjurkan konsultasi profesional untuk keputusan besar"""

_GREETINGS = {
    "halo", "hai", "hi", "hello", "hei", "hey",
    "tes", "test", "coba", "ping", "yo",
    "sapa", "selamat", "pagi", "siang", "sore", "malam",
    "assalamualaikum", "permisi", "hallo", "hei", "hola",
}


def retrieve(query: str, top_k: int = 3) -> list[dict]:
    """Ambil top-k chunk paling relevan untuk query"""
    q_vec = _vectorizer.transform([query])
    scores = cosine_similarity(q_vec, _tfidf_matrix).flatten()
    top_idx = scores.argsort()[::-1][:top_k]
    results = []
    for idx in top_idx:
        if scores[idx] > 0.05:
            results.append({**_chunks[idx], "score": float(scores[idx])})
    return results


def _detect_intent(query: str) -> str:
    q = query.lower()
    if any(w in q for w in ["kur", "kredit", "pinjam", "modal", "bunga", "bank", "dana", "pembiayaan", "agunan"]):
        return "pembiayaan"
    if any(w in q for w in ["ojk", "pojk", "bi", "bank indonesia", "regulasi", "aturan", "hukum", "peraturan"]):
        return "regulasi"
    if any(w in q for w in ["vendor", "supplier", "pemasok", "negosiasi", "harga", "stok", "pengadaan", "beli", "grosir"]):
        return "vendor_pengadaan"
    if any(w in q for w in ["marketing", "pemasaran", "jualan", "tiktok", "shopee", "digital", "online", "media sosial", "promosi"]):
        return "pemasaran"
    if any(w in q for w in ["keuangan", "pembukuan", "akuntansi", "arus kas", "laba", "rugi", "modal kerja", "harga jual"]):
        return "keuangan"
    if any(w in q for w in ["deschain", "grup", "gabung", "matching", "credit trail", "platform"]):
        return "platform"
    return "umum"


def _build_context(chunks: list[dict]) -> str:
    parts = []
    for i, chunk in enumerate(chunks, 1):
        title = f"[{chunk['title']}]" if chunk.get("title") else f"[Sumber {i}]"
        parts.append(f"{title}\n{chunk['content'][:600]}")
    return "\n\n---\n\n".join(parts)


def _ollama_answer(query: str, chunks: list[dict]) -> str:
    """Generate jawaban menggunakan model fine-tuned via Ollama (gratis, lokal)"""
    try:
        import httpx
        context = _build_context(chunks) if chunks else ""
        user_message = f"Pertanyaan: {query}" + (f"\n\nKonteks:\n{context}" if context else "")

        resp = httpx.post(
            "http://localhost:11434/api/chat",
            json={
                "model": "deschain-umkm",
                "messages": [
                    {"role": "system", "content": _SYSTEM_PROMPT},
                    {"role": "user", "content": user_message},
                ],
                "stream": False,
            },
            timeout=90,
        )
        if resp.status_code == 200:
            content = resp.json()["message"]["content"].strip()
            # Tolak jawaban yang tidak relevan (kode program, terlalu pendek, dll)
            code_signals = ["```", "print(", "def ", "import ", "input(", "= \"", "# "]
            if any(sig in content for sig in code_signals):
                return None
            if len(content) < 30:
                return None
            return content
    except Exception:
        pass
    return None


def _groq_answer(query: str, chunks: list[dict]) -> str:
    """Generate jawaban menggunakan Groq (gratis, cepat)"""
    try:
        from groq import Groq
        from app.config import get_settings
        settings = get_settings()
        if not settings.GROQ_API_KEY:
            return None
        context = _build_context(chunks) if chunks else "Tidak ada informasi relevan ditemukan."
        user_message = f"Pertanyaan: {query}\n\nKonteks:\n{context}"
        client = Groq(api_key=settings.GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            max_tokens=1024,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception:
        return None


def _haiku_answer(query: str, chunks: list[dict]) -> str:
    """Generate jawaban menggunakan Claude Haiku dengan retrieved chunks sebagai konteks"""
    try:
        import anthropic
        from app.config import get_settings
        settings = get_settings()

        if not settings.ANTHROPIC_API_KEY:
            return None

        context = _build_context(chunks) if chunks else "Tidak ada informasi relevan ditemukan."
        user_message = f"Pertanyaan: {query}\n\nKonteks:\n{context}"

        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        response = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        return response.content[0].text

    except Exception:
        return None


def _fallback_answer(query: str, chunks: list[dict]) -> str:
    """Template-based fallback jika tidak ada API key"""
    if not chunks:
        return (
            "Maaf, saya belum menemukan informasi yang relevan untuk pertanyaan Anda. "
            "Coba tanyakan tentang: pengadaan kolektif, KUR, regulasi OJK/BI, "
            "pemasaran digital, keuangan UMKM, atau tips vendor."
        )

    intent = _detect_intent(query)
    intro_map = {
        "pembiayaan": "Berikut informasi mengenai pembiayaan dan kredit untuk UMKM:",
        "regulasi": "Berikut informasi regulasi terkait yang relevan:",
        "vendor_pengadaan": "Berikut panduan terkait vendor dan pengadaan:",
        "pemasaran": "Berikut strategi pemasaran digital untuk UMKM:",
        "keuangan": "Berikut panduan manajemen keuangan UMKM:",
        "platform": "Berikut penjelasan mengenai fitur Deschain:",
        "umum": "Berikut informasi yang relevan dengan pertanyaan Anda:",
    }
    parts = [intro_map.get(intent, intro_map["umum"]), ""]

    for chunk in chunks[:2]:
        paragraphs = [p.strip() for p in chunk["content"].split("\n\n") if len(p.strip()) > 60]
        best = paragraphs[0] if paragraphs else chunk["content"][:400]
        if len(best) > 500:
            sentences = re.split(r'(?<=[.!?])\s+', best)
            best = " ".join(sentences[:4])
        if chunk["title"]:
            parts.append(f"**{chunk['title']}**")
        parts.append(best)
        if chunk.get("sources"):
            parts.append(f"*Sumber: {chunk['sources'][0]}*")
        parts.append("")

    tips_map = {
        "pembiayaan": "💡 **Tips:** Gunakan Credit Trail Deschain sebagai dokumen pendukung pengajuan KUR ke bank.",
        "vendor_pengadaan": "💡 **Tips:** Bergabung ke grup pengadaan Deschain untuk negosiasi harga lebih baik secara kolektif.",
        "pemasaran": "💡 **Tips:** Mulai dari 1 platform (TikTok Shop atau Shopee) sebelum ekspansi ke platform lain.",
        "keuangan": "💡 **Tips:** Pisahkan rekening pribadi dan bisnis sejak awal — ini syarat utama pengajuan KUR.",
        "platform": "💡 **Tips:** Cari Grup AI di menu sidebar untuk langsung menemukan UMKM dengan kebutuhan serupa.",
    }
    if intent in tips_map:
        parts.append(tips_map[intent])

    return "\n".join(parts).strip()


def answer(query: str) -> dict:
    """Main function — TF-IDF retrieve → Claude Haiku generate (RAG)"""
    if query.strip().lower() in _GREETINGS:
        return {
            "answer": (
                "Halo! Saya asisten konsultasi Deschain. 👋\n\n"
                "Saya siap membantu pertanyaan seputar:\n"
                "- **Pembiayaan & KUR** — cara dapat modal usaha\n"
                "- **Pengadaan kolektif** — bergabung grup beli bersama\n"
                "- **Regulasi OJK/BI** — aturan terbaru untuk UMKM\n"
                "- **Pemasaran digital** — TikTok Shop, Shopee, dll\n"
                "- **Manajemen keuangan** — pembukuan & arus kas\n\n"
                "Silakan tanya apa saja!"
            ),
            "sources": [],
            "chunks_used": 0,
            "intent": "greeting",
        }

    chunks = retrieve(query, top_k=3)

    # Priority: Groq → Claude Haiku → Ollama (lokal) → template fallback
    response_text = (
        _groq_answer(query, chunks)
        or _haiku_answer(query, chunks)
        or _ollama_answer(query, chunks)
        or _fallback_answer(query, chunks)
    )

    sources = []
    for c in chunks:
        sources.extend(c.get("sources", []))
    seen = set()
    unique_sources = [s for s in sources if not (s in seen or seen.add(s))]

    return {
        "answer": response_text,
        "sources": unique_sources[:3],
        "chunks_used": len(chunks),
        "intent": _detect_intent(query),
    }
