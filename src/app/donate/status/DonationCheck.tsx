"use client";

import { useActionState } from "react";
import Link from "next/link";
import { checkGivingAction, type GivingCheckState } from "./actions";
import type { DonationStatus } from "@/lib/donations";
import {
  Search,
  Hash,
  HeartHandshake,
  SearchX,
  CheckCircle2,
  Receipt,
  Sparkles,
  Landmark,
} from "lucide-react";

const initialState: GivingCheckState = { status: "idle" };

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

/** ISO dates render long-form; anything unparseable shows as staff typed it. */
function formatDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value || "—";
  const d = new Date(`${value}T00:00:00`);
  return d.toLocaleDateString("en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// What each stage means in PMAFI's own process, so a donor never has to guess
// whether "Received" is good news.
const STATUS_META: Record<
  DonationStatus,
  { icon: typeof CheckCircle2; className: string; meaning: string }
> = {
  Received: {
    icon: CheckCircle2,
    className: "border-sky-200 bg-sky-50 text-sky-800",
    meaning: "Your donation has been received and recorded.",
  },
  Acknowledged: {
    icon: HeartHandshake,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    meaning: "We've sent your acknowledgment.",
  },
  "Receipt issued": {
    icon: Receipt,
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
    meaning: "An official receipt has been issued.",
  },
  Allocated: {
    icon: Sparkles,
    className: "border-[#C8A951]/40 bg-[#C8A951]/10 text-[#8A6A22]",
    meaning: "Your donation has been put to work in the fund you chose.",
  },
};

export default function DonationCheck() {
  const [state, action, pending] = useActionState(
    checkGivingAction,
    initialState
  );

  return (
    <div>
      <form action={action} className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
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
          <div className="relative flex-1">
            <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="reference"
              required
              autoCapitalize="characters"
              spellCheck={false}
              aria-label="Reference number from your acknowledgment"
              placeholder="PMAFI-2026-K7QX3M"
              className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm uppercase text-slate-900 outline-none transition-colors placeholder:normal-case placeholder:text-slate-500 focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/30"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a1628] disabled:opacity-60"
        >
          {pending ? "Looking up…" : "View my donations"}
        </button>
      </form>

      {/* Result */}
      {state.status === "found" && (
        <div className="mt-6">
          <div className="flex flex-col gap-4 rounded-xl border border-[#C8A951]/30 bg-[#0a1628] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-white">
                Thank you
                {state.donorName ? `, ${state.donorName.split(" ")[0]}` : ""}.
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {state.donations.length === 1
                  ? "We have 1 donation recorded under your email."
                  : `We have ${state.donations.length} donations recorded under your email.`}
              </p>
            </div>
            <div className="shrink-0 sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C8A951]">
                Total donated
              </p>
              <p className="text-2xl font-bold text-white">
                {peso.format(state.total)}
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-3">
            {state.donations.map((d) => {
              const meta = STATUS_META[d.status];
              const StatusIcon = meta.icon;
              return (
                <li
                  key={d.reference}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#1B2A4A]">
                        {peso.format(d.amount)}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {formatDate(d.date)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {d.status}
                    </span>
                  </div>

                  {d.fund && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <Landmark className="h-4 w-4 shrink-0 text-[#C8A951]" />
                      <span>
                        Designated for <strong>{d.fund}</strong>
                      </span>
                    </p>
                  )}

                  <p className="mt-2 text-sm text-slate-500">{meta.meaning}</p>

                  <p className="mt-3 font-mono text-xs uppercase tracking-wider text-slate-500">
                    {d.reference}
                  </p>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-xs text-slate-500">
            Recorded donations only. If you gave very recently it may not appear
            here yet — a donation is listed once our team has verified and logged
            it.{" "}
            <Link
              href="/contact"
              className="font-medium text-[#1B2A4A] underline decoration-[#C8A951]/50 underline-offset-2 transition-colors hover:text-[#C8A951]"
            >
              Contact us
            </Link>{" "}
            if something looks wrong.
          </p>
        </div>
      )}

      {state.status === "nomatch" && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="flex items-center gap-2 font-semibold text-[#1B2A4A]">
            <SearchX className="h-5 w-5 text-[#C8A951]" />
            We couldn&apos;t find a matching donation.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Please check that both the email address and the reference match
            your acknowledgment exactly. If you gave recently, your donation may not
            be logged yet.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-block text-sm font-medium text-[#1B2A4A] underline decoration-[#C8A951]/50 underline-offset-2 transition-colors hover:text-[#C8A951]"
          >
            Get in touch and we&apos;ll look it up for you
          </Link>
        </div>
      )}

      {state.status === "error" && (
        <p className="mt-3 text-sm font-medium text-red-600">{state.message}</p>
      )}

      <p className="mt-4 text-xs text-slate-500">
        We ask for a reference as well as your email so that no one else can
        look up your donations. Your records are checked privately and only
        your own donations are shown.
      </p>
    </div>
  );
}
