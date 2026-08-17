# Membership Feature — Setup & TODO

The `/membership` page is built and working, but it runs on **mock data** and a
**placeholder form link**. This file lists what still needs to be done to go live.

## What's already built

- **Status check** (`/membership`): visitor enters their email → a server-side
  lookup returns only their own result (Active / Lapsed / Not found). The full
  member list never reaches the browser.
- **Membership categories**: Regular / Associate / Affiliate (from the brochure).
- **How to join**: the page renders whichever flow is live (see below) + an
  "Apply for Membership" button.
- Linked in the navbar and footer.

## TODO before launch

### 1. Replace the mock member list with the real Google Sheet — DONE & LIVE
- `src/lib/members.ts` now reads the private members sheet server-side via the
  **Google Sheets API + service account** (zero extra npm deps; JWT signed with
  Node `crypto`). Columns read in order: **Name, Email, Category, Status**.
- Sheet generator: `references/members-sheet.gs`.
- Members are matched by **email**, so everyone must be registered under the
  email they'll type in.
- PRIVACY: the whole roster never reaches the browser — the server matches one
  email and returns only that record. The action shows a friendly error on read
  failure instead of falsely reporting "not a member."
- DONE: service account created, Sheets API enabled, members sheet shared with
  the service account, env vars set in `.env.local` AND in Vercel Production,
  and a production deploy made. Verified end-to-end on
  https://pmafi.vercel.app/membership — a real Active member renders correctly.
- Env vars (the three, steps in **`references/membership-env-setup.md`**):
  `MEMBERS_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
  `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (+ optional `MEMBERS_SHEET_RANGE`).

### 2. Membership application form — DONE
- A dedicated PMAFI application form was generated (Apps Script in
  `references/membership-application-form.gs`) and wired into
  `APPLICATION_FORM_URL` in **`src/app/membership/page.tsx`**.
- Public link:
  `https://docs.google.com/forms/d/e/1FAIpQLScCtlvJRRyJoIFpyBfn8co6qVLDd1GnfV4x6m4dJeYvtE8GBQ/viewform`
- Remaining: (optional but recommended) link the form's **Responses → Google
  Sheet** as a full archive of every submission.

