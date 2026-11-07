# The Classes

Website and school portal for The Classes, a coaching centre in Malir 15, Karachi.

- **Public site:** courses, admissions, the founder page and contact, at https://theclasses.vercel.app
- **Dashboards** for admins, teachers, students and parents: students, fees, attendance, YouTube lectures, PDF notes and past papers.

For a one-screen map of the system and recent work, see [diagrams/project-context-graph.md](diagrams/project-context-graph.md).

## Stack

| Part | Uses |
|---|---|
| App | Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4 |
| Data, logins, files | Supabase: Postgres with row-level security, Auth, Storage |
| Hosting | Vercel. Every merge to `main` deploys to production |
| Forms | react-hook-form + zod |

Next.js 16 differs from older versions. Read `node_modules/next/dist/docs/` before changing framework-level code (see `AGENTS.md`).

## Run it locally

```bash
npm install
```

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` (values are in Supabase → Project Settings → API, and in Vercel → Settings → Environment Variables), then:

```bash
npm run dev
```

Open http://localhost:3000. Signing in needs a user in the Supabase project.

## Environment variables

| Name | Needed for | Secret |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | everything | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | everything (public key; access is enforced by RLS) | no |
| `SUPABASE_SERVICE_ROLE_KEY` | admin creating, deleting and linking accounts; public enquiries | **yes, server only** |
| `GMB_API_KEY` | Google rating and opening hours on the site (Places API) | yes |
| `NEXT_PUBLIC_SITE_URL` | canonical URLs and sitemap (defaults to theclasses.vercel.app) | no |
| `NEXT_PUBLIC_APP_URL` | link in sign-up confirmation emails (defaults to the request origin) | no |

Never commit `.env.local`.

## Tests

```bash
npm test
```

- `tests/db/`: database tests on an in-memory Postgres (PGlite). They apply every migration in order and check the access rules: who can see and change people, enrollments, attendance, assignments, exam results, fees and study materials.
- `tests/*.test.ts`: unit tests (YouTube link parsing, class matching, rate limiter).

Also run before merging:

```bash
npx tsc --noEmit
```

```bash
npm run build
```

## Database changes

`supabase/migrations/` is the source of truth. `database/schema.sql` is an old snapshot; don't use it.

1. Add `supabase/migrations/<timestamp>_<name>.sql`.
2. Add or extend a test in `tests/db/` and run `npm test`. It applies all migrations from scratch.
3. Apply it to the live project. Supabase records its own version number, so rename the file to that version so the repo and the database match.

Access rules live in the database (RLS), not only in the app. Logged-in roles, admins included, can update only `full_name`, `phone`, `avatar_url` and `last_login_at` on `users`; admin routes that change `is_active` or `role` must use the service client after `requireAdmin`. Helper functions: `is_admin()`, `is_staff()` (active admin or teacher), `is_active_member()`, and `course_roster(course)` (names a course's teacher or an admin may see).

## How access works

- `middleware.ts` sends visitors to the right place: signed-out users to `/login`, each role to its own dashboard, deactivated accounts to `/login?error=inactive`.
- Each dashboard layout also checks the role on the server (`requireAuth`), and every `/api/admin/*` route calls `requireAdmin` (an active admin). Don't rely on the middleware alone.
- Admin-created accounts are tagged `provisioned_by: "admin"` so the sign-up trigger doesn't create a duplicate profile.
- Deleting a login cascades to the profile, role rows and parent links.

## Project layout

```
app/(public)      public site
app/(auth)        login, register, forgot/reset password
app/dashboard     admin, teacher, student, parent dashboards
app/api           admin API, auth, enquiries, YouTube title lookup
components        UI, forms, landing sections, study materials
lib               auth, Supabase clients, curriculum, SEO, rate limit, link helpers
supabase/migrations  database schema and access rules
tests             database and unit tests
```

## Deploying

Merge a pull request into `main`; Vercel builds and deploys it. Set environment variables in Vercel → Settings → Environment Variables. Database migrations are applied separately (see above), before merging code that depends on them.
