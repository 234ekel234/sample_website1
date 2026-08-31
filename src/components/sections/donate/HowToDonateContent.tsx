"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Landmark, Smartphone, Mail, ShieldCheck, FileCheck2, ArrowRight } from "lucide-react";

// Payment channels come from the staff-editable content sheet. Until PMAFI
// fills them in, the page says details are being finalized and routes donors to
// email — it never publishes a guessed account number.
export interface HowToDonateContentProps {
  email: string;
  /**
   * Public link to the "Tell us about your donation" form. Blank until PMAFI
   * creates it, and step 3 then keeps asking donors to email their details —
   * which is what the page has always said, so an unset key is not a gap.
   */
  donationFormUrl: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  gcashName: string;
  gcashNumber: string;
}

/**
 * Step 3 is the one that varies.
 *
 * A bank transfer reaches PMAFI as a name and an amount — no address to reply
 * to, no fund. Somebody has to close that gap. With a form it is structured and
 * typed once by the donor; without one it is an email a staff member retypes,
 * and a mistyped address means the donor's own gift is invisible to them at
 * /donate/status with no way to tell why.
 */
const steps = (hasForm: boolean) => [
  "Choose how you'd like to give from the options above.",
  "Send your donation through the channel provided (or email us to arrange it).",
  hasForm
    ? "Tell us about your gift using the short form below, so we know it came from you and which fund you meant it for."
    : "Email your name, contact details, and proof of payment so we can acknowledge it.",
  "Receive your official acknowledgment and receipt from the Foundation.",
];

export default function HowToDonateContent({
  email,
  donationFormUrl,
  bankName,
  bankAccountName,
  bankAccountNumber,
  gcashName,
  gcashNumber,
}: HowToDonateContentProps) {
  const bankConfirmed = Boolean(bankName && bankAccountNumber);
  const gcashConfirmed = Boolean(gcashNumber);

  const channels = [
    {
      icon: Landmark,
      label: "Bank Transfer",
      value: bankConfirmed ? bankName : "Account details being finalized",
      note: bankConfirmed
        ? [bankAccountName, bankAccountNumber].filter(Boolean).join(" · ")
        : "Bank name, account name, and number will be published once confirmed.",
    },
    {
      icon: Smartphone,
      label: "GCash / e-Wallet",
      value: gcashConfirmed ? gcashNumber : "Coming soon",
      note: gcashConfirmed
        ? gcashName || "GCash"
        : "An e-wallet option will be added for quick, smaller donations.",
    },
  ];

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-slate-50 py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              How to Give
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Making Your Donation
            </h2>
            <ol className="mt-8 space-y-6">
              {steps(Boolean(donationFormUrl)).map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-sm font-bold text-[#C8A951]">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-slate-600">{step}</span>
                </motion.li>
              ))}
            </ol>

            {/* Only once PMAFI has created the form and put its link in the
                content sheet. Until then step 3 above still tells the donor to
                email their details, so there is nothing dangling. */}
            {donationFormUrl && (
              <div className="mt-8">
                <a
                  href={donationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-6 py-3 text-sm font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#8A6A22] hover:text-white"
                >
                  Tell us about your gift
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <p className="mt-2 max-w-md text-xs text-slate-500">
                  Takes about a minute, and there is nothing to upload. It is
                  what lets us acknowledge your gift and show it to you later at{" "}
                  <span className="whitespace-nowrap">/donate/status</span>.
                </p>
              </div>
            )}
          </motion.div>

          {/* Channels + trust */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <div className="space-y-4">
              {channels.map(({ icon: Icon, label, value, note }) => (
                <div
                  key={label}
                  className="flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {label}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900">{value}</p>
                    <p className="mt-1 text-sm text-slate-500">{note}</p>
                  </div>
                </div>
              ))}

              {/* Email for now */}
              <a
                href={`mailto:${email}?subject=PMAFI%20Donation`}
                className="group flex items-center gap-5 rounded-2xl border border-[#C8A951]/30 bg-[#C8A951]/[0.08] p-6 transition-colors hover:bg-[#C8A951]/[0.14]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C8A951] text-[#1B2A4A]">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="font-semibold text-[#1B2A4A]">
                    Ready to give now? Email us.
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    We&apos;ll send current payment details and arrange your donation —{" "}
                    <span className="font-medium text-[#1B2A4A]">{email}</span>
                  </p>
                </div>
              </a>
            </div>

            {/* Trust / tax note */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#1B2A4A]" />
                {/* PMAFI's BIR donee-institution registration is documented only
                    in a brochure roughly 14 years old and has never been
                    confirmed. Tax-deductibility is a representation to donors,
                    so the site states it as pending rather than as fact. Restore
                    the full wording once PMAFI confirms the registration is
                    current — see references/pmafi-information-ledger.md §1.6. */}
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-[#1B2A4A]">
                    Tax-deductibility — coming soon.
                  </span>{" "}
                  We&apos;re confirming PMAFI&apos;s current donee-institution
                  status with the BIR and will publish the details here once
                  verified.
                </p>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <FileCheck2 size={20} className="mt-0.5 shrink-0 text-[#1B2A4A]" />
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-[#1B2A4A]">Principal preserved.</span>{" "}
                  For professorial chairs and endowments, the principal is never
                  spent — only the earnings fund grants, so your contribution lasts.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
