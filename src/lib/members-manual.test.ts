import { describe, it, expect, vi, beforeEach } from "vitest";

// Members staff add by hand live on their own tab, because Google Forms
// overwrites rows typed into the sheet it owns. These tests cover the union of
// the two tabs and how a person appearing on both is collapsed: standing
// decides first, and the manual row wins the tie because it is the curated one.
// A manual row mints a digital ID card on the same terms as a form row —
// PMAFI settled that on 2026-08-31.

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

  it("prefers the manual row when both tabs agree on standing", async () => {
    // Both say Active, and the form row is two years NEWER — so the old
    // newest-wins rule handed it the record. The manual tab is the curated one:
    // staff typed Affiliate there deliberately, and picking by accident of date
    // threw that correction away.
    serve(
      [FORM[0], ["2026-04-01", "pedro@example.com", "Pedro Ramos", "pedro@example.com", "Regular Member", "1975", "Active"]],
      MANUAL
    );
    const { checkMembership } = await load();
    expect((await checkMembership("pedro@example.com"))?.category).toBe("Affiliate");
  });

  it("lets the manual tab win even when the form row has a better standing", async () => {
    // REVERSED ON 2026-09-19, and this test previously asserted the opposite.
    // Source used to break a tie only, so that nothing could ever demote a
    // member. It now beats standing outright: the Manual Members tab holds the
    // membership roll PMAFI supplied, with the standing PMAFI themselves set,
    // and when the roll and an application disagree the roll is the Foundation's
    // own record. The cost is that a manual Lapsed can now pull down a form
    // Active — unreachable while every row on the roll is Active, and the
    // intended answer on the day one is not.
    serve(
      [FORM[0], ["2026-04-01", "pedro@example.com", "Pedro Ramos", "pedro@example.com", "Regular Member", "1975", "Active"]],
      [MANUAL[0], ["Pedro Ramos", "pedro@example.com", "Affiliate", "Lapsed", "1975", "2019-05-02"]]
    );
    const { checkMembership } = await load();
    expect((await checkMembership("pedro@example.com"))?.standing).toBe("Lapsed");
  });

  it("still never demotes a member who simply re-applies", async () => {
    // Within ONE tab the old rule is untouched: better standing wins. This is
    // the guarantee that matters to a member — re-applying appends a row with a
    // blank status, and taking it would flip them to Pending.
    serve(
      [
        FORM[0],
        ["2026-03-01", "juan@gmail.com", "Juan Dela Cruz", "juan@gmail.com", "Regular Member", "1988", "Active"],
        ["2026-06-01", "juan@gmail.com", "Juan Dela Cruz", "juan@gmail.com", "Regular Member", "1988", ""],
      ],
      [MANUAL[0]]
    );
    const { checkMembership } = await load();
    expect((await checkMembership("juan@gmail.com"))?.standing).toBe("Active");
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

describe("a member on both tabs with different addresses", () => {
  // The roll PMAFI supplied carries placeholder addresses, because it came with
  // no emails. A member who also applied has a real one on their form row, so
  // the two rows share nothing and used to stay two people — same name, same
  // class, therefore `ambiguous` forever, for exactly the members who applied.
  const FORM_ROW = ["2026-04-01", "irvin@gmail.com", "Irvin Hibaler", "irvin@gmail.com", "Regular Member", "2011", ""];
  const MANUAL_ROW = ["Irvin Hibaler", "hibaler.2011.r9@members.invalid", "Regular", "Active", "2011", ""];

  it("collapses them into one member, not an ambiguous name", async () => {
    serve([FORM[0], FORM_ROW], [MANUAL[0], MANUAL_ROW]);
    const { findMemberByName } = await load();
    expect((await findMemberByName("Irvin Hibaler")).kind).toBe("found");
  });

  it("shows the standing from the Manual Members row", async () => {
    serve([FORM[0], FORM_ROW], [MANUAL[0], MANUAL_ROW]);
    const { checkMembership } = await load();
    // The form row is blank, therefore Pending; the roll says Active.
    expect((await checkMembership("irvin@gmail.com"))?.standing).toBe("Active");
  });

  it("lets the manual row win even when the form row ranks higher", async () => {
    // Source now beats standing across tabs. This is the case the old
    // standing-first rule decided the other way.
    serve(
      [FORM[0], ["2026-04-01", "irvin@gmail.com", "Irvin Hibaler", "irvin@gmail.com", "Regular Member", "2011", "Active"]],
      [MANUAL[0], ["Irvin Hibaler", "hibaler.2011.r9@members.invalid", "Regular", "Lapsed", "2011", ""]]
    );
    const { checkMembership } = await load();
    expect((await checkMembership("irvin@gmail.com"))?.standing).toBe("Lapsed");
  });

  it("resolves from either address, since they are now one person", async () => {
    serve([FORM[0], FORM_ROW], [MANUAL[0], MANUAL_ROW]);
    const { checkMembership } = await load();
    const viaReal = await checkMembership("irvin@gmail.com");
    const viaPlaceholder = await checkMembership("hibaler.2011.r9@members.invalid");
    expect(viaReal?.standing).toBe("Active");
    expect(viaPlaceholder?.standing).toBe("Active");
  });

  it("merges two manual rows sharing a name and class", async () => {
    // The roll carries 32 such groups and every one is identical in category
    // and standing, so both readings — one member listed twice, or two genuine
    // namesakes — give the enquirer the same answer. Leaving them split only
    // denied 32 members a standing and a card.
    serve(
      [FORM[0]],
      [
        MANUAL[0],
        ["Narciso L Abaya", "abaya.narciso.1971.r4@members.invalid", "Regular", "Active", "1971", ""],
        ["Narciso L Abaya", "abaya.narciso.1971.r5@members.invalid", "Regular", "Active", "1971", ""],
      ]
    );
    const { findMemberByName } = await load();
    expect((await findMemberByName("Narciso L Abaya")).kind).toBe("found");
  });

  it("keeps two members of the same name in DIFFERENT classes apart", async () => {
    // 37 names on the roll recur across classes. This is the line that stops
    // the rule above collapsing every namesake into one member.
    serve(
      [FORM[0]],
      [
        MANUAL[0],
        ["Jose Santos", "santos.jose.1970.r1@members.invalid", "Regular", "Active", "1970", ""],
        ["Jose Santos", "santos.jose.1995.r2@members.invalid", "Regular", "Active", "1995", ""],
      ]
    );
    const { findMemberByName } = await load();
    expect((await findMemberByName("Jose Santos")).kind).toBe("ambiguous");
    // ...and the class year still separates them, which is the whole point.
    const one = await findMemberByName("Jose Santos", "1995");
    expect(one.kind).toBe("found");
    if (one.kind === "found") expect(one.member.pmaClass).toBe("1995");
  });

  it("does not merge when the class years differ", async () => {
    serve(
      [FORM[0], ["2026-04-01", "irvin@gmail.com", "Irvin Hibaler", "irvin@gmail.com", "Regular Member", "2011", ""]],
      [MANUAL[0], ["Irvin Hibaler", "hibaler.r9@members.invalid", "Regular", "Active", "1999", ""]]
    );
    const { findMemberByName } = await load();
    expect((await findMemberByName("Irvin Hibaler")).kind).toBe("ambiguous");
  });

  it("does not merge two members who both have no class on file", async () => {
    // An empty class must never match another empty one — the same rule
    // sameClass() applies.
    serve(
      [FORM[0], ["2026-04-01", "p@gmail.com", "Pedro Ramos", "p@gmail.com", "Regular Member", "", ""]],
      [MANUAL[0], ["Pedro Ramos", "ramos.r1@members.invalid", "Regular", "Active", "", ""]]
    );
    const { findMemberByName } = await load();
    expect((await findMemberByName("Pedro Ramos")).kind).toBe("ambiguous");
  });
});
