# The Classes: User Manual

For the office (admins), teachers, students and parents. Website: **https://theclasses.vercel.app**

Pages marked *Coming soon* are in the menu but don't do anything yet.

---

## Signing in

1. Open the website and tap **Log in** (top right).
2. Enter your email and password. You land on your own dashboard.

**Accounts:**
- The office creates accounts for students, teachers and parents.
- Students and parents can also sign up at **/register**; the office then links them to the right courses or children.

**Forgot your password?**
1. Open **Log in → Forgot password**, enter your email and tap **Send Reset Link**.
2. Open the email *in the same browser*. On the "Choose a new password" page, enter it twice and save.
3. If the link says it expired, request a new one.

**"Too many sign-in attempts":** wait 10 minutes and try again. This protects accounts from password guessing.

**"Account deactivated":** contact the office.

---

## Office (admin)

### Setting up a new session, in this order

1. **Branches** and **Batches:** add your campus and batches (e.g. "Matric Morning").
2. **Teachers → Add Teacher:** name, email, a starting password (8+ characters), phone.
3. **Courses → Create Course:** title, level/board/group/subject, fee, **Teacher** and **Batch**.
4. **Students → Add Student:** details, board/level/group, batch, and tick their **Courses**.
5. **Parents → Add Parent:** details, then tick their **Children**.

Tell each person their email and starting password. They can change it with "Forgot password".

### Everyday tasks

| Task | Where | How |
|---|---|---|
| Answer website enquiries | **Enquiries** | Call or WhatsApp from the card, then set the status (New, Contacted, Enrolled, Closed) |
| Enrol a student in a course | **Students → Edit** | Tick or untick courses, then **Update** |
| Link a parent to a child | **Parents → Edit** | Tick the children, then **Update** |
| Change someone's name or phone | Students, Teachers or Parents **→ Edit** | Email can't be changed here |
| Deactivate or delete someone | *Not on the website yet* | Ask your developer. Deleting is permanent and removes all their records |
| Record a fee | **Fee Management → Add Fee Record** | Student, amount, paid amount, status, due date |
| Mark attendance | **Attendance** | Pick course and date, set each student Present/Absent/Late/Excused, **Save**. Saving the same day again updates it |
| Add a YouTube lecture | **Study Materials → Add lecture** | Paste the YouTube link (Public or Unlisted; the title fills in), choose level/board/subject |
| Upload notes or a past paper | **Study Materials → Upload PDF** | PDF up to 25 MB, type, level/board/subject, year |
| Hide material without deleting | **Study Materials** | Tap the eye icon |
| See the numbers | **Analytics** | Active students, new this month, fees collected, attendance rate, students by board |
| Post news | **Announcements** or **Blog Portal** | Create, then publish |
| Schedule exams and assignments | **Exams**, **Assignments** | Create for a course and teacher |

**Tips**
- Only students ticked into a course appear on its attendance list.
- "Students only" materials need a signed-in student. "Public" ones are visible to anyone.
- Payment *methods* are recorded by you. There is no online payment on the website.

---

## Teachers

| Page | What it does |
|---|---|
| **Overview** | Your courses |
| **Mark Attendance** | Pick one of your courses and a date, mark each student, **Save**. You only see your own courses and students' names |
| **Video Lectures** | Add YouTube lectures for your students. You can edit or delete only your own |
| **Notes & Past Papers** | Upload PDFs for your students. You can edit or delete only your own |
| Assignments, Grade Work, Quiz Generator, Timetable, Communication | *Coming soon* |

If a course or student is missing, ask the office: the course must have you as its teacher, and the student must be ticked into it.

---

## Students

| Page | What you see |
|---|---|
| **Overview** | Shortcuts to lectures, notes, assignments and progress; your attendance and any fee due |
| **My Courses** | Courses you're enrolled in |
| **Lectures** | Recorded lessons for your class. Tap one to play it here |
| **Notes & Past Papers** | PDFs for your class. **View** opens them, **Download** saves them |
| **Assignments** | What's set for your courses and due dates (submit work to your teacher in class; online submission is coming soon) |
| **Attendance**, **Exams**, **Fees**, **Progress** | Your records and results as the office enters them |

Lectures and notes first show **My class** (your board and group). Tap **Everything** to see all subjects.

Free lessons are also on Sir Wasi's YouTube channel (link on the home page).

---

## Parents

| Page | What you see |
|---|---|
| **Overview** | Your linked children |
| Attendance, Academic Reports, Fee Status, Teacher Feedback, Exam Results, Notifications | *Coming soon* |

If your child is missing, ask the office to link them to your account.

---

## Problems

| What you see | What to do |
|---|---|
| Sent back to the login page | Your session ended; sign in again |
| Sent to a different dashboard | Your account has another role; ask the office |
| A list is empty | It may simply have no data yet (e.g. no course enrolled, nothing uploaded) |
| A video won't play | The YouTube video must be Public or Unlisted, with embedding allowed |
| Reset email didn't arrive | Check spam; or ask the office to reset it from Supabase |

## Contact the office

- Phone or WhatsApp: **+92 336 3861205**
- Email: **wasikherro@gmail.com**
- Campus: R-156 Salman Garden, near Jamia Millia Road, Malir 15, Karachi. Monday to Saturday, 4:00 to 8:30 PM

*Last updated: 7 November 2026*
