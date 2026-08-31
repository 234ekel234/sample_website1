// Server-side member lookup.
//
// IMPORTANT: This module must only ever run on the server (it is imported solely
// by the "use server" action in src/app/membership/actions.ts). The full member
// roster must NEVER be sent to the browser — callers look up a single email and
// receive only that one record.
//
// Data source: a private Google Sheet read here on the server via the shared
// client in src/lib/sheets.ts, authenticated with a service account. The sheet
// is shared only with the service account, so nothing is public.
//
// Required environment variables (see references/membership-setup-todo.md):
//   MEMBERS_SHEET_ID                     – the spreadsheet ID from its URL
//   GOOGLE_SERVICE_ACCOUNT_EMAIL         – ...@...iam.gserviceaccount.com
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   – the PEM private key (\n-escaped is OK)
//   MEMBERS_SHEET_RANGE   (optional)     – defaults to "Membership Applications!A1:Z"
//
// THE SOURCE IS THE FORM'S RESPONSES SHEET. Every applicant row is created by
// the membership form; staff add one column of their own, Status, and set it to
// Active once they have verified the receipt.
//
// COLUMNS ARE FOUND BY HEADER TEXT, NEVER BY POSITION. A responses sheet's
// layout belongs to the form: adding or reordering a question shifts every
// column after it, and fixed positions would then read a phone number as a
// category with no error anywhere. The range therefore starts at row 1 — the
// header row is data here, not decoration.
//
// Headers matched (case-insensitive substring, so the full question text is
// fine): "full name" | "name", "email", "category", "pma class", "status",
// "timestamp".
//
// ONLY THOSE COLUMNS ARE READ. The responses sheet also holds phone numbers,
// mailing addresses, free-text answers and links to uploaded receipts. None of
// that is extracted, so none of it can reach a caller — MemberRecord is the
// same lean shape it was when the roster was a separate sheet.

import { readRange } from "@/lib/sheets";
import { normalizeSheetDate } from "@/lib/sheet-date";

export interface MemberRecord {
  name: string;
  email: string;
  category: "Regular" | "Associate" | "Affiliate";
  standing: "Active" | "Lapsed" | "Pending";
  /** PMA class or batch, e.g. "1988". Blank for members who never supplied one. */
  pmaClass: string;
  /** Year they joined, e.g. "2019". Blank when the roster has not recorded it. */
  memberSince: string;
  /**
   * Which tab the member came from.
   *
   * "form" — they submitted the membership form, so the row is theirs and the
   * address on it was typed by them.
   *
   * "manual" — staff added them to the `Manual Members` tab. The row asserts a
   * membership, but nobody proved the address belongs to the person named: a
   * staff member typed both. **This is why manual members cannot mint a digital
   * ID card** (see checkMembershipForIdAction). They can check their standing,
   * which reveals only what PMAFI already told them; they cannot obtain a PNG
   * bearing the Foundation's seal on the strength of an address somebody else
   * entered on their behalf.
   */
  source: "form" | "manual";
}

// --- Small server-side cache (this module is never bundled to the client) ---
// The roster changes rarely, so we cache it briefly to avoid re-reading the
// sheet on every status check. A newly added member appears within MEMBERS_TTL.
const MEMBERS_TTL_MS = 60_000;
interface Roster {
  /** One entry per member. */
  members: MemberRecord[];
  /** Every address a member can be found by, lowercased → that member. */
  byEmail: Map<string, MemberRecord>;
}
let membersCache: { data: Roster; expires: number } | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Pull a four-digit year out of whatever staff typed — "1988", "Class 1988",
 * "PMA '88" all mean the same thing. Anything without a plausible year is
 * dropped rather than printed raw onto a member's card.
 *
 * Exported for testing, following parseFundUpdates in fund-updates.ts. The test
 * previously regex-matched this function out of the source file and eval'd it,
 * which broke on any rename or reformat.
 */
