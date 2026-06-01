"""
Buat training data Q&A dari knowledge base Deschain
Output: finetune/data/train.jsonl (format ChatML untuk Unsloth)

Jalankan: python finetune/prepare_data.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
KB_FILES = sorted(ROOT.glob("kb-*.md"))
OUT_DIR = Path(__file__).parent / "data"
OUT_DIR.mkdir(exist_ok=True)

SYSTEM_PROMPT = (
    "Kamu adalah asisten konsultasi Deschain, platform pengadaan kolektif AI untuk UMKM Indonesia. "
    "Jawab pertanyaan tentang pengadaan kolektif, KUR/pembiayaan, regulasi OJK/BI, "
    "pemasaran digital, manajemen keuangan, dan fitur Deschain. "
    "Gunakan Bahasa Indonesia yang jelas, praktis, dan ramah."
)

# ── Template pertanyaan per topik ─────────────────────────────────
QUESTION_TEMPLATES = {
    "pengadaan": [
        "Apa itu {topic}?",
        "Bagaimana cara kerja {topic}?",
        "Apa manfaat {topic} untuk UMKM?",
        "Mengapa UMKM perlu {topic}?",
        "Berapa penghematan yang bisa didapat dari {topic}?",
    ],
    "kur": [
        "Berapa bunga KUR 2026?",
        "Apa syarat mengajukan KUR?",
        "Berapa plafon KUR yang bisa diajukan?",
        "Bagaimana cara mengajukan KUR ke bank?",
        "Apa perbedaan KUR Mikro, KUR Kecil, dan KUR Super Mikro?",
        "Apakah KUR butuh agunan?",
        "Bank mana yang menyediakan KUR terbaik untuk UMKM?",
        "Apa itu KUR Syariah?",
    ],
    "regulasi": [
        "Apa aturan OJK terbaru untuk UMKM?",
        "Bagaimana regulasi kredit untuk UMKM di Indonesia?",
        "Apa itu POJK dan bagaimana pengaruhnya ke UMKM?",
        "Apa kewajiban hukum UMKM terkait keuangan?",
    ],
    "pemasaran": [
        "Bagaimana cara jualan di TikTok Shop?",
        "Tips pemasaran digital untuk UMKM pemula?",
        "Platform mana yang paling efektif untuk UMKM?",
        "Bagaimana cara meningkatkan penjualan online UMKM?",
        "Apa strategi konten yang efektif untuk UMKM di media sosial?",
    ],
    "keuangan": [
        "Bagaimana cara membuat pembukuan sederhana untuk UMKM?",
        "Apa itu arus kas dan mengapa penting untuk UMKM?",
        "Bagaimana cara menghitung harga jual produk UMKM?",
        "Tips mengelola keuangan bisnis kecil?",
        "Apa perbedaan laba kotor dan laba bersih?",
    ],
    "vendor": [
        "Bagaimana cara negosiasi harga dengan supplier?",
        "Tips memilih vendor yang tepat untuk UMKM?",
        "Bagaimana cara mendapat harga grosir sebagai UMKM kecil?",
        "Apa yang perlu diperhatikan saat membuat kontrak dengan vendor?",
    ],
    "deschain": [
        "Apa itu Deschain?",
        "Bagaimana cara bergabung dengan grup pengadaan di Deschain?",
        "Apa itu credit trail di Deschain?",
        "Apa manfaat bergabung di Deschain untuk UMKM saya?",
        "Bagaimana AI matching di Deschain bekerja?",
        "Apakah Deschain gratis untuk UMKM?",
    ],
}

# Pertanyaan percakapan umum
CONVERSATIONAL_QA = [
    ("Halo, saya mau tanya tentang KUR", "Halo! Tentu, saya siap membantu. KUR (Kredit Usaha Rakyat) adalah program pemerintah untuk membantu UMKM mendapatkan modal usaha dengan bunga rendah 6% per tahun. Ada yang ingin Anda ketahui lebih spesifik — syarat pengajuan, plafon, atau bank penyalur?"),
    ("Apa itu Deschain?", "Deschain adalah platform pengadaan kolektif bertenaga AI untuk UMKM Indonesia. Intinya, Deschain menghubungkan UMKM dengan kebutuhan bahan baku/produk yang sama supaya bisa beli bersama — hasilnya harga grosir 15-25% lebih murah dibanding beli sendiri. Setiap transaksi juga otomatis membentuk credit trail yang bisa digunakan sebagai bukti rekam jejak keuangan saat mengajukan KUR ke bank."),
    ("Saya UMKM baru, dari mana mulainya?", "Selamat bergabung sebagai pelaku UMKM! Untuk awal, ada 3 hal yang paling penting:\n\n1. **Pisahkan keuangan pribadi dan bisnis** — buka rekening khusus usaha, ini syarat utama KUR\n2. **Catat semua transaksi** — sekecil apapun, pakai aplikasi gratis seperti BukuKas atau Jurnal\n3. **Bangun relasi dengan supplier** — pertimbangkan bergabung grup pengadaan kolektif untuk mendapat harga lebih murah\n\nAda topik tertentu yang ingin diperdalam?"),
    ("Gimana cara dapat modal usaha?", "Ada beberapa opsi modal usaha untuk UMKM:\n\n**1. KUR (paling umum)**\n- Bunga 6%/tahun, plafon hingga Rp 500 juta\n- Syarat: usaha minimal 6 bulan, punya rekening bank, dokumen usaha\n\n**2. KUR Syariah (BSI)**\n- Akad murabahah, margin setara 6% efektif\n- Cocok untuk yang menghindari bunga konvensional\n\n**3. Investor/Mitra**\n- Skema bagi hasil\n- Butuh track record bisnis yang baik\n\n💡 **Tips:** Daftarkan diri di Deschain — credit trail dari transaksi kolektif bisa memperkuat pengajuan KUR Anda ke bank."),
    ("Bagaimana cara negosiasi harga dengan supplier?", "Negosiasi harga dengan supplier lebih mudah jika Anda punya **leverage volume**. Beberapa tips:\n\n1. **Beli kolektif** — bergabung dengan UMKM lain lewat platform seperti Deschain untuk negosiasi harga grosir\n2. **Bayar tepat waktu** — supplier lebih fleksibel dengan pembeli yang reliable\n3. **Minta harga grosir** — tanyakan langsung: 'Berapa harga untuk pembelian minimal X unit?'\n4. **Bandingkan 3 supplier** — jadikan sebagai leverage negosiasi\n5. **Kontrak jangka panjang** — komitmen volume rutin biasanya dapat diskon 10-20%\n\nDengan pembelian kolektif melalui Deschain, anggota rata-rata hemat 15-25% dibanding beli individual."),
    ("Apa beda KUR dan pinjaman biasa?", "Perbedaan utama KUR vs pinjaman biasa:\n\n| Aspek | KUR | Pinjaman Biasa |\n|---|---|---|\n| Bunga | 6%/tahun (subsidi pemerintah) | 12-24%/tahun |\n| Agunan | Tidak wajib s/d Rp 100 juta | Biasanya wajib |\n| Plafon | Hingga Rp 500 juta | Tergantung bank |\n| Sasaran | Khusus UMKM | Semua segmen |\n\nKUR jauh lebih menguntungkan karena bunganya disubsidi pemerintah. Prioritaskan KUR sebelum ke pinjaman komersial biasa."),
    ("Platform jualan online mana yang bagus untuk UMKM?", "Untuk UMKM, rekomendasi berdasarkan tujuan:\n\n**Pemula → TikTok Shop**\n- Konten video bisa viral tanpa modal iklan besar\n- Algoritma berpihak ke seller baru\n- Cocok untuk produk visual (makanan, fashion, kerajinan)\n\n**Produk massal → Shopee**\n- Pasar terbesar di Indonesia\n- Fitur Shopee Food untuk kuliner\n\n**Produk premium → Tokopedia/Instagram**\n- Lebih ke quality seeker\n\n💡 **Tips:** Mulai dari **satu platform** dulu sampai stabil, baru ekspansi. Jangan serakah buka semua platform sekaligus — kualitas konten dan pelayanan akan turun."),
]


def parse_kb_sections(filepath: Path) -> list[dict]:
    """Parse KB markdown jadi list sections {title, content, sources}"""
    text = filepath.read_text(encoding="utf-8")
    sections = text.split("\n---\n")
    results = []

    for section in sections:
        section = section.strip()
        if len(section) < 80:
            continue

        # Skip header dokumen
        if "Knowledge Base | Mei 2026" in section or section.startswith("# KB-"):
            first_bold = re.search(r'\*\*(.+?)\*\*', section)
            if not first_bold:
                continue

        # Ekstrak judul
        title_match = re.search(r'\*\*(.+?)\*\*', section)
        title = title_match.group(1).strip() if title_match else ""

        # Ekstrak sumber
        sources = re.findall(r'https?://[^\s\)]+', section)

        # Bersihkan teks
        clean = re.sub(r'\*\*(.+?)\*\*', r'\1', section)
        clean = re.sub(r'🔗 Sumber:.+', '', clean)
        clean = re.sub(r'⚠️', '', clean)
        clean = re.sub(r'^\s*#+\s*', '', clean, flags=re.MULTILINE)
        clean = re.sub(r'\[.+?\]\(.+?\)', '', clean)
        clean = re.sub(r'\n{3,}', '\n\n', clean).strip()

        if title and len(clean) > 100:
            results.append({"title": title, "content": clean, "sources": sources[:2]})

    return results


def section_to_qa(section: dict) -> list[dict]:
    """Buat Q&A pairs dari satu section KB"""
    title = section["title"]
    content = section["content"]
    pairs = []

    # Q&A langsung dari title
    direct_q = f"Jelaskan tentang {title.lower()}"
    pairs.append((direct_q, content[:600]))

    # Variasi pertanyaan
    if any(w in title.lower() for w in ["kur", "kredit", "pembiayaan", "pinjam"]):
        pairs.append((f"Apa itu {title}?", content[:500]))
        pairs.append((f"Bagaimana cara memanfaatkan {title}?",
                      f"Untuk memanfaatkan {title}, perhatikan hal berikut:\n\n{content[:400]}"))
    elif any(w in title.lower() for w in ["cara", "tips", "strategi", "langkah"]):
        pairs.append((f"Berikan panduan tentang {title.lower()}", content[:600]))
    elif any(w in title.lower() for w in ["manfaat", "keuntungan", "penghematan"]):
        pairs.append((f"Apa keuntungan dari {title.lower()}?", content[:500]))

    # Format sebagai ChatML
    result = []
    for q, a in pairs:
        a_clean = a.strip()
        if len(a_clean) < 50:
            continue
        result.append({
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": q},
                {"role": "assistant", "content": a_clean},
            ]
        })
    return result


def main():
    dataset = []

    # 1. Dari KB files
    for kb_file in KB_FILES:
        print(f"Memproses {kb_file.name}...")
        sections = parse_kb_sections(kb_file)
        for section in sections:
            dataset.extend(section_to_qa(section))

    # 2. Pertanyaan percakapan manual
    for q, a in CONVERSATIONAL_QA:
        dataset.append({
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": q},
                {"role": "assistant", "content": a},
            ]
        })

    # 3. Shuffle
    import random
    random.seed(42)
    random.shuffle(dataset)

    # Split train/eval (90/10)
    split = int(len(dataset) * 0.9)
    train_data = dataset[:split]
    eval_data = dataset[split:]

    # Simpan
    train_path = OUT_DIR / "train.jsonl"
    eval_path = OUT_DIR / "eval.jsonl"

    with open(train_path, "w", encoding="utf-8") as f:
        for item in train_data:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    with open(eval_path, "w", encoding="utf-8") as f:
        for item in eval_data:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"\nSelesai!")
    print(f"   Train: {len(train_data)} examples -> {train_path}")
    print(f"   Eval:  {len(eval_data)} examples -> {eval_path}")
    print(f"\nContoh data:")
    for ex in dataset[:2]:
        print(f"  Q: {ex['messages'][1]['content'][:60]}...")
        print(f"  A: {ex['messages'][2]['content'][:80]}...")
        print()


if __name__ == "__main__":
    main()
