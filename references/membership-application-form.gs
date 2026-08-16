/**
 * PMAFI Membership Application — Google Form generator
 * --------------------------------------------------------------
 * This builds the whole membership application form automatically.
 *
 * FLOW THIS FORM IMPLEMENTS (pay-first):
 *   applicant pays their dues → applies here with the receipt attached →
 *   staff verify the receipt → membership goes Active.
 *
 * That is the reverse of the older apply-first flow, where PMAFI invoiced
 * after reviewing. The website mirrors whichever flow is live, driven by
 * canPayFirst() in src/lib/content.ts — it only shows pay-first instructions
 * once the dues figures AND a payment channel are filled into the content
 * sheet. Publish this form's pay-first wording at the same time you fill
 * those in, or applicants will be told to pay an amount the site cannot show.
 *
 * HOW TO RUN (≈1 minute):
 *   1. Sign in to the pmafi.web@gmail.com Google account.
 *   2. Go to  https://script.google.com  → "New project".
 *   3. Delete the sample code, paste THIS whole file in.
 *   4. Set DUES_* and PAYMENT_* below to the confirmed figures.
 *   5. Click "Run" (▶). Approve the permission prompt the first time
 *      (it only edits Forms it creates).
 *   6. Open "Execution log" — it prints the form's EDIT link and the
 *      public (viewform) link. Use the public link on the website.
 *
 * ⚠ STEP 7 IS MANUAL AND THE FORM DOES NOT WORK WITHOUT IT.
 *   Apps Script CANNOT create a file-upload question — there is no
 *   addFileUploadItem(), and setRequireLogin() is deprecated. After running
 *   this, open the form in the Forms editor and add the receipt question by
 *   hand:
 *     • Add question → change the type to "File upload"
 *     • Title:    Proof of payment
 *     • Help:     A screenshot or photo of your deposit slip, bank transfer
 *                 confirmation, or GCash receipt.
 *     • Allow:    Image, PDF   •   Max files: 1   •   Max size: 10 MB
 *     • Required: yes
 *     • Place it in the "Payment" section this script creates (last section).
 *   Google will warn that respondents must sign in to a Google account to
 *   upload. That is unavoidable for file uploads and is the tradeoff accepted
 *   when this flow was chosen — see the note in membership-setup-todo.md.
 *
 * To change the form later, edit it normally in Google Forms — you
 * don't need to re-run this. Re-running creates a brand-new form.
 */

// ── CONFIRMED FIGURES — fill these in before running ─────────────────────────
// Leave any as '' and the form simply omits that line rather than printing a
// blank. Same rule as the website: never invent a figure or an account number.
var DUES_REGULAR   = '';   // e.g. 'PHP 2,000 per year'
var DUES_ASSOCIATE = '';
var DUES_AFFILIATE = '';
var PAYMENT_BANK   = '';   // e.g. 'BDO — PMAFI Inc. — 1234 5678 9012'
var PAYMENT_GCASH  = '';   // e.g. 'GCash — PMAFI — 0917 123 4567'

/** Build the "what to pay and where" block, omitting anything unconfirmed. */
function paymentInstructions_() {
  var lines = [];
  if (DUES_REGULAR)   lines.push('  • Regular Member:   ' + DUES_REGULAR);
  if (DUES_ASSOCIATE) lines.push('  • Associate Member: ' + DUES_ASSOCIATE);
  if (DUES_AFFILIATE) lines.push('  • Affiliate Member: ' + DUES_AFFILIATE);
  var dues = lines.length ? 'Membership dues:\n' + lines.join('\n') + '\n\n' : '';

  var channels = [];
  if (PAYMENT_BANK)  channels.push('  • ' + PAYMENT_BANK);
  if (PAYMENT_GCASH) channels.push('  • ' + PAYMENT_GCASH);
  var where = channels.length
    ? 'Pay to:\n' + channels.join('\n') + '\n\n'
    : '';

  return dues + where;
}

