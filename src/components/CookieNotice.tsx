"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useConsent } from "@/components/ConsentProvider";
import type { ConsentChoice } from "@/lib/consent";

/**
 * The cookie notice.
 *
 * It is shown only where there is something to consent to — a build with no
 * `NEXT_PUBLIC_GA_ID` sets no cookies, and asking about cookies that do not
 * exist would be a false statement rather than an abundance of caution.
 *
 * THE TWO ANSWERS ARE EQUALLY PROMINENT, deliberately. A grey "Decline" beside
 * a bright "Accept" is a dark pattern: it collects a yes by making the no
 * harder to find, which is not consent. Both buttons are the same size and
 * weight; only the colour differs, and `gold-ink` on white carries the same
 * contrast as the navy.
 *
 * THERE IS NO DISMISS. No close cross, and Escape does not quietly shut it.
 * Dismissal is not an answer: reading it as "no" would ask again on every
 * page, and reading it as "yes" would help itself to a consent nobody gave.
 * The only ways out are the two buttons.
 *
 * The bar is split in two so that `shown` — the entrance transition — lives in
 * a component that exists only while the notice does. Reopening from the
 * footer therefore animates in exactly as the first showing did, rather than
 * appearing fully-formed because a flag was left true from last time.
 */
export default function CookieNotice() {
  const { asking, decide } = useConsent();
  if (!asking) return null;
  return <NoticeBar onDecide={decide} />;
}

function NoticeBar({ onDecide }: { onDecide: (choice: ConsentChoice) => void }) {
  const headingId = useId();
  const barRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  // One frame late, so the browser has a first paint to transition FROM.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Publish the height so the floating chat button can clear it. Measured
  // rather than guessed: this box is one row on a desktop and four on a narrow
  // phone, and a hardcoded offset would be wrong on one of them. The property
  // is removed on unmount, which is what returns the chat button to `bottom-5`.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const root = document.documentElement;
    const publish = () =>
      root.style.setProperty(
        "--consent-notice-height",
        `${Math.ceil(el.getBoundingClientRect().height)}px`,
      );
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--consent-notice-height");
    };
  }, []);

  return (
    <div
      ref={barRef}
      role="region"
      aria-labelledby={headingId}
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 transition-all duration-500 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_60px_-20px_rgba(27,42,74,0.45)] sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <div className="flex gap-3.5">
          <Cookie
            size={20}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-gold-ink"
          />
          <div>
            <p id={headingId} className="text-sm font-semibold text-[#1B2A4A]">
              Cookies on this site
            </p>
            {/* Says what is actually set, by whom, and what refusing costs —
                and stops there. An earlier draft added "the Foundation does
                not sell or share what it collects", which is a promise about
                PMAFI's conduct that nobody at PMAFI has made. Same rule as the
                rest of the site: no claim on the Foundation's behalf that the
                Foundation has not confirmed. */}
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              We would like to count visits with Google Analytics, which sets
              cookies in your browser. Nothing is set unless you accept, and
              you can change your answer at any time from the footer.{" "}
              <Link
                href="/contact"
                className="font-medium text-gold-ink underline underline-offset-2 transition-colors hover:text-[#1B2A4A]"
              >
                Questions?
              </Link>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2.5 sm:ml-auto">
          <button
            type="button"
            onClick={() => onDecide("denied")}
            className="flex-1 rounded-lg border border-[#1B2A4A]/25 px-5 py-2.5 text-sm font-semibold text-[#1B2A4A] transition-colors hover:bg-[#1B2A4A] hover:text-white sm:flex-none"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => onDecide("granted")}
            className="flex-1 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#8A6A22] hover:text-white sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
