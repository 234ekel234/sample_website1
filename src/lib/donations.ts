// Server-side donation lookup.
//
// IMPORTANT: This module must only ever run on the server (it is imported solely
// by the "use server" action in src/app/donate/status/actions.ts). The donation
// log must NEVER be sent to the browser — callers verify one email/reference
// pair and receive only that donor's own records.
//
// WHY A REFERENCE IS REQUIRED (and the membership check needs no such thing):
// the membership lookup reveals a standing (Active / Lapsed / Pending). This one
// reveals amounts, dates and designations — a financial record. An email alone
// is guessable, so a donor must also supply the reference printed on their
// acknowledgment. Knowing the email is not enough; knowing the reference is not
// enough. See references/donations-sheet-setup.md.
//
// This is NOT authentication. It is a shared secret good enough for a read-only
// giving history, and it is the deliberate stand-in for the real logins scoped
// in PHASE-3-SCOPE.md (Module A). Two consequences worth stating plainly:
//   - Anyone the donor forwards their acknowledgment to can see their history.
//   - References MUST be random, not sequential. "PMAFI-2026-0142" alongside a
//     known email is enumerable; "PMAFI-2026-K7QX3M" is not.
//
// Data source: a private Google Sheet read here on the server via the shared
// client in src/lib/sheets.ts, authenticated with a service account. The sheet
// is shared only with the service account, so nothing is public.
//
// Required environment variables:
//   DONATIONS_SHEET_ID                   – spreadsheet ID from its URL. Falls
//                                          back to MEMBERS_SHEET_ID, since the
//                                          donation log belongs with the roster
//                                          in the private spreadsheet — NOT in
//                                          the staff-editable content sheet.
//   GOOGLE_SERVICE_ACCOUNT_EMAIL         – ...@...iam.gserviceaccount.com
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   – the PEM private key (\n-escaped is OK)
//   DONATIONS_SHEET_RANGE   (optional)   – defaults to "Donations!A2:G"

import { readRange } from "@/lib/sheets";

/** Where a gift has reached in PMAFI's process. Mirrors PHASE-3-SCOPE.md. */
export type DonationStatus =
  | "Received"
  | "Acknowledged"
  | "Receipt issued"
  | "Allocated";

export interface DonationRecord {
  reference: string;
  email: string;
  donorName: string;
  /** ISO yyyy-mm-dd when parseable, else the raw cell text. */
  date: string;
  /** Pesos. NaN is filtered out at load, so this is always a real number. */
  amount: number;
  /** What the gift was designated for, e.g. "Professorial Chair Fund". */
  fund: string;
  status: DonationStatus;
}

// --- Small server-side cache (this module is never bundled to the client) ---
// The donation log is appended to by staff, not by the site, so a short cache
// avoids re-reading the sheet on every lookup. A newly logged gift appears
// within DONATIONS_TTL_MS.
const DONATIONS_TTL_MS = 60_000;
let donationsCache: { data: DonationRecord[]; expires: number } | null = null;

