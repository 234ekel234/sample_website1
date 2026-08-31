"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  checkMembershipForIdAction,
  type MembershipIdState,
} from "@/app/membership/actions";
import DigitalIdGenerator from "./DigitalIdGenerator";
import { Search, UserPlus, ArrowRight, ShieldCheck, Mail } from "lucide-react";

const initialState: MembershipIdState = { status: "idle" };

/**
 * Gate in front of the ID generator.
 *
 * The card used to be built from whatever a visitor typed: any name, any
 * category, and a hardcoded "ACTIVE" pill. That made it a forgeable credential
 * — a downloadable PNG bearing the Foundation's seal asserting membership the
 * roster had never granted.
 *
 * Now the name, category and standing all come from the roster, so the card can
 * only ever state what PMAFI's own records say. A lapsed member still gets a
 * card; it says LAPSED, which is the honest outcome and more useful than a
 * refusal.
 *
 * This inherits the membership check's known limitation — it confirms an email
 * exists in the roster, not that the visitor owns it. Closing that needs real
 * sign-in, which is Phase 3, Module A.
 *
 * MEMBERS ADDED BY STAFF CANNOT MINT A CARD. The action this calls is not the
 * one /membership uses: it refuses records from the `Manual Members` tab, where
 * both the name and the address were typed by somebody other than the member.
 * They can still check their standing on /membership, which tells them only
 * what PMAFI already told them.
 */
export default function IdGate() {
  const [state, action, pending] = useActionState(
    checkMembershipForIdAction,
    initialState
  );

  if (state.status === "found") {
    return (
      <DigitalIdGenerator
        member={{
          email: state.email,
          name: state.name,
          category: state.category,
          standing: state.standing,
          pmaClass: state.pmaClass,
          memberSince: state.memberSince,
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="flex items-center gap-2 font-bold text-[#1B2A4A]">
          <ShieldCheck className="h-5 w-5 text-[#C8A951]" />
          Confirm your membership first
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Your card is built from the Foundation&apos;s own records, so we need
          to find you in them first. Enter the email address associated with
          your membership.
        </p>

        <form action={action} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a1628] disabled:opacity-60"
          >
            {pending ? "Checking…" : "Continue"}
          </button>
        </form>

        {state.status === "notfound" && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
              <UserPlus className="h-5 w-5 text-[#C8A951]" />
              We couldn&apos;t find a membership under that email.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Your records may use a different address, or you may not be
              registered yet. Member IDs are issued only to members on the
              Foundation&apos;s roster.
            </p>
            <Link
              href="/membership"
              className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#8A6A22] hover:text-white"
            >
              Apply for membership
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* On the roster, but their row was created by staff rather than by
            them. Say what to do next and never why in detail — "your record was
            typed by somebody else" is both confusing and faintly insulting, and
            spelling out which addresses cannot mint a card is a map for anyone
            who wanted to try. */}
        {state.status === "manual" && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
              <Mail className="h-5 w-5 text-[#C8A951]" />
              Your membership needs to be confirmed by the Foundation first.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              You are on the roster, so your standing is available on the
              membership page. A digital ID card, though, can only be issued
              once your own application is on file. Please get in touch and the
              Foundation will sort it out with you.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#8A6A22] hover:text-white"
              >
                Contact the Foundation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/membership#check"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#1B2A4A] transition-colors hover:border-[#C8A951]"
              >
                Check membership status
              </Link>
            </div>
          </div>
        )}

        {state.status === "error" && (
          <p className="mt-3 text-sm font-medium text-red-600">
            {state.message}
          </p>
        )}

        <p className="mt-4 text-xs text-slate-500">
          We check your email privately against the member roster. Nothing about
          other members is ever shown, and your photo is never uploaded.
        </p>
      </div>
    </div>
  );
}
