// The funds a donation can be designated to.
//
// ONE LIST, because the name is typed into two different spreadsheets by hand —
// the Fund column of the donation log, and the Fund column of the Fund Updates
// tab — and the site joins a donor's gift to their fund's updates by matching
// those strings. When they disagree, a donor is silently shown nothing, which
// is the failure mode this list exists to prevent.
//
// AUTHORITY: the PMAFI brochure, which names exactly two funds and their
// minimums — "A professorial chair, established in the name of the donor, may
// be endowed with a minimum amount of ₱250,000. An endowment fund may also be
// put up in an amount of at least ₱100,000." General Fund is the bucket for
// undesignated gifts and is ours, not the brochure's.
//
// "Facilities & Modernization" is deliberately NOT here. It is a programme area
// (see /programs and the home page), not a fund the Foundation has ever said
// donors may designate to. Advertising it as one would invent an offer.

export interface Fund {
  /** Exactly as it must be typed into both sheets. */
  name: string;
  /** Brochure minimum, or "" where there is none. */
  minimum: string;
  /**
   * Other spellings staff plausibly type for the same fund. Kept small and
   * obvious on purpose: this is for forgiving how a human writes a name PMAFI
   * already offers, never for quietly inventing a new one.
   */
  aliases: string[];
}

export const FUNDS: Fund[] = [
  {
    name: "Professorial Chair Fund",
    minimum: "₱250,000",
    aliases: ["professorial chair", "professorial chairs", "chair fund", "chair"],
  },
  {
    name: "Endowment Fund",
    minimum: "₱100,000",
    aliases: ["endowment", "endowments"],
  },
  {
    name: "General Fund",
    minimum: "",
    aliases: [
      "general",
      "general donation",
      "general donations",
      "unrestricted",
      "where needed most",
    ],
  },
];

const fold = (v: string) => v.trim().toLowerCase().replace(/\s+/g, " ");

/** Look up a fund by its canonical name. */
export function findFund(name: string): Fund | undefined {
  const needle = fold(name);
  return FUNDS.find((f) => fold(f.name) === needle);
}

/**
 * Resolve whatever was typed into a sheet to its canonical fund name.
 *
 * An unrecognised value is returned trimmed rather than dropped or blanked.
 * PMAFI may open a fund this list has not caught up with, and discarding it
 * would erase a real designation from a donor's record; passing it through
 * means the two sheets still agree with each other so long as they agree with
 * one another, which is all the matching needs.
 */
export function canonicalFund(raw: string): string {
  const needle = fold(raw);
  if (!needle) return "";
  const hit = FUNDS.find(
    (f) => fold(f.name) === needle || f.aliases.some((a) => fold(a) === needle)
  );
  return hit ? hit.name : raw.trim();
}
