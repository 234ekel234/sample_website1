"use server";

import { getGivingHistory, type DonationRecord } from "@/lib/donations";

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