function requireEnv(name: string, fallbackName?: string): string {
  const value =
    process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeStatus(value: string): DonationStatus {
  switch (value.trim().toLowerCase()) {
    case "acknowledged":
      return "Acknowledged";
    case "receipt issued":
    case "receipted":
      return "Receipt issued";
    case "allocated":
      return "Allocated";
    default:
      // Blank or unrecognized means staff have logged the gift but not moved it
      // on. "Received" is the safe floor — it never overstates what PMAFI has
      // done with the money.
      return "Received";
  }
}

/** Google Sheets counts days from 1899-12-30; serial 1 is 1900-01-01. */
const SHEETS_EPOCH_MS = Date.UTC(1899, 11, 30);
/** Serial 1 is 1900-01-01 and 100000 is about 2173 — anything outside is not a date. */
const MAX_SHEETS_SERIAL = 100_000;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sheet dates arrive as whatever the cell is formatted as. Normalize to ISO so
 * the UI can format consistently, but keep the raw text when it can't be parsed
 * rather than showing "Invalid Date".
 *
 * Two traps here, both of which showed a donor the wrong date:
 *
 *   - `readRange` requests UNFORMATTED_VALUE, so a cell actually formatted as a
 *     date comes back as a **serial number**, not text. `new Date("46096")`
 *     does not fail — it parses as the year 46096.
 *   - `new Date("March 15, 2026")` is local midnight, so `toISOString()` rolls
 *     it back a day in any positive-offset timezone. In Manila a gift dated the
 *     15th displayed as the 14th.
 */
function normalizeDate(value: string): string {
  const raw = value.trim();
  if (!raw) return "";

  // Already ISO — trust it, and never round-trip it through UTC.
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  // A bare number is a Sheets date serial, not a year.
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const serial = Number(raw);
    if (serial > 0 && serial < MAX_SHEETS_SERIAL) {
      const d = new Date(SHEETS_EPOCH_MS + Math.floor(serial) * 86_400_000);
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
    }
    return raw;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  // Local components, not toISOString() — see the note above.
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

/** "₱10,000", "10,000.00" and "10000" all mean the same thing to staff. */
function normalizeAmount(value: string): number {
  const cleaned = value.replace(/[^\d.-]/g, "");
  if (!cleaned) return NaN;
  return Number(cleaned);
}

async function loadDonations(): Promise<DonationRecord[]> {
  if (donationsCache && donationsCache.expires > Date.now()) {
    return donationsCache.data;
  }

  const sheetId = requireEnv("DONATIONS_SHEET_ID", "MEMBERS_SHEET_ID");
  const range = process.env.DONATIONS_SHEET_RANGE ?? "Donations!A2:G";
  const rows = await readRange(sheetId, range);

  const donations: DonationRecord[] = [];
  for (const row of rows) {
    const reference = String(row[0] ?? "").trim();
    const email = String(row[1] ?? "").trim();
    const amount = normalizeAmount(String(row[4] ?? ""));
    // Skip blank/incomplete rows. A row without a reference or email can never
    // be matched anyway, and one without a real amount would render as "₱NaN".
    if (!reference || !email || Number.isNaN(amount)) continue;
    donations.push({
      reference,
      email,
      donorName: String(row[2] ?? "").trim(),
      date: normalizeDate(String(row[3] ?? "")),
      amount,
      fund: String(row[5] ?? "").trim(),
      status: normalizeStatus(String(row[6] ?? "")),
    });
  }

  donationsCache = { data: donations, expires: Date.now() + DONATIONS_TTL_MS };
  return donations;
}

export interface GivingHistory {
  donorName: string;
  donations: DonationRecord[];
  total: number;
}

/**
 * Verify an email/reference pair and return that donor's giving history.
 *
 * Returns null when the pair doesn't match a row — the caller must not
 * distinguish "no such reference" from "reference belongs to another email",
 * or the page becomes an oracle for testing whether an address ever gave.
 *
 * On success the donor sees every gift recorded against their own email, not
 * only the one they quoted: they have already proven they hold a reference for
 * that address, and a history of one row is not a giving history.
 */
export async function getGivingHistory(
  email: string,
  reference: string
): Promise<GivingHistory | null> {
  const emailNeedle = email.trim().toLowerCase();
  const refNeedle = reference.trim().toLowerCase();
  if (!emailNeedle || !refNeedle) return null;

  const donations = await loadDonations();

  const matched = donations.find(
    (d) =>
      d.reference.toLowerCase() === refNeedle &&
      d.email.toLowerCase() === emailNeedle
  );
  if (!matched) return null;

  // Newest first. A date we couldn't parse is kept as raw text, and comparing
  // that against an ISO string sorts on its first character rather than on
  // time — so rank those to the bottom explicitly instead.
  const isIso = (d: DonationRecord) => /^\d{4}-\d{2}-\d{2}$/.test(d.date);
  const own = donations
    .filter((d) => d.email.toLowerCase() === emailNeedle)
    .sort((a, b) => {
      if (isIso(a) !== isIso(b)) return isIso(a) ? -1 : 1;
      return b.date.localeCompare(a.date);
    });

  return {
    donorName: matched.donorName,
    donations: own,
    total: own.reduce((sum, d) => sum + d.amount, 0),
  };
}
