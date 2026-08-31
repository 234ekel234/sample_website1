# PMAFI Donations Sheet — Setup & Staff Guide

Drives the **My Giving** page at `/donate/status`, where a donor looks up a gift
using their email address plus the reference from their acknowledgment.

---

## Part 1 — Setup (developer, one time)

**Use the script — don't build the tab by hand.** The headers must be exact, and
the Reference column has a rule that is easy to get wrong under time pressure.

1. Open the **private spreadsheet the website already reads for membership** —
   the one holding the membership form's responses. The donation log belongs
   here, beside it, and **not** in the staff-editable content sheet, which is
   shared more widely.
2. **Extensions → Apps Script**, paste in `references/donations-sheet.gs`, save.
3. Run `setUpDonationsTab` once and approve the permission prompt.
4. Reload the spreadsheet — a **PMAFI** menu appears, carrying
   *Generate reference for selected cells*.

That creates the tab with these headers, a Fund dropdown, a Status dropdown, and
plain-text formatting on Reference so a code is never coerced into a number:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Reference | Email | Donor name | Date | Amount | Fund | Status |

**No new environment variable is needed** when the log lives in that
spreadsheet: `DONATIONS_SHEET_ID` is unset, so the site falls back to
`MEMBERS_SHEET_ID`, which points there. To keep donations in a *separate*
spreadsheet, set `DONATIONS_SHEET_ID` (and share that sheet with the same
service account).

Optional: `DONATIONS_SHEET_RANGE` overrides the default `Donations!A2:G`.

> **Until this tab exists, `/donate/status` is broken** — not empty. Every
> lookup fails with *"Unable to parse range: Donations!A2:G"*, and the donor is
> told we couldn't check right now. There is no half-working state.

---

## The two donation tabs are not the same thing

The private spreadsheet holds both, and mixing them up is the easy mistake:

| Tab | What it is | Read by the site? |
|---|---|---|
| **`Donation Reports`** | What donors *said* they sent, straight from the donation form. Unverified. Your working queue. | **No** |
| **`Donations`** | What PMAFI has *verified* and recorded. One row per confirmed gift, with a reference. | **Yes** |

A gift moves from the first to the second by hand: match the report against the
bank or GCash statement, then add a row here with a generated reference. Nothing
copies itself, and a donor sees nothing until the row exists in `Donations`.

`Donation Reports` is also where a donor's optional message, dedication, and
"may we name you publicly" answer live — they are not copied across, so check
there before acknowledging a gift publicly.

## Part 2 — Staff guide (for PMAFI)

### The normal way: log a report in one click

When a donor has filled in the donation form, do **not** copy the columns across
by hand. Once you have checked the transfer arrived against PMAFI's bank record:

1. Go to the **`Donation Reports`** tab.
2. Select the row — or several rows, they can be done together.
3. **PMAFI → Log selected report(s) to Donations.**

That copies the email, name, date, amount and fund into `Donations` in the order
the website expects, mints a random reference, sets the status to **Received**,
and writes the reference back into a *Logged reference* column beside the report
so the same gift cannot be logged twice.

**It does not verify anything.** A person still decides the money arrived; this
only saves the transcription. And it does not email anybody — see below.

Why it exists: the two tabs do not share a shape and never will. The report is
whatever the form asks (timestamp, phone, transaction number, dedication,
permission to acknowledge); the log is the seven fields the website reads.
Copying by hand means picking five non-adjacent columns out of eleven and
pasting them in a different order, per gift, forty times in a morning. Put an
amount in the fund column and the site skips the row silently — and the donor is
told their reference does not match, which reads as PMAFI having lost their gift.

### The other way: a gift that never came through the form

A cheque handed over at an event, say. Add the row to `Donations` yourself using
the columns below, then click the Reference cell and use **PMAFI → Generate
reference for selected cells**.

**Never type a gift into `Donation Reports`.** That tab belongs to the form,
which writes each response to the row after the last one *it* wrote — so a row
you type sits in space the form still considers free, and the next submission
overwrites it. `Donations` is a plain tab and is safe to type into.

### The columns in `Donations`

One row per donation. Add a row once a gift has been **verified** — a donor sees
nothing until it is logged.

- **Reference** — the code you give the donor. See the rule below; this is the
  one column that must be right.
- **Email** — the address the donor gives under. The lookup matches on this, so
  a typo means their gift won't appear.
- **Donor name** — used to greet them ("Thank you, Juan").
- **Date** — the date of the gift.
- **Amount** — pesos. `10000`, `10,000` and `₱10,000` all work.
- **Fund** — what it was designated for. Use one of the three canonical names —
  `Professorial Chair Fund`, `Endowment Fund`, `General Fund` — because the site
  joins a donor's gift to that fund's updates by matching this against the Fund
  Updates tab. Short forms ("Endowment", "General Donation") and any casing are
  understood; anything else is kept as typed and only matches if the updates tab
  spells it identically. "Facilities & Modernization" is a programme area, not a
  fund. Blank is fine and simply means the gift was not designated.
- **Status** — one of **Received**, **Acknowledged**, **Receipt issued**,
  **Allocated**. Anything blank or unrecognized shows as *Received*, which is
  the safe floor — it never claims PMAFI has done more than it has.

### ⚠️ The reference must be random

Use a random tail, like `PMAFI-2026-K7QX3M` — **not** a running number like
`PMAFI-2026-0142`.

Sequential references can be guessed. Someone who knows a donor's email address
could count upward until they hit a match and read that person's giving history.
A random code makes that impractical. This is the single most important rule on
this page.

**Use PMAFI → Generate reference for selected cells.** Select the Reference
cell on the new row and pick that menu item. It produces something like
`PMAFI-2026-K7QX3M` and checks it against every reference already in the sheet,
so no two donors can end up sharing one.

The codes leave out `I`, `L`, `O`, `0` and `1` on purpose. Staff read these to
donors over the phone and donors type them back; ambiguous characters turn into
"my reference doesn't work" emails.

Two things never to do:

- **Never type a reference by hand.** Under time pressure people produce
  sequences without meaning to.
- **Never copy the row above and edit the digits.** That is a sequence.

### After you add the row — send the acknowledgment

The reference is minted here and reaches the donor **only because somebody
emails it**. Nothing is automated. Until that email goes out, the donor cannot
look up their own giving at all, and the gift you just logged is invisible to
the person who made it.

Template, with the checks to run first and the wording never to use:
**`references/donation-acknowledgment-email.md`**

Then set Status to `Acknowledged`, so the donor sees that it happened.

### What donors see

Once the email and reference match, the donor sees **every gift recorded under
that email address** — not only the one they looked up — plus their total. Keep
that in mind when logging gifts for a shared or family address.

---

## What this does not cover

- **It is not a login.** A reference is a shared secret: anyone the donor
  forwards their acknowledgment to can see the same history. Real accounts are
  Phase 3, Module A in `PHASE-3-SCOPE.md`.
- **Nothing is automated.** No email goes out when you add a row, and no receipt
  is generated. Acknowledgment and receipting continue exactly as they do today.
- **The page is only as current as this sheet.** A donor who gave on Monday and
  looks on Tuesday sees nothing unless someone logged it in between — which
  reads to them as *"they've lost my gift."* Logging promptly matters more here
  than anywhere else on the site.
