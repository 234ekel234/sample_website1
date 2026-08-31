// Photographs of giving — the gallery on /donate/impact.
//
// Storage is Google Drive; this sheet is the INDEX. That split is deliberate.
// Reading a Drive folder directly would have been fewer clicks for staff — drop
// a file in, it appears — but it would also make a shared folder into a
// publishing pipeline: whatever lands there reaches the public within a minute,
// unreviewed, uncaptioned.
//
// That is the wrong trade for THESE photographs in particular. A donation photo
// is very often a presentation cheque, and a presentation cheque carries a
// donor's name beside the amount they gave — exactly the pairing /donate/status
// demands a reference code to withhold, and exactly what had to be blurred out
// of the handover photograph on /donate. A row with a Published column makes
// putting a face or a figure on the internet a deliberate act by somebody who
// has looked at the picture.
//
// The caption is REQUIRED because it becomes the alt text. A folder listing
// would have given us "IMG_4471.jpg" to describe a photograph with, which is no
// description at all for anyone using a screen reader, and every public page
// here scores 100 on Lighthouse accessibility.
//
// NO FALLBACK CONTENT, for the same reason fund updates have none: inventing a
// record of generosity that did not happen would be far worse than showing
// nothing. An empty sheet renders no section at all.
//
// Sheet layout — tab named "Donation Photos", row 1 = headers, data from row 2:
//   A: Image URL   B: Caption   C: Date   D: Published (Yes/No)

import { readRange } from "@/lib/sheets";
import { toDisplayImageUrl } from "@/lib/sheet-image";
import { normalizeSheetDate, byNewestDate } from "@/lib/sheet-date";

export interface DonationPhoto {
  /** Direct image URL — a Drive link rewritten, or a path shipped with the site. */
  image: string;
  /** Also the alt text, which is why a row without one is not published. */
  caption: string;
  /** ISO yyyy-mm-dd when parseable, else the raw cell text. May be "". */
  date: string;
}

const PHOTOS_RANGE = "Donation Photos!A2:D";

/** Parse sheet rows into photos. Exported for testing. */
export function parseDonationPhotos(rows: unknown[][]): DonationPhoto[] {
  const photos: DonationPhoto[] = [];

  for (const [i, row] of rows.entries()) {
    const image = toDisplayImageUrl(String(row[0] ?? ""));
    const caption = String(row[1] ?? "").trim();
    const published = String(row[3] ?? "").trim().toLowerCase();
    const isPublished = published === "yes" || published === "true";

    if (!isPublished) continue;

    // SAY SO when a published row cannot render, the way fund updates do. Staff
    // who paste a link, write a caption, tick Published and see nothing appear
    // have no way to tell whether the sheet is wired up at all.
    if (!image || !caption) {
      console.warn(
        `[donation-photos] Row ${i + 2} is marked Published but has no ` +
          `${!image ? "usable Image URL (column A) — Drive share links and site paths work, other hosts are ignored" : "Caption (column B), which is also the alt text"} ` +
          "— not shown."
      );
      continue;
    }

    photos.push({
      image,
      caption,
      date: normalizeSheetDate(String(row[2] ?? "")),
    });
  }

  // Newest first; an undated photo sorts to the bottom rather than jumping the
  // queue on a string comparison.
  return photos.sort(byNewestDate);
}

/**
 * Published donation photographs, newest first.
 *
 * Returns an empty array when the sheet is missing, unreachable or empty — the
 * gallery then renders nothing at all rather than an empty frame.
 */
export async function getDonationPhotos(): Promise<DonationPhoto[]> {
  const sheetId = process.env.CONTENT_SHEET_ID;
  if (!sheetId) return [];

  try {
    const rows = await readRange(sheetId, PHOTOS_RANGE, { revalidate: 60 });
    return parseDonationPhotos(rows);
  } catch {
    // Missing tab or unreachable sheet — show nothing, not an error.
    return [];
  }
}
