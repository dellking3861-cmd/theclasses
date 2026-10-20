# The Classes — User Manual

**Production URL:** https://theclasses.vercel.app

---

## Quick Start for All Roles

| Step | Action |
|------|--------|
| 1 | Open the URL above |
| 2 | Click **Login** (top-right) |
| 3 | Enter your email & password |
| 4 | You land on your role-specific dashboard |

> **Forgot password?** Use the "Forgot password" link on the login page. A reset email will be sent to your registered address.

---

## Role-Based Navigation Overview

### 🔐 Admin Dashboard
**URL:** `/dashboard/admin`  
**Purpose:** Full platform control — manage branches, users, courses, exams, fees, announcements, and analytics.

| Sidebar Section | Pages | Key Actions |
|-----------------|-------|-------------|
| **Overview** | Analytics | View enrollment trends, revenue, attendance rates, board distribution |
| **Academics** | Branches, Courses, Batches, Exams, Assignments | Create/edit branches; publish courses; schedule exams; post assignments |
| **People** | Students, Teachers, Parents | Add users, assign roles, reset passwords, view profiles |
| **Finance** | Fees, Payments | Configure fee structures; record payments; generate receipts |
| **Communication** | Announcements, Blog | Post platform-wide announcements; publish blog articles |
| **Attendance** | Attendance | Monitor daily attendance across all batches |

**Common Admin Tasks**
- **Add a branch:** Branches → "Add New Branch" → fill name, city, address → Save
- **Publish an exam:** Exams → "Create Exam" → select batch, date, subject, max marks → Publish
- **Post announcement:** Announcements → "New Announcement" → title, body, target audience → Post
- **Record payment:** Payments → "Record Payment" → select student, amount, method → Confirm

---

### 🎓 Student Dashboard
**URL:** `/dashboard/student`  
**Purpose:** Personal learning hub — track courses, submit assignments, view attendance, check grades.

| Tab | What You See | Key Actions |
|-----|--------------|-------------|
| **Courses** | Enrolled courses with progress bars; available courses to browse | Click "Continue Learning" on any course; browse & enroll in new ones |
| **Assignments** | Pending, submitted, overdue with due dates & marks | Click "Submit Now" → upload file/text → Submit |
| **Attendance** | Overall rate %, per-course breakdown, recent history | Review your attendance chart; spot courses needing improvement |
| **Exams** | Upcoming & past exams with schedules & results | View timetable; check results when published |
| **Fees** | Fee summary, due dates, payment history, receipts | Download receipts; see outstanding balance |
| **Lectures** | Upcoming live sessions, recorded lectures | Join live class; watch recordings |
| **Notes** | Shared notes from teachers, organized by course | View/download PDFs, images, links |
| **Progress** | Subject-wise scores, overall grade, assignment completion | Track improvement over time |

**Common Student Tasks**
- **Submit assignment:** Assignments → find "Pending" card → "Submit Now" → attach file → Confirm
- **Check exam schedule:** Exams → scroll to "Upcoming Exams" → note date/time/venue
- **View lecture recording:** Lectures → "Recorded" tab → click play on any session
- **Download fee receipt:** Fees → "History" → click download icon on any paid row

---

### 👨‍🏫 Teacher Dashboard
**URL:** `/dashboard/teacher`  
**Purpose:** Teaching workspace — manage classes, grade work, communicate, track attendance.

| Tab | What You See | Key Actions |
|-----|--------------|-------------|
| **Assignments** | Created assignments per course; submission status | "Create Assignment" → set title, description, due date, max marks → Publish |
| **Attendance** | Daily marking grid per batch; monthly summary | Mark Present/Absent/Late per student → Save; export CSV |
| **Communication** | Announcements to your batches; direct messages | Post batch announcement; message individual students/parents |
| **Grading** | Submitted assignments awaiting grading; gradebook | Open submission → enter marks + feedback → "Save & Publish" |
| **Lectures** | Schedule live sessions; upload recordings | "Schedule Live" → set date/time/meeting link → Notify students |
| **Notes** | Upload/share study materials per course | "Add Note" → title, course, attach file/link → Publish |
| **Timetable** | Weekly class schedule | View only (managed by admin) |
| **Quizzes** | Create & manage quick quizzes | "New Quiz" → add questions, set timer → Assign to batch |

