import { describe, it, expect, afterEach, vi } from "vitest";
import {
  CONSENT_KEY,
  CONSENT_VERSION,
  clearConsent,
  forgetConsent,
  getConsentSnapshot,
  getServerConsentSnapshot,
  parseConsent,
  readConsent,
  resetConsentStoreForTests,
  serializeConsent,
  setConsent,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";

// These tests are all one property in different clothes: NOTHING BUT AN INTACT
// "granted" LOADS THE TRACKER. Every other state — absent, malformed, wrong
// version, storage that throws — has to come back as "ask again", because the
// alternative is setting a third-party cookie on a visitor who never agreed.

/** A localStorage stand-in. `vitest` runs in node, so there is no real one. */
function fakeStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    /** Test-only view of what was actually written. */
    raw: () => map.get(CONSENT_KEY) ?? null,
  };
}

/** A storage that throws on every access, as Safari's does in private mode. */
const hostileStorage = {
  getItem() {
    throw new DOMException("denied");
  },
  setItem() {
    throw new DOMException("denied");
  },
  removeItem() {
    throw new DOMException("denied");
  },
};

describe("parseConsent — what counts as an answer", () => {
  it("round-trips a granted answer", () => {
    expect(parseConsent(serializeConsent("granted"))).toBe("granted");
  });

  it("round-trips a denied answer, which is an answer and not an absence", () => {
    // A refusal has to persist, or the notice reappears on every page and the
    // only way to stop being asked is to say yes.
    expect(parseConsent(serializeConsent("denied"))).toBe("denied");
  });

  it("treats nothing stored as no answer", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent("")).toBeNull();
  });

  it("treats unparseable storage as no answer rather than as consent", () => {
    expect(parseConsent("granted")).toBeNull(); // bare string, not the record
    expect(parseConsent("{")).toBeNull();
    expect(parseConsent("null")).toBeNull();
    expect(parseConsent("[]")).toBeNull();
    expect(parseConsent("42")).toBeNull();
  });

  it("rejects a record whose choice is not one of the two answers", () => {
    const forged = JSON.stringify({ choice: "yes", version: CONSENT_VERSION });
    expect(parseConsent(forged)).toBeNull();
    const missing = JSON.stringify({ version: CONSENT_VERSION });
    expect(parseConsent(missing)).toBeNull();
  });

  it("asks again when the stored answer predates the current version", () => {
    // The version is what makes it safe to add a second tracker later: an old
    // yes was a yes to something else, and must not be read as covering it.
    const old = JSON.stringify({
      choice: "granted",
      version: CONSENT_VERSION - 1,
      at: new Date().toISOString(),
    });
    expect(parseConsent(old)).toBeNull();
  });

  it("asks again when the stored answer is from a newer build", () => {
    // Same reasoning in the other direction — a version this build cannot read
    // is not an answer it may act on.
    const future = JSON.stringify({
      choice: "granted",
      version: CONSENT_VERSION + 1,
      at: new Date().toISOString(),
    });
    expect(parseConsent(future)).toBeNull();
  });

  it("records when the answer was given", () => {
    const at = new Date("2026-09-19T02:00:00.000Z");
    expect(JSON.parse(serializeConsent("granted", at)).at).toBe(at.toISOString());
  });
});

