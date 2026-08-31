// Turning a file NAME typed into a sheet into a Drive file id.
//
// WHY THIS EXISTS: pasting a Drive share link per photograph is a chore, and a
// chore performed forty times is a chore performed wrongly at least once —
// a link to the wrong file, or a link copied from the address bar rather than
// the share dialog. Staff asked to type "handover.jpg" instead, with the
// photographs sitting in one folder in PMAFI's Drive.
//
// WHAT THIS IS NOT: it is not the site reading a folder and publishing whatever
// is in it. The `Donation Photos` tab still decides what appears, still needs a
// caption for the alt text, and still needs Published ticked. This only removes
// the link-pasting. Dropping a photograph into the folder publishes nothing.
//
// SERVER ONLY. Uses the shared service-account token from src/lib/sheets.ts.
//
// Required environment variables:
//   DRIVE_PHOTOS_FOLDER_ID   – the folder id from its URL, the part after
//                              /folders/ in drive.google.com/drive/folders/…
//
// THE FOLDER NEEDS TWO KINDS OF SHARING, and they do different jobs:
//   1. Shared with GOOGLE_SERVICE_ACCOUNT_EMAIL (Viewer) — lets this code list
//      the folder and learn the ids.
//   2. "Anyone with the link can view" — lets a VISITOR'S BROWSER load the
//      image from lh3.googleusercontent.com. Without it the gallery renders
//      grey boxes: we resolve the id fine, and then every visitor is refused
//      the picture.

import { getAccessToken } from "@/lib/sheets";

const FILES_URL = "https://www.googleapis.com/drive/v3/files";

/** Cache the folder listing briefly — a gallery page hits this once per photo. */
const TTL_MS = 60_000;
let cache: { data: FolderIndex; expires: number } | null = null;

interface FolderIndex {
  /** Lowercased full filename → id. */
  byName: Map<string, string>;
  /**
   * Lowercased name without its extension → id, or null when two files share
   * that basename. A null is a REFUSAL rather than a guess: "handover" matching
   * both handover.jpg and handover.png must not silently pick one, because the
   * two may be different photographs of different people.
   */
  byBase: Map<string, string | null>;
}

const base = (name: string) => name.replace(/\.[^.]+$/, "");

/** Build the name → id index for one folder. Exported for testing. */
export function indexFiles(
  files: { id: string; name: string }[]
): FolderIndex {
  const byName = new Map<string, string>();
  const byBase = new Map<string, string | null>();

  for (const file of files) {
    const name = file.name.trim().toLowerCase();
    if (!name) continue;
    // First wins on an exact duplicate name, which Drive allows; there is no
    // better answer and it at least stays stable between reads.
    if (!byName.has(name)) byName.set(name, file.id);

    const b = base(name);
    byBase.set(b, byBase.has(b) ? null : file.id);
  }

  return { byName, byBase };
}

/**
 * Resolve a filename against an index.
 *
 * Tries the exact name first, then the name without its extension — so
 * "handover.jpg", "Handover.JPG" and "handover" all find the same photograph,
 * while an ambiguous basename finds nothing.
 */
export function resolveName(index: FolderIndex, raw: string): string | null {
  const needle = raw.trim().toLowerCase();
  if (!needle) return null;
  return index.byName.get(needle) ?? index.byBase.get(base(needle)) ?? null;
}

async function loadFolder(folderId: string): Promise<FolderIndex> {
  if (cache && cache.expires > Date.now()) return cache.data;

  const token = await getAccessToken();
  const files: { id: string; name: string }[] = [];
  let pageToken: string | undefined;

  // PAGINATE. Drive returns 100 files by default and the folder will outgrow
  // that; a single unpaged request would silently stop resolving the oldest
  // photographs, which is the failure nobody notices until a caption points at
  // a picture that no longer appears.
  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
      fields: "nextPageToken, files(id, name)",
      pageSize: "1000",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${FILES_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Drive list failed (${res.status}): ${await res.text()}`);
    }
    const body = (await res.json()) as {
      files?: { id: string; name: string }[];
      nextPageToken?: string;
    };
    files.push(...(body.files ?? []));
    pageToken = body.nextPageToken;
  } while (pageToken);

  const index = indexFiles(files);
  cache = { data: index, expires: Date.now() + TTL_MS };
  return index;
}

/**
 * The display URL for a photograph named in the sheet, or "" when it cannot be
 * resolved. Never throws: one missing photograph must not take down the page it
 * appears on.
 */
export async function imageUrlForName(name: string): Promise<string> {
  const folderId = process.env.DRIVE_PHOTOS_FOLDER_ID;
  if (!folderId) {
    console.warn(
      `[drive] "${name}" is a file name, but DRIVE_PHOTOS_FOLDER_ID is not set, ` +
        "so there is no folder to look in. Set it, or paste a Drive share link instead."
    );
    return "";
  }

  try {
    const index = await loadFolder(folderId);
    const id = resolveName(index, name);
    if (!id) {
      console.warn(
        `[drive] No image named "${name}" in the photos folder — check the ` +
          "spelling, or that two files do not share the name without their extension."
      );
      return "";
    }
    // The same host next/image is already configured for; see sheet-image.ts.
    return `https://lh3.googleusercontent.com/d/${id}`;
  } catch (err) {
    console.warn(`[drive] Could not list the photos folder: ${err}`);
    return "";
  }
}
