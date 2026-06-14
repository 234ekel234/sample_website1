// Server-side news fetcher.
//
// Reads published news items from the PMAFI News Google Sheet using the same
// service account credentials as the membership roster. The sheet must be
// shared with GOOGLE_SERVICE_ACCOUNT_EMAIL (Viewer access is enough).
//
// Required environment variables:
//   NEWS_SHEET_ID                        – spreadsheet ID from its URL
//   GOOGLE_SERVICE_ACCOUNT_EMAIL         – service account email
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   – PEM private key (\n-escaped is OK)
//
// If NEWS_SHEET_ID is not set the function returns the fallback posts so the
// page always renders even before the sheet is configured.
//
// Sheet columns (row 1 = headers, data starts at row 2):
//   A: Title  B: Excerpt  C: Category  D: Date  E: Link  F: Published (Yes/No)

import crypto from "node:crypto";

export interface NewsItem {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  link: string;
}

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const NEWS_RANGE = "News!A2:F";

let tokenCache: { token: string; expires: number } | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expires > Date.now()) return tokenCache.token;

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) throw new Error("Missing Google service account credentials");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = { iss: clientEmail, scope: SHEETS_SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signature = base64url(crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey));
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Token request failed (${res.status})`);

  const json = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { token: json.access_token, expires: Date.now() + (json.expires_in - 60) * 1000 };
  return tokenCache.token;
}

const FALLBACK: NewsItem[] = [
  {
    title: "Annual General Membership Meeting",
    excerpt: "Members gather for the yearly assembly — Foundation updates, the Board report, and fellowship among PMA alumni and supporters.",
    category: "Events",
    date: "Upcoming",
    link: "",
  },
  {
    title: "Professorial Chair & Endowment Awarding",
    excerpt: "Recognizing donors and grantees of professorial chairs and endowment funds that sustain teaching excellence at the Academy.",
    category: "Programs",
    date: "Upcoming",
    link: "",
  },
  {
    title: "Class Reunion & Homecoming Support",
    excerpt: "PMAFI partners with alumni classes on reunion activities that give back to the Corps and the cadets following in their footsteps.",
    category: "Community",
    date: "Upcoming",
    link: "",
  },
];

export async function getNews(): Promise<NewsItem[]> {
  const sheetId = process.env.NEWS_SHEET_ID;
  if (!sheetId) return FALLBACK;

  try {
    const token = await getAccessToken();
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}` +
      `/values/${encodeURIComponent(NEWS_RANGE)}?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) return FALLBACK;

    const json = (await res.json()) as { values?: unknown[][] };
    const rows = json.values ?? [];

    const items: NewsItem[] = [];
    for (const row of rows) {
      const title = String(row[0] ?? "").trim();
      const excerpt = String(row[1] ?? "").trim();
      const category = String(row[2] ?? "").trim();
      const date = String(row[3] ?? "").trim();
      const link = String(row[4] ?? "").trim();
      const published = String(row[5] ?? "").trim().toLowerCase();

      if (!title || !excerpt) continue;
      if (published !== "yes" && published !== "true") continue;

      items.push({ title, excerpt, category, date, link });
    }

    return items.length > 0 ? items : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
