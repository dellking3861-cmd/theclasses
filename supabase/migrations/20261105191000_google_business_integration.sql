-- ============================================================
-- GOOGLE BUSINESS PROFILE INTEGRATION
-- Owner signs in with Google (OAuth) from the admin panel; the server keeps a
-- refresh token and syncs all reviews and photos from the Business Profile API.
-- Safe to re-run.
-- ============================================================

-- Single-row connection record. RLS is on with NO policies: only the server
-- (service role) can read it, so the refresh token never reaches a browser.
CREATE TABLE IF NOT EXISTS public.google_integration (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  refresh_token TEXT,
  connected_email TEXT,
  account_name TEXT,        -- accounts/{accountId}
  location_name TEXT,       -- locations/{locationId}
  location_title TEXT,
  connected_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  last_sync_error TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.google_integration ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.google_integration FROM anon, authenticated;

-- Synced reviews (public: shown on the website)
CREATE TABLE IF NOT EXISTS public.google_reviews (
  review_id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  author_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  reply TEXT,
  create_time TIMESTAMPTZ,
  update_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_google_reviews_create_time ON public.google_reviews (create_time DESC);

-- Synced photos (public: shown on the website)
CREATE TABLE IF NOT EXISTS public.google_media (
  media_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  description TEXT,
  width INTEGER,
  height INTEGER,
  create_time TIMESTAMPTZ,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_google_media_create_time ON public.google_media (create_time DESC);

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['google_reviews', 'google_media']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Anyone can read %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Anyone can read %1$s" ON public.%1$I FOR SELECT TO anon, authenticated USING (true)', t);
    EXECUTE format('DROP POLICY IF EXISTS "Admins manage %1$s" ON public.%1$I', t);
    EXECUTE format('CREATE POLICY "Admins manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
END $$;
