import { test } from "node:test";
import assert from "node:assert/strict";
import { freshDb, as, seedUsers } from "./setup.mjs";

const A = "00000000-0000-0000-0000-00000000000a", T = "00000000-0000-0000-0000-00000000000b";
const S = "00000000-0000-0000-0000-00000000000c", S2 = "00000000-0000-0000-0000-00000000000d";

test("assignments, exam results, announcements and fee checks", async () => {
  const db = await freshDb();
  await seedUsers(db, [{ id: A, role: "admin" }, { id: T, role: "teacher" }, { id: S, role: "student" }, { id: S2, role: "student" }]);
  const tid = (await db.query("INSERT INTO teachers (user_id) VALUES ($1) RETURNING id", [T])).rows[0].id;
  const sid = (await db.query("INSERT INTO students (user_id) VALUES ($1) RETURNING id", [S])).rows[0].id;
  await db.query("INSERT INTO students (user_id) VALUES ($1)", [S2]);
  const cid = (await db.query("INSERT INTO courses (title, slug, course_type, teacher_id) VALUES ('M', 'm', 'board', $1) RETURNING id", [tid])).rows[0].id;
  await db.query("INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'active')", [sid, cid]);

  assert.equal((await as(db, A, "INSERT INTO assignments (course_id, teacher_id, title, due_date) VALUES ($1, $2, 'HW', now()) RETURNING id", [cid, tid])).length, 1);
  assert.equal((await as(db, S, "SELECT id FROM assignments")).length, 0); // still a draft
  await db.query("UPDATE assignments SET status = 'published'");
  assert.equal((await as(db, S, "SELECT id FROM assignments")).length, 1); // enrolled
  assert.equal((await as(db, S2, "SELECT id FROM assignments")).length, 0); // not enrolled
  await assert.rejects(as(db, S, "INSERT INTO assignments (course_id, teacher_id, title, due_date) VALUES ($1, $2, 'x', now())", [cid, tid]));

  const eid = (await db.query("INSERT INTO exams (course_id, teacher_id, title, scheduled_at) VALUES ($1, $2, 'E', now()) RETURNING id", [cid, tid])).rows[0].id;
  await db.query("INSERT INTO exam_results (exam_id, student_id, percentage) VALUES ($1, $2, 80)", [eid, sid]);
  assert.equal((await as(db, S, "SELECT id FROM exam_results")).length, 1);
  assert.equal((await as(db, S2, "SELECT id FROM exam_results")).length, 0);

  await db.query("INSERT INTO announcements (title, content, author_id) VALUES ('N', 'x', $1)", [T]);
  assert.equal((await as(db, A, "UPDATE announcements SET title = 'N2' RETURNING id")).length, 1);

  await assert.rejects(db.query("INSERT INTO payments (student_id, amount, due_date) VALUES ($1, -5, now())", [sid]));
  await assert.rejects(db.query("INSERT INTO payments (student_id, amount, paid_amount, due_date) VALUES ($1, 5, 50, now())", [sid]));
  await db.query("INSERT INTO payments (student_id, amount, paid_amount, due_date) VALUES ($1, 5, 5, now())", [sid]);
});
