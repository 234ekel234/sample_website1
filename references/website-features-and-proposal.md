# PMAFI Website — Feature List & Proposal

A complete inventory of what the PMAFI website does today, what it costs to run,
what still needs client input, and what we could add next. Use this as the
single source of truth before refreshing the on-site `/proposal` page.

- **Live site:** https://pmafi.vercel.app
- **Org:** Philippine Military Academy Foundation, Inc. (PMAFI)
- **Stack:** Next.js (React) · hosted free on Vercel · Google Forms/Sheets for data
- **Status:** Live and in use; the membership payment details are the last open item.

---

## 1. Pages (what a visitor sees)

| Page | Path | What's on it |
|---|---|---|
| **Home** | `/` | Hero, foundation stats, intro to mission/programs, calls to action. |
| **About** | `/about` | PMAFI story, mission & core values. |
| **Programs** | `/programs` | The Foundation's programs and initiatives (professorial chairs, endowment & development funds). |
| **Board of Trustees** | `/board` | The 2025–2026 Board, with names, roles, and credentials. |
| **Membership** | `/membership` | The full membership system — see §2. |
| **Contact** | `/contact` | Official contact details, click-to-call / click-to-email, FAQ. |

All six are linked in the top navigation and footer.

---

## 2. Membership system (the flagship feature)

A self-service membership experience backed by a private Google Sheet — no
custom database or paid service required.

**For visitors**
- **Membership categories** explained — Regular / Associate / Affiliate.
- **Member benefits** and a **how-to-join** walkthrough (apply → invoice → pay → active).
- **Apply online** — an "Apply for Membership" button opens the PMAFI application
  Google Form.
- **Private status check** — a visitor types their email and instantly sees
  *only their own* status: **Active**, **Pending Payment**, or **Lapsed**.

**Behind the scenes**
- **Privacy by design** — the full member roster *never* reaches the browser.
  The server matches one email and returns only that single person's record.
- **Private roster** — members live in a Google Sheet (Name / Email / Category /
  Status) shared only with a Google "service account," read securely server-side.
- **Auto "Pending Payment"** — when someone submits the application form, they're
  automatically added to the roster as *Pending Payment*, so they get instant
  confirmation. Re-submissions are safe (no duplicates, existing members
  untouched).
- **Graceful failure** — if the data source is briefly unavailable, the site
  shows a friendly "try again" message instead of wrongly telling someone they
  aren't a member.

**Member lifecycle:** applicant applies → auto-marked *Pending Payment* → PMAFI
confirms category & receives payment → staff set status to *Active* → (if dues
ever lapse) → *Lapsed*.

---

## 3. Built-in / technical features

- **Fully responsive** — desktop, tablet, and mobile.
- **Fast** — modern Next.js build, served on Vercel's global edge network.
- **SEO metadata** on public pages; the internal proposal page is hidden from search.
- **Smooth scroll animations** and a clean, consistent design system (navy `#1B2A4A`
  / gold `#C8A951`), easy to extend or rebrand.
- **Click-to-call / click-to-email** throughout.
- **Secure secrets** — all credentials live in environment variables, never in
  the code or the browser.
- **Source-controlled** — the whole site is in Git; every change is tracked and
  reversible.

---

## 4. Infrastructure & operating cost

| Service | Used for | Cost |
|---|---|---|
| **Vercel** (Hobby) | Hosting + deploys | **Free** |
| **Google Forms** | Membership application intake | **Free** |
| **Google Sheets** | Private member roster + response archive | **Free** |
| **Google Sheets API + service account** | Secure server-side roster reads | **Free** |
| **Cloudflare** | Domain / DNS (root account on file) | Free tier |
| **Custom domain** (optional) | e.g. `pmafi.org` instead of `pmafi.vercel.app` | ~one small annual fee |

**Bottom line:** the site runs at essentially **$0/month**. The only potential
cost is a custom domain name (a modest yearly registration fee) if PMAFI wants
its own address instead of the free `pmafi.vercel.app`.

---

## 5. Status — done vs. pending

**✅ Live and working**
- All six PMAFI pages, rebranded and styled.
- Membership status check (Active / Pending Payment / Lapsed), live in production.
- Online application form, wired into the site.
- Auto-add applicants as *Pending Payment*.

**⏳ Needs client input (not code)** — see `references/membership-dues-email.md`
- Dues amount per category (Regular / Associate / Affiliate).
- Who issues invoices, and how.
- Payment channels (bank / GCash / etc.) + how members send proof.
- Renewal cadence (what makes a membership *lapse*).
- Final confirmations: official logo/seal, contact details, board credentials,
  donation channels (see `references/client-questions-email.md`).

---

## 6. Recommended cleanup

These are leftovers from the original business template the site was built on —
worth resolving before presenting the proposal:

- **Legacy pages** `/services`, `/products`, `/order` still exist but aren't
  linked anywhere and don't fit a foundation. **Recommend removing** (or
  repurposing — e.g. `/order` could become a "Donate" flow).
- **Stale page titles** — `/contact`, `/services`, `/products`, `/order` still
  show **"Tusi Solutions"** in their browser-tab titles. **Recommend updating**
  to PMAFI (the Contact page is the one that matters, since it's linked).

---

## 7. Possible add-ons / next steps

Ideas to discuss — none are required for launch:

- **Donations** — a clear "Donate" page with PMAFI's accepted channels (the
  brochure mentions professorial chairs and endowment funds).
- **News / announcements** — a simple updates section for events and reunions.
- **Custom domain** — point `pmafi.org` (or similar) at the site.
- **Automated invoice email** — once dues/payment details are set, auto-email a
  new applicant their invoice on submission.
- **Member benefits expansion** — gated updates or a members-only area later.
- **Higher-resolution assets** — official logo + trustee photos to sharpen the
  Board and branding (already requested in the client email).

---

## 8. One-paragraph summary (for the client)

> PMAFI now has a complete, professional website — six pages covering the
> Foundation's story, programs, Board of Trustees, and contact details, plus a
> full **membership system**: members can apply online and privately check their
> status, and new applicants are automatically tracked as *Pending Payment*. It
> runs on free, reliable infrastructure (essentially no monthly cost), is fast
> and mobile-friendly, and is ready to launch. The only remaining step is
> confirming the membership dues and payment details so we can complete the
> apply-to-active flow.
