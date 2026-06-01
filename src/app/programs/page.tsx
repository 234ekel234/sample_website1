import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Building2,
  GraduationCap,
  Star,
  Handshake,
  Users,
  DollarSign,
  BookOpen,
  Heart,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Programs | PMAFI",
  description:
    "Explore PMAFI's key programs — from facilities modernization and academic excellence to leadership formation and alumni engagement.",
};

const programs = [
  {
    icon: Building2,
    title: "Facilities & Modernization",
    tagline: "Upgrading PMA's Physical Infrastructure",
    description:
      "A world-class military academy requires world-class facilities. PMAFI funds the construction, renovation, and equipping of PMA's classrooms, barracks, training centers, and laboratories — ensuring cadets train in an environment that meets the demands of modern military service.",
    initiatives: [
      "Classroom and lecture hall upgrades",
      "Training and simulation facility development",
      "Sports and physical fitness infrastructure",
      "Technology and equipment procurement",
    ],
  },
  {
    icon: GraduationCap,
    title: "Academic Excellence & Endowment",
    tagline: "Investing in Education and Scholarship",
    description:
      "PMAFI strengthens PMA's academic programs through scholarships, faculty development, and curriculum support. We believe that officers of the Republic must be as sharp in the classroom as they are in the field — intellectually prepared for the complex challenges of national defense and leadership.",
    initiatives: [
      "Cadet scholarships and academic grants",
      "Faculty and professorial development",
      "Library and research resource funding",
      "Curriculum enrichment and accreditation support",
    ],
  },
  {
    icon: Star,
    title: "Leadership Formation",
    tagline: "Building Character and Integrity",
    description:
      "Technical skill alone does not make a great officer. PMAFI supports programs focused on values formation, ethics, discipline, and character development — nurturing the qualities that define officers who lead with integrity and serve with selfless dedication to God, country, and people.",
    initiatives: [
      "Values and ethics formation programs",
      "Leadership seminars and character development retreats",
      "Mentorship programs with senior alumni",
      "Religious and spiritual formation activities",
    ],
  },
  {
    icon: Handshake,
    title: "Partnerships & Alumni Engagement",
    tagline: "A Nationwide Network of Support",
    description:
      "PMAFI builds and sustains the bridge between PMA and the broader community of alumni, civic organizations, and private sector partners. Through this network, we amplify support for the Academy, connect cadets with mentors and opportunities, and ensure PMAFI's mission reaches across every corner of the Philippines.",
    initiatives: [
      "Alumni chapter coordination and engagement",
      "Corporate and civic partnership development",
      "Cadet mentorship and internship programs",
      "Fundraising drives and community campaigns",
    ],
  },
];

const howToHelp = [
  {
    icon: Users,
    title: "Become a Member",
    description:
      "Join PMAFI as a member and become part of a community dedicated to strengthening the Philippine Military Academy. Membership connects you with fellow advocates and gives you a direct stake in the Foundation's mission.",
  },
  {
    icon: DollarSign,
    title: "Contribute Through Donations",
    description:
      "Financial contributions — whether one-time or recurring — go directly toward PMAFI's programs. Every peso supports facilities, scholarships, and the development of future Philippine military officers.",
  },
  {
    icon: BookOpen,
    title: "Support Academy Programs",
    description:
      "Sponsor a specific program area that aligns with your advocacy — from scholarship endowments to facility upgrades. Targeted support lets you see the direct impact of your contribution.",
  },
  {
    icon: Heart,
    title: "Participate in Fundraising",
    description:
      "Join PMAFI's fundraising events, drives, and campaigns. Whether as an organizer, sponsor, or participant, your involvement amplifies our capacity to serve PMA and its cadets.",
  },
];

export default function ProgramsPage() {
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
            What We Do
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Our Programs
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            PMAFI channels support into four strategic areas that strengthen the
            Philippine Military Academy and the officers it produces — today
            and for generations to come.
          </p>
        </div>
      </section>

      {/* Program Details */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-20">
            {programs.map(({ icon: Icon, title, tagline, description, initiatives }, i) => (
              <div
                key={title}
                className={`grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Text side */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B2A4A] text-[#C8A951]">
                    <Icon size={28} />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
                    {tagline}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-[#1B2A4A]">
                    {title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">
                    {description}
                  </p>
                </div>

                {/* Initiatives side */}
                <div className={`rounded-2xl bg-slate-50 p-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Key Initiatives
                  </p>
                  <ul className="space-y-4">
                    {initiatives.map((init) => (
                      <li key={init} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#C8A951]" />
                        <span className="text-slate-700">{init}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How You Can Help */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Get Involved
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              How You Can Help
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Supporting PMAFI means investing in the officers who will defend
              and lead our nation. Here are the ways you can contribute.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howToHelp.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]"
              >
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-[#1B2A4A]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0a1628] py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#16294d_0%,#0a1628_55%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #C8A951 0px, #C8A951 1px, transparent 1px, transparent 72px)",
            maskImage:
              "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 75%)",
          }}
        />
        <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.08] blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Ready to Make a Difference?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
            Reach out to learn how you can support PMAFI&apos;s programs and
            help shape the next generation of Philippine military leaders.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-[#C8A951] px-8 font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white hover:shadow-[0_12px_40px_-8px_rgba(200,169,81,0.5)]"
              )}
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/board"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/15 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 hover:text-white"
              )}
            >
              Meet the Board
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
