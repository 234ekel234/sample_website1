# PMAFI Website — Proposal

**Prepared for:** Philippine Military Academy Foundation, Inc.
**Live site:** https://pmafi.vercel.app
**Date:** 29 July 2026

---

## At a glance

| | Scope | Fee | Monthly cost |
|---|---|---|---|
| **Part 1 — Website** | Complete public website, membership system, digital ID | **₱50,000** one-time | ₱0 |
| **Part 2 — Member & staff platform** | Logins, member portal, staff dashboard, FAQ assistant | **₱40,000** one-time | ₱0 |
| | **Total, both parts** | **₱90,000** | **₱0** |

Optional, recurring:

| Item | Cost |
|---|---|
| Custom domain (e.g. pmafi.org) | ₱1,000 / year |
| Maintenance & content updates | ₱2,000 / month |

**Part 1 is complete and live today.** Part 2 is optional, can be taken in whole or in part, and can be staged over time. Neither part introduces any paid infrastructure — hosting, forms, and data storage all run on free tiers.

---

# Part 1 — The Website

**Fee: ₱50,000 one-time · Operating cost: ₱0 / month · Status: delivered and live**

## Pages

Eight pages, each fully written, designed, and mobile-ready:

1. **Home** — hero, foundation pillars, programs overview, "Where Your Support Goes" impact section, Chairman's message, news, and calls to action
2. **About** — story, mission, vision, core values
3. **Programs** — professorial chairs, facilities, academic excellence, partnerships
4. **Board of Trustees** — the 2025–2026 board with roles and credentials
5. **Membership** — apply online, check your status, generate your ID
6. **Contact** — details, what to expect, FAQ
7. **Donate** — ways to give, "How Your Gift Is Honored" trust section, step-by-step guide
8. **Proposal** — a private page for PMAFI, hidden from search engines

## Membership system

- **Private status check** — a member enters their email and sees their standing: Active, Pending Payment, or Lapsed
- **Secure by design** — the roster lives in a private Google Sheet and is read on the server. The full member list never reaches anyone's browser.
- **Online application** through a Google Form, wired directly into the site
- **Automatic tracking** — new applicants are added as "Pending Payment" without duplicates
- **Graceful failure** — if the data source is briefly unavailable, members see a clear message rather than a false "not a member"

## Digital Member ID

- Self-service ID card generator — name, category, and photo
- Live preview, QR code, and a downloadable image
- Runs entirely in the member's browser; **the photo is never uploaded or stored anywhere**

## News system

- News and announcements are **already driven from a Google Sheet**, not written into the site's code
- Add a row, mark it Published, and it appears on the site — no developer needed
- Supports a title, summary, category, date, link, and image for each item

## Branding and design

- Official PMAFI seal in the header and footer, plus matching browser and app icons
- Custom navy-and-gold design system
- Fully responsive across desktop, tablet, and mobile
- Smooth scroll animations and polished interactions throughout

## Technical quality

- **Search engine ready** — page metadata, structured data for rich Google results, sitemap
- **Social link previews** — shared links show a proper image and description
- **Google Analytics** — live and tracking real visitors
- **100 / 100 accessibility score** on Google Lighthouse across all public pages
- Fast loading, secure credentials, fully version-controlled

## Hosting and handover

- Deployed on Vercel, updating automatically with every change
- Data held in PMAFI's own Google Forms and Google Sheets
- Up to **two rounds of revisions** on content and layout

> **On the price:** a professional studio would typically charge ₱80,000–₱200,000 for a custom site of this scope. This is a Foundation rate, and several items — the digital member ID, the news system, Google Analytics — were included at no additional cost.

---

# Part 2 — Member & Staff Platform

**Fee: ₱40,000 bundled · Operating cost: ₱0 / month**

Part 1 gave the Foundation a professional public presence. Part 2 turns it into a working platform: members log in and manage their own records, staff run the roster and update the site without a developer, and visitors get instant answers to common questions.

