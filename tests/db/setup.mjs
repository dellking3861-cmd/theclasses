// Fresh in-memory Postgres (PGlite) with a Supabase-like shim and every migration applied in order.
import { PGlite } from "@electric-sql/pglite";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../../supabase/migrations/", import.meta.url);

export async function freshDb() {
  const db = new PGlite({ extensions: { uuid_ossp, pgcrypto } });
  await db.exec(readFileSync(new URL("./supabase-shim.sql", import.meta.url), "utf8"));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    try {
      await db.exec(readFileSync(new URL(f, dir), "utf8"));
    } catch (e) {
      throw new Error(`${f}: ${e.message}`);
    }
  }
  return db;
}

/** Runs sql as a signed-in user (sub = user id) or as a visitor (sub = null). */
export async function as(db, sub, sql, params = []) {
  await db.query(`SELECT set_config('request.jwt.claim.sub', $1, false)`, [sub ?? ""]);
  await db.exec(`SET ROLE ${sub ? "authenticated" : "anon"}`);
  try {
    return (await db.query(sql, params)).rows;
  } finally {
    await db.exec("RESET ROLE");
  }
}

/** Inserts people directly, skipping triggers (as an admin import would). */
export async function seedUsers(db, users) {
  await db.exec("SET session_replication_role = replica");
  for (const u of users) {
    await db.query("INSERT INTO auth.users (id, email) VALUES ($1, $2)", [u.id, `${u.id}@x`]);
    await db.query("INSERT INTO users (id, email, full_name, role, is_active) VALUES ($1, $2, 'x', $3, $4)", [u.id, `${u.id}@x`, u.role, u.active ?? true]);
  }
  await db.exec("SET session_replication_role = origin");
}
