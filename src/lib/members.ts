// Server-side member lookup.
//
// IMPORTANT: This module must only ever run on the server (it is imported solely
// by the "use server" action in src/app/membership/actions.ts). The full member
// roster must NEVER be sent to the browser — callers look up a single email and
// receive only that one record.
//
// The data is currently a MOCK list. To go live, replace `loadMembers()` with a
// Google Sheets read performed here on the server, e.g.:
//   - via the Google Sheets API using a service account (sheet shared only with
//     that account — most private), or
//   - by fetching a "publish to web" CSV URL.
// Keep any credentials/URLs in environment variables (e.g. process.env.MEMBERS_SHEET_ID)
// and never expose them to the client.

export interface MemberRecord {
  name: string;
  email: string;
  category: "Regular" | "Associate" | "Affiliate";
  standing: "Active" | "Lapsed";
}

// --- MOCK DATA (placeholder — replace with the real Google Sheet) -----------
const MOCK_MEMBERS: MemberRecord[] = [
  { name: "Juan Dela Cruz", email: "juan.delacruz@example.com", category: "Regular", standing: "Active" },
  { name: "Maria Santos", email: "maria.santos@example.com", category: "Affiliate", standing: "Active" },
  { name: "Pedro Reyes", email: "pedro.reyes@example.com", category: "Associate", standing: "Lapsed" },
];

async function loadMembers(): Promise<MemberRecord[]> {
  // TODO: swap for a server-side Google Sheets read (see file header).
  return MOCK_MEMBERS;
}

export async function checkMembership(email: string): Promise<MemberRecord | null> {
  const needle = email.trim().toLowerCase();
  if (!needle) return null;
  const members = await loadMembers();
  return members.find((m) => m.email.toLowerCase() === needle) ?? null;
}
