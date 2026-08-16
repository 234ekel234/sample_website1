import { describe, it, expect } from "vitest";
import { normalizeYear } from "@/lib/members";

describe("normalizeYear — PMA class / member since", () => {
  it("accepts a bare four-digit year", () => {
    expect(normalizeYear("1988")).toBe("1988");
    expect(normalizeYear("  2001  ")).toBe("2001");
  });

  it("pulls the year out of whatever staff typed around it", () => {
    expect(normalizeYear("Class 1988")).toBe("1988");
    expect(normalizeYear("PMA 1988")).toBe("1988");
  });

  it("expands a two-digit class, splitting on 2030", () => {
    expect(normalizeYear("'88")).toBe("1988");
    expect(normalizeYear("'05")).toBe("2005");
  });

  it("drops anything that is not plausibly a year", () => {
    // Better an omitted line than "n/a" printed onto a member's card.
    expect(normalizeYear("n/a")).toBe("");
    expect(normalizeYear("Bravo")).toBe("");
    expect(normalizeYear("")).toBe("");
  });
});
