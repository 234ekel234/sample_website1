"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  emailGivingSummaryAction,
  type GivingEmailState,
} from "./actions";
import { Mail, Send, CheckCircle2 } from "lucide-react";

const initialState: GivingEmailState = { status: "idle" };

/**
 * The no-reference path: a donor enters only their address and the summary is
 * sent there.
 *
 * The success copy is deliberately conditional — "if we have any gifts
 * recorded" — because the action cannot tell the visitor whether the address
 * has gifts without recreating the very oracle this route exists to avoid.
 * Anyone can type someone else's address here; only the inbox owner learns
 * anything from it.
 */
export default function EmailSummary() {
  const [state, action, pending] = useActionState(
    emailGivingSummaryAction,
    initialState
  );

  if (state.status === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-semibold text-emerald-900">Check your inbox.</p>
          <p className="mt-1 text-sm text-emerald-800">
            If we have any donations recorded against that address, a summary is on
            its way to it. We send it to the address rather than showing it here
            so that only you can see your figures.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form action={action} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            name="email"
            required
            aria-label="Your email address"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1B2A4A] px-6 py-3 text-sm font-semibold text-[#1B2A4A] transition-all hover:bg-[#1B2A4A] hover:text-white disabled:opacity-60"
        >
          {pending ? "Sending…" : "Email me my summary"}
          {!pending && <Send className="h-4 w-4" />}
        </button>
      </form>

      {state.status === "error" && (
        <p className="mt-3 text-sm font-medium text-red-600">{state.message}</p>
      )}

      <p className="mt-4 text-xs text-slate-500">
        No reference code needed. Your summary is sent to the address you enter,
        never displayed here — so nobody can look up someone else&apos;s donations.{" "}
        <Link
          href="/contact"
          className="font-medium text-[#1B2A4A] underline decoration-[#C8A951]/50 underline-offset-2 transition-colors hover:text-[#C8A951]"
        >
          Contact us
        </Link>{" "}
        if it doesn&apos;t arrive.
      </p>
    </div>
  );
}
