import { describe, it, expect } from "vitest";
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

  it("leaves a non-Drive image URL alone and tolerates none", () => {
    const [withUrl, without] = parseFundUpdates([
      row("F", "a", "2026-01-02", "Yes", "https://example.com/photo.jpg"),
      row("F", "b", "2026-01-01", "Yes", ""),
    ]);
    expect(withUrl.image).toBe("https://example.com/photo.jpg");
    expect(without.image).toBe("");
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
        row("Endowment", "e1", "2026-05-01"),
        row("Chair Fund", "c1", "2026-06-01"),
        row("Endowment", "e2", "2026-04-01"),
      ])
    );
    expect(groups.map(([fund]) => fund)).toEqual(["Chair Fund", "Endowment"]);
    expect(groups[1][1].map((u) => u.title)).toEqual(["e1", "e2"]);
  });

  it("returns nothing when there are no updates", () => {
    expect(groupByFund([])).toEqual([]);
  });
});
