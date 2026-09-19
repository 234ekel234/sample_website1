import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { rateLimit, __resetRateLimits } from "@/lib/rate-limit";

beforeEach(() => {
  __resetRateLimits();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

const WINDOW = 60_000;

describe("rateLimit", () => {
  it("allows attempts up to the limit", () => {
    for (let i = 0; i < 3; i++) {
      expect(rateLimit("k", 3, WINDOW).ok).toBe(true);
    }
  });

  it("blocks the attempt after the limit", () => {
    for (let i = 0; i < 3; i++) rateLimit("k", 3, WINDOW);
    expect(rateLimit("k", 3, WINDOW).ok).toBe(false);
  });

  it("reports how long until the next attempt is allowed", () => {
    for (let i = 0; i < 3; i++) rateLimit("k", 3, WINDOW);
    vi.advanceTimersByTime(20_000);
    const { ok, retryAfter } = rateLimit("k", 3, WINDOW);
    expect(ok).toBe(false);
    expect(retryAfter).toBe(40); // 60s window, 20s elapsed
  });

  it("lets attempts through again once the window rolls past", () => {
    for (let i = 0; i < 3; i++) rateLimit("k", 3, WINDOW);
    expect(rateLimit("k", 3, WINDOW).ok).toBe(false);
    vi.advanceTimersByTime(WINDOW + 1);
    expect(rateLimit("k", 3, WINDOW).ok).toBe(true);
  });

  it("slides rather than resetting in fixed blocks", () => {
    // Space the attempts so they expire one at a time. Bunched at the same
    // instant they would all expire together, which tests nothing about
    // sliding.
    rateLimit("k", 3, WINDOW); // t=0
    vi.advanceTimersByTime(10_000);
    rateLimit("k", 3, WINDOW); // t=10s
    vi.advanceTimersByTime(10_000);
    rateLimit("k", 3, WINDOW); // t=20s

    vi.advanceTimersByTime(5_000); // t=25s — all three still inside the window
    expect(rateLimit("k", 3, WINDOW).ok).toBe(false);

    // t=61s: only the t=0 attempt has aged out, so exactly one slot frees.
    vi.advanceTimersByTime(36_000);
    expect(rateLimit("k", 3, WINDOW).ok).toBe(true);
    expect(rateLimit("k", 3, WINDOW).ok).toBe(false);
  });

  it("keys are independent, so one address cannot lock out another", () => {
    for (let i = 0; i < 3; i++) rateLimit("victim@example.com", 3, WINDOW);
    expect(rateLimit("victim@example.com", 3, WINDOW).ok).toBe(false);
    expect(rateLimit("someone-else@example.com", 3, WINDOW).ok).toBe(true);
  });

  it("treats a limit of zero as blocking everything", () => {
    expect(rateLimit("k", 0, WINDOW).ok).toBe(false);
  });
});

describe("the demo bypass", () => {
  afterEach(() => {
    delete process.env.RATE_LIMIT_DISABLED;
    __resetRateLimits();
  });

  it("lets every caller through when RATE_LIMIT_DISABLED=1", () => {
    process.env.RATE_LIMIT_DISABLED = "1";
    for (let i = 0; i < 50; i++) {
      expect(rateLimit("demo", 3, 60_000).ok).toBe(true);
    }
  });

  it("is off unless the value is exactly 1, so a stray 'false' cannot open it", () => {
    process.env.RATE_LIMIT_DISABLED = "false";
    expect(rateLimit("strict", 1, 60_000).ok).toBe(true);
    expect(rateLimit("strict", 1, 60_000).ok).toBe(false);
  });

  it("limits again as soon as the variable is unset", () => {
    process.env.RATE_LIMIT_DISABLED = "1";
    expect(rateLimit("back", 1, 60_000).ok).toBe(true);
    delete process.env.RATE_LIMIT_DISABLED;
    expect(rateLimit("back", 1, 60_000).ok).toBe(true);
    expect(rateLimit("back", 1, 60_000).ok).toBe(false);
  });
});
