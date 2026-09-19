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
| **Verified end to end** | Membership lookup, digital ID gating, donation lookup, news and chairs read from the content sheet, **the analytics consent gate** |
| **Blocked on** | Content from PMAFI — the Chairman's and President's messages above all |

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
| `/` | ✅ hero, pillars, programs, impact, **the Chairman's and President's messages**, news, **PMAFI's adopted Mission and Vision**, **a six-photo "Foundation at Work" band**, CTA |
| `/about` | ✅ story, mission, vision, values, **Board of Trustees** (`#board`) |
| `/programs` | ✅ plus **the roll of endowed chairs**, read from the `Chairs` tab |
| `/membership` | ✅ status check by email **or name**, apply, ₱3,000 published, and the **28 classes at 100% membership** |
| `/membership/id` | ✅ digital ID generator, gated behind the membership check — **by name or by email, name first** — plus prompts to correct a name or update contact details |
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
- **On a standing tie the `Manual Members` row wins, and only then the newer
  row.** The manual tab is the curated one — staff type a row there to fix a
  category, a class year or a spelling the form recorded wrongly — and the old
  newest-wins rule discarded that correction by accident of date. The limit is
  firm: source breaks a tie, it never beats standing, so a stale hand-typed
  `Lapsed` cannot overwrite a live `Active`.
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
| `Manual Members` | Staff, by hand. No form ever writes to it | Yes |

Both are read through the same header-based mapper, so the manual tab needs
only headers containing "name", "email", "category", "status", "pma class" and
"timestamp" — column order is its own business. A missing tab is not an error.
Template: `references/manual-members-sheet.tsv`.

**A card can be had from a name, and the name tab is the one that opens.**
`/membership/id` accepts a full name or an email; `/membership` accepts either
too. This ran behind `DEMO_ID_BY_NAME` on a preview deployment until PMAFI
settled it on 2026-09-19. The reasoning: most of this roster cannot say which
address the Foundation holds for them, and about half of it was typed in by
staff, so leading with the email shut out exactly the members least able to
guess it.

What that accepts is real and was accepted knowingly. Names are public — alumni
lists, reunion programmes, this site's own board page — so a card bearing the
Foundation's seal is now mintable, and therefore forgeable, by anyone who can
read one; and because the card prints them, the name path hands out the PMA
class and joining year that the status check withholds. The card has always
stamped `as of <date>` beside the standing, so it is a dated assertion rather
than a standing credential, and that is the only mitigation there is.

The email tab remains, because it is the only lookup that cannot be ambiguous:
a member who knows their address never meets the class-year follow-up, and a
member whose class the roster does not hold can be found no other way.

**A shared name is resolved by asking for a PMA class year, never by listing
the candidates.** Two members can genuinely share a name, and a member whose
name the roster misspells — or who has forgotten which address they registered
under — used to hit "more than one match" and be told to switch to the email
tab, the one thing they could not do. They are now asked for their class year,
which narrows the tie and resolves it when exactly one member survives. The
obvious alternative, showing the near matches to pick from, is permanently out
of bounds: names are public and standings are not, so answering a guessed name
with real members' names would make the status check a roster directory. The
visitor supplies the year; the roster never shows one. Three rules keep the
field from becoming its own leak, all covered in `members-name.test.ts`:

- **A wrong year and an unhelpful one return the identical answer** —
  `ambiguous`, never "not found". Otherwise the field reports which classes
  those members are *not* in, and the roster can be read off the difference.
- **A member with no class on file can never be narrowed to.** An empty roster
  value must not match an empty query.
- **The year is a tie-breaker, not a second gate.** An unambiguous name still
  resolves with a wrong year, or none at all.

Guessing the year itself is bounded only by the per-IP rate limit below. It is
a narrowing factor, not a secret, and the design accepts that.

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
| `Content` | The Chairman's and President's messages, contact details, socials, bank and GCash, dues, finance contact, and the three form links (`form.donation`, `form.correction`, `form.contact`) | Key/value |
| `News` | The home page's News & Announcements | Moved here 2026-08-31 from a standalone sheet that had never been shared with the service account, so the feed silently served samples for months |
| `Fund updates` | `/donate/impact` and the updates shown in a donor's own lookup | |
| `Chairs` | The roll of endowed chairs on `/programs` | One column. There is deliberately no place to put an amount |
| `Donation Photos` | The gallery on `/donate/impact` | Staff paste a Drive **share link**. Caption is required — it is the alt text. `Published` must be ticked, so a cheque showing a donor's name beside an amount cannot reach the web by drag-and-drop. File-name lookup exists but is deliberately off — see `DRIVE_PHOTOS_FOLDER_ID` |
| `FAQ` | The assistant's answer set | |

The FAQ assistant is a floating widget on every page — keyword matching with a
confidence threshold, suggested questions, and a clean hand-off to the contact
page when nothing matches. No AI, no ongoing cost. The answer set is **32
entries**, meeting the 25–40 recommendation; what remains is PMAFI reviewing the
wording. (This file said 33 until 2026-09-05; the array has held 32 throughout.)