It comes as two modules. PMAFI can take one, both, or stage them over time.

| Module | What it delivers | Fee | Monthly |
|---|---|---|---|
| **A. Logins, roles & content management** | Member accounts, staff dashboard, self-editable content, donation records | ₱35,000 | ₱0 |
| **B. FAQ assistant** | On-site assistant answering common visitor questions | ₱8,000 | ₱0 |
| **Bundle (A + B)** | Both together | **₱40,000** | **₱0** |

---

## Module A — Logins, Roles & Content Management

**Fee: ₱35,000 · Operating cost: ₱0 / month · Timeline: about 1 to 1.5 weeks**

### Why this is needed

The current site has no way to verify identity. The status check looks up an email in the roster, but it cannot confirm the visitor actually *owns* that email — anyone can type any address and see that person's standing, and the ID generator is open to all. Before the site can safely offer member self-service, staff tools, or donation records, it must know **who a user is** and **what they are allowed to do**.

Separately, the Chairman's message and several other pieces of content are still written into the site's code, so changing them requires a developer. This module hands that control to PMAFI.

### How members and staff sign in

Members receive a **secure sign-in link by email**. Clicking it signs them in — there is no password to create, forget, or reset. Staff sign in the same way.

Two roles only, kept deliberately simple:

- **Member** — anyone whose email appears in the roster
- **Admin** — PMAFI staff, on a short approved list

**No third-party account service is used, and no new database is introduced.** Sign-in is built directly into the website itself, and all member data stays in the private Google Sheet PMAFI already owns. Nothing about your members is stored with an outside company, and there is no subscription attached to it.

### What members get

- **A personal account page** showing only their own record — category and standing
- **Digital ID, now verified** — the generator is restricted to signed-in members, with their name and category filled in automatically from their own record. This closes the "type anyone's email" gap.
- **No member can see any other member's information.**

### What staff get

- **Roster dashboard** — the full member list with standings
- **Standing management** — mark members Active, Pending, or Lapsed
- **Self-editable content** — update the Chairman's message and manage news items from a proper editing screen, with no developer involved
- **Donation records** — log and review donations
- **A written guide** on granting and removing staff access

### Security approach

Every protected action re-checks the user's identity and role **on the server**, not merely by hiding buttons in the interface. Credentials stay in secure environment settings and never reach the browser. The 100/100 accessibility score on public pages is preserved.

### Delivered in three usable stages

| Stage | Deliverable | Effort |
|---|---|---|
| **1** | Sign-in working; digital ID restricted to verified members | ~2–3 days |
| **2** | Member account page; staff roster view and standing edits | ~2 days |
| **3** | Self-editable content and donation records | ~2–3 days |

Each stage is useful on its own. **Stage 1 alone closes the identity gap**, so the work can pause between stages if needed.

---

## Module B — FAQ Assistant

**Fee: ₱8,000 · Operating cost: ₱0 / month · Timeline: about 1 to 2 days**

A friendly on-site assistant that answers the questions visitors actually ask — *How do I become a member? Where does my donation go? Who is on the board?* — instead of making them hunt through pages.

### What it includes

- **Floating chat widget** on public pages, in PMAFI navy and gold, mobile-friendly and accessible
- **Suggested questions** so visitors immediately see what it can help with, plus follow-up prompts
- **Free typing supported** — typed questions are matched to the closest approved topic
- **Direct links** — answers can send visitors straight to Apply, Donate, Contact, or the Board page
- **Clean hand-off** — for anything sensitive, unmatched, or still pending (bank details, phone number), it points to the contact page rather than guessing
- **An editable answer list** PMAFI can add to or reword over time without a developer

### How it works, plainly

Every answer comes from a **fixed list that PMAFI approves in advance**. It does not use artificial intelligence, which means two things: it can never invent or misstate anything about the Foundation, and it costs nothing to run.

