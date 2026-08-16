// Reading a date out of a Google Sheet cell, and ordering by it.
//
// This lived twice — once in donations.ts and once in fund-updates.ts, byte for
// byte, including both of the traps below. Each was found the hard way and each
// had to be fixed twice; the second copy is how one of them comes back.
//
// TRAP 1 — a date cell is a NUMBER, not text. `readRange` asks for
// UNFORMATTED_VALUE, so a cell formatted as a date arrives as a Sheets serial.
// `new Date("46096")` does not fail: it parses as the year 46096.
//
// TRAP 2 — `new Date("March 15, 2026")` is LOCAL midnight, so `toISOString()`
// rolls it back a day in any positive-offset timezone. In Manila a gift dated
// the 15th displayed as the 14th. Always read local components back out.

/** Google Sheets counts days from 1899-12-30; serial 1 is 1900-01-01. */
const SHEETS_EPOCH_MS = Date.UTC(1899, 11, 30);
/** Serial 1 is 1900-01-01 and 100000 is about 2173 — outside that is not a date. */
const MAX_SHEETS_SERIAL = 100_000;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const pad = (n: number) => String(n).padStart(2, "0");

/** True when a value is already an ISO yyyy-mm-dd date. */
export function isIsoDate(value: string): boolean {
  return ISO_DATE.test(value);
}

/**
 * Normalise a sheet date cell to ISO yyyy-mm-dd.
 *
 * Keeps the raw text when it cannot be parsed, rather than showing the reader
 * "Invalid Date" — staff sometimes write "sometime last year" and that is more
 * useful on screen than nothing.
 */
export function normalizeSheetDate(value: string): string {
  const raw = value.trim();
  if (!raw) return "";

  // Already ISO — trust it, and never round-trip it through UTC (trap 2).
  if (isIsoDate(raw)) return raw;

  // A bare number is a Sheets date serial, not a year (trap 1).
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
  // Local components, not toISOString() — see trap 2.
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

/**
 * Sort comparator: newest first, with unparseable dates ranked to the bottom
 * rather than sorting on their first character against an ISO string.
 */
export function byNewestDate<T extends { date: string }>(a: T, b: T): number {
  const aIso = isIsoDate(a.date);
  if (aIso !== isIsoDate(b.date)) return aIso ? -1 : 1;
  return b.date.localeCompare(a.date);
}