export function normalizeYear(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  const full = raw.match(/\b(19|20)\d{2}\b/);
  if (full) return full[0];
  const short = raw.match(/'(\d{2})\b/);
  if (short) {
    const n = Number(short[1]);
    return String(n <= 30 ? 2000 + n : 1900 + n);
  }
  return "";
}

/**
 * The form offers whole sentences — "Regular Member — PMA alumnus, faculty, or
 * staff taking an active role..." — so this matches on the word rather than the
 * cell, and equally accepts a bare "Regular" typed by staff.
 *
 * "Not sure — please advise", and anything unrecognised, becomes Affiliate: the
 * broadest tier, and what the old auto-add script did. A defaulted category is
 * provisional, never a claim — the row is Pending until staff verify it, and
 * confirming the category is a step in that verification.
 */
function normalizeCategory(value: string): MemberRecord["category"] {
  const v = value.trim().toLowerCase();
  if (v.includes("regular")) return "Regular";
  if (v.includes("associate")) return "Associate";
  if (v.includes("affiliate")) return "Affiliate";
  return "Affiliate";
}

function normalizeStanding(value: string): MemberRecord["standing"] {
  const v = value.trim().toLowerCase();
  if (v === "active") return "Active";
  // BLANK MEANS PENDING HERE, and that is the opposite of what a hand-kept
  // roster should do. Every row in a responses sheet exists because somebody
  // applied and says they have paid; staff have simply not reached it yet.
  // Falling through to Lapsed would tell a brand-new applicant their membership
  // had expired. Pending grants nothing — it is not Active — so this stays
  // fail-safe while being true.
  if (!v) return "Pending";
  // Auto-added applicants awaiting staff action (references/membership-autoadd.gs).
  //
  // Both labels map to Pending on purpose. "Pending Verification" is what the
  // pay-first flow writes — the applicant has paid and staff are checking the
  // receipt. "Pending Payment" is the older apply-first label, and rows
  // carrying it predate the change, so dropping it would silently demote real
  // applicants to Lapsed. The site shows one Pending state for both.
  if (v === "pending verification" || v === "pending payment" || v === "pending") {
    return "Pending";
  }
  // Anything else staff typed — "Rejected", "Duplicate", a typo — is treated as
  // lapsed. It never grants standing, which is the property that matters.
  return "Lapsed";
}

/** Where each field lives in this particular responses sheet. */
interface ColumnMap {
  name: number;
  /**
   * Every column whose header mentions an email — there are usually two. The
   * form asks for one, and Google adds its own "Email Address" column because
   * the file-upload question forces respondents to sign in. Those can differ:
   * a member may type their everyday address and sign in with another. A lookup
   * matches ANY of them, so neither address is a wrong answer.
   */
  emails: number[];
  category: number;
  pmaClass: number;
  status: number;
  timestamp: number;
}

/** First column whose header contains `needle`, or -1. */
function findCol(headers: string[], needle: string): number {
  return headers.findIndex((h) => h.includes(needle));
}

/** Locate the columns we need. Throws rather than guess — see below. */
export function mapColumns(headerRow: unknown[]): ColumnMap {
  const headers = headerRow.map((h) => String(h ?? "").trim().toLowerCase());

  const name = findCol(headers, "full name") >= 0
    ? findCol(headers, "full name")
    : findCol(headers, "name");
  const emails = headers
    .map((h, i) => (h.includes("email") ? i : -1))
    .filter((i) => i >= 0);

  // Without a name or an address there is nothing to look anyone up by. Throwing
  // means the action reports "we couldn't check your status right now" — the
  // truth — instead of every member being told they are not on the roster
  // because somebody reworded a question.
  if (name < 0 || emails.length === 0) {
    throw new Error(
      "Members sheet: could not find a name or email column by header. " +
        `Headers seen: ${headers.filter(Boolean).join(" | ") || "(none)"}`
    );
  }

  return {
    name,
    emails,
    category: findCol(headers, "category"),
    pmaClass: findCol(headers, "pma class"),
    status: findCol(headers, "status"),
    timestamp: findCol(headers, "timestamp"),
  };
}

const cell = (row: unknown[], i: number) =>
  i >= 0 ? String(row[i] ?? "").trim() : "";

/**
 * Which of two rows for the same person wins.
 *
 * Re-submitting the form appends a second row rather than updating the first,
 * so one member can have several. Ranking by standing means a fresh submission
 * — blank status, therefore Pending — can never demote somebody staff already
 * verified as Active. Taking the newest row instead would do exactly that, and
 * the member would watch their membership evaporate for re-applying.
 */
const STANDING_RANK: Record<MemberRecord["standing"], number> = {
  Active: 3,
  Pending: 2,
  Lapsed: 1,
};

/** One parsed row, before rows are collapsed into people. */
interface Applicant {
  member: MemberRecord;
  /** Normalised submission date — breaks ties between rows of equal standing. */
  when: string;
  /** Every address on the row, lowercased. */
  addresses: string[];
  /** Which tab this row came from. See MemberRecord.source. */
  source: Source;
}

/** Where a batch of rows came from. See MemberRecord.source. */
type Source = MemberRecord["source"];

/** Whether `a` should displace `b`: better standing first, then newer row. */
function outranks(a: Applicant, b: Applicant): boolean {
  const rankA = STANDING_RANK[a.member.standing];
  const rankB = STANDING_RANK[b.member.standing];
  return rankA !== rankB ? rankA > rankB : a.when > b.when;
}

/**
 * Collapse rows into one record per person, indexed by every address that
 * person can be found under.
 *
 * A PERSON IS NEITHER A ROW NOR AN ADDRESS, and treating one as the other is
 * where this went wrong. Re-applying appends a row rather than updating the
 * existing one, and a member who types a different address the second time
 * leaves two rows overlapping in only some of their addresses. Keying purely on
 * address left those as two separate MemberRecords, so the roster held one
 * human twice and findMemberByName called them `ambiguous` — permanently, and
 * for precisely the member the name lookup exists to serve: one who cannot
 * remember which address they registered under. Their standing also depended on
 * which address they typed, so a re-application demoted them by one route and
 * not the other.
 *
 * So rows are unioned into a person when they share an address AND agree on the
 * name. THE NAME GUARD IS LOAD-BEARING: the Google-added email column holds
 * whoever was signed in, so one laptop used to submit for several classmates
 * puts the same address on all of their rows. Merging on address alone would
 * fold those classmates into one person and answer a member's own address with
 * somebody else's record.
 *
 * The cost is the mirror case — a member whose name was corrected between two
 * submissions stays two people, so their former name still resolves. That
 * returns their own row as it was recorded, never an invented one, and it is
 * the same thing the old address-keyed code did.
 */
function buildRoster(applicants: Applicant[]): Roster {
  // Union-find over row indices, with path halving.
  const parent = applicants.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  };

  const seen = new Map<string, number>();
  applicants.forEach((app, i) => {
    const person = nameKey(app.member.name);
    for (const address of app.addresses) {
      // NUL-joined: neither a folded name nor an address can contain one, so
      // no name/address pair can collide by running together.
      const key = `${person}\u0000${address}`;
      const first = seen.get(key);
      if (first === undefined) seen.set(key, i);
      else union(first, i);
    }
  });

  // The one row that represents each person.
  const best = new Map<number, Applicant>();
  applicants.forEach((app, i) => {
    const root = find(i);
    const held = best.get(root);
    if (!held || outranks(app, held)) best.set(root, app);
  });

  // A PERSON IS "form" IF ANY OF THEIR ROWS IS, whichever row wins on standing.
  //
  // Somebody staff added by hand who later applies through the form properly
  // has proved the address is theirs — the form made them sign in to upload a
  // receipt. But their manual row may still outrank the form row, because a
  // staff-set Active beats the blank status a fresh submission carries. Reading
  // the source off the winning row alone would therefore deny a card to exactly
  // the member who did everything asked of them.
  const formRoots = new Set<number>();
  applicants.forEach((app, i) => {
    if (app.source === "form") formRoots.add(find(i));
  });
  const memberByRoot = new Map<number, MemberRecord>();
  for (const [root, app] of best) {
    memberByRoot.set(root, {
      ...app.member,
      source: formRoots.has(root) ? "form" : "manual",
    });
  }

  // Every address resolves to its person's winning row, so typing either
  // address gives the same answer. An address two different people share falls
  // back to the same standing-first rule, which is what it has always done.
  const chosen = new Map<string, { root: number; app: Applicant }>();
  applicants.forEach((app, i) => {
    const root = find(i);
    const winner = best.get(root) ?? app;
    for (const address of app.addresses) {
      const held = chosen.get(address);
      if (!held || outranks(winner, held.app)) {
        chosen.set(address, { root, app: winner });
      }
    }
  });

  const byEmail = new Map<string, MemberRecord>();
  for (const [address, { root, app }] of chosen) {
    byEmail.set(address, memberByRoot.get(root) ?? app.member);
  }

  return { members: [...memberByRoot.values()], byEmail };
}

