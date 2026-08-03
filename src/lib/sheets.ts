// Shared Google Sheets reader.
//
// Both the member roster (src/lib/members.ts) and the news feed (src/lib/news.ts)
// previously carried their own copy of the service-account JWT signing and token
// caching. This module is the single implementation they now share, along with
// the site content read by src/lib/content.ts.
//
// Auth is done with zero extra dependencies — we sign the OAuth JWT with Node's
// built-in `crypto`, exactly as before.
//
// SERVER ONLY. Never import this from a client component: it reads private
// credentials from the environment.
//
// Required environment variables:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL         – ...@...iam.gserviceaccount.com
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   – the PEM private key (\n-escaped is OK)

import crypto from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

let tokenCache: { token: string; expires: number } | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/** Exchange the service-account credentials for a short-lived OAuth access token. */
export async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expires > Date.now()) {
    return tokenCache.token;
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
  // Support keys stored with literal "\n" (common in hosting env-var UIs).
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? "").replace(
    /\\n/g,
    "\n"
  );

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google service account credentials");
  }

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

  const json = (await res.json()) as { access_token: string; expires_in: number };

  tokenCache = {
    token: json.access_token,
    // Refresh a minute early to avoid using a token that's about to expire.
    expires: Date.now() + (json.expires_in - 60) * 1000,
  };
  return tokenCache.token;
}

export interface ReadRangeOptions {
  /**
   * Seconds to cache the response for. Omit for `no-store` (always fresh) —
   * used by the membership lookup, which keeps its own short in-process cache.
   */
  revalidate?: number;
}

/**
 * Read a range from a spreadsheet and return its rows.
 *
 * Throws on missing credentials or a failed request; callers decide whether to
 * surface the error (membership check) or fall back to defaults (news, content).
 */
export async function readRange(
  sheetId: string,
  range: string,
  opts: ReadRangeOptions = {}
): Promise<unknown[][]> {
  const token = await getAccessToken();

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}` +
    `/values/${encodeURIComponent(range)}` +
    "?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE";

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    ...(opts.revalidate === undefined
      ? { cache: "no-store" as const }
      : { next: { revalidate: opts.revalidate } }),
  });

  if (!res.ok) {
    throw new Error(`Sheets read failed (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { values?: unknown[][] };
  return json.values ?? [];
}
