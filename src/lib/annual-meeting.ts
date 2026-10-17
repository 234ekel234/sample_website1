/**
 * The Notice of the PMAFI Annual Membership Meeting and Election of Trustees,
 * 5 March 2027, as issued by the Corporate Secretary.
 *
 * WHY THIS IS IN CODE AND NOT THE CONTENT SHEET. Same reason as
 * src/lib/foundation.ts: this is an issued document, not site copy. Everything
 * in src/lib/content.ts is wording PMAFI may revise at will; a notice convened
 * under the Bylaws is amended by re-issuing it, and a spreadsheet edit is the
 * wrong instrument. The source is `references/announcement.jpeg`, which is
 * deliberately NOT committed — see .git/info/exclude.
 *
 * DO NOT REWORD THE OPERATIVE TEXT. The sentences below are PMAFI's, kept
 * verbatim, because every one of them carries a deadline or an eligibility
 * rule that members are held to. What this file DOES do is group one very long
 * paragraph under headings and lift its dates into a table — regrouping for
 * readability, which is the whole point of publishing the notice as text
 * rather than as a scan nobody can read on a phone. Rewriting a sentence to
 * read better would quietly make it ours.
 *
 * THREE THINGS FROM THE NOTICE ARE WITHHELD, and `annual-meeting.test.ts`
 * fails if any of them comes back:
 *
 *   1. The Zoom join link, meeting ID and passcode. This page is public, and
 *      publishing them lets anyone at all sit in on a trustee election. The
 *      notice went to members; the site is read by the world. Members get them
 *      from the Foundation.
 *   2. The two staff mobile numbers and the office landline. These are
 *      individuals' numbers, and the site withholds phone numbers generally
 *      pending PMAFI's confirmation of which number is the published one.
 *   3. The Corporate Secretary's scanned signature. He is named as the issuing
 *      officer, which is what the notice communicates; the signature image
 *      itself is a forgeable artefact and adds nothing on screen.
 *
 * Only the official published address, PMAFI_PMA@yahoo.com, is given — which
 * is also the address the notice itself names for ballot submission.
 */

/** PMAFI's official published address. Not pmafi.web@gmail.com, which is the
 *  Google account that owns the Forms — see AGENTS.md. The notice names this
 *  one for ballots, so it is quoted rather than read from the content sheet. */
export const NOTICE_EMAIL = "PMAFI_PMA@yahoo.com";

export interface ScheduleEntry {
  when: string;
  what: string;
}

export interface NoticeSection {
  heading: string;
  paragraphs: string[];
}

export const ANNUAL_MEETING = {
  heading: "Notice of PMAFI Annual Membership Meeting and Election of Trustees",
  addressedTo: "All Regular Members, PMA Foundation, Inc.",
  references:
    "Revised Corporation Code of the Philippines (2019); PMAFI Bylaws and Manual of Operations, Third Edition, 2017, Chapter 3.5 Election of Trustees; and PMAFI Election Guidelines AY 2027.",

  date: "Friday, 5 March 2027",
  time: "10:00 a.m.",
  venue: "Board Room, PMA Alumni Center, Camp Aguinaldo, Quezon City",

  /** The notice's opening sentence, verbatim. */
  convening:
    "Notice is hereby given that the Annual Membership Meeting of the PMA Foundation, Inc. (PMAFI) will be held on Friday, 5 March 2027, at 10:00 a.m. at the Board Room, PMA Alumni Center, Camp Aguinaldo, Quezon City, for the following purposes:",

  purposes: [
    "To approve the minutes of the 2026 Annual Membership Meeting;",
    "To consider and act upon the annual report of the President;",
    "To confirm and ratify all acts and resolutions of the Board of Trustees and the Management;",
    "To elect seven (7) members of the Board of Trustees for AY 2027-2029; and",
    "To take up such other matters as may be properly brought before the meeting.",
  ],

  /**
   * Every date the notice binds a member to, in the order they fall. Lifted
   * from the prose below rather than replacing it — the prose remains the
   * authority, and the table is how a member checks what they have missed.
   */
  schedule: [
    {
      when: "14 December 2026",
      what: "Nomination forms available at the PMA Foundation Office, PMA Alumni Center.",
    },
    {
      when: "4 – 25 January 2027",
      what: "Nominations accepted at the PMAFI Office, PMA Alumni Center, Camp Aguinaldo, Quezon City.",
    },
    {
      when: "5 – 26 February 2027",
      what: "Election ballots distributed personally to members or their representatives.",
    },
    {
      when: "26 February 2027, 5:00 p.m.",
      what: "Deadline to submit an accomplished ballot.",
    },
    {
      when: "5 March 2027, 9:00 a.m.",
      what: "Deadline to request a replacement ballot, at the Board Room, PMA Alumni Center.",
    },
    {
      when: "5 March 2027, 10:00 a.m.",
      what: "The meeting. Members who have not yet voted may cast their ballots up to this time.",
    },
  ] satisfies ScheduleEntry[],

  /**
   * The notice's single long paragraph on the election, split under headings.
   * The sentences are unchanged and in their original order.
   */
  sections: [
    {
      heading: "Nominations",
      paragraphs: [
        "On the election of Trustees, the Nomination and Election Committee or the Secretariat will start accepting nominations from 04 up to 25 January 2027 at the PMAFI Office, PMA Alumni Center, Camp Aguinaldo, Quezon City. Nomination forms will be available at the PMA Foundation Office, PMA Alumni Center, starting Monday, 14 December 2026.",
        "Nominators and nominees must all be PMAFI regular members in good standing for at least one (1) year preceding the period of nomination, which means that both must have been members of the Foundation on or before 31 December 2025.",
        "Nominees shall sign the nomination and acceptance form or submit a letter of acceptance of their nomination. It is understood that by signing, nominees accept their nominations and signify their commitment that, if elected, they will attend meetings of the Board of Trustees and other activities of the Foundation.",
      ],
    },
    {
      heading: "Ballots",
      paragraphs: [
        "Election ballots with the names of not more than 14 candidates will be distributed personally to the members or their representatives from 05 February 2027 to 26 February 2027.",
        `An accomplished ballot may be submitted at the PMAFI office personally or sent individually by mail or any DICT-accredited private and/or messenger delivery service (not in bulk), or thru a personal email account to ${NOTICE_EMAIL} on or before 5:00 p.m. of Friday, 26 February 2027.`,
        "Members who claim to have not received or to have lost or misplaced their ballots may request for a replacement ballot at the Board Room, PMA Alumni Center, Q.C. not later than 9:00 a.m. on Friday, 05 March 2027.",
      ],
    },
    {
      heading: "Who may vote",
      paragraphs: [
        "Only regular members of PMAFI as of 31 December 2026 are qualified to vote.",
        "This notwithstanding, the voters who have not yet cast their votes may attend the PMAFI Annual Membership Meeting and Election and cast their ballots thereat not later than 10:00 a.m.",
      ],
    },
    {
      heading: "How the meeting is held",
      paragraphs: [
        "The conduct of the PMAFI Annual Membership Meeting and Election of Trustees will be done in a blended manner (a combination of In-person and Virtual via Zoom).",
      ],
    },
  ] satisfies NoticeSection[],

  /** The notice's closing appeal, verbatim. */
  closing:
    "Your presence at the meeting is important and will significantly contribute to the attainment of the primary objective of PMAFI of assisting PMA in enhancing its quality of education. Be counted!",

  issuedBy: {
    name: "CAV Gil C. Meneses",
    role: "Corporate Secretary",
  },
} as const;