**There are two FAQs, and they drift.** The assistant's set is `src/lib/faq.ts`;
`/contact` has its own seven-question list in `contact/FAQ.tsx`. Several
questions appear in both, so **an answer changed in one has to be changed in the
other**. Checked 2026-09-05 and one had gone stale the moment the payment
details landed: `/contact` was still telling donors to email for bank and
e-wallet details that `/donate` now publishes, while the assistant answered the
same question correctly. Both now point at the Donate page. Note the asymmetry
that lets them drift: the `FAQ` sheet tab overrides the **assistant's** answers
only, so staff can fix one of these without a developer and the other not at
all — the contact list is code and needs a deploy.

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

## Keeping members' contact details current

**The ID page asks for a current email address and mobile number.** PMAFI's
contact details for its own members are patchy: roughly half the roster is
manual rows where there may be no number at all, and a form member's number is
exactly as old as their application. `/membership/id` is where this is asked
because it is the one moment the Foundation knows it is looking at a real
member, doing something they came to do, having just been shown what the roster
holds about them.

- **It asks; it does not gate.** The card downloads either way and nothing is
  required. The ID is a benefit the roster already grants, not a trade for
  personal data — and nothing here can be verified, so a member who would
  rather not give a number would simply type digits. That collects worse data,
  not more.
- **It is a link to a Google Form, not a field on the site.** The service
  account is `spreadsheets.readonly` and stays that way; a web-facing
  credential that can edit the roster is a much larger risk than a form. It
  also keeps the collection PMAFI's rather than the website's, on the same
  footing as the membership application — which matters while the site has no
  privacy policy of its own.
- Responses land on a **`Contact Updates`** tab. The site reads **neither** the
  phone nor the email column off the roster — only name, email, category,
  status, PMA class and timestamp are mapped — so this is for the Foundation's
  own correspondence and nothing on the site displays it.
- **The correction form now asks for a mobile number too, but optionally.**
  That form exists because PMAFI's record of somebody's *name* is wrong,
  usually through a typo at our end; requiring a phone number before we will
  fix our own mistake puts the friction on the wrong party.

**Form links may carry a prefill template.** `form.contact` and
`form.correction` each accept either a plain form URL or a Google prefill link
containing `PMAFI_EMAIL_HERE`, which the ID page replaces with the address the
member already gave the gate. This is worth the mechanism because **staff match
a response to a member by email** — it is the roster's key — and an address
retyped from memory is the one that arrives wrong. A plain link keeps working
and simply opens the form blank. Where no address is known (the not-found
branch, and the demo name path, which never learns one) the token is *stripped*
rather than passed through, so nobody is ever shown a form with the literal text
`PMAFI_EMAIL_HERE` in its email box. Covered in `form-prefill.test.ts`.

The `.gs` files in `references/` **create** forms; they do not edit them.
Re-running one mints a second form with a different link and strands the
responses already collected on the first. The mobile-number question added to
`correction-form.gs` on 2026-09-19 therefore has to be added to the live form by
hand — the file says how.

---

## Analytics and the cookie notice

**Nothing loads until the visitor says yes.** Google Analytics used to run for
everybody the moment `NEXT_PUBLIC_GA_ID` was set — which it is on Production —
so the site set third-party cookies on a first visit with nothing on the page
saying so. This file listed "analytics event tracking + cookie notice" under
*Not started* while the analytics half was already live. Closed 2026-09-19.

- A visitor who has not answered gets **no script tag, no `window.gtag`, no
  request to Google**. The gate is "render nothing", not a flag: Google's own
  consent mode still fetches the script and pings Google from a page nobody
  agreed to be measured on.
- **The notice appears only where there is a tracker to ask about.** A build
  with no measurement ID — every local one — sets no cookies, and a banner
  asking about cookies that do not exist would be a false statement.
- **Both answers are the same size.** A grey Decline beside a bright Accept
  collects a yes by making the no harder to find, which is not consent.
- **There is no dismiss.** No close cross, no Escape. Dismissal is not an
  answer: read as "no" it asks again on every page, read as "yes" it helps
  itself to a consent nobody gave.
- **A refusal persists**, so the only way to stop being asked is not to accept.
  **Cookie settings** in the footer takes either answer back.
- The answer is stored in `localStorage` (`pmafi:analytics-consent`) and is
  **versioned**. Anything that is not an intact record at the current version
  reads as *no answer* and asks again — never as consent. Bump the version when
  what is being consented to changes, or an old yes to GA quietly becomes a yes
  to whatever was added beside it.
- Tabs agree: accepting in one settles it in the others, so a second tab cannot
  ask a question already answered and overwrite the answer.

**Events carry counts and nothing else** — `member_id_downloaded`,
`donation_form_opened`, `assistant_question_unanswered`, none with a parameter.
The ID page knows exactly which member is standing there; the assistant box
often holds a name the visitor typed; `/donate/status` carries a reference code
in its query string, which is why page views are sent without one. An event
that would undo a gate elsewhere on the site is not added because it is easy to
measure. Route changes are counted explicitly, since the App Router navigates
without a document load and GA's automatic page view fires once per session.

