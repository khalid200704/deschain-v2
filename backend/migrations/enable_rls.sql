-- Migration: Enable Row Level Security pada semua tabel public
-- Jalankan di Supabase SQL Editor (Project > SQL Editor)
-- Tanggal: 2026-07-06
--
-- Konteks arsitektur:
--   - FastAPI backend connect sebagai postgres superuser → bypass RLS, tidak terpengaruh
--   - PostgREST (anon/authenticated role) → diblokir total karena tidak ada policy
--   - Frontend TIDAK pakai Supabase JS client, hanya call FastAPI
--
-- Hasil: semua akses data melalui FastAPI (terlindungi JWT + RBAC backend).
--       PostgREST tidak bisa digunakan untuk bypass autentikasi.

-- ── Enable RLS ─────────────────────────────────────────────────────────────
ALTER TABLE public.users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkms                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_groups   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments             ENABLE ROW LEVEL SECURITY;

-- Tabel lain yang mungkin ada (aman untuk dijalankan, IF EXISTS via RLS flag)
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename NOT IN (
              'users','umkms','vendors','notifications',
              'procurement_requests','procurement_groups',
              'group_memberships','transactions','payments'
          )
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
        RAISE NOTICE 'RLS enabled on public.%', tbl;
    END LOOP;
END $$;

-- ── Verifikasi ─────────────────────────────────────────────────────────────
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
