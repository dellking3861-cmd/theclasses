# Fix Roadmap: The Classes

This roadmap turns every finding in [`AUDIT.md`](./AUDIT.md) into ordered work items. Each item lists the files, the change and how to check it is done (a **Done when** test). The IDs (C1, H3, M4…) match the audit.

> **Status (2026-11-04):** Phase 0 ✅ and Phase 1 ✅ are **live**. The code was deployed via PR #4, and migrations `20261104163533_security_hardening.sql` and `20261104163553_onboarding.sql` were applied to the live project and verified (a student role-escalation attempt is denied, the RLS-disabled advisory is cleared, an enquiry from the live site is stored, and the signup trigger was tested in a rolled-back transaction). Remaining Supabase advisories are in Phase 4: `get_user_role` mutable search_path, and turning on leaked-password protection.

**Order matters.** Phase 0 closes the security holes and must ship before any real user is onboarded. A phase is finished only when every one of its **Done when** checks passes.

| Phase | Theme | Items | Estimate | Gate to next phase |
|---|---|---|---|---|
| 0 | Lock down security | C1, C2, C3, C4, M5 | 0.5–1 day | A student account cannot become admin or read another family's data |
| 1 | Make onboarding work | H1, H2, H4 | 1 day | A stranger can enquire, register, verify their email and land on their dashboard |
| 2 | Make admin & dashboards work | H3, H5, H6, H7, M3, M4, M9 | 1 day | Admins can create, edit and delete every entity, and each role sees its own data |
| 3 | Mobile & UX | H8, H9, M1, M2, contact overflow, tap targets | 0.5 day | Every admin form can be saved on a 375px phone |
| 4 | Production hardening | M6, M7, M8, M10, env, SEO, error pages, lint | 1 day | Launch checklist complete |

---

## Ground rules (apply to every change)

These rules stop the same bugs from coming back. Put them in `AGENTS.md` once Phase 0 is merged so future contributors and AI agents follow them.

### Database & RLS
1. **Every new table enables RLS in the same migration that creates it.** No exceptions, including join tables.
2. **Every `FOR UPDATE` or `FOR ALL` policy has a `WITH CHECK`.** A `USING` clause alone controls which rows can be changed, not what they can be changed into.
3. **Users can never write their own `role`, `is_active` or `branch_id`.** Enforce this with column grants and a trigger, not only in app code.
4. **The schema lives only in `supabase/migrations/`.** Never change the live database in the SQL editor without writing a matching migration. Delete `database/schema.sql`.
5. **Every table the app reads has a policy for each role that needs it.** When adding a `.from("x")` call, check that a policy grants that role access to `x`.
6. **`SECURITY DEFINER` functions set `search_path = ''`** and use fully qualified names.

### API routes
7. **Never trust role, ownership or IDs from the request body.** Get the user from `supabase.auth.getUser()` and the role from the database.
8. **Validate every request body with the zod schemas in `lib/validations.ts`** before using it. Reject unknown fields.
9. **Use one shared `requireAdmin()` helper** (in `lib/auth.ts`). Don't copy it into each route.
10. **Use the service-role client only after the admin check passes**, and only on the server. Never import `createAdminClient` from a client component.
11. **Check and return every Supabase `error`.** A route never reports success while ignoring a failed call.
12. **Never interpolate user input into `.or()` or `.filter()` strings.** Escape it or use typed methods such as `.ilike()`.
13. **Only redirect to relative paths** that start with `/` and not `//`.

### Frontend
14. **No fake submits.** A form that shows "sent" must have actually stored or sent something.
15. **Every modal must scroll** (`max-h-[90dvh] overflow-y-auto`) and must be tested at 375px.
16. **Tap targets are at least 44px tall** on mobile.

### Process
17. **Pull requests must pass `npm run lint`, `tsc --noEmit` and `next build`** (enforced in CI, see Phase 4).
18. **Any change to RLS or auth gets a manual test with a non-admin account** before merging.
19. **No hard-coded emails, user IDs or secrets** in source code.

---

