import { describe, it, expect } from "vitest";
import { applyPrefill, EMAIL_TOKEN } from "@/lib/form-prefill";

// The property under all of these: WHATEVER STAFF PASTE, THE MEMBER GETS A
// WORKING LINK. Prefilling is a convenience; a link that opens is not.

const TEMPLATE = `https://docs.google.com/forms/d/e/ABC/viewform?usp=pp_url&entry.123=${EMAIL_TOKEN}`;

describe("applyPrefill", () => {
  it("puts the member's address into the template", () => {
    expect(applyPrefill(TEMPLATE, "juan@example.com")).toBe(
      "https://docs.google.com/forms/d/e/ABC/viewform?usp=pp_url&entry.123=juan%40example.com",
    );
  });

  it("leaves a plain form URL alone", () => {
    // What staff paste if they skip the prefill step or rebuild the form by
    // hand. It must still open — just without the address filled in.
    const plain = "https://docs.google.com/forms/d/e/ABC/viewform";
    expect(applyPrefill(plain, "juan@example.com")).toBe(plain);
  });

  it("escapes an address rather than breaking the query string", () => {
    // `+` is legal in an address and means something else in a URL; unescaped,
    // the form would receive "juan cruz@example.com" and the member would have
    // to notice and fix it.
    expect(applyPrefill(TEMPLATE, "juan+pmafi@example.com")).toContain(
      "juan%2Bpmafi%40example.com",
    );
    expect(applyPrefill(TEMPLATE, "juan+pmafi@example.com")).not.toContain("+p");
  });

  it("removes the token when there is no address to offer", () => {
    // The demo name path never learns an email. Substituting nothing leaves
    // the field blank; leaving the token in would ask the member to delete the
    // literal text "PMAFI_EMAIL_HERE" out of the form's email box.
    expect(applyPrefill(TEMPLATE, "")).toBe(
      "https://docs.google.com/forms/d/e/ABC/viewform?usp=pp_url&entry.123=",
    );
    expect(applyPrefill(TEMPLATE, "   ")).not.toContain(EMAIL_TOKEN);
  });

  it("returns nothing for an unset key, so the control can hide", () => {
    // Same contract as form.donation and form.correction: a blank key hides
    // the control rather than rendering a dead link.
    expect(applyPrefill("", "juan@example.com")).toBe("");
    expect(applyPrefill("   ", "juan@example.com")).toBe("");
  });

  it("tolerates a template staff pasted with surrounding whitespace", () => {
    // A URL copied out of a spreadsheet cell very often carries a trailing
    // space, and an href with one in front of it is not a link at all.
    const result = applyPrefill(`  ${TEMPLATE}  `, "juan@example.com");
    expect(result).toContain("juan%40example.com");
    expect(result).not.toMatch(/^\s|\s$/);
  });

  it("replaces the token wherever it appears, more than once if need be", () => {
    // A form that asks for the address twice (confirm it) would carry two.
    const twice = `https://x/viewform?a=${EMAIL_TOKEN}&b=${EMAIL_TOKEN}`;
    expect(applyPrefill(twice, "a@b.com")).toBe(
      "https://x/viewform?a=a%40b.com&b=a%40b.com",
    );
  });
});
