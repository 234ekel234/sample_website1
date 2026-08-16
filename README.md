# PMAFI — Official Website

The official website of the **Philippine Military Academy Foundation, Inc.** — a non-stock, non-profit foundation supporting PMA in developing officers of integrity, competence, and character.

Live site: **https://www.pmafi.org**

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, foundation pillars, programs overview, Chairman's message, news, CTA |
| About | `/about` | PMAFI story, mission, vision, core values, and the Board of Trustees |
| Programs | `/programs` | Four strategic program areas with detail |
| Membership | `/membership` | Apply online + private status check by email **or name** |
| Digital Member ID | `/membership/id` | Gated card generator — verified members only |
| Donate | `/donate` | Ways to give, payment channels, how-to steps |
| Fund Updates | `/donate/impact` | What each fund has accomplished |
| My Donations | `/donate/status` | Private giving lookup (email + reference) |
| Contact | `/contact` | Contact details, expectations, FAQ |

The Board of Trustees is a **section of `/about`** (`#board`), not its own page.
`/board` 308-redirects there — the old route was indexed, so it redirects rather
than 404s.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Base UI |
| Animations | Framer Motion 12 |
| Hosting | Vercel (free tier) |
| Membership data | Google Sheets API (server-side only) |
| Membership form | Google Forms (its responses sheet **is** the roster) |
| Transactional email | Resend (donor giving summaries) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Navbar, Footer, FloatingChat)
│   ├── page.tsx                # Home page
│   ├── about/page.tsx          # Includes the Board of Trustees (#board)
│   ├── contact/page.tsx
│   ├── programs/page.tsx
│   ├── donate/
│   │   ├── page.tsx
│   │   ├── impact/page.tsx     # Fund updates feed
│   │   └── status/             # Giving lookup + emailed summary
│   ├── membership/
│   │   ├── page.tsx            # Membership page
│   │   ├── MembershipCheck.tsx # Status check — by email or name
│   │   ├── DuesPayment.tsx     # Dues + account details (content sheet)
│   │   ├── actions.ts          # Server actions: two, deliberately
│   │   └── id/                 # Digital member ID, gated by IdGate
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Navbar.tsx  Footer.tsx  FloatingChat.tsx  LogoMark.tsx
│   ├── StructuredData.tsx  Analytics.tsx
│   ├── sections/               # One folder per page, one file per section
│   │   ├── Hero.tsx  Stats.tsx  Services.tsx  News.tsx  …
│   │   └── about/  contact/  donate/
│   └── ui/                     # shadcn/ui primitives + PageHero
└── lib/
    ├── sheets.ts               # Shared Google Sheets reader (service account)
    ├── members.ts              # Membership lookup (server-only)
    ├── donations.ts            # Giving lookup (server-only)
    ├── content.ts  faq.ts  news.ts  fund-updates.ts
    ├── sheet-date.ts  sheet-image.ts   # Shared sheet-cell parsers
    ├── rate-limit.ts  giving-email.ts  site.ts
    └── utils.ts
```

---

## Environment Variables

Required in `.env.local` (and in Vercel → Settings → Environment Variables for production):

Everything is optional to get the site running — each feature falls back to
built-in content when its variables are missing, so `npm run dev` works on a
fresh clone. What you set decides which features read live data.

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=       # Required by every sheet-backed feature
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY= # Full PEM block; literal \n escapes are fine

MEMBERS_SHEET_ID=                   # The membership FORM'S RESPONSES spreadsheet
CONTENT_SHEET_ID=                   # Staff-editable copy, FAQ, fund updates
NEWS_SHEET_ID=                      # Home page news
DONATIONS_SHEET_ID=                 # Giving log (falls back to MEMBERS_SHEET_ID)
RESEND_API_KEY=                     # Emailed donor giving summaries

# Optional — defaults to "Form Responses 1!A1:Z". Starts at row 1: the header
# row is what the column mapping reads.
MEMBERS_SHEET_RANGE=
```

`.env.example` documents all ten with what breaks when each is unset. See
`references/membership-env-setup.md` for credential setup.

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in MEMBERS_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

# Start the dev server
npm run dev
```

The site is available at `http://localhost:3000`.

