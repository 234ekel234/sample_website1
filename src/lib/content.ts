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
//   dues.regular          dues.associate        dues.affiliate
//   finance.email         finance.phone         finance.name
//   form.donation
//
// The dues values are free text, so staff control the wording as well as the
// figure — "₱2,000 / year", "₱20,000 one-time", "By arrangement" are all valid.
// They gate whether the figures are PRINTED: see hasPaymentDetails() below.
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
  /** Membership dues per category. Empty until PMAFI confirms the figures. */
  dues: {
    regular: string;
    associate: string;
    affiliate: string;
  };
  /**
   * Who a donor reaches to arrange a gift directly rather than sending it
   * themselves — establishing a chair or an endowment, giving in kind, a
   * cheque, anything needing paperwork or a conversation.
   *
   * `email` falls back to the general contact address, because a major gift
   * enquiry reaching the Foundation's ordinary inbox is a far better outcome
   * than the option being hidden. Phone and name are shown only when supplied.
   */
  finance: {
    email: string;
    phone: string;
    /** e.g. "Ask for the Treasurer". Omitted when blank. */
    name: string;
  };
  /**
   * Public link to the "Tell us about your donation" Google Form
   * (references/donation-form.gs). Blank until PMAFI creates it, and the
   * donate page then keeps asking donors to email their details instead —
   * which is what it has always done, so nothing breaks by leaving it unset.
   */
  forms: {
    donation: string;
  };
}

/**
 * Whether the site may PRINT the dues and account details.
 *
 * This no longer gates the join flow — that is pay-first regardless, because
 * the ordering is PMAFI's decision and the application form already states it.
 * A site that disagreed with the form would be worse than one missing figures.
 *
 * What it still gates is publishing numbers. Both halves are required and
 * neither can be guessed: an amount without a destination, or a destination
 * without an amount, invites someone to send money into the void. When this is
 * false the page tells applicants to ask for the figures instead of inventing
 * them, which keeps the same flow honest with less information.
 */
export function hasPaymentDetails(content: SiteContent): boolean {
  const hasDues = Boolean(
    content.dues.regular || content.dues.associate || content.dues.affiliate
  );
  const hasBank = Boolean(
    content.payment.bankName && content.payment.bankAccountNumber
  );
  const hasGcash = Boolean(
    content.payment.gcashName && content.payment.gcashNumber
  );
  return hasDues && (hasBank || hasGcash);
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
  // Unset until PMAFI confirms the figures. While these are blank the join
  // flow is unchanged — the page just asks applicants to request the amounts
  // rather than printing them. See hasPaymentDetails above.
  dues: {
    regular: "",
    associate: "",
    affiliate: "",
  },
  // No dedicated finance contact has been supplied. The donate page falls back
  // to contact.email rather than hiding the option — see SiteContent above.
  finance: {
    email: "",
    phone: "",
    name: "",
  },
  forms: {
    donation: "",
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
    dues: {
      regular: pick(map, "dues.regular", FALLBACK.dues.regular),
      associate: pick(map, "dues.associate", FALLBACK.dues.associate),
      affiliate: pick(map, "dues.affiliate", FALLBACK.dues.affiliate),
    },
    finance: {
      email: pick(map, "finance.email", FALLBACK.finance.email),
      phone: pick(map, "finance.phone", FALLBACK.finance.phone),
      name: pick(map, "finance.name", FALLBACK.finance.name),
    },
    forms: {
      donation: pick(map, "form.donation", FALLBACK.forms.donation),
    },
  };
}