function createPmafiMembershipForm() {
  var form = FormApp.create('PMAFI Membership Application');

  form.setDescription(
    'Thank you for your interest in joining the Philippine Military Academy ' +
    'Foundation, Inc. (PMAFI).\n\n' +
    'BEFORE YOU START: please settle your membership dues and have your ' +
    'receipt ready — you will be asked to attach it at the end of this form. ' +
    'Applying and paying in one go means there is no invoice to wait for.\n\n' +
    paymentInstructions_() +
    'Your membership is finalized once our team has verified your payment.\n\n' +
    'Fields marked with an asterisk (*) are required.'
  );

  // File uploads require a signed-in Google account, so collecting the email
  // is free at that point and gives staff a reliable reply-to.
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);

  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .setHelpText('Please enter a valid email address.')
    .build();

  // ---- Section 1: Applicant Information ----
  form.addSectionHeaderItem().setTitle('Applicant Information');

  form.addTextItem()
    .setTitle('Full name')
    .setHelpText("As you'd like it to appear on official PMAFI records.")
    .setRequired(true);

  form.addTextItem()
    .setTitle('Email address')
    .setHelpText(
      "Use the email you check most often — this is how we'll contact you " +
      'about your application and how your membership status is looked up on ' +
      "our website. Please make sure it's correct."
    )
    .setValidation(emailValidation)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Mobile / phone number')
    .setHelpText('Include the area/country code if outside the Philippines ' +
      '(e.g., 0917 123 4567).')
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Mailing address')
    .setHelpText("City and province are enough if you'd prefer not to give a " +
      'full address.');

  // ---- Section 2: Membership Category ----
  form.addPageBreakItem()
    .setTitle('Membership Category')
    .setHelpText(
      'PMAFI offers three membership categories. Choose the one that best ' +
      "fits your relationship with the Academy. If you're unsure, pick the " +
      "closest option — we'll confirm the right category during review."
    );

  form.addMultipleChoiceItem()
    .setTitle('Which membership category are you applying for?')
    .setChoiceValues([
      'Regular Member — PMA alumnus, faculty, or staff taking an active role ' +
        "in the Foundation's mission",
      'Associate Member — PMA alumnus, faculty, or staff supporting the ' +
        "Foundation's programs and objectives",
      "Affiliate Member — Individual or organization that shares PMAFI's " +
        'values and supports its vision and mission',
      'Not sure — please advise'
    ])
    .setRequired(true);

  // ---- Section 3: Connection to PMA ----
  form.addPageBreakItem()
    .setTitle('Your Connection to PMA')
    .setHelpText('This helps us verify eligibility and welcome you properly.');

  form.addMultipleChoiceItem()
    .setTitle('What is your relationship to the Philippine Military Academy?')
    .setChoiceValues([
      'PMA Alumnus / Alumna',
      'PMA Faculty',
      'PMA Staff',
      'Supporter / Friend of the Academy (no direct PMA affiliation)',
      'Organization'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem()
    .setTitle('PMA Class / Batch (and year graduated)')
    .setHelpText('For alumni — e.g., "PMA Class 1990". Leave blank if not ' +
      'applicable.');

  form.addTextItem()
    .setTitle('Organization name')
    .setHelpText('Affiliate applicants applying on behalf of an organization ' +
      'only.');

  form.addTextItem()
    .setTitle('Current profession / position');

  // ---- Section 4: A Few More Details ----
  form.addPageBreakItem()
    .setTitle('A Few More Details');

  form.addParagraphTextItem()
    .setTitle('Why would you like to join PMAFI?')
    .setHelpText("Optional — tell us what draws you to the Foundation's " +
      'mission.');

  form.addMultipleChoiceItem()
    .setTitle('How did you hear about PMAFI membership?')
    .setChoiceValues([
      'PMAFI website',
      'Facebook / social media',
      'Referred by a member',
      'PMA event or reunion',
      'Brochure'
    ])
    .showOtherOption(true);

  form.addMultipleChoiceItem()
    .setTitle('Preferred contact method')
    .setChoiceValues(['Email', 'Phone call', 'Text / SMS', 'Any of the above'])
    .setRequired(true);

  // ---- Section 5: Payment ----
  // The file-upload question goes HERE and must be added by hand — see the
  // manual step in this file's header. Everything below is scriptable.
  form.addPageBreakItem()
    .setTitle('Payment')
    .setHelpText(
      'Attach your proof of payment below. A clear screenshot or photo of ' +
      'your deposit slip, bank transfer confirmation, or GCash receipt is ' +
      "enough — we just need to see the amount, the date, and who it came " +
      'from.\n\n' +
      paymentInstructions_() +
      "If you have already paid but cannot attach the receipt here, submit " +
      'this form anyway and email the receipt to pmafi.web@gmail.com — your ' +
      'application will not be lost.'
    );

  form.addTextItem()
    .setTitle('Date paid')
    .setHelpText('e.g., 15 March 2026. This helps us match your payment.')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Amount paid')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('How did you pay?')
    .setChoiceValues(['Bank transfer / deposit', 'GCash'])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem()
    .setTitle('Reference / transaction number')
    .setHelpText('From your receipt, if it shows one. Leave blank if not.');

  form.addCheckboxItem()
    .setTitle('Acknowledgment')
    .setChoiceValues([
      'I confirm the information above is accurate, that I have paid my ' +
        'membership dues, and that my membership is finalized only once ' +
        'PMAFI has verified my payment and confirmed my category.'
    ])
    .setRequired(true);

  form.setConfirmationMessage(
    "Thank you for applying to PMAFI! We've received your application and " +
    'your proof of payment. Our team will verify it and confirm your ' +
    'membership category — there is nothing further you need to send.\n\n' +
    'You can check your status any time at www.pmafi.org/membership using ' +
    'the email address on this form. Welcome — we\'re glad you want to be ' +
    'part of the mission.'
  );

  // Print the links to the execution log.
  Logger.log('EDIT this form here:   ' + form.getEditUrl());
  Logger.log('PUBLIC (share) link:   ' + form.getPublishedUrl());
}
