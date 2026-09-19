/**
 * PMAFI "Update my contact details" — Google Form generator
 * ----------------------------------------------------------------------------
 * A member gives the Foundation a current email address and mobile number.
 *
 * ── WHY THIS FORM EXISTS ─────────────────────────────────────────────────────
 * PMAFI's contact details for its own members are patchy and ageing. Roughly
 * half the roster sits on the Manual Members tab, typed in by staff, where
 * there may be no phone number at all; the other half applied through the
 * membership form, so their number is exactly as old as their application.
 * There has been no way for a member to correct either without writing in.
 *
 * ── WHY IT IS ASKED ON THE ID PAGE ───────────────────────────────────────────
 * /membership/id is the one place the Foundation knows it is looking at a real
 * member, doing something they came to do, at the moment they have just been
 * shown what the roster holds about them. That is a far better moment to ask
 * than a banner on a page somebody is trying to read.
 *
 * IT IS ASKED, NOT REQUIRED. The card downloads either way. The ID is a
 * membership benefit the roster already entitles them to, not a trade for
 * personal data — and nothing here can be verified anyway, so a member who
 * would rather not give a number would simply type digits. That collects worse
 * data, not more.
 *
 * ── WHY IT IS A FORM AND NOT A FIELD ON THE SITE ─────────────────────────────
 * Same boundary as the correction form. The site's service account holds
 * `spreadsheets.readonly` (src/lib/sheets.ts) and CANNOT write. That is
 * deliberate: a web-facing credential able to edit the membership roster is a
 * much larger risk than a form. Do not "improve" this into a direct write.
 *
 * It also keeps the collection PMAFI's rather than the website's — the same
 * footing as the membership application form — which matters while the site
 * still has no privacy policy of its own. See STATUS.md.
 *
 * ── WHY IT HAS NO FILE UPLOAD AND DOES NOT COLLECT THE GOOGLE EMAIL ──────────
 * Either one gates the WHOLE form behind a Google sign-in. A member updating a
 * phone number should not need a Google account — and a large share of this
 * roster does not have one.
 *
 * ── HOW TO RUN (≈2 minutes) ──────────────────────────────────────────────────
 *   1. Sign in to the pmafi.web@gmail.com Google account.
 *   2. Go to  https://script.google.com  → "New project".
 *   3. Delete the sample code, paste THIS whole file in.
 *   4. Click "Run" (▶). Approve the permission prompt the first time.
 *   5. Open "Execution log" — it prints the EDIT link, the PUBLIC link and a
 *      PREFILL TEMPLATE.
 *   6. Link its responses to a sheet: in the form, Responses → the Sheets icon.
 *      Point it at the PRIVATE spreadsheet and rename the tab it creates to
 *      **Contact Updates**. Google names it "Form Responses N", which is
 *      positional and gets reassigned when a form is recreated — the same trap
 *      that once had the membership check pointed at the wrong tab.
 *   7. Put the PREFILL TEMPLATE in the content sheet under `form.contact`.
 *
 * ── WHICH LINK GOES IN THE SHEET ─────────────────────────────────────────────
 * Prefer the PREFILL TEMPLATE. It is the ordinary public link with the email
 * question pre-addressed, carrying the literal text PMAFI_EMAIL_HERE where the
 * address belongs; the site swaps in the address the member already gave the
 * ID gate (src/lib/form-prefill.ts). That matters because staff match a
 * response to a member BY EMAIL — it is the roster's key — and an address
 * retyped from memory is the one that arrives wrong.
 *
 * The plain PUBLIC link also works. The site finds no token, leaves the URL
 * alone, and the form opens blank. Nothing breaks; the member just types more.
 *
 * ── WHAT STAFF DO WITH A RESPONSE ────────────────────────────────────────────
 * Find the member by the email on the request. Update the phone and email
 * columns on whichever tab holds them (Membership Applications, or Manual
 * Members). The site reads NEITHER column — only name, email, category, status,
 * PMA class and timestamp are mapped — so this is for the Foundation's own
 * records and its own correspondence, not for anything the website displays.
 *
 * IF THE EMAIL DOES NOT MATCH ANY ROW, that is the interesting case rather than
 * a broken one: it usually means the member is telling you their address has
 * changed. The name and class year are there to find them by. Update the email
 * column, and note that the member's ID number is derived from the email
 * (src/lib/member-id.ts) — changing it reissues a different number, which is
 * unlike a name correction, where the number deliberately stays the same.
 */

