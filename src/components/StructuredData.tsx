import { SITE_URL } from "@/lib/site";
import type { SiteContent } from "@/lib/content";

/**
 * Serialize for embedding in a `<script>` element.
 *
 * A script element is raw text: the HTML parser does not decode entities inside
 * it, it just scans for the literal characters `</script`. `JSON.stringify` does
 * not escape `<`, so an address of `</script><script>alert(1)</script>` in the
 * content sheet would close this tag and execute — on every page, since this
 * component renders in the root layout.
 *
 * `<` is the same character to a JSON parser and invisible to the HTML one,
 * so Google reads identical structured data and the breakout is impossible.
 */
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * JSON-LD structured data for richer Google results (Organization + WebSite).
 *
 * Address, email, phone and social profiles come from the content sheet, the
 * same source the footer and contact page use. They were hardcoded here until
 * 2026-08-05, which meant a staff edit corrected the visible site but left the
 * old value in Google's rich results — the one place it is hardest to notice
 * and slowest to re-crawl.
 *
 * Anything still unconfirmed by PMAFI falls back to an empty string in
 * `content.ts`, and every field below is omitted when empty. An absent property
 * is correct; a property with an empty value is a published claim that PMAFI has
 * no phone number.
 */
export default function StructuredData({
  contact,
  social,
}: {
  contact: SiteContent["contact"];
  social: SiteContent["social"];
}) {
  // The sheet holds the address as one plain line, because that is what staff
  // can reasonably maintain. schema.org accepts a free-text address, so pass it
  // through whole rather than guessing where the street ends and the city
  // begins — a wrong split publishes a wrong address.
  const address = contact.address.trim();

  const sameAs = [social.facebook, social.instagram]
    .map((s) => s.trim())
    .filter(Boolean);

  const organization: Record<string, unknown> = {
    "@type": "NGO",
    "@id": `${SITE_URL}/#organization`,
    name: "Philippine Military Academy Foundation, Inc.",
    alternateName: "PMAFI",
    url: SITE_URL,
    logo: `${SITE_URL}/pmafi-logo.png`,
    foundingDate: "1988",
    description:
      "A non-stock, non-profit foundation supporting the Philippine Military Academy in developing officers of integrity, competence, and character for the nation.",
  };

  if (address) {
    organization.address = {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "PH",
    };
  }
  if (contact.email.trim()) organization.email = contact.email.trim();
  if (contact.phone.trim()) organization.telephone = contact.phone.trim();
  if (sameAs.length) organization.sameAs = sameAs;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "PMAFI",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Every value here comes from the staff-editable content sheet, so this
      // must be escaped for the script context — see toJsonLd above.
      dangerouslySetInnerHTML={{ __html: toJsonLd(data) }}
    />
  );
}
