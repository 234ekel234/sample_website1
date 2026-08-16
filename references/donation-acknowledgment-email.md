# Donation Acknowledgment — staff email template

**Send this the moment a gift is logged in the `Donations` tab**, and always
include the reference code. Nothing on the website is automated: the reference
is minted in the sheet and reaches the donor only because somebody sends this.
Until it does, that donor cannot look up their own giving at all.

**When:** immediately after adding the row and generating the reference with
**PMAFI → Generate reference for selected cells**.

**Who to:** the address in the Email column of the row you just added. It must
match exactly — that is what the donor will type into the lookup.

---

## Before you send — four checks

1. **The reference in this email matches the sheet.** Copy from the cell; do not
   retype it.
2. **The amount and date match the bank or GCash record**, not just what the
   donor told you.
3. **The fund is one of the three** — Professorial Chair Fund, Endowment Fund,
   General Fund — spelled as it is in the sheet.
4. **You have not written anything about tax deductibility.** See the warning at
   the end of this file.

---

## The email

**Subject:** Thank you — your donation to PMAFI (Ref: [REFERENCE])

> Dear [DONOR NAME],
>
> Thank you for supporting the Philippine Military Academy Foundation.
>
> We have received and recorded your donation:
>
>     Amount:      [AMOUNT]
>     Date:        [DATE]
>     Designation: [FUND]
>     Reference:   [REFERENCE]
>
> **Please keep your reference code.** Together with this email address, it lets
> you look up your giving at any time — what you have given, what it was
> designated for, and how far it has moved through our process:
>
>     https://www.pmafi.org/donate/status
>
> You will also see what the funds you support have been doing at the Academy.
>
> Your official receipt [will follow shortly / is attached].
>
> If anything above looks wrong, simply reply to this message and we will look
> into it.
>
> With our thanks,
>
> **Philippine Military Academy Foundation, Inc.**

---

## Variants

### If the gift established a professorial chair or an endowment

Add this after the reference block. It is the brochure's own wording, and it is
the thing those donors most want to hear:

> The principal of your [chair / endowment] will not be spent. Only its earnings
> are used to support the grant, so your gift continues to give year after year.

### If the donor asked to remain anonymous

Add a line so they know it was honoured — people ask precisely because they are
unsure it will be:

> As you requested, your gift will not be acknowledged publicly. Your name will
> not appear in any donor listing or announcement.

### If the donor is also a member

> Your membership status is separate from this, and you can check it any time at
> www.pmafi.org/membership.

---

## What this email must never say

**Do not describe the donation as tax-deductible**, and do not promise a BIR
certificate. PMAFI's donee institution status is still unconfirmed — see
`references/pmafi-information-request.md`. The website deliberately says
"coming soon" on this and the FAQ points donors to their own accountant, so an
email that says otherwise contradicts the site and makes a representation the
Foundation has not confirmed it can make.

An **official receipt** is different and is fine to promise — the Foundation
issues those, and *Receipt issued* is a status the giving lookup already tracks.

---

## Keep the status column moving

The donor sees whichever status the row carries, so update it as things happen:

| Status | What the donor is told |
|---|---|
| `Received` | "Your donation has been received and recorded." |
| `Acknowledged` | "We've sent your acknowledgment." ← set this when you send this email |
| `Receipt issued` | "An official receipt has been issued." |
| `Allocated` | "Your donation has been put to work in the fund you chose." |

A row left on *Received* forever tells a donor nothing has happened since the day
they gave.

---

## If a donor loses their reference

They can ask, and you can read it back from the sheet — but check the request
comes from the address on the row before sending it, since the code plus that
address is what opens their giving history.

There is also a second lookup on `/donate/status` that needs only an email and
sends the summary to that inbox instead of showing it on screen, which is the
proper answer to a lost code. **It is not working yet** — it needs
`RESEND_API_KEY` set (see `.env.example`). Until then, handle these by hand.
