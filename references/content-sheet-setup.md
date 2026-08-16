# PMAFI Content Sheet — Setup & Staff Guide

How the staff-editable content works, how to set it up, and which cell controls
what on the website.

This covers **Phase 2, Module A** of the proposal.

---

## Part 1 — Setup (developer, one time)

### 1. Create the spreadsheet

Create a **new Google Sheet**, separate from the member roster.

> **Why separate?** Staff who edit content get access to this file only. They
> never see the member list. Keep the roster shared with the service account
> alone.

Name it something like **PMAFI Website Content**.

### 2. Create the tab and headers

Rename the first tab to exactly **`Content`** (capital C, no spaces).

In row 1, put the headers:

| | A | B |
|---|---|---|
| **1** | Key | Value |

### 3. Fill in the keys

Paste these into column A, starting at **row 2**. Leave column B blank for
anything PMAFI has not yet confirmed — blank means "keep what the site shows
today", and for the pending items it means "stay hidden".

| Row | A — Key | B — Value |
|---|---|---|
| 2 | `chairman.name` | LEO ANGELO D. LEUTERIO |
| 3 | `chairman.title` | Chairman, PMAFI |
| 4 | `chairman.body` | *(the message — see note below)* |
| 5 | `contact.email` | pmafi.web@gmail.com |
| 6 | `contact.phone` | *(blank until confirmed)* |
| 7 | `contact.address` | Fort del Pilar, Baguio City, Philippines |
| 8 | `social.facebook` | *(blank until confirmed)* |
| 9 | `social.instagram` | *(blank until confirmed)* |
| 10 | `payment.bank.name` | *(blank until confirmed)* |
| 11 | `payment.bank.account_name` | *(blank until confirmed)* |
| 12 | `payment.bank.account_number` | *(blank until confirmed)* |
| 13 | `payment.gcash.name` | *(blank until confirmed)* |
| 14 | `payment.gcash.number` | *(blank until confirmed)* |

### 4. Share it with the service account

Share the sheet with the service account address in
`GOOGLE_SERVICE_ACCOUNT_EMAIL` — **Viewer** access is enough.

Then share it with PMAFI staff as **Editor**.

### 5. Set the environment variable

Add the spreadsheet ID (the long string in its URL) to `.env.local` and to
Vercel:

```
CONTENT_SHEET_ID=1AbC...xyz
```

Redeploy. Until this is set, the site uses its built-in defaults and nothing
changes — so it is safe to deploy the code before the sheet exists.

---

## Part 2 — Staff guide (for PMAFI)

### How it works

Column A is the **name of the setting** — do not change these.
Column B is the **value** — this is the only column to edit.

Change a value, and the website updates **within about a minute**. There is
nothing to publish and nothing to deploy.

### What each row controls

| Key | What it changes |
|---|---|
| `chairman.name` | The Chairman's name under the message on the home page |
| `chairman.title` | The title shown beneath the name |
| `chairman.body` | The message itself. For more than one paragraph, leave a **blank line** between them. |
| `contact.email` | The email shown on the Contact page, in the footer, on the Donate page, and in the chat widget |
| `contact.phone` | A phone number. **Leave blank and no phone is shown anywhere** — nothing is invented. |
| `contact.address` | The address in the footer |
| `social.facebook` | Full link to the Facebook page. Blank means no Facebook icon appears. |
| `social.instagram` | Full link to Instagram. Blank means no icon. |
| `payment.bank.name` | Bank name on the Donate page |
| `payment.bank.account_name` | Account name |
| `payment.bank.account_number` | Account number |
| `payment.gcash.name` | GCash account name |
| `payment.gcash.number` | GCash number |

### Giving directly (the `finance.*` keys)

`/donate` carries a **Give Directly** section for gifts that need a conversation
rather than a transfer — establishing a professorial chair or an endowment,
giving in kind, a cheque, a transfer from abroad, or a class giving together.

| Key | Effect |
|---|---|
| `finance.email` | The address shown. **Blank falls back to `contact.email`**, so the section always works — a major-gift enquiry reaching the ordinary inbox beats the option being hidden. |
| `finance.phone` | Shown as a phone link. Blank hides it entirely; the site never invents a number, and a wrong one here is worse than none. |
| `finance.name` | An optional aside such as *"Ask for the Treasurer"*. Blank omits it. |

This section deliberately promises an **official receipt** and nothing about tax
deductibility, because PMAFI's BIR donee institution status is still
unconfirmed. Do not add that claim to these values.

### The Donate page

Bank details only appear once **both** `payment.bank.name` and
`payment.bank.account_number` are filled in. Until then the page says the
details are being finalized and directs donors to email — so a half-filled row
never publishes an incomplete account number.

