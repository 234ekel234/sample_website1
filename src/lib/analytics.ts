// Google Analytics 4 — the measurement ID, and the one way to send an event.
//
// `NEXT_PUBLIC_*` is inlined at build time, so this is readable from a client
// component. An unset ID means analytics are not configured at all, which is
// the local-development case and matters beyond the script: the cookie notice
// asks NOTHING when there is nothing to consent to. A banner on a build with no
// tracker in it would be asking about cookies the site does not set.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** True where a measurement ID was supplied at build time. */
export const analyticsConfigured = GA_ID !== "";

type GtagParams = Record<string, string | number | boolean>;
type Gtag = (...args: unknown[]) => void;

function gtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const fn = (window as Window & { gtag?: Gtag }).gtag;
  return typeof fn === "function" ? fn : null;
}

/**
 * Record an event, if — and only if — the visitor accepted analytics.
 *
 * There is no consent check written here, and that is the point: `window.gtag`
 * is defined by the GA script, `Analytics.tsx` renders that script only on
 * "granted", so a refusal leaves nothing to call. A caller therefore cannot
 * track someone by forgetting to check, and this is safe to call from anywhere
 * — including during a server render, where it does nothing.
 */
export function track(event: string, params?: GtagParams): void {
  gtag()?.("event", event, params ?? {});
}

/**
 * Record a page view on a client-side navigation.
 *
 * The App Router moves between pages without a document load, so GA's own
 * automatic page_view fires once for the whole session and every route after
 * the first goes uncounted.
 *
 * The path is sent WITHOUT its query string. Reading one here would mean
 * `useSearchParams`, which opts the whole tree into client rendering, and the
 * query strings this site does have are on `/donate/status` — carrying a
 * donor's reference code, which has no business in an analytics property.
 */
export function trackPageView(path: string): void {
  gtag()?.("event", "page_view", {
    page_path: path,
    page_location: typeof window === "undefined" ? path : window.location.origin + path,
  });
}
