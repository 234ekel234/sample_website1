import { describe, it, expect, vi, beforeEach } from "vitest";

const readRange = vi.fn();
vi.mock("@/lib/sheets", () => ({ readRange: (...a: unknown[]) => readRange(...a) }));

/** members.ts caches for 60s in module scope, so each test needs a fresh copy. */
async function load() {
  vi.resetModules();
  return import("@/lib/members");
}

// A form responses sheet: header row first, and the columns in whatever order
// the form happens to produce. Note the TWO email columns — Google adds its own
// once a file-upload question forces sign-in, alongside the form's question.
const HEADER = [
  "Timestamp",
  "Email Address",
  "Full name",
  "Email address",
  "Mobile / phone number",
  "Which membership category are you applying for?",
  "PMA Class / Batch (and year graduated)",
  "Status",
];
const row = (
  ts: string,
  googleEmail: string,
  name: string,
  typedEmail: string,
  category: string,
  pmaClass: string,
  status: string
) => [ts, googleEmail, name, typedEmail, "0917", category, pmaClass, status];

const ROWS = [
  HEADER,
  row("2026-03-01", "juan@gmail.com", "Juan Dela Cruz", "juan@work.com",
      "Regular Member — PMA alumnus, faculty, or staff", "PMA Class 1988", "Active"),
  row("2026-03-02", "maria@gmail.com", "María Peña", "maria@gmail.com",
      "Associate Member — supporting the Foundation", "1995", "Active"),
  row("2026-03-03", "jose@gmail.com", "Jose P. Santos", "jose@gmail.com",
      "Not sure — please advise", "", ""),
  row("2026-03-04", "ana1@gmail.com", "Ana Reyes", "ana1@gmail.com",
      "Regular Member", "1990", "Active"),
  row("2026-03-05", "ana2@gmail.com", "Ana Reyes", "ana2@gmail.com",
      "Affiliate Member", "2001", "Lapsed"),
];

beforeEach(() => {
  process.env.MEMBERS_SHEET_ID = "test-sheet";
  delete process.env.MEMBERS_SHEET_RANGE;
  readRange.mockReset();
  readRange.mockResolvedValue(ROWS);
});

describe("reading a form responses sheet", () => {
  it("finds columns by header, not position", async () => {
    // Reorder the form and every fixed column index would now be wrong.
    const shuffled = [
      ["Status", "Full name", "Timestamp", "Email address", "Which membership category"],
      ["Active", "Juan Dela Cruz", "2026-03-01", "juan@work.com", "Regular Member"],
    ];
    readRange.mockResolvedValue(shuffled);
    const { checkMembership } = await load();
    const m = await checkMembership("juan@work.com");
    expect(m?.name).toBe("Juan Dela Cruz");
    expect(m?.standing).toBe("Active");
    expect(m?.category).toBe("Regular");
  });

  it("matches either email column on a row", async () => {
    // Signed in with one address, typed another. Neither is a wrong answer.
    const { checkMembership } = await load();
    expect((await checkMembership("juan@gmail.com"))?.name).toBe("Juan Dela Cruz");
    expect((await checkMembership("juan@work.com"))?.name).toBe("Juan Dela Cruz");
  });

  it("reads a category out of the form's full sentence", async () => {
    const { checkMembership } = await load();
    expect((await checkMembership("juan@work.com"))?.category).toBe("Regular");
    expect((await checkMembership("maria@gmail.com"))?.category).toBe("Associate");
  });

  it("defaults an unrecognised category to Affiliate rather than dropping the row", async () => {
    // "Not sure — please advise". Skipping would leave the applicant unable to
    // check their own status; the category is provisional until staff confirm.
    const { checkMembership } = await load();
    const m = await checkMembership("jose@gmail.com");
    expect(m?.category).toBe("Affiliate");
  });

  it("treats a blank status as Pending, never Lapsed", async () => {
    // Every row here is an application. "Lapsed" would tell a brand-new
    // applicant their membership had expired.
    const { checkMembership } = await load();
    expect((await checkMembership("jose@gmail.com"))?.standing).toBe("Pending");
  });

  it("still fails safe on a status nobody recognises", async () => {
    readRange.mockResolvedValue([
      HEADER,
      row("2026-03-01", "x@e.com", "X Y", "x@e.com", "Regular", "", "Rejected"),
    ]);
    const { checkMembership } = await load();
    expect((await checkMembership("x@e.com"))?.standing).toBe("Lapsed");
  });

  it("takes the joining year from the submission timestamp", async () => {
    const { checkMembership } = await load();
    expect((await checkMembership("juan@work.com"))?.memberSince).toBe("2026");
  });

  it("reads a timestamp that arrives as a Sheets serial, not text", async () => {
    // readRange asks for UNFORMATTED_VALUE, so a date-formatted Timestamp cell
    // comes back as a number. Serial 46082 is in 2026.
    readRange.mockResolvedValue([
      HEADER,
      row("46082.635", "s@e.com", "Serial Person", "s@e.com", "Regular", "1988", "Active"),
    ]);
    const { checkMembership } = await load();
    expect((await checkMembership("s@e.com"))?.memberSince).toBe("2026");
  });

  it("reads the PMA class out of whatever was typed", async () => {
    const { checkMembership } = await load();
    expect((await checkMembership("juan@work.com"))?.pmaClass).toBe("1988");
  });

  it("throws rather than reporting everyone as not-a-member", async () => {
    // A reworded question that loses "name"/"email" must surface as a service
    // error, not as every member being told they are not on the roster.
    readRange.mockResolvedValue([["Timestamp", "Mobile", "Status"], ["a", "b", "c"]]);
    const { checkMembership } = await load();
    await expect(checkMembership("juan@work.com")).rejects.toThrow(/name or email/i);
  });

  it("returns nothing for a completely empty sheet", async () => {
    readRange.mockResolvedValue([]);
    const { checkMembership } = await load();
    expect(await checkMembership("juan@work.com")).toBeNull();
  });
});

