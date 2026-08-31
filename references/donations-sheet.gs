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
 *   NORMAL CASE — a donor filled in the donation form. Check the transfer
 *   arrived against PMAFI's bank record, then on the `Donation Reports` tab
 *   select the row (or several) and click
 *   **PMAFI → Log selected report(s) to Donations**.
 *
 *   That copies the five fields the website needs into the log in the right
 *   order, mints the reference, sets the status to Received, and writes the
 *   reference back beside the report so the same gift cannot be logged twice.
 *   Nothing is verified for you — a person still decides the money arrived.
 *
 *   BY HAND — a gift that never came through the form (a cheque handed over at
 *   an event, say). Add a row to `Donations` yourself, click the Reference
 *   cell, then **PMAFI → Generate reference for selected cells**. Never type a
 *   reference by hand, and never copy the row above and edit the digits.
 *
 *   NOTIFICATIONS — run **PMAFI → Turn on report notifications** once, and
 *   every new donation report is emailed to whoever owns this spreadsheet (or
 *   to NOTIFY_TO, if set). Membership applications land in this same file and
 *   are deliberately not emailed. Nothing else changes: the email is a tap on
 *   the shoulder, and verifying, logging and acknowledging are still done by a
 *   person.
 *
 *   NEVER type a gift into `Donation Reports`. That tab belongs to the form,
 *   which writes each response to the row after the last one IT wrote — so a
 *   hand-typed row sits in space the form still considers free and gets
 *   overwritten by the next submission. `Donations` is a plain tab and is safe
 *   to type into. (PMAFI lost membership rows this way in August 2026.)
 *
 *   THEN EMAIL THE DONOR THE REFERENCE. Nothing here is automated — the code is
 *   minted in this sheet and reaches the donor only because somebody sends it.
 *   Until that happens the gift is invisible to the person who made it.
 *   Template: references/donation-acknowledgment-email.md
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
var TAB_NAME = 'Donations';

/** The donation form's linked responses sheet — the unverified queue. */
var REPORTS_TAB_NAME = 'Donation Reports';

/**
 * Where each field of a report is found, by HEADER TEXT rather than position.
 *
 * The responses sheet's layout belongs to the FORM: add a question and every
 * column after it shifts one to the right. Fixed positions would then copy a
 * phone number into the Amount column, and the row would either be skipped by
 * the site or logged as a gift of nothing. Matching is case-insensitive and
 * substring-based, so the full question text is fine.
 */
var REPORT_HEADERS = {
  email: 'email',
  name: 'full name',
  date: 'date sent',
  amount: 'amount',
  fund: 'fund'
};

/**
 * Column written back into the responses sheet recording what a report became.
 *
 * ADDING A COLUMN TO THE RIGHT IS SAFE; adding a ROW is not. A form writes only
 * its own columns, and only into the new row it creates, so a column past the
 * end of the form's block is never touched. This is what stops the same gift
 * being logged twice — the far more likely mistake once two people are working
 * the queue.
 */
var LOGGED_HEADER = 'Logged reference';

/**
 * Who is told when a donor reports a gift. Blank = whoever owns this
 * spreadsheet, which is the safe default because it is certainly a real inbox
 * somebody reads. Set it to the finance address once PMAFI has one.
 *
 * Several addresses are fine: 'a@x.com, b@y.com'.
 */
var NOTIFY_TO = '';

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
    .addItem('Log selected report(s) to Donations', 'logSelectedReports')
    .addItem('Generate reference for selected cells', 'generateReferences')
    .addSeparator()
    .addItem('Turn on report notifications', 'setUpNotifications')
    .addToUi();
}

// ── NOTIFICATIONS ────────────────────────────────────────────────────────────
//
// WHY: a donor gives on Monday, reports it, and then hears nothing until
// somebody happens to open this spreadsheet. /donate/status shows them nothing
// in the meantime, which reads as the Foundation having lost their money. The
// whole donor-tracking feature is only as truthful as how quickly a human
// notices a report arrived — and nothing was telling anyone.
//
// This does not verify, log or acknowledge anything. It is a tap on the
// shoulder, and the rest of the work is still done by a person.

/**
 * Install the on-form-submit trigger. Run once, from the PMAFI menu.
 *
 * Idempotent: it clears its own previous triggers first, so clicking the menu
 * item twice leaves one trigger rather than two emails per gift.
 */
function setUpNotifications() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    if (existing[i].getHandlerFunction() === 'onDonationReport') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  ScriptApp.newTrigger('onDonationReport')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();

  ui.alert(
    'Notifications are on.\n\n' +
    'Every new donation report will be emailed to ' + notifyAddress_() + '.\n\n' +
    'Membership applications land in this same spreadsheet and are deliberately ' +
    'NOT emailed — only donation reports are.'
  );
}

