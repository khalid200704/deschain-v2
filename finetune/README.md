# Deschain UMKM Fine-tuned Model

Model konsultasi berbasis **Mistral-7B-Instruct-v0.3** yang di-fine-tune khusus untuk konteks UMKM Indonesia menggunakan QLoRA.

## Model di HuggingFace

**[joezy99/deschain-umkm-7b](https://huggingface.co/joezy99/deschain-umkm-7b)**

- Base model: `mistralai/Mistral-7B-Instruct-v0.3`
- Metode: QLoRA (4-bit NF4 quantization + LoRA r=16, alpha=32)
- Adapter size: ~160 MB
- Hardware: NVIDIA Tesla T4 via Google Colab

## Dataset

- `data/train.jsonl` — 79 pasang Q&A tentang KUR, regulasi OJK/BI, pengadaan kolektif, pemasaran digital, manajemen keuangan UMKM
- Format: OpenAI Chat format (system + user + assistant)
- Bahasa: Indonesia

## Arsitektur RAG Consultation Engine

Sistem konsultasi Deschain menggunakan 4-layer fallback:

```
User Query
    ↓
TF-IDF Retrieval (knowledge_base.py)
— Ambil top-3 chunk paling relevan dari knowledge base Deschain
    ↓
Layer 1: Groq API (llama-3.1-8b-instant) — gratis, latensi rendah
Layer 2: Claude Haiku (Anthropic) — fallback jika Groq tidak tersedia
Layer 3: Fine-tuned Mistral-7B (joezy99/deschain-umkm-7b) — via Ollama, offline-capable
Layer 4: Template-based — fallback akhir tanpa API key
```

## Cara Pakai via Python

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import torch

BASE_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
ADAPTER    = "joezy99/deschain-umkm-7b"

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
base = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    torch_dtype=torch.float16,
    device_map="auto"
)
model = PeftModel.from_pretrained(base, ADAPTER)

messages = [
    {"role": "system", "content": "Kamu adalah asisten konsultasi Deschain untuk UMKM Indonesia."},
    {"role": "user",   "content": "Bagaimana cara dapat KUR 2026?"}
]
prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=512, temperature=0.7, do_sample=True)
print(tokenizer.decode(outputs[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True))
```

## Cara Deploy via Ollama (Offline)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download base model
ollama pull mistral:7b-instruct

# Atau pakai Modelfile untuk Qwen (lebih ringan)
ollama pull qwen2.5:1.5b-instruct-q4_K_M
ollama create deschain-umkm -f Modelfile

# Test
ollama run deschain-umkm "Bagaimana cara dapat KUR untuk UMKM?"
```

## Training Ulang (Google Colab)

Buka `deschain_finetune.ipynb` di Google Colab (Runtime → T4 GPU):

1. Jalankan Cell 1–4 (setup & konfigurasi)
2. Upload `data/train.jsonl` di Cell 5
3. Jalankan Cell 6–11 (augmentasi → training)
4. Upload hasil ke HF di Cell 13

**Tips meningkatkan kualitas:**
- Tambah data training ke 500+ samples untuk perbedaan yang signifikan
- Naikkan `MAX_EPOCHS` dari 5 → 10 kalau data < 300
- Naikkan LoRA rank dari r=16 → r=32 untuk kapasitas lebih besar

## Tentang Deschain

Platform pengadaan kolektif AI untuk UMKM Indonesia.
- Demo: https://deschain-v2.vercel.app
- GitHub: https://github.com/khalid200704/deschain-v2
- HF Model: https://huggingface.co/joezy99/deschain-umkm-7b

*Tim Deschain — Universitas Tanjungpura, Pontianak*
*PIDI-DIGDAYA X Hackathon 2026 — BI · OJK · AFTECH*
