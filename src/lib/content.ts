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
//   president.name        president.title       president.body
//   contact.email         contact.phone         contact.address
//   social.facebook        social.instagram
//   payment.bank.name     payment.bank.account_name
//   payment.bank.account_number
//   payment.gcash.name    payment.gcash.number
//   dues.regular          dues.associate        dues.affiliate
//   finance.email         finance.phone         finance.name
//   form.donation         form.correction       form.contact
//
// The dues values are free text, so staff control the wording as well as the
// figure — "₱2,000 / year", "₱20,000 one-time", "By arrangement" are all valid.
// They gate whether the figures are PRINTED: see hasPaymentDetails() below.
//
// `chairman.body` and `president.body` each hold a whole message; separate
// paragraphs with a blank line. Everything else is a single line of plain text.
//
// FAIL-SAFE BY DESIGN: if the sheet is unreachable, a key is missing, or a cell
// is blank, the site renders the FALLBACK value rather than an empty section.
// Items PMAFI has not yet confirmed (phone, social, bank/GCash) fall back to an
// empty string, and the components that use them hide rather than invent one.

import { readRange } from "@/lib/sheets";

/**
 * A signed message on the home page: who is speaking, their office, and what
 * they say.
 *
 * There are two of these and the shape is shared because nothing about a
 * message depends on WHICH office signs it — the heading, the portrait and the
 * byline are all derived from `name` and `title` (see LeadershipMessage.tsx).
 * Adding a third officer later is a key prefix and a fallback, not new markup.
 */
export interface LeadershipMessage {
  name: string;
  title: string;
  /** Paragraphs, already split. */
  body: string[];
}