**Common Teacher Tasks**
- **Grade submissions:** Grading → click "Ungraded" → enter marks/feedback → Publish
- **Mark attendance:** Attendance → select date/batch → toggle P/A/L per student → Save
- **Post batch announcement:** Communication → "New Announcement" → select batch → Post
- **Upload lecture notes:** Notes → "Add Note" → choose course → upload PDF → Publish

---

### 👨‍👩‍👧 Parent Dashboard
**URL:** `/dashboard/parent`  
**Purpose:** Monitor your child(ren)'s progress — academics, attendance, fees, exams, teacher feedback.

| Tab | What You See | Key Actions |
|-----|--------------|-------------|
| **Academics** | Enrolled courses, progress %, teacher names | View course details; see teacher contact info |
| **Attendance** | Daily & monthly attendance per child; alerts for low % | Spot trends; receive notifications if attendance < 75% |
| **Exams** | Upcoming exam schedule, past results, rank | Check timetable; view result cards when published |
| **Fees** | Outstanding balance, due dates, payment history, receipts | "Pay Now" (redirects to gateway); download receipts |
| **Feedback** | Teacher comments on assignments, behavior notes | Read feedback; reply to teacher via Communication |
| **Notifications** | All alerts: fee due, low attendance, exam results, announcements | Mark as read; filter by child/type |

**Common Parent Tasks**
- **Pay fees:** Fees → "Pay Now" on due row → complete payment → auto-updates balance
- **Check child's grade:** Academics → select child → view progress % per course
- **View teacher feedback:** Feedback → expand any card → read comments
- **Contact teacher:** Communication → "Message Teacher" → select child's teacher → send

---

## Shared UI Patterns (All Roles)

| Element | Behavior |
|---------|----------|
| **Top Bar** | Logo (home), role badge, notification bell, profile menu (settings, logout) |
| **Sidebar** | Collapsible (☰ hamburger on mobile); shows only your role's sections |
| **Cards** | Clickable rows → navigate to detail; hover = subtle shadow |
| **Badges** | Color-coded status: Green=active/good, Amber=warning/pending, Red=overdue/danger |
| **Empty States** | Illustrated + primary action button (e.g., "Browse Courses", "Add Branch") |
| **Tables** | Sortable headers; pagination; row hover highlight |
| **Forms** | Inline validation; required fields marked *; toast on success/error |
| **Responsive** | Mobile: sidebar drawer, stacked cards, horizontal scroll on tables |

---

## Accessibility & UX Notes

- **Keyboard nav:** Tab through all interactive elements; focus rings visible
- **Color contrast:** WCAG AA compliant (4.5:1 minimum)
- **Reduced motion:** Respects `prefers-reduced-motion` — no auto-animations
- **Screen readers:** Semantic HTML, ARIA labels on icon-only buttons
- **Loading states:** Skeleton screens on data fetch; disabled buttons during submit

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| "Access denied" on dashboard | Wrong role or session expired | Log out → log in again; contact admin if role mismatch |
| Data not loading | Supabase connection issue | Refresh; check internet; retry in 30s |
| Payment not reflecting | Gateway callback pending | Wait 2–3 min; refresh Fees page; contact admin if >10 min |
| Can't submit assignment | Past due date or already submitted | Check due date; if submitted, view in "Submitted" tab |
| Mobile sidebar won't open | JS error | Hard refresh (Ctrl+Shift+R); clear cache |

---

## Support Contacts

| Issue | Contact |
|-------|---------|
| Login / account | admin@theclasses.edu |
| Technical bugs | tech@theclasses.edu |
| Fee / payment | finance@theclasses.edu |
| Academic queries | Your child's teacher (via Communication tab) |

---

## Version & Updates

- **Current deploy:** `theclasses.vercel.app` (auto-deploys on `main` branch push)
- **Changelog:** See `/changelog` page or GitHub releases
- **Feature requests:** Use the "Feedback" button in profile menu

---

*Last updated: 2026-10-18*  
*Built with Next.js 16, Supabase, Tailwind CSS, TypeScript*