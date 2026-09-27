// A small in-process rate limiter.
//
// SCOPE, STATED HONESTLY: this lives in module memory. On serverless it is
// per-instance and resets on a cold start, so a determined attacker with
// patience or luck can exceed the nominal limit. It is not a security boundary.
//
// What it does stop is the realistic abuse: someone submitting the giving-
// summary form over and over to mail-bomb a donor's inbox, or hammering the
// lookup to burn the monthly email quota. For that — an ordinary browser, one
// origin, repeated submits — it works.
//
// A proper limiter needs shared state (Redis, Vercel KV). That is a new vendor
// and a running cost, which Phase 2 is explicitly sold without. If the site ever
// gets real abuse, this is the seam to replace.

interface Bucket {
  /** Timestamps of attempts still inside the window. */
  hits: number[];
}

const buckets = new Map<string, Bucket>();

/** Drop buckets nothing has touched for a while, so the map cannot grow forever. */
const SWEEP_AFTER_MS = 60 * 60 * 1000;
let lastSweep = Date.now();

function sweep(now: number, windowMs: number) {
  if (now - lastSweep < SWEEP_AFTER_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    const newest = bucket.hits[bucket.hits.length - 1] ?? 0;
    if (now - newest > Math.max(windowMs, SWEEP_AFTER_MS)) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the next attempt would be allowed. 0 when ok. */
  retryAfter: number;
}

/**
 * Allow `limit` attempts per `windowMs` for a key.
 *
 * The key should identify the thing being protected, not the visitor — for the
 * giving summary that is the *recipient address*, because the harm is to the
 * person receiving the mail, not the person submitting the form.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now, windowMs);

  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    buckets.set(key, bucket);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - oldest)) / 1000) };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true, retryAfter: 0 };
}

/** Test helper — clears all buckets. */
export function __resetRateLimits() {
  buckets.clear();
  lastSweep = Date.now();
}
