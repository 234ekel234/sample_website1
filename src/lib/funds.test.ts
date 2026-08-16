import { describe, it, expect } from "vitest";
import { FUNDS, canonicalFund, findFund } from "@/lib/funds";

// The fund name is typed by hand into two different spreadsheets, and the site
// joins a donor's gift to their fund's updates by matching those strings. These
// tests are about that join surviving ordinary human variation — without the
// list quietly inventing funds PMAFI does not offer.

describe("the canonical list", () => {
  it("is exactly what the brochure offers, plus the undesignated bucket", () => {
    expect(FUNDS.map((f) => f.name)).toEqual([
      "Professorial Chair Fund",
      "Endowment Fund",
      "General Fund",
    ]);
  });

  it("does not offer Facilities & Modernization as a fund", () => {
    // It is a programme area on /programs and the home page. The brochure never
    // names it as something a donor may designate to, so listing it here would
    // advertise an offer the Foundation has not made.
    expect(canonicalFund("Facilities & Modernization")).toBe(
      "Facilities & Modernization"
    );
    expect(findFund("Facilities & Modernization")).toBeUndefined();
  });

  it("carries the brochure minimums", () => {
    expect(findFund("Professorial Chair Fund")?.minimum).toBe("₱250,000");
    expect(findFund("Endowment Fund")?.minimum).toBe("₱100,000");
    expect(findFund("General Fund")?.minimum).toBe("");
  });
});

describe("canonicalFund", () => {
  it("passes a correctly typed name straight through", () => {
    for (const f of FUNDS) expect(canonicalFund(f.name)).toBe(f.name);
  });

  it("forgives case and spacing", () => {
    expect(canonicalFund("  ENDOWMENT   FUND ")).toBe("Endowment Fund");
    expect(canonicalFund("professorial chair fund")).toBe("Professorial Chair Fund");
  });

  it("joins the donate page's wording to the fund it lands in", () => {
    // The card says "General Donation"; the gift is filed as "General Fund".
    // Without this the donor's own updates would never be found.
    expect(canonicalFund("General Donation")).toBe("General Fund");
    expect(canonicalFund("unrestricted")).toBe("General Fund");
  });

  it("accepts the short forms staff actually write", () => {
    expect(canonicalFund("Endowment")).toBe("Endowment Fund");
    expect(canonicalFund("Professorial Chair")).toBe("Professorial Chair Fund");
  });

  it("keeps an unrecognised fund rather than dropping it", () => {
    // PMAFI may open a fund this list has not caught up with. Blanking it would
    // erase a real designation from a donor's record; passing it through means
    // both sheets still agree with each other.
    expect(canonicalFund("  Library Modernization Fund ")).toBe(
      "Library Modernization Fund"
    );
  });

  it("treats a blank designation as blank", () => {
    expect(canonicalFund("")).toBe("");
    expect(canonicalFund("   ")).toBe("");
  });
});
