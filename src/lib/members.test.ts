import { describe, it, expect } from "vitest";
import fs from "node:fs";

// normalizeYear is module-private; lift it out rather than exporting a helper
// only tests would use.
const src = fs.readFileSync("src/lib/members.ts", "utf8");
const body = src.match(/function normalizeYear[\s\S]*?\n}/)![0];
const normalizeYear: (v: string) => string = eval(
  "(" + body.replace(/^function normalizeYear/, "function").replace(/: string/g, "") + ")"
);

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