async function loadRoster(): Promise<Roster> {
  if (membersCache && membersCache.expires > Date.now()) {
    return membersCache.data;
  }

  const sheetId = requireEnv("MEMBERS_SHEET_ID");
  // The tab was renamed off Google's default "Form Responses 1" on purpose.
  // That name is POSITIONAL: recreate the form and its responses land in
  // "Form Responses 3", while the old tab keeps its name and its stale rows —
  // or worse, another form's responses take the number and the membership
  // check silently starts reading donations. A real name cannot be reassigned.
  const range = process.env.MEMBERS_SHEET_RANGE ?? "Membership Applications!A1:Z";

  // TWO TABS, BECAUSE GOOGLE FORMS OVERWRITES ROWS TYPED INTO ITS OWN SHEET.
  //
  // A form writes each response to the row after the last one IT wrote, a
  // position it tracks itself rather than reading off the bottom of the sheet.
  // Rows added by hand below the last response therefore sit in space the form
  // still considers free, and the next submission lands on top of one — one
  // member lost per submission, silently, with no undo. PMAFI hit this in
  // August 2026 after adding fifteen members by hand.
  //
  // So members added by staff live on their OWN tab, which no form ever writes
  // to, and the roster is the union of the two. This also answers the caveat
  // STATUS.md has carried from the start: a member who never used the form now
  // has somewhere to exist.
  //
  // Both tabs are read with the SAME header-based mapper, so the manual tab
  // needs only headers whose text contains "name", "email", "category",
  // "status", "pma class" and "timestamp" — column order is its own business.
  const manualRange =
    process.env.MANUAL_MEMBERS_RANGE ?? "Manual Members!A1:Z";

  const [formRows, manualRows] = await Promise.all([
    readRange(sheetId, range),
    // A MISSING TAB IS NOT AN ERROR. Most deployments will not have one, and a
    // roster that refuses to load because an optional tab is absent would take
    // the membership check down for everybody to serve nobody.
    readRange(sheetId, manualRange).catch(() => [] as unknown[][]),
  ]);

  const applicants: Applicant[] = [
    ...parseRoster(formRows, "form"),
    ...parseRoster(manualRows, "manual"),
  ];

  // byEmail carries one entry per ADDRESS, so a member with two resolves from
  // either. members carries one entry per PERSON, so a name search cannot
  // report the same applicant twice and call it ambiguous.
  const roster = buildRoster(applicants);
  membersCache = { data: roster, expires: Date.now() + MEMBERS_TTL_MS };
  return roster;
}

