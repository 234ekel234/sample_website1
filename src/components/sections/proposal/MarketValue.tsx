"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, CheckCircle2 } from "lucide-react";

const tiers = [
  {
    label: "Cheap freelancer",
    price: "₱5,000 – ₱15,000",
    note: "Template-based, slow, generic look. Limited revisions.",
  },
  {
    label: "Mid-level freelancer",
    price: "₱25,000 – ₱60,000",
    note: "Custom design, decent quality, some animations, basic SEO.",
  },
  {
    label: "Senior freelancer / boutique studio",
    price: "₱80,000 – ₱200,000",
    note: "Custom code, polished animations, modern stack, mobile-perfect.",
    match: true,
  },
  {
    label: "Small agency",
    price: "₱150,000 – ₱400,000",
    note: "Above + branding, copywriting, project management.",
  },
  {
    label: "Medium / large agency",
    price: "₱500,000 – ₱2M+",
    note: "Full team — strategy, design, dev, content, ongoing support.",
  },
];

const built = [
  "Custom hand-coded — not Wix or Squarespace",
  "7 unique pages, each with proper animations",
  "Modern tech stack (Next.js, Tailwind v4, Framer Motion)",
  "Mobile-responsive and fast-loading",
  "Component-based — easy to update or extend later",
];

export default function MarketValue() {
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
            Market Value
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            What This Would Cost Externally
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Honest Philippine market rates for a website at this scope, by who
            builds it.
          </p>
        </motion.div>

        {/* Tier table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {tiers.map(({ label, price, note, match }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[1.3fr_1fr_2fr] sm:items-center sm:gap-6 ${
                i !== tiers.length - 1 ? "border-b border-slate-100" : ""
              } ${match ? "bg-blue-50" : ""}`}
            >
              {match && (
                <span className="absolute -top-px left-0 rounded-br-lg rounded-tl-lg bg-blue-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                  This Build
                </span>
              )}
              <div className="flex items-center gap-2">
                {match && <CheckCircle2 size={16} className="text-blue-600" />}
                <span className={`font-semibold ${match ? "text-blue-900" : "text-slate-900"}`}>
                  {label}
                </span>
              </div>
              <span className={`text-lg font-bold ${match ? "text-blue-700" : "text-slate-900"}`}>
                {price}
              </span>
              <span className="text-sm text-slate-500">{note}</span>
            </motion.div>
          ))}
        </div>

        {/* What we built that lands in that tier */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/50 p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                What lands this build in the ₱80k – ₱200k tier
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {built.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* The pitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-10 text-center text-white"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
            The Bottom Line
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed">
            Quoted externally, a website at this quality would run between{" "}
            <span className="font-bold text-white">₱80,000 and ₱150,000</span>.
            Built in-house, we get it for the cost of my time plus{" "}
            <span className="font-bold text-white">~₱600/year</span> in
            operating costs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
