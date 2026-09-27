/**
 * Reject any URL that is not plain http(s), at the point content enters the app.
 *
 * WHY THIS EXISTS. Several values in the content sheet become the `href` of an
 * anchor: the three form links and the social profiles. React escapes text, but
 * it does NOT sanitise a URL — `href="javascript:…"` renders and runs. So
 * anybody who can edit that spreadsheet could put script on pmafi.org.
 *
 * That is not anonymous XSS. The sheet is private, there is no user-generated
 * content on this site, and the roster never reaches the browser. What it is, is
 * a privilege escalation: without this, a compromised pmafi.web@gmail.com stops
 * meaning "someone can edit a spreadsheet" and starts meaning "someone can run
 * arbitrary JavaScript on the Foundation's website, to every visitor". The
 * account that owns the sheet also owns the Forms, so it is a realistic target.
 *
 * VALIDATED AT THE BOUNDARY, NOT AT THE CALL SITES. content.ts parses the sheet
 * once; every consumer reads the parsed object. Sanitising in `pick` means a new
 * page that renders `content.forms.donation` cannot forget to do it — the value
 * was already safe before it was handed over. Doing it per-href would work until
 * the first time somebody adds a link and doesn't know the rule exists.
 *
 * A REJECTED URL BECOMES THE EMPTY STRING, deliberately, because that is a
 * behaviour the whole site already implements: a blank content key hides its
 * control rather than rendering a dead one. So a poisoned cell degrades to
 * exactly what a cleared cell does — the button disappears — instead of
 * throwing, rendering a broken link, or needing a new error path anywhere.
 */

/** Schemes an anchor or iframe may use. Everything else is refused. */
const ALLOWED = new Set(["http:", "https:"]);

export function safeHttpUrl(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return "";

  // A site-relative path is not a URL and cannot carry a scheme, so it is safe
  // and has to be allowed — content keys are not the only thing this guards.
  if (value.startsWith("/") && !value.startsWith("//")) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    // Not parseable as an absolute URL. Refuse rather than guess: prefixing
    // "https://" onto whatever this is would happily turn a malformed value
    // into a link to somebody else's host.
    return "";
  }

  // `new URL()` lowercases the protocol and strips the control characters and
  // whitespace that the classic "java\nscript:" bypasses rely on, so comparing
  // url.protocol is doing real work that a startsWith() on the raw string is
  // not.
  return ALLOWED.has(url.protocol) ? url.href : "";
}
