// Staff-editable site content.
//
// Reads a key/value tab from a Google Sheet so PMAFI can change the Chairman's
// message, contact details, social links and payment details without a
// developer. This is Phase 2, Module A of the proposal.
//
// The content sheet is DELIBERATELY SEPARATE from the member roster: staff can
// be given edit access to content without ever seeing the member list.
//
// Required environment variables:
//   CONTENT_SHEET_ID                     – spreadsheet ID from its URL
//   GOOGLE_SERVICE_ACCOUNT_EMAIL         – service account email
//   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY   – PEM private key (\n-escaped is OK)
//
// Sheet layout — tab named "Content", row 1 = headers, data from row 2:
//   A: Key                B: Value
//
// Recognised keys (any missing key falls back to the value in FALLBACK below):
//   chairman.name         chairman.title        chairman.body
//   contact.email         contact.phone         contact.address
//   social.facebook        social.instagram
//   payment.bank.name     payment.bank.account_name
//   payment.bank.account_number
//   payment.gcash.name    payment.gcash.number
//
// `chairman.body` holds the whole message; separate paragraphs with a blank
// line. Everything else is a single line of plain text.
//
// FAIL-SAFE BY DESIGN: if the sheet is unreachable, a key is missing, or a cell
// is blank, the site renders the FALLBACK value rather than an empty section.
// Items PMAFI has not yet confirmed (phone, social, bank/GCash) fall back to an
// empty string, and the components that use them hide rather than invent one.

import { readRange } from "@/lib/sheets";

export interface SiteContent {
  chairman: {
    name: string;
    title: string;
    /** Paragraphs, already split. */
    body: string[];
  };
  contact: {
    email: string;
    /** Empty until PMAFI confirms — callers must hide rather than guess. */
    phone: string;
    address: string;
  };
  social: {
    /** Empty until PMAFI confirms — blank links are not rendered. */
    facebook: string;
    instagram: string;
  };
  payment: {
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    gcashName: string;
    gcashNumber: string;
  };
}

const CONTENT_RANGE = "Content!A2:B";

/**
 * Current live values. These are what the site shows today, so a broken or
 * unconfigured sheet is a no-op rather than a regression.
 */
const FALLBACK: SiteContent = {
  chairman: {
    name: "LEO ANGELO D. LEUTERIO",
    title: "Chairman, PMAFI",
    body: [
      "We cannot deny that what we are today, we owe in part to the Philippine Military Academy. The Foundation exists so that the next generation of cadets inherits an Academy even stronger than the one that shaped us.",
      "Through your membership and support, PMAFI sustains the faculty, facilities, and programs that keep the PMA a true center of academic excellence and character formation. Every contribution is an investment in the leaders who will serve and defend our nation.",
    ],
  },
  contact: {
    // Interim working inbox — real messages arrive here.
    email: "pmafi.web@gmail.com",
    // Hidden until PMAFI confirms the official number.
    phone: "",
    // Matches what the footer shows today. PMAFI has not confirmed whether the
    // official address is Fort del Pilar or the PMA Alumni Center.
    address: "Fort del Pilar, Baguio City, Philippines",
  },
  social: {
    facebook: "",
    instagram: "",
  },
  payment: {
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    gcashName: "",
    gcashNumber: "",
  },
};

function pick(map: Map<string, string>, key: string, fallback: string): string {
  const value = map.get(key)?.trim();
  return value ? value : fallback;
}

export async function getContent(): Promise<SiteContent> {
  const sheetId = process.env.CONTENT_SHEET_ID;
  if (!sheetId) return FALLBACK;

  let rows: unknown[][];
  try {
    rows = await readRange(sheetId, CONTENT_RANGE, { revalidate: 60 });
  } catch {
    // Sheet unreachable or misconfigured — show what the site shows today.
    return FALLBACK;
  }

  const map = new Map<string, string>();
  for (const row of rows) {
    const key = String(row[0] ?? "").trim();
    if (key) map.set(key, String(row[1] ?? ""));
  }

  const body = map.get("chairman.body")?.trim();

  return {
    chairman: {
      name: pick(map, "chairman.name", FALLBACK.chairman.name),
      title: pick(map, "chairman.title", FALLBACK.chairman.title),
      body: body
        ? body
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean)
        : FALLBACK.chairman.body,
    },
    contact: {
      email: pick(map, "contact.email", FALLBACK.contact.email),
      phone: pick(map, "contact.phone", FALLBACK.contact.phone),
      address: pick(map, "contact.address", FALLBACK.contact.address),
    },
    social: {
      facebook: pick(map, "social.facebook", FALLBACK.social.facebook),
      instagram: pick(map, "social.instagram", FALLBACK.social.instagram),
    },
    payment: {
      bankName: pick(map, "payment.bank.name", FALLBACK.payment.bankName),
      bankAccountName: pick(
        map,
        "payment.bank.account_name",
        FALLBACK.payment.bankAccountName
      ),
      bankAccountNumber: pick(
        map,
        "payment.bank.account_number",
        FALLBACK.payment.bankAccountNumber
      ),
      gcashName: pick(map, "payment.gcash.name", FALLBACK.payment.gcashName),
      gcashNumber: pick(map, "payment.gcash.number", FALLBACK.payment.gcashNumber),
    },
  };
}
