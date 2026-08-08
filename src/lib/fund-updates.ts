// Public fund updates — the "what did my gift do?" half of donor tracking.
//
// Phase 2, Module C of the proposal: a transparency feed showing what each fund
// has accomplished. Staff publish from a Google Sheet exactly as they do news —
// title, message, and an optional photo.
//
// This is deliberately PUBLIC and carries no personal information. It is the
// counterpart to the private giving summary: one says what the Foundation did
// with the money, the other says whether a particular gift arrived.
//
// NO FALLBACK CONTENT. Unlike news and site copy, an empty feed renders an
// honest empty state rather than invented updates — publishing a fabricated
// account of what a donation achieved would be far worse than showing nothing.
//
// Sheet layout — tab named "Fund Updates", row 1 = headers, data from row 2:
//   A: Fund   B: Title   C: Message   D: Date   E: Image URL   F: Published (Yes/No)

import { readRange } from "@/lib/sheets";

export interface FundUpdate {
  /** Which fund this update belongs to, e.g. "Professorial Chair Fund". */
  fund: string;
  title: string;
  message: string;
  /** ISO yyyy-mm-dd when parseable, else the raw cell text. */
  date: string;
  /** Direct image URL, or "" when none was supplied. */
  image: string;
}

const FUND_UPDATES_RANGE = "Fund Updates!A2:F";

/** Google Sheets counts days from 1899-12-30; serial 1 is 1900-01-01. */
const SHEETS_EPOCH_MS = Date.UTC(1899, 11, 30);
const MAX_SHEETS_SERIAL = 100_000;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Same two traps as the donations sheet: `readRange` requests UNFORMATTED_VALUE
 * so a date cell arrives as a serial number, and `toISOString()` on a locally
 * parsed date rolls it back a day in any positive-offset timezone.
 */
function normalizeDate(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
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
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

/** Convert a Google Drive share URL to one next/image can load. */
function toDriveImageUrl(raw: string): string {
  if (!raw) return "";
  const fileId =
    raw.match(/\/file\/d\/([^/?#]+)/)?.[1] ?? raw.match(/[?&]id=([^&]+)/)?.[1];
  return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : raw;
}

/** Parse sheet rows into updates. Exported for testing. */
export function parseFundUpdates(rows: unknown[][]): FundUpdate[] {
  const updates: FundUpdate[] = [];
  for (const row of rows) {
    const fund = String(row[0] ?? "").trim();
    const title = String(row[1] ?? "").trim();
    const message = String(row[2] ?? "").trim();
    const published = String(row[5] ?? "").trim().toLowerCase();

    // A row without a fund or a title cannot be grouped or read.
    if (!fund || !title) continue;
    if (published !== "yes" && published !== "true") continue;

    updates.push({
      fund,
      title,
      message,
      date: normalizeDate(String(row[3] ?? "")),
      image: toDriveImageUrl(String(row[4] ?? "").trim()),
    });
  }

  // Newest first; an unparseable date sorts to the bottom rather than jumping
  // the queue on a string comparison.
  const isIso = (u: FundUpdate) => /^\d{4}-\d{2}-\d{2}$/.test(u.date);
  return updates.sort((a, b) => {
    if (isIso(a) !== isIso(b)) return isIso(a) ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

/** Updates grouped by fund, in the order the funds first appear. */
export function groupByFund(updates: FundUpdate[]): [string, FundUpdate[]][] {
  const groups = new Map<string, FundUpdate[]>();
  for (const u of updates) {
    const list = groups.get(u.fund);
    if (list) list.push(u);
    else groups.set(u.fund, [u]);
  }
  return [...groups.entries()];
}

/**
 * Published fund updates, newest first.
 *
 * Returns an empty array when the sheet is missing, unreachable or empty. The
 * page renders an empty state from that — it never invents an update.
 */
export async function getFundUpdates(): Promise<FundUpdate[]> {
  const sheetId = process.env.CONTENT_SHEET_ID;
  if (!sheetId) return [];

  try {
    const rows = await readRange(sheetId, FUND_UPDATES_RANGE, { revalidate: 60 });
    return parseFundUpdates(rows);
  } catch {
    // Missing tab or unreachable sheet — show the empty state, not an error.
    return [];
  }
}
