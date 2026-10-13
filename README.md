# The Classes

Pakistan's premier hybrid education platform combining physical coaching centers with online learning, AI-powered tools, and comprehensive student management.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Deployment:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and fill in your credentials
3. Run the database schema in the Supabase SQL Editor:

```bash
# Copy contents of database/schema.sql into Supabase SQL Editor and execute
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app                    # Next.js App Router pages
  /(public)             # Public website pages
  /(auth)               # Authentication pages
  /dashboard            # Role-based dashboards
    /admin              # Admin dashboard
    /student            # Student dashboard
    /teacher            # Teacher dashboard
    /parent             # Parent dashboard
  /api                  # API routes
/components             # Reusable UI components
  /ui                   # Base UI components
  /layout               # Layout components
  /landing              # Landing page sections
/database               # PostgreSQL schema
/hooks                  # Custom React hooks
/lib                    # Utilities, auth, validations
/services               # API abstraction layer
  /ai                   # AI service architecture
/store                  # Zustand stores
/types                  # TypeScript type definitions
/utils                  # Helper functions
/middleware.ts          # Auth & route protection
```

## User Roles

| Role    | Dashboard Route        |
|---------|------------------------|
| Admin   | `/dashboard/admin`     |
| Teacher | `/dashboard/teacher`   |
| Student | `/dashboard/student`   |
| Parent  | `/dashboard/parent`    |

## Features

- Role-based authentication with middleware protection
- Public marketing website with landing page
- Admin dashboard (students, teachers, courses, fees, analytics)
- Student dashboard (courses, lectures, assignments, AI tutor)
- Teacher dashboard (notes, assignments, attendance, grading)
- Parent dashboard (attendance, fees, exam results)
- AI service architecture (tutor, quiz generator, homework checker)
- PostgreSQL schema with Row Level Security

## Environment Variables

See `.env.local.example` for required variables.

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Set environment variables in Vercel dashboard before deploying.