/**
 * Parse one tab's rows into applicants. Exported for testing.
 *
 * Row 1 is the header row — see the note at the top of this file about columns
 * being located by text, never by position.
 */
export function parseRoster(rows: unknown[][], source: Source): Applicant[] {
  if (rows.length === 0) return [];

  const col = mapColumns(rows[0]);

  // One entry per ROW here; buildRoster collapses them into people.
  const applicants: Applicant[] = [];

  for (const row of rows.slice(1)) {
    const name = cell(row, col.name);
    const addresses = col.emails
      .map((i) => cell(row, i))
      .filter(Boolean);
    if (!name || addresses.length === 0) continue;

    // The Timestamp column is date-formatted, and readRange asks for
    // UNFORMATTED_VALUE — so it arrives as a Sheets serial ("46082.6"), not
    // text. normalizeYear finds no year in that and every member silently lost
    // their joining year. Normalise to ISO first; this is the same trap
    // sheet-date.ts exists to hold, and it applies here too.
    const when = normalizeSheetDate(cell(row, col.timestamp));
    const member: MemberRecord = {
      name,
      email: addresses[0],
      category: normalizeCategory(cell(row, col.category)),
      standing: normalizeStanding(cell(row, col.status)),
      pmaClass: normalizeYear(cell(row, col.pmaClass)),
      // No "member since" question exists, and asking for one would be odd —
      // the year they applied IS the year they joined, and the timestamp is
      // already sitting in the row.
      memberSince: normalizeYear(when),  // `when` is ISO by here
      source,
    };

    applicants.push({
      member,
      when,
      addresses: addresses.map((a) => a.toLowerCase()),
      source,
    });
  }

  return applicants;
}

