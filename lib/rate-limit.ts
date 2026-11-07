// shortcut: per-instance memory (serverless instances don't share it), enough to stop
// casual spam and password guessing; move to a shared store (e.g. Upstash) if abused.

/** Returns a check that is true once `key` has been seen more than `max` times in `windowMs`. */
export function rateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}

/** The caller's IP as Vercel reports it. */
export const clientIp = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