## Phase 0: Lock down security (blocker)

Ship this as one migration, `supabase/migrations/003_security_hardening.sql`, plus small code changes. Test it on a Supabase branch or staging project first.

### 0.1 Stop users from changing their own role (C1)

```sql
-- Replace the open self-update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can only change safe columns
REVOKE UPDATE ON public.users FROM authenticated, anon;
GRANT UPDATE (full_name, phone, avatar_url) ON public.users TO authenticated;

-- Extra guard: block privilege changes unless the caller is an admin
CREATE OR REPLACE FUNCTION public.prevent_privilege_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role
      OR NEW.is_active IS DISTINCT FROM OLD.is_active
      OR NEW.branch_id IS DISTINCT FROM OLD.branch_id)
     AND NOT public.is_admin()
     AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'Not allowed to change role, status or branch';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER users_prevent_privilege_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_privilege_change();

-- Harden is_admin(): pin search_path and respect is_active
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin' AND is_active
  );
$$;
```
> Admins log in as the `authenticated` role too, so the column-level grant also limits them to `full_name`, `phone` and `avatar_url` from the browser. That is intended: **admin changes to `role`, `is_active` or `branch_id` must go through API routes that use the service-role client** (see 2.1). Check `grep -rn 'from("users")' app` for any client component that updates other columns, and move those updates to an API route.

**Done when:** logged in as a student, `supabase.from('users').update({ role: 'admin' }).eq('id', <own id>)` in the browser console returns an error, and the row is unchanged.

### 0.2 Enable RLS on the unprotected tables (C3)

```sql
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage parent links" ON public.parent_students
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Parents view own links" ON public.parent_students
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parents p WHERE p.id = parent_id AND p.user_id = auth.uid()));

CREATE POLICY "Admins manage timetable" ON public.timetable
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated view timetable" ON public.timetable
  FOR SELECT TO authenticated USING (true);
```
**Done when:** an anonymous request `GET /rest/v1/parent_students` with the anon key returns `[]`, and `POST` returns 401 or 403.

### 0.3 Lock the registration role (C2)

`app/api/auth/register/route.ts`:
- Parse the body with `registerSchema`. Change its `role` field to `z.enum(["student", "parent"])`.
- Return 400 for any other role.

**Done when:** `curl -X POST /api/auth/register -d '{"role":"admin",...}'` returns 400.

### 0.4 Remove the hard-coded admin (C4)

- Delete the `wasikherro@gmail.com` blocks in `lib/auth.ts:29-46`.
- Set that account's `role = 'admin'` directly in the database, using the SQL editor once and recording it in a seed note.

**Done when:** `grep -r "@gmail.com" app lib` finds nothing, and the owner can still reach `/dashboard/admin`.

### 0.5 Retire the setup endpoint (M5)

Delete `app/api/admin/setup/route.ts`, because the first admin now exists. If it is still needed, require a header that matches a one-time `SETUP_SECRET` env var.

### Phase 0 exit test
Using a fresh **student** test account, try to: (a) change your own role, (b) read `users` rows of other people, (c) insert into `parent_students`, (d) register as admin. **All four must fail.**

---

## Phase 1: Make onboarding work

### 1.1 Real lead capture (H1)

Migration `004_enquiries.sql`:
```sql
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('contact', 'admission')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (char_length(email) <= 255),
  phone text CHECK (char_length(phone) <= 30),
  subject text CHECK (char_length(subject) <= 200),
  message text NOT NULL CHECK (char_length(message) <= 5000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage enquiries" ON public.enquiries
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
-- No anon policy: inserts go through the API route below
```
- New `app/api/enquiries/route.ts`: validate with `contactSchema`, add a honeypot field and a simple per-IP rate limit, then insert with the service-role client. Optionally email the team (for example with Resend, using a `RESEND_API_KEY` env var).
- Point `contact/page.tsx` and `admissions/page.tsx` `onSubmit` at it. Show success only when the response is `ok`, and show an error toast otherwise.
- Fix the literal `&apos;` in the contact toast: use a normal apostrophe in JS strings.
- Add `/dashboard/admin/enquiries` (list, filter, change status) so the team can follow up.

