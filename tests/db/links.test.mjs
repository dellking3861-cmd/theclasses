import { test } from "node:test";
import assert from "node:assert/strict";
import { freshDb, as, seedUsers } from "./setup.mjs";

const A = "00000000-0000-0000-0000-00000000000a";
const S = "00000000-0000-0000-0000-00000000000c";
const P = "00000000-0000-0000-0000-00000000000d";

async function setup() {
  const db = await freshDb();
  await seedUsers(db, [{ id: A, role: "admin" }, { id: S, role: "student" }, { id: P, role: "parent" }]);
  const sid = (await db.query("INSERT INTO students (user_id) VALUES ($1) RETURNING id", [S])).rows[0].id;
  const pid = (await db.query("INSERT INTO parents (user_id) VALUES ($1) RETURNING id", [P])).rows[0].id;
  const cid = (await db.query("INSERT INTO courses (title, slug, course_type) VALUES ('Maths', 'maths', 'board') RETURNING id")).rows[0].id;
  return { db, sid, pid, cid };
}

test("admin can enroll students, link parents and mark attendance", async () => {
  const { db, sid, pid, cid } = await setup();
  assert.equal((await as(db, A, "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING id", [sid, cid])).length, 1);
  assert.equal((await as(db, A, "INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2) RETURNING id", [pid, sid])).length, 1);
  assert.equal((await as(db, A, "INSERT INTO attendance (student_id, course_id, date, status) VALUES ($1, $2, '2026-11-07', 'present') RETURNING id", [sid, cid])).length, 1);
  // marking the same day again updates instead of duplicating
  await as(db, A, "INSERT INTO attendance (student_id, course_id, date, status) VALUES ($1, $2, '2026-11-07', 'late') ON CONFLICT (student_id, course_id, date) DO UPDATE SET status = EXCLUDED.status", [sid, cid]);
  assert.deepEqual((await as(db, A, "SELECT status FROM attendance")).map((r) => r.status), ["late"]);
});

test("students and parents can read their own links but not write", async () => {
  const { db, sid, pid, cid } = await setup();
  await as(db, A, "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)", [sid, cid]);
  await as(db, A, "INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2)", [pid, sid]);
  assert.equal((await as(db, S, "SELECT id FROM enrollments")).length, 1);
  assert.equal((await as(db, P, "SELECT id FROM parent_students")).length, 1);
  await assert.rejects(as(db, S, "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)", [sid, cid]));
  await assert.rejects(as(db, S, "INSERT INTO attendance (student_id, course_id, date) VALUES ($1, $2, '2026-11-08')", [sid, cid]));
  await assert.rejects(as(db, P, "INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2)", [pid, sid]));
});

test("teachers see the roster and mark attendance only for their own course", async () => {
  const { db, sid, cid } = await setup();
  const T = "00000000-0000-0000-0000-00000000000b", T2 = "00000000-0000-0000-0000-00000000000e", TX = "00000000-0000-0000-0000-00000000000f";
  await seedUsers(db, [{ id: T, role: "teacher" }, { id: T2, role: "teacher" }, { id: TX, role: "teacher", active: false }]);
  const tid = (await db.query("INSERT INTO teachers (user_id) VALUES ($1) RETURNING id", [T])).rows[0].id;
  const txid = (await db.query("INSERT INTO teachers (user_id) VALUES ($1) RETURNING id", [TX])).rows[0].id;
  await db.query("UPDATE courses SET teacher_id = $1 WHERE id = $2", [tid, cid]);
  const other = (await db.query("INSERT INTO courses (title, slug, course_type, teacher_id) VALUES ('Old', 'old', 'board', $1) RETURNING id", [txid])).rows[0].id;
  await as(db, A, "INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'active'), ($1, $3, 'active')", [sid, cid, other]);

  assert.equal((await as(db, T, "SELECT * FROM public.course_roster($1)", [cid])).length, 1); // own course: sees the student
  assert.equal((await as(db, T2, "SELECT * FROM public.course_roster($1)", [cid])).length, 0); // not their course
  assert.equal((await as(db, S, "SELECT * FROM public.course_roster($1)", [cid])).length, 0); // students get nothing
  assert.equal((await as(db, TX, "SELECT * FROM public.course_roster($1)", [other])).length, 0); // deactivated teacher
  assert.equal((await as(db, A, "SELECT * FROM public.course_roster($1)", [cid])).length, 1); // admin

  assert.equal((await as(db, T, "INSERT INTO attendance (student_id, course_id, date) VALUES ($1, $2, '2026-11-07') RETURNING id", [sid, cid])).length, 1);
  await assert.rejects(as(db, T2, "INSERT INTO attendance (student_id, course_id, date) VALUES ($1, $2, '2026-11-08')", [sid, cid]));
  await assert.rejects(as(db, TX, "INSERT INTO attendance (student_id, course_id, date) VALUES ($1, $2, '2026-11-08')", [sid, other]));
});

test("parents get only their own children's names", async () => {
  const { db, sid, pid } = await setup();
  const P2 = "00000000-0000-0000-0000-000000000012";
  await seedUsers(db, [{ id: P2, role: "parent" }]);
  await db.query("INSERT INTO parents (user_id) VALUES ($1)", [P2]);
  await as(db, A, "INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2)", [pid, sid]);
  assert.equal((await as(db, P, "SELECT * FROM public.my_children()")).length, 1);
  assert.equal((await as(db, P2, "SELECT * FROM public.my_children()")).length, 0);
  assert.equal((await as(db, S, "SELECT * FROM public.my_children()")).length, 0);
  await db.query("UPDATE users SET is_active = false WHERE id = $1", [P]);
  assert.equal((await as(db, P, "SELECT * FROM public.my_children()")).length, 0); // deactivated parent
});
