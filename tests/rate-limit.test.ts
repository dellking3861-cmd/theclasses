import { test } from "node:test";
import assert from "node:assert/strict";
import { rateLimiter } from "../lib/rate-limit.ts";

test("rateLimiter allows max hits per window, then blocks until the window passes", () => {
  const limited = rateLimiter(3, 1000);
  assert.deepEqual([0, 10, 20, 30].map((t) => limited("ip", t)), [false, false, false, true]);
  assert.equal(limited("other", 30), false); // keys are separate
  assert.equal(limited("ip", 1025), false); // first hits have expired
});