**The trade-off, stated plainly:** it answers only what it has been taught. A question worded far outside the approved list will hand off to the contact page instead of answering. We would start the list broad — around 25 to 40 questions — which is the main factor in how helpful it feels.

If PMAFI later wants an assistant that understands free-form questions across the entire site, an AI-powered version is a straightforward upgrade, and the approved answers carry over as its foundation. That version would cost roughly ₱300–800 per month in usage, which is why it is not the default recommendation here.

---

# Ongoing costs

| Item | Cost | Notes |
|---|---|---|
| **Website hosting** | **₱0** | Free tier, comfortably handles a foundation's traffic |
| **Forms and data storage** | **₱0** | PMAFI's own Google Forms and Sheets |
| **Member sign-in** | **₱0** | Built into the site; no subscription |
| **FAQ assistant** | **₱0** | No usage-based cost |
| **Custom domain** *(optional)* | **₱1,000 / year** | e.g. pmafi.org, registered in PMAFI's name |
| **Maintenance** *(optional)* | **₱2,000 / month** | Content updates, monitoring, and small changes |

For comparison, website builders such as Wix or Squarespace charge upward of ₱2,000 per month — over ₱24,000 a year — for a far less capable site.

**Maintenance** keeps the site current: news, messages, board changes, monitoring, and small adjustments, so the Foundation always has a point of contact without paying per change. It is optional and can be started or stopped at any time.

---

# Available later, quoted separately

None of these are needed now. Each can be added whenever the Foundation is ready:

- **Online payments** — GCash, Maya, or card, with automatic receipts
- **Automated emails** — invoices, receipts, and renewal reminders
- **AI-powered assistant** — free-form question answering across the whole site
- **Scan-to-verify digital ID** — QR codes that confirm a member's standing when scanned
- **Conversion tracking** — measuring Apply, Donate, and ID downloads, with a privacy notice
- **Database migration** — moving donation records to a proper database as volume grows
- **Additional roles** — for example a separate board or super-admin tier

---

# One honest caveat

Module A records donations in a Google Sheet. This is a deliberate low-cost starting point, and it works well for internal tracking at low volume. But a spreadsheet has real limits: **no transaction safeguards, no audit trail, and two staff editing at the same time can overwrite each other.**

It is therefore **not suitable as an official system of record** for anything financial or regulatory — BIR donee-institution reporting, for instance. If donation volume or reporting requirements grow, moving this one area to a proper database is the right next step and can be quoted then. It would not require rebuilding anything else.

We would rather say this upfront than have PMAFI discover it later.

---

# What PMAFI provides

### Outstanding from Part 1

- Chairman's message — the real text
- News and announcements — real items to publish
- Official phone number
- Social media links
- Bank and GCash details for donations
- Decision on BIR donee-institution status
- Board members' confirmation of their photos and credentials

The site is fully functional in the meantime; these simply replace placeholder content.

### Needed for Part 2

- Which staff email addresses should have admin access
- Permission for the existing Google service account to write to the Sheet, needed for roster edits and donation records
- The donation details to track — donor name, amount, date, purpose, and so on
- Approval of the FAQ assistant's question-and-answer list, which we will draft from the existing site content for PMAFI's review

---

# Summary

| | One-time | Ongoing |
|---|---|---|
| Part 1 — Website *(delivered)* | ₱50,000 | ₱0 |
| Part 2 — Member & staff platform | ₱40,000 | ₱0 |
| **Total** | **₱90,000** | **₱0** |
| Custom domain *(optional)* | — | ₱1,000 / year |
| Maintenance *(optional)* | — | ₱2,000 / month |

Fees reflect a Foundation rate and can be adjusted with scope. Part 2 can be taken as a single module, as both, or staged over time.

Happy to walk through any part of this at your convenience.

**Simoun**
09357330435 · tusi.ekel@gmail.com
