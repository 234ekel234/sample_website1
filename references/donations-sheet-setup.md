# PMAFI Donations Sheet — Setup & Staff Guide

Drives the **My Giving** page at `/donate/status`, where a donor looks up a gift
using their email address plus the reference from their acknowledgment.

---

## Part 1 — Setup (developer, one time)

1. Open the **private members spreadsheet** (the one behind the membership
   check). The donation log belongs here, with the roster — **not** in the
   staff-editable content sheet, which is shared more widely.
2. Add a tab named **`Donations`**.
3. Put these headers in row 1, in this order:

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Reference | Email | Donor name | Date | Amount | Fund | Status |

4. No new environment variable is needed if the log lives in the members
   spreadsheet — the site falls back to `MEMBERS_SHEET_ID`. To keep donations in
   a *separate* spreadsheet, set `DONATIONS_SHEET_ID` instead (and share that
   sheet with the same service account).

Optional: `DONATIONS_SHEET_RANGE` overrides the default `Donations!A2:G`.

---

## Part 2 — Staff guide (for PMAFI)

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
  fund. Leave
  blank for a general gift.
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

A formula that generates one, if useful:

```
="PMAFI-"&TEXT(TODAY(),"YYYY")&"-"&UPPER(DEC2HEX(RANDBETWEEN(1048576,16777215)))
```

Paste the **value** (not the formula) into the Reference cell, so it doesn't
change on the next recalculation.

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
