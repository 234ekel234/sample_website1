import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MemberRecord } from "@/lib/members";

// The name path is the one place a PUBLIC identifier (a name) is exchanged for
// a record. Everything this action returns is serialized to the browser whether
// the UI renders it or not, so the tests below are about what must NOT be in
// that payload.

const checkMembership = vi.fn();
const findMemberByName = vi.fn();

vi.mock("@/lib/members", () => ({
  checkMembership: (...a: unknown[]) => checkMembership(...a),
  findMemberByName: (...a: unknown[]) => findMemberByName(...a),
}));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.9" }),
}));

const MEMBER: MemberRecord = {
  name: "Juan Dela Cruz",
  email: "juan@example.com",
  category: "Regular",
  standing: "Active",
  pmaClass: "1988",
  memberSince: "2010",
  source: "form",
};

async function load() {
  vi.resetModules();
  const { __resetRateLimits } = await import("@/lib/rate-limit");
  __resetRateLimits();
  return import("./actions");
}

function nameForm(name: string) {
  const fd = new FormData();
  fd.set("mode", "name");
  fd.set("name", name);
  return fd;
}

beforeEach(() => {
  checkMembership.mockReset();
  findMemberByName.mockReset();
});

describe("lookupMembershipAction — name path", () => {
  it("never returns the matched member's email address", async () => {
    // A name is public; an address is not. Returning one for the other would
    // turn this into a name-to-email harvester, visible in the network tab
    // even though nothing on screen shows it.
    findMemberByName.mockResolvedValue({ kind: "found", member: MEMBER });
    const { lookupMembershipAction } = await load();

    const state = await lookupMembershipAction(
      { status: "idle" },
      nameForm("Juan Dela Cruz")
    );

    expect(state.status).toBe("found");
    expect(JSON.stringify(state)).not.toContain("juan@example.com");
    expect(JSON.stringify(state)).not.toContain("@");
  });

  it("returns nothing the status check does not display", async () => {
    // The payload reaches the browser in full. A PMA class and joining year are
    // never rendered here, and together they are identity-fingerprint material,
    // so a name must not buy them.
    findMemberByName.mockResolvedValue({ kind: "found", member: MEMBER });
    const { lookupMembershipAction } = await load();
    const state = await lookupMembershipAction(
      { status: "idle" },
      nameForm("Juan Dela Cruz")
    );
    if (state.status !== "found") throw new Error("expected found");
    expect(state.pmaClass).toBe("");
    expect(state.memberSince).toBe("");
    const payload = JSON.stringify(state);
    expect(payload).not.toContain("1988");
    expect(payload).not.toContain("2010");
  });

  it("still returns the standing the member came for", async () => {
    findMemberByName.mockResolvedValue({ kind: "found", member: MEMBER });
    const { lookupMembershipAction } = await load();
    const state = await lookupMembershipAction({ status: "idle" }, nameForm("Juan Dela Cruz"));
    if (state.status !== "found") throw new Error("expected found");
    expect(state.name).toBe("Juan Dela Cruz");
    expect(state.category).toBe("Regular");
    expect(state.standing).toBe("Active");
  });

  it("reports ambiguity rather than picking a member", async () => {
    findMemberByName.mockResolvedValue({ kind: "ambiguous" });
    const { lookupMembershipAction } = await load();
    const state = await lookupMembershipAction({ status: "idle" }, nameForm("Ana Reyes"));
    expect(state.status).toBe("ambiguous");
  });

  it("rejects a too-short query without touching the roster", async () => {
    const { lookupMembershipAction } = await load();
    const state = await lookupMembershipAction({ status: "idle" }, nameForm("Jo"));
    expect(state.status).toBe("error");
    expect(findMemberByName).not.toHaveBeenCalled();
  });

  it("throttles repeated lookups from one caller", async () => {
    findMemberByName.mockResolvedValue({ kind: "none" });
    const { lookupMembershipAction } = await load();

    // The limit is 12 per 10 minutes; the 13th must be refused.
    for (let i = 0; i < 12; i++) {
      const s = await lookupMembershipAction({ status: "idle" }, nameForm(`Name Number ${i}`));
      expect(s.status).toBe("notfound");
    }
    const blocked = await lookupMembershipAction({ status: "idle" }, nameForm("One Too Many"));
    expect(blocked.status).toBe("error");
  });

  it("does not report 'not a member' when the sheet read fails", async () => {
    findMemberByName.mockRejectedValue(new Error("sheet down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { lookupMembershipAction } = await load();
    const state = await lookupMembershipAction({ status: "idle" }, nameForm("Juan Dela Cruz"));
    expect(state.status).toBe("error");
  });
});

describe("lookupMembershipAction — email path", () => {
  it("delegates to the email lookup and keeps returning the address", async () => {
    // The email path is unchanged: the visitor typed the address themselves, so
    // echoing it back reveals nothing they did not already supply.
    checkMembership.mockResolvedValue(MEMBER);
    const { lookupMembershipAction } = await load();
    const fd = new FormData();
    fd.set("mode", "email");
    fd.set("email", "juan@example.com");

    const state = await lookupMembershipAction({ status: "idle" }, fd);
    if (state.status !== "found") throw new Error("expected found");
    expect(state.email).toBe("juan@example.com");
  });

  it("defaults to the email path when no mode is supplied", async () => {
    checkMembership.mockResolvedValue(null);
    const { lookupMembershipAction } = await load();
    const fd = new FormData();
    fd.set("email", "nobody@example.com");
    const state = await lookupMembershipAction({ status: "idle" }, fd);
    expect(state.status).toBe("notfound");
    expect(findMemberByName).not.toHaveBeenCalled();
  });
});

describe("the digital ID gate — checkMembershipAction", () => {
  const fd = (email: string) => {
    const f = new FormData();
    f.set("email", email);
    return f;
  };

  it("issues a card to a member who applied through the form", async () => {
    checkMembership.mockResolvedValue(MEMBER);
    const { checkMembershipAction } = await load();
    const state = await checkMembershipAction({ status: "idle" }, fd("juan@example.com"));
    if (state.status !== "found") throw new Error("expected found");
    expect(state.name).toBe("Juan Dela Cruz");
  });

  it("issues a card to a member PMAFI added by hand", async () => {
    // Decided 2026-08-31, reversing an earlier refusal: the address on a
    // Manual Members row is the member's own — PMAFI asks for it so the member
    // can be reached — not one invented by whoever typed the row. 38 of the
    // roster's 80 rows are manual, so refusing them locked nearly half the
    // membership out of a card the site could perfectly well issue.
    checkMembership.mockResolvedValue({ ...MEMBER, source: "manual" });
    const { checkMembershipAction } = await load();
    const state = await checkMembershipAction({ status: "idle" }, fd("juan@example.com"));
    if (state.status !== "found") throw new Error("expected found");
    expect(state.name).toBe("Juan Dela Cruz");
  });

  it("never leaks the provenance of a record to the browser", async () => {
    // source decides nothing about access now, and it is nobody's business on
    // the client either — a payload saying "manual" would tell a visitor how
    // another member's row was created.
    checkMembership.mockResolvedValue({ ...MEMBER, source: "manual" });
    const { checkMembershipAction } = await load();
    const state = await checkMembershipAction({ status: "idle" }, fd("juan@example.com"));
    expect(JSON.stringify(state)).not.toMatch(/manual|form/);
  });

  it("still refuses a bad address and an unknown one", async () => {
    checkMembership.mockResolvedValue(null);
    const { checkMembershipAction } = await load();
    expect((await checkMembershipAction({ status: "idle" }, fd("nope"))).status).toBe("error");
    expect((await checkMembershipAction({ status: "idle" }, fd("no@one.com"))).status).toBe("notfound");
  });

  it("does not fall back to a card when the sheet read fails", async () => {
    checkMembership.mockRejectedValue(new Error("sheets down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { checkMembershipAction } = await load();
    const state = await checkMembershipAction({ status: "idle" }, fd("juan@example.com"));
    expect(state.status).toBe("error");
  });
});