// PMAFI's published address — NOT the pmafi.web@gmail.com account that owns
// this form.
var CONTACT_EMAIL = 'PMAFI_PMA@yahoo.com';

// Must match EMAIL_TOKEN in src/lib/form-prefill.ts. If you change one, change
// the other, and repaste the template into the content sheet.
var EMAIL_TOKEN = 'PMAFI_EMAIL_HERE';

// A valid-looking address used only to mint the prefill template, then swapped
// out for the token below. Going through a real address avoids relying on how
// Apps Script treats a response that would fail the question's own email
// validation.
var TEMPLATE_SEED = 'prefill.seed@example.com';

function createPmafiContactUpdateForm() {
  var form = FormApp.create('PMAFI — Update my contact details');

  form.setDescription(
    'Help the Foundation keep in touch with you.\n\n' +
    'We use your email address and mobile number to reach members about ' +
    'membership matters and Academy news. If either has changed — or we have ' +
    'never had your number — tell us here.\n\n' +
    'This is entirely optional and is not needed to download your member ID.'
  );

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
      'record in the Foundation\'s files.'
    );

  var emailItem = form.addTextItem()
    .setTitle('Email address on your membership')
    .setHelpText(
      'The address PMAFI has on file for you. If you came here from your ' +
      'member ID page this is filled in already — leave it as it is.'
    )
    .setValidation(emailValidation)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Full name')
    .setHelpText(
      'As it appears on your member ID card. This is how we find you if your ' +
      'email address has changed since you registered.'
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('PMA class year')
    .setHelpText('Optional. Four digits, e.g. 1988. Helps us find the right record where two members share a name.');

  // ---- The details ----
  form.addPageBreakItem()
    .setTitle('Your current details')
    .setHelpText('Give us whichever of these is new. Leave anything unchanged as it is.');

  form.addTextItem()
    .setTitle('Mobile number')
    .setHelpText(
      'Philippine mobile, e.g. 0917 123 4567 or +63 917 123 4567. This is the ' +
      'number the Foundation will use to reach you.'
    )
    .setRequired(true);

  form.addTextItem()
    .setTitle('Preferred email address, if different from above')
    .setHelpText(
      'Optional. Only if you would rather we wrote to a different address ' +
      'from the one your membership is filed under.'
    )
    .setValidation(emailValidation);

  form.addParagraphTextItem()
    .setTitle('Anything else we should know')
    .setHelpText('Optional — a new postal address, or the best time to call.');

  form.setConfirmationMessage(
    'Thank you — we have your details.\n\n' +
    'A member of the Foundation will update your record. There is nothing ' +
    'further for you to do, and your member ID is unaffected.\n\n' +
    'For anything else, write to ' + CONTACT_EMAIL + '.'
  );

  // ---- Links ----
  //
  // The prefill template is built by pre-addressing the email question with a
  // seed address and then substituting the token into the URL that comes back.
  var seeded = form.createResponse()
    .withItemResponse(emailItem.createResponse(TEMPLATE_SEED))
    .toPrefilledUrl();
  var template = seeded.replace(encodeURIComponent(TEMPLATE_SEED), EMAIL_TOKEN);

  Logger.log('EDIT this form:    %s', form.getEditUrl());
  Logger.log('PUBLIC link:       %s', form.getPublishedUrl());
  Logger.log('');
  Logger.log('PREFILL TEMPLATE — this is the one for the content sheet:');
  Logger.log('%s', template);
  Logger.log('');
  Logger.log('Put it in the content sheet under: form.contact');
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
