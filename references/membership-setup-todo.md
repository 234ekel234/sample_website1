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

### 1. Replace the mock member list with the real Google Sheet
- File to edit: **`src/lib/members.ts`** → the `loadMembers()` function (currently
  returns `MOCK_MEMBERS`).
- The sheet needs at least these columns: **Email, Name, Category
  (Regular/Associate/Affiliate), Status (Active/Lapsed)**.
- Members are matched by **email**, so everyone must be registered under the
  email they'll type in.
- Two ways to connect (pick one):
  - **Service account (most private):** share the sheet only with a Google
    service account; read it via the Sheets API on the server. Store credentials
    in env vars (e.g. `MEMBERS_SHEET_ID`, service-account key). Nothing public.
  - **Published CSV (simpler):** File → Share → Publish to web → CSV; fetch that
    URL server-side. Easier, but the URL exposes the list if leaked.
- PRIVACY RULE: never send the whole roster to the browser. Keep the lookup in
  the server action; return only the one matching record.

### 2. Confirm the membership application form
- The "Apply for Membership" button currently points to the brochure link:
  `https://forms.gle/1znWk8ZTbXhW2Skv6`
- Confirm with PMAFI this Google Form is still active / correct, then update
  `APPLICATION_FORM_URL` in **`src/app/membership/page.tsx`**.

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
