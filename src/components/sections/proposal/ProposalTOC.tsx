"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Keep these in sync with the section ids wired up in src/app/proposal/page.tsx.
export const tocItems = [
  { id: "whats-built", label: "What's Already Built" },
  { id: "operating-costs", label: "Operating Costs" },
  { id: "domain-options", label: "Domain Options" },
  { id: "market-value", label: "What It's Worth" },
  { id: "alternatives", label: "Compared to Alternatives" },
  { id: "add-ons", label: "Suggested Add-Ons" },
  { id: "risks", label: "Risks & Mitigations" },
  { id: "maintenance", label: "Maintenance & Support" },
  { id: "next-steps", label: "Recommended First Steps" },
];

export default function ProposalTOC() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-b border-slate-100 bg-slate-50 py-16" ref={ref}>
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-gradient-to-br from-[#16294d] to-[#0a1628] px-8 py-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C8A951]">
              On This Page
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">Contents</h2>
          </div>
          <ol className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2">
            {tocItems.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-[#C8A951]/[0.08]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1B2A4A]/10 text-sm font-bold text-[#1B2A4A] transition-colors group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700 transition-colors group-hover:text-[#1B2A4A]">
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
