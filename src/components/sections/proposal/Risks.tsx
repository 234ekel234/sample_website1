"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Shield } from "lucide-react";

type Severity = "low" | "medium" | "high";

const severityStyles: Record<Severity, { bg: string; text: string; label: string }> = {
  low: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Low" },
  medium: { bg: "bg-amber-100", text: "text-amber-700", label: "Medium" },
  high: { bg: "bg-red-100", text: "text-red-700", label: "High" },
};

const risks: { title: string; severity: Severity; risk: string; mitigation: string }[] = [
  {
    title: "Domain expiry — site goes dark",
    severity: "high",
    risk: "If we forget to renew the domain, the website disappears overnight and customers can't find us.",
    mitigation: "Register for 5+ years upfront (as recommended) and enable auto-renewal with a billing email that's actively monitored.",
  },
  {
    title: "Google Forms changes pricing or shuts down",
    severity: "low",
    risk: "Our order intake depends on Google Forms. If Google ever paywalls it or shuts it down, our intake breaks.",
    mitigation: "Form has a clear replacement path — Formspree or a native form (1-2 weeks of work). All historical orders stay in our Google Sheet regardless.",
  },
  {
    title: "Single-developer knowledge",
    severity: "medium",
    risk: "Right now one person knows how to update the site. If they leave or are unavailable, changes stall.",
    mitigation: "Code is well-organized and uses standard tools (Next.js, Tailwind) that thousands of developers know. Any junior dev can pick it up. Documentation can be added when needed.",
  },
  {
    title: "Free hosting tier limits",
    severity: "low",
    risk: "Vercel's free tier has bandwidth limits. If we suddenly go viral, the site could hit the cap.",
    mitigation: "Vercel's free tier covers ~100k monthly visitors — far beyond what we need for a normal business. Hitting the limit is a good problem; upgrade to Pro (~₱1,150/month) takes minutes.",
  },
  {
    title: "Manual order confirmation workflow",
    severity: "medium",
    risk: "We manually send totals and confirm receipts. If we get busy, orders could sit for days.",
    mitigation: "Confirmed 24-hour response SLA in our marketing. As volume grows, the \"Online payments\" add-on automates this step entirely.",
  },
  {
    title: "Email deliverability",
    severity: "low",
    risk: "Customer order confirmations rely on Gmail. If their email provider marks our messages as spam, they may miss them.",
    mitigation: "Confirm orders via the customer's preferred contact method (already collected on the form — phone or email). For high-value orders, follow up via phone if no email response.",
  },
  {
    title: "Browser / device compatibility",
    severity: "low",
    risk: "Customers on very old browsers (IE11, ancient Android) may see a degraded experience.",
    mitigation: "Site uses modern web standards (~98% of PH internet users supported). Critical pages remain functional even with JavaScript disabled. Older browsers degrade gracefully, not catastrophically.",
  },
];

export default function Risks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            What Could Go Wrong
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Risks &amp; Mitigations
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Honest risks of running a site this way — and how we&apos;d handle
            each one if it happens.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {risks.map(({ title, severity, risk, mitigation }, i) => {
            const sev = severityStyles[severity];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <AlertTriangle size={18} />
                    </div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${sev.bg} ${sev.text}`}>
                    {sev.label}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      The risk
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{risk}</p>
                  </div>

                  <div className="border-l-2 border-blue-200 pl-4">
                    <div className="flex items-center gap-2">
                      <Shield size={13} className="text-blue-600" />
                      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                        How we handle it
                      </p>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{mitigation}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
