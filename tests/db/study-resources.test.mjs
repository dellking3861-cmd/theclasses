import { test } from "node:test";
import assert from "node:assert/strict";
import { freshDb, as, seedUsers } from "./setup.mjs";

const A = "00000000-0000-0000-0000-00000000000a";
const T = "00000000-0000-0000-0000-00000000000b";
const T2 = "00000000-0000-0000-0000-00000000000e";
const S = "00000000-0000-0000-0000-00000000000c";
const X = "00000000-0000-0000-0000-00000000000d"; // deactivated student

async function setup() {
  const db = await freshDb();
  await seedUsers(db, [
    { id: A, role: "admin" }, { id: T, role: "teacher" }, { id: T2, role: "teacher" },
    { id: S, role: "student" }, { id: X, role: "student", active: false },
  ]);
  await as(db, T, `INSERT INTO study_resources (kind, title, stage, board, subject, youtube_id) VALUES ('lecture', 'L', 'secondary', 'bsek', 'mathematics', 'dQw4w9WgXcQ')`);
  await as(db, T, `INSERT INTO study_resources (kind, title, stage, board, subject, file_path, visibility) VALUES ('past_paper', 'P', 'secondary', 'bsek', 'mathematics', 't/p.pdf', 'public')`);
  await as(db, A, `INSERT INTO study_resources (kind, title, file_path, is_published) VALUES ('notes', 'Draft', 'a/n.pdf', false)`);
  await as(db, T, `INSERT INTO storage.objects (bucket_id, name, owner_id) VALUES ('study-resources', 't/p.pdf', $1), ('study-resources', 'a/n.pdf', $2)`, [T, A]);
  return db;
}
const kinds = async (db, who) => (await as(db, who, "SELECT kind FROM study_resources ORDER BY kind")).map((r) => r.kind);
const files = async (db, who) => (await as(db, who, "SELECT name FROM storage.objects ORDER BY name")).map((r) => r.name);

test("who can see which materials and files", async () => {
  const db = await setup();
  assert.deepEqual(await kinds(db, T), ["lecture", "notes", "past_paper"]); // staff see drafts
  assert.deepEqual(await kinds(db, S), ["lecture", "past_paper"]); // students: published only
  assert.deepEqual(await kinds(db, X), ["past_paper"]); // deactivated: public only
  assert.deepEqual(await kinds(db, null), ["past_paper"]); // visitors: public only
  assert.deepEqual(await files(db, S), ["t/p.pdf"]); // the draft's file stays hidden
  assert.deepEqual(await files(db, null), ["t/p.pdf"]);
});

test("only staff add; teachers change only their own; admins change all", async () => {
  const db = await setup();
  await assert.rejects(as(db, S, `INSERT INTO study_resources (kind, title, file_path) VALUES ('notes', 'x', 's/x.pdf')`));
  await assert.rejects(as(db, S, `INSERT INTO storage.objects (bucket_id, name, owner_id) VALUES ('study-resources', 's.pdf', $1)`, [S]));
  await assert.rejects(as(db, T, `INSERT INTO study_resources (kind, title, youtube_id, uploaded_by) VALUES ('lecture', 't', 'dQw4w9WgXcQ', $1)`, [A]));
  assert.equal((await as(db, T2, "UPDATE study_resources SET title = 'x' WHERE uploaded_by = $1 RETURNING id", [T])).length, 0);
  assert.equal((await as(db, T2, "DELETE FROM storage.objects WHERE name = 't/p.pdf' RETURNING name")).length, 0);
  assert.equal((await as(db, A, "UPDATE study_resources SET title = 'ok' WHERE uploaded_by = $1 RETURNING id", [T])).length, 2);
});

test("bad input is rejected by the database", async () => {
  const db = await setup();
  for (const sql of [
    `INSERT INTO study_resources (kind, title, file_path) VALUES ('lecture', 't', 'x.pdf')`, // lecture needs a video
    `INSERT INTO study_resources (kind, title, youtube_id) VALUES ('lecture', 't', 'not valid!!')`,
    `INSERT INTO study_resources (kind, title, file_path) VALUES ('notes', 't', '../evil.pdf')`,
    `INSERT INTO study_resources (kind, title, file_path) VALUES ('notes', 't', 'x.exe')`,
    `INSERT INTO study_resources (kind, title, file_path, board, stage) VALUES ('notes', 't', 'y.pdf', 'nope', 'secondary')`,
  ]) await assert.rejects(as(db, T, sql), sql);
});
