# PMAFI Website — Technical Status

**Live at:** https://www.pmafi.org (custom domain live; the apex 308s to `www`)
**Last verified:** 2026-08-31, against the running site and the live Google Sheets

A plain account of what works, what is built but waiting on content, and what
has not been started. Commercial and engagement matters are deliberately not in
this file — see the separate working notes.

---

## Summary

| | State |
|---|---|
| **Code** | Complete for everything currently scoped |
| **Verified end to end** | Membership lookup, digital ID gating, donation lookup, news and chairs read from the content sheet |
| **Blocked on** | Content from PMAFI — the Chairman's message above all |

**The payment blocker is cleared.** Bank and GCash details and the ₱3,000 fee
are in the content sheet and rendering on `/donate` and `/membership`, so the
site can take a gift and publish where dues go. That was the top item on this
list for months and is now done.

Nothing is blocked on development or configuration. The remaining work is
information the Foundation has not yet supplied.

`pmafi.vercel.app` now 308s to the custom domain — the warning that stood here
since August is resolved.

---

## Pages

| Route | State |
|---|---|
| `/` | ✅ hero, pillars, programs, impact, Chairman's message, news, CTA |
| `/about` | ✅ story, mission, vision, values, **Board of Trustees** (`#board`) |
| `/programs` | ✅ plus **the roll of endowed chairs**, read from the `Chairs` tab |
| `/membership` | ✅ status check by email **or name**, apply, ₱3,000 published, and the **28 classes at 100% membership** |
| `/membership/id` | ✅ digital ID generator, gated behind the membership check |
| `/donate` | ✅ **can now receive a gift** — Metrobank and GCash details published, plus a photograph of a handover with the amount redacted |
| `/donate/impact` | ✅ **2025 in counts**, above three published fund updates |
| `/donate/status` | ✅ email + reference, **verified end to end against a real gift** |
| `/contact` | ✅ |

`/board` and `/proposal` were retired; `/board` 308-redirects to `/about#board`
so existing links and rankings survive.

---

## Membership

**Pay first, apply with the receipt attached, then an admin verifies it.** The
site, the form generator, the sheet script and the admin runbook all describe
that same flow.

- The membership form's **linked responses sheet is the roster** — no separate
  sheet, no auto-add script.
- **Columns are located by header text, never by position.** A responses
  sheet's layout belongs to the form, so adding a question shifts everything
  after it.
- **A blank `Status` means Pending, not Lapsed.** Every row exists because
  somebody applied; telling them their membership had expired would be wrong.
- **Re-submissions collapse to one member, best standing wins**, so re-applying
  can never demote someone already Active.
- Two email columns per row is normal and both are matched.
- Only the mapped columns are read — phone numbers, addresses and receipt links
  stay in the sheet.

**Members staff add by hand go on their own tab.** Google Forms writes each
response to the row after the last one *it* wrote, a position it tracks itself
rather than reading off the bottom of the sheet — so rows typed into the
responses sheet sit in space the form still considers free, and each new
submission overwrites one, silently and with no undo. PMAFI lost rows this way
in August 2026. The roster is now the union of two tabs:

| Tab | Written by | ID card? |
|---|---|---|
| `Membership Applications` | The form | Yes |
| `Manual Members` | Staff, by hand. No form ever writes to it | **No** |

Both are read through the same header-based mapper, so the manual tab needs
only headers containing "name", "email", "category", "status", "pma class" and
"timestamp" — column order is its own business. A missing tab is not an error.
Template: `references/manual-members-sheet.tsv`.

**Two lookups, deliberately separate.** `/membership` accepts an email or a
name. `/membership/id`, which mints a card bearing the Foundation's seal,
accepts an **email only** — names are public, so allowing one to mint a card
would make the credential forgeable by anyone who can read.

**Manual members mint cards on the same terms as everyone else.** They briefly
could not: staff type both the name and the address on a hand-added row, so the
argument ran that nobody had shown the address belonged to the person named.
PMAFI settled it on 2026-08-31 — the address is asked of the member so they can
be reached, and is theirs. With 38 of 80 roster rows manual, the refusal locked
out nearly half the membership to close a gap it could not close anyway: the
gate proves an address is *on* the roster, never that the visitor owns it, and
that is equally true of form members. Closing it needs sign-in (Phase 3).

