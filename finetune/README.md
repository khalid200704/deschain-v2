# Deschain UMKM Fine-tuned Model

Model konsultasi lokal berbasis Qwen2.5-1.5B yang di-fine-tune khusus untuk
konteks UMKM Indonesia.

## Dataset
- `data/train.jsonl` — 100+ pasang Q&A tentang KUR, regulasi OJK/BI, pengadaan,
  pemasaran digital, dan manajemen keuangan UMKM
- `data/eval.jsonl` — data evaluasi
- Format: OpenAI Chat format (system + user + assistant)

## Arsitektur RAG Consultation Engine

Sistem konsultasi menggunakan 3-layer fallback:

```
Query User
    ↓
TF-IDF Retrieval (scikit-learn)
    ↓ top-3 chunks relevan
Groq API (llama-3.1-8b-instant)   ← Layer 1 (cloud, gratis)
    ↓ fallback jika gagal
Claude Haiku (Anthropic)           ← Layer 2 (cloud, berbayar)
    ↓ fallback jika gagal
Ollama deschain-umkm (lokal)       ← Layer 3 (model ini)
    ↓ fallback jika gagal
Template-based response            ← Layer 4 (tanpa LLM)
```

## Fine-tuning Pipeline

Training dilakukan di Google Colab menggunakan Unsloth:

```
Base model : Qwen/Qwen2.5-1.5B-Instruct
Method     : LoRA (r=16, alpha=16)
Epochs     : 3
Optimizer  : adamw_8bit
Export     : GGUF Q4_K_M (~986 MB)
```

## Cara Deploy Model Lokal

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download base model
ollama pull qwen2.5:1.5b-instruct-q4_K_M

# Build fine-tuned model
cd finetune
ollama create deschain-umkm -f Modelfile

# Test
ollama run deschain-umkm "Bagaimana cara dapat KUR untuk UMKM?"
```

## Training (Opsional — untuk improve model)

```bash
pip install jupyter
jupyter notebook deschain_finetune.ipynb
```

## Cara Update Model

1. Edit `data/train.jsonl` dengan data baru
2. Jalankan `deschain_finetune.ipynb` di Google Colab
3. Download hasil GGUF ke `model/`
4. Re-create model Ollama:
   ```bash
   ollama rm deschain-umkm
   ollama create deschain-umkm -f ./Modelfile
   ```
