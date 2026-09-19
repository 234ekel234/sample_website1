// Whether the visitor has agreed to analytics cookies.
//
// WHY THIS EXISTS: Google Analytics used to load for everybody the moment
// NEXT_PUBLIC_GA_ID was set, which it is on Production — so the site set
// third-party cookies on a first visit with nothing on the page saying so. The
// Philippines' Data Privacy Act asks for consent before processing personal
// data, and an analytics cookie is that whether or not the visitor is named.
//
// THE GATE IS OPT-IN, NOT OPT-OUT: nothing loads until a visitor says yes.
// Loading first and removing on refusal would already have set the cookie, and
// Google's own "consent mode" still contacts Google on a page the visitor has
// not agreed to be measured on. `Analytics.tsx` renders nothing at all until
// the answer is "granted", so the refusal case has no script to defend.
//
// This module is deliberately free of React and of `window` so the rules below
// can be tested directly. The browser wiring is in `ConsentProvider.tsx`.

/** localStorage key. Browser-local, never sent anywhere. */
export const CONSENT_KEY = "pmafi:analytics-consent";

/**
 * Bump when what is being consented TO changes — a second tracker, a different
 * measurement scope. A stored answer from an older version is treated as no
 * answer, so the visitor is asked again rather than having a yes to one thing
 * silently read as a yes to another.
 */
export const CONSENT_VERSION = 1;

export type ConsentChoice = "granted" | "denied";

interface StoredConsent {
  choice: ConsentChoice;
  version: number;
  /** ISO date, for a visitor who wants to know when they answered. */
  at: string;
}

function isChoice(value: unknown): value is ConsentChoice {
  return value === "granted" || value === "denied";
}

/**
 * Read a stored answer.
 *
 * Returns `null` for anything that is not an intact answer at the current
 * version — absent, malformed, truncated, hand-edited, or written by an older
 * build. EVERY uncertain case has to land on `null` (ask again) rather than on
 * a choice: the failure that matters is reading rubbish as `"granted"` and
 * loading a tracker the visitor never agreed to. Asking twice is a nuisance;
 * that would be the bug this module exists to prevent.
 */
export function parseConsent(raw: string | null | undefined): ConsentChoice | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;

  const { choice, version } = parsed as Partial<StoredConsent>;
  if (!isChoice(choice)) return null;
  // Not `<` — a value from a NEWER build is equally unreadable here, and
  // guessing at it would be the same mistake in the other direction.
  if (version !== CONSENT_VERSION) return null;

  return choice;
}

/** Serialize an answer for storage. */
export function serializeConsent(
  choice: ConsentChoice,
  now: Date = new Date(),
): string {
  const record: StoredConsent = {
    choice,
    version: CONSENT_VERSION,
    at: now.toISOString(),
  };
  return JSON.stringify(record);
}

/**
 * Read the answer out of a storage object, surviving a storage that throws.
 *
 * Safari in private browsing throws on `localStorage` access rather than
 * returning null, and a visitor who has blocked storage outright is the last
 * person who should be met with a crash instead of a cookie notice.
 */
export function readConsent(storage: Pick<Storage, "getItem"> | null): ConsentChoice | null {
  if (!storage) return null;
  try {
    return parseConsent(storage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

/** Persist an answer. Silently does nothing where storage is unavailable. */
export function writeConsent(
  storage: Pick<Storage, "setItem"> | null,
  choice: ConsentChoice,
  now?: Date,
): void {
  if (!storage) return;
  try {
    storage.setItem(CONSENT_KEY, serializeConsent(choice, now));
  } catch {
    // Quota or private browsing. The choice still holds for this page view;
    // it is simply forgotten on the next one, which errs towards asking again.
  }
}

/** Forget the answer, so the notice is shown again. */
export function clearConsent(storage: Pick<Storage, "removeItem"> | null): void {
  if (!storage) return;
  try {
    storage.removeItem(CONSENT_KEY);
  } catch {
    // As above.
  }
}

// ---------------------------------------------------------------------------
// The store
//
// localStorage is an external store shared by every tab, so React reads it
// through `useSyncExternalStore` rather than copying it into state in an
// effect. Two things fall out of that, both wanted:
//
//   - NO FLASH. The server snapshot is `undefined` — "nobody has read storage
//     yet" — which renders no notice. A visitor who accepted months ago never
//     sees the bar appear and vanish on a hydration frame.
//   - TABS AGREE. Accepting in one tab settles the question in every other
//     open tab, because they all hear the `storage` event. Otherwise a second
//     tab goes on asking a question the visitor has already answered, and
//     answering it there could overwrite the first answer.
//
// This stays free of React so it can be tested directly.
// ---------------------------------------------------------------------------

type Listener = () => void;
const listeners = new Set<Listener>();

/** `undefined` = storage not read yet. `null` = read, and nobody answered. */
let snapshot: ConsentChoice | null | undefined;
let read = false;

function browserStorage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function handleStorageEvent(event: StorageEvent): void {
  // `key === null` is a `clear()` of the whole store, which does concern us.
  if (event.key !== null && event.key !== CONSENT_KEY) return;
  const next = parseConsent(event.newValue);
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

/** Subscribe to changes. Returns the unsubscribe function React expects. */
export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

/** The current answer in this browser. Reads storage once, then caches. */
export function getConsentSnapshot(): ConsentChoice | null | undefined {
  if (!read) {
    snapshot = readConsent(browserStorage());
    read = true;
  }
  return snapshot;
}

/**
 * The answer during a server render: not yet known.
 *
 * Deliberately NOT `null`. `null` means "asked and unanswered", which would
 * render the notice into the HTML for everybody — including the visitors who
 * settled this long ago — and then tear it out again on hydration.
 */
export function getServerConsentSnapshot(): ConsentChoice | null | undefined {
  return undefined;
}

/** Record an answer and tell everything that is watching. */
export function setConsent(choice: ConsentChoice): void {
  writeConsent(browserStorage(), choice);
  snapshot = choice;
  read = true;
  for (const listener of listeners) listener();
}

/** Forget the answer and ask again. */
export function forgetConsent(): void {
  clearConsent(browserStorage());
  snapshot = null;
  read = true;
  for (const listener of listeners) listener();
}

/** Test-only: drop the cached snapshot and every listener. */
export function resetConsentStoreForTests(): void {
  listeners.clear();
  snapshot = undefined;
  read = false;
  if (typeof window !== "undefined") {
    window.removeEventListener("storage", handleStorageEvent);
  }
}
