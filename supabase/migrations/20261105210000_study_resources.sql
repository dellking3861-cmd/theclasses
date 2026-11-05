-- Study resources: YouTube lectures and PDF notes / past papers, tagged by
-- level, board, group, subject and year. Lectures are YouTube links (no video
-- storage); PDFs live in the private "study-resources" bucket and are read
-- through signed URLs, so a file is readable only when its row is visible.

-- ------------------------------------------------------------
-- Helpers
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.is_active AND u.role IN ('admin', 'teacher')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_active_member()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_active);
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff(), public.is_active_member() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff(), public.is_active_member() TO anon, authenticated, service_role;

-- ------------------------------------------------------------
-- Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('lecture', 'notes', 'past_paper', 'worksheet', 'solution')),
  title VARCHAR(200) NOT NULL CHECK (length(btrim(title)) > 0),
  description TEXT CHECK (length(description) <= 2000),
  stage TEXT CHECK (stage IN ('secondary', 'higher_secondary')),
  board TEXT REFERENCES public.curriculum_boards(code) ON UPDATE CASCADE,
  group_code TEXT,
  subject TEXT REFERENCES public.curriculum_subjects(code) ON UPDATE CASCADE,
  year SMALLINT CHECK (year BETWEEN 1990 AND 2100),
  youtube_id TEXT CHECK (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  file_path TEXT UNIQUE CHECK (file_path ~ '^[A-Za-z0-9/_.-]+\.pdf$' AND position('..' in file_path) = 0),
  file_size INTEGER CHECK (file_size > 0),
  visibility TEXT NOT NULL DEFAULT 'students' CHECK (visibility IN ('students', 'public')),
  is_published BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- A lecture is a YouTube video; everything else is a PDF
  CONSTRAINT study_resources_content_check CHECK (
    (kind = 'lecture' AND youtube_id IS NOT NULL AND file_path IS NULL)
    OR (kind <> 'lecture' AND file_path IS NOT NULL AND youtube_id IS NULL)
  ),
  CONSTRAINT study_resources_offering_fkey FOREIGN KEY (board, stage)
    REFERENCES public.curriculum_offerings(board, stage) ON UPDATE CASCADE,
  CONSTRAINT study_resources_group_fkey FOREIGN KEY (board, stage, group_code)
    REFERENCES public.curriculum_groups(board, stage, code) ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS study_resources_filter_idx ON public.study_resources (stage, board, group_code, subject);
CREATE INDEX IF NOT EXISTS study_resources_kind_idx ON public.study_resources (kind, created_at DESC);
CREATE INDEX IF NOT EXISTS study_resources_uploaded_by_idx ON public.study_resources (uploaded_by);

DROP TRIGGER IF EXISTS update_study_resources_updated_at ON public.study_resources;
CREATE TRIGGER update_study_resources_updated_at
  BEFORE UPDATE ON public.study_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;

-- Staff see everything; signed-in members see published items; visitors see published public items
DROP POLICY IF EXISTS "study_resources read" ON public.study_resources;
CREATE POLICY "study_resources read" ON public.study_resources
  FOR SELECT TO anon, authenticated
  USING (
    public.is_staff()
    OR (is_published AND (visibility = 'public' OR public.is_active_member()))
  );

DROP POLICY IF EXISTS "study_resources insert" ON public.study_resources;
CREATE POLICY "study_resources insert" ON public.study_resources
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff() AND uploaded_by = auth.uid());

-- Admins manage everything; teachers manage their own uploads
DROP POLICY IF EXISTS "study_resources update" ON public.study_resources;
CREATE POLICY "study_resources update" ON public.study_resources
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR (public.is_staff() AND uploaded_by = auth.uid()))
  WITH CHECK (public.is_admin() OR (public.is_staff() AND uploaded_by = auth.uid()));

DROP POLICY IF EXISTS "study_resources delete" ON public.study_resources;
CREATE POLICY "study_resources delete" ON public.study_resources
  FOR DELETE TO authenticated
  USING (public.is_admin() OR (public.is_staff() AND uploaded_by = auth.uid()));

-- ------------------------------------------------------------
-- Storage: private bucket, PDFs only, 25 MB each
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('study-resources', 'study-resources', false, 26214400, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE
  SET public = false, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

-- A file can be read only when the reader can see its study_resources row
-- (the subquery runs under the reader's own RLS).
DROP POLICY IF EXISTS "study-resources read" ON storage.objects;
CREATE POLICY "study-resources read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'study-resources'
    AND (
      public.is_staff()
      OR EXISTS (SELECT 1 FROM public.study_resources r WHERE r.file_path = storage.objects.name)
    )
  );

DROP POLICY IF EXISTS "study-resources upload" ON storage.objects;
CREATE POLICY "study-resources upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'study-resources' AND public.is_staff());

DROP POLICY IF EXISTS "study-resources delete" ON storage.objects;
CREATE POLICY "study-resources delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'study-resources'
    AND (public.is_admin() OR (public.is_staff() AND owner_id = auth.uid()::text))
  );
