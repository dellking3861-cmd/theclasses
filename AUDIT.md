# Pre-Launch Audit: The Classes

**Date:** 2026-11-04 · **Branch audited:** `claude/stoic-clarke-widdje` @ `54b8202` · **Stack:** Next.js 16.2.9, React 19, Supabase

## Verdict

**Not ready to onboard users yet.** The public marketing site builds, renders and is responsive. But the platform behind it has **3 critical security holes**, and onboarding is broken: the lead forms send nothing, self-registration fails, and most admin modules can't save data. All of it is fixable. The estimate is about 2–4 days of focused work, mostly SQL policies and API fixes.

| Area | Status |
|---|---|
| Build / type-check | ✅ Passes (`next build`, `tsc --noEmit`) |
| Public site responsiveness | ✅ Good. One small overflow at 320px |
| Dashboard responsiveness | ⚠️ Header offset bug on desktop; form dialogs unusable on phones |
| Security (auth + database) | ❌ Critical: any user can become admin |
| Onboarding flows (contact, admission, register) | ❌ Broken or fake |
| Admin data management | ❌ Most modules blocked by missing database policies |
| Code quality (lint) | ⚠️ 84 errors, 97 warnings |
| SEO / ops basics | ⚠️ No sitemap, robots, error or 404 pages, or `.env` example |

---

## How this was tested

- `npm ci`, `tsc --noEmit`, `eslint .`, and `next build`, with placeholder Supabase env vars.
- Ran the production build (`next start`) and loaded 11 routes in headless Chromium at **320, 375, 768 and 1280px**. Checked horizontal overflow, runtime JS errors and tap-target sizes, and took screenshots.
- Manually reviewed middleware, auth, all `app/api/**` routes, the SQL migrations and RLS policies, the dashboard shell and the forms.
- **Not tested:** live Supabase data. The Supabase MCP connection failed in this session and no credentials were available, so dashboard behaviour is judged from code. Database findings come from `supabase/migrations/`. If the live database was changed by hand in the SQL editor, re-check them there.

---

## 🔴 Critical: fix before any real user signs up

### C1. Any logged-in user can make themselves admin
`supabase/migrations/002_initial_schema.sql:540`
```sql
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
```
This policy has no `WITH CHECK` and no column restriction. A student can open the browser console and run `supabase.from('users').update({ role: 'admin' }).eq('id', myId)`. The public anon key is in the page bundle, so this works for anyone. After that they have full admin access to every student's data and payments.
**Fix:** revoke `UPDATE` on `role`, `is_active` and `branch_id` from `authenticated`, and grant `UPDATE` only on safe columns (`full_name`, `phone`, `avatar_url`). Alternatively, add a `BEFORE UPDATE` trigger that rejects role changes unless `is_admin()`.

### C2. The registration API accepts any role, including `admin`
`app/api/auth/register/route.ts:8`. The form only offers Student or Parent, but the API takes `role` straight from the request body. Anyone can `POST {"role":"admin",...}` to `/api/auth/register`.
**Fix:** on the server, allow only `["student","parent"]` and validate with the existing `registerSchema` (zod).

### C3. Two tables have no Row Level Security at all
RLS is never enabled on `parent_students` or `timetable`. Anyone holding the public anon key can read, insert and delete rows in them, which includes linking themselves as the "parent" of any student. Combined with the parent policies, that exposes the student's attendance, payments and exam results.
**Fix:** `ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;` (same for `timetable`), plus admin-only write policies.

### C4. A hard-coded email gets admin rights
`lib/auth.ts:29-46`. `wasikherro@gmail.com` is always treated as admin, even without a `users` row. This is a backdoor that bypasses the database, and it is inconsistent with the middleware, which checks the DB role. Set the role in the database instead and delete this block.

---

## 🟠 High: blocks onboarding or core features

### H1. The Contact and Admission forms don't send anything
`app/(public)/contact/page.tsx:23` and `app/(public)/admissions/page.tsx:28` wait 1 second and then show "Message sent!". **Every enquiry is silently lost.** Since these are the main lead-capture forms, this is the single biggest onboarding blocker. (The contact toast also displays a literal `&apos;`.)
**Fix:** add an `enquiries` table (insert-only for `anon`) or an API route that emails the team (Resend or similar).

