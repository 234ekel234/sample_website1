// FAQ assistant answer set.
//
// This is Phase 2, Module B of the proposal: a rules-based assistant that
// answers ONLY from a fixed list PMAFI has approved. There is no AI and no
// generation, so it can never invent or misstate a fact about the Foundation.
//
// The list is staff-editable. It lives on an "FAQ" tab in the same spreadsheet
// as the site content (CONTENT_SHEET_ID), so PMAFI can add, reword or remove
// answers without a developer.
//
// Sheet layout — tab named "FAQ", row 1 = headers, data from row 2:
//   A: Question   B: Answer   C: Keywords   D: Link label   E: Link URL
//   F: Suggested (Yes/No)     G: Published (Yes/No)
//
// Keywords are comma-separated extra terms to match on, beyond the words in the
// question itself. "Suggested" entries appear as tappable starter chips.
//
// FAIL-SAFE: if the sheet is unreachable or empty, the built-in FALLBACK set
// below is used, so the assistant always works.
//
// DELIBERATELY ABSENT: nothing here states a phone number, bank account, GCash
// number, dues amount or BIR status. Those are unconfirmed, so the answers point
// to the contact channel instead of guessing.

import { readRange } from "@/lib/sheets";

export interface FaqEntry {
  question: string;
  answer: string;
  /** Extra terms to match on, beyond the words in `question`. */
  keywords: string[];
  /** Optional call to action shown beneath the answer. */
  linkLabel?: string;
  linkHref?: string;
  /** Shown as a starter chip when the panel opens. */
  suggested?: boolean;
}

const FAQ_RANGE = "FAQ!A2:G";

/**
 * Built-in answer set. Every statement here is drawn from existing site copy —
 * nothing is invented. Keep it that way when editing.
 */
