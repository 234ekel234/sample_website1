import { describe, it, expect, vi, afterEach } from "vitest";
import { toDisplayImageUrl } from "@/lib/sheet-image";

// toDisplayImageUrl decides what a staff member may point an <Image> at. It is
// the guard that stops one pasted URL taking a page down: next/image throws on
// a host missing from remotePatterns, and that throw happens while rendering a
// Server Component, so a single bad cell 500s the whole page rather than
// showing a broken image.

afterEach(() => vi.restoreAllMocks());

describe("Google Drive links", () => {
  it("converts a share link to a loadable one", () => {
    expect(
      toDisplayImageUrl("https://drive.google.com/file/d/ABC123/view?usp=sharing")
    ).toBe("https://lh3.googleusercontent.com/d/ABC123");
  });

  it("converts the open?id= form staff also paste", () => {
    expect(toDisplayImageUrl("https://drive.google.com/open?id=XYZ789")).toBe(
      "https://lh3.googleusercontent.com/d/XYZ789"
    );
  });

  it("keeps a URL already on the allowed host", () => {
    const u = "https://lh3.googleusercontent.com/d/ABC123";
    expect(toDisplayImageUrl(u)).toBe(u);
  });
});

describe("same-origin paths", () => {
  it("allows a photograph shipped with the site", () => {
    // So a fund update can use a file in public/ instead of a Drive link.
    expect(toDisplayImageUrl("/fund-chairs.jpg")).toBe("/fund-chairs.jpg");
  });

  it("allows a nested path", () => {
    expect(toDisplayImageUrl("/photos/board/meeting.jpg")).toBe(
      "/photos/board/meeting.jpg"
    );
  });

  it("rejects a protocol-relative URL", () => {
    // "//evil.com/x.jpg" starts with a slash but addresses another host.
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(toDisplayImageUrl("//evil.com/x.jpg")).toBe("");
  });

  it("rejects a backslash authority, which browsers read as a slash", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(toDisplayImageUrl("/\\evil.com/x.jpg")).toBe("");
  });
});

describe("everything else is dropped, never passed through", () => {
  it("drops another host", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(toDisplayImageUrl("https://i.imgur.com/abc.jpg")).toBe("");
    expect(warn).toHaveBeenCalled();
  });

  it("drops a Facebook link, the one staff reach for most", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(toDisplayImageUrl("https://www.facebook.com/photo/?fbid=1")).toBe("");
  });

  it("drops text that is not a URL at all", () => {
    expect(toDisplayImageUrl("photo to follow")).toBe("");
  });

  it("treats a blank cell as no image", () => {
    expect(toDisplayImageUrl("")).toBe("");
    expect(toDisplayImageUrl("   ")).toBe("");
  });
});
