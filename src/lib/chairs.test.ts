import { describe, it, expect } from "vitest";
import { parseChairs, FALLBACK_CHAIRS } from "@/lib/chairs";

describe("parseChairs", () => {
  it("reads one chair per row from column A", () => {
    expect(
      parseChairs([["Union Bank Chair in English"], ["PMA Class 1942 Chair"]])
    ).toEqual(["Union Bank Chair in English", "PMA Class 1942 Chair"]);
  });

  it("skips blank rows rather than rendering empty bullets", () => {
    // Staff clear a cell far more often than they delete the row.
    expect(parseChairs([["A Chair"], [""], ["   "], [], ["B Chair"]])).toEqual([
      "A Chair",
      "B Chair",
    ]);
  });

  it("trims the stray spaces a spreadsheet paste leaves behind", () => {
    expect(parseChairs([["  Gen Arturo T Enrile Chair  "]])).toEqual([
      "Gen Arturo T Enrile Chair",
    ]);
  });

  it("ignores anything typed into a second column", () => {
    // The sheet is deliberately one column: a chair's name is the whole of
    // what may be published. If somebody adds an amount alongside it, that
    // amount must not reach the page.
    expect(parseChairs([["A Chair", "250,000"]])).toEqual(["A Chair"]);
  });

  it("keeps a name exactly as PMAFI spells it", () => {
    const odd = "PBeg Dionardo B Carlos Chair";
    expect(parseChairs([[odd]])).toEqual([odd]);
  });
});

describe("FALLBACK_CHAIRS", () => {
  it("holds the roll as published at 31 December 2025", () => {
    expect(FALLBACK_CHAIRS).toHaveLength(161);
  });

  it("carries no duplicates, so the page cannot repeat a benefactor", () => {
    // 161 rather than the report's stated 160 is a known discrepancy: it lists
    // Dionardo B Carlos twice, spelled two ways. Two spellings are not a
    // duplicate to a Set, so this guards the ordinary case, not that one.
    expect(new Set(FALLBACK_CHAIRS).size).toBe(FALLBACK_CHAIRS.length);
  });

  it("names no amounts", () => {
    // The annual report prints sums beside several of these names. None of
    // that may travel with the name onto a public page.
    for (const chair of FALLBACK_CHAIRS) {
      expect(chair).not.toMatch(/[₱$]|\d{3},\d{3}/);
    }
  });
});
