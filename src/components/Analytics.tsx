"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { GA_ID, analyticsConfigured, trackPageView } from "@/lib/analytics";
import { useConsent } from "@/components/ConsentProvider";

/**
 * Google Analytics 4 — loaded only for a visitor who has accepted it.
 *
 * TWO GATES, AND BOTH ARE LOAD-BEARING:
 *
 *  1. `NEXT_PUBLIC_GA_ID` must be set. Nothing to configure until PMAFI
 *     supplies a Measurement ID; local builds have none and stay silent.
 *  2. The visitor must have answered "granted". Until then this renders
 *     NOTHING — no script tag, no `window.gtag`, no request to Google.
 *
 * The second gate is why the refusal path needs no further defending. The
 * tempting alternative is to load GA always and set Google's consent mode to
 * denied, but that still fetches a third-party script and pings Google from a
 * page the visitor has not agreed to be measured on. Rendering nothing cannot
 * be got wrong by a later change to a flag.
 *
 * It also means `track()` in `lib/analytics.ts` needs no consent check of its
 * own — there is no `gtag` for it to call. Do not "fix" that by loading the
 * script early and guarding the calls instead.
 */
export default function Analytics() {
  const { choice } = useConsent();
  const granted = analyticsConfigured && choice === "granted";

  const pathname = usePathname();
  // The GA snippet counts the first page itself. Counting it again here would
  // double every session's landing page.
  const countedFirstView = useRef(false);

  useEffect(() => {
    if (!granted) {
      // A visitor who withdraws consent stops being counted from that moment;
      // the next grant starts a fresh first view rather than replaying one.
      countedFirstView.current = false;
      return;
    }
    if (!countedFirstView.current) {
      countedFirstView.current = true;
      return;
    }
    trackPageView(pathname);
  }, [granted, pathname]);

  if (!granted) return null;

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