GCash works the same way: it appears once `payment.gcash.number` is filled in.

### Rules to keep in mind

1. **Never change column A.** Those names are how the website finds each value.
2. **Never delete row 1** (the headers) or insert a column.
3. **Blank is safe.** A blank value either keeps the current wording or hides
   that item — it will not break the page.
4. **Plain text only.** Bold, colours and links pasted from Word will not carry
   across; type the text plainly.
5. **Order does not matter.** Rows can be in any order, as long as the key in
   column A is spelled exactly as listed above.

### If something looks wrong

The site is built to fail safely. If the sheet is unreachable or a value is
missing, it shows the previous wording rather than an empty space. So a mistake
shows **stale content, never a broken page** — and correcting the cell fixes it
within a minute.

If a change does not appear after a couple of minutes, check that the key in
column A is spelled exactly right, with no extra spaces.

---

## The "Fund Updates" tab — what a donation achieved

This lives in the **same spreadsheet** as the Content tab, on its own tab named
**`Fund Updates`**, and it drives two places:

- **`/donate/impact`** — the public feed of what each fund has accomplished.
- **`/donate/status`** — a donor who looks up their gifts now sees the recent
  updates for **the funds they personally gave to**, right under their giving
  summary. That is the answer to *"what is my donation doing?"*, delivered to
  the person who paid for it rather than left on a page they have to find.

### Columns

| Column | Header | Required | Notes |
|---|---|---|---|
| A | `Fund` | **yes** | Must match the fund name used in the donation log, e.g. `Professorial Chair Fund`. Capitalisation and spacing don't have to match exactly. |
| B | `Title` | **yes** | A short headline — *"Two chairs awarded for AY 2026"* |
| C | `Message` | no | A few sentences. This is where the substance goes. |
| D | `Date` | no | Any readable date. Newest updates appear first. |
| E | `Image URL` | no | A **Google Drive share link**. Other hosts are ignored — see below. |
| F | `Published` | **yes** | `Yes` to show it. Anything else keeps it hidden. |

### The three fund names — use these exactly

The Fund column must match what the donation log uses, or a donor who looks up
their gift will be shown nothing. There are three:

| Fund | Minimum | From |
|---|---|---|
| `Professorial Chair Fund` | ₱250,000 | PMAFI brochure |
| `Endowment Fund` | ₱100,000 | PMAFI brochure |
| `General Fund` | — | Undesignated gifts. The donate page calls the *act* "General Donation"; the fund it lands in is General Fund |

Common short forms are understood — "Endowment", "Professorial Chair",
"General Donation", "unrestricted" all resolve to the right fund, and case and
spacing don't matter. Anything else is kept exactly as typed, so a fund PMAFI
opens later still works as long as **both** sheets spell it the same way.

**"Facilities & Modernization" is not a fund.** It is a programme area described
on /programs and the home page. The brochure has never offered it as something a
donor may designate to, so it is not in the list — gifts toward facilities are
General Fund gifts.

### A row needs a Fund AND a Title to appear

This is the single most common reason an update doesn't show. A row with a fund
name and `Published = Yes` but **no title** is skipped — there is nothing to
display. Starting 2026-08, the server log says so explicitly:

```
[fund-updates] Row 4 is marked Published but has no Title (column B) — not shown.
```

An **unpublished** incomplete row stays silent, because that is a draft rather
than a mistake.

### Images

Upload the photo to Google Drive, set it to *"Anyone with the link can view"*,
and paste the share link. The site converts it automatically. A link from
anywhere else (Facebook, Dropbox, a website) is **dropped** rather than shown —
the page cannot load it, and passing it through used to take the whole page
down.

### Write for the donor, not the file

The point of an update is that somebody who gave money reads it and knows what
happened. *"Your gift helped fund the Chair in Mathematics, held by Prof. Reyes,
who taught 240 cadets this year"* does far more than *"Q2 disbursement
completed"*. Specifics and photographs are what carry it.

**Nothing here is ever invented by the website.** An empty tab produces an
honest empty state — publishing a fabricated account of what a donation achieved
would be far worse than showing nothing.

### What this tab cannot do

It holds words and pictures, not figures. There is no column for a fund's
balance, its returns, or how much it has grown, and the site will not calculate
any of that. Publishing financial performance needs audited numbers from PMAFI's
finance side and a decision about what may be stated — a separate conversation,
not a spreadsheet column.

---

## What this does not cover

Page text across About, Programs, Donate and the Contact FAQ, along with the
Board of Trustees profiles, remains in the website's code and is updated by the
developer. See *"What PMAFI can update directly"* in the proposal for the full
split.

News and announcements are on their own separate sheet, and continue to work as
they do today.
