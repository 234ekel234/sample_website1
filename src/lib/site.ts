// Single source of truth for the site's canonical origin, used by metadataBase,
// the sitemap, robots, structured data, and the digital member ID.
//
// The www host is canonical: the apex (pmafi.org) 308-redirects to it, so the
// bare domain would send Google to a redirect on every canonical URL.
export const SITE_URL = "https://www.pmafi.org";

/** Host without the scheme — for places that print a URL rather than link it. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
