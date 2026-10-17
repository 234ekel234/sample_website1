import { describe, it, expect } from "vitest";
import { ANNUAL_MEETING, NOTICE_EMAIL } from "@/lib/annual-meeting";

/**
 * The notice is published as text so members can read it. Three things in the
 * scan it was transcribed from are deliberately absent, and this is what stops
 * them being "restored" later by someone comparing the page to the original
 * and assuming the difference is an oversight. It is not; see the header of
 * annual-meeting.ts.
 */

/** Everything a reader sees, flattened, so a guard cannot be dodged by moving
 *  a string from one field to another. */
function allText(): string {
  const m = ANNUAL_MEETING;
  return [
    m.heading,
    m.addressedTo,
    m.references,
    m.date,
    m.time,
    m.venue,
    m.convening,
    m.closing,
    m.issuedBy.name,
    m.issuedBy.role,
    ...m.purposes,
    ...m.schedule.flatMap((s) => [s.when, s.what]),
    ...m.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
  ].join("\n");
}

describe("the published annual meeting notice", () => {
  it("never carries the Zoom joining details", () => {
    // THE IMPORTANT ONE. This page is public; the notice went to members.
    // A join link, an ID or a passcode on it lets anyone sit in on — or
    // disrupt — an election of trustees.
    const text = allText();

    expect(text).not.toMatch(/zoom\.us/i);
    expect(text).not.toMatch(/\bpwd=/i);
    expect(text).not.toMatch(/passcode/i);
    expect(text).not.toMatch(/meeting\s*id/i);
    // The literal credentials from the notice.
    expect(text).not.toContain("893 9811 0846");
    expect(text).not.toMatch(/\b89398110846\b/);
  });

  it("never carries a phone number", () => {
    const text = allText();

    // The two staff mobiles and the office landline from the notice.
    expect(text).not.toContain("0917-8081456");
    expect(text).not.toContain("0927-7558595");
    expect(text).not.toContain("8911-7642");
    // And nothing shaped like a PH mobile or a dialled number generally —
    // catches a number pasted back in a different format.
    expect(text).not.toMatch(/\b09\d{2}[-\s]?\d{3}[-\s]?\d{4}\b/);
    expect(text).not.toMatch(/\(0?2\)\s*\d{4}[-\s]?\d{4}/);
  });

  it("names the issuing officer without reproducing the signature", () => {
    // Naming him is what the notice communicates — who issued it. The scanned
    // signature is a forgeable artefact and is not an image on this page.
    const text = allText();

    expect(ANNUAL_MEETING.issuedBy.name).toBe("CAV Gil C. Meneses");
    expect(ANNUAL_MEETING.issuedBy.role).toBe("Corporate Secretary");
    expect(text).not.toMatch(/\.(jpe?g|png|webp)\b/i);
    expect(text).not.toMatch(/signature/i);
  });

  it("gives only PMAFI's official published address", () => {
    const text = allText();

    expect(text).toContain(NOTICE_EMAIL);
    // pmafi.web@gmail.com owns the Forms and the sheets; it is not the address
    // members write to, and a ballot must not be sent there.
    expect(text).not.toContain("pmafi.web@gmail.com");
  });

  it("keeps every deadline a member is held to", () => {
    // The flip side of the guards above: withholding the credentials must not
    // quietly cost the dates, which are the reason to publish the notice.
    const schedule = ANNUAL_MEETING.schedule.map((s) => s.when).join(" | ");

    expect(schedule).toContain("14 December 2026");
    expect(schedule).toContain("4 – 25 January 2027");
    expect(schedule).toContain("5 – 26 February 2027");
    expect(schedule).toContain("26 February 2027, 5:00 p.m.");
    expect(schedule).toContain("5 March 2027, 9:00 a.m.");
    expect(schedule).toContain("5 March 2027, 10:00 a.m.");
  });

  it("keeps both eligibility cutoffs, which are different dates", () => {
    // Nominating and voting have separate qualifying dates and conflating them
    // is the easiest mistake to make reading the original paragraph.
    const text = allText();

    expect(text).toContain("on or before 31 December 2025");
    expect(text).toContain("as of 31 December 2026");
  });

  it("states all five purposes of the meeting", () => {
    expect(ANNUAL_MEETING.purposes).toHaveLength(5);
    expect(ANNUAL_MEETING.purposes[3]).toContain("seven (7) members");
  });
});
