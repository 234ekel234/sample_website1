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
| 5 | `contact.email` | PMAFI_PMA@yahoo.com |
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

### The donation form (`form.donation`)

Paste the public link to the **"Tell us about your donation"** form
(`references/donation-form.gs`) here and step 3 of *Making Your Donation*
changes from *"email us your details"* to a button. Leave it blank and the page
keeps the email instruction — which is what it has always said, so an unset key
is not a gap.

Why it matters: a bank transfer reaches PMAFI as a name and an amount. It
carries no address to reply to and no fund. Somebody has to close that gap —
with the form the donor types it once; without it a staff member retypes an
email, and a mistyped address means that donor's own gift is invisible to them
at `/donate/status` with no way to tell why.

**The form deliberately has no file upload.** Google gates an entire form behind
a Google sign-in as soon as one exists, and a donor is often a one-time visitor
— that friction costs gifts. PMAFI's bank statement is the proof; the form's job
is only to say who sent it.

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

## The "FAQ" tab — three rows are out of date

The FAQ tab is what the site's assistant actually answers from; the wording in
the code is only a fallback for when the sheet is unreachable. Three rows still
describe the old join flow, where PMAFI invoiced after reviewing an application.
Replace their answers with these:

**"How do I become a member?"**

> Settle the membership fee first, then apply online with your proof of payment
> attached — everything arrives in one submission, so there is no invoice to wait
> for. Your application is recorded straight away while the Foundation verifies
> your payment.

**"How much are the membership dues?"** — retitle to **"How much is the
membership fee?"**

> The current fee and where to send it are published on the membership page. It
> is a one-time payment — there is no annual renewal.

*Deliberately does not repeat the figure. It already lives in `dues.regular`
and renders on the membership page; putting it here as well gives you two places
to update and one to forget.*

**"How do I check my membership status?"**

> Look yourself up on the membership page by email, or by name if you are not
> sure which address the Foundation has on file. It shows your current standing —
> Active, being verified, or Lapsed. Your details stay private; only your own
> record is ever shown.

Also worth checking the whole tab for the words **"dues"**, **"Pending
Payment"** and **"invoice"** — all three belong to the flow the site no longer
uses.

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

## The "News" tab — the home page's News & Announcements

Also in the **same spreadsheet**, on a tab named **`News`**. It fills the three
cards under *"Latest Updates"* on the home page.

This tab moved here on 2026-08-31. It used to live in a spreadsheet of its own,
which had never been shared with the service account — so the site could not read
it and quietly fell back to three sample items instead. Nobody was told, because
an unreadable sheet and an empty one look identical to the code. Keeping News in
the spreadsheet PMAFI already shares means that particular silence cannot recur.

### Columns

| Column | Header | Required | Notes |
|---|---|---|---|
| A | `Title` | **yes** | The headline on the card |
| B | `Excerpt` | **yes** | One or two sentences underneath |
| C | `Category` | no | The gold pill on the image — `Events`, `Programs`, `Community` |
| D | `Date` | no | Any readable date. Blank shows *"Upcoming"* |
| E | `Link` | no | Makes the whole card clickable, opening in a new tab |
| F | `Published` | **yes** | `Yes` to show it. Anything else keeps it a draft |
| G | `Image URL` | no | A Google Drive share link, or a photo already on the site such as `/pma-corps-annual-visit.jpg` |

### Three cards is the natural limit

The home page lays these out in a row of three. A fourth published row wraps onto
a second row of cards — fine if that is what you want, worth knowing if it isn't.

### Never leave zero published rows

An empty News tab is treated exactly like a broken one, and the three sample
items come back: *"Annual General Membership Meeting"*, *"Professorial Chair &
Endowment Awarding"*, *"Class Reunion & Homecoming Support"*. **Those are
placeholders, not real events.** One accurate row is always better than none.

### Dates are dates, and that used to show

Typing `15 November 2024` into column D makes Google store a date, and the site
reads raw cell values — so the card printed `45611`, the internal number Sheets
keeps dates as. Fixed 2026-08-31; dates now display as written whether the cell
is formatted as a date or as plain text. Free text like `Upcoming` still passes
through untouched.

## The "Donation Photos" tab — the gallery on /donate/impact

Photographs of gifts being handed over. The pictures live in **one Google Drive
folder**; this tab names the ones that should be public.

### Columns

| Column | Header | Required | Notes |
|---|---|---|---|
| A | `Photo` | **yes** | Just the file name as it appears in the photos folder — `handover.jpg`. Capitalisation does not matter, and the extension can be left off unless two files share the name. A full Drive share link or a path already on the site (`/donation-handover.jpg`) also works |
| B | `Caption` | **yes** | One sentence. **This is also the alt text** a blind visitor hears, so describe what is happening — "Alumni of PMA Class 1967 presenting their gift", not "photo 4" |
| C | `Date` | no | Newest appear first; undated ones sit at the end |
| D | `Published` | **yes** | `Yes` to show it. Anything else keeps it private |

