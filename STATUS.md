# PMAFI Website — Technical Status

**Live at:** https://www.pmafi.org (custom domain live; the apex 308s to `www`)
**Last verified:** 2026-08-16, against the running site and the live Google Sheets

A plain account of what works, what is built but waiting on content, and what
has not been started. Commercial and engagement matters are deliberately not in
this file — see the separate working notes.

> ⚠️ `pmafi.vercel.app` still answers 200 rather than redirecting. Canonical tags
> and the sitemap point at www.pmafi.org, and `next.config.ts` redirects that
> host, but it remains reachable until `www.pmafi.org` is set as the primary
> domain in Vercel.

---

## Summary

| | State |
|---|---|
| **Code** | Complete for everything currently scoped |
| **Verified end to end** | Membership lookup, digital ID gating, donation lookup |
| **Blocked on** | Content from PMAFI — payment details above all |

Nothing is blocked on development or configuration. The remaining work is
information the Foundation has not yet supplied.

---

## Pages

| Route | State |
|---|---|
| `/` | ✅ hero, pillars, programs, impact, Chairman's message, news, CTA |
| `/about` | ✅ story, mission, vision, values, **Board of Trustees** (`#board`) |
| `/programs` | ✅ |
| `/membership` | ✅ status check by email **or name**, plus apply |
| `/membership/id` | ✅ digital ID generator, gated behind the membership check |
| `/donate` | ⚠️ live but **cannot receive a gift** — no payment details published |
| `/donate/impact` | ✅ live, empty until a fund update is published |
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

**Two lookups, deliberately separate.** `/membership` accepts an email or a
name. `/membership/id`, which mints a card bearing the Foundation's seal,
accepts an **email only** — names are public, so allowing one to mint a card
would make the credential forgeable by anyone who can read.

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

## Content management and the FAQ assistant

`src/lib/content.ts` reads a key/value sheet driving the Chairman's message,
contact details, socials, bank and GCash details, membership dues, the finance
contact and the donation form link. Every value falls back to current site text
if the sheet is unreachable. Staff guide: `references/content-sheet-setup.md`.

The FAQ assistant is a floating widget on every page — keyword matching with a
confidence threshold, suggested questions, and a clean hand-off to the contact
page when nothing matches. No AI, no ongoing cost.

**Open:** the answer set is 15 entries; ~25–40 was the recommendation, and PMAFI
has not yet reviewed the wording.

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

**Everyone joins through the form, and that is a good fit here.** PMAFI has no
existing membership roster, so the responses sheet being the roster costs nothing
— there is nobody to migrate. The caveat only matters if that changes: a member
who never used the form has no row, and adding one by hand means writing into a
sheet the form also appends to.

**Rate limiting is per-instance.** It runs in module memory, so on serverless it
resets on a cold start. It stops realistic abuse, not a determined attacker.

---

## Configuration

| Variable | Local | Vercel | Needed for |
|---|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | ✅ | ✅ | all sheet reads |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | ✅ | ✅ | all sheet reads |
| `MEMBERS_SHEET_ID` | ✅ | ✅ | membership check + donation lookup (same private spreadsheet) |
| `CONTENT_SHEET_ID` | ✅ | ✅ | site content, FAQ, fund updates |
| `NEWS_SHEET_ID` | ✅ | ✅ | news feed — since 2026-08-31 the **same spreadsheet as `CONTENT_SHEET_ID`**, on its `News` tab. The old standalone sheet was never shared with the service account, so the feed silently served samples. Set for Production and Preview |
| `NEXT_PUBLIC_GA_ID` | — | ✅ | Google Analytics |
| `MEMBERS_SHEET_RANGE` | — | — | optional; defaults to `Membership Applications!A1:Z` |
| `DONATIONS_SHEET_ID` | — | — | optional; falls back to `MEMBERS_SHEET_ID` |
| `RESEND_API_KEY` | ❌ | ❌ | emailed giving summaries |

---

## Before launch

- **Clear the four test records** from `Membership Applications`. They currently
  read as Active members, and one of them will greet a visitor by name if the
  address is guessed. Nobody has joined yet, so the tab should be empty on the
  day it goes live.
- **Clear the test row** from `Donations` for the same reason.

## Blocked on PMAFI

In the order they unblock the most:

1. **Bank and GCash details** — `/donate` cannot take a gift, and `/membership`
   cannot publish dues. One complete channel is enough.
2. **Membership dues per category** — one figure plus a channel switches both
   pages over.
3. **Fund updates** — four rows exist as unpublished templates; a Title and
   Message on any one makes `/donate/impact` real and shows on donors' own
   results.
4. **Chairman's message** — currently placeholder text, not PMAFI's words.
5. **News items** — one real row is live (the Board's annual visit, 15 November
   2024, dated from the welcome slide in the photo). Two drafts sit unpublished
   in the `News` tab awaiting PMAFI: the teaching-excellence awarding needs a
   date, and the alumni gift needs a decision on naming the donor. Publishing
   any row replaces the samples; leaving none published brings them back.
6. **Phone number, social URLs** — hidden rather than invented.
7. **BIR donee status** — no page claims tax deductibility until confirmed.
8. **FAQ expansion and sign-off.**

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
