# The Classes: project context graph

Short map of the system and of the work done so far. Read this first in a new
session instead of replaying the old conversation. GitHub renders the graph below.

```mermaid
flowchart TD
  subgraph Host["Hosting"]
    V["Vercel prod: theclasses.vercel.app<br/>auto-deploys main"]
    SB[("Supabase bkpemjyzktnmamqertnj<br/>Postgres + Auth + Storage")]
  end
  subgraph App["Next.js 16 app"]
    MW["middleware.ts<br/>role redirects, inactive lockout"]
    PUB["Public pages<br/>home, courses, admissions, about,<br/>about/sir-wasi, contact, blog"]
    DASH["Dashboards<br/>admin / teacher / student / parent"]
    API["API routes<br/>/api/admin/* guarded by requireAdmin = is_admin()<br/>/api/enquiries, /api/youtube/oembed"]
  end
  subgraph Data["DB tables, RLS on"]
    T1["users, students, teachers, parents"]
    T2["courses, enrollments, payments,<br/>attendance, exams, assignments"]
    T3["curriculum_* boards, groups, subjects"]
    T4["study_resources + private bucket study-resources (PDF)"]
    T5["enquiries, posts"]
  end
  subgraph Ext["External"]
    G["Google Places API: rating + hours"]
    YT["YouTube: lecture embeds"]
  end
  subgraph Done["Merged this session"]
    D1["PR 19: edit/delete people, deactivated admins,<br/>real analytics and progress"]
    D2["PR 20-21: tests, removed Google OAuth sync,<br/>AI tutor stub, fees copy, unused deps"]
    D3["PR 22: password reset page"]
    D4["PR 23: search fix, login redirects,<br/>dashboard UI fixes, YouTube band"]
    D5["PR 25-29: batch/teacher dropdowns, enrolments,<br/>parent links, admin + teacher attendance"]
    D6["PR 30-33: security audit, docs,<br/>parent pages, deactivate/delete"]
    D7["PR 34-35: live QA fixes: number fields in forms,<br/>assignment + exam-result RLS, fee checks, deactivate"]
  end
  subgraph Todo["Open"]
    O1["No UI to enter exam marks (exam_results)"]
    O2["Supabase Pro: storage beyond 1 GB + backups"]
    O3["Deleting a teacher leaves their PDFs in storage"]
    O4["Leaked-password protection: user turns on in Supabase"]
  end
  V -->|serves| MW
  MW --> PUB
  MW --> DASH
  MW --> API
  API -->|supabase-js| SB
  DASH -->|RLS queries| SB
  SB --- T1
  SB --- T2
  SB --- T3
  SB --- T4
  SB --- T5
  PUB -->|cached 6h| G
  DASH -->|embed| YT
  Done -.->|npm test: 16 pass| App
  classDef todo fill:#fff4e5,stroke:#d97706
  class O1,O2,O3,O4 todo
```

## Facts that are easy to get wrong

- Default branch is `main`; every merge deploys to production.
- Migrations: write the file, apply with Supabase `apply_migration`, then rename
  the file to the version Supabase recorded.
- `npm test` runs PGlite database tests (all migrations applied in order) and unit tests.
- Admin-created users set `provisioned_by: "admin"` in user metadata so the sign-up
  trigger skips them.
- Deleting a login cascades to users, role rows and parent links.
- `users` UPDATE is column-granted (name, phone, avatar, last login only), even for admins;
  changing `is_active` or `role` needs the service client.
- Enrollments default to `pending`; readers filter on `active`, so admin enrolments set `active`.
- Number inputs in react-hook-form need `valueAsNumber: true`, or zod rejects them as strings.
