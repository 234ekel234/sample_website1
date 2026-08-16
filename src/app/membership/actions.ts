"use server";

import { headers } from "next/headers";
import { checkMembership, findMemberByName } from "@/lib/members";
import { rateLimit } from "@/lib/rate-limit";

export type MembershipCheckState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "notfound"; email: string }
  | {
      status: "found";
      email: string;
      name: string;
      category: string;
      standing: "Active" | "Lapsed" | "Pending";
      pmaClass: string;
      memberSince: string;
    };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function checkMembershipAction(
  _prev: MembershipCheckState,
  formData: FormData
): Promise<MembershipCheckState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  let member;
  try {
    member = await checkMembership(email);
  } catch (err) {
    // Sheet read / config failure — don't falsely report "not a member".
    console.error("Membership lookup failed:", err);
    return {
      status: "error",
      message:
        "We couldn't check your status right now. Please try again shortly, or contact us if it persists.",
    };
  }

  if (!member) {
    return { status: "notfound", email };
  }

  // Return only the matched member's own record (they entered their own email).
  return {
    status: "found",
    email,
    name: member.name,
    category: member.category,
    standing: member.standing,
    pmaClass: member.pmaClass,
    memberSince: member.memberSince,
  };
}

// ---------------------------------------------------------------------------
// The /membership status check — email OR name.
//
// SEPARATE FROM checkMembershipAction ON PURPOSE. That one stays email-only and
// is what /membership/id calls to decide whether to mint a card. Keeping them
// as two actions means the ID generator cannot be handed a name even by calling
// the endpoint directly — there is no name path in the function it invokes,
// rather than a flag someone could flip.
// ---------------------------------------------------------------------------

export type MembershipLookupState =
  | MembershipCheckState
  /** Two or more members share the name — we cannot safely pick one. */
  | { status: "ambiguous" };

/**
 * Best-effort caller identity for throttling.
 *
 * A name is guessable in a way an email is not, so the name path is the one
 * place on this site where someone could work through a list of plausible
 * alumni and harvest standings. Keying on the client address is what makes that
 * slow. It is not perfect — proxies share addresses and the limiter is
 * per-instance (see rate-limit.ts) — but it turns trivial enumeration into
 * something that needs real effort.
 */
async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? h.get("x-real-ip") ?? "unknown").trim();
}

export async function lookupMembershipAction(
  _prev: MembershipLookupState,
  formData: FormData
): Promise<MembershipLookupState> {
  const mode = String(formData.get("mode") ?? "email");

  if (mode !== "name") {
    // Email path — unchanged behaviour, delegated so there is one implementation.
    return checkMembershipAction({ status: "idle" }, formData);
  }

  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 3) {
    return {
      status: "error",
      message: "Please enter your full name as it appears on your membership.",
    };
  }

  const limit = rateLimit(`member-name-lookup:${await clientKey()}`, 12, 10 * 60 * 1000);
  if (!limit.ok) {
    return {
      status: "error",
      message:
        "Too many lookups from this connection. Please wait a few minutes, or check using your email address instead.",
    };
  }

  let result;
  try {
    result = await findMemberByName(name);
  } catch (err) {
    console.error("Membership name lookup failed:", err);
    return {
      status: "error",
      message:
        "We couldn't check your status right now. Please try again shortly, or contact us if it persists.",
    };
  }

  if (result.kind === "ambiguous") return { status: "ambiguous" };
  // Reuse the email path's "not found" shape; the empty email keeps the UI's
  // apply-instead prompt working without inventing an address.
  if (result.kind === "none") return { status: "notfound", email: "" };

  const m = result.member;
  return {
    status: "found",
    // NEVER the matched member's real address. Whatever this action returns is
    // serialized to the browser whether or not the UI renders it, so returning
    // m.email would turn a public name into a private address — name-to-email
    // harvesting, handed over in the network tab. The status check does not
    // display an email; only /membership/id needs one, and that path requires
    // the visitor to have typed the address in the first place.
    email: "",
    name: m.name,
    category: m.category,
    standing: m.standing,
    pmaClass: m.pmaClass,
    memberSince: m.memberSince,
  };
}
