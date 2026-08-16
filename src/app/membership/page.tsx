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
  IdCard,
} from "lucide-react";
import MembershipCheck from "./MembershipCheck";
import DuesPayment from "./DuesPayment";
import PageHero from "@/components/ui/PageHero";
import { getContent, hasPaymentDetails } from "@/lib/content";

export const metadata: Metadata = {
  title: "Membership | PMAFI",
  description:
    "Join the Philippine Military Academy Foundation, Inc. Check your membership status or apply to become a regular, associate, or affiliate member.",
};

const APPLICATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScCtlvJRRyJoIFpyBfn8co6qVLDd1GnfV4x6m4dJeYvtE8GBQ/viewform";

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

const benefits = [
  {
    icon: Heart,
    title: "Invest in PMA Directly",
    description:
      "Your dues fund the scholarships, facilities, and programs that shape every cadet who walks through Fort del Pilar — a tangible investment in the next generation of officers.",
  },
  {
    icon: Users,
    title: "Join a Nationwide Brotherhood",
    description:
      "Become part of a community of PMA alumni, faculty, and supporters united by a shared commitment to the Academy and to the nation it serves.",
  },
  {
    icon: Flag,
    title: "Shape the Foundation's Direction",
    description:
      "Regular members vote in the election of the Board of Trustees — a direct say in how PMAFI is governed and where its resources go.",
  },
  {
    icon: BookOpen,
    title: "See the Impact You Make",
    description:
      "Members receive regular updates on programs, projects, and milestones — so you always know exactly how your support is being put to work at the Academy.",
  },
  {
    icon: Handshake,
    title: "Invitations to PMAFI Events",
    description:
      "From the Annual General Membership Meeting to alumni reunions and awarding ceremonies — membership keeps you connected to the Foundation's community all year.",
  },
  {
    icon: Award,
    title: "Build a Lasting Legacy",
    description:
      "Establish a professorial chair or endowment fund in your name or your class's honor — a permanent contribution whose earnings support PMA in perpetuity.",
  },
];

/**
 * The join flow, in the order the applicant actually experiences it.
 *
 * PAY-FIRST IS NOW THE ONLY FLOW. The ordering is PMAFI's decision, not
 * something the site derives from whether a figure happens to be filled in, and
 * the application form already tells applicants to pay before they apply. A
 * page that disagreed with the form it links to would be worse than one missing
 * a number — an applicant reading "no need to pay yet" here and "settle your
 * dues first" there does not know which to believe.
 *
 * What still varies is whether we can PRINT the figures. When the content sheet
 * has none, step one sends the applicant to ask rather than inventing an amount
 * or an account number. Same flow, less information, still honest.
 */
const joinSteps = (contactEmail: string, detailsPublished: boolean) => [
  {
    title: "Pay your membership dues",
    description: detailsPublished
      ? "Settle the dues for your category using the bank or GCash details above, and keep the receipt."
      : `Email us at ${contactEmail} for the dues for your category and where to send them. Settle the amount, and keep the receipt.`,
  },
  {
    // The sign-in requirement is stated here, before the visitor clicks away to
    // a form they may not be able to open. Google gates the WHOLE form behind
    // an account once it carries a file-upload question — not just the upload —
    // so an applicant without one is stopped at the door. Someone who has
    // already paid must never hit a dead end, hence the email route.
    title: "Apply, attaching your receipt",
    description: `Complete the online application with your details and category, and attach your proof of payment. The form is hosted on Google and asks you to sign in to a Google account. If you can't, or your receipt is on paper, email us at ${contactEmail} instead and we'll take your application that way.`,
  },
  {
    title: "We verify your payment",
    description:
      "Our team checks your receipt against your application and confirms the membership category that fits you. You'll show as pending on this page in the meantime, so you can see your application arrived.",
  },
  {
    title: "Welcome to PMAFI",
    description:
      "Once your payment is verified, your membership goes active — check this page any time to see it change, and collect your digital member ID.",
  },
];

export default async function MembershipPage() {
  const content = await getContent();
  // Gates the figures, not the flow — see joinSteps above.
  const detailsPublished = hasPaymentDetails(content);
  const steps = joinSteps(content.contact.email, detailsPublished);

  return (
    <main>
      {/* Hero */}
      <PageHero
        eyebrow="Membership"
        title={
          <>
            Become Part of the{" "}
            <span className="text-gold-shimmer">Mission</span>
          </>
        }
        lede="Join a community of alumni, friends, and partners committed to strengthening the Philippine Military Academy and the officers it produces."
      >
        {/* The page's primary action, in the hero — a visitor who arrives
            already intending to join should not have to scroll past the
            status check and three explainer sections to find it. */}
        <a
          href={APPLICATION_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group bg-[#C8A951] px-8 font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white"
          )}
        >
          Apply for Membership
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </PageHero>

      {/* Status check */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Already a Member?
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Check Your Membership Status
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Look yourself up by the email address on your membership, or by
              your name if you&apos;re not sure which address PMAFI has on file.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <MembershipCheck
              applyHref={APPLICATION_FORM_URL}
              contactEmail={content.contact.email}
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-[#C8A951]/30 bg-[#0a1628] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="flex items-center justify-center gap-2 font-semibold text-white sm:justify-start">
                <IdCard className="h-5 w-5 text-[#C8A951]" />
                Get your digital member ID
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Create a personalized PMAFI ID card with your photo — ready to
                download in seconds.
              </p>
            </div>
            <Link
              href="/membership/id"
              className={cn(
                buttonVariants(),
                "shrink-0 bg-[#C8A951] font-semibold text-[#0a1628] hover:bg-[#A07830] hover:text-white"
              )}
            >
              Create my ID
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
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
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
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
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              How to Join
              <span className="h-px w-8 bg-[#C8A951]/50" />
            </p>
            {/* The heading carries the ordering, because that is the one thing
                a returning visitor can get wrong. "Applying Is Simple" said
                nothing and sat above a lede that inverted what most people
                expect of a membership: here the dues come first. */}
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Pay First, Then Apply
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              Settle your dues, then apply with your receipt attached. One
              submission, and no invoice to wait for.
            </p>
          </div>

          {detailsPublished && (
            <DuesPayment payment={content.payment} dues={content.dues} />
          )}

          <ol className="mt-10 space-y-6">
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
            {/* Said at the click, not only in step 2 above. This is the button
                someone presses after skimming, and the form answers with a
                Google sign-in wall rather than an explanation. */}
            <p className="mx-auto mt-3 max-w-md text-xs text-slate-500">
                The form opens in Google and asks you to sign in. No Google
                account? Email us at{" "}
                <a
                  href={`mailto:${content.contact.email}`}
                  className="font-medium text-[#1B2A4A] underline decoration-[#C8A951]/50 underline-offset-2 transition-colors hover:text-[#C8A951]"
                >
                  {content.contact.email}
                </a>{" "}
              and we&apos;ll take your application that way.
            </p>
            <p className="mt-4 text-sm text-slate-500">
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