**Done when:** submitting either form creates a row that is visible to the admin, and turning off the network shows an error toast instead of "sent".

### 1.2 Working self-registration (H2)

Create the profile in the database, not in the API route:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  r public.user_role := CASE
    WHEN NEW.raw_user_meta_data->>'role' = 'parent' THEN 'parent'::public.user_role
    ELSE 'student'::public.user_role
  END;
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, role, is_active)
  VALUES (NEW.id, NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
          NEW.raw_user_meta_data->>'phone', r, true)
  ON CONFLICT (id) DO NOTHING;

  IF r = 'student' THEN
    INSERT INTO public.students (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.parents (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
- The trigger **never** grants `teacher` or `admin`. Those roles come only from the admin API, which inserts its own rows; `ON CONFLICT DO NOTHING` prevents duplicates. **Check the order:** the admin routes call `auth.admin.createUser()`, which fires this trigger first. Change those routes to `upsert` or `update` the `users` row and role after creation, instead of `insert`.
- `app/api/auth/register/route.ts`: keep only the validated `signUp` call, passing `full_name`, `phone` and `role` in `options.data`, plus `emailRedirectTo: ${NEXT_PUBLIC_APP_URL}/login`. Remove the manual inserts.
- Set the Supabase **Site URL** and **Redirect URLs** to the production domain.
- Configure custom SMTP in Supabase Auth settings. The built-in sender is limited to a few emails per hour.

**Done when:** a new email address registers, receives the verification email, clicks it, logs in and lands on `/dashboard/student` (or `/dashboard/parent`) with a profile row present.

### 1.3 Add the `posts` table (H4)

```sql
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Education',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  author_id uuid REFERENCES public.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published posts" ON public.posts
  FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Admins manage posts" ON public.posts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
If a `posts` table already exists in the live database, compare its columns first and write the migration to match it.

**Done when:** an admin creates and publishes a post, it appears on `/blog` while logged out, and unpublishing it hides it.

---

## Phase 2: Make admin & dashboards work

### 2.1 Fix the admin data path (H3)

Choose **one** approach and apply it to every `app/api/admin/**` route.

- **Recommended:** keep the user-session client for the `requireAdmin()` check, then do all reads and writes with `createAdminClient()`. Every admin route then works regardless of per-table policies, and is protected by the admin check.
- Also add `is_admin()` policies so the database is safe on its own, and so client-side admin pages (such as the blog) work:

```sql
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['enrollments','attendance','assignments','submissions','exams',
    'exam_results','announcements','notifications','lectures','notes','student_progress','parents']
  LOOP
    EXECUTE format(
      'CREATE POLICY "Admins full access %1$s" ON public.%1$I FOR ALL TO authenticated
         USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
  END LOOP;
END $$;
```
Then add read policies so each role can see its own data:

| Table | Student | Parent | Teacher |
|---|---|---|---|
| `exams` | published, for courses they're enrolled in | published, for their child's courses | own (`teacher_id`) manage |
| `exam_results` | own `student_id` | ✅ exists | for own exams: manage |
| `assignments` | `status = 'published'`, enrolled courses | child's courses | ✅ exists |
| `submissions` | own: select, insert, update before grading | child's: select | for own assignments: select, update (grade) |
| `lectures`, `notes` | published, enrolled courses | — | own: manage |
| `announcements` | `target_role IS NULL OR target_role = 'student'` | same for `'parent'` | same for `'teacher'`; insert own |
| `parents` | — | own row: select | — |
| `enrollments` | ✅ exists | child's: select | own courses: select |

Also fix the existing teacher policies (`FOR ALL` without `WITH CHECK`) by adding a `WITH CHECK` that matches the `USING`.

**Done when:** as admin, every page under `/dashboard/admin/*` lists seeded data and can create, edit and delete a record. As a student with one enrollment, the student dashboard shows that course's exams, assignments and announcements.

### 2.2 Fix Edit Student and Edit Teacher (H5)

- `app/api/admin/students/[id]/route.ts` PUT: remove `phone` from the `students` update, and if `phone` or `full_name` is provided, update `users` separately (using the `user_id` looked up first).
- `app/api/admin/teachers/[id]/route.ts` PUT: remove `phone` and `branch_id` from the `teachers` update and write `phone` and `branch_id` to `users`.
- Validate both bodies with zod. Only include fields that were actually sent, so a partial update doesn't null out other columns.

**Done when:** editing a student's phone and batch, and a teacher's qualification and phone, saves and shows the new values after a reload.

### 2.3 Fully delete users (H6)

In the students, teachers and parents `[id]` DELETE routes:
- Use `createAdminClient()` and call `auth.admin.deleteUser(user_id)` **only**. The `users`, `students`, `teachers` and `parents` rows cascade via `ON DELETE CASCADE`.
- Check the error and return 500 on failure.
- Consider a soft delete (`is_active = false`) as the default action, because payments and attendance history is lost on hard delete.

**Done when:** a deleted student can no longer log in, and their row is gone from the list.

### 2.4 Add the branch `[id]` route (H7)

Create `app/api/admin/branches/[id]/route.ts` with GET, PUT and DELETE, following the pattern of `batches/[id]`. DELETE should refuse (409) if students or batches still reference the branch, or should deactivate it instead.

**Done when:** editing and deleting a branch from the admin page works.

### 2.5 Safe search (M3) and filter params (M4)

- Add a helper `escapeFilter(s)` that strips or escapes `, ( ) * \` and limits length to 100. Use it everywhere `.or()` is called with user text.
- For student and teacher name search, query `users` first (`.ilike("full_name", ...)`) and filter by `user_id`, or create a database view `student_directory` that joins `users` and search it.
- Make `lib/api.ts` send `branch_id` (matching the routes), or make the routes read `branchId`. Pick one name and use it everywhere.

**Done when:** searching `a,b)` returns results or an empty list (never a 500), and the branch filter narrows the list.

### 2.6 Respect deactivation in the database (M9)

`is_admin()` already checks `is_active` (from 0.1). Add an `is_active_user()` helper and AND it into the student, parent and teacher policies, so a deactivated user's token can't read data directly.

---

## Phase 3: Mobile & UX

| Item | File | Change | Done when |
|---|---|---|---|
| H8 dialog scroll | `components/ui/dialog.tsx:28` | `w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto`. Close on Escape, lock body scroll | Student form can be scrolled and saved at 375×667 |
| H9 header offset | `components/layout/dashboard-sidebar.tsx:182` | Remove the `isCollapsed ? "lg:ml-[72px]" : "lg:ml-64"` from `DashboardHeader` | Header starts at the sidebar's edge at 1280px |
| M1 open redirect | `app/(auth)/login/login-form.tsx:49` | `const safe = redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : null` | `/login?redirect=https://example.com` lands on the dashboard |
| M2 wrong redirect | `middleware.ts:72` | Look up the role (as the dashboard branch already does) before redirecting from auth pages | A logged-in student visiting `/login` goes straight to `/dashboard/student` |
| Contact overflow | `app/(public)/contact/page.tsx:41` | `grid grid-cols-1 min-[360px]:grid-cols-2` | No horizontal scroll at 320px |
| Tap targets | header login link, "Forgot password", footer links | `min-h-11` / `py-2.5` on mobile | All tappable elements ≥44px at 375px |
| Select defaults | `components/ui/select.tsx` | The placeholder `<option>` is `disabled` and no default value is set, so the browser silently selects the **first real option**. Admin forms can save the first branch, batch or course without anyone choosing it. Default to `""` when a placeholder is given (fixed for the Admissions form only) | Every form with a placeholder select shows the placeholder until a choice is made |
| Bell button | `dashboard-sidebar.tsx` | Add an `aria-label`. Hide it until notifications are wired up | — |

**Phase exit:** re-run the responsive script (the audit's Playwright check) across 320, 375, 768 and 1280px with no overflow, and do a manual pass of each dashboard on a real phone.

---

## Phase 4: Production hardening

| Item | Change |
|---|---|
| M8 | Rename `middleware.ts` → `proxy.ts` and the exported function to `proxy` (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`). Delete the unused `lib/supabase/middleware.ts`. Use the documented pattern so refreshed cookies are copied onto redirect responses. |
| M6 | Hide **AI Tutor** from the student nav (`app/dashboard/student/layout.tsx`) until a provider is connected. When connecting, use the Claude API on the server only. |
| M7 | `/api/ai/tutor`: require a logged-in student and add per-user rate limiting (for example with an Upstash Redis or Supabase table counter). Add a per-IP limit to `/api/auth/*` and `/api/enquiries`. |
| M10 | Delete `database/schema.sql`. Update the README to say "apply `supabase/migrations` with `supabase db push`". |
| Env | Add `.env.example` listing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `GMB_API_KEY`, `AI_API_KEY`, `RESEND_API_KEY`. Fix `.gitignore` so it does not ignore `.env.example` (`!.env.example`). Set all of these in Vercel for Production **and** Preview. |
| Headers | `next.config.ts` `headers()`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a basic CSP. |
| Pages | Add `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, and `loading.tsx` for `app/dashboard`. |
| SEO | Add `app/sitemap.ts`, `app/robots.ts` (disallow `/dashboard`, `/api`), `metadataBase` in the root layout, and an `opengraph-image`. Per-page `metadata` titles for public pages. |
| CSS | Remove the Google Fonts `@import` from `globals.css` (`next/font` already loads them). |
| Images | Replace `<img>` with `next/image` (7 places). Optimise `public/logo.png`. |
| Lint | Fix the 84 lint errors: replace `any` with types from `types/index.ts`, remove unused vars, fix the `react-hooks` warnings (move data loading out of `useEffect` + `setState` or use a server component). |
| CI | Add `.github/workflows/ci.yml` running `npm ci`, `npm run lint`, `npx tsc --noEmit` and `npm run build` on every PR. |
| Docs | Update `WORK_PLAN.md` and the README (it says Next 15) to match reality. |
| Monitoring | Add Vercel Analytics plus error tracking (such as Sentry). Turn on Supabase's **Security Advisor** and **Performance Advisor** and fix what they report. |
| Backups | Confirm the Supabase plan includes daily backups (point-in-time recovery if possible) before real payment data is stored. |

---

## Final launch checklist

- [ ] All Phase 0 exit tests fail as expected (no privilege escalation)
- [ ] Supabase Security Advisor shows no "RLS disabled" or "policy" errors
- [ ] Contact and Admission submissions appear in the admin enquiries page
- [ ] Register → verify email → log in works for student and parent, on a phone
- [ ] Admin can create, edit and delete: branch, batch, course, teacher, student, parent (with child link), payment, fee, attendance, exam, assignment, announcement, blog post
- [ ] Parent sees only their linked child's attendance, fees and results; student sees only their own
- [ ] Deleted or deactivated users cannot log in or query data
- [ ] Every admin form can be saved at 375px; no horizontal scroll at 320px on any page
- [ ] Production env vars set; Supabase Site URL is the production domain; custom SMTP is on
- [ ] CI is green on `main`; no lint errors
- [ ] 404 and error pages, sitemap and robots are live
- [ ] Backups confirmed

## Suggested PR breakdown

Keep each PR small and reviewable, and merge them in this order:

1. `fix/security-rls` — migration 003 + C2, C4, M5 *(Phase 0)*
2. `feat/enquiries` — H1
3. `fix/registration` — H2 trigger + register route + admin routes switched to upsert
4. `feat/posts-table` — H4
5. `fix/admin-api` — H3 policies + service-role reads/writes, H5, H6, H7, M3, M4, M9
6. `fix/mobile-ux` — Phase 3
7. `chore/proxy-and-hardening` — M8, headers, error pages, SEO, env example
8. `chore/lint-and-ci` — lint cleanup + CI workflow
