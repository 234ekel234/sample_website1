/**
 * PMAFI Donations log — tab generator + reference minter
 * ----------------------------------------------------------------------------
 * Creates the `Donations` tab that /donate/status reads, with the exact headers
 * the site expects, dropdowns for Fund and Status, and — the important part — a
 * menu command that mints a RANDOM reference code.
 *
 * ── WHY THE REFERENCE MATTERS ────────────────────────────────────────────────
 * A donor looks up their giving with their email address PLUS this code. The
 * email alone is guessable, so the code is what stops somebody reading a fellow
 * alumnus's donation history.
 *
 * That only holds if the code is RANDOM. A running number — PMAFI-2026-0142 —
 * can be counted through: anyone who knows a donor's address tries 0143, 0144,
 * and reads their gifts. This script exists mainly so nobody has to remember
 * that at 4pm on a busy day.
 *
 * ── HOW TO INSTALL (≈2 minutes) ──────────────────────────────────────────────
 *   1. Open the PRIVATE spreadsheet the website reads for membership — the one
 *      holding the membership form's responses. The donation log belongs here,
 *      alongside it, and NOT in the staff-editable content sheet, which is
 *      shared more widely.
 *   2. Extensions → Apps Script.
 *   3. Delete any sample code, paste THIS whole file in, Save.
 *   4. Run `setUpDonationsTab` once. Approve the permission prompt.
 *   5. Reload the spreadsheet. A **PMAFI** menu appears in the toolbar.
 *
 * NOTE: this must be bound to the SPREADSHEET (step 2), not to the form. A
 * spreadsheet-bound script is what allows the custom menu.
 *
 * ── DAILY USE ────────────────────────────────────────────────────────────────
 *   Add a row for a gift once it has been verified. Click the Reference cell,
 *   then **PMAFI → Generate reference for selected cells**. Never type one by
 *   hand, and never copy the row above and edit the digits.
 *
 *   THEN EMAIL THE DONOR THE REFERENCE. Nothing here is automated — the code is
 *   minted in this sheet and reaches the donor only because somebody sends it.
 *   Until that happens the gift is invisible to the person who made it.
 *   Template: references/donation-acknowledgment-email.md
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
var TAB_NAME = 'Donations';

/** Must match src/lib/funds.ts. Anything else still works, but only if the
 *  Fund Updates tab spells it identically. */
var FUNDS = ['Professorial Chair Fund', 'Endowment Fund', 'General Fund'];

/** Must match DonationStatus in src/lib/donations.ts. */
var STATUSES = ['Received', 'Acknowledged', 'Receipt issued', 'Allocated'];

var HEADERS = ['Reference', 'Email', 'Donor name', 'Date', 'Amount', 'Fund', 'Status'];

/**
 * Characters a reference may contain.
 *
 * Deliberately excludes I, L, O, 0 and 1. Staff read these codes to donors over
 * the phone and donors type them back; "PMAFI-2026-I0L1" is a support ticket
 * waiting to happen. 31 characters over 6 places is about 887 million codes,
 * which is far past anything guessable.
 */
var REF_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
var REF_LENGTH = 6;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('PMAFI')
    .addItem('Generate reference for selected cells', 'generateReferences')
    .addToUi();
}

/** Build the Donations tab, or bring an existing one up to spec. */
function setUpDonationsTab() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);

  sheet.getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setFontWeight('bold')
    .setBackground('#1B2A4A')
    .setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);

  // Reference and Email are the two the lookup matches on, so give them room.
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 220);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(6, 200);

  // Plain text on Reference: a code like "PMAFI-2026-234567" must never be
  // coerced into a number, and an autocorrected reference cannot be looked up.
  sheet.getRange('A2:A1000').setNumberFormat('@');
  sheet.getRange('D2:D1000').setNumberFormat('yyyy-mm-dd');
  sheet.getRange('E2:E1000').setNumberFormat('#,##0');

  sheet.getRange('F2:F1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(FUNDS, true)
      .setAllowInvalid(true)   // a fund PMAFI opens later must still be typeable
      .setHelpText('Use a canonical fund name so the donor sees that fund\'s updates.')
      .build()
  );

  sheet.getRange('G2:G1000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUSES, true)
      .setAllowInvalid(false)
      .setHelpText('Pick one: ' + STATUSES.join(', ') + '. Blank shows as Received.')
      .build()
  );

  SpreadsheetApp.getUi().alert(
    'Donations tab ready.\n\n' +
      'Add one row per VERIFIED gift. For the Reference column, use\n' +
      'PMAFI → Generate reference for selected cells.\n\n' +
      'Never type a reference by hand and never copy the row above — a\n' +
      'guessable code lets someone read another donor\'s giving history.'
  );
}

/** Fill every selected cell with a fresh, unique reference. */
function generateReferences() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getActiveRange();
  var ui = SpreadsheetApp.getUi();

  if (!range) {
    ui.alert('Select the Reference cell (or cells) first.');
    return;
  }
  if (sheet.getName() !== TAB_NAME) {
    ui.alert('Switch to the "' + TAB_NAME + '" tab first.');
    return;
  }

  var used = existingReferences_(sheet);
  var values = [];
  for (var r = 0; r < range.getNumRows(); r++) {
    var row = [];
    for (var c = 0; c < range.getNumColumns(); c++) {
      var ref = uniqueReference_(used);
      used[ref] = true;
      row.push(ref);
    }
    values.push(row);
  }
  range.setNumberFormat('@');
  range.setValues(values);
}

/** Every reference already in column A, as a lookup. */
function existingReferences_(sheet) {
  var used = {};
  var last = sheet.getLastRow();
  if (last < 2) return used;
  var col = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) {
    var v = String(col[i][0]).trim().toUpperCase();
    if (v) used[v] = true;
  }
  return used;
}

/**
 * A reference not already in the sheet.
 *
 * Collisions are vanishingly unlikely, but a duplicate would quietly attach one
 * donor's code to another donor's row — so it is checked rather than assumed.
 */
function uniqueReference_(used) {
  for (var attempt = 0; attempt < 50; attempt++) {
    var ref = newReference_();
    if (!used[ref.toUpperCase()]) return ref;
  }
  // 50 collisions in a row is not chance; fall back to something certainly free.
  return 'PMAFI-' + new Date().getFullYear() + '-' + new Date().getTime();
}

function newReference_() {
  var tail = '';
  for (var i = 0; i < REF_LENGTH; i++) {
    // Math.random is not a cryptographic source, but the code only has to be
    // unguessable to a person trying addresses through a rate-limited web form,
    // not to an attacker with the sheet in hand.
    tail += REF_ALPHABET.charAt(Math.floor(Math.random() * REF_ALPHABET.length));
  }
  return 'PMAFI-' + new Date().getFullYear() + '-' + tail;
}
