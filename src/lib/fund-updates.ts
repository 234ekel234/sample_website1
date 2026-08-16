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
import { toDisplayImageUrl } from "@/lib/sheet-image";
import { normalizeSheetDate, byNewestDate } from "@/lib/sheet-date";
import { canonicalFund } from "@/lib/funds";

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

/** Parse sheet rows into updates. Exported for testing. */
export function parseFundUpdates(rows: unknown[][]): FundUpdate[] {
  const updates: FundUpdate[] = [];
  for (const [i, row] of rows.entries()) {
    const fund = String(row[0] ?? "").trim();
    const title = String(row[1] ?? "").trim();
    const message = String(row[2] ?? "").trim();
    const published = String(row[5] ?? "").trim().toLowerCase();
    const isPublished = published === "yes" || published === "true";

    // A row without a fund or a title cannot be grouped or read.
    //
    // Say so when it was MARKED PUBLISHED. Staff who fill in a fund name, tick
    // Published, and see nothing appear have no way to tell whether the sheet
    // is wired up at all — the row is simply swallowed. An unpublished row is
    // a draft and stays silent; a published one that cannot render is a
    // mistake somebody is waiting on.
    if (!fund || !title) {
      if (isPublished) {
        console.warn(
          `[fund-updates] Row ${i + 2} is marked Published but has no ` +
            `${!fund ? "Fund (column A)" : "Title (column B)"} — not shown. ` +
            "Every published row needs at least a fund and a title."
        );
      }
      continue;
    }
    if (!isPublished) continue;

    updates.push({
      // Same canonical list the donation log is read through, so the two sides
      // of the join cannot drift apart. See src/lib/funds.ts.
      fund: canonicalFund(fund),
      title,
      message,
      date: normalizeSheetDate(String(row[3] ?? "")),
      image: toDisplayImageUrl(String(row[4] ?? "")),
    });
  }

  // Newest first; an unparseable date sorts to the bottom rather than jumping
  // the queue on a string comparison.
  return updates.sort(byNewestDate);
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
