import { describe, it, expect } from "vitest";
import { ANNUAL_MEETING, NOTICE_EMAIL } from "@/lib/annual-meeting";

/**
 * The notice is published twice on the same page: the signed original as
 * supplied, and this transcription of it.
 *
 * READ THIS BEFORE TRUSTING THE GUARDS BELOW. They assert that the
 * TRANSCRIPTION carries no Zoom credential and no phone number. That is no
 * longer a confidentiality boundary — the scan a few hundred pixels down the
 * page shows all of them, by PMAFI's decision of 2026-10-17. What the guards
 * are now worth is narrower and still real: a joining credential and a
 * personal mobile number go stale, and the transcription must not become a
 * second place to forget to update them. The scan is the document of record.
 *
 * So do not cite these tests as evidence the details are private. They are
 * not. See the header of annual-meeting.ts, including the screen-reader gap
 * publishing them as an image leaves open.
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
  it("keeps the Zoom joining details out of the transcription", () => {
    // Not secrecy — the scan on the same page shows them. This keeps the
    // credential in ONE place, so it cannot be updated in the notice and
    // left stale in the prose.
    const text = allText();

    expect(text).not.toMatch(/zoom\.us/i);
    expect(text).not.toMatch(/\bpwd=/i);
    expect(text).not.toMatch(/passcode/i);
    expect(text).not.toMatch(/meeting\s*id/i);
    // The literal credentials from the notice.
    expect(text).not.toContain("893 9811 0846");
    expect(text).not.toMatch(/\b89398110846\b/);
  });

  it("keeps phone numbers out of the transcription", () => {
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

  it("names the issuing officer as structured text, not as an image", () => {
    // The signature is on the page, inside the scan. What this pins is that
    // the officer's NAME is readable text, so a screen reader gets who issued
    // the notice even though it cannot read the image.
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