describe("re-submissions", () => {
  it("does not let a new application demote a verified member", async () => {
    // The classic failure: member is Active, re-applies, the fresh row has a
    // blank status, and taking the newest row would flip them to Pending.
    readRange.mockResolvedValue([
      HEADER,
      row("2026-03-01", "juan@gmail.com", "Juan Dela Cruz", "juan@gmail.com", "Regular", "1988", "Active"),
      row("2026-06-01", "juan@gmail.com", "Juan Dela Cruz", "juan@gmail.com", "Regular", "1988", ""),
    ]);
    const { checkMembership } = await load();
    expect((await checkMembership("juan@gmail.com"))?.standing).toBe("Active");
  });

  it("prefers the newer row when both carry the same standing", async () => {
    readRange.mockResolvedValue([
      HEADER,
      row("2026-03-01", "j@e.com", "Old Name", "j@e.com", "Regular", "1988", "Active"),
      row("2026-06-01", "j@e.com", "New Name", "j@e.com", "Regular", "1988", "Active"),
    ]);
    const { checkMembership } = await load();
    expect((await checkMembership("j@e.com"))?.name).toBe("New Name");
  });

  it("counts a duplicate submission as one person, not an ambiguous name", async () => {
    readRange.mockResolvedValue([
      HEADER,
      row("2026-03-01", "j@e.com", "Juan Dela Cruz", "j@e.com", "Regular", "1988", "Active"),
      row("2026-06-01", "j@e.com", "Juan Dela Cruz", "j@e.com", "Regular", "1988", "Active"),
    ]);
    const { findMemberByName } = await load();
    expect((await findMemberByName("Juan Dela Cruz")).kind).toBe("found");
  });
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
    if (r.kind === "found") expect(r.member.name).toBe("Juan Dela Cruz");
  });

  it("finds a member despite case, accents and stray punctuation", async () => {
    const { findMemberByName } = await load();
    for (const typed of ["maria pena", "MARIA PEÑA", "María  Peña"]) {
      const r = await findMemberByName(typed);
      expect(r.kind, `typed: ${typed}`).toBe("found");
    }
  });

  it("matches a surname-first entry", async () => {
    const { findMemberByName } = await load();
    expect((await findMemberByName("Dela Cruz, Juan")).kind).toBe("found");
  });

  it("refuses to choose when two different people share a name", async () => {
    const { findMemberByName } = await load();
    expect((await findMemberByName("Ana Reyes")).kind).toBe("ambiguous");
  });

  it("does not match a near miss", async () => {
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

  it("lets a sheet failure surface rather than reporting 'not a member'", async () => {
    readRange.mockRejectedValue(new Error("boom"));
    const { findMemberByName } = await load();
    await expect(findMemberByName("Juan Dela Cruz")).rejects.toThrow();
  });
});
