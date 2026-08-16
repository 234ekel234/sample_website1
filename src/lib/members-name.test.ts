import { describe, it, expect, vi, beforeEach } from "vitest";

const readRange = vi.fn();
vi.mock("@/lib/sheets", () => ({ readRange: (...a: unknown[]) => readRange(...a) }));

/** members.ts caches for 60s in module scope, so each test needs a fresh copy. */
async function load() {
  vi.resetModules();
  return import("@/lib/members");
}

/** Name | Email | Category | Status | PMA Class | Member Since */
const ROWS = [
  ["Juan Dela Cruz", "juan@example.com", "Regular", "Active", "1988", "2010"],
  ["María Peña", "maria@example.com", "Associate", "Active", "1995", "2015"],
  ["Jose P. Santos", "jose@example.com", "Regular", "Lapsed", "", ""],
  // Two real members genuinely sharing a name.
  ["Ana Reyes", "ana1@example.com", "Regular", "Active", "1990", "2012"],
  ["Ana Reyes", "ana2@example.com", "Affiliate", "Lapsed", "2001", "2020"],
];

beforeEach(() => {
  process.env.MEMBERS_SHEET_ID = "test-sheet";
  readRange.mockReset();
  readRange.mockResolvedValue(ROWS);
});

describe("normalizeName", () => {
  it("folds case, accents, punctuation and spacing", async () => {
    const { normalizeName } = await load();
    expect(normalizeName("  JUAN   DELA  CRUZ ")).toBe("juan dela cruz");
    expect(normalizeName("María Peña")).toBe("maria pena");
    expect(normalizeName("Jose P. Santos")).toBe("jose p santos");
    expect(normalizeName("O'Brien-Smith")).toBe("o brien smith");
  });
});

describe("findMemberByName", () => {
  it("finds a member typed exactly", async () => {
    const { findMemberByName } = await load();
    const r = await findMemberByName("Juan Dela Cruz");
    expect(r.kind).toBe("found");
    if (r.kind === "found") expect(r.member.email).toBe("juan@example.com");
  });

  it("finds a member despite case, accents and stray punctuation", async () => {
    const { findMemberByName } = await load();
    // A member who cannot type "ñ" must still find themselves.
    for (const typed of ["maria pena", "MARIA PEÑA", "María  Peña"]) {
      const r = await findMemberByName(typed);
      expect(r.kind, `typed: ${typed}`).toBe("found");
      if (r.kind === "found") expect(r.member.email).toBe("maria@example.com");
    }
  });

  it("matches a surname-first roster entry", async () => {
    const { findMemberByName } = await load();
    const r = await findMemberByName("Dela Cruz, Juan");
    expect(r.kind).toBe("found");
    if (r.kind === "found") expect(r.member.email).toBe("juan@example.com");
  });

  it("refuses to choose when two members share a name", async () => {
    // Picking the first would show the wrong person their own record; showing
    // both would hand a stranger two standings off one guess.
    const { findMemberByName } = await load();
    expect((await findMemberByName("Ana Reyes")).kind).toBe("ambiguous");
  });

  it("does not match a near miss", async () => {
    // Fuzzy matching would let someone probing names land on a real member.
    const { findMemberByName } = await load();
    for (const typed of ["Juan Cruze", "Jon Dela Cruz", "Juan"]) {
      expect((await findMemberByName(typed)).kind, `typed: ${typed}`).toBe("none");
    }
  });

  it("returns none for blank or punctuation-only input", async () => {
    const { findMemberByName } = await load();
    for (const typed of ["", "   ", "..."]) {
      expect((await findMemberByName(typed)).kind).toBe("none");
    }
  });

  it("never reveals a member other than the one matched", async () => {
    const { findMemberByName } = await load();
    const r = await findMemberByName("Jose P Santos");
    expect(r.kind).toBe("found");
    if (r.kind === "found") {
      expect(r.member.email).toBe("jose@example.com");
      expect(JSON.stringify(r)).not.toContain("juan@example.com");
      expect(JSON.stringify(r)).not.toContain("maria@example.com");
    }
  });

  it("lets a sheet failure surface rather than reporting 'not a member'", async () => {
    readRange.mockRejectedValue(new Error("boom"));
    const { findMemberByName } = await load();
    await expect(findMemberByName("Juan Dela Cruz")).rejects.toThrow();
  });
});
