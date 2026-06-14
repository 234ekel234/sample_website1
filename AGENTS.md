<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: PMAFI Website

**What this is:** The official website of the Philippine Military Academy Foundation, Inc. (PMAFI) — a non-stock, non-profit foundation supporting PMA.

**Live URL:** https://pmafi.vercel.app  
**Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion 12 · TypeScript · shadcn/ui · Vercel

---

## Key facts for agents

- All pages are in `src/app/` using the App Router. Section components live in `src/components/sections/`, one subfolder per page.
- The site uses **Tailwind CSS v4** — the config is in `src/app/globals.css` (not `tailwind.config.js`). Custom animations (`animate-drift`, `animate-drift-slow`, `animate-ember`) are defined there.
- Animations use **Framer Motion** (`motion.*`, `useInView`, `useInView`). Server components that need scroll-triggered animations must add `"use client"`.
- The membership status check is a **server action** (`src/app/membership/actions.ts`) that reads a private Google Sheet via a service account. The full roster never reaches the browser — this is intentional and must not be changed.
- Contact email is `pmafi.web@gmail.com` (interim working inbox). Phone number, official email, social media URLs, bank details, and real news items are all **pending PMAFI confirmation** — do not invent or hardcode placeholder values.
- The `/proposal` page is an internal document for the client. It is excluded from search indexing (`robots: noindex`).

## Content placeholders still outstanding

- Chairman's message (home page) — fabricated, awaiting real text
- News & announcements (home page) — sample items, awaiting real events
- Phone number — hidden pending confirmation
- Social media URLs — hidden pending confirmation
- Bank / GCash payment details — pending confirmation
- BIR donee institution status — pending confirmation
- Official PMAFI logo/seal — using text-based LogoMark in the meantime

## References

See `references/` for working documents: membership setup, env variable guide, client follow-up emails, board member details, and the PMAFI brochure.
