FROM python:3.11-slim

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/* || true

COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=user . .

EXPOSE 7860

# Jalankan create_all (auto-migrate) lalu start server
CMD ["sh", "-c", "python -c 'from app.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine); print(\"DB ready\")' && uvicorn app.main:app --host 0.0.0.0 --port 7860"]