const FALLBACK: FaqEntry[] = [
  // --- Membership -----------------------------------------------------------
  {
    question: "How do I become a member?",
    answer:
      "Settle the membership fee first, then apply online with your proof of payment attached — everything arrives in one submission, so there is no invoice to wait for. Your application is recorded straight away while the Foundation verifies your payment.",
    keywords: ["join", "apply", "application", "sign up", "register", "membership"],
    linkLabel: "Apply for membership",
    linkHref: "/membership",
    suggested: true,
  },
  {
    question: "What membership categories are there?",
    answer:
      "PMAFI has three categories: Regular, Associate and Affiliate. The membership page explains who each one is intended for.",
    keywords: ["category", "categories", "regular", "associate", "affiliate", "type"],
    linkLabel: "See the categories",
    linkHref: "/membership",
  },
  {
    question: "How much is the membership fee?",
    answer:
      "The current fee and where to send it are published on the membership page. It is a one-time payment — there is no annual renewal.",
    // Deliberately does NOT restate the figure. It lives in the content sheet
    // and renders on /membership; repeating it here would give staff two places
    // to update and one to forget.
    keywords: ["dues", "fee", "cost", "how much", "price", "payment", "annual", "renew"],
    linkLabel: "See the membership fee",
    linkHref: "/membership#dues",
  },
  {
    question: "How do I check my membership status?",
    answer:
      "Look yourself up on the membership page by email, or by name if you are not sure which address the Foundation has on file. It shows your current standing — Active, being verified, or Lapsed. Your details stay private; only your own record is ever shown.",
    keywords: ["status", "standing", "active", "lapsed", "pending", "check", "verify"],
    linkLabel: "Check your status",
    // Straight to the form. Answering "how do I check my status" and then
    // landing the visitor at the top of the page leaves them to find it.
    linkHref: "/membership#check",
    suggested: true,
  },
  {
    question: "Can I get a membership ID card?",
    answer:
      // NO QR CODE. The card carries none, and DigitalIdGenerator deliberately
      // makes no scan-to-verify claim because nothing on the site could answer
      // a scan yet — that needs persisted cards and a lookup endpoint (Phase 3,
      // Module A). Promising one here sent members looking for a square that
      // isn't on their card.
      "Yes. Members can generate a digital PMAFI ID card carrying their name, category, standing and photo, then download it as an image. The card is created in your own browser and your photo is never uploaded or stored.",
    keywords: ["id", "card", "identification", "digital id", "badge", "photo"],
    linkLabel: "Create your ID",
    linkHref: "/membership/id",
  },

  // --- Giving ---------------------------------------------------------------
  {
    question: "How can I support PMAFI?",
    answer:
      "There are several ways to get involved: make a one-time or recurring donation, become a member, endow a professorial chair, or partner with the Foundation on a specific program.",
    keywords: ["support", "help", "contribute", "get involved", "volunteer"],
    linkLabel: "Ways to give",
    linkHref: "/donate",
    suggested: true,
  },
  {
    question: "Where does my donation go?",
    answer:
      "Contributions are channeled into the Foundation's core program areas — facilities and modernization, academic excellence and endowment, leadership formation, and partnerships with the alumni community.",
    keywords: ["donation", "where", "spent", "used", "funds", "money", "goes"],
    linkLabel: "See our programs",
    linkHref: "/programs",
  },
  {
    question: "How do I make a donation?",
    answer:
      "The Donate page explains the ways to give and the steps involved. Payment details are confirmed directly by the Foundation, so please message us and we will send you the current channels and arrange your gift.",
    keywords: ["donate", "give", "gift", "bank", "gcash", "transfer", "how to pay"],
    linkLabel: "Go to the Donate page",
    linkHref: "/donate",
  },
  {
    question: "What is a professorial chair?",
    answer:
      "A professorial chair is an endowment that supports teaching at the Academy in a named subject area. It is one of the Foundation's strategic program areas, and donors can be recognized in the naming of the chair they support.",
    keywords: ["professorial", "chair", "endowment", "endow", "named", "faculty"],
    linkLabel: "About our programs",
    linkHref: "/programs",
  },
  {
    question: "Are donations tax-deductible?",
    answer:
      // Same answer as the contact page's FAQ, and it must stay that way: this
      // one used to send the donor to the Foundation for a tax position PMAFI
      // cannot give while its donee-institution status is still being updated.
      "PMAFI is a registered non-stock, non-profit foundation, and every gift is acknowledged. Its donee-institution status with the BIR is currently being updated, so the site makes no claim about deductibility — for your own situation, please consult your accountant or tax adviser.",
    keywords: ["tax", "deductible", "bir", "receipt", "donee", "exemption"],
    linkLabel: "Ask about receipts",
    linkHref: "/contact",
  },

  // --- The Foundation -------------------------------------------------------
  {
    question: "What is PMAFI?",
    answer:
      "The Philippine Military Academy Foundation, Inc. is a non-stock, non-profit foundation that supports the Philippine Military Academy — helping it improve the quality of its instruction, its pursuit of academic excellence, and the character development of its cadets.",
    keywords: ["pmafi", "who", "what is", "foundation", "about", "mission"],
    linkLabel: "About the Foundation",
    linkHref: "/about",
    suggested: true,
  },
  {
    question: "Who is on the Board of Trustees?",
    answer:
      "The Board of Trustees page lists the 2025–2026 board, with each member's role and background.",
    keywords: ["board", "trustees", "leadership", "officers", "chairman", "who runs"],
    linkLabel: "Meet the Board",
    linkHref: "/about#board",
  },
  {
    question: "What programs does the Foundation support?",
    answer:
      "The Foundation works across four strategic areas: facilities and modernization, academic excellence and endowment, leadership formation, and partnerships with the alumni community.",
    keywords: ["programs", "projects", "areas", "work", "activities", "initiatives"],
    linkLabel: "Explore the programs",
    linkHref: "/programs",
  },
  {
    question: "How can I contact the Foundation?",
    answer:
      "The Contact page has the Foundation's current details, and messages are acknowledged by the next business day.",
    keywords: ["contact", "email", "reach", "phone", "call", "message", "talk"],
    linkLabel: "Contact us",
    linkHref: "/contact",
  },
  {
    question: "Is my information kept private?",
    answer:
      "Yes. The member roster is held privately and is never published on the website. When you check your status, only your own record is shown, and the digital ID card is generated in your browser without your photo being uploaded.",
    keywords: ["privacy", "private", "data", "secure", "security", "confidential"],
  },
  // --- Membership, in more detail ---------------------------------------
  {
    question: "Who can become a Regular or Associate member?",
    answer:
      "Both categories are open to alumni, faculty and staff of the Philippine Military Academy. Regular members take an active role in the Foundation's mission; Associate members support its programs and objectives alongside them.",
    keywords: ["eligible", "eligibility", "who can join", "qualify", "regular", "associate", "alumni", "faculty"],
    linkLabel: "See the categories",
    linkHref: "/membership",
  },
  {
    question: "Who can become an Affiliate member?",
    answer:
      "Affiliate membership is open to selected individuals and organizations who share PMAFI's values and support its vision, mission and objectives. You do not need to be a PMA graduate.",
    keywords: ["affiliate", "organization", "company", "not alumni", "partner"],
    linkLabel: "See the categories",
    linkHref: "/membership",
  },
  {
    question: "What are the benefits of membership?",
    answer:
      "Members invest directly in the Academy, join a nationwide community of alumni and supporters, receive regular updates on programs and milestones, and are invited to PMAFI events. Regular members also vote in the election of the Board of Trustees.",
    keywords: ["benefits", "perks", "why join", "advantages", "what do i get"],
    linkLabel: "See member benefits",
    linkHref: "/membership",
  },
  {
    question: "What happens after I submit my application?",
    answer:
      // PAY-FIRST, which is what the application form itself says. This answer
      // described the retired apply-first flow and told applicants to wait for
      // an invoice that is never sent — so they waited instead of paying, and
      // their row sat Pending. See DuesPayment.tsx and the "Pending Payment"
      // note in members.ts for the two labels this ordering left behind.
      "Membership is pay-first: you settle the membership fee and attach your proof of payment to the application form. The Foundation then verifies the payment and confirms your category, and your membership is activated once that check is done — until then your status shows as being verified.",
    keywords: ["after applying", "next steps", "process", "what happens", "approval", "review"],
    linkLabel: "See how to join",
    linkHref: "/membership",
  },
  {
    question: "Can I vote in PMAFI elections?",
    answer:
      "Regular members vote in the election of the Board of Trustees, giving them a direct say in how the Foundation is governed and where its resources go.",
    keywords: ["vote", "voting", "election", "elect", "governance", "trustees"],
    linkLabel: "About membership",
    linkHref: "/membership",
  },

  // --- Giving, in more detail --------------------------------------------
  {
    question: "What is an endowment fund?",
    answer:
      "An endowment is a lasting fund whose principal is never spent. Only the annual earnings are used, so the gift continues to sustain PMA programs and academic excellence year after year. Endowments start from \u20b1100,000.",
    keywords: ["endowment", "perpetuity", "lasting", "principal", "fund"],
    linkLabel: "Ways to give",
    linkHref: "/donate",
  },
  {
    question: "How much do I need to establish a professorial chair?",
    answer:
      "A professorial chair may be established from \u20b1250,000. The principal is preserved and only the earnings fund the grant, so the chair continues in your name or your class's honor.",
    keywords: ["professorial chair", "how much", "minimum", "establish", "cost"],
    linkLabel: "Ways to give",
    linkHref: "/donate",
  },
  {
    question: "Can I choose what my donation supports?",
    answer:
      "Yes. You can establish a professorial chair or an endowment fund in your name, or give an unrestricted gift that PMAFI directs to its most pressing needs \u2014 faculty development, facilities, scholarships and cadet programs.",
    keywords: ["designate", "choose", "specific", "restricted", "unrestricted", "earmark"],
    linkLabel: "Ways to give",
    linkHref: "/donate",
  },
  {
    question: "How will I know my donation was received?",
    answer:
      "After sending your donation, email your name, contact details and proof of payment to the Foundation. You will then receive an official acknowledgment and receipt.",
    keywords: ["confirm", "receipt", "acknowledgment", "proof", "received", "confirmation"],
    linkLabel: "How to give",
    linkHref: "/donate",
  },
  {
    question: "How can I check a donation I have already made?",
    answer:
      "Use the My Donations page. Enter the email address you gave under together with the reference code from your acknowledgment, and you will see each of your gifts \u2014 the amount, the date, what it was designated for, and where it stands in our process.",
    keywords: ["check donation", "my donations", "track", "look up", "history", "reference"],
    linkLabel: "View my donations",
    linkHref: "/donate/status",
    suggested: true,
  },
  {
    question: "Why is my donation not showing in My Donations?",
    answer:
      "Donations are listed once our team has verified the transfer and recorded it, so a very recent donation may not appear yet. Please also check that the email address and reference match your acknowledgment exactly. If something still looks wrong, get in touch and we will look it up for you.",
    keywords: ["not showing", "missing", "cannot find", "no record", "problem"],
    linkLabel: "Contact us",
    linkHref: "/contact",
  },

  // --- Digital member ID --------------------------------------------------
  {
    question: "How do I create my digital member ID?",
    answer:
      "Go to the digital ID page, enter your name and membership category, and add a photo. The card is generated instantly and you can download it to keep on your phone.",
    keywords: ["id card", "digital id", "create id", "member id", "card", "download"],
    linkLabel: "Create my ID",
    linkHref: "/membership/id",
    suggested: true,
  },
  {
    question: "Is my photo uploaded when I create an ID?",
    answer:
      "No. The card is put together entirely in your browser \u2014 your photo is never uploaded to us and is not stored anywhere.",
    keywords: ["photo", "upload", "stored", "picture", "image"],
    linkLabel: "Create my ID",
    linkHref: "/membership/id",
  },

  // --- About the Foundation ------------------------------------------------
  {
    question: "Is PMAFI part of the Philippine Military Academy or the AFP?",
    answer:
      "No. PMAFI is an independent non-stock, non-profit foundation that supports the Academy. This is not an official website of the Philippine Military Academy or the Armed Forces of the Philippines.",
    keywords: ["official", "part of", "afp", "government", "independent", "affiliated"],
    linkLabel: "About PMAFI",
    linkHref: "/about",
  },
  {
    question: "What does PMAFI stand for?",
    answer:
      "PMAFI is the Philippine Military Academy Foundation, Inc. \u2014 a non-stock, non-profit foundation supporting the PMA in developing officers of integrity, competence and character.",
    keywords: ["stand for", "acronym", "abbreviation", "full name", "meaning"],
    linkLabel: "About PMAFI",
    linkHref: "/about",
  },
];

