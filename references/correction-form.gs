/**
 * PMAFI "Correct my membership record" — Google Form generator
 * ----------------------------------------------------------------------------
 * A member whose name is recorded wrongly uses this to ask staff to fix it.
 *
 * ── WHY THIS FORM EXISTS ─────────────────────────────────────────────────────
 * The digital member ID at /membership/id prints the name exactly as the roster
 * holds it, and the visitor cannot edit it. That is deliberate: a card that
 * says whatever the holder typed is a forgeable credential bearing the
 * Foundation's seal, which is the thing the whole ID gate was built to stop.
 *
 * But the roster is typed by hand — about half of it on the Manual Members tab
 * — so misspellings, missing middle names and wrong class years are ordinary.
 * Without a route to fix them, "we cannot edit your name" is a dead end, and
 * the member either gets a card with someone else's spelling of their name or
 * gives up. This form is that route.
 *
 * ── WHY IT IS A FORM AND NOT A FIELD ON THE SITE ─────────────────────────────
 * The site's service account holds `spreadsheets.readonly` (src/lib/sheets.ts).
 * It CANNOT write to the roster, and that is a deliberate boundary rather than
 * an oversight — a web-facing credential that can edit the membership roster is
 * a much larger risk than a form. Widening the scope to let the site write
 * corrections directly would mean re-sharing the private spreadsheet as Editor
 * and holding a write-capable key in a public-facing app.
 *
 * So a correction is a REQUEST, reviewed by a person, and the roster stays
 * something only staff can change. Do not "improve" this into a direct write.
 *
 * ── WHY IT HAS NO FILE UPLOAD ────────────────────────────────────────────────
 * Same reason as the donation form: one file-upload question gates the ENTIRE
 * form behind a Google sign-in. A member correcting a typo should not have to
 * hold a Google account. If staff need proof for a substantive change — a legal
 * name change rather than a misspelling — they can ask by email when they
 * review the request.
 *
 * ── IF THIS FORM ALREADY EXISTS, DO NOT RE-RUN THIS ──────────────────────────
 * This file CREATES a form; it does not edit one. Running it again mints a
 * SECOND form with a different link, leaving the responses already collected
 * behind on the first and breaking the link in the content sheet.
 *
 * A question added to this file after the form was built — the mobile number
 * below was added on 2026-09-19 — therefore has to be added to the live form by
 * hand: open the EDIT link, add a short-answer question titled exactly "Mobile
 * number", leave it optional, and drag it under the email question. The
 * responses sheet gains a column and nothing else changes.
 *
 * ── HOW TO RUN (≈1 minute) ───────────────────────────────────────────────────
 *   1. Sign in to the pmafi.web@gmail.com Google account.
 *   2. Go to  https://script.google.com  → "New project".
 *   3. Delete the sample code, paste THIS whole file in.
 *   4. Click "Run" (▶). Approve the permission prompt the first time.
 *   5. Open "Execution log" — it prints the EDIT link and the public link.
 *   6. Link its responses to a sheet: in the form, Responses → the Sheets icon.
 *      Point it at the PRIVATE spreadsheet and rename the tab it creates to
 *      **Correction Requests**. Google names it "Form Responses N", which is
 *      positional and gets reassigned when a form is recreated — the same trap
 *      that once had the membership check pointed at the wrong tab.
 *   7. Put the public link in the content sheet under the key `form.correction`.
 *      The ID page then shows "Request a correction"; leave it blank and the
 *      control is hidden entirely rather than rendered dead.
 *
 * ── OPTIONAL: PREFILL THE EMAIL ──────────────────────────────────────────────
 * `form.correction` also accepts a PREFILL TEMPLATE, exactly as `form.contact`
 * does — the public link with the email question pre-addressed, carrying the
 * literal text PMAFI_EMAIL_HERE where the address belongs. The ID page swaps in
 * the address the member gave the gate (src/lib/form-prefill.ts), which is
 * worth doing because staff find the row BY EMAIL and that address is the one
 * thing on this form that is certainly right — it is the member's NAME that the
 * record has wrong.
 *
 * To build one: open the form → ⋮ menu → "Get pre-filled link" → type
 * PMAFI_EMAIL_HERE into the email question → "Get link" → copy. The plain link
 * keeps working either way; the site finds no token and leaves it alone.
 *
 * ── WHAT STAFF DO WITH A RESPONSE ────────────────────────────────────────────
 * Find the member by the email on the request — that is the roster's key, and
 * it is what identifies the row regardless of how the name is spelled. Correct
 * the name on whichever tab holds them (Membership Applications, or Manual
 * Members). Then reply to say it is done and the member can download their card
 * again.
 *
 * NOTE THE MEMBER NUMBER DOES NOT CHANGE. It is derived from the EMAIL, not the
 * name (src/lib/member-id.ts), precisely so that fixing a spelling does not
 * silently reissue somebody a different number. A corrected card carries the
 * same number as the old one.
 */

