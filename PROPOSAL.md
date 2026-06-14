# PMAFI Website Proposal

A complete, live website for the **Philippine Military Academy Foundation, Inc.**

> The full interactive version of this proposal is available at **/proposal** on the live site.

---

## What's Already Built

A complete, mobile-responsive website with six pages and a self-service membership system — already live at **https://pmafi.vercel.app**.

### Pages

| Page | Description |
|---|---|
| **Home** | Hero, foundation pillars, programs overview, Chairman's message, news & announcements, CTA |
| **About** | PMAFI story, mission, vision, and core values |
| **Programs** | Four strategic program areas (Facilities, Academic Excellence, Leadership, Partnerships) |
| **Board of Trustees** | 2025–2026 Board with roles and credentials |
| **Membership** | Apply online + private member status check (Active / Pending / Lapsed) |
| **Contact** | Contact details, what to expect, FAQ |
| **Donate** | Ways to give, how-to steps, payment channels |

### Built-in Features

- Fully responsive — desktop, tablet, and mobile
- Private member status check (Active / Pending / Lapsed)
- Online membership application via Google Form
- Auto-tracks new applicants as "Pending Payment"
- Privacy by design — the roster never reaches the browser
- SEO metadata, smooth animations, modern UI
- Secure secrets, version-controlled in Git
- Free hosting on Vercel — essentially ₱0/month

---

## Operating Costs

| Item | Cost | Notes |
|---|---|---|
| Hosting (Vercel) | **Free** | Free tier handles a foundation's traffic easily |
| Membership form (Google Forms) | **Free** | Unlimited applications, archived to Google Sheet |
| Member roster (Google Sheets) | **Free** | Read securely server-side via a service account |
| Custom domain (optional) | ~$10 / year | e.g. pmafi.org — only if PMAFI wants its own address |
| **Total** | **≈ ₱0 / year** | Domain is the only optional cost |

For comparison: Wix or Squarespace charge ₱2,000+/month (₱24,000+/year).

---

## Suggested Add-Ons

### Quick Wins (1–3 days each)
- Official PMAFI logo/seal + high-res trustee photos
- Official social media links (Facebook, etc.)
- Real donation channels on the Donate page (bank / GCash)
- Link preview image for Facebook/Messenger shares
- Google Analytics to see visitor traffic
- Transparency page — financial reports & board resolutions

### Medium Features (1–2 weeks each)
- Self-service content editing via Google Sheet or a simple editor
- Automated invoice & receipt emails
- Newsletter signup for supporters
- Tagalog / English language toggle

### Larger Features (3–6 weeks each)
- Online dues & donation payments — GCash, Maya, card (via PayMongo)
- Automatic receipts for every online payment
- Member management dashboard for PMAFI staff
- Members-only area — login + member resources
- Custom domain + PMAFI email addresses

---

## Market Value

A website at this quality — with a custom membership system — would cost between **₱80,000 and ₱150,000** if built externally by a senior freelancer or boutique studio. Operating cost is **≈ ₱0/year**.

---

## Recommended First Steps

1. Send official PMAFI logo/seal and high-resolution trustee photos
2. Confirm membership dues per category and payment channels
3. Install the form's "Pending Payment" trigger (one-time, ~3 minutes — see `references/membership-setup-todo.md`)
4. Connect a custom domain, e.g. pmafi.org (~30 min, ~$10/year via Cloudflare)
5. Add Google Analytics
6. Remove or repurpose placeholder content (news, Chairman's message) once real content is provided
