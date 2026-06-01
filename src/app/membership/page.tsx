import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Users,
  UserCheck,
  Handshake,
  ArrowRight,
  Heart,
  Flag,
  BookOpen,
  Award,
} from "lucide-react";
import MembershipCheck from "./MembershipCheck";

export const metadata: Metadata = {
  title: "Membership | PMAFI",
  description:
    "Join the Philippine Military Academy Foundation, Inc. Check your membership status or apply to become a regular, associate, or affiliate member.",
};

// TODO: confirm with PMAFI that this Google Form (from the brochure) is current.
const APPLICATION_FORM_URL = "https://forms.gle/1znWk8ZTbXhW2Skv6";

const categories = [
  {
    icon: UserCheck,
    title: "Regular Member",
    description:
      "Open to alumni, faculty, and staff of the Philippine Military Academy who wish to take an active role in the Foundation's mission.",
  },
  {
    icon: Users,
    title: "Associate Member",
    description:
      "Also drawn from PMA alumni, faculty, and staff, supporting the Foundation's programs and objectives alongside its regular members.",
  },
  {
    icon: Handshake,
    title: "Affiliate Member",
    description:
      "Open to selected individuals and organizations who share PMAFI's values and support its vision, mission, and objectives.",
  },
];

// NOTE: draft benefits — confirm the actual member perks with PMAFI.
const benefits = [
  {
    icon: Heart,
    title: "Advance the Mission",
    description:
      "Directly support PMA's pursuit of academic excellence and the formation of officers of character.",
  },
  {
    icon: Users,
    title: "Belong to a Community",
    description:
      "Join a nationwide network of alumni, faculty, partners, and friends of the Academy.",
  },
  {
    icon: Flag,
    title: "A Voice in the Foundation",
    description:
      "Regular members take part in electing the Board of Trustees that governs PMAFI.",
  },
  {
    icon: BookOpen,
    title: "Stay Informed",
    description:
      "Receive updates on programs, projects, and the real impact your support makes at PMA.",
  },
  {
    icon: Handshake,
    title: "Events & Gatherings",
    description:
      "Invitations to PMAFI events, reunions, and fundraising activities throughout the year.",
  },
  {
    icon: Award,
    title: "Recognition & Legacy",
    description:
      "Opportunities to leave a lasting mark through named professorial chairs and endowment funds.",
  },
];

const steps = [
  {
    title: "Submit the application form",
    description:
      "Complete the online membership application with your details and preferred membership category.",
  },
  {
    title: "We review your application",
    description:
      "Our team verifies your eligibility and confirms the appropriate membership category for you.",
  },
  {
    title: "Receive your invoice",
    description:
      "We send you the membership dues and payment instructions for your confirmed category.",
  },
  {
    title: "Pay & send proof",
    description:
      "Settle the dues through the provided channel and send back your proof of payment.",
  },
  {
    title: "Welcome to PMAFI",
    description:
      "Once your payment is confirmed, we formally welcome you as a member of the Foundation.",
  },
];

export default function MembershipPage() {
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
            Membership
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            Become Part of the{" "}
            <span className="text-gold-shimmer">Mission</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Join a community of alumni, friends, and partners committed to
            strengthening the Philippine Military Academy and the officers it
            produces.
          </p>
        </div>
      </section>

      {/* Status check */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Already a Member?
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1B2A4A]">
              Check Your Membership Status
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Enter the email address associated with your membership to confirm
              whether you&apos;re currently registered.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <MembershipCheck applyHref={APPLICATION_FORM_URL} />
          </div>
        </div>
      </section>

      {/* Member benefits */}
      <section className="relative overflow-hidden bg-[#0a1628] py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#16294d_0%,#0a1628_55%)]" />
        <div className="animate-drift pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[#C8A951]/[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Member Benefits
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
              Why Become a Member
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300/90">
              Membership is first and foremost an act of service — but it also
              connects you to the Academy and the community that sustains it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A951]/40 hover:bg-white/[0.05]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C8A951]/10 text-[#C8A951] transition-transform duration-300 group-hover:scale-110">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300/80">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Membership Categories
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Ways to Belong
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              PMAFI welcomes members across three categories. The right fit
              depends on your relationship with the Academy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#1B2A4A]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              How to Join
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Applying Is Simple
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Apply online and we&apos;ll guide you through confirmation and
              payment — no need to pay before we&apos;ve confirmed your details.
            </p>
          </div>

          <ol className="space-y-6">
            {steps.map(({ title, description }, i) => (
              <li key={title} className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-sm font-bold text-[#C8A951]">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <p className="font-bold text-[#1B2A4A]">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <a
              href={APPLICATION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-[#C8A951] px-8 font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white hover:shadow-[0_12px_40px_-8px_rgba(200,169,81,0.5)]"
              )}
            >
              Apply for Membership
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-4 text-sm text-slate-400">
              Have questions first?{" "}
              <Link
                href="/contact"
                className="font-medium text-[#1B2A4A] underline decoration-[#C8A951]/50 underline-offset-2 transition-colors hover:text-[#C8A951]"
              >
                Get in touch
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
