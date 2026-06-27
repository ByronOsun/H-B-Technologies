-- ============================================================
--  VIZIA Technologies — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. Hero / Splash carousel slides ─────────────────────────
CREATE TABLE IF NOT EXISTS hero_slides (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url   TEXT        NOT NULL,
  badge       TEXT,
  title       TEXT,
  subtitle    TEXT,
  cta_label   TEXT        DEFAULT 'Request Consultation',
  cta_href    TEXT        DEFAULT '/book-consultation',
  sort_order  INTEGER     DEFAULT 0,
  active      BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 2. Team member profiles ───────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  role        TEXT        NOT NULL,
  bio         TEXT,
  photo_url   TEXT,               -- Supabase Storage URL or external URL
  sort_order  INTEGER     DEFAULT 0,
  active      BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 3. Row-Level Security ─────────────────────────────────────
ALTER TABLE hero_slides  ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public site)
CREATE POLICY "Public read hero_slides"
  ON hero_slides FOR SELECT USING (true);

CREATE POLICY "Public read team_members"
  ON team_members FOR SELECT USING (true);

-- Admin can do everything (uses the anon key — restrict further if needed)
CREATE POLICY "Admin all hero_slides"
  ON hero_slides FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin all team_members"
  ON team_members FOR ALL USING (true) WITH CHECK (true);

-- ── 4. Storage bucket ─────────────────────────────────────────
-- Run this or create the bucket manually in:
-- Supabase Dashboard → Storage → New bucket
--   Name:   vizia-media
--   Public: YES (toggle on)

INSERT INTO storage.buckets (id, name, public)
VALUES ('vizia-media', 'vizia-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files (public bucket)
CREATE POLICY "Public read vizia-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vizia-media');

-- Allow uploads (no auth required — matches your admin password model)
CREATE POLICY "Admin upload vizia-media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vizia-media');

CREATE POLICY "Admin delete vizia-media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vizia-media');