// Where a member is told to write if their question is not a name correction.
// PMAFI's published address — NOT the pmafi.web@gmail.com account that owns
// this form.
var CONTACT_EMAIL = 'PMAFI_PMA@yahoo.com';

function createPmafiCorrectionForm() {
  var form = FormApp.create('PMAFI — Correct my membership record');

  form.setDescription(
    'If your name, PMA class or membership category is recorded incorrectly, ' +
    'tell us here and we will put it right.\n\n' +
    'Your digital member ID prints your details exactly as our records hold ' +
    'them, which is what makes the card trustworthy — so the card cannot be ' +
    'edited, and the record is corrected instead.\n\n' +
    'Once we have made the change you can download your card again. Your ' +
    'member number will not change.'
  );

  // NO setCollectEmail(true) and no file upload: either would require a Google
  // sign-in for the whole form. See the note at the top of this file.
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);

  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .setHelpText('Please enter a valid email address.')
    .build();

  // ---- Identify the row ----
  form.addSectionHeaderItem()
    .setTitle('Finding your record')
    .setHelpText(
      'We look you up by email address, because that is what identifies your ' +
      'record no matter how your name is spelled in it.'
    );

  form.addTextItem()
    .setTitle('Email address on your membership')
    .setHelpText(
      'The address you registered with, or the one PMAFI has on file for you. ' +
      'If you are not sure, give us your usual address and we will search.'
    )
    .setValidation(emailValidation)
    .setRequired(true);

  // ASKED, NOT REQUIRED — deliberately, and differently from the contact-update
  // form where the number is the whole point. This form exists because the
  // Foundation's record of somebody's NAME is wrong, usually through a typo at
  // our end. Making a member surrender a phone number before we will fix our
  // own mistake puts the friction on the wrong party, and a member who declines
  // would be left with a card spelling their name incorrectly. So it is offered
  // here as a convenience for the reply, and pressed for properly on the
  // contact-update form, which a member opens by choice.
  form.addTextItem()
    .setTitle('Mobile number')
    .setHelpText(
      'Optional. The quickest way for us to reach you if we have a question ' +
      'about the correction. Philippine mobile, e.g. 0917 123 4567.'
    );

  form.addTextItem()
    .setTitle('Name as it currently appears')
    .setHelpText(
      'Copy it from your member ID card or the membership check, exactly as ' +
      'shown — including any misspelling. This is how we find the row.'
    )
    .setRequired(true);

  // ---- The correction ----
  form.addPageBreakItem()
    .setTitle('What should it say?')
    .setHelpText('Tell us only what needs changing; leave the rest blank.');

  form.addTextItem()
    .setTitle('Correct full name')
    .setHelpText(
      'Exactly as it should appear on your ID card, including middle name or ' +
      'initial and any suffix (Jr., Sr., III).'
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('Correct PMA class year')
    .setHelpText(
      'Optional — only if the class year is also wrong or missing. Four ' +
      'digits, e.g. 1988.'
    );

  form.addParagraphTextItem()
    .setTitle('Anything else we should know')
    .setHelpText(
      'Optional. For example, if your name changed legally rather than being ' +
      'mistyped, or if your membership category looks wrong.'
    );

  form.setConfirmationMessage(
    'Thank you — we have your request.\n\n' +
    'A member of the Foundation will check it against our records and correct ' +
    'them. We will email you when it is done, and you can then download your ' +
    'member ID again with the corrected details.\n\n' +
    'Your member number stays the same.\n\n' +
    'For anything else, write to ' + CONTACT_EMAIL + '.'
  );

  Logger.log('EDIT this form:   %s', form.getEditUrl());
  Logger.log('PUBLIC link:      %s', form.getPublishedUrl());
  Logger.log('');
  Logger.log('Put the PUBLIC link in the content sheet under: form.correction');
}
