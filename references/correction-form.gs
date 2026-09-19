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
 * ── STATE: BUILT ON 2026-09-19. DO NOT RUN THIS FILE AGAIN ───────────────────
 * The form exists:
 *   edit   https://docs.google.com/forms/d/1d0AR1wNtBIyQV8vSf6Ndi4rI-d992kjTA2J_MbkIaaU/edit
 *   public https://docs.google.com/forms/d/e/1FAIpQLScxrggANQyW1paFhNZ1bS4dRz_VYWc59PTg3ucWHMkg7J2DyA/viewform
 *
 * Its email question is entry.1281028009, which is what the prefill template in
 * the content sheet under `form.correction` substitutes into. Everything below
 * is now a RECORD of what was created, not a thing to run — change the live
 * form by hand and mirror the change here.
 *
 * ── WHY RE-RUNNING WOULD BE DESTRUCTIVE ──────────────────────────────────────
 * This file CREATES a form; it does not edit one. Running it again mints a
 * SECOND form with a different link, leaving the responses already collected
 * behind on the first and breaking the link in the content sheet.
 *
 * So a question added to this file from now on has to be added to the live form
 * by hand: open the EDIT link above, add the question with exactly the title
 * used here, and drag it into the same position. The responses sheet gains a
 * column and nothing else changes.
 *
 * ── HOW IT WAS RUN, KEPT FOR THE NEXT FORM ───────────────────────────────────
 * These steps are history for this file. They are left in because the next
 * generator written here will need them, and because steps 6 and 7 are what
 * make a form reachable rather than merely existing.
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
 *   7. Put the PREFILL TEMPLATE the log prints into the content sheet under the
 *      key `form.correction` — not the plain public link, unless the script
 *      warned it could not build one. The ID page then shows "Request a
 *      correction"; leave the key blank and the control is hidden entirely
 *      rather than rendered dead.
 *
 * ── THE PREFILL TEMPLATE, WHICH THIS SCRIPT BUILDS FOR YOU ───────────────────
 * `form.correction` accepts a PREFILL TEMPLATE, exactly as `form.contact` does
 * — the public link with the email question pre-addressed, carrying the literal
 * text PMAFI_EMAIL_HERE where the address belongs. The ID page swaps in the
 * address the member gave the gate (src/lib/form-prefill.ts). That is worth
 * having because staff find the row BY EMAIL and that address is the one thing
 * on this form that is certainly right — it is the member's NAME that the
 * record has wrong.
 *
 * The execution log prints the template ready to paste; prefer it over the
 * plain PUBLIC link. Build it by hand only if the script warns that it could
 * not: open the form → ⋮ menu → "Get pre-filled link" → type PMAFI_EMAIL_HERE
 * into the email question → "Get link" → copy. The plain link keeps working
 * either way; the site finds no token and leaves the URL alone.
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

// Must match EMAIL_TOKEN in src/lib/form-prefill.ts. If you change one, change
// both — the site substitutes on this exact string and leaves any other URL
// alone.
var EMAIL_TOKEN = 'PMAFI_EMAIL_HERE';

