-- Migration: tambah kolom discount_tiers ke tabel vendors
-- Jalankan di Supabase SQL Editor (Project > SQL Editor)
-- Tanggal: 2026-07-06

ALTER TABLE vendors
    ADD COLUMN IF NOT EXISTS discount_tiers JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Verifikasi
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'vendors' AND column_name = 'discount_tiers';
