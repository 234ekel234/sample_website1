import { describe, it, expect, vi, beforeEach } from "vitest";

// Members staff add by hand live on their own tab, because Google Forms
// overwrites rows typed into the sheet it owns. These tests cover the union of
// the two tabs, and the one thing that must differ between them: a manual row
// may not mint a digital ID card.

const readRange = vi.fn();
vi.mock("@/lib/sheets", () => ({ readRange: (...a: unknown[]) => readRange(...a) }));

/** members.ts caches for 60s in module scope, so each test needs a fresh copy. */
async function load() {
  vi.resetModules();
  return import("@/lib/members");
}

const FORM = [
  ["Timestamp", "Email Address", "Full name", "Email address", "Which membership category are you applying for?", "PMA Class", "Status"],
  ["2026-03-01", "juan@gmail.com", "Juan Dela Cruz", "juan@work.com", "Regular Member", "1988", "Active"],
];

// A different column order on purpose: this tab is not a form's responses
// sheet, so nothing constrains its layout but the header text.
const MANUAL = [
  ["Full name", "Email", "Category", "Status", "PMA Class", "Timestamp"],
  ["Pedro Ramos", "pedro@example.com", "Affiliate", "Active", "1975", "2019-05-02"],
];

/** Route each range to its own tab, the way the live sheet does. */
function serve(form: unknown[][], manual: unknown[][] | Error) {
  readRange.mockImplementation(async (_id: string, range: string) => {
    if (range.includes("Manual")) {
      if (manual instanceof Error) throw manual;
      return manual;
    }
    return form;
  });
}

beforeEach(() => {
  process.env.MEMBERS_SHEET_ID = "test-sheet";
  delete process.env.MEMBERS_SHEET_RANGE;
  delete process.env.MANUAL_MEMBERS_RANGE;
  readRange.mockReset();
  serve(FORM, MANUAL);
});

describe("the Manual Members tab", () => {
  it("puts staff-added members on the roster", async () => {
    const { checkMembership } = await load();
    const m = await checkMembership("pedro@example.com");
    expect(m?.name).toBe("Pedro Ramos");
    expect(m?.standing).toBe("Active");
    expect(m?.category).toBe("Affiliate");
  });

  it("marks them manual, and form applicants form", async () => {
    const { checkMembership } = await load();
    expect((await checkMembership("pedro@example.com"))?.source).toBe("manual");
    expect((await checkMembership("juan@work.com"))?.source).toBe("form");
  });

  it("finds its columns by header text, in any order", async () => {
    serve(FORM, [
      ["Status", "PMA Class", "Full name", "Email", "Category", "Timestamp"],
      ["Lapsed", "1975", "Pedro Ramos", "pedro@example.com", "Affiliate", "2019-05-02"],
    ]);
    const { checkMembership } = await load();
    expect((await checkMembership("pedro@example.com"))?.standing).toBe("Lapsed");
  });

  it("loads the roster anyway when the tab does not exist", async () => {
    // Most deployments will never have one. A roster that refuses to load
    // because an optional tab is absent takes the check down for everybody.
    serve(FORM, new Error("Unable to parse range: Manual Members!A1:Z"));
    const { checkMembership } = await load();
    expect((await checkMembership("juan@work.com"))?.name).toBe("Juan Dela Cruz");
    expect(await checkMembership("pedro@example.com")).toBeNull();
  });

  it("still applies best-standing-wins across the two tabs", async () => {
    // Staff recorded him Active; his own later application carries a blank
    // status, which means Pending. Re-applying must never demote anybody.
    serve(
      [FORM[0], ["2026-04-01", "pedro@example.com", "Pedro Ramos", "pedro@example.com", "Affiliate", "1975", ""]],
      MANUAL
    );
    const { checkMembership } = await load();
    expect((await checkMembership("pedro@example.com"))?.standing).toBe("Active");
  });

  it("promotes a person to form once they apply themselves, even if the manual row wins", async () => {
    // THE CASE THAT MATTERS. The manual row outranks the form row on standing,
    // so the winning record is the manual one — but the member has since proved
    // the address is theirs by submitting the form. Reading source off the
    // winning row alone would deny a card to the member who did as asked.
    serve(
      [FORM[0], ["2026-04-01", "pedro@example.com", "Pedro Ramos", "pedro@example.com", "Affiliate", "1975", ""]],
      MANUAL
    );
    const { checkMembership } = await load();
    const m = await checkMembership("pedro@example.com");
    expect(m?.standing).toBe("Active"); // from the manual row
    expect(m?.source).toBe("form"); // because a form row exists for them
  });

  it("does not let a manual row promote a different person", async () => {
    const { checkMembership } = await load();
    expect((await checkMembership("pedro@example.com"))?.source).toBe("manual");
  });
});