### H2. Self-registration fails
`/api/auth/register` calls `signUp`, then inserts into `users` with the **anon/user session**. But:
- There is no `INSERT` policy on `users`, `students` or `parents`, so RLS rejects the insert.
- With email confirmation on, `signUp` returns no session, so the insert runs as anon anyway.

Users get "Failed to create profile", and an orphan auth user may be left behind.
**Fix:** create the profile in a Postgres trigger on `auth.users` (`SECURITY DEFINER`, role taken from validated metadata and limited to student/parent), or do the insert with the service-role client after validating input.

### H3. Most admin modules can't read or write data
The admin API routes use the **user-session client**, but `is_admin()` policies exist only for `users`, `students`, `teachers`, `courses`, `payments`, `branches` and `batches`. These tables have RLS on but no admin policy: **`enrollments`, `attendance`, `assignments`, `submissions`, `exams`, `exam_results`, `announcements`, `notifications`, `lectures`, `notes`, `student_progress`, `parents`.** On those tables, admin lists come back empty and create/update/delete fail.
Similarly, students and parents have **no read policy** on `exams`, `assignments`, `announcements`, `lectures` or `notes`, so their dashboards will be empty even when data exists.
**Fix:** add `FOR ALL USING (is_admin()) WITH CHECK (is_admin())` to each table, plus read policies for the right roles.

### H4. Blog depends on a `posts` table that isn't in the migrations
`/blog`, `/blog/[slug]` and `/dashboard/admin/blog` query `posts`, but no migration creates it. A fresh deploy will error or show nothing. Add a migration with RLS: public reads published posts, admin writes.

### H5. Edit Student and Edit Teacher always fail
- `app/api/admin/students/[id]/route.ts:55` updates `phone` on `students`, which has no such column (`phone` is on `users`).
- `app/api/admin/teachers/[id]/route.ts:57-59` updates `phone` and `branch_id` on `teachers`, which has neither column.

Postgres rejects the whole update. Write `phone` to `users` instead and drop `branch_id` for teachers.

### H6. Deleting students or teachers leaves the login active
`students/[id]` and `teachers/[id]` `DELETE` call `supabase.auth.admin.deleteUser()` on the **anon-key client**. That call needs the service role, fails, and the error is ignored. The person can still log in. Use `createAdminClient()` and check the errors.

### H7. Branches can't be edited or deleted
`components/forms/branch-form.tsx:53` calls `/api/admin/branches/{id}`, but `app/api/admin/branches/[id]/route.ts` doesn't exist, so this returns 404.

### H8. Form dialogs are unusable on phones
`components/ui/dialog.tsx:28`. The dialog is `fixed` and vertically centred with no `max-h` or `overflow-y-auto`, and it is `w-full` with no side margin. The Student form has 13 fields, which is taller than a phone screen, so the top and bottom (including **Save**) are cut off and can't be scrolled to.
**Fix:** add `max-h-[90dvh] overflow-y-auto w-[calc(100%-2rem)]`.

### H9. The dashboard header is offset twice on desktop
`components/layout/dashboard-sidebar.tsx:182` gives `DashboardHeader` `lg:ml-64`, but it is already inside a wrapper with `lg:ml-64` (`dashboard-shell.tsx:38`). On screens ≥1024px the header starts 512px from the left and leaves a blank strip. Remove the margin from the header.

---

## 🟡 Medium

| # | Issue | Where |
|---|---|---|
| M1 | **Open redirect after login:** `?redirect=https://evil.com` is passed straight to `router.push`. Allow only paths that start with `/` and not `//`. | `app/(auth)/login/login-form.tsx:49` |
| M2 | Logged-in users who visit `/login` are always sent to `/dashboard/admin` (hard-coded), then bounced again. Look up the role first. | `middleware.ts:72` |
| M3 | **PostgREST filter injection:** raw `search` text is interpolated into `.or(...)`. Commas and parentheses break or alter the filter. The `user.full_name` filter on an embedded table also doesn't work this way. Escape the input or search a view. | `app/api/admin/students/route.ts:40` (and other list routes) |
| M4 | Branch filter never applies: the client sends `branchId` but the API reads `branch_id`. | `lib/api.ts` vs `app/api/admin/*/route.ts` |
| M5 | `/api/admin/setup` creates admin users and calls the Auth Admin REST API directly. Once the first admin exists, delete it or gate it behind a one-time secret. | `app/api/admin/setup/route.ts` |
| M6 | AI Tutor isn't wired to any provider (`callAI` always throws). The UI shows "being configured". Hide it from the student nav until it works, or connect it. | `services/ai/index.ts:201` |
| M7 | `/api/ai/tutor` and `/api/auth/*` have no auth check or rate limiting. When AI is enabled, the tutor endpoint becomes open to paid-API abuse. | `app/api/ai/tutor/route.ts` |
| M8 | `middleware.ts` is deprecated in Next 16 and should be renamed to `proxy.ts` (the build warns about this). The redundant `lib/supabase/middleware.ts` is unused. | `middleware.ts` |
| M9 | Nothing in RLS checks `is_active`. Deactivated users are blocked only by middleware, but can still query Supabase directly with their token. | migrations |
| M10 | `database/schema.sql` and `supabase/migrations/002_initial_schema.sql` have diverged. Keep only migrations as the source of truth. | `database/` |

