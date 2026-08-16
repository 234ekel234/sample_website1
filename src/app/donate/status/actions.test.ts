import { describe, it, expect, vi, beforeEach } from "vitest";
import type { DonationRecord } from "@/lib/donations";
import type { FundUpdate } from "@/lib/fund-updates";

// The giving lookup now carries back what each fund has been doing. These tests
// are about that attachment: the right funds, none of the others, and never at
// the cost of the lookup the donor actually came for.

const getGivingHistory = vi.fn();
const getGivingByEmail = vi.fn();
const getFundUpdates = vi.fn();

vi.mock("@/lib/donations", () => ({
  getGivingHistory: (...a: unknown[]) => getGivingHistory(...a),
  getGivingByEmail: (...a: unknown[]) => getGivingByEmail(...a),
}));
vi.mock("@/lib/fund-updates", () => ({
  getFundUpdates: (...a: unknown[]) => getFundUpdates(...a),
}));
vi.mock("@/lib/giving-email", () => ({ sendGivingSummary: vi.fn() }));

const gift = (fund: string, reference: string): DonationRecord => ({
  reference,
  email: "juan@example.com",
  donorName: "Juan Dela Cruz",
  date: "2026-03-01",
  amount: 10000,
  fund,
  status: "Allocated",
});

const update = (fund: string, title: string, date: string): FundUpdate => ({
  fund,
  title,
  message: "…",
  date,
  image: "",
});

async function load() {
  vi.resetModules();
  const { __resetRateLimits } = await import("@/lib/rate-limit");
  __resetRateLimits();
  return import("./actions");
}

function form(email: string, reference: string) {
  const fd = new FormData();
  fd.set("email", email);
  fd.set("reference", reference);
  return fd;
}

beforeEach(() => {
  getGivingHistory.mockReset();
  getGivingByEmail.mockReset();
  getFundUpdates.mockReset();
  getFundUpdates.mockResolvedValue([]);
});

describe("checkGivingAction — fund updates", () => {
  it("returns updates only for the funds this donor gave to", async () => {
    getGivingHistory.mockResolvedValue({
      donorName: "Juan Dela Cruz",
      donations: [gift("Endowment Fund", "R1")],
      total: 10000,
    });
    getFundUpdates.mockResolvedValue([
      update("Endowment Fund", "Endowment news", "2026-05-01"),
      update("Professorial Chair Fund", "Someone else's fund", "2026-05-01"),
    ]);

    const { checkGivingAction } = await load();
    const state = await checkGivingAction({ status: "idle" }, form("juan@example.com", "R1"));
    if (state.status !== "found") throw new Error("expected found");

    expect(Object.keys(state.fundUpdates)).toEqual(["Endowment Fund"]);
    expect(JSON.stringify(state)).not.toContain("Someone else's fund");
  });

  it("matches the fund name loosely, since staff type it twice", async () => {
    // Once in the donation log, once on the update. Demanding they agree
    // exactly would silently show a donor nothing.
    getGivingHistory.mockResolvedValue({
      donorName: "Juan",
      donations: [gift("  endowment fund ", "R1")],
      total: 1,
    });
    getFundUpdates.mockResolvedValue([update("Endowment Fund", "News", "2026-05-01")]);

    const { checkGivingAction } = await load();
    const state = await checkGivingAction({ status: "idle" }, form("juan@example.com", "R1"));
    if (state.status !== "found") throw new Error("expected found");
    expect(Object.values(state.fundUpdates)[0]?.[0].title).toBe("News");
  });

  it("caps how many updates ride along per fund", async () => {
    getGivingHistory.mockResolvedValue({
      donorName: "Juan",
      donations: [gift("Endowment Fund", "R1")],
      total: 1,
    });
    getFundUpdates.mockResolvedValue([
      update("Endowment Fund", "A", "2026-05-03"),
      update("Endowment Fund", "B", "2026-05-02"),
      update("Endowment Fund", "C", "2026-05-01"),
    ]);

    const { checkGivingAction } = await load();
    const state = await checkGivingAction({ status: "idle" }, form("juan@example.com", "R1"));
    if (state.status !== "found") throw new Error("expected found");
    expect(state.fundUpdates["Endowment Fund"]).toHaveLength(2);
  });

  it("covers every fund when a donor gave to several", async () => {
    getGivingHistory.mockResolvedValue({
      donorName: "Juan",
      donations: [gift("Endowment Fund", "R1"), gift("Professorial Chair Fund", "R2")],
      total: 2,
    });
    getFundUpdates.mockResolvedValue([
      update("Endowment Fund", "E", "2026-05-01"),
      update("Professorial Chair Fund", "P", "2026-05-01"),
    ]);

    const { checkGivingAction } = await load();
    const state = await checkGivingAction({ status: "idle" }, form("juan@example.com", "R1"));
    if (state.status !== "found") throw new Error("expected found");
    expect(Object.keys(state.fundUpdates).sort()).toEqual([
      "Endowment Fund",
      "Professorial Chair Fund",
    ]);
  });

  it("still returns the giving history when there are no updates at all", async () => {
    // The donor came to see their gifts. An empty Fund Updates tab must cost
    // them nothing.
    getGivingHistory.mockResolvedValue({
      donorName: "Juan",
      donations: [gift("Endowment Fund", "R1")],
      total: 10000,
    });
    getFundUpdates.mockResolvedValue([]);

    const { checkGivingAction } = await load();
    const state = await checkGivingAction({ status: "idle" }, form("juan@example.com", "R1"));
    if (state.status !== "found") throw new Error("expected found");
    expect(state.fundUpdates).toEqual({});
    expect(state.total).toBe(10000);
    expect(state.donations).toHaveLength(1);
  });

  it("handles a gift with no designated fund", async () => {
    getGivingHistory.mockResolvedValue({
      donorName: "Juan",
      donations: [gift("", "R1")],
      total: 1,
    });
    const { checkGivingAction } = await load();
    const state = await checkGivingAction({ status: "idle" }, form("juan@example.com", "R1"));
    if (state.status !== "found") throw new Error("expected found");
    expect(state.fundUpdates).toEqual({});
    expect(getFundUpdates).not.toHaveBeenCalled();
  });

  it("says nothing extra on a miss", async () => {
    // The uniform no-match response is the whole privacy design of this page;
    // attaching fund updates must not give it a second shape.
    getGivingHistory.mockResolvedValue(null);
    const { checkGivingAction } = await load();
    const state = await checkGivingAction({ status: "idle" }, form("juan@example.com", "nope"));
    expect(state).toEqual({ status: "nomatch" });
  });
});