Seed file: `references/donation-photos-sheet.tsv`.

### The folder needs two kinds of sharing

They do different jobs and both are needed:

1. **Shared with the service account** (`pmafi-members@pmafi-website.iam.gserviceaccount.com`) as **Viewer** — this is what lets the site turn a file name into a photograph.
2. **"Anyone with the link can view"** — this is what lets a *visitor's browser* load the picture. Without it the gallery shows grey boxes: the site finds the file perfectly well and then every visitor is refused it.

The folder id goes in the `DRIVE_PHOTOS_FOLDER_ID` environment variable — it is
the part of the folder's address after `/folders/`.

### Adding a photograph

1. Put the image in the photos folder.
2. Add a row: the file name, a caption, the date, and `Published` = `Yes`.

**Putting a file in the folder publishes nothing on its own.** That is deliberate,
and it is the whole reason this tab exists rather than the site simply showing
the folder — see below.

### Why the folder does not publish by itself

A donation photograph is very often a presentation cheque, and a presentation
cheque shows a donor's name beside the amount they gave. That is precisely the
pairing the *My Donations* page demands a reference code to protect, and
precisely what had to be blurred out of the handover photograph on the Donate
page. If the folder published on its own, that would be one drag-and-drop away
— by someone tidying up files, who never intended to publish anything.

Naming a photograph in this tab is the moment somebody looks at it.

### Before you publish a photograph

- **Read what is written in the frame.** Cheques, banners and certificates carry
  names and amounts. If an amount is legible, do not publish it — send it over
  and it can be blurred, as the Donate page photograph was.
- **Consider whether the people in it agreed to appear.** The donation form asks
  *"May we acknowledge you publicly?"* — a gallery is that same question asked
  again, in pictures.
- **No photograph is better than a doubtful one.** An empty tab renders no
  gallery at all; the page simply carries on without it.

### If a photograph does not appear

- The name may not match any file in the folder — check the spelling.
- Two files may share the name once the extension is dropped (`awarding.png` and
  `awarding.jpg`). Type the full name with its extension to say which you mean.
- The folder may not be shared both ways described above.

## The "Chairs" tab — the roll of endowed professorial chairs

Also in the **same spreadsheet**, on a tab named **`Chairs`**. It fills the
honour wall on `/programs` — *"Endowed in Their Names"*.

### One column, and that is the whole design

| Column | Header | Notes |
|---|---|---|
| A | `Chair` | The chair's name exactly as it should appear on the page, e.g. `Bangko Sentral ng Pilipinas Chair in Finance`. One per row, starting at row 2 |

**There is no amount column, and there must never be one.** The annual report
prints what several chairs cost beside the names of who endowed them. A name is
the acknowledgment the donor was promised; the sum is not, and publishing the
two together is exactly what `/donate/status` withholds behind a reference code.
Anything typed into column B is ignored by the site.

### Adding, removing, reordering

- **Add a chair** — add a row. It appears within a minute.
- **Remove one** — delete the row, or clear the cell. Blank rows are skipped.
- **Order** — the page lists them in sheet order, so sorting the sheet sorts the
  page. The seeded order is the annual report's own.

### If the tab is empty or unreachable

The site falls back to the roll as published at 31 December 2025, held in
`src/lib/chairs.ts`. An honour wall that silently empties itself would be worse
than one a few months out of date. This means **an empty tab does not clear the
page** — to remove every chair you would have to ask a developer, which is
deliberate.

### Seeding it

`references/chairs-sheet.tsv` holds the 161 chairs from the 2025 annual report
with the header row. File → Import → Upload → *Replace current sheet* with the
`Chairs` tab active, separator Tab.

> **Two open questions for PMAFI.** The report's heading says 160 chairs while
> its list runs to 161 entries — `BGen Dionardo b Carlos ’88` and `PBeg Dionardo
> B Carlos` both appear. And several names look like typos in the report itself
> (`Conjuangco`, `Profirio`, `Nichols A Driz`). None were "corrected" here:
> guessing at the spelling of a benefactor's name is a worse error than
> reproducing the Foundation's own. Both are now fixable in the sheet without a
> developer.

## What this does not cover

Page text across About, Programs, Donate and the Contact FAQ, along with the
Board of Trustees profiles, remains in the website's code and is updated by the
developer. See *"What PMAFI can update directly"* in the proposal for the full
split.

News and announcements used to be on their own separate sheet. As of 2026-08-31
they are the `News` tab of this same spreadsheet — see above.
