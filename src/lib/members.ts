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
//   MEMBERS_SHEET_RANGE   (optional)     – defaults to "Members!A2:F"
//
// Sheet layout — tab named "Members", row 1 = headers, data from row 2:
//   A: Name  B: Email  C: Category  D: Status  E: PMA Class  F: Member Since
//
// Columns E and F are optional: the site holds only what it uses, and a blank
// cell simply omits that line from the member ID rather than breaking anything.

import { readRange } from "@/lib/sheets";

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
let membersCache: { data: MemberRecord[]; expires: number } | null = null;

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

function normalizeCategory(value: string): MemberRecord["category"] | null {
  switch (value.trim().toLowerCase()) {
    case "regular":
      return "Regular";
    case "associate":
      return "Associate";
    case "affiliate":
      return "Affiliate";
    default:
      return null;
  }
}

function normalizeStanding(value: string): MemberRecord["standing"] {
  const v = value.trim().toLowerCase();
  if (v === "active") return "Active";
  // Auto-added applicants awaiting staff action (references/membership-autoadd.gs).
  //
  // Both labels map to Pending on purpose. "Pending Verification" is what the
  // pay-first flow writes — the applicant has paid and staff are checking the
  // receipt. "Pending Payment" is the older apply-first label, and rows
  // carrying it predate the change, so dropping it would silently demote real
  // applicants to Lapsed. The site shows one Pending state either way; only
  // the wording on /membership differs, driven by canPayFirst().
  if (v === "pending verification" || v === "pending payment" || v === "pending") {
    return "Pending";
  }
  // Anything else (incl. blank / unrecognized) is treated as lapsed (fail safe).
  return "Lapsed";
}

async function loadMembers(): Promise<MemberRecord[]> {
  if (membersCache && membersCache.expires > Date.now()) {
    return membersCache.data;
  }

  const sheetId = requireEnv("MEMBERS_SHEET_ID");
  const range = process.env.MEMBERS_SHEET_RANGE ?? "Members!A2:F";
  const rows = await readRange(sheetId, range);

  const members: MemberRecord[] = [];
  for (const row of rows) {
    const name = String(row[0] ?? "").trim();
    const email = String(row[1] ?? "").trim();
    const category = normalizeCategory(String(row[2] ?? ""));
    // Skip blank/incomplete rows and rows with an unrecognized category.
    if (!email || !name || !category) continue;
    members.push({
      name,
      email,
      category,
      standing: normalizeStanding(String(row[3] ?? "")),
      pmaClass: normalizeYear(String(row[4] ?? "")),
      memberSince: normalizeYear(String(row[5] ?? "")),
    });
  }

  membersCache = { data: members, expires: Date.now() + MEMBERS_TTL_MS };
  return members;
}

export async function checkMembership(
  email: string
): Promise<MemberRecord | null> {
  const needle = email.trim().toLowerCase();
  if (!needle) return null;
  const members = await loadMembers();
  return members.find((m) => m.email.toLowerCase() === needle) ?? null;
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

  const members = await loadMembers();

  let matches = members.filter((m) => normalizeName(m.name) === typed);
  if (matches.length === 0) {
    const key = nameKey(name);
    matches = members.filter((m) => nameKey(m.name) === key);
  }

  if (matches.length === 0) return { kind: "none" };
  if (matches.length > 1) return { kind: "ambiguous" };
  return { kind: "found", member: matches[0] };
}
