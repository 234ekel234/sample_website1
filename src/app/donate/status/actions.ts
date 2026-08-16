"use server";

import {
  getGivingHistory,
  getGivingByEmail,
  type DonationRecord,
} from "@/lib/donations";
import { getFundUpdates, type FundUpdate } from "@/lib/fund-updates";
import { sendGivingSummary } from "@/lib/giving-email";
import { rateLimit } from "@/lib/rate-limit";

export type GivingCheckState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "nomatch" }
  | {
      status: "found";
      donorName: string;
      donations: DonationRecord[];
      total: number;
      /**
       * Recent updates for the funds this donor actually gave to, keyed by
       * fund name. The status page could always say WHERE a gift was
       * designated; it could never say what that fund then did, so the answer
       * to "what is my donation doing" sat on a page the donor had to go and
       * find. This carries it back to them.
       *
       * Public content — the same updates render at /donate/impact for
       * anybody — so putting it in this payload reveals nothing.
       */
      fundUpdates: Record<string, FundUpdate[]>;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function checkGivingAction(
  _prev: GivingCheckState,
  formData: FormData
): Promise<GivingCheckState> {
  const email = String(formData.get("email") ?? "").trim();
  const reference = String(formData.get("reference") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (!reference) {
    return {
      status: "error",
      message: "Please enter the reference from your acknowledgment.",
    };
  }

  // The reference path reveals figures on screen, so throttle guessing. Keyed on
  // the email being probed rather than the reference, since an attacker varies
  // the reference while holding the address fixed.
  const guessLimit = rateLimit(`giving-lookup:${email.toLowerCase()}`, 10, 10 * 60 * 1000);
  if (!guessLimit.ok) {
    return { status: "nomatch" };
  }

  let history;
  try {
    history = await getGivingHistory(email, reference);
  } catch (err) {
    // Sheet read / config failure — don't tell a real donor their gift is
    // missing because our spreadsheet was briefly unreachable.
    console.error("Giving lookup failed:", err);
    return {
      status: "error",
      message:
        "We couldn't look up your donations right now. Please try again shortly, or contact us if it persists.",
    };
  }

  // ONE message for every kind of miss — unknown reference, wrong email, or a
  // reference belonging to someone else. Distinguishing them would turn this
  // page into a way to test whether an address has ever donated.
  if (!history) {
    return { status: "nomatch" };
  }

  return {
    status: "found",
    donorName: history.donorName,
    donations: history.donations,
    total: history.total,
    fundUpdates: await updatesForFunds(history.donations),
  };
}

/** How many updates per fund to carry back. Enough to show the fund is alive,
 *  few enough that the giving summary stays the point of the page. */
const UPDATES_PER_FUND = 2;

/**
 * The most recent updates for each fund in this donor's history.
 *
 * Never allowed to fail the lookup: a donor came to see their gifts, and an
 * unreachable or empty Fund Updates tab must cost them nothing. getFundUpdates
 * already swallows its own errors and returns [], and this returns {} — both
 * render as simply no updates section.
 */
async function updatesForFunds(
  donations: DonationRecord[]
): Promise<Record<string, FundUpdate[]>> {
  const funds = [...new Set(donations.map((d) => d.fund.trim()).filter(Boolean))];
  if (funds.length === 0) return {};

  const all = await getFundUpdates();
  if (all.length === 0) return {};

  const byFund: Record<string, FundUpdate[]> = {};
  for (const fund of funds) {
    // Staff type the fund name twice — once in the donation log, once on the
    // update — so match forgivingly rather than demanding they agree exactly.
    const needle = fund.toLowerCase();
    const mine = all
      .filter((u) => u.fund.trim().toLowerCase() === needle)
      .slice(0, UPDATES_PER_FUND);
    if (mine.length > 0) byFund[fund] = mine;
  }
  return byFund;
}

// ---------------------------------------------------------------------------
// Email path — the delivery the proposal describes.
//
// A donor who has no reference code enters only their address. Nothing is ever
// rendered on screen: the summary goes to the inbox, so only the person who can
// open it sees the figures.
// ---------------------------------------------------------------------------

export type GivingEmailState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string };

export async function emailGivingSummaryAction(
  _prev: GivingEmailState,
  formData: FormData
): Promise<GivingEmailState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  // Throttle on the RECIPIENT, not the sender: the harm here is a donor's inbox
  // filling with summaries, and the person submitting is not the person hurt.
  // Three an hour is far above any honest use — a donor asks once.
  const limited = rateLimit(`giving-email:${email.toLowerCase()}`, 3, 60 * 60 * 1000);
  if (!limited.ok) {
    // Deliberately identical in shape to success. Saying "too many requests for
    // this address" would confirm the address is worth targeting.
    return { status: "sent" };
  }

  let history;
  try {
    history = await getGivingByEmail(email);
  } catch (err) {
    console.error("Giving lookup failed:", err);
    return {
      status: "error",
      message:
        "We couldn't send your summary right now. Please try again shortly, or contact us if it persists.",
    };
  }

  // NOTHING BELOW MAY VARY BY WHETHER A RECORD EXISTS.
  //
  // Returning "no gifts found" here would rebuild exactly the oracle this
  // design exists to remove: anyone could type a fellow alumnus's address and
  // learn whether they have ever given. An address with no gifts simply gets
  // no email, and the page says the same thing either way.
  if (!history) {
    return { status: "sent" };
  }

  try {
    await sendGivingSummary(email, history);
  } catch (err) {
    // A genuine send failure is a service error, not a lookup result — never
    // tell a donor their summary is on the way when it is not.
    console.error("Giving summary send failed:", err);
    return {
      status: "error",
      message:
        "We couldn't send your summary right now. Please try again shortly, or contact us if it persists.",
    };
  }

  return { status: "sent" };
}
