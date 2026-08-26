"use client";

import { useActionState, useState } from "react";
import {
  lookupMembershipAction,
  type MembershipLookupState,
} from "./actions";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserPlus,
  ArrowDown,
  Users,
} from "lucide-react";

const initialState: MembershipLookupState = { status: "idle" };

type Mode = "email" | "name";

export default function MembershipCheck({
  contactEmail,
}: {
  /** From the content sheet, so a changed inbox is not stranded in this file. */
  contactEmail: string;
}) {
  const [state, action, pending] = useActionState(
    lookupMembershipAction,
    initialState
  );
  // Email leads because it is unique — a name can be shared, and the lookup has
  // to refuse rather than guess when it is. Name is offered because the most
  // common reason a real member gets "not found" is having registered under
  // their other address.
  const [mode, setMode] = useState<Mode>("email");

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Look up by"
        className="mb-3 inline-flex rounded-lg border border-slate-300 bg-white p-1"
      >
        {(["email", "name"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-[#1B2A4A] text-white"
                : "text-slate-600 hover:text-[#1B2A4A]"
            }`}
          >
            {m === "email" ? "By email" : "By name"}
          </button>
        ))}
      </div>

      <form action={action} className="flex flex-col gap-3 sm:flex-row">
        <input type="hidden" name="mode" value={mode} />
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          {mode === "email" ? (
            <input
              type="email"
              name="email"
              required
              aria-label="Your email address"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
            />
          ) : (
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              aria-label="Your full name"
              placeholder="Juan Dela Cruz"
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a1628] disabled:opacity-60"
        >
          {pending ? "Checking…" : "Check my status"}
        </button>
      </form>

      {mode === "name" && state.status === "idle" && (
        <p className="mt-2 text-xs text-slate-500">
          Enter your name as PMAFI has it on record — accents, punctuation and
          word order don&apos;t matter.
        </p>
      )}

      {/* Result */}
      {state.status === "found" && state.standing === "Active" && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-900">
              You&apos;re an active member, {state.name.split(" ")[0]}.
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Your record shows an <strong>active {state.category}</strong>{" "}
              membership. Thank you for your continued support of PMAFI.
            </p>
          </div>
        </div>
      )}

      {state.status === "found" && state.standing === "Lapsed" && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">
              Welcome back, {state.name.split(" ")[0]}.
            </p>
            <p className="mt-1 text-sm text-amber-800">
              We found your <strong>{state.category}</strong> membership, but it
              appears to have lapsed. Please get in touch so we can help you
              renew.
            </p>
          </div>
        </div>
      )}

      {state.status === "found" && state.standing === "Pending" && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-5">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
          <div>
            <p className="font-semibold text-sky-900">
              We&apos;ve received your application, {state.name.split(" ")[0]}.
            </p>
            {/* Pending now means one thing only: they have paid and we are
                checking the receipt. The invoice wording that used to live here
                belonged to the apply-first flow and would read, to someone who
                has already sent money, as their payment having gone missing.

                The second line must hold for all three receipt routes, because
                the roster records a standing, not how the applicant said they
                would send their proof. "Nothing further to send" would strand
                the two thirds who still owe us one — and they are precisely the
                people whose application is stalled. */}
            <p className="mt-1 text-sm text-sky-800">
              Your payment is <strong>being verified</strong>. Our team is
              checking your receipt and confirming your membership category —
              your membership activates as soon as that is done.
            </p>
            <p className="mt-2 text-sm text-sky-800">
              If you haven&apos;t sent your receipt yet, email it to{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium underline underline-offset-2"
              >
                {contactEmail}
              </a>{" "}
              — we can&apos;t confirm your payment without it.
            </p>
          </div>
        </div>
      )}

      {state.status === "notfound" && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
            <UserPlus className="h-5 w-5 text-[#C8A951]" />
            We couldn&apos;t find a membership under that{" "}
            {mode === "email" ? "email" : "name"}.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {mode === "email"
              ? "You may not be registered yet, or your records may use a different email — try looking yourself up by name instead."
              : "You may not be registered yet, or PMAFI may hold your name differently. Try your email address instead, or contact us if you believe this is an error."}
          </p>
          {/* To the instructions, not the form — the same reason the hero
              button goes there. Membership is pay-first, and whoever clicks
              THIS button is the most motivated applicant on the page: they have
              just been told they have no membership. Handing them the form
              straight away put the receipt upload in front of them before
              anything had mentioned a fee.

              A plain anchor, and an absolute path rather than a bare "#join":
              the path matches the page this renders on, so the browser scrolls
              within the document and the "not found" result stays on screen
              behind them. */}
          <a
            href="/membership#join"
            className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#A07830] hover:text-white"
          >
            Apply for Membership
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      )}

      {state.status === "ambiguous" && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
            <Users className="h-5 w-5 text-[#C8A951]" />
            More than one member shares that name.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            We can&apos;t tell which record is yours, and we won&apos;t guess.
            Please check using the email address on your membership instead —
            switch to <strong>By email</strong> above.
          </p>
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-sm font-medium text-red-600">{state.message}</p>
      )}

      <p className="mt-4 text-xs text-slate-500">
        We check your email privately against our member records and only show
        your own status — your information is never shared.
      </p>
    </div>
  );
}
