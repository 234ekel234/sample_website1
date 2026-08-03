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
//   MEMBERS_SHEET_RANGE   (optional)     – defaults to "Members!A2:D"

import { readRange } from "@/lib/sheets";

export interface MemberRecord {
  name: string;
  email: string;
  category: "Regular" | "Associate" | "Affiliate";
  standing: "Active" | "Lapsed" | "Pending";
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
  // Auto-added applicants who haven't paid yet (see references/membership-autoadd.gs).
  if (v === "pending payment" || v === "pending") return "Pending";
  // Anything else (incl. blank / unrecognized) is treated as lapsed (fail safe).
  return "Lapsed";
}

async function loadMembers(): Promise<MemberRecord[]> {
  if (membersCache && membersCache.expires > Date.now()) {
    return membersCache.data;
  }

  const sheetId = requireEnv("MEMBERS_SHEET_ID");
  const range = process.env.MEMBERS_SHEET_RANGE ?? "Members!A2:D";
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
