import Script from "next/script";

/**
 * Google Analytics 4, wired but dormant. It only loads when the site is built
 * with a `NEXT_PUBLIC_GA_ID` env var set, so there's nothing to configure until
 * PMAFI provides a Measurement ID (e.g. "G-XXXXXXXXXX").
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