`MemberRecord.source` still records which tab a member came from, and a manual
member who later applies through the form is still promoted to `form`. Neither
decides access now; the promotion logic stays correct for whenever an admin view
wants to show provenance.

Tabs are named `Membership Applications` and `Donation Reports` rather than
Google's `Form Responses N`, which is positional and gets reassigned when a form
is recreated.

---

## Donations

**Give → report it → PMAFI verifies → look it up.** Every handover is a person;
nothing is automated.

- **Donation form** — no file upload, therefore **no Google account required**.
  Its job is attribution, not verification: PMAFI's own bank record is the
  proof, so nothing needs attaching.
- **`Donations` tab** — the verified log the site reads, distinct from
  `Donation Reports`, which is the unverified queue.
- **Reference codes are minted in the sheet** by a menu command, randomly. A
  running number could be counted through by anyone who knows an address. Codes
  omit `I`, `L`, `O`, `0`, `1` because they get read aloud over the phone.
- **Fund names have one canonical list** (`src/lib/funds.ts`): Professorial
  Chair Fund, Endowment Fund, General Fund. Both sheets are read through
  `canonicalFund()` so they cannot drift.
- A donor's result carries **recent updates for the funds they gave to**.
- **Give Directly** on `/donate` handles gifts needing a conversation — a chair,
  an endowment, in kind, a cheque. Works with no payment details configured.
- The emailed-summary lookup is **hidden** while `RESEND_API_KEY` is unset,
  rather than offering a control that always fails.

---

## What PMAFI edits without a developer

One spreadsheet, `PMAFI Website Content`, with five tabs. Everything falls back
to shipped content if a tab is empty or the sheet is briefly unreachable, so a
mistake shows stale content rather than an empty page. Staff guide:
`references/content-sheet-setup.md`.

| Tab | Drives | Notes |
|---|---|---|
| `Content` | Chairman's message, contact details, socials, bank and GCash, dues, finance contact, donation form link | Key/value |
| `News` | The home page's News & Announcements | Moved here 2026-08-31 from a standalone sheet that had never been shared with the service account, so the feed silently served samples for months |
| `Fund updates` | `/donate/impact` and the updates shown in a donor's own lookup | |
| `Chairs` | The roll of endowed chairs on `/programs` | One column. There is deliberately no place to put an amount |
| `Donation Photos` | The gallery on `/donate/impact` | Photos live in Drive; the tab is the index. Caption is required — it is the alt text. `Published` exists so a cheque with a name and an amount cannot reach the web by drag-and-drop |
| `FAQ` | The assistant's answer set | |

The FAQ assistant is a floating widget on every page — keyword matching with a
confidence threshold, suggested questions, and a clean hand-off to the contact
page when nothing matches. No AI, no ongoing cost. The answer set is now **33
entries**, meeting the 25–40 recommendation; what remains is PMAFI reviewing the
wording.

## Content drawn from the 2025 annual report

Three sections are built from PMAFI's own published record, in the site's
wording rather than lifted prose:

- **`/donate/impact` — "In 2025, at the Academy."** Counts only: 160 chairs,
  109 books, 21 Course Directors, 12 faculty recognised, 5 on full scholarship,
  8 sent to seminars. **No peso figures anywhere**, by decision — the report
  states all of it in money and names donors beside sums, and publishing that
  would undo both the reference-code gate on `/donate/status` and the redaction
  on the `/donate` photograph.
- **`/programs` — the roll of endowed chairs.** 161 names. **PMAFI has given
  consent to publish these (confirmed 2026-08-31).**
- **`/membership` — the 28 classes at 100% membership.**

The report itself is in `references/` and **must never be committed** — pages
12–42 are the full member roster, several thousand names with class years.

---

## Known open issues, carried deliberately

**The membership check does not verify identity.** Anyone can type any email —
or any name — and see that person's standing. The ID generator is gated on that
same check, so a card cannot assert a membership the roster never granted, but
it inherits the weakness: someone who knows a member's email can mint their
card. Closing it requires logins.

Name lookup deliberately does **not** extend to the ID generator. The two
lookups are separate server actions so the ID path has no name branch to reach.
The name path returns neither the matched address nor the class year, and is
rate-limited per client address.

