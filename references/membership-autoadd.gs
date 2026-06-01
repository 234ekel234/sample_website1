/**
 * PMAFI — Auto-add form applicants to the members roster as "Pending Payment"
 * ----------------------------------------------------------------------------
 * On every submission of the PMAFI Membership Application form, this copies the
 * applicant's Name, Email, and Category into the private members roster (the
 * sheet the website reads) with Status = "Pending Payment". The applicant can
 * then immediately check their status on /membership and see they're pending.
 *
 * It is SAFE to re-submit: if the email is already in the roster, the script
 * does nothing — it never duplicates a row or downgrades an existing member.
 *
 * The roster stays lean (Name | Email | Category | Status). The form's own
 * responses sheet (if you linked one) remains the full archive of every answer.
 *
 * ── HOW TO INSTALL (≈2 minutes) ──────────────────────────────────────────────
 *   1. Open the PMAFI Membership Application FORM in edit mode.
 *   2. Top-right ⋮ (three dots) → "Apps Script" (or "Script editor").
 *   3. Delete any sample code, paste THIS whole file in, and Save.
 *   4. Set MEMBERS_SHEET_ID below to your roster's sheet ID (same value as the
 *      website's MEMBERS_SHEET_ID env var — the long string in the sheet URL
 *      between /d/ and /edit).
 *   5. Add the trigger (this is what makes it run on each submission):
 *        Left sidebar → Triggers (the alarm-clock icon) → "Add Trigger"
 *          • Function:            onFormSubmitAddPending
 *          • Deployment:          Head
 *          • Event source:        From form
 *          • Event type:          On form submit
 *        → Save. Approve the authorization prompt the first time
 *          (it needs permission to edit your roster sheet).
 *   6. Test: submit the form once with a test email, then check the roster —
 *      a new "Pending Payment" row should appear. Check it again on the website.
 *
 * NOTE: must be an INSTALLABLE trigger (step 5), not a simple onFormSubmit().
 * Simple triggers can't write to a different spreadsheet; installable ones can.
 *
 * Also run `addPendingPaymentToStatusDropdown()` in references/members-sheet.gs
 * once, so the roster's Status dropdown accepts "Pending Payment" cleanly.
 */

// ── CONFIG ───────────────────────────────────────────────────────────────────
var MEMBERS_SHEET_ID = 'PASTE_YOUR_MEMBERS_SHEET_ID_HERE';
var MEMBERS_TAB_NAME = 'Members';

/**
 * Map a form category choice to one of the roster's three categories.
 * The form's "Not sure — please advise" (and anything unexpected) defaults to
 * Affiliate — the broadest tier — which staff confirm during review before the
 * member is ever marked Active. The form already tells applicants the category
 * is confirmed during review, so this matches what they were told.
 */
function mapCategory_(raw) {
  var v = String(raw || '').toLowerCase();
  if (v.indexOf('regular') !== -1) return 'Regular';
  if (v.indexOf('associate') !== -1) return 'Associate';
  if (v.indexOf('affiliate') !== -1) return 'Affiliate';
  return 'Affiliate';
}

function onFormSubmitAddPending(e) {
  // Only runs from the installable "On form submit" trigger.
  if (!e || !e.response) return;

  // Pull Name / Email / Category out of the submission by question title.
  var items = e.response.getItemResponses();
  var name = '';
  var email = '';
  var category = '';
  for (var i = 0; i < items.length; i++) {
    var title = items[i].getItem().getTitle().toLowerCase();
    var answer = items[i].getResponse();
    if (typeof answer !== 'string') answer = String(answer);
    answer = answer.trim();

    if (title.indexOf('full name') !== -1 || title === 'name') {
      name = answer;
    } else if (title.indexOf('email') !== -1) {
      email = answer;
    } else if (title.indexOf('category') !== -1) {
      category = answer;
    }
  }

  if (!email || !name) return; // nothing usable to add

  // Serialize concurrent submissions so two near-simultaneous submits can't
  // both append the same new email.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    // Couldn't get the lock in time — skip rather than risk a duplicate.
    return;
  }

  try {
    var ss = SpreadsheetApp.openById(MEMBERS_SHEET_ID);
    var sheet = ss.getSheetByName(MEMBERS_TAB_NAME) || ss.getSheets()[0];

    // Skip if this email is already in the roster (don't duplicate / downgrade).
    var lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      var existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // column B (Email)
      var needle = email.toLowerCase();
      for (var r = 0; r < existing.length; r++) {
        if (String(existing[r][0]).trim().toLowerCase() === needle) {
          return; // already a member/applicant — leave their record untouched
        }
      }
    }

    sheet.appendRow([name, email, mapCategory_(category), 'Pending Payment']);
  } finally {
    lock.releaseLock();
  }
}
