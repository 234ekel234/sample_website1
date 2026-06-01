"use server";

import { checkMembership } from "@/lib/members";

export type MembershipCheckState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "notfound"; email: string }
  | {
      status: "found";
      email: string;
      name: string;
      category: string;
      standing: "Active" | "Lapsed";
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

  const member = await checkMembership(email);
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
  };
}