**The form is no longer the only way onto the roster** — the caveat this file
carried from the start ("a member who never used the form has no row, and adding
one by hand means writing into a sheet the form also appends to") stopped being
theoretical in August 2026 and is answered by the `Manual Members` tab above.
What remains true is that a hand-typed row proves less than a submitted one,
which is why it cannot mint an ID card.

**Rate limiting is per-instance.** It runs in module memory, so on serverless it
resets on a cold start. It stops realistic abuse, not a determined attacker.

---

## Configuration

| Variable | Local | Vercel | Needed for |
|---|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | ✅ | ✅ | all sheet reads |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | ✅ | ✅ | all sheet reads |
| `MEMBERS_SHEET_ID` | ✅ | ✅ | membership check + donation lookup (same private spreadsheet) |
| `CONTENT_SHEET_ID` | ✅ | ✅ | site content, FAQ, fund updates, chairs, and now news |
| `NEWS_SHEET_ID` | ✅ | ✅ | news feed — since 2026-08-31 the **same spreadsheet as `CONTENT_SHEET_ID`**, on its `News` tab. The old standalone sheet was never shared with the service account, so the feed silently served samples. Set for Production and Preview |
| `NEXT_PUBLIC_GA_ID` | — | ✅ | Google Analytics |
| `MEMBERS_SHEET_RANGE` | — | — | optional; defaults to `Membership Applications!A1:Z` |
| `MANUAL_MEMBERS_RANGE` | — | — | optional; defaults to `Manual Members!A1:Z`. A missing tab is not an error |
| `DONATIONS_SHEET_ID` | — | — | optional; falls back to `MEMBERS_SHEET_ID` |
| `RESEND_API_KEY` | ❌ | ❌ | emailed giving summaries |

---

## Before launch

**This changed shape and is no longer a simple wipe.** `Membership Applications`
held four test records when this note was written; as of 2026-08-31 it holds
**42 rows**, so real people have applied. The four test rows must now be picked
out individually — clearing the tab would destroy genuine applications. They
currently read as Active members, and one will greet a visitor by name if the
address is guessed.

`Donations` holds **one row**. Confirm whether it is still the old test row or
the real gift before deciding what to do with it.

## Blocked on PMAFI

In the order they unblock the most. Payment details and dues, which sat at the
top of this list for months, are **done**.

1. **Chairman's message** — still the fabricated placeholder, now copied into
   the `Content` tab where it reads as though it were approved. The single most
   misleading thing on the site.
2. **`contact.email` is the wrong address.** The sheet holds
   `pmafi.web@gmail.com`, so the footer, contact page and chat widget all
   publish the Google account that owns the Forms rather than PMAFI's official
   `PMAFI_PMA@yahoo.com`. Somebody changed it in the sheet; one cell either way.
3. **News items** — one real row is live (the Board's annual visit, 15 November
   2024, dated from the welcome slide in the photograph). Two drafts wait in the
   `News` tab: the teaching-excellence awarding needs a date, and the alumni
   gift needs a decision on whether a headline may name the donor. Leaving no
   row published brings the fabricated samples back.
4. **Fund update photographs** — `/fund-chairs.jpg` and `/fund-endowment.jpg`
   show teaching-excellence certificate presentations attached to the chair and
   endowment funds. If that certificate is not a chair appointment, both belong
   to a faculty-development update instead.
5. **Phone number, social URLs** — hidden rather than invented.
6. **BIR donee status** — no page claims tax deductibility until confirmed.
7. **FAQ sign-off** — 33 answers now written; PMAFI has not reviewed the wording.
8. **Two annual-report details, both fixable in the sheet** — whether Dionardo B
   Carlos endowed two chairs or is listed twice (the report's heading says 160,
   its list runs to 161), and the odd spellings reproduced rather than guessed
   at: `Conjuangco`, `Profirio`, `Nichols A Driz`, `PBeg`. Also the class list's
   `As of31 December 226`, rendered as 31 December 2025.

---

## Not started

| Item | Notes |
|---|---|
| Member login / self-service portal | Would close the identity gap above |
| Staff admin dashboard | |
| Digital ID scan-to-verify | Needs persisted photos and a lookup endpoint |
| Full donor portal on a real database | |
| Online payments + automatic receipts | Would remove the need for the donation form entirely |
| Automated emails | The flow no longer invoices |
| Analytics event tracking + cookie notice | |