---

## Deployment

The site is deployed on **Vercel** via Git integration — every push to `main` triggers a production deployment automatically.

To deploy manually:
```bash
npm run build   # verify the build passes locally first
# then push to main, or use the Vercel dashboard
```

---

## Membership System

**Pay first, apply with the receipt attached, then an admin verifies it.**

1. Applicant reads the dues and account details on `/membership` and pays
2. They submit the [Google Form application](https://docs.google.com/forms/d/e/1FAIpQLScCtlvJRRyJoIFpyBfn8co6qVLDd1GnfV4x6m4dJeYvtE8GBQ/viewform) with their proof of payment attached
3. The row appears immediately in the form's responses sheet with a blank
   `Status`, which the site reads as **Pending** — nothing needs to run
4. An admin checks the receipt, confirms the category, and sets `Status` to
   **Active**. The site reflects it within 60 seconds

### The responses sheet is the roster

There is no separate members sheet and no auto-add script. Staff add one column
of their own, `Status`, and the form supplies the rest.

- **Columns are located by header text, never by position.** A responses
  sheet's layout belongs to the form, so adding a question shifts everything
  after it. Headers matched: `name`, `email`, `category`, `pma class`,
  `status`, `timestamp`.
- **Blank `Status` means Pending, not Lapsed.** Every row exists because
  somebody applied; telling them their membership lapsed would be wrong.
- **Re-submissions collapse to one member, best standing wins** — re-applying
  can never demote someone already Active.
- Only the mapped columns are read. Phone numbers, addresses and receipt links
  stay in the sheet.

Statuses: `Active` · *blank* or `Pending Verification` → Pending · anything
else → `Lapsed` (fail-safe — it never grants standing).

### Two lookups, deliberately separate

`/membership` accepts an **email or a name**. `/membership/id`, which mints a
card bearing the Foundation's seal, accepts an **email only** — names are
public, so allowing one to mint a card would make the credential forgeable by
anyone who can read. They are separate server actions so the ID path has no
name branch to reach.

See `references/membership-setup-todo.md` for setup and the admin runbook.

---

## Pending Items (awaiting PMAFI)

| # | Item | Where it's used |
|---|---|---|
| 1 | Official PMAFI logo/seal (PNG/SVG, transparent bg) | Site-wide |
| 2 | Official email address | Contact page, Footer, FloatingChat |
| 3 | Official phone number | Contact page, FloatingChat |
| 4 | Office address (Fort del Pilar or Camp Aguinaldo?) | Footer |
| 5 | Facebook page URL | Footer, FloatingChat |
| 6 | Instagram page URL (if any) | Footer |
| 7 | Bank transfer details (bank, account name, number) | Donate page |
| 8 | GCash / e-wallet number | Donate page |
| 9 | BIR donee institution confirmation | Donate page |
| 10 | **Membership dues per category** (Regular / Associate / Affiliate) — the join flow asks applicants to email for the figures until these land | Membership page |
| 11 | ~~Who issues invoices and how~~ — obsolete, the flow no longer invoices | — |
| 12 | Chairman's actual message | Home page |
| 13 | Real news / upcoming events | Home page |
| 14 | High-res board member photos (if available) | Board page |
| 15 | Board credential review and confirmation | Board page |

---

## References

Internal working documents are in the `references/` folder:

| File | Contents |
|---|---|
| `membership-setup-todo.md` | Full membership feature setup checklist |
| `donations-sheet-setup.md` | Donations log setup + staff guide |
| `donation-acknowledgment-email.md` | What to send a donor once their gift is logged |
| `membership-env-setup.md` | Step-by-step Google Sheets API credential setup |
| `membership-application-form.md` | Google Form structure and field mapping |
| `followup-email-pending-items.md` | Email draft with pending items list for PMAFI |
| `client-questions-email.md` | Questions sent to client coordinator |
| `board_member_details.md` | Board member details reference |
| `brochure.md` | PMAFI brochure content (source for membership categories, programs) |
| `pmaaai-reference.md` | PMAAAI website reference notes |
| `website-features-and-proposal.md` | Phase 1 feature scope |
| `phase2-enhancements-proposal.md` | Phase 2 add-ons proposal |
