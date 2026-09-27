/**
 * Turn whatever YouTube link a member of staff pastes into a video id.
 *
 * WHY A PARSER AND NOT "PASTE THE ID". Every other link in the content sheet is
 * a URL a human copies out of a browser, and the one that is not would be the
 * one that gets pasted wrong. YouTube alone hands out `youtu.be/ID` from the
 * share button, `youtube.com/watch?v=ID` from the address bar, `/embed/ID` from
 * the embed dialog and `/shorts/ID` on mobile — and the share button appends
 * `?si=...` tracking that must not survive into the page.
 *
 * NOTHING HERE GOES NEAR THE NETWORK. It reads a string and returns eleven
 * characters or null, which is what lets the caller decide to render nothing at
 * all — see VideoEmbed, where a null id means no markup, no poster and no
 * request to Google.
 */

/** YouTube ids are exactly 11 characters of URL-safe base64. */
const ID = /^[A-Za-z0-9_-]{11}$/;

const PATH_PREFIXES = ["/embed/", "/shorts/", "/v/", "/live/"];

export function youtubeId(raw: string | null | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;

  // A bare id, which is what somebody pastes when they have read the docs.
  if (ID.test(value)) return value;

  let url: URL;
  try {
    // Tolerate a link copied without its scheme — "youtu.be/abc" is a URL to
    // every human and a relative path to URL().
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID.test(id) ? id : null;
  }

  if (host !== "youtube.com" && host !== "youtube-nocookie.com" && host !== "m.youtube.com") {
    // NOT A YOUTUBE LINK AT ALL. Returning null rather than guessing is what
    // stops a Vimeo or Drive URL being rendered into a YouTube iframe src,
    // where it would silently produce an empty black box.
    return null;
  }

  const v = url.searchParams.get("v");
  if (v && ID.test(v)) return v;

  for (const prefix of PATH_PREFIXES) {
    if (url.pathname.startsWith(prefix)) {
      const id = url.pathname.slice(prefix.length).split("/")[0];
      return ID.test(id) ? id : null;
    }
  }

  return null;
}

/**
 * The privacy-enhanced embed URL for an id.
 *
 * `youtube-nocookie.com` rather than `youtube.com`, and this is not decoration:
 * the ordinary domain sets cookies the moment the iframe exists. This one does
 * not until playback begins, which is the difference between the visitor having
 * chosen something and having had it done to them.
 *
 * `autoplay=1` is correct HERE and would be wrong on page load — the iframe is
 * only ever created by a click on the play control, so the visitor has already
 * asked for the video to start. Without it they would have to press play twice.
 */
export function youtubeEmbedUrl(id: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0", // keep suggestions to the same channel at the end
    modestbranding: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
}
