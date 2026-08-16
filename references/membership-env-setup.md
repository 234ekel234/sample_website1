# Membership lookup — environment & service-account setup

The `/membership` status check reads the membership form's **linked responses
spreadsheet** on the server using a **Google service account** (shared only with
that account — nothing public). `src/lib/members.ts` performs the read.

There is no separate members roster. Every row in the responses sheet is an
application; staff add one column of their own, `Status`, and set it to `Active`
once they have verified the applicant's receipt.

## Environment variables

Set these in **`.env.local`** for local dev and in **Vercel → Project →
Settings → Environment Variables** for production. (`.env*` is gitignored, so
these are never committed.)

| Variable | Required | What it is |
|---|---|---|
| `MEMBERS_SHEET_ID` | yes | The **form's responses spreadsheet** ID — the long string in its URL between `/d/` and `/edit`. Not a separate roster. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | yes | The service account address, e.g. `pmafi-members@your-project.iam.gserviceaccount.com`. |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | yes | The `private_key` value from the service-account JSON key file. Keep the `-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n`. Literal `\n` escapes are fine — the code converts them. |
| `MEMBERS_SHEET_RANGE` | no | Defaults to `Membership Applications!A1:Z`. Set it only if the tab is named something else. Note it starts at **row 1** — the header row is what the column mapping reads, not decoration. |

Example `.env.local` (do **not** commit):

```
MEMBERS_SHEET_ID=1AbC...xyz
GOOGLE_SERVICE_ACCOUNT_EMAIL=pmafi-members@your-project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

> In Vercel, paste the private key **with the quotes removed** and real newlines
> are fine too — the code handles both `\n`-escaped and real-newline forms.

## One-time Google setup (free)

1. **Create / pick a Google Cloud project** at <https://console.cloud.google.com>
   (sign in as **pmafi.web@gmail.com**).
2. **Enable the Google Sheets API**: APIs & Services → Library → search
   "Google Sheets API" → **Enable**.
3. **Create a service account**: APIs & Services → Credentials → Create
   credentials → **Service account**. Name it e.g. `pmafi-members`. No roles
   needed (it only reads one sheet you explicitly share).
4. **Make a key**: open the service account → **Keys** → Add key → Create new
   key → **JSON**. A `.json` file downloads — it contains `client_email` and
   `private_key`. Put those into the two env vars above.
5. **Share the responses spreadsheet with the service account**: open the
   membership form's linked responses sheet → **Share** → paste the service
   account email → give it **Viewer** → Send. (No public sharing — this is the
   whole point.)
6. **Add a `Status` column** to the right of the form's own columns. Leave it
   blank for new rows; the site reads blank as Pending.
7. **Set the env vars** locally and in Vercel, then redeploy.

## Columns are found by header text

The site never reads a fixed column position — a responses sheet's layout
belongs to the form, so adding or reordering a question shifts everything after
it. It matches these words in the header row, case-insensitively:

`name` · `email` · `category` · `pma class` · `status` · `timestamp`

Rename a question so its header no longer contains the matched word and lookups
break. If the name or email column cannot be found at all the read throws, so
the page reports a service error rather than telling every member they are not
registered.

Two email columns is normal and both are matched: the form asks for one, and
Google adds its own when a file-upload question forces respondents to sign in.

## Notes

- **Cost:** none. The Sheets API and service accounts are free; the read quota
  (300/min) vastly exceeds a membership check's needs.
- **Privacy:** the full roster never reaches the browser. The server matches one
  email and returns only that record (and only that person's own status).
- **Caching:** the server caches the roster for ~60s, so a newly added member
  may take up to a minute to show as active.
- **Failure handling:** if the sheet read or config fails, the page shows a
  friendly "couldn't check right now" message instead of falsely reporting
  "not a member."
