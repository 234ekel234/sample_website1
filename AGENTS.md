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
- **Brand gold has two tokens** (defined in `globals.css` `@theme`): `text-gold` (`#C8A951`, vivid — use on dark/navy backgrounds) and `text-gold-ink` (`#8A6A22`, darker — use for small text on light/white backgrounds). The vivid gold fails WCAG AA contrast on light backgrounds, so always use `text-gold-ink` for gold text on white/slate sections. Likewise, muted helper text on light backgrounds must be `text-slate-500`+ (not `text-slate-400`, which fails AA). All public pages currently score 100 on Lighthouse accessibility — keep it that way.
- Animations use **Framer Motion** (`motion.*`, `useInView`, `useInView`). Server components that need scroll-triggered animations must add `"use client"`.
- The membership status check is a **server action** (`src/app/membership/actions.ts`) that reads a private Google Sheet via a service account. The full roster never reaches the browser — this is intentional and must not be changed.
- The **digital member ID generator** lives at `/membership/id` (`src/app/membership/id/`). It's a standalone, client-side generator (type name + category, upload a photo) that composites the card on a `<canvas>` and downloads it as a PNG. The photo and card are **never uploaded or stored** — everything happens in the browser. The member number is a deterministic hash of the name (`idFromName`). NOTE: it is intentionally ungated for the bid demo (anyone can mint a card); for production it should be gated behind the membership verification in `actions.ts`, and scan-to-verify would need photos persisted (e.g. Vercel Blob) + an id-lookup endpoint.
- Contact email is `pmafi.web@gmail.com` (interim working inbox). Phone number, official email, social media URLs, bank details, and real news items are all **pending PMAFI confirmation** — do not invent or hardcode placeholder values.
- The `/proposal` page is an internal document for the client. It is excluded from search indexing (`robots: noindex`).

## Content placeholders still outstanding

- Chairman's message (home page) — fabricated, awaiting real text
- News & announcements (home page) — sample items, awaiting real events
- Phone number — hidden pending confirmation
- Social media URLs — hidden pending confirmation
- Bank / GCash payment details — pending confirmation
- BIR donee institution status — pending confirmation

## References

See `references/` for working documents: membership setup, env variable guide, client follow-up emails, board member details, and the PMAFI brochure.
