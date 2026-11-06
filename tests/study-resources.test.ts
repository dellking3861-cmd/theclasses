import { test } from "node:test";
import assert from "node:assert/strict";
import { matchesStudent, parseYouTubeId } from "../lib/study-resources.ts";

test("parseYouTubeId reads common links and rejects others", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ?si=abc",
    "youtube.com/watch?v=dQw4w9WgXcQ&t=30s",
    "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    "https://www.youtube.com/live/dQw4w9WgXcQ",
    "dQw4w9WgXcQ",
  ]) assert.equal(parseYouTubeId(url), "dQw4w9WgXcQ", url);
  for (const bad of ["https://evil.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/playlist?list=PLx", "hello"]) assert.equal(parseYouTubeId(bad), null, bad);
});

test("matchesStudent: untagged fits all, tags must match", () => {
  const p = { stage: "secondary", board: "bsek", group_code: "bio" };
  assert.equal(matchesStudent({ stage: null, board: null, group_code: null }, p), true);
  assert.equal(matchesStudent({ stage: "secondary", board: "bsek", group_code: null }, p), true);
  assert.equal(matchesStudent({ stage: "secondary", board: "fbise", group_code: null }, p), false);
  assert.equal(matchesStudent({ stage: "secondary", board: "bsek", group_code: "comp" }, p), false);
});