Verified 2026-09-19 by driving a real Chrome through the whole flow — 21
checks, covering first visit, decline, persistence across pages, reopening from
the footer, accept, and a corrupted stored answer. `src/lib/consent.test.ts`
covers the parsing and store rules (27 assertions).

**There is no `/privacy` page, deliberately.** The notice states what is
actually set rather than linking to a policy, because writing one means making
retention, sharing and data-subject commitments on PMAFI's behalf that PMAFI
has not made. It is on the blocked list below.

---

## Known open issues, carried deliberately

**The membership check does not verify identity.** Anyone can type any email —
or any name — and see that person's standing. The ID generator is gated on that
same check, so a card cannot assert a membership the roster never granted, but
it inherits the weakness: someone who knows a member's email can mint their
card. Closing it requires logins.

**Name lookup now does extend to the ID generator**, by decision — see the
membership section above for what that accepts. The three guards that were
never part of that decision still hold: an ambiguous name gets the class-year
follow-up and never a list of candidates, no lookup ever returns a member's
email address, and both name paths are rate-limited per client address. The
status check additionally withholds the class year; the ID path cannot, because
the card prints it.

The lookups remain separate server actions. Not as a barrier now, but because
they return different things — merging them would mean one function whose
disclosures depend on a caller-supplied mode, which is the shape in which the
status check quietly acquires the ID path's.

**The form is no longer the only way onto the roster** — the caveat this file
carried from the start ("a member who never used the form has no row, and adding
one by hand means writing into a sheet the form also appends to") stopped being
theoretical in August 2026 and is answered by the `Manual Members` tab above.
A hand-typed row still proves less than a submitted one, but that no longer
gates the ID card: PMAFI settled on 2026-08-31 that the address on a manual row
is the member's own, and the gate proves an address is *on* the roster rather
than that the visitor owns it either way. See the manual-members note above.

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
| `NEXT_PUBLIC_GA_ID` | — | ✅ | Google Analytics. Also switches the cookie notice on: unset means no tracker and therefore nothing to ask about, which is why the notice never appears in local development. To see it, run with `NEXT_PUBLIC_GA_ID=G-TEST123456 npm run dev` |
| `MEMBERS_SHEET_RANGE` | — | — | optional; defaults to `Membership Applications!A1:Z` |
| `MANUAL_MEMBERS_RANGE` | — | — | optional; defaults to `Manual Members!A1:Z`. A missing tab is not an error |
| `DRIVE_PHOTOS_FOLDER_ID` | — | — | **deliberately unset.** Would let staff type `handover.jpg` instead of pasting a share link, but needs the Drive API enabled and the folder shared with the service account — roughly ten minutes of setup that only pays off past ~40 photographs. PMAFI chose links (2026-08-31). The resolver is built and tested; setting this variable is the only switch, and existing link rows keep working |
| `DONATIONS_SHEET_ID` | — | — | optional; falls back to `MEMBERS_SHEET_ID` |
| `RESEND_API_KEY` | ❌ | ❌ | emailed giving summaries |

**`DEMO_ID_BY_NAME` is retired** and no longer read by any code. It is still set
on Vercel **Preview** and should be deleted (`vercel env rm DEMO_ID_BY_NAME
preview`) — it now does nothing, and a variable that looks like a switch but
isn't wired to anything is worse than no variable. A test pins the behaviour so
that a stale copy of it cannot change the answer either way.

**Preview has no sheet access at all.** `MEMBERS_SHEET_ID`, `CONTENT_SHEET_ID`
and both `GOOGLE_SERVICE_ACCOUNT_*` variables are set for **Production only**,
so on a preview deployment every membership lookup returns "We couldn't check
your membership right now", and the content sheet falls back to shipped copy —
which means the fabricated Chairman's and President's messages, no payment
figures, and both the correction and contact-details prompts hidden. Add the
four to Preview if preview deployments are meant to be demonstrable.

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

1. **The Chairman's message and the President's message** — both still
   fabricated placeholders, and the Chairman's is copied into the `Content` tab
   where it reads as though it were approved. The single most misleading thing
   on the site, and as of the second message there is now twice as much of it,
   under two officers' names and photographs. Three sheet rows each
   (`chairman.*`, `president.*`); replacing one without the other leaves the
   page half approved and half invented, with nothing on it to say which.
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
7. **FAQ sign-off** — 32 assistant answers plus 7 on `/contact`; PMAFI has not
   reviewed the wording of either.
8. **A privacy policy.** The cookie notice now tells a visitor what is set and
   lets them refuse it, but there is no `/privacy` page for it to link to, and
   one cannot be written here: it commits PMAFI to retention periods, to who
   data is shared with, and to a contact for data-subject requests under the
   Data Privacy Act. Those are the Foundation's undertakings to make. Needed
   before the site collects anything beyond analytics.
9. **Two annual-report details, both fixable in the sheet** — whether Dionardo B
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
