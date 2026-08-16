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
//   MEMBERS_SHEET_RANGE   (optional)     – defaults to "Form Responses 1!A1:Z"
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

async function loadRoster(): Promise<Roster> {
  if (membersCache && membersCache.expires > Date.now()) {
    return membersCache.data;
  }

  const sheetId = requireEnv("MEMBERS_SHEET_ID");
  const range = process.env.MEMBERS_SHEET_RANGE ?? "Form Responses 1!A1:Z";
  const rows = await readRange(sheetId, range);
  if (rows.length === 0) return { members: [], byEmail: new Map() };

  const col = mapColumns(rows[0]);

  // Keyed by email so re-submissions collapse to one member.
  const byEmail = new Map<string, { member: MemberRecord; when: string }>();

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
    };

    for (const address of addresses) {
      const key = address.toLowerCase();
      const held = byEmail.get(key);
      if (
        !held ||
        STANDING_RANK[member.standing] > STANDING_RANK[held.member.standing] ||
        (STANDING_RANK[member.standing] === STANDING_RANK[held.member.standing] &&
          when > held.when)
      ) {
        byEmail.set(key, { member, when });
      }
    }
  }

  // byEmail carries one entry per ADDRESS, so a member with two resolves from
  // either. members carries one entry per PERSON, so a name search cannot
  // report the same applicant twice and call it ambiguous.
  const index = new Map<string, MemberRecord>();
  for (const [address, held] of byEmail) index.set(address, held.member);
  const members = [...new Set(index.values())];

  const roster: Roster = { members, byEmail: index };
  membersCache = { data: roster, expires: Date.now() + MEMBERS_TTL_MS };
  return roster;
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
