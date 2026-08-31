// Photographs of giving — the gallery on /donate/impact.
//
// Storage is a Google Drive folder; this sheet decides what is PUBLISHED from
// it. Staff type a file name — "handover.jpg" — and src/lib/drive.ts turns that
// into a file id. Pasting a share link per photograph was the chore this
// removed, and a chore done forty times is a chore done wrongly at least once.
//
// THE FOLDER IS READ, BUT IT DOES NOT PUBLISH. Dropping a photograph into Drive
// puts nothing on the site: it appears only once a row names it, captions it,
// and ticks Published. That review step is the point, because a donation photo
// is very often a presentation cheque, and a presentation cheque carries a
// donor's name beside the amount they gave — exactly the pairing
// /donate/status demands a reference code to withhold, and exactly what had to
// be blurred out of the handover photograph on /donate. A watched folder would
// have put that one drag-and-drop away.
//
// The caption is REQUIRED because it becomes the alt text. A file name is no
// description at all for anyone using a screen reader, and every public page
// here scores 100 on Lighthouse accessibility.
//
// NO FALLBACK CONTENT, for the same reason fund updates have none: inventing a
// record of generosity that did not happen would be far worse than showing
// nothing. An empty sheet renders no section at all.
//
// Sheet layout — tab named "Donation Photos", row 1 = headers, data from row 2:
//   A: Photo (a file name from the folder, or a Drive link)   B: Caption
//   C: Date   D: Published (Yes/No)

import { readRange } from "@/lib/sheets";
import { toDisplayImageUrl } from "@/lib/sheet-image";
import { normalizeSheetDate, byNewestDate } from "@/lib/sheet-date";
import { imageUrlForName } from "@/lib/drive";

export interface DonationPhoto {
  /**
   * Loadable image URL — a Drive link rewritten, or a path shipped with the
   * site. Empty while a `fileName` is still waiting to be resolved.
   */
  image: string;
  /** A name typed into the sheet, to be looked up in the photos folder. */
  fileName: string;
  /** Also the alt text, which is why a row without one is not published. */
  caption: string;
  /** ISO yyyy-mm-dd when parseable, else the raw cell text. May be "". */
  date: string;
}

const PHOTOS_RANGE = "Donation Photos!A2:D";

/**
 * A row's image cell, before the file name is resolved.
 *
 * Column A takes EITHER a file name from the photos folder ("handover.jpg") or
 * a full Drive share link, and the difference is decided here rather than by
 * asking staff to know which they pasted. A name is the ordinary case; the link
 * stays supported because it needs no folder, no extra sharing and no Drive
 * API, and is the escape hatch when a photograph lives somewhere else.
 */
function classifyImageCell(raw: string): { url: string; name: string } {
  const cell = raw.trim();
  if (!cell) return { url: "", name: "" };

  // A site path or anything URL-shaped goes through the existing allowlist.
  const looksLikeUrl = cell.startsWith("/") || /^https?:\/\//i.test(cell);
  if (looksLikeUrl) return { url: toDisplayImageUrl(cell), name: "" };

  return { url: "", name: cell };
}

/**
 * Parse sheet rows into photos. Exported for testing.
 *
 * File names are left UNRESOLVED here — `image` holds "" and `fileName` the
 * typed name — because resolving one means asking Drive, and a parser that
 * cannot be called without a network is a parser that cannot be tested. See
 * resolveDonationPhotos.
 */
export function parseDonationPhotos(rows: unknown[][]): DonationPhoto[] {
  const photos: DonationPhoto[] = [];

  for (const [i, row] of rows.entries()) {
    const { url: image, name: fileName } = classifyImageCell(String(row[0] ?? ""));
    const caption = String(row[1] ?? "").trim();
    const published = String(row[3] ?? "").trim().toLowerCase();
    const isPublished = published === "yes" || published === "true";

    if (!isPublished) continue;

    // SAY SO when a published row cannot render, the way fund updates do. Staff
    // who name a photo, write a caption, tick Published and see nothing appear
    // have no way to tell whether the sheet is wired up at all.
    if ((!image && !fileName) || !caption) {
      console.warn(
        `[donation-photos] Row ${i + 2} is marked Published but has no ` +
          `${!caption ? "Caption (column B), which is also the alt text" : "usable Photo (column A) — a file name from the photos folder, a Drive share link, or a path on this site"} ` +
          "— not shown."
      );
      continue;
    }

    photos.push({
      image,
      fileName,
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
    return resolveDonationPhotos(parseDonationPhotos(rows));
  } catch {
    // Missing tab or unreachable sheet — show nothing, not an error.
    return [];
  }
}

/**
 * Turn the file names into URLs, dropping any that cannot be found.
 *
 * A name that resolves to nothing is dropped rather than rendered as a broken
 * frame: the caption would sit under a grey box, which looks like the site is
 * failing rather than like a photograph is missing. imageUrlForName has already
 * said which name and why in the server log.
 */
export async function resolveDonationPhotos(
  photos: DonationPhoto[]
): Promise<DonationPhoto[]> {
  const resolved = await Promise.all(
    photos.map(async (photo) => {
      if (photo.image || !photo.fileName) return photo;
      return { ...photo, image: await imageUrlForName(photo.fileName) };
    })
  );
  return resolved.filter((photo) => photo.image !== "");
}
