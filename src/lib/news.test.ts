import { describe, it, expect } from "vitest";
import { parseNews } from "@/lib/news";

/** A: Title  B: Excerpt  C: Category  D: Date  E: Link  F: Published  G: Image  H: Featured */
const row = (
  title: string,
  {
    excerpt = "e",
    category = "Events",
    date = "",
    link = "",
    published = "Yes",
    image = "",
    featured = "",
  }: Partial<Record<string, string>> = {}
) => [title, excerpt, category, date, link, published, image, featured];

describe("parseNews", () => {
  it("keeps only published rows", () => {
    const out = parseNews([
      row("Shown", { published: "Yes" }),
      row("Hidden", { published: "No" }),
      row("Blank", { published: "" }),
    ]);
    expect(out.map((n) => n.title)).toEqual(["Shown"]);
  });

  it("skips a row with no title or no excerpt", () => {
    const out = parseNews([
      row("", { excerpt: "has excerpt" }),
      row("Has title", { excerpt: "" }),
      row("Good"),
    ]);
    expect(out.map((n) => n.title)).toEqual(["Good"]);
  });

  describe("the Link column", () => {
    it("refuses a javascript: URL rather than rendering it as an href", () => {
      // The News tab is in the SAME spreadsheet as the content tab, so it
      // carries the same risk safe-url.ts was written for: whoever can edit
      // the sheet could otherwise put script on the home page. This column
      // went unsanitised for as long as every Link cell was empty.
      const out = parseNews([row("Poisoned", { link: "javascript:alert(1)" })]);
      expect(out[0].link).toBe("");
    });

    it("refuses other non-http schemes", () => {
      for (const link of ["data:text/html,<script>", "vbscript:msgbox", "file:///etc/passwd"]) {
        expect(parseNews([row("x", { link })])[0].link).toBe("");
      }
    });

    it("keeps an ordinary https link", () => {
      const out = parseNews([row("x", { link: "https://example.org/story" })]);
      expect(out[0].link).toBe("https://example.org/story");
    });

    it("keeps a site-relative path, which is how the notice is linked", () => {
      const out = parseNews([row("x", { link: "/membership/annual-meeting" })]);
      expect(out[0].link).toBe("/membership/annual-meeting");
    });

    it("refuses a protocol-relative URL, which goes off-origin", () => {
      expect(parseNews([row("x", { link: "//evil.example/x" })])[0].link).toBe("");
    });
  });

  describe("the Featured column", () => {
    it("accepts Yes, yes and TRUE", () => {
      for (const featured of ["Yes", "yes", "TRUE", "true"]) {
        expect(parseNews([row("x", { featured })])[0].featured).toBe(true);
      }
    });

    it("is false when blank, absent, or anything else", () => {
      expect(parseNews([row("x", { featured: "" })])[0].featured).toBe(false);
      expect(parseNews([row("x", { featured: "No" })])[0].featured).toBe(false);
      // A tab that predates the column: the row is simply shorter.
      expect(parseNews([["t", "e", "Events", "", "", "Yes"]])[0].featured).toBe(
        false
      );
    });
  });

  it("formats a date serial rather than printing the number", () => {
    // 46451 is 5 March 2027 — the meeting notice's own cell.
    expect(parseNews([row("x", { date: "46451" })])[0].date).toBe(
      "March 5, 2027"
    );
  });

  it("passes free text in the date through untouched", () => {
    expect(parseNews([row("x", { date: "Upcoming" })])[0].date).toBe("Upcoming");
  });
});
