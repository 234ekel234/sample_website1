import { describe, it, expect, vi } from "vitest";
import { parseFundUpdates, groupByFund } from "@/lib/fund-updates";

/** Fund | Title | Message | Date | Image URL | Published */
const row = (
  fund: string,
  title: string,
  date: unknown = "2026-01-01",
  published = "Yes",
  image = "",
  message = "msg"
) => [fund, title, message, date, image, published];

describe("parseFundUpdates", () => {
  it("keeps only published rows", () => {
    const out = parseFundUpdates([
      row("Chair Fund", "Published", "2026-01-01", "Yes"),
      row("Chair Fund", "Hidden", "2026-01-02", "No"),
      row("Chair Fund", "Blank", "2026-01-03", ""),
    ]);
    expect(out.map((u) => u.title)).toEqual(["Published"]);
  });

  it("accepts Yes or True in any case", () => {
    const out = parseFundUpdates([
      row("F", "a", "2026-01-01", "yes"),
      row("F", "b", "2026-01-02", "TRUE"),
    ]);
    expect(out).toHaveLength(2);
  });

  it("skips rows with no fund or no title", () => {
    const out = parseFundUpdates([
      row("", "No fund"),
      row("F", ""),
      row("F", "Good"),
    ]);
    expect(out.map((u) => u.title)).toEqual(["Good"]);
  });

  it("sorts newest first", () => {
    const out = parseFundUpdates([
      row("F", "older", "2026-01-01"),
      row("F", "newest", "2026-06-01"),
      row("F", "middle", "2026-03-01"),
    ]);
    expect(out.map((u) => u.title)).toEqual(["newest", "middle", "older"]);
  });

  it("reads a Sheets date serial as a date, not a year", () => {
    // Same trap as the donations sheet: UNFORMATTED_VALUE returns a number, and
    // new Date("46096") parses as the year 46096.
    const out = parseFundUpdates([row("F", "a", 46096)]);
    expect(out[0].date).toBe("2026-03-15");
  });

  it("does not shift a written-out date across timezones", () => {
    const out = parseFundUpdates([row("F", "a", "March 15, 2026")]);
    expect(out[0].date).toBe("2026-03-15");
  });

  it("keeps an unparseable date as written and sorts it last", () => {
    const out = parseFundUpdates([
      row("F", "vague", "sometime last year"),
      row("F", "dated", "2026-01-01"),
    ]);
    expect(out.map((u) => u.title)).toEqual(["dated", "vague"]);
    expect(out[1].date).toBe("sometime last year");
  });

  it("converts a Google Drive share link into a loadable image URL", () => {
    const out = parseFundUpdates([
      row("F", "a", "2026-01-01", "Yes", "https://drive.google.com/file/d/ABC123/view?usp=sharing"),
    ]);
    expect(out[0].image).toBe("https://lh3.googleusercontent.com/d/ABC123");
  });

  it("drops an image URL next/image is not configured to load", () => {
    // next/image THROWS on a host missing from remotePatterns, and it throws
    // during render — so passing this through would 500 the whole page rather
    // than show a broken image. An update without its photo still reads.
    const [unsupported, notAUrl, none] = parseFundUpdates([
      row("F", "a", "2026-01-03", "Yes", "https://example.com/photo.jpg"),
      row("F", "b", "2026-01-02", "Yes", "photo.jpg"),
      row("F", "c", "2026-01-01", "Yes", ""),
    ]);
    expect(unsupported.image).toBe("");
    expect(notAUrl.image).toBe("");
    expect(none.image).toBe("");
  });

  it("keeps a URL already on the configured image host", () => {
    const out = parseFundUpdates([
      row("F", "a", "2026-01-01", "Yes", "https://lh3.googleusercontent.com/d/ABC123"),
    ]);
    expect(out[0].image).toBe("https://lh3.googleusercontent.com/d/ABC123");
  });

  it("says so when a PUBLISHED row cannot be rendered", () => {
    // Staff who tick Published and see nothing appear have no way to tell
    // whether the sheet is wired up at all. The row is skipped either way;
    // the point is that somebody is told why.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    parseFundUpdates([row("Endowment", "", "2026-01-01", "Yes")]);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0][0])).toMatch(/Title \(column B\)/);
    warn.mockRestore();
  });

  it("stays quiet about an unpublished incomplete row", () => {
    // That is a draft, not a mistake.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    parseFundUpdates([row("Endowment", "", "2026-01-01", "No")]);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("returns nothing for an empty sheet rather than inventing an update", () => {
    // Publishing a fabricated account of what a donation achieved would be far
    // worse than showing an empty state.
    expect(parseFundUpdates([])).toEqual([]);
  });
});

describe("groupByFund", () => {
  it("groups updates under their fund, preserving first-seen order", () => {
    const groups = groupByFund(
      parseFundUpdates([
        row("Endowment Fund", "e1", "2026-05-01"),
        row("Professorial Chair Fund", "c1", "2026-06-01"),
        row("Endowment Fund", "e2", "2026-04-01"),
      ])
    );
    expect(groups.map(([fund]) => fund)).toEqual([
      "Professorial Chair Fund",
      "Endowment Fund",
    ]);
    expect(groups[1][1].map((u) => u.title)).toEqual(["e1", "e2"]);
  });

  it("groups variant spellings of one fund together", () => {
    // Rows are canonicalised on read (src/lib/funds.ts), so a staff member
    // writing "Endowment" on one update and "Endowment Fund" on the next does
    // not split the fund into two headings a donor has to reconcile.
    const groups = groupByFund(
      parseFundUpdates([
        row("Endowment", "first", "2026-05-01"),
        row("  endowment fund ", "second", "2026-04-01"),
      ])
    );
    expect(groups).toHaveLength(1);
    expect(groups[0][0]).toBe("Endowment Fund");
    expect(groups[0][1].map((u) => u.title)).toEqual(["first", "second"]);
  });

  it("returns nothing when there are no updates", () => {
    expect(groupByFund([])).toEqual([]);
  });
});
