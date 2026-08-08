"use server";

import {
  getGivingHistory,
  getGivingByEmail,
  type DonationRecord,
} from "@/lib/donations";
import { sendGivingSummary } from "@/lib/giving-email";

export type GivingCheckState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "nomatch" }
  | {
      status: "found";
      donorName: string;
      donations: DonationRecord[];
      total: number;
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
        "We couldn't look up your giving right now. Please try again shortly, or contact us if it persists.",
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
  };
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
