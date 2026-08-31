import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseDonationPhotos } from "@/lib/donation-photos";

/** Image URL | Caption | Date | Published */
const row = (
  image: string,
  caption = "Alumni presenting a gift",
  date = "2026-01-01",
  published = "Yes"
) => [image, caption, date, published];

const DRIVE = "https://drive.google.com/file/d/ABC123/view?usp=sharing";

beforeEach(() => {
  // Restore first: spying on an already-spied method hands back the SAME mock,
  // so without this the call counts accumulate across tests and the warning
  // assertion below counts every earlier test's warnings too.
  vi.restoreAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("parseDonationPhotos", () => {
  it("publishes only rows marked Yes or True", () => {
    const out = parseDonationPhotos([
      row(DRIVE, "shown", "2026-01-01", "Yes"),
      row(DRIVE, "true too", "2026-01-02", "TRUE"),
      row(DRIVE, "hidden", "2026-01-03", "No"),
      row(DRIVE, "draft", "2026-01-04", ""),
    ]);
    expect(out.map((p) => p.caption)).toEqual(["true too", "shown"]);
  });

  it("rewrites a Drive share link to a host next/image can load", () => {
    const [photo] = parseDonationPhotos([row(DRIVE)]);
    expect(photo.image).toBe("https://lh3.googleusercontent.com/d/ABC123");
  });

  it("accepts a photograph shipped with the site", () => {
    const [photo] = parseDonationPhotos([row("/donation-handover.jpg")]);
    expect(photo.image).toBe("/donation-handover.jpg");
  });

  it("refuses a published row with no caption, because the caption is the alt text", () => {
    // A gallery of photographs with no alt text would cost the accessibility
    // score every public page currently holds, and tells a screen-reader user
    // nothing at all.
    const out = parseDonationPhotos([row(DRIVE, ""), row(DRIVE, "fine")]);
    expect(out.map((p) => p.caption)).toEqual(["fine"]);
  });

  it("refuses a link on a host that cannot be loaded", () => {
    // next/image throws during server render on an unlisted host, which would
    // take the whole page down rather than drop one photograph.
    const out = parseDonationPhotos([
      row("https://facebook.com/photo/123"),
      row(DRIVE, "kept"),
    ]);
    expect(out.map((p) => p.caption)).toEqual(["kept"]);
  });

  it("warns when a published row cannot render, and stays silent on a draft", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    parseDonationPhotos([
      row("", "no image", "2026-01-01", "Yes"),
      row("", "unpublished", "2026-01-02", "No"),
    ]);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("Row 2");
  });

  it("orders newest first and sinks undated photographs", () => {
    const out = parseDonationPhotos([
      row(DRIVE, "older", "2026-01-01"),
      row(DRIVE, "undated", ""),
      row(DRIVE, "newer", "2026-06-01"),
    ]);
    expect(out.map((p) => p.caption)).toEqual(["newer", "older", "undated"]);
  });

  it("reads a date typed as a date, not as its serial number", () => {
    // readRange asks Sheets for UNFORMATTED_VALUE, so a date cell arrives as a
    // number. This is the trap sheet-date.ts exists to hold.
    const [photo] = parseDonationPhotos([row(DRIVE, "serial", "46023")]);
    expect(photo.date).toBe("2026-01-01");
  });
});