/**
 * Runs on every form submission into this spreadsheet.
 *
 * BOTH FORMS FEED THIS ONE FILE — membership responses and donation reports —
 * and a spreadsheet trigger cannot be limited to one of them. So the first
 * thing this does is check which tab the row landed in and return if it is not
 * a donation report. Without that check, every membership application would
 * email the finance inbox announcing a gift that does not exist.
 */
function onDonationReport(e) {
  if (!e || !e.range) return; // Run by hand from the editor; there is no event.

  try {
    var sheet = e.range.getSheet();
    if (sheet.getName() !== REPORTS_TAB_NAME) return;

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = e.range.getRow();
    var values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

    var get = function (needle) {
      var i = findHeader_(headers, needle);
      return i < 0 ? '' : String(values[i] || '').trim();
    };

    var amount = parseAmount_(values[findHeader_(headers, REPORT_HEADERS.amount)]);
    var lines = [
      'A donor has reported a gift to PMAFI.',
      '',
      'Donor:   ' + (get(REPORT_HEADERS.name) || '(no name given)'),
      'Amount:  ' + (isNaN(amount) ? '(not stated)' : 'PHP ' + amount.toLocaleString('en-PH')),
      'Fund:    ' + (matchFund_(get(REPORT_HEADERS.fund)) || '(not designated)'),
      'Sent on: ' + (get(REPORT_HEADERS.date) || '(not stated)'),
      'Method:  ' + (get('how did you send') || '(not stated)'),
      '',
      // THE TRANSACTION NUMBER IS DELIBERATELY NOT HERE. It is a banking
      // identifier, and an email is copied, forwarded and left in inboxes in a
      // way a private spreadsheet is not. Whoever verifies the gift is opening
      // the sheet anyway.
      'Open row ' + row + ' to verify it against the bank record:',
      e.range.getSheet().getParent().getUrl(),
      '',
      'Once the transfer is confirmed: select the row and use',
      'PMAFI -> Log selected report(s) to Donations, then email the donor',
      'their reference. Until that is done the gift is invisible to them.'
    ];

    MailApp.sendEmail({
      to: notifyAddress_(),
      subject: 'PMAFI: donation reported' +
        (get(REPORT_HEADERS.name) ? ' by ' + get(REPORT_HEADERS.name) : ''),
      body: lines.join('\n')
    });
  } catch (err) {
    // NEVER let this throw. The trigger runs alongside the form submission, and
    // a failure here must not put the donor's own report at risk — the row is
    // already safely in the sheet by the time this runs, and a missed email is
    // recoverable in a way a lost report is not.
    console.error('Donation notification failed: ' + err);
  }
}

/** Configured recipient, or the spreadsheet's owner. */
function notifyAddress_() {
  return NOTIFY_TO || Session.getEffectiveUser().getEmail();
}

/**
 * Turn selected rows of `Donation Reports` into verified rows in `Donations`.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────
 * The two tabs do not share a shape and never will: the report is whatever the
 * form asks (timestamp, phone, transaction number, dedication, permission to
 * acknowledge), while the log is the seven fields the website reads. Copying by
 * hand means picking five non-adjacent columns out of eleven, pasting them in a
 * different order, minting a reference and typing a status — per gift, by
 * someone who has done it forty times that morning.
 *
 * Every one of those steps is a chance to put an amount in the fund column, and
 * the failure is silent: the site skips the row, and the donor is told their
 * reference does not match, which reads as the Foundation having lost their
 * money.
 *
 * ── WHAT IT DOES NOT DO ──────────────────────────────────────────────────────
 * It does not verify the gift. Only PMAFI's bank record can do that, and a
 * person must still check the transfer arrived before logging it. This command
 * is the transcription, not the judgement.
 *
 * It does not email the donor. The reference reaches them only because somebody
 * sends it — see references/donation-acknowledgment-email.md.
 */
