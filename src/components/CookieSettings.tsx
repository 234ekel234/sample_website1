"use client";

import { useConsent } from "@/components/ConsentProvider";

/**
 * The footer's way back to the cookie notice.
 *
 * An answer that cannot be taken back is not really a choice, and "you can
 * change your answer at any time from the footer" is a promise the notice
 * makes — this is what keeps it true.
 *
 * Renders nothing where analytics are not configured, and nothing while the
 * notice is already on screen, on the same principle as the site's other
 * conditional controls: a control that would do nothing visible when pressed
 * is worse than no control. (Compare the correction-request link on
 * `/membership/id`, hidden rather than rendered dead when its key is blank.)
 */
export default function CookieSettings() {
  const { configured, asking, choice, reopen } = useConsent();

  if (!configured || asking) return null;

  return (
    <button
      type="button"
      onClick={reopen}
      className="underline underline-offset-2 transition-colors hover:text-white"
    >
      Cookie settings
      {/* The current answer, for a visitor who has forgotten which they gave.
          Only stated once storage has actually been read. */}
      {choice ? (
        <span className="sr-only">
          {choice === "granted"
            ? " — analytics are currently accepted"
            : " — analytics are currently declined"}
        </span>
      ) : null}
    </button>
  );
}
