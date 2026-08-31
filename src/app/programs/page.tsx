import type { Metadata } from "next";
import Image from "next/image";
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
import PageHero from "@/components/ui/PageHero";
import ChairsRoll from "@/components/sections/programs/ChairsRoll";

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

// Commitments PMAFI set out in its 2025 Annual Report, worded for the web
// rather than lifted from it. Each is something the Foundation has said it will
// do; none carries a date or a figure, so the site is not left answerable for a
// forecast PMAFI never made.
const plans = [
  "A doctorate for every member of the faculty, not only a master's. The Academy and the Foundation have drawn up a joint plan to get there, and PMAFI has undertaken to see it through.",
  "More help for scholars reading for master's degrees in the subjects the Academy most needs — including those studying in Metro Manila, or otherwise far from Baguio.",
  "More research into how the Academy teaches, and into how its cadets actually perform.",
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
      <PageHero
        eyebrow="What We Do"
        title="Our Programs"
        lede="PMAFI channels support into four strategic areas that strengthen the Philippine Military Academy and the officers it produces — today and for generations to come."
      />

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
                  <p className="text-sm font-semibold uppercase tracking-widest text-gold-ink">
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
                  <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-500">
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

      {/* The people the four programme areas exist for, between what the
          Foundation does and what it has committed to do next. One band rather
          than a photograph per programme: we have four programme areas and one
          suitable photograph, and three placeholders would look worse than
          none. */}
      <section className="bg-white pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <figure className="overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/8] w-full bg-slate-100">
              <Image
                src="/faculty.jpg"
                alt="Faculty, staff and personnel of the Philippine Military Academy gathered with officers of the Foundation."
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <figcaption className="mt-3 text-sm text-slate-500">
              The faculty and staff of the Academy, with officers of the
              Foundation. Every programme here exists to support the people in
              this room and the cadets they teach.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* What the Foundation has committed to next. Drawn from PMAFI's 2025
          Annual Report — no forecast, no figure and no promise of ours. It sits
          before "Get Involved" on purpose: a visitor deciding whether to give
          should see what the money is already committed to before being asked.

          The list is reworded for the web; the blockquote is NOT, and must not
          be. It is presented as a quotation and attributed, which is the one
          place on this page where the report's exact words belong — paraphrase
          it and the attribution beneath becomes a lie. */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Looking Ahead
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              What the Foundation Is Working Toward
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              The commitments PMAFI has set out for the period ahead.
            </p>
          </div>

          <ul className="space-y-6">
            {plans.map((plan) => (
              <li key={plan} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8A951]"
                />
                <p className="text-lg leading-relaxed text-slate-600">{plan}</p>
              </li>
            ))}
          </ul>

          <figure className="mt-12 border-l-2 border-[#C8A951] pl-6">
            <blockquote className="text-lg italic leading-relaxed text-[#1B2A4A]">
              &ldquo;We will also continue to work closely with PMA authorities
              on how we can better assist the Academy in the character building
              of the cadets, so that they shall possess the character essential
              to the pursuit of a progressive military career.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm text-slate-500">
              PMAFI Annual Report, 2025
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The proof, immediately before the ask. Everything above this describes
          what the Foundation intends to do; this is the list of what it has
          already done, one name at a time. */}
      <ChairsRoll />

      {/* How You Can Help */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
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
              href="/about#board"
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