describe("storage access", () => {
  it("reads back what it wrote", () => {
    const storage = fakeStorage();
    writeConsent(storage, "granted");
    expect(readConsent(storage)).toBe("granted");
  });

  it("stores the answer under the documented key", () => {
    const storage = fakeStorage();
    writeConsent(storage, "denied");
    expect(storage.raw()).not.toBeNull();
    expect(CONSENT_KEY).toBe("pmafi:analytics-consent");
  });

  it("forgets an answer on request, so the notice returns", () => {
    // This is what the footer's "Cookie settings" control does. A visitor who
    // accepted has to be able to take it back.
    const storage = fakeStorage();
    writeConsent(storage, "granted");
    clearConsent(storage);
    expect(readConsent(storage)).toBeNull();
  });

  it("survives a storage that throws instead of returning null", () => {
    // Private browsing. The visitor least likely to want tracking is the last
    // one who should meet a crash where the cookie notice belongs.
    expect(() => readConsent(hostileStorage)).not.toThrow();
    expect(readConsent(hostileStorage)).toBeNull();
    expect(() => writeConsent(hostileStorage, "granted")).not.toThrow();
    expect(() => clearConsent(hostileStorage)).not.toThrow();
  });

  it("treats an absent storage as no answer", () => {
    // Server-side render: there is no localStorage, and the honest answer at
    // that moment is that nobody has decided yet.
    expect(readConsent(null)).toBeNull();
    expect(() => writeConsent(null, "granted")).not.toThrow();
  });

  it("does not read an answer out of an unrelated key", () => {
    const storage = fakeStorage({
      "pmafi:id-photo": serializeConsent("granted"),
    });
    expect(readConsent(storage)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// The store
//
// These run in node, so there is no `window`. One is installed per test — a
// localStorage and a `storage` event, which is all the store touches.
// ---------------------------------------------------------------------------

function installFakeWindow(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  const handlers = new Set<(event: StorageEvent) => void>();
  const win = {
    localStorage: {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    },
    addEventListener: (type: string, fn: (event: StorageEvent) => void) => {
      if (type === "storage") handlers.add(fn);
    },
    removeEventListener: (type: string, fn: (event: StorageEvent) => void) => {
      if (type === "storage") handlers.delete(fn);
    },
    /** Test-only: play an event as another tab would have raised it. */
    fromAnotherTab: (key: string | null, newValue: string | null) => {
      for (const fn of [...handlers]) fn({ key, newValue } as StorageEvent);
    },
    listenerCount: () => handlers.size,
    stored: () => map.get(CONSENT_KEY) ?? null,
  };
  (globalThis as { window?: unknown }).window = win;
  return win;
}

afterEach(() => {
  resetConsentStoreForTests();
  delete (globalThis as { window?: unknown }).window;
});

describe("the server snapshot", () => {
  it("is 'not read yet', never 'nobody answered'", () => {
    // THE NO-FLASH PROPERTY. If the server rendered `null` the notice would be
    // in the HTML for every visitor, including the ones who settled this months
    // ago, and would be torn out again on the hydration frame.
    expect(getServerConsentSnapshot()).toBeUndefined();
    expect(getServerConsentSnapshot()).not.toBeNull();
  });
});

describe("the client snapshot", () => {
  it("reads the stored answer once and then serves it", () => {
    const win = installFakeWindow({ [CONSENT_KEY]: serializeConsent("granted") });
    expect(getConsentSnapshot()).toBe("granted");
    // A second call must not go back to storage — React calls this on every
    // render, and it must also be stable enough not to loop.
    win.localStorage.removeItem(CONSENT_KEY);
    expect(getConsentSnapshot()).toBe("granted");
  });

  it("reports an unanswered browser as unanswered", () => {
    installFakeWindow();
    expect(getConsentSnapshot()).toBeNull();
  });
});

describe("answering", () => {
  it("persists the answer and notifies watchers", () => {
    const win = installFakeWindow();
    const listener = vi.fn();
    subscribeConsent(listener);

    setConsent("granted");

    expect(getConsentSnapshot()).toBe("granted");
    expect(parseConsent(win.stored())).toBe("granted");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("takes an answer back, and the notice is due again", () => {
    installFakeWindow({ [CONSENT_KEY]: serializeConsent("granted") });
    const listener = vi.fn();
    subscribeConsent(listener);

    forgetConsent();

    expect(getConsentSnapshot()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("stops tracking the moment consent is withdrawn", () => {
    // The whole point of the footer control: a granted answer must be able to
    // become a denied one, in this page view, without a reload.
    installFakeWindow();
    setConsent("granted");
    setConsent("denied");
    expect(getConsentSnapshot()).toBe("denied");
  });
});

describe("other tabs", () => {
  it("adopts an answer given in another tab", () => {
    // Otherwise a second open tab goes on asking a question the visitor has
    // already answered — and answering it there would overwrite the first.
    const win = installFakeWindow();
    const listener = vi.fn();
    subscribeConsent(listener);
    expect(getConsentSnapshot()).toBeNull();

    win.fromAnotherTab(CONSENT_KEY, serializeConsent("granted"));

    expect(getConsentSnapshot()).toBe("granted");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("notices a withdrawal in another tab", () => {
    const win = installFakeWindow({ [CONSENT_KEY]: serializeConsent("granted") });
    subscribeConsent(vi.fn());
    expect(getConsentSnapshot()).toBe("granted");

    win.fromAnotherTab(CONSENT_KEY, null);

    expect(getConsentSnapshot()).toBeNull();
  });

  it("honours a wholesale clear of storage", () => {
    // `key === null` is the whole store being emptied, which does concern us.
    const win = installFakeWindow({ [CONSENT_KEY]: serializeConsent("granted") });
    subscribeConsent(vi.fn());
    expect(getConsentSnapshot()).toBe("granted");

    win.fromAnotherTab(null, null);

    expect(getConsentSnapshot()).toBeNull();
  });

  it("ignores a change to an unrelated key", () => {
    const win = installFakeWindow({ [CONSENT_KEY]: serializeConsent("granted") });
    const listener = vi.fn();
    subscribeConsent(listener);
    expect(getConsentSnapshot()).toBe("granted");

    win.fromAnotherTab("pmafi:id-photo", "data:image/jpeg;base64,...");

    expect(getConsentSnapshot()).toBe("granted");
    expect(listener).not.toHaveBeenCalled();
  });

  it("does not re-notify when another tab restates the same answer", () => {
    const win = installFakeWindow({ [CONSENT_KEY]: serializeConsent("granted") });
    const listener = vi.fn();
    subscribeConsent(listener);
    expect(getConsentSnapshot()).toBe("granted");

    win.fromAnotherTab(CONSENT_KEY, serializeConsent("granted"));

    expect(listener).not.toHaveBeenCalled();
  });
});

describe("subscribing", () => {
  it("attaches one window listener however many components are watching", () => {
    const win = installFakeWindow();
    const first = subscribeConsent(vi.fn());
    const second = subscribeConsent(vi.fn());
    expect(win.listenerCount()).toBe(1);

    first();
    expect(win.listenerCount()).toBe(1);
    second();
    expect(win.listenerCount()).toBe(0);
  });

  it("stops calling a listener that has unsubscribed", () => {
    installFakeWindow();
    const listener = vi.fn();
    const unsubscribe = subscribeConsent(listener);
    unsubscribe();

    setConsent("granted");

    expect(listener).not.toHaveBeenCalled();
  });
});
