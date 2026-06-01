/**
 * PMAFI Membership Application — Google Form generator
 * --------------------------------------------------------------
 * This builds the whole membership application form automatically.
 *
 * HOW TO RUN (≈1 minute):
 *   1. Sign in to the pmafi.web@gmail.com Google account.
 *   2. Go to  https://script.google.com  → "New project".
 *   3. Delete the sample code, paste THIS whole file in.
 *   4. Click "Run" (▶). Approve the permission prompt the first time
 *      (it only edits Forms it creates).
 *   5. Open "Execution log" — it prints the form's EDIT link and the
 *      public (viewform) link. Use the public link on the website.
 *
 * To change the form later, edit it normally in Google Forms — you
 * don't need to re-run this. Re-running creates a brand-new form.
 */

function createPmafiMembershipForm() {
  var form = FormApp.create('PMAFI Membership Application');

  form.setDescription(
    'Thank you for your interest in joining the Philippine Military Academy ' +
    'Foundation, Inc. (PMAFI).\n\n' +
    'Please complete this form to apply. Applying does NOT require payment ' +
    'yet — once we receive your application, our team will verify your ' +
    'details, confirm your membership category, and send you an invoice with ' +
    'payment instructions. Your membership is finalized only after your ' +
    'payment is confirmed.\n\n' +
    'Fields marked with an asterisk (*) are required.'
  );

  // Keep the form open to applicants without a Google account.
  form.setCollectEmail(false);
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

  form.addCheckboxItem()
    .setTitle('Acknowledgment')
    .setChoiceValues([
      'I confirm the information above is accurate, and I understand that ' +
        'membership is finalized only after PMAFI confirms my category and ' +
        'my dues payment is received.'
    ])
    .setRequired(true);

  form.setConfirmationMessage(
    "Thank you for applying to PMAFI! We've received your application and " +
    "will review it shortly. You'll hear from us by email or phone with your " +
    'membership category and payment instructions. Welcome — we\'re glad you ' +
    'want to be part of the mission.'
  );

  // Print the links to the execution log.
  Logger.log('EDIT this form here:   ' + form.getEditUrl());
  Logger.log('PUBLIC (share) link:   ' + form.getPublishedUrl());
}
