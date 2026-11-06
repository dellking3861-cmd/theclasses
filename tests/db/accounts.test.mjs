import { test } from "node:test";
import assert from "node:assert/strict";
import { freshDb, as, seedUsers } from "./setup.mjs";

const A = "00000000-0000-0000-0000-00000000000a"; // active admin
const OLD = "00000000-0000-0000-0000-00000000000f"; // deactivated admin
const S = "00000000-0000-0000-0000-00000000000c";
const P = "00000000-0000-0000-0000-00000000000d";

test("self sign-up creates a profile but can never become admin", async () => {
  const db = await freshDb();
  await db.query(`INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES ($1, 'p@x', '{"role":"parent"}'), ($2, 'e@x', '{"role":"admin"}')`, [P, S]);
  const rows = (await db.query("SELECT id, role FROM users ORDER BY id")).rows;
  assert.deepEqual(rows.map((r) => r.role), ["student", "parent"]);
  assert.equal((await db.query("SELECT count(*)::int c FROM parents WHERE user_id = $1", [P])).rows[0].c, 1);
});

test("admin-created accounts are skipped by the sign-up trigger (no duplicate-key failure)", async () => {
  const db = await freshDb();
  // Supabase Auth inserts the row first and writes app_metadata afterwards
  await db.query(`INSERT INTO auth.users (id, email, raw_user_meta_data, raw_app_meta_data) VALUES ($1, 's@x', '{"role":"student","provisioned_by":"admin"}', '{}')`, [S]);
  assert.equal((await db.query("SELECT count(*)::int c FROM users")).rows[0].c, 0);
  await db.query("INSERT INTO users (id, email, full_name, role) VALUES ($1, 's@x', 'S', 'student')", [S]);
});

test("requireAdmin (is_admin) refuses deactivated admins and non-admins", async () => {
  const db = await freshDb();
  await seedUsers(db, [{ id: A, role: "admin" }, { id: OLD, role: "admin", active: false }, { id: S, role: "student" }]);
  const isAdmin = async (id) => (await as(db, id, "SELECT public.is_admin() v"))[0].v;
  assert.equal(await isAdmin(A), true);
  assert.equal(await isAdmin(OLD), false);
  assert.equal(await isAdmin(S), false);
});

test("editing a student saves role fields and the phone on users", async () => {
  const db = await freshDb();
  await seedUsers(db, [{ id: A, role: "admin" }, { id: S, role: "student" }]);
  await db.query("INSERT INTO students (user_id) VALUES ($1)", [S]);
  await assert.rejects(as(db, A, "UPDATE students SET phone = '0300' WHERE user_id = $1", [S]), /phone/);
  assert.equal((await as(db, A, "UPDATE students SET board = 'bsek', stage = 'secondary' WHERE user_id = $1 RETURNING id", [S])).length, 1);
  assert.equal((await as(db, A, "UPDATE users SET phone = '0300 1234567' WHERE id = $1 RETURNING phone", [S]))[0].phone, "0300 1234567");
});

test("deleting a login removes the profile, role rows and parent links", async () => {
  const db = await freshDb();
  await seedUsers(db, [{ id: S, role: "student" }, { id: P, role: "parent" }]);
  const sid = (await db.query("INSERT INTO students (user_id) VALUES ($1) RETURNING id", [S])).rows[0].id;
  const pid = (await db.query("INSERT INTO parents (user_id) VALUES ($1) RETURNING id", [P])).rows[0].id;
  await db.query("INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2)", [pid, sid]);
  await db.query("DELETE FROM auth.users WHERE id IN ($1, $2)", [S, P]);
  const left = (await db.query("SELECT (SELECT count(*) FROM users) + (SELECT count(*) FROM students) + (SELECT count(*) FROM parents) + (SELECT count(*) FROM parent_students) n")).rows[0].n;
  assert.equal(Number(left), 0);
});
