import { SITE_URL } from "@/lib/site";

/**
 * JSON-LD structured data for richer Google results (Organization + WebSite).
 *
 * Only confirmed facts are included. Phone, social profiles (`sameAs`), and the
 * official email are deliberately omitted while they remain pending PMAFI
 * confirmation — add them here once verified.
 */
const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NGO",
      "@id": `${SITE_URL}/#organization`,
      name: "Philippine Military Academy Foundation, Inc.",
      alternateName: "PMAFI",
      url: SITE_URL,
      logo: `${SITE_URL}/pmafi-logo.png`,
      foundingDate: "1988",
      description:
        "A non-stock, non-profit foundation supporting the Philippine Military Academy in developing officers of integrity, competence, and character for the nation.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fort del Pilar",
        addressLocality: "Baguio City",
        addressCountry: "PH",
      },
    },
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

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inject; no user input is involved.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