function logSelectedReports() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var sheet = ss.getActiveSheet();

  if (sheet.getName() !== REPORTS_TAB_NAME) {
    ui.alert('Switch to the "' + REPORTS_TAB_NAME + '" tab and select the row(s) to log.');
    return;
  }
  var range = sheet.getActiveRange();
  if (!range) {
    ui.alert('Select the row (or rows) to log first.');
    return;
  }

  var log = ss.getSheetByName(TAB_NAME);
  if (!log) {
    ui.alert('No "' + TAB_NAME + '" tab found. Run setUpDonationsTab first.');
    return;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = {
    email: findHeader_(headers, REPORT_HEADERS.email),
    name: findHeader_(headers, REPORT_HEADERS.name),
    date: findHeader_(headers, REPORT_HEADERS.date),
    amount: findHeader_(headers, REPORT_HEADERS.amount),
    fund: findHeader_(headers, REPORT_HEADERS.fund)
  };
  var missing = [];
  for (var key in col) if (col[key] < 0) missing.push(REPORT_HEADERS[key]);
  if (missing.length) {
    // Loud, not silent. A renamed question is recoverable; a mis-mapped column
    // that reaches the log as a real gift is not.
    ui.alert(
      'Could not find these columns in "' + REPORTS_TAB_NAME + '":\n\n  ' +
      missing.join('\n  ') +
      '\n\nA form question was probably renamed. Nothing has been logged.'
    );
    return;
  }

  var loggedCol = ensureLoggedColumn_(sheet, headers);
  var used = existingReferences_(log);
  var added = 0;
  var skipped = [];

  var first = range.getRow();
  for (var i = 0; i < range.getNumRows(); i++) {
    var rowNumber = first + i;
    if (rowNumber === 1) continue; // the header row, selected by a stray click

    var values = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];

    var already = String(values[loggedCol - 1] || '').trim();
    if (already) {
      skipped.push('Row ' + rowNumber + ' — already logged as ' + already);
      continue;
    }

    var email = String(values[col.email] || '').trim();
    var amount = parseAmount_(values[col.amount]);
    if (!email || isNaN(amount)) {
      // The site skips rows missing either, so logging one would create a gift
      // that exists in the sheet and nowhere else.
      skipped.push('Row ' + rowNumber + ' — needs ' + (!email ? 'an email' : 'a usable amount'));
      continue;
    }

    var reference = uniqueReference_(used);
    used[reference.toUpperCase()] = true;

    log.appendRow([
      reference,
      email,
      String(values[col.name] || '').trim(),
      normalizeDate_(values[col.date]),
      amount,
      matchFund_(values[col.fund]),
      STATUSES[0] // Received — it has arrived and been verified, nothing more
    ]);
    // appendRow ignores the column formats set by setUpDonationsTab, and a
    // reference left as a general-format value can be reinterpreted.
    log.getRange(log.getLastRow(), 1).setNumberFormat('@');
    log.getRange(log.getLastRow(), 4).setNumberFormat('yyyy-mm-dd');

    sheet.getRange(rowNumber, loggedCol).setValue(reference);
    added++;
  }

  ui.alert(
    'Logged ' + added + ' gift' + (added === 1 ? '' : 's') + ' to "' + TAB_NAME + '".' +
    (skipped.length ? '\n\nNot logged:\n  ' + skipped.join('\n  ') : '') +
    (added ? '\n\nNow email each donor their reference — until you do, the gift is invisible to the person who made it.' : '')
  );
}

/** Index of the first header containing `needle`, or -1. */
function findHeader_(headers, needle) {
  var want = String(needle).toLowerCase();
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).toLowerCase().indexOf(want) !== -1) return i;
  }
  return -1;
}

/** The 1-based "Logged reference" column, created at the far right if absent. */
function ensureLoggedColumn_(sheet, headers) {
  var found = findHeader_(headers, LOGGED_HEADER.toLowerCase());
  if (found !== -1) return found + 1;
  var col = sheet.getLastColumn() + 1;
  sheet.getRange(1, col).setValue(LOGGED_HEADER).setFontWeight('bold');
  return col;
}

/** "₱5,000.00" and "5000" and 5000 all mean the same gift. */
function parseAmount_(value) {
  if (typeof value === 'number') return value;
  var cleaned = String(value || '').replace(/[^0-9.]/g, '');
  return cleaned === '' ? NaN : Number(cleaned);
}

/** A Date becomes yyyy-mm-dd; anything else is passed through as typed. */
function normalizeDate_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value || '').trim();
}

/**
 * The form's answer text reduced to a canonical fund name.
 *
 * The form offers "General Fund — use it wherever it is needed most"; the log
 * and the Fund Updates tab must both say "General Fund", because the website
 * joins a donor's gift to their fund's updates by matching those strings.
 * An unrecognised answer is passed through rather than dropped — see
 * canonicalFund() in src/lib/funds.ts, which does the same on the way in.
 */
function matchFund_(value) {
  var text = String(value || '').trim();
  for (var i = 0; i < FUNDS.length; i++) {
    if (text.toLowerCase().indexOf(FUNDS[i].toLowerCase()) === 0) return FUNDS[i];
  }
  return text;
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
