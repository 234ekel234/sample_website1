# PMAFI — Official Website

The official website of the **Philippine Military Academy Foundation, Inc.** — a non-stock, non-profit foundation supporting PMA in developing officers of integrity, competence, and character.

Live site: **https://pmafi.vercel.app**

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, foundation pillars, programs overview, Chairman's message, news, CTA |
| About | `/about` | PMAFI story, mission, vision, and core values |
| Programs | `/programs` | Four strategic program areas with detail |
| Board of Trustees | `/board` | 2025–2026 Board with roles and credentials |
| Membership | `/membership` | Apply online + private member status check |
| Donate | `/donate` | Ways to give, payment channels, how-to steps |
| Contact | `/contact` | Contact details, expectations, FAQ |

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
| Member roster | Google Sheets API (server-side only) |
| Membership form | Google Forms |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Navbar, Footer, FloatingChat)
│   ├── page.tsx                # Home page
│   ├── about/page.tsx
│   ├── board/page.tsx
│   ├── contact/page.tsx
│   ├── donate/page.tsx
│   ├── membership/
│   │   ├── page.tsx            # Membership page
│   │   ├── MembershipCheck.tsx # Email status-check widget
│   │   └── actions.ts          # Server action: Google Sheets lookup
│   ├── programs/page.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── FloatingChat.tsx
│   ├── LogoMark.tsx
│   ├── sections/               # One folder per page, one file per section
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── Services.tsx
│   │   ├── ChairmansMessage.tsx
│   │   ├── News.tsx
│   │   ├── OrderCTA.tsx
│   │   ├── about/
│   │   ├── board/
│   │   ├── contact/
│   │   ├── donate/
│   │   └── proposal/
│   └── ui/                     # shadcn/ui primitives
└── lib/
    ├── members.ts              # Google Sheets member lookup (server-only)
    └── utils.ts
```

---

## Environment Variables

Required in `.env.local` (and in Vercel → Settings → Environment Variables for production):

```env
MEMBERS_SHEET_ID=                  # Google Sheet ID of the private member roster
GOOGLE_SERVICE_ACCOUNT_EMAIL=      # Service account email with Viewer access to the sheet
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY= # Service account private key (include the full PEM block)

# Optional — defaults to Sheet1!A2:D if not set
MEMBERS_SHEET_RANGE=Sheet1!A2:D
```

See `references/membership-env-setup.md` for step-by-step setup instructions.

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

The membership feature is fully live:

1. Visitor submits the [Google Form application](https://docs.google.com/forms/d/e/1FAIpQLScCtlvJRRyJoIFpyBfn8co6qVLDd1GnfV4x6m4dJeYvtE8GBQ/viewform)
2. An Apps Script auto-adds them to the roster as **Pending Payment**
3. PMAFI staff confirm the category, send an invoice, receive payment, and mark them **Active**
4. Member can check their status privately at `/membership` — the full roster never reaches the browser

Member roster columns (Google Sheet): `Name | Email | Category | Status`  
Valid statuses: `Active` · `Lapsed` · `Pending Payment`

See `references/membership-setup-todo.md` for full setup details and the Apps Script trigger install steps.

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
| 10 | Membership dues per category (Regular / Associate / Affiliate) | Membership page |
| 11 | Who issues invoices and how | Membership page |
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
| `membership-env-setup.md` | Step-by-step Google Sheets API credential setup |
| `membership-application-form.md` | Google Form structure and field mapping |
| `followup-email-pending-items.md` | Email draft with pending items list for PMAFI |
| `client-questions-email.md` | Questions sent to client coordinator |
| `board_member_details.md` | Board member details reference |
| `brochure.md` | PMAFI brochure content (source for membership categories, programs) |
| `pmaaai-reference.md` | PMAAAI website reference notes |
| `website-features-and-proposal.md` | Phase 1 feature scope |
| `phase2-enhancements-proposal.md` | Phase 2 add-ons proposal |
