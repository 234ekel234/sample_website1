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

**The site already supports both flows and switches itself.**
`canPayFirst()` in `src/lib/content.ts` returns true only when the content sheet
has (a) at least one dues figure AND (b) a usable payment channel. Until then
`/membership` keeps showing the old apply-first steps, which is the only honest
thing to show — you cannot tell someone to pay on their own without telling them
how much and where. Filling in the content sheet flips the site over; no deploy.

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

**Still to do on the form** (`references/membership-application-form.gs`):
1. Fill the `DUES_*` / `PAYMENT_*` constants and re-run to generate the form.
2. **Add the "Proof of payment" file-upload question BY HAND.** Apps Script has
   no `addFileUploadItem()` and `setRequireLogin()` is deprecated, so this step
   cannot be scripted. Full instructions are in that file's header.
3. Update `APPLICATION_FORM_URL` in `src/app/membership/page.tsx` to the new
   form's public link.

**Known tradeoff:** Google Forms requires respondents to be signed in to a
Google account to upload a file. That is friction for older alumni. The form's
Payment section therefore also tells them they can submit without the upload and
email the receipt to `pmafi.web@gmail.com` instead, so nobody is locked out.

**Still to confirm with PMAFI:** the dues amounts per category and the bank /
GCash details. These are the only things blocking the flow.

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
