-- ============================================================
-- SINGLE CAMPUS
-- The initial schema seeded three demo campuses (Gulshan, Clifton, Lahore)
-- with made-up addresses. The academy has one campus, in Malir 15, Karachi.
--
-- - The Gulshan row already has users/students/courses/batches linked to it,
--   so it is turned into the real campus (keeps every link intact).
-- - Clifton and Lahore are deleted only while nothing references them
--   (batches would otherwise be removed by ON DELETE CASCADE).
-- Safe to re-run.
-- ============================================================

UPDATE public.branches
SET name = 'The Classes - Malir Campus',
    address = 'R-156 Salman Garden, Near Jamia Millia Road, Malir 15',
    city = 'Karachi',
    phone = '+92 336 3861205',
    email = 'wasikherro@gmail.com',
    is_active = true
WHERE name = 'The Classes - Gulshan Campus';

DELETE FROM public.branches b
WHERE b.name IN ('The Classes - Clifton Campus', 'The Classes - Lahore Campus')
  AND NOT EXISTS (SELECT 1 FROM public.users       WHERE branch_id = b.id)
  AND NOT EXISTS (SELECT 1 FROM public.students    WHERE branch_id = b.id)
  AND NOT EXISTS (SELECT 1 FROM public.courses     WHERE branch_id = b.id)
  AND NOT EXISTS (SELECT 1 FROM public.batches     WHERE branch_id = b.id)
  AND NOT EXISTS (SELECT 1 FROM public.timetable   WHERE branch_id = b.id)
  AND NOT EXISTS (SELECT 1 FROM public.announcements WHERE branch_id = b.id);
