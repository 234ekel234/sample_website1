// Turning an image URL a staff member pasted into a sheet into one `next/image`
// will actually load.
//
// WHY THIS DROPS UNKNOWN HOSTS RATHER THAN PASSING THEM THROUGH:
// `next/image` throws when `src` points at a host missing from `remotePatterns`,
// and that throw happens during render of a Server Component — so a single bad
// URL in one row does not produce a broken image, it 500s the whole page. The
// news feed and the fund-updates page are both a straight map over sheet rows,
// so one staff member pasting a Facebook or Dropbox link takes the page down.
//
// An update that renders without its photo is a far better outcome than an
// update nobody can read, so an unrecognised host yields "" and the callers
// already treat that as "no image".
//
// REMOTE_IMAGE_HOSTS is the single source of truth: next.config.ts builds its
// `images.remotePatterns` from this list, so the allowlist enforced here and the
// one Next enforces cannot drift apart.

/** Hosts `next/image` is configured to load. Keep in sync via next.config.ts. */
export const REMOTE_IMAGE_HOSTS = ["lh3.googleusercontent.com"] as const;

const ALLOWED = new Set<string>(REMOTE_IMAGE_HOSTS);

/**
 * Normalise a sheet image cell to a loadable URL, or "" when there isn't one.
 *
 * Accepts the Google Drive share URLs staff actually copy out of the browser:
 *   https://drive.google.com/file/d/{ID}/view?usp=sharing
 *   https://drive.google.com/open?id={ID}
 *   https://drive.google.com/uc?id={ID}&export=view
 * and converts them to https://lh3.googleusercontent.com/d/{ID}.
 *
 * A URL already on an allowed host is kept as-is. Everything else — another
 * host, or text that is not a URL at all — returns "".
 */
export function toDisplayImageUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  // A SAME-ORIGIN PATH is allowed, so a photograph can ship with the site and
  // still be chosen from the sheet — "/fund-chairs.jpg" rather than a Drive
  // link. This keeps the property the allowlist exists for: a path beginning
  // with a single slash cannot address another host, so nothing here can point
  // the page at somebody else's server.
  //
  // The second character matters. "//evil.com/x.jpg" is protocol-relative and
  // goes straight off-origin, and browsers treat a backslash as a slash in
  // authority position, so "/\evil.com" does too. Both are rejected; only a
  // single slash followed by an ordinary path character is a local file.
  if (trimmed.startsWith("/") && !/^\/[/\\]/.test(trimmed)) {
    return trimmed;
  }

  const fileId =
    trimmed.match(/\/file\/d\/([^/?#]+)/)?.[1] ??
    trimmed.match(/[?&]id=([^&]+)/)?.[1];
  if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;

  let host: string;
  try {
    host = new URL(trimmed).hostname;
  } catch {
    // Not a URL at all — a filename, a note to self, a half-pasted link.
    return "";
  }
  if (ALLOWED.has(host)) return trimmed;

  // Server-side only; helps whoever is asked "why isn't my photo showing?".
  console.warn(
    `[sheet-image] Ignoring image URL on unsupported host "${host}". ` +
      `Upload the photo to Google Drive and paste its share link instead.`
  );
  return "";
}
