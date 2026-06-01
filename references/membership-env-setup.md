# Membership lookup — environment & service-account setup

The `/membership` status check reads the private members Google Sheet on the
server using a **Google service account** (sheet shared only with that account —
nothing public). `src/lib/members.ts` performs the read.

## Environment variables

Set these in **`.env.local`** for local dev and in **Vercel → Project →
Settings → Environment Variables** for production. (`.env*` is gitignored, so
these are never committed.)

| Variable | Required | What it is |
|---|---|---|
| `MEMBERS_SHEET_ID` | yes | The spreadsheet ID — the long string in the sheet URL between `/d/` and `/edit`. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | yes | The service account address, e.g. `pmafi-members@your-project.iam.gserviceaccount.com`. |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | yes | The `private_key` value from the service-account JSON key file. Keep the `-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n`. Literal `\n` escapes are fine — the code converts them. |
| `MEMBERS_SHEET_RANGE` | no | Defaults to `Members!A2:D`. Only change if you rename the tab or columns move. |

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
5. **Share the members sheet with the service account**: open the
   *PMAFI Members (private roster)* sheet → **Share** → paste the service
   account email → give it **Viewer** → Send. (No public sharing — this is the
   whole point.)
6. **Set the env vars** locally and in Vercel, then redeploy.

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
