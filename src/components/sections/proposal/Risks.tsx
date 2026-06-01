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
    title: "Member roster privacy",
    severity: "high",
    risk: "The roster holds members' names and emails. If the private Google Sheet were shared too widely, that data could be exposed.",
    mitigation: "By design the full roster never reaches the browser — the server matches one email and returns only that record. The sheet is shared only with a service account, and credentials live in environment variables, never in the code.",
  },
  {
    title: "Domain expiry — site goes dark",
    severity: "medium",
    risk: "If PMAFI registers a custom domain and forgets to renew it, the website disappears overnight.",
    mitigation: "Register for 5+ years upfront and enable auto-renewal on a monitored billing email. (Not a risk today — the free pmafi.vercel.app address doesn't expire.)",
  },
  {
    title: "Google Forms / Sheets dependency",
    severity: "low",
    risk: "Applications and the roster rely on Google Forms & Sheets. If Google ever paywalls or changes them, intake could break.",
    mitigation: "Both have clear replacement paths (a native form / database, 1–2 weeks of work), and all historical data stays exportable from Google at any time.",
  },
  {
    title: "Single-developer knowledge",
    severity: "medium",
    risk: "Right now one person knows how to update the site. If they're unavailable, changes stall.",
    mitigation: "Code is well-organized, uses standard tools (Next.js, Tailwind) thousands of developers know, and the whole setup is documented in the project's reference files. Any web developer can pick it up.",
  },
  {
    title: "Manual invoicing & activation",
    severity: "medium",
    risk: "After someone applies, a person manually invoices them and later marks them Active. If staff get busy, applicants could wait.",
    mitigation: "Applicants get instant \"Pending Payment\" confirmation so nothing feels dropped. The \"automated invoice\" and \"online payments\" add-ons can remove the manual steps as volume grows.",
  },
  {
    title: "Free hosting tier limits",
    severity: "low",
    risk: "Vercel's free tier has bandwidth limits. A sudden traffic spike could hit the cap.",
    mitigation: "The free tier covers ~100k monthly visitors — far beyond a foundation's needs. Hitting it is a good problem; upgrading takes minutes.",
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
