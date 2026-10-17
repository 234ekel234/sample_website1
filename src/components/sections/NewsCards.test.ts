import { describe, it, expect } from "vitest";
import { gridFor, splitFeatured } from "@/components/sections/NewsCards";
import type { NewsItem } from "@/lib/news";

const item = (title: string, date = "", featured = false): NewsItem => ({
  title,
  excerpt: "x",
  category: "Events",
  date,
  link: "",
  image: "",
  featured,
});

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

// The lead announcement runs full width above the cards. Which row leads is
// the sheet's decision, and these pin that it stays the sheet's decision.
describe("splitFeatured", () => {
  it("leads with the row marked Featured, wherever it sits in the sheet", () => {
    // THE WHOLE POINT. A new row is appended at the BOTTOM of a spreadsheet —
    // which is where the 5 March 2027 meeting notice actually went, leaving a
    // 2024 board visit leading the home page. Position must not decide this.
    const items = [
      item("Board Visit", "2024-11-15"),
      item("Teaching Excellence", ""),
      item("Alumni Gift", "2026-07-28"),
      item("Annual Membership Meeting", "2027-03-05", true),
    ];
    const { featured, rest } = splitFeatured(items);

    expect(featured?.title).toBe("Annual Membership Meeting");
    // And the cards keep their sheet order with the hole closed up.
    expect(rest.map((r) => r.title)).toEqual([
      "Board Visit",
      "Teaching Excellence",
      "Alumni Gift",
    ]);
  });

  it("falls back to the top row when nothing is marked", () => {
    // A tab with the Featured column blank — or without the column at all,
    // which is every tab until someone adds it — must render as it always did.
    const items = [item("First"), item("Second"), item("Third")];
    const { featured, rest } = splitFeatured(items);

    expect(featured?.title).toBe("First");
    expect(rest.map((r) => r.title)).toEqual(["Second", "Third"]);
  });

  it("never promotes two rows, nor none, when staff mark several", () => {
    const items = [item("a"), item("b", "", true), item("c", "", true)];
    const { featured, rest } = splitFeatured(items);

    expect(featured?.title).toBe("b");
    expect(rest.map((r) => r.title)).toEqual(["a", "c"]);
  });

  it("does not sort by date in either direction", () => {
    // Guards against someone "improving" this into a sort later: the newest
    // row is last and the oldest first, and neither is what leads.
    const items = [
      item("Oldest", "2020-01-01"),
      item("Chosen", "2023-01-01", true),
      item("Newest", "2030-01-01"),
    ];

    expect(splitFeatured(items).featured?.title).toBe("Chosen");
  });

  it("does not repeat the featured item among the cards below it", () => {
    const items = [item("One"), item("Two")];
    const { featured, rest } = splitFeatured(items);

    expect(rest).toHaveLength(1);
    expect(rest).not.toContainEqual(featured);
  });

  it("features a lone item rather than leaving one small card", () => {
    const { featured, rest } = splitFeatured([item("Only")]);

    expect(featured?.title).toBe("Only");
    expect(rest).toEqual([]);
  });

  it("leaves a clean row of three when four rows are published", () => {
    // The count gridFor receives is one SHORT of the published rows now. Four
    // rows used to wrap as three plus a lone orphan on a second line — the
    // same "something failed to load" look gridFor exists to prevent, arriving
    // at a different count. One featured plus three is a full row.
    const items = [item("a"), item("b"), item("c"), item("d")];
    const { rest } = splitFeatured(items);

    expect(rest).toHaveLength(3);
    expect(gridFor(rest.length)).toContain("md:grid-cols-3");
    expect(gridFor(rest.length)).not.toMatch(/max-w-/);
  });

  it("returns no featured item for an empty feed instead of reading items[0]", () => {
    // Unreachable while getNews falls back to samples, but the component must
    // not depend on that to avoid rendering a card built from undefined.
    expect(splitFeatured([])).toEqual({ featured: null, rest: [] });
  });
});