function parseKeywords(raw: string): string[] {
  return raw
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
}

function isYes(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return v === "yes" || v === "true";
}

export async function getFaqs(): Promise<FaqEntry[]> {
  const sheetId = process.env.CONTENT_SHEET_ID;
  if (!sheetId) return FALLBACK;

  let rows: unknown[][];
  try {
    rows = await readRange(sheetId, FAQ_RANGE, { revalidate: 60 });
  } catch {
    // Sheet or tab missing — the built-in set keeps the assistant working.
    return FALLBACK;
  }

  const entries: FaqEntry[] = [];
  for (const row of rows) {
    const question = String(row[0] ?? "").trim();
    const answer = String(row[1] ?? "").trim();
    if (!question || !answer) continue;

    // Blank "Published" is treated as published, so staff do not have to fill
    // in every column just to add an answer.
    const publishedCell = String(row[6] ?? "").trim();
    if (publishedCell && !isYes(publishedCell)) continue;

    const linkLabel = String(row[3] ?? "").trim();
    const linkHref = String(row[4] ?? "").trim();

    entries.push({
      question,
      answer,
      keywords: parseKeywords(String(row[2] ?? "")),
      ...(linkLabel && linkHref ? { linkLabel, linkHref } : {}),
      suggested: isYes(String(row[5] ?? "")),
    });
  }

  return entries.length > 0 ? entries : FALLBACK;
}
