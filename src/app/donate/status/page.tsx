import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Clock } from "lucide-react";
import DonationCheck from "./DonationCheck";

export const metadata: Metadata = {
  title: "My Giving | PMAFI",
  description:
    "Look up a donation to the Philippine Military Academy Foundation using your email address and the reference from your acknowledgment.",
};

const notes = [
  {
    icon: Mail,
    title: "Where to find your reference",
    description:
      "It appears on the acknowledgment we send after a gift is verified — a short code such as PMAFI-2026-K7QX3M.",
  },
  {
    icon: Clock,
    title: "Recently given?",
    description:
      "Gifts are listed once our team has verified the transfer and recorded it, so a very recent donation may not appear yet.",
  },
  {
    icon: ShieldCheck,
    title: "Why we ask for both",
    description:
      "An email alone would let anyone look up someone else's giving. The reference keeps your record yours.",
  },
];

export default function GivingStatusPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1628] py-32 pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_-10%,#16294d_0%,#0a1628_45%,#070f1d_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #C8A951 0px, #C8A951 1px, transparent 1px, transparent 72px)",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)",
          }}
        />
        <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070f1d] to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/30 bg-[#C8A951]/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8A951] shadow-[0_0_30px_-8px_rgba(200,169,81,0.5)] backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A951] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8A951]" />
            </span>
            My Giving
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            Track Your <span className="text-gold-shimmer">Support</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Look up a gift you&apos;ve made to the Foundation — what it was
            designated for, and where it stands in our process.
          </p>
        </div>
      </section>

      {/* Lookup */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Look Up a Donation
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1B2A4A]">
              Find Your Giving Record
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Enter the email address you gave under, along with the reference
              from your acknowledgment.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <DonationCheck />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {notes.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A]">
                  <Icon size={20} />
                </div>
                <p className="font-bold text-[#1B2A4A]">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/donate"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#1B2A4A] transition-colors hover:text-[#C8A951]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to ways to give
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
