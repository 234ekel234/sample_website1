"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  forgetConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  setConsent,
  subscribeConsent,
  type ConsentChoice,
} from "@/lib/consent";
import { analyticsConfigured } from "@/lib/analytics";

// One answer, read once, shared by the four things that care about it: the
// analytics script (loads or does not), the notice (shows or does not), the
// chat button (steps out of the notice's way) and the footer control (offers
// the way back). They are scattered across the layout, so a context is what
// keeps them from each reading storage and disagreeing for a frame.

interface ConsentValue {
  /**
   * `undefined` until storage has been read in the browser — NOT the same as
   * `null`, which means read and unanswered. See the store note in
   * `lib/consent.ts`: collapsing the two would flash the notice at every
   * visitor who has already answered.
   */
  choice: ConsentChoice | null | undefined;
  /** True when the notice belongs on screen. */
  asking: boolean;
  /** Record an answer and act on it immediately — no reload. */
  decide: (choice: ConsentChoice) => void;
  /** Forget the answer and ask again. Drives "Cookie settings" in the footer. */
  reopen: () => void;
  /** False where no measurement ID was built in; nothing to consent to. */
  configured: boolean;
}

const ConsentContext = createContext<ConsentValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const choice = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );

  const decide = useCallback((next: ConsentChoice) => setConsent(next), []);
  const reopen = useCallback(() => forgetConsent(), []);

  const value = useMemo<ConsentValue>(
    () => ({
      choice,
      // Ask only when there is a tracker to ask about, storage has actually
      // been read, and nobody has answered.
      asking: analyticsConfigured && choice === null,
      decide,
      reopen,
      configured: analyticsConfigured,
    }),
    [choice, decide, reopen],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

/**
 * Read the consent state.
 *
 * Returns a safe "nothing granted, nothing being asked" shape outside the
 * provider rather than throwing, so a component rendered in isolation — a
 * test, a future page that forgets the provider — fails towards no tracking.
 */
export function useConsent(): ConsentValue {
  const ctx = useContext(ConsentContext);
  if (ctx) return ctx;
  return {
    choice: undefined,
    asking: false,
    decide: () => {},
    reopen: () => {},
    configured: false,
  };
}
