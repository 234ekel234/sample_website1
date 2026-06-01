"use client";

import { useActionState } from "react";
import {
  checkMembershipAction,
  type MembershipCheckState,
} from "./actions";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserPlus,
  ArrowRight,
} from "lucide-react";

const initialState: MembershipCheckState = { status: "idle" };

export default function MembershipCheck({ applyHref }: { applyHref: string }) {
  const [state, action, pending] = useActionState(
    checkMembershipAction,
    initialState
  );

  return (
    <div>
      <form action={action} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            name="email"
            required
            aria-label="Your email address"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a1628] disabled:opacity-60"
        >
          {pending ? "Checking…" : "Check my status"}
        </button>
      </form>

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
            <p className="mt-1 text-sm text-sky-800">
              Your membership is <strong>pending payment</strong>. Our team will
              confirm your category and email you an invoice with payment
              instructions. Your membership activates once your payment is
              received.
            </p>
          </div>
        </div>
      )}

      {state.status === "notfound" && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
            <UserPlus className="h-5 w-5 text-[#C8A951]" />
            We couldn&apos;t find a membership under that email.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            You may not be registered yet, or your records may use a different
            email. You can apply for membership below — or contact us if you
            believe this is an error.
          </p>
          <a
            href={applyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#A07830] hover:text-white"
          >
            Apply for Membership
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-sm font-medium text-red-600">{state.message}</p>
      )}

      <p className="mt-4 text-xs text-slate-400">
        We check your email privately against our member records and only show
        your own status — your information is never shared.
      </p>
    </div>
  );
}