export async function checkMembership(
  email: string
): Promise<MemberRecord | null> {
  const needle = email.trim().toLowerCase();
  if (!needle) return null;
  const { byEmail } = await loadRoster();
  // Indexed by every address on the row, so signing in with one address and
  // typing another still finds the same member.
  return byEmail.get(needle) ?? null;
}

// ---------------------------------------------------------------------------
// Name lookup — the status check only.
//
// Members forget which address they registered under, and telling someone "no
// membership found" when they simply used their other email is the worst
// outcome the check can produce. Name lookup fixes that.
//
// IT IS DELIBERATELY NOT AVAILABLE TO THE DIGITAL ID GENERATOR. Names are
// public — alumni lists, reunion programmes, this site's own board page — so a
// name is not even the weak secret an email is. Minting a card bearing the
// Foundation's seal off a public name would make the credential forgeable by
// anyone who can read; /membership/id keeps calling checkMembership above, and
// that separation is the whole point of these being two functions.
// ---------------------------------------------------------------------------

/**
 * Fold a name to something two humans typing the same person would agree on:
 * case, accents, punctuation and spacing all removed.
 *
 * "Peña" and "Pena", "Juan D. Cruz" and "Juan D Cruz" must not be different
 * people to this function — a member who cannot find themselves because of a
 * missing accent has been failed by the site, not by their own typing.
 */
export function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The same name's words in a fixed order, so "Cruz, Juan" == "Juan Cruz". */
function nameKey(value: string): string {
  return normalizeName(value).split(" ").filter(Boolean).sort().join(" ");
}

export type NameLookup =
  | { kind: "found"; member: MemberRecord }
  | { kind: "ambiguous" }
  | { kind: "none" };

/**
 * Find the one member with this name.
 *
 * Two members genuinely can share a name, and there is no safe way to pick
 * between them — showing both would hand a stranger two people's standings off
 * one guess, and picking the first would show the wrong person their own
 * record. "ambiguous" sends them to the email lookup, which is unique.
 *
 * Matching is exact-after-folding, then word-set. It is NOT fuzzy on purpose:
 * an edit-distance match that accepts a near-miss would let someone probing
 * "Juan Cruz" land on a real "Juan Cruze", which is enumeration with extra
 * steps.
 */
export async function findMemberByName(name: string): Promise<NameLookup> {
  const typed = normalizeName(name);
  if (!typed) return { kind: "none" };

  const { members } = await loadRoster();

  let matches = members.filter((m) => normalizeName(m.name) === typed);
  if (matches.length === 0) {
    const key = nameKey(name);
    matches = members.filter((m) => nameKey(m.name) === key);
  }

  if (matches.length === 0) return { kind: "none" };
  if (matches.length > 1) return { kind: "ambiguous" };
  return { kind: "found", member: matches[0] };
}
