"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Landmark, Smartphone, Mail, ShieldCheck, FileCheck2 } from "lucide-react";

// PLACEHOLDER payment channels — replace with PMAFI's real bank/GCash details
// once confirmed (open item in the client follow-up email). Until then the page
// routes donors to email so no incorrect account numbers are published.
const channels = [
  {
    icon: Landmark,
    label: "Bank Transfer",
    value: "Account details being finalized",
    note: "Bank name, account name, and number will be published once confirmed.",
  },
  {
    icon: Smartphone,
    label: "GCash / e-Wallet",
    value: "Coming soon",
    note: "An e-wallet option will be added for quick, smaller gifts.",
  },
];

const steps = [
  "Choose how you'd like to give from the options above.",
  "Send your gift through the channel provided (or email us to arrange it).",
  "Email your name, contact details, and proof of payment so we can acknowledge it.",
  "Receive your official acknowledgment and receipt from the Foundation.",
];

export default function HowToDonate() {
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
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              How to Give
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Making Your Gift
            </h2>
            <ol className="mt-8 space-y-6">
              {steps.map((step, i) => (
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
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {label}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900">{value}</p>
                    <p className="mt-1 text-sm text-slate-500">{note}</p>
                  </div>
                </div>
              ))}

              {/* Email for now */}
              <a
                href="mailto:pmafi.web@gmail.com?subject=PMAFI%20Donation"
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
                    We&apos;ll send current payment details and arrange your gift —{" "}
                    <span className="font-medium text-[#1B2A4A]">pmafi.web@gmail.com</span>
                  </p>
                </div>
              </a>
            </div>

            {/* Trust / tax note */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#1B2A4A]" />
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-[#1B2A4A]">Tax-deductible.</span>{" "}
                  PMAFI is registered with the BIR as a donee institution under
                  Section 30(H) of the Tax Reform Act of 1997, so donations are
                  tax-deductible. <span className="italic">(To be confirmed with PMAFI before public launch.)</span>
                </p>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <FileCheck2 size={20} className="mt-0.5 shrink-0 text-[#1B2A4A]" />
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-[#1B2A4A]">Principal preserved.</span>{" "}
                  For professorial chairs and endowments, the principal is never
                  spent — only the earnings fund grants, so your gift keeps giving.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
