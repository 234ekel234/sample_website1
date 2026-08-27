import { describe, it, expect, vi, afterEach } from "vitest";

// getFaqs merges the staff-editable FAQ tab over the built-in answer set.
//
// It used to REPLACE it: any rows at all in the sheet discarded FALLBACK
// wholesale. A tab holding fifteen answers therefore hid a curated thirty, and
// corrections made in code could never reach a visitor while a stale sheet row
// for the same question existed. The pay-first flow was fixed in FALLBACK and
// went on being described as apply-first on the live site.

async function load(rows: unknown[][] | Error) {
  vi.resetModules();
  const readRange = vi.fn();
  if (rows instanceof Error) readRange.mockRejectedValue(rows);
  else readRange.mockResolvedValue(rows);
  vi.doMock("@/lib/sheets", () => ({ readRange }));
  process.env.CONTENT_SHEET_ID = "test-sheet";
  return import("@/lib/faq");
}

afterEach(() => vi.doUnmock("@/lib/sheets"));

const row = (q: string, a: string) => [q, a, "", "", "", "", ""];

describe("getFaqs", () => {
  it("keeps built-in answers the sheet does not mention", async () => {
    // The whole failure: a short sheet must not delete everything else.
    const { getFaqs } = await load([row("What is PMAFI?", "Sheet version.")]);
    const faqs = await getFaqs();
    expect(faqs.length).toBeGreaterThan(1);
    expect(faqs.some((f) => /digital .*ID|ID card/i.test(f.question))).toBe(true);
  });

  it("lets the sheet override an answer question by question", async () => {
    // Staff control of any answer they choose to write is the point of the tab.
    const { getFaqs } = await load([row("What is PMAFI?", "Sheet version.")]);
    const faqs = await getFaqs();
    const hit = faqs.find((f) => f.question === "What is PMAFI?");
    expect(hit?.answer).toBe("Sheet version.");
  });

  it("does not leave two copies of an overridden question", async () => {
    const { getFaqs } = await load([row("What is PMAFI?", "Sheet version.")]);
    const faqs = await getFaqs();
    const matches = faqs.filter((f) => /^what is pmafi/i.test(f.question));
    expect(matches).toHaveLength(1);
  });

  it("matches an overriding row despite casing and punctuation", async () => {
    const { getFaqs } = await load([row("what is PMAFI", "Sheet version.")]);
    const faqs = await getFaqs();
    const matches = faqs.filter((f) => /^what is pmafi/i.test(f.question));
    expect(matches).toHaveLength(1);
    expect(matches[0].answer).toBe("Sheet version.");
  });

  it("adds questions that exist only in the sheet", async () => {
    const { getFaqs } = await load([row("Do you run events?", "Yes, several.")]);
    const faqs = await getFaqs();
    expect(faqs.find((f) => f.question === "Do you run events?")?.answer).toBe(
      "Yes, several."
    );
  });

  it("restores the built-in answer when a row is deleted", async () => {
    const withRow = await load([row("What is PMAFI?", "Sheet version.")]);
    const overridden = (await withRow.getFaqs()).find(
      (f) => f.question === "What is PMAFI?"
    );
    expect(overridden?.answer).toBe("Sheet version.");

    vi.doUnmock("@/lib/sheets");
    const empty = await load([]);
    const restored = (await empty.getFaqs()).find(
      (f) => f.question === "What is PMAFI?"
    );
    expect(restored?.answer).toMatch(/1988/);
  });

  it("falls back completely when the sheet is unreachable", async () => {
    const { getFaqs } = await load(new Error("boom"));
    const faqs = await getFaqs();
    expect(faqs.length).toBeGreaterThan(20);
  });
});

describe("the built-in answers state what the site actually does", () => {
  it("describes membership as pay-first, never apply-first", async () => {
    const { getFaqs } = await load([]);
    const faqs = await getFaqs();
    const joined = faqs.map((f) => f.answer).join(" ");
    // "Pending Payment" is the retired apply-first status label.
    expect(joined).not.toMatch(/pending payment/i);
    // Telling an applicant to await an invoice is the specific harm: none is
    // ever sent, so they wait instead of paying. Saying there is NO invoice to
    // wait for is the correct phrasing and must stay allowed.
    expect(joined).not.toMatch(/receive an invoice|await an invoice/i);
    expect(joined).toMatch(/pay-first/i);
  });

  it("does not promise a QR code the ID card has no room for", async () => {
    const { getFaqs } = await load([]);
    const faqs = await getFaqs();
    expect(faqs.map((f) => f.answer).join(" ")).not.toMatch(/qr code/i);
  });

  it("never claims a gift is tax-deductible", async () => {
    const { getFaqs } = await load([]);
    const faqs = await getFaqs();
    const joined = faqs.map((f) => f.answer).join(" ");
    expect(joined).toMatch(/donee-institution status/i);
    expect(joined).not.toMatch(/is tax[- ]deductible/i);
  });
});
