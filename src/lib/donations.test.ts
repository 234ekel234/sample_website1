import { describe, it, expect, vi, beforeEach } from "vitest";

// The sheet is the only external dependency. Everything below tests the logic
// that sits between a spreadsheet row and what a donor is shown.
const readRange = vi.fn();
vi.mock("@/lib/sheets", () => ({ readRange: (...a: unknown[]) => readRange(...a) }));

/**
 * donations.ts caches rows for 60s in module scope, so each test needs a fresh
 * copy of the module or the second test would read the first test's sheet.
 */
async function load() {
  vi.resetModules();
  return import("@/lib/donations");
}

/** Reference | Email | Donor name | Date | Amount | Fund | Status */
const ROWS = [
  ["PMAFI-2026-AAA111", "juan@example.com", "Juan Dela Cruz", "2026-03-15", "10000", "Professorial Chair Fund", "Allocated"],
  ["PMAFI-2026-BBB222", "juan@example.com", "Juan Dela Cruz", "2026-01-02", "₱5,000", "General Fund", "Acknowledged"],
  ["PMAFI-2026-CCC333", "maria@example.com", "Maria Santos", "2026-02-01", "2500", "", "Received"],
];

beforeEach(() => {
  process.env.DONATIONS_SHEET_ID = "test-sheet";
  readRange.mockReset();
  readRange.mockResolvedValue(ROWS);
});

describe("getGivingHistory — verification", () => {
  it("returns the donor's history for a matching email and reference", async () => {
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("juan@example.com", "PMAFI-2026-AAA111");
    expect(h).not.toBeNull();
    expect(h!.donorName).toBe("Juan Dela Cruz");
  });

  it("returns null when the reference belongs to a different email", async () => {
    // The security property: holding someone else's reference must not open
    // their record, and must be indistinguishable from any other miss.
    const { getGivingHistory } = await load();
    expect(await getGivingHistory("maria@example.com", "PMAFI-2026-AAA111")).toBeNull();
  });

  it("returns null for a real email with an unknown reference", async () => {
    const { getGivingHistory } = await load();
    expect(await getGivingHistory("juan@example.com", "PMAFI-2026-NOPE")).toBeNull();
  });

  it("returns null when either field is blank", async () => {
    const { getGivingHistory } = await load();
    expect(await getGivingHistory("", "PMAFI-2026-AAA111")).toBeNull();
    expect(await getGivingHistory("juan@example.com", "   ")).toBeNull();
  });

  it("ignores case and surrounding whitespace on both fields", async () => {
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("  JUAN@Example.com ", " pmafi-2026-aaa111 ");
    expect(h?.donorName).toBe("Juan Dela Cruz");
  });
});

describe("getGivingHistory — what the donor sees", () => {
  it("returns every gift under that email, not only the one quoted", async () => {
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("juan@example.com", "PMAFI-2026-AAA111");
    expect(h!.donations).toHaveLength(2);
  });

  it("never includes another donor's gift", async () => {
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("juan@example.com", "PMAFI-2026-AAA111");
    expect(h!.donations.every((d) => d.email === "juan@example.com")).toBe(true);
  });

  it("totals only that donor's gifts", async () => {
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("juan@example.com", "PMAFI-2026-AAA111");
    expect(h!.total).toBe(15000); // 10,000 + 5,000 — not Maria's 2,500
  });

  it("sorts newest first", async () => {
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("juan@example.com", "PMAFI-2026-AAA111");
    expect(h!.donations.map((d) => d.date)).toEqual(["2026-03-15", "2026-01-02"]);
  });
});

describe("getGivingHistory — parsing what staff typed", () => {
  it("reads amounts with peso signs, commas or neither", async () => {
    readRange.mockResolvedValue([
      ["R1", "a@b.com", "A", "2026-01-01", "₱10,000", "", "Received"],
      ["R2", "a@b.com", "A", "2026-01-02", "2,500.50", "", "Received"],
      ["R3", "a@b.com", "A", "2026-01-03", 750, "", "Received"],
    ]);
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("a@b.com", "R1");
    expect(h!.total).toBe(13250.5);
  });

  it("skips rows that could never be matched or rendered", async () => {
    readRange.mockResolvedValue([
      ["", "a@b.com", "A", "2026-01-01", "100", "", "Received"],       // no reference
      ["R2", "", "A", "2026-01-02", "100", "", "Received"],            // no email
      ["R3", "a@b.com", "A", "2026-01-03", "not a number", "", "Received"], // unusable amount
      ["R4", "a@b.com", "A", "2026-01-04", "100", "", "Received"],     // the only good row
    ]);
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("a@b.com", "R4");
    expect(h!.donations).toHaveLength(1);
    expect(h!.total).toBe(100);
  });

  it("normalises dates to ISO and keeps unparseable text as written", async () => {
    readRange.mockResolvedValue([
      ["R1", "a@b.com", "A", "March 15, 2026", "100", "", "Received"],
      ["R2", "a@b.com", "A", "sometime last year", "100", "", "Received"],
    ]);
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("a@b.com", "R1");
    const dates = h!.donations.map((d) => d.date);
    expect(dates[0]).toBe("2026-03-15");
    // An unparseable date must sort last rather than jumping the order.
    expect(dates[1]).toBe("sometime last year");
  });

  it("reads a Google Sheets date serial as a date, not a year", async () => {
    // readRange asks for UNFORMATTED_VALUE, so a cell formatted as a date comes
    // back as a number. new Date("46096") parses as the year 46096.
    readRange.mockResolvedValue([
      ["R1", "a@b.com", "A", 46096, "100", "", "Received"],
    ]);
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("a@b.com", "R1");
    expect(h!.donations[0].date).toBe("2026-03-15");
  });

  it("keeps an ISO date exactly as written", async () => {
    readRange.mockResolvedValue([
      ["R1", "a@b.com", "A", "2026-03-15", "100", "", "Received"],
    ]);
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("a@b.com", "R1");
    expect(h!.donations[0].date).toBe("2026-03-15");
  });

  it("floors an unrecognised status at Received", async () => {
    // Never overstate what the Foundation has done with the money.
    readRange.mockResolvedValue([
      ["R1", "a@b.com", "A", "2026-01-01", "100", "", ""],
      ["R2", "a@b.com", "A", "2026-01-02", "100", "", "banana"],
      ["R3", "a@b.com", "A", "2026-01-03", "100", "", "receipted"],
    ]);
    const { getGivingHistory } = await load();
    const h = await getGivingHistory("a@b.com", "R1");
    const byRef = Object.fromEntries(h!.donations.map((d) => [d.reference, d.status]));
    expect(byRef.R1).toBe("Received");
    expect(byRef.R2).toBe("Received");
    expect(byRef.R3).toBe("Receipt issued");
  });

  it("returns null rather than throwing when the sheet is empty", async () => {
    readRange.mockResolvedValue([]);
    const { getGivingHistory } = await load();
    expect(await getGivingHistory("a@b.com", "R1")).toBeNull();
  });

  it("lets a sheet failure surface so the caller can say so", async () => {
    // content.ts swallows errors and falls back; this one must not — telling a
    // real donor their gift is missing because a read failed would be worse.
    readRange.mockRejectedValue(new Error("sheet unreachable"));
    const { getGivingHistory } = await load();
    await expect(getGivingHistory("a@b.com", "R1")).rejects.toThrow("sheet unreachable");
  });
});