// Seeded into the email question only to find out what Google calls that field
// in a prefilled URL, then swapped straight back out for the token. It never
// reaches a member and is never submitted.
var TEMPLATE_SEED = 'prefill.seed@example.com';

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

  // Held in a variable because the prefill template at the foot of this
  // function is built by pre-addressing THIS question.
  var emailItem = form.addTextItem()
    .setTitle('Email address on your membership')
    .setHelpText(
      'The address you registered with, or the one PMAFI has on file for you. ' +
      'If you are not sure, give us the email you use and we will use that ' +
      'one to find you.'
    )
    .setValidation(emailValidation)
    .setRequired(true);

  // REQUIRED, by decision on 2026-09-19. It was optional until then, on the
  // reasoning that this form exists because the Foundation's record of
  // somebody's NAME is wrong — usually a typo at our end — so demanding a phone
  // number before we will fix our own mistake puts the friction on the wrong
  // party. PMAFI chose to require it anyway: a correction needs a conversation
  // often enough that a request with no way to reach the member stalls, and the
  // roster's numbers are patchy enough that this is a real chance to get one.
  //
  // WHAT THAT COSTS, so nobody re-litigates it blind: a member unwilling to
  // give a number cannot file a correction at all, and is left holding a card
  // that spells their name wrong. The confirmation message and the ID page both
  // give PMAFI's email address, which is the only route left for them.
  form.addTextItem()
    .setTitle('Mobile number')
    .setHelpText(
      'So we can reach you quickly if we have a question about the ' +
      'correction. Philippine mobile, e.g. 0917 123 4567. If you would rather ' +
      'not give a number, write to ' + CONTACT_EMAIL + ' instead.'
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('Name as it currently appears')
    .setHelpText(
      'Copy it from your member ID card or the membership check, exactly as ' +
      'shown — including any misspelling. This is how we find the row.'
    )
    .setRequired(true);

  // ---- The correction ----
  // The help text here used to read "tell us only what needs changing; leave
  // the rest blank", with a REQUIRED field directly beneath it. Give us the
  // name either way: it is what the card prints and what staff correct, and a
  // member who leaves it blank has told us something is wrong without saying
  // what it should be.
  form.addPageBreakItem()
    .setTitle('What should it say?')
    .setHelpText(
      'Give us your full name as it should appear, even if only the class ' +
      'year is wrong — it is what your card prints. Leave anything that is ' +
      'already correct blank.'
    );

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

  // CHOICES, NOT FREE TEXT, and worded exactly as the application form words
  // them — src/lib/members.ts normalizeCategory() matches on the words
  // "regular", "associate" and "affiliate" appearing in the cell, so a member
  // typing "Lifetime" or "Full" gives staff something that silently normalises
  // to Affiliate when it reaches the roster.
  //
  // This is here because a miscategorised member is a real case rather than a
  // hypothetical one: the application form offers "Not sure — please advise",
  // and that answer contains none of the three words, so it ALSO lands as
  // Affiliate. Anyone who picked it is on the roster under a category nobody
  // chose, and until now had only a free-text box to say so.
  //
  // No fee consequence to check: the ₱3,000 is flat across all three
  // categories, so this cannot be used to argue a different amount was owed.
  form.addMultipleChoiceItem()
    .setTitle('Correct membership category')
    .setHelpText(
      'Optional — only if your category is wrong. Categories go by your ' +
      'relationship with the Academy, not by what you paid; the fee is the ' +
      'same for all three.'
    )
    .setChoiceValues([
      'Regular Member — PMA alumnus, faculty, or staff taking an active role ' +
        "in the Foundation's mission",
      'Associate Member — PMA alumnus, faculty, or staff supporting the ' +
        "Foundation's programs and objectives",
      "Affiliate Member — Individual or organization that shares PMAFI's " +
        'values and supports its vision and mission'
    ]);

  // NOTE THERE IS NO "correct my membership STATUS" QUESTION, deliberately.
  // Standing is Active/Pending/Lapsed and it records whether staff have
  // VERIFIED A PAYMENT — so a member setting it is not correcting a typo, they
  // are asserting they paid, and this form carries no receipt because it has no
  // file upload on purpose. A blank status already means Pending, so a new
  // applicant who has simply not been reached yet would be the commonest user
  // of such a field, and it would turn a typo queue into an unevidenced
  // payments queue. Those go to PMAFI by email, or through the box below.
  form.addParagraphTextItem()
    .setTitle('Anything else we should know')
    .setHelpText(
      'Optional. For example, if your name changed legally rather than being ' +
      'mistyped, or if your membership standing looks wrong to you.'
    );

  form.setConfirmationMessage(
    'Thank you — we have your request.\n\n' +
    'A member of the Foundation will check it against our records and correct ' +
    'them. We will email you when it is done, and you can then download your ' +
    'member ID again with the corrected details.\n\n' +
    'Your member number stays the same.\n\n' +
    'For anything else, write to ' + CONTACT_EMAIL + '.'
  );

  // ---- Links ----
  //
  // The prefill template is built by pre-addressing the email question with a
  // seed address and substituting the token into the URL that comes back. Doing
  // it here rather than through the form's "Get pre-filled link" menu matters
  // because this file cannot be re-run once the form exists — the UI route
  // would be the only one left, and it is easy to skip.
  var seeded = form.createResponse()
    .withItemResponse(emailItem.createResponse(TEMPLATE_SEED))
    .toPrefilledUrl();
  // BOTH SPELLINGS OF THE SEED, because Google uses either. Running the
  // contact-update generator on 2026-09-19 returned the seed with its "@"
  // UNENCODED — entry.1486247649=prefill.seed@example.com — so looking only for
  // the percent-encoded form found nothing and the warning below fired on a
  // form that was otherwise perfectly good. The encoded variant is tried first;
  // neither string is a substring of the other, so they cannot interfere.
  var template = seeded
    .split(encodeURIComponent(TEMPLATE_SEED)).join(EMAIL_TOKEN)
    .split(TEMPLATE_SEED).join(EMAIL_TOKEN);

  Logger.log('EDIT this form:   %s', form.getEditUrl());
  Logger.log('PUBLIC link:      %s', form.getPublishedUrl());
  Logger.log('');
  Logger.log('PREFILL TEMPLATE — this is the one for the content sheet:');
  Logger.log('%s', template);
  Logger.log('');
  Logger.log('Put it in the content sheet under: form.correction');
  Logger.log('It must still contain the text %s when you paste it.', EMAIL_TOKEN);

  if (template.indexOf(EMAIL_TOKEN) === -1) {
    // Google changed how the seed is encoded. The plain public link is still
    // correct and still works — it just opens the form blank.
    Logger.log('');
    Logger.log('WARNING: could not build the prefill template (the seed address');
    Logger.log('was encoded unexpectedly). Use the PUBLIC link above instead —');
    Logger.log('the site handles a plain link and simply does not prefill.');
  }
}