export interface SiteContent {
  /**
   * THE KEY PREFIXES ARE OFFICES, THE FIELDS ARE SLOTS. `chairman` is the
   * first message on the page and `president` the second; each carries
   * whoever its sheet rows name, which need not be the office in the field
   * name — the prefixes are the content sheet's contract (column A is matched
   * by exact string) and renaming one detaches the section from the cells
   * staff edit. See ChairmansMessage's history: it carried the President's
   * message for a week under the chairman.* keys and nothing had to change.
   */
  chairman: LeadershipMessage;
  president: LeadershipMessage;
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
  forms: {
    /**
     * Public link to the "Tell us about your donation" Google Form
     * (references/donation-form.gs). Blank until PMAFI creates it, and the
     * donate page then keeps asking donors to email their details instead —
     * which is what it has always done, so nothing breaks by leaving it unset.
     */
    donation: string;
    /**
     * Public link to the "Correct my membership record" Google Form
     * (references/correction-form.gs).
     *
     * The digital ID prints the roster's spelling of a member's name and does
     * not let them edit it — an editable name is the forgeable credential the
     * gate exists to prevent. So the fix has to be a request to staff, and
     * this is where it goes. Blank hides the control entirely rather than
     * rendering a dead link, the same way `donation` does.
     */
    correction: string;
    /**
     * Public link to the "Update my contact details" Google Form
     * (references/contact-update-form.gs), where a member gives PMAFI a
     * current email address and mobile number.
     *
     * A FORM RATHER THAN A FIELD, for the same reason as `correction`: the
     * site's service account is `spreadsheets.readonly` and must stay that
     * way. This key may hold either a plain form link or a PREFILL TEMPLATE
     * carrying `PMAFI_EMAIL_HERE`, which the ID page substitutes with the
     * address the member already gave the gate — see lib/form-prefill.ts. Both
     * work; the template just saves them typing it twice, and a mistyped
     * address here is a contact update staff cannot match to a member.
     *
     * Blank hides the prompt entirely, as the other two do.
     */
    contact: string;
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
  // BOTH MESSAGES ARE STILL PLACEHOLDER WORDING — PMAFI has supplied neither.
  // They are written to say DIFFERENT things, because two messages that both
  // restate the Foundation's purpose read as one message printed twice: the
  // Chairman welcomes and points at what a visitor can do here, the President
  // covers the work itself and how it is accounted for. Whoever replaces them
  // should keep that division rather than let both drift onto the same ground.
  //
  // Neither names a figure, on purpose: dues and fund minimums are printed only
  // where hasPaymentDetails() allows it, and free text in the sheet would walk
  // straight around that gate.
  //
  // Each name must stay spelled as board-data.ts spells it. Portrait and
  // heading both derive from the name and title, and a name that fails to match
  // renders NO photo rather than the wrong one — correct, but silent.
  chairman: {
    // PMAFI's Chairman carries the first message. It was the President's
    // between 2026-08-27 and 2026-09-03, under these same chairman.* keys —
    // see the note on SiteContent above.
    name: "Leo Angelo D. Leuterio",
    title: "Chairman, PMAFI",
    body: [
      "We cannot deny that what we are today, we owe in part to the Philippine Military Academy. The Foundation exists so that the next generation of cadets inherits an Academy even stronger than the one that shaped us.",
      "This site is how that work now reaches you. Apply for membership, check your standing at any time against our records, and download your own digital member ID. Give to a professorial chair or to the endowment, and follow what your gift has funded — all of it here, whenever it suits you.",
      "Whether you are an alumnus, a member of the faculty, or a friend of the Academy, begin here. Every membership taken up and every gift recorded on this site is an investment in the leaders who will serve and defend our nation.",
    ],
  },
  president: {
    // "President, PMAFI" rather than the full board-data role, which reads
    // "President & Chairman, Executive Committee". The heading is derived from
    // the text before the first comma, so the fuller title would render as
    // "Message from the President & Chairman" directly beneath the actual
    // Chairman's message. The portrait is resolved from the NAME, so shortening
    // the title here costs nothing.
    name: "Bartolome Vicente O. Bacarro",
    title: "President, PMAFI",
    body: [
      "The Academy's needs are specific, and so is our work. The Foundation funds professorial chairs so that cadets are taught by the best minds we can bring to Fort del Pilar, supports faculty pursuing doctorates, and helps meet the facility and modernisation needs that a modern officer corps is trained in.",
      "None of it happens without the alumni, families and friends who fund it, and none of it should happen unaccounted for. Every gift is designated to a fund and recorded, and this site lets a donor see for themselves what that fund has since paid for.",
      "That accountability is the promise behind every peso entrusted to us. If you have given before, thank you — and if you are considering it, look at the programmes we support and judge us by them.",
    ],
  },
  contact: {
    // PMAFI's official address, confirmed 2026-08-17. This is the FALLBACK, so
    // it is what renders if the content sheet is ever unreachable — it should
    // match what the sheet says rather than lagging behind it.
    //
    // NOT the same as pmafi.web@gmail.com, which owns the Google Forms and the
    // spreadsheets. That account stays as it is; a Yahoo address cannot own a
    // Google Form.
    email: "PMAFI_PMA@yahoo.com",
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
  // Confirmed by PMAFI. These are the FALLBACK, so they are what renders if the
  // content sheet is ever unreachable — and, for the keys the sheet leaves
  // blank, what renders today.
  //
  // THE ACCOUNT NUMBER KEEPS ITS HYPHENS ON PURPOSE. It is Metrobank's own
  // formatting, it is easier to copy onto a deposit slip without transposing a
  // digit, and punctuation is the one thing Google Sheets cannot read as a
  // number — so a staff member pasting this form of it into the sheet cannot
  // lose the leading zero the way the current cell already has.
  payment: {
    bankName: "Metrobank",
    bankAccountName: "PMA Foundation Inc or PMAFI",
    bankAccountNumber: "022-3-002800705",
    gcashName: "Maribel Galano",
    gcashNumber: "09173270229",
  },
  // ₱3,000 one-time for every category, confirmed 2026-08-17. Free text, so the
  // wording is PMAFI's too — and DuesPayment collapses three identical figures
  // into a single "All categories" line rather than printing the same number
  // three times, which reads as a mistake.
  dues: {
    regular: "₱3,000 one-time",
    associate: "₱3,000 one-time",
    affiliate: "₱3,000 one-time",
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
    correction: "",
    contact: "",
  },
};

function pick(map: Map<string, string>, key: string, fallback: string): string {
  const value = map.get(key)?.trim();
  return value ? value : fallback;
}

/**
 * Read one signed message from `<prefix>.name` / `.title` / `.body`.
 *
 * The three keys are picked INDEPENDENTLY, each against its own fallback,
 * which is what lets staff correct a title without retyping the message. The
 * body is the only multi-line value in the sheet: paragraphs are separated by
 * a blank line, and a body that is blank or whitespace falls back whole rather
 * than rendering an empty message under a real byline.
 */
function pickMessage(
  map: Map<string, string>,
  prefix: string,
  fallback: LeadershipMessage
): LeadershipMessage {
  const body = map.get(`${prefix}.body`)?.trim();
  const paragraphs = body
    ? body
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return {
    name: pick(map, `${prefix}.name`, fallback.name),
    title: pick(map, `${prefix}.title`, fallback.title),
    body: paragraphs.length > 0 ? paragraphs : fallback.body,
  };
}

/**
 * Keys whose value is an IDENTIFIER made of digits, never a quantity.
 *
 * A leading zero is significant in every one of them — Philippine mobile
 * numbers all begin 09, and the Metrobank account begins 022 — and this is
 * exactly where Sheets will silently destroy it. `readRange` asks for
 * UNFORMATTED_VALUE, so a cell Sheets decided was numeric arrives as a JSON
 * number, and 0223002800705 becomes 223002800705 with nothing anywhere to say
 * so. It reached the live /donate page that way once already; staff could not
 * see it either, because the cell displays truncated to them too.
 *
 * The cure is a plain-text cell (or a value with punctuation in it, like
 * "022-3-002800705", which Sheets cannot read as a number). This warning is how
 * anybody finds out that it is needed.
 */
const DIGIT_IDENTIFIER_KEYS = new Set([
  "payment.bank.account_number",
  "payment.gcash.number",
  "contact.phone",
]);

const digitsOf = (value: string) => value.replace(/\D/g, "");

/**
 * Read a digit identifier, restoring leading zeros Sheets has already eaten.
 *
 * The sheet normally wins over FALLBACK, and it still does here — with one
 * exception. When the sheet's digits are the tail of the confirmed value and
 * shorter, the only thing that can have happened is a numeric cell dropping
 * leading zeros: 0223002800705 stored as a number is 223002800705. That is not
 * PMAFI changing the account, it is Sheets corrupting it, and publishing it
 * sends a member's money to a stranger.
 *
 * A GENUINE CHANGE STILL WINS. Different digits do not tail-match, so the day
 * PMAFI moves banks the sheet overrides this without a deploy — which is the
 * whole reason these details live in a sheet. And once the cell is reformatted
 * as text the digits match exactly, this stops firing, and the sheet is simply
 * authoritative again. It is self-healing, not a permanent override.
 */
const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

/**
 * Read a money value, giving a bare number its currency back.
 *
 * These cells are free text so that staff control the wording as well as the
 * figure — "₱3,000 one-time", "By arrangement" and "₱2,000 / year" are all
 * meant to work. But the natural thing to type into a spreadsheet is 3000, and
 * Sheets stores that as a number, so the fee rendered as "3000" next to a bank
 * account and a GCash number: unmistakably a quantity, with nothing to say of
 * what.
 *
 * Typing ₱3,000 is NOT a reliable fix, which is why this is handled here. In a
 * Philippine-locale spreadsheet Sheets recognises the peso sign, parses the
 * cell back into the number 3000 and merely *formats* it as currency — and
 * readRange asks for UNFORMATTED_VALUE, so we would receive 3000 again with the
 * sign discarded. The same trap as the account number, one column over.
 *
 * So a numeric cell is formatted; anything typed as text passes through
 * untouched, and staff who want "₱3,000 one-time" still get exactly that.
 */
function pickMoney(
  map: Map<string, string>,
  numeric: Set<string>,
  key: string,
  fallback: string
): string {
  const raw = map.get(key)?.trim();
  if (!raw) return fallback;
  if (!numeric.has(key)) return raw;

  // A numeric ZERO is not a fee of nothing, it is an empty cell that happens to
  // hold a 0 — a cleared figure, a formula with no input. Formatting it gave
  // "₱0", and because that string is truthy hasPaymentDetails() went on to
  // publish the whole payment block: a membership fee of zero pesos printed
  // above a real bank account. Fall back instead, which is the same thing a
  // blank cell does.
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount <= 0) return fallback;
  return peso.format(amount);
}

function pickIdentifier(
  map: Map<string, string>,
  key: string,
  fallback: string
): string {
  const raw = map.get(key)?.trim();
  if (!raw) return fallback;
  if (!fallback) return raw;

  const fromSheet = digitsOf(raw);
  const confirmed = digitsOf(fallback);
  if (
    // A cell with NO digits at all is not a truncated number, it is staff
    // writing something — "TBA", "ask us", "closing this account". Without this
    // guard `confirmed.endsWith("")` is true for every one of them, so any note
    // typed here was silently replaced by the hardcoded account number. That is
    // the sheet losing to code on the one value where the sheet must win: it
    // would keep publishing an old account after PMAFI had tried to take it
    // down.
    fromSheet.length > 0 &&
    fromSheet !== confirmed &&
    confirmed.length > fromSheet.length &&
    confirmed.endsWith(fromSheet)
  ) {
    console.warn(
      `[content] "${key}" reads ${raw} in the sheet but the confirmed value is ` +
        `${fallback} — the leading zero has been stripped by a numeric cell. ` +
        "Publishing the confirmed value. Format that cell as plain text and " +
        "retype it to make the sheet authoritative again."
    );
    return fallback;
  }
  return raw;
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
  /** Keys whose cell was numeric — the sheet's formatting is lost by here. */
  const numeric = new Set<string>();
  for (const row of rows) {
    const key = String(row[0] ?? "").trim();
    if (!key) continue;
    const raw = row[1];
    if (typeof raw === "number") numeric.add(key);
    // Warn, but still publish. Whether a leading zero was lost is not knowable
    // from here — a numeric cell that never had one looks identical — so
    // blanking the value would hide a correct account number as readily as a
    // truncated one, and a donate page with no account details is its own
    // failure. Say so loudly instead and let a human check the cell.
    if (typeof raw === "number" && DIGIT_IDENTIFIER_KEYS.has(key)) {
      console.warn(
        `[content] "${key}" arrived as a number (${raw}), so its cell is ` +
          "numeric-formatted and any leading zero has already been stripped — " +
          "0223002800705 would reach the site as 223002800705. Format that " +
          "cell as plain text and retype the value in full. Publishing it as-is."
      );
    }
    map.set(key, String(raw ?? ""));
  }

  return {
    chairman: pickMessage(map, "chairman", FALLBACK.chairman),
    president: pickMessage(map, "president", FALLBACK.president),
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
      bankAccountNumber: pickIdentifier(
        map,
        "payment.bank.account_number",
        FALLBACK.payment.bankAccountNumber
      ),
      gcashName: pick(map, "payment.gcash.name", FALLBACK.payment.gcashName),
      gcashNumber: pickIdentifier(
        map,
        "payment.gcash.number",
        FALLBACK.payment.gcashNumber
      ),
    },
    dues: {
      regular: pickMoney(map, numeric, "dues.regular", FALLBACK.dues.regular),
      associate: pickMoney(map, numeric, "dues.associate", FALLBACK.dues.associate),
      affiliate: pickMoney(map, numeric, "dues.affiliate", FALLBACK.dues.affiliate),
    },
    finance: {
      email: pick(map, "finance.email", FALLBACK.finance.email),
      phone: pick(map, "finance.phone", FALLBACK.finance.phone),
      name: pick(map, "finance.name", FALLBACK.finance.name),
    },
    forms: {
      donation: pick(map, "form.donation", FALLBACK.forms.donation),
      correction: pick(map, "form.correction", FALLBACK.forms.correction),
      contact: pick(map, "form.contact", FALLBACK.forms.contact),
    },
  };
}
