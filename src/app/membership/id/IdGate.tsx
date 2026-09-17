"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  checkMembershipAction,
  demoIdByNameAction,
  type MembershipCheckState,
  type IdCardState,
} from "@/app/membership/actions";
import DigitalIdGenerator, { type VerifiedMember } from "./DigitalIdGenerator";
import { idFromEmail } from "@/lib/member-id";
import { Search, UserPlus, ArrowRight, ShieldCheck, User, PencilLine } from "lucide-react";

const initialState: MembershipCheckState = { status: "idle" };
const initialIdState: IdCardState = { status: "idle" };

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
 * MEMBERS ADDED BY HAND ARE TREATED THE SAME as those who applied through the
 * form. PMAFI records the member's own address when it adds them, so the row
 * carries an address the member gave rather than one invented for them — see
 * the note above checkMembershipAction in actions.ts.
 *
 * `byName` IS A DEMO RELAXATION AND DEFAULTS OFF. When true the visitor may
 * find themselves by name instead of email, which makes the card mintable by
 * anyone who knows a member's name — see lib/demo-flags.ts. The prop only
 * decides what is RENDERED; the action refuses regardless unless the server
 * flag is set, so a visitor who forces this true in devtools gets a form that
 * returns an error.
 */
export default function IdGate({
  byName = false,
  correctionFormUrl = "",
}: {
  byName?: boolean;
  correctionFormUrl?: string;
}) {
  const [state, action, pending] = useActionState(
    checkMembershipAction,
    initialState
  );
  const [nameState, nameAction, namePending] = useActionState(
    demoIdByNameAction,
    initialIdState
  );
  const [mode, setMode] = useState<"email" | "name">("email");

  // Both routes end at the same card. The email path hashes the address the
  // visitor typed; the name path was handed a number the server already
  // derived from the roster's copy of it. Same member, same number, either way.
  let verified: VerifiedMember | null = null;
  if (state.status === "found") {
    verified = {
      memberId: idFromEmail(state.email),
      name: state.name,
      category: state.category,
      standing: state.standing,
      pmaClass: state.pmaClass,
      memberSince: state.memberSince,
    };
  } else if (nameState.status === "found") {
    verified = {
      memberId: nameState.memberId,
      name: nameState.name,
      category: nameState.category,
      standing: nameState.standing,
      pmaClass: nameState.pmaClass,
      memberSince: nameState.memberSince,
    };
  }

  if (verified) {
    return (
      <div className="space-y-6">
        <DigitalIdGenerator member={verified} />
        {correctionFormUrl && (
          <CorrectionPrompt url={correctionFormUrl} name={verified.name} />
        )}
      </div>
    );
  }

  const notFound =
    state.status === "notfound" || nameState.status === "notfound";
  const errorMessage =
    state.status === "error"
      ? state.message
      : nameState.status === "error"
        ? nameState.message
        : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <p className="flex items-center gap-2 font-bold text-[#1B2A4A]">
          <ShieldCheck className="h-5 w-5 text-[#C8A951]" />
          Confirm your membership first
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Your card is built from the Foundation&apos;s own records, so we need
          to find you in them first.
          {byName
            ? " Use the email address associated with your membership, or your full name."
            : " Enter the email address associated with your membership."}
        </p>

        {byName && (
          <div
            role="tablist"
            aria-label="How to find your membership"
            className="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1"
          >
            {(["email", "name"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                type="button"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  mode === m
                    ? "bg-white text-[#1B2A4A] shadow-sm"
                    : "text-slate-500 hover:text-[#1B2A4A]"
                }`}
              >
                {m === "email" ? "By email" : "By name"}
              </button>
            ))}
          </div>
        )}

        {(!byName || mode === "email") && (
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
        )}

        {byName && mode === "name" && (
          <form action={nameAction} className="mt-5 flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  minLength={3}
                  aria-label="Your full name"
                  defaultValue={
                    nameState.status === "ambiguous" ? nameState.name : ""
                  }
                  placeholder="Juan Dela Cruz"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
                />
              </div>
              <button
                type="submit"
                disabled={namePending}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a1628] disabled:opacity-60"
              >
                {namePending ? "Checking…" : "Continue"}
              </button>
            </div>

            {/*
              THE AMBIGUOUS FOLLOW-UP ASKS; IT NEVER LISTS. Same rule as the
              status check: showing the near matches to pick from would answer
              a guessed name with real members' names. The visitor supplies the
              year and we never show one.
            */}
            {nameState.status === "ambiguous" && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label
                  htmlFor="classYear"
                  className="text-sm font-semibold text-[#1B2A4A]"
                >
                  More than one member goes by that name
                </label>
                <p className="mt-1 text-sm text-slate-600">
                  Add your PMA class year and we&apos;ll find the right record.
                </p>
                <input
                  id="classYear"
                  type="text"
                  name="classYear"
                  inputMode="numeric"
                  placeholder="e.g. 1988"
                  className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30 sm:max-w-[200px]"
                />
              </div>
            )}
          </form>
        )}

        {notFound && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
              <UserPlus className="h-5 w-5 text-[#C8A951]" />
              We couldn&apos;t find a membership under that{" "}
              {mode === "name" && byName ? "name" : "email"}.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Your records may use a different{" "}
              {mode === "name" && byName ? "spelling" : "address"}, or you may
              not be registered yet. Member IDs are issued only to members on
              the Foundation&apos;s roster.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/membership"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition-all hover:bg-[#8A6A22] hover:text-white"
              >
                Apply for membership
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              {correctionFormUrl && (
                <a
                  href={correctionFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gold-ink underline-offset-4 hover:underline"
                >
                  <PencilLine className="h-4 w-4" />
                  My name is recorded incorrectly
                </a>
              )}
            </div>
          </div>
        )}

        {errorMessage && (
          <p className="mt-3 text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        <p className="mt-4 text-xs text-slate-500">
          We check your details privately against the member roster. Nothing
          about other members is ever shown, and your photo is never uploaded.
        </p>
      </div>
    </div>
  );
}

/**
 * Offered once a card exists, because that is when a member SEES the spelling
 * the roster holds. The name on the card is not editable — it is the roster's,
 * and a card that says whatever the holder typed is the forgeable credential
 * this gate was built to stop — so the way to change it is to ask staff to fix
 * the record, and regenerate afterwards.
 *
 * Renders nothing when no form URL is configured, exactly as /donate does with
 * `form.donation`: an unset key leaves the page as it was rather than showing a
 * dead control.
 */
function CorrectionPrompt({ url, name }: { url: string; name: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-[#1B2A4A]">
        <PencilLine className="h-4 w-4 text-[#C8A951]" />
        Is <span className="font-bold">{name}</span> how your name should
        appear?
      </p>
      <p className="mt-1 text-sm text-slate-600">
        The card prints the spelling on the Foundation&apos;s roster, so it
        can&apos;t be edited here. If it&apos;s wrong, ask us to correct the
        record — then download your card again.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#1B2A4A] transition-all hover:border-[#C8A951] hover:bg-slate-50"
      >
        Request a correction
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}
