/**
 * PMAFI "Tell us about your donation" — Google Form generator
 * ----------------------------------------------------------------------------
 * A donor who has already sent a gift uses this to tell PMAFI it happened.
 *
 * ── WHY THIS FORM EXISTS ─────────────────────────────────────────────────────
 * A bank transfer reaches PMAFI as a name and an amount. It carries no email
 * address to acknowledge to and no indication of which fund the donor meant, so
 * without this the Foundation cannot write back, cannot issue a receipt to the
 * right person, and cannot fill in the Donations log that /donate/status reads.
 *
 * ── WHY IT HAS NO FILE UPLOAD ────────────────────────────────────────────────
 * This is the important difference from the membership application, and it is
 * deliberate.
 *
 * ITS JOB IS ATTRIBUTION, NOT VERIFICATION. For membership, a receipt gates a
 * benefit — you must prove you paid to become a member. For a donation, PMAFI's
 * own bank statement IS the proof; what is missing is who sent it and how to
 * reach them. Nothing here needs a document.
 *
 * That matters because Google gates an ENTIRE form behind a sign-in as soon as
 * it carries one file-upload question — not just that question. A membership
 * applicant is committed and has already paid dues, so the friction is
 * survivable. A donor is often a one-time visitor with no relationship to the
 * Foundation, and requiring a Google account to report a gift they have already
 * made is friction that costs donations outright.
 *
 * DO NOT ADD A FILE UPLOAD HERE. If a donor wants to send proof, the closing
 * text invites them to email it.
 *
 * ── HOW TO RUN (≈1 minute) ───────────────────────────────────────────────────
 *   1. Sign in to the pmafi.web@gmail.com Google account.
 *   2. Go to  https://script.google.com  → "New project".
 *   3. Delete the sample code, paste THIS whole file in.
 *   4. Click "Run" (▶). Approve the permission prompt the first time.
 *   5. Open "Execution log" — it prints the EDIT link and the public link.
 *   6. Link its responses to a sheet: in the form, Responses → the Sheets icon.
 *   7. Put the public link in the content sheet under the key `form.donation`.
 *      The donate page then shows "Tell us about your gift" instead of asking
 *      the donor to write an email. Leave it blank and the page keeps the
 *      email instruction — nothing breaks either way.
 *
 * ── WHAT STAFF DO WITH A RESPONSE ────────────────────────────────────────────
 * Match it against the bank or GCash statement, then add a row to the
 * Donations tab (references/donations-sheet.gs) with a generated reference.
 * The response sheet is the working queue; the Donations tab is what the
 * website reads. See references/donations-sheet-setup.md.
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
// Must match src/lib/funds.ts. A gift filed under one of these joins to that
// fund's updates on /donate/status; anything else only matches if the Fund
// Updates tab spells it identically.
var FUNDS = [
  'General Fund — use it wherever it is needed most',
  'Professorial Chair Fund',
  'Endowment Fund'
];

var CONTACT_EMAIL = 'pmafi.web@gmail.com';

function createPmafiDonationForm() {
  var form = FormApp.create('PMAFI — Tell us about your donation');

  form.setDescription(
    'Thank you for supporting the Philippine Military Academy Foundation, Inc.\n\n' +
    'If you have already sent a donation, this short form tells us it arrived ' +
    'from you. A bank transfer reaches us as a name and an amount — it does ' +
    'not tell us how to reach you, or which fund you meant it for.\n\n' +
    'It takes about a minute, and there is nothing to upload.\n\n' +
    'Once we have matched your gift we will send you an acknowledgment with a ' +
    'reference code, which lets you look your giving up at any time on our ' +
    'website.'
  );

  // NO setCollectEmail(true): that would require respondents to sign in, and
  // the whole point of this form is that a donor need not have a Google
  // account. The email question below is asked plainly instead.
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);

  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .setHelpText('Please enter a valid email address.')
    .build();

  // ---- Who ----
  form.addSectionHeaderItem().setTitle('About you');

  form.addTextItem()
    .setTitle('Full name')
    .setHelpText('As it should appear on your acknowledgment and receipt.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email address')
    .setHelpText(
      'This is how we acknowledge your gift, and it is what you will use to ' +
      'look up your giving on our website later. Please check it carefully — ' +
      'a typo here means we cannot reach you.'
    )
    .setValidation(emailValidation)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Mobile / phone number')
    .setHelpText('Optional, in case we need to reach you quickly.');

  // ---- What ----
  form.addPageBreakItem()
    .setTitle('About your gift')
    .setHelpText('This is what lets us match your donation to our records.');

  form.addTextItem()
    .setTitle('Amount')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Date sent')
    .setHelpText('e.g., 15 March 2026.')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('How did you send it?')
    .setChoiceValues(['Bank transfer / deposit', 'GCash'])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Bank or GCash transaction number')
    .setHelpText(
      'Optional, but it is the quickest way for us to find your gift. This is ' +
      'the number on YOUR receipt from the bank or GCash — not a PMAFI ' +
      'reference. We issue that afterwards.'
    );

  form.addMultipleChoiceItem()
    .setTitle('Which fund would you like it to support?')
    .setChoiceValues(FUNDS)
    .setRequired(true);

  // ---- Anything else ----
  form.addPageBreakItem().setTitle('Anything else');

  form.addParagraphTextItem()
    .setTitle('In whose honour or memory, or any message')
    .setHelpText('Optional. Tell us if this gift marks someone or something.');

  form.addMultipleChoiceItem()
    .setTitle('May we acknowledge you publicly?')
    .setChoiceValues([
      'Yes, you may name me',
      'No, please keep my gift anonymous'
    ])
    .setRequired(true);

  form.setConfirmationMessage(
    'Thank you — we have your details and will match your gift against our ' +
    'records.\n\n' +
    'You will receive an acknowledgment by email with a reference code. Keep ' +
    'it: with your email address it lets you look up your giving any time at ' +
    'www.pmafi.org/donate/status, and see what the funds you support have ' +
    'been doing.\n\n' +
    'If you would like to send us a copy of your receipt, email it to ' +
    CONTACT_EMAIL + '. It is not required.'
  );

  Logger.log('EDIT this form here:   ' + form.getEditUrl());
  Logger.log('PUBLIC (share) link:   ' + form.getPublishedUrl());
  Logger.log('');
  Logger.log('Next: Responses -> link to a sheet, then put the PUBLIC link');
  Logger.log('into the content sheet under the key  form.donation');
}
