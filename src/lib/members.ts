// Server-side member lookup.
//
// IMPORTANT: This module must only ever run on the server (it is imported solely
// by the "use server" action in src/app/membership/actions.ts). The full member
// roster must NEVER be sent to the browser — callers look up a single email and
// receive only that one record.
//
// Data source: a private Google Sheet read here on the server via the Google
// Sheets API, authenticated with a service account. The sheet is shared only
// with the service account, so nothing is public. Auth is done with zero extra
// dependencies — we sign the OAuth JWT with Node's built-in `crypto`.
//
// Required environment variables (see references/membership-setup-todo.md):
//   MEMBERS_SHEET_ID                     – the spreadsheet ID from its URL
//   GOOGLE_SERVICE_ACCOUNT_EMAIL         – ...@...iam.gserviceaccount.com
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   – the PEM private key (\n-escaped is OK)
//   MEMBERS_SHEET_RANGE   (optional)     – defaults to "Members!A2:D"

import crypto from "node:crypto";

export interface MemberRecord {
  name: string;
  email: string;
  category: "Regular" | "Associate" | "Affiliate";
  standing: "Active" | "Lapsed";
}

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

// --- Small server-side caches (this module is never bundled to the client) ---
// The roster changes rarely, so we cache it briefly to avoid re-reading the
// sheet on every status check. A newly added member appears within MEMBERS_TTL.
const MEMBERS_TTL_MS = 60_000;
let membersCache: { data: MemberRecord[]; expires: number } | null = null;
let tokenCache: { token: string; expires: number } | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Exchange the service-account credentials for a short-lived OAuth access token.
async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expires > Date.now()) {
    return tokenCache.token;
  }

  const clientEmail = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  // Support keys stored with literal "\n" (common in hosting env-var UIs).
  const privateKey = requireEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(
    /\\n/g,
    "\n"
  );

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: clientEmail,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(claims)
  )}`;
  const signature = base64url(
    crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey)
  );
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Token request failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  tokenCache = {
    token: json.access_token,
    // Refresh a minute early to avoid using a token that's about to expire.
    expires: Date.now() + (json.expires_in - 60) * 1000,
  };
  return tokenCache.token;
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
  // Anything that isn't explicitly "active" is treated as lapsed (fail safe).
  return value.trim().toLowerCase() === "active" ? "Active" : "Lapsed";
}

async function loadMembers(): Promise<MemberRecord[]> {
  if (membersCache && membersCache.expires > Date.now()) {
    return membersCache.data;
  }

  const sheetId = requireEnv("MEMBERS_SHEET_ID");
  const range = process.env.MEMBERS_SHEET_RANGE ?? "Members!A2:D";
  const token = await getAccessToken();

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      sheetId
    )}/values/${encodeURIComponent(range)}` +
    "?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE";

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Sheets read failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { values?: unknown[][] };
  const rows = json.values ?? [];

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
