import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DigitalIdGenerator from "./DigitalIdGenerator";

export const metadata: Metadata = {
  title: "Digital Member ID | PMAFI",
  description:
    "Create your personalized Philippine Military Academy Foundation, Inc. digital member ID — add your details and photo, then download it as an image.",
};

export default function DigitalIdPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1628] py-28 pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_-10%,#16294d_0%,#0a1628_45%,#070f1d_100%)]" />
        <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070f1d] to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/30 bg-[#C8A951]/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8A951] shadow-[0_0_30px_-8px_rgba(200,169,81,0.5)] backdrop-blur-sm">
            Digital Member ID
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
            Create Your <span className="text-gold-shimmer">Member ID</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Add your details and a photo to generate a personalized PMAFI digital
            member ID, then download it to keep on your phone.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <DigitalIdGenerator />

          <div className="mt-10 text-center">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#1B2A4A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Membership
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
