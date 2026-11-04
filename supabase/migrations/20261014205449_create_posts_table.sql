-- Already applied to the live project on 2026-10-14 (via the Supabase dashboard).
-- Same definition as the live one, made re-runnable (IF NOT EXISTS / DROP POLICY IF EXISTS)
-- so a fresh environment gets the same schema.
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  author_id UUID REFERENCES public.users(id),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.posts;
CREATE POLICY "Public posts are viewable by everyone" ON public.posts
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admins can do everything with posts" ON public.posts;
CREATE POLICY "Admins can do everything with posts" ON public.posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