### 2b. Auto-add applicants as "Pending Verification" — CODE DONE, needs trigger install
- On each form submit, an Apps Script copies Name/Email/Category/**PMA Class**
  into the members roster with Status = **Pending Verification**, so the
  applicant can check their status on the site immediately. Re-submits are safe
  (existing emails are left untouched — no duplicates, no downgrades).
- STATUS RENAME: under pay-first the applicant has already paid, so "Pending
  Payment" would tell someone who paid that they still owe money. `members.ts`
  maps **both** labels to the same Pending state, so existing rows keep working
  and nothing needs migrating.
- FIXED: the script previously wrote only columns A–D, leaving **PMA Class** and
  **Member Since** blank for every applicant — which is why every digital member
  ID omitted the PMA class line and fell back to the download date. It now
  writes both (E from the form's PMA class question, F as the year they joined).
- Script + install steps: **`references/membership-autoadd.gs`** (paste into the
  form's Apps Script editor, set `MEMBERS_SHEET_ID`, add an installable
  "On form submit" trigger, authorize).
- Site changes (done): `members.ts`, `actions.ts`, and `MembershipCheck.tsx` now
  render a third status, **Pending** ("application received — pending payment").
- Roster: run `updateStatusDropdown()` in `references/members-sheet.gs` once so
  column D accepts "Pending Verification" (it keeps "Pending Payment" valid too).
- Lifecycle: applicant pays → submits form with receipt → auto-added as Pending
  Verification → staff verify the receipt + confirm category → staff set Status
  to **Active**.

### 3. Pay-first flow — BUILT, BLOCKED ON FIGURES

The intended flow is now **pay-first**: the applicant settles their dues, then
applies with the receipt attached, so one submission carries everything staff
need and nobody waits on a manual invoice.

**Pay-first is the only flow the site shows.** The ordering is PMAFI's
decision, not something derived from whether a figure happens to be filled in —
and the application form already tells applicants to pay first. A page
disagreeing with the form it links to is worse than a page missing a number.

What the content sheet still controls is whether the **figures are printed**.
`hasPaymentDetails()` in `src/lib/content.ts` returns true only when the sheet
has (a) at least one dues figure AND (b) a usable payment channel. Until then
step one of the join flow tells applicants to email PMAFI for the amount and
account details rather than inventing either. Same flow, less information,
still honest. Filling in the sheet publishes the figures; no deploy.

Content-sheet keys to fill (Content tab, `Key` / `Value`):

| Key | Example |
|---|---|
| `dues.regular` | `PHP 2,000 per year` |
| `dues.associate` | `PHP 1,000 per year` |
| `dues.affiliate` | `PHP 5,000 per year` |
| `payment.bank.name` | `BDO Unibank` |
| `payment.bank.account_name` | `PMAFI Inc.` |
| `payment.bank.account_number` | `1234 5678 9012` |
| `payment.gcash.name` | `PMAFI` |
| `payment.gcash.number` | `0917 123 4567` |

Dues values are free text, so `By arrangement` or `PHP 20,000 one-time` are fine.
A partial payment block is rejected on purpose — a bank name with no account
number, or an amount with no destination, keeps the flow closed. See
`src/lib/content.test.ts`.

**DECIDED: the form does not restate the figures.** It links to
`https://www.pmafi.org/membership#dues` instead, so the content sheet is the
single place dues and account numbers are published. If the form printed them
too, the two would drift the first time dues changed — and the applicant would
pay what the form said. The link costs nothing: the Apply button already sits on
that page, directly beneath the figures.

Consequence: **fill the content sheet in BEFORE publishing the form.** Until it
has values, the site shows no figures, so the form would be sending applicants
to a page that cannot tell them what to pay.

**Still to do on the form** (`references/membership-application-form.gs`):
1. Run the generator to create the form.
2. **Add the "Proof of payment" file-upload question BY HAND.** Apps Script has
   no `addFileUploadItem()` and `setRequireLogin()` is deprecated, so this step
   cannot be scripted. Full instructions are in that file's header.
3. Update `APPLICATION_FORM_URL` in `src/app/membership/page.tsx` to the new
   form's public link.

**Known tradeoff:** Google Forms requires respondents to be signed in to a
Google account to upload a file. That is friction for older alumni. The form's
Payment section therefore also tells them they can submit without the upload and
email the receipt to `PMAFI_PMA@yahoo.com` instead, so nobody is locked out.

**Still to confirm with PMAFI:** the dues amounts per category and the bank /
GCash details. These are the only things blocking the flow.

## The site reads the FORM RESPONSES sheet

There is no separate members roster and no auto-add script any more. The form's
linked responses sheet **is** the roster: every applicant row is created by the
form, and staff add one column of their own.

**Setup (once):**
1. In the responses sheet, add a column named **`Status`** to the right of the
   form's own columns. Leave it blank for new rows.
2. Set `MEMBERS_SHEET_ID` to that spreadsheet's ID (locally in `.env.local` and
   in Vercel).
3. The responses tab should be named **`Membership Applications`**, which is
   the code's default — rename it off Google's `Form Responses 1`, because that
   name is positional and gets reassigned if a form is ever recreated. If you
   name it something else, set `MEMBERS_SHEET_RANGE` to `<tab name>!A1:Z`. Note
   it starts at **row 1** — the header row is data here, not decoration.

**Columns are located by HEADER TEXT, never by position.** A responses sheet's
layout belongs to the form, so adding or reordering a question shifts every
column after it. Headers matched, case-insensitive substring:

| Looks for | Typical header |
|---|---|
| `full name` / `name` | Full name |
| `email` | Email Address *and* Email address — see below |
| `category` | Which membership category are you applying for? |
| `pma class` | PMA Class / Batch (and year graduated) |
| `status` | Status *(you add this)* |
| `timestamp` | Timestamp |

**Two email columns is normal.** The form asks for one, and Google adds its own
because the file-upload question forces sign-in. They can differ — someone types
their everyday address and signs in with another. A lookup matches **either**, so
neither is a wrong answer.

**Only those columns are read.** Phone numbers, addresses, free-text answers and
receipt links are never extracted, so they cannot reach the browser.

### Behaviour that differs from a hand-kept roster

- **Blank Status means Pending, not Lapsed.** Every row exists because somebody
  applied and says they paid; staff simply have not reached it. Telling a new
  applicant their membership "lapsed" would be wrong. Pending grants nothing.
- **An unrecognised category becomes Affiliate**, the broadest tier, rather than
  the row being dropped — a dropped row means the applicant cannot check their
  own status. It is provisional until staff confirm it.
- **Re-submissions collapse to one member, and the best standing wins.** A
  member who is Active and applies again gets a second row with a blank status;
  taking the newest row would silently demote them to Pending. Ties break toward
  the newer row.
- **Anyone who never used the form does not exist.** There is no way to add a
  legacy member by hand except by adding a row to the responses sheet, which
  Google may reorder. This is the accepted cost of using one sheet.

### Consequences to be aware of

- Reordering or renaming a form question is safe **as long as** the headers
  still contain the words above. Rename "Full name" to something without "name"
  in it and lookups stop working — the site reports a service error rather than
  telling every member they are not registered, but it is still broken.
- Deleting a response deletes the member.
- `references/membership-autoadd.gs` and the roster generator in
  `references/members-sheet.gs` are **no longer used**. They are kept only for
  reference if the separate-roster design is ever revived.

## Admin runbook — verifying a payment

This is the one step in the flow that is a person, not a script. Until an admin
does it, the applicant sees "your payment is being verified" on the website.

1. **Applicant pays**, then submits the form with their receipt attached.
2. **The row appears in the responses sheet** the moment they submit, with a
   blank Status — which the site reads as Pending. The applicant can already see
   themselves on `/membership`. Nothing needs to run.
3. **Admin opens the same sheet.** The receipt is a link in that row, and the
   uploaded file lands in Drive under the `pmafi.web@gmail.com` account.

   **The upload is optional, so check "How are you sending your receipt?" to
   see which queue this applicant is in.** Work them in this order:

   | Answer | What to do |
   |---|---|
   | *Attached above* | Verify and clear it — nothing to chase |
   | *I will email it to PMAFI_PMA@yahoo.com* | Check the inbox; chase if it has not arrived in a few days |
   | *I need help — please contact me* | Reach out directly. They likely paid over a counter and have a paper slip |

   The upload is deliberately not required: the applicant has **already paid**
   by the time they reach that page, so blocking submission on a file they may
   not have digitised leaves PMAFI holding their money with no record they ever
   applied. An email exchange is a far cheaper failure than a silent one.
4. **Match and check.** The email address is the key linking the response to the
   roster row. Confirm the amount matches the dues for the category they chose,
   and that the date and payer name are legible.
5. **Confirm the category.** "Not sure — please advise" and anything
   unrecognised reads as **Affiliate**, the broadest tier. If they belong
   elsewhere, correct their answer in the category column.
6. **Set the `Status` column to `Active`.** That is what "verified" means —
   there is no separate Verified status, because nothing would behave
   differently. The website reflects the change within 60 seconds.
7. **If the payment is short, missing, unreadable, or the receipt has not
   arrived yet:** leave the row as `Pending Verification` and contact the
   applicant. Do not set Active. All three receipt queues above sit in this
   same state until resolved, which stays accurate — the applicant sees
   "your payment is being verified" throughout, and nothing is lost.

Statuses and what the site shows:

| `Status` column | Member sees on /membership |
|---|---|
| `Active` | green — active member |
| *blank* | sky — payment being verified |
| `Pending Verification` / `Pending Payment` / `Pending` | sky — same |
| `Lapsed` or anything else | amber — lapsed, please get in touch |

Blank meaning Pending is the one rule that inverts from a hand-kept roster, and
it is deliberate: a row exists only because somebody applied. Anything staff
type that is not recognised still fails safe to Lapsed, granting nothing.

## Files involved
- `src/lib/members.ts` — member lookup (Google Sheets read; Active/Lapsed/Pending)
- `src/app/membership/actions.ts` — server action (`"use server"`)
- `src/app/membership/MembershipCheck.tsx` — the client check form (3 result states)
- `src/app/membership/page.tsx` — the page + `APPLICATION_FORM_URL`
- `references/membership-autoadd.gs` — form-submit script: auto-add as Pending
- `references/members-sheet.gs` — roster generator + Status-dropdown updater

## Open questions for the client (also in client-questions-email.md)
- **Membership dues per category + bank/GCash details** — the only thing
  blocking the pay-first flow. Everything else is built and waiting.
- Can PMAFI maintain a Google Sheet of members (Email/Name/Category/Status)?
- The roster currently holds 5 test rows. When does the real member list land?
- Is PMAFI comfortable requiring a Google sign-in for the receipt upload, or
  should the email-the-receipt path be the primary route?
