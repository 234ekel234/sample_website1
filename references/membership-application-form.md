# PMAFI Membership Application — Google Form Content

Copy-paste this into a new Google Form. Each question lists its **type**,
whether it's **Required**, and its **options / help text**. Set-up notes are at
the bottom — read **"Before you publish"** first, especially the email part.

---

## Form title

> **PMAFI Membership Application**

## Form description (shown under the title)

> Thank you for your interest in joining the **Philippine Military Academy
> Foundation, Inc. (PMAFI)**.
>
> Please complete this form to apply. Applying does **not** require payment yet —
> once we receive your application, our team will verify your details, confirm
> your membership category, and send you an invoice with payment instructions.
> Your membership is finalized only after your payment is confirmed.
>
> Fields marked with an asterisk (*) are required.

---

## Section 1 — Applicant Information

**1. Full name** *
- Type: Short answer
- Required: **Yes**
- Help text: As you'd like it to appear on official PMAFI records.

**2. Email address** *
- Type: Short answer
- Required: **Yes**
- Help text: Use the email you check most often — this is how we'll contact you
  about your application **and** how your membership status is looked up on our
  website. Please make sure it's correct.
- ⚠️ Add response validation → **Text → Email** (forces a valid email format).

**3. Mobile / phone number** *
- Type: Short answer
- Required: **Yes**
- Help text: Include the area/country code if outside the Philippines
  (e.g., 0917 123 4567).

**4. Mailing address**
- Type: Paragraph
- Required: No
- Help text: City and province are enough if you'd prefer not to give a full
  address.

---

## Section 2 — Membership Category

> Section description: PMAFI offers three membership categories. Choose the one
> that best fits your relationship with the Academy. If you're unsure, pick the
> closest option — we'll confirm the right category during review.

**5. Which membership category are you applying for?** *
- Type: Multiple choice
- Required: **Yes**
- Options:
  - **Regular Member** — PMA alumnus, faculty, or staff taking an active role in
    the Foundation's mission.
  - **Associate Member** — PMA alumnus, faculty, or staff supporting the
    Foundation's programs and objectives.
  - **Affiliate Member** — Individual or organization that shares PMAFI's values
    and supports its vision and mission.
  - Not sure — please advise

---

## Section 3 — Your Connection to PMA

> Section description: This helps us verify eligibility and welcome you properly.

**6. What is your relationship to the Philippine Military Academy?** *
- Type: Multiple choice
- Required: **Yes**
- Options:
  - PMA Alumnus / Alumna
  - PMA Faculty
  - PMA Staff
  - Supporter / Friend of the Academy (no direct PMA affiliation)
  - Organization
  - Other…  *(enable the "Other" option)*

**7. PMA Class / Batch (and year graduated)**
- Type: Short answer
- Required: No
- Help text: For alumni — e.g., "PMA Class 1990". Leave blank if not applicable.

**8. Organization name**
- Type: Short answer
- Required: No
- Help text: Affiliate applicants applying on behalf of an organization only.

**9. Current profession / position**
- Type: Short answer
- Required: No

---

## Section 4 — A Few More Details

**10. Why would you like to join PMAFI?**
- Type: Paragraph
- Required: No
- Help text: Optional — tell us what draws you to the Foundation's mission.

**11. How did you hear about PMAFI membership?**
- Type: Multiple choice
- Required: No
- Options:
  - PMAFI website
  - Facebook / social media
  - Referred by a member
  - PMA event or reunion
  - Brochure
  - Other…  *(enable "Other")*

**12. Preferred contact method** *
- Type: Multiple choice
- Required: **Yes**
- Options:
  - Email
  - Phone call
  - Text / SMS
  - Any of the above

**13. Acknowledgment** *
- Type: Checkboxes (use as a single required tick-box)
- Required: **Yes**
- Option:
  - I confirm the information above is accurate, and I understand that
    membership is finalized only after PMAFI confirms my category and my dues
    payment is received.

---

## Confirmation message (Settings → Presentation → "Confirmation message")

> Thank you for applying to PMAFI! We've received your application and will
> review it shortly. You'll hear from us by email or phone with your membership
> category and payment instructions. Welcome — we're glad you want to be part of
> the mission.

---

## Before you publish — IMPORTANT set-up steps

1. **Link responses to a Google Sheet.** In the form's **Responses** tab →
   click the Sheets icon → "Create new spreadsheet." This sheet is what feeds
   the website's member lookup.

2. **Email field must stay clean.** The website matches members by **email**, so
   keep Q2 (the email question) and make sure it has **Email validation** turned
   on. Don't rely on Google's automatic "Collect email addresses" setting alone —
   having it as a visible, validated question keeps the data in a predictable
   column.

3. **Don't require Google sign-in** (unless you want to). Settings → Responses →
   leave "Limit to 1 response" **off** so applicants without a Google account can
   still apply. Turn off "Collect email addresses → Verified" if it forces
   sign-in.

4. **The members sheet (separate from this) needs these columns:** `Email`,
   `Name`, `Category` (Regular/Associate/Affiliate), `Status` (Active/Lapsed).
   When you approve an applicant, copy their Email + Name into that members sheet
   and set Category + Status. (See `references/membership-setup-todo.md`.)

5. **Get the share link.** Click **Send → link (🔗) → Shorten URL** to get a
   `https://forms.gle/...` link. Send me that link and I'll replace the
   placeholder `APPLICATION_FORM_URL` in `src/app/membership/page.tsx`.

6. **Branding (optional).** Theme color gold `#C8A951` and dark navy `#1B2A4A`
   to match the website, and add the PMAFI logo as the form header image.
