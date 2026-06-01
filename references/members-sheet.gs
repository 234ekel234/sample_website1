/**
 * PMAFI Members Sheet — generator
 * --------------------------------------------------------------
 * Builds the private members roster that the website's /membership
 * status check reads. One row per member.
 *
 * The website matches a visitor's typed email against the Email
 * column and returns ONLY that person's record. So this sheet is
 * private — never "Publish to web" the whole thing unless you use
 * the CSV approach knowingly (see references/membership-setup-todo.md).
 *
 * HOW TO RUN (≈1 minute):
 *   1. Sign in to the pmafi.web@gmail.com Google account.
 *   2. Go to  https://script.google.com  → "New project".
 *   3. Delete the sample code, paste THIS whole file in.
 *   4. Click "Run" (▶). Approve the permission prompt the first time.
 *   5. Open "Execution log" — it prints the sheet's link.
 *
 * Columns (must stay in this order — the website maps to them):
 *   Name | Email | Category | Status
 *     - Category: Regular / Associate / Affiliate  (dropdown)
 *     - Status:   Active / Lapsed                  (dropdown)
 *   ("Status" here is the `standing` field in src/lib/members.ts.)
 */

function createPmafiMembersSheet() {
  var ss = SpreadsheetApp.create('PMAFI Members (private roster)');
  var sheet = ss.getActiveSheet();
  sheet.setName('Members');

  // --- Header row ---
  var headers = ['Name', 'Email', 'Category', 'Status'];
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setFontColor('#ffffff')
    .setBackground('#1B2A4A'); // site navy
  sheet.setFrozenRows(1);

  // --- Dropdown validation ---
  // Category (column C): Regular / Associate / Affiliate
  var categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Regular', 'Associate', 'Affiliate'], true)
    .setAllowInvalid(false)
    .setHelpText('Pick one: Regular, Associate, or Affiliate.')
    .build();
  sheet.getRange('C2:C1000').setDataValidation(categoryRule);

  // Status (column D): Active / Lapsed
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Lapsed'], true)
    .setAllowInvalid(false)
    .setHelpText('Pick one: Active or Lapsed.')
    .build();
  sheet.getRange('D2:D1000').setDataValidation(statusRule);

  // --- Example rows (DELETE these before going live) ---
  var examples = [
    ['Juan Dela Cruz', 'juan.delacruz@example.com', 'Regular', 'Active'],
    ['Maria Santos', 'maria.santos@example.com', 'Affiliate', 'Active'],
    ['Pedro Reyes', 'pedro.reyes@example.com', 'Associate', 'Lapsed']
  ];
  sheet.getRange(2, 1, examples.length, 4).setValues(examples);
  sheet.getRange(2, 1, examples.length, 4)
    .setFontColor('#999999')
    .setFontStyle('italic');

  // A small note so whoever opens it knows the example rows are fake.
  sheet.getRange(examples.length + 3, 1)
    .setValue('↑ The grey italic rows above are EXAMPLES — delete them before launch.')
    .setFontColor('#A07830');

  // --- Tidy presentation ---
  sheet.setColumnWidth(1, 220); // Name
  sheet.setColumnWidth(2, 280); // Email
  sheet.setColumnWidth(3, 130); // Category
  sheet.setColumnWidth(4, 110); // Status

  Logger.log('Members sheet created here: ' + ss.getUrl());
  Logger.log('Sheet ID (for env var MEMBERS_SHEET_ID): ' + ss.getId());
}
