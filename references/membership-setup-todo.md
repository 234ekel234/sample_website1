# Membership Feature — Setup & TODO

The `/membership` page is built and working, but it runs on **mock data** and a
**placeholder form link**. This file lists what still needs to be done to go live.

## What's already built

- **Status check** (`/membership`): visitor enters their email → a server-side
  lookup returns only their own result (Active / Lapsed / Not found). The full
  member list never reaches the browser.
- **Membership categories**: Regular / Associate / Affiliate (from the brochure).
- **How to join**: apply-first → we invoice → pay & send proof (5 steps) + an
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
- Remaining: connect the form's **Responses → Google Sheet**, and build the
  separate members sheet (Email/Name/Category/Status) used by the lookup.

### 3. Confirm dues & invoicing details
- Flow is apply-first → PMAFI sends an invoice → member pays & sends proof.
- Confirm: who issues the invoice, the dues amount(s) per category, and the
  payment channel(s) (bank transfer, GCash, etc.).

## Files involved
- `src/lib/members.ts` — member lookup + mock data (swap point)
- `src/app/membership/actions.ts` — server action (`"use server"`)
- `src/app/membership/MembershipCheck.tsx` — the client check form
- `src/app/membership/page.tsx` — the page + `APPLICATION_FORM_URL`

## Open questions for the client (also in client-questions-email.md)
- Is the brochure Google Form still the right one to use?
- Membership dues per category + payment channels?
- Can PMAFI maintain a Google Sheet of members (Email/Name/Category/Status)?