## 🟢 Low / polish

- **320px overflow on Contact:** the 2-column info-card grid is 25px wider than the screen. Use `grid-cols-1 min-[360px]:grid-cols-2` (`contact/page.tsx:41`).
- Some tap targets are under 32px tall (login link in header, "Forgot password", footer links). Aim for 44px on mobile.
- The Google Fonts `@import` in `globals.css` comes after the Tailwind import (build warning) and duplicates `next/font`. Remove it.
- No `app/not-found.tsx`, `error.tsx` or `loading.tsx`. Users get the bare Next.js defaults.
- No `sitemap.ts`, `robots.ts`, `metadataBase`, or Open Graph image, which hurts SEO and link previews on WhatsApp and Facebook.
- `README.md` refers to `.env.local.example`, which doesn't exist. Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `GMB_API_KEY`, `AI_API_KEY`.
- `supabase/config.toml` `site_url` is `http://localhost:3000`. Set the production URL and redirect URLs in the Supabase dashboard, or the password-reset and confirmation emails will link to localhost.
- `WORK_PLAN.md` says everything is "Deployment Ready" and "tested end-to-end". This audit contradicts that, so update it to avoid confusion.
- Lint: 84 errors and 97 warnings, mostly `no-explicit-any` and unused vars, plus 4 `set-state-in-effect`, 3 `immutability` and 1 `purity` from React hooks rules. Those hook issues can cause extra renders.
- Raw `<img>` used in 7 places. `next/image` would give automatic resizing.

---

## Responsive test results

The production build ran in Chromium. ✅ means no horizontal scroll and no JS errors.

| Page | 320 | 375 | 768 | 1280 |
|---|---|---|---|---|
| /home | ✅ | ✅ | ✅ | ✅ |
| /about | ✅ | ✅ | ✅ | ✅ |
| /courses | ✅ | ✅ | ✅ | ✅ |
| /admissions | ✅ | ✅ | ✅ | ✅ |
| /contact | ⚠️ 25px overflow | ✅ | ✅ | ✅ |
| /blog | ✅ | ✅ | ✅ | ✅ |
| /ai-learning-programs | ✅ | ✅ | ✅ | ✅ |
| /login, /register, /forgot-password | ✅ | ✅ | ✅ | ✅ |
| /dashboard/* (unauthenticated) | ✅ redirects to /login | ✅ | ✅ | ✅ |

The public header has a working mobile menu below 768px, and the dashboard sidebar becomes an off-canvas drawer below 1024px. All 5 dashboard tables are wrapped in `overflow-x-auto`.

---

## Launch checklist (in order)

1. **Security SQL migration:** fixes C1 and C3, plus the missing admin, student and parent policies (H3) and the `posts` table (H4). Test with a student account that it **cannot** change its role.
2. **Code fixes:** C2, C4, H2, H5, H6, H7, M1, M2.
3. **Lead capture:** wire the Contact and Admission forms to storage or email (H1).
4. **Mobile dashboard:** fix the dialog scroll and header offset (H8, H9).
5. **Environment:** set all env vars in Vercel; set the Supabase Site URL and redirect URLs to the production domain; set up SMTP for auth emails (Supabase's built-in sender is heavily rate-limited).
6. **Smoke test with one real account per role:** register → verify email → log in → see dashboard. Admin: create, edit and delete a student, teacher, course, payment and announcement. Parent: see the linked child's attendance and fees.
7. Add the polish items (404/error pages, sitemap, OG image), then launch.
