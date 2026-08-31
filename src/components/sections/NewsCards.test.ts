import { describe, it, expect } from "vitest";
import { gridFor } from "@/components/sections/NewsCards";

// The number of published news rows is whatever PMAFI happens to have that
// week, and the section is now the third thing on the home page — so every
// count has to look deliberate, not like something failed to load.
describe("gridFor", () => {
  it("gives a lone item one centred column, not a third of the page", () => {
    // The bug this exists to prevent: md:grid-cols-3 with one item leaves two
    // thirds of the row empty beside it.
    expect(gridFor(1)).toContain("grid-cols-1");
    expect(gridFor(1)).not.toContain("md:grid-cols-3");
    expect(gridFor(1)).toContain("mx-auto");
  });

  it("pairs two items rather than leaving a gap", () => {
    expect(gridFor(2)).toContain("sm:grid-cols-2");
    expect(gridFor(2)).not.toContain("md:grid-cols-3");
  });

  it("uses the full three columns from three items up", () => {
    expect(gridFor(3)).toContain("md:grid-cols-3");
    expect(gridFor(4)).toContain("md:grid-cols-3");
  });

  it("caps the width only below three, so a full row still spans the page", () => {
    expect(gridFor(1)).toMatch(/max-w-/);
    expect(gridFor(2)).toMatch(/max-w-/);
    expect(gridFor(3)).not.toMatch(/max-w-/);
  });

  it("never returns an empty class for an empty feed", () => {
    // getNews falls back to sample items rather than returning none, so this
    // should be unreachable — but a bare `grid` with no columns would collapse
    // the section rather than fail visibly, so it is pinned.
    expect(gridFor(0).trim()).not.toBe("");
  });
});
