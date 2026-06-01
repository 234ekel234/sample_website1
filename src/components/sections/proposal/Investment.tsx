"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Heart, Wrench, Server } from "lucide-react";

const included = [
  "Six pages — Home, About, Programs, Board, Membership, Contact",
  "Full membership system — online apply + private status check",
  "Auto “Pending Payment” tracking via Google Forms/Sheets",
  "Custom, privacy-preserving member lookup (no paid database)",
  "Mobile-responsive, fast, SEO-ready — owned outright by PMAFI",
];

export default function Investment() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-slate-50 py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            The Investment
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            What This Costs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            A comparable build externally would run ₱90,000 – ₱150,000. Here is
            our proposed price for PMAFI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Price card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-10 text-white lg:col-span-2"
          >
            <div className="absolute right-0 top-0 flex items-center gap-1.5 rounded-bl-xl bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
              <Heart size={12} /> Foundation Rate
            </div>

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              One-time build
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-extrabold">₱60,000</span>
              <span className="mb-1 text-lg font-medium text-blue-200 line-through">
                ₱100,000
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              A deliberate discount from the ~₱100,000 market value — our
              contribution to the Foundation&apos;s mission. One-time, payable on
              acceptance.
            </p>

            <div className="mt-6 space-y-3 border-t border-white/15 pt-6">
              <div className="flex items-start gap-3">
                <Server size={18} className="mt-0.5 shrink-0 text-blue-200" />
                <p className="text-sm text-blue-100">
                  <span className="font-semibold text-white">≈ ₱0/year to run</span>{" "}
                  — hosting, forms, and roster all on free tiers (just an
                  optional ~$10/yr domain).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Wrench size={18} className="mt-0.5 shrink-0 text-blue-200" />
                <p className="text-sm text-blue-100">
                  <span className="font-semibold text-white">Maintenance: ₱2,000 – ₱4,000/month</span>{" "}
                  (optional) — content updates, board changes, security patches.
                  Or ad-hoc per change.
                </p>
              </div>
            </div>
          </motion.div>

          {/* What's included */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-3"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              What&apos;s included
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
              <p className="text-sm leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-900">Why it&apos;s worth it:</span>{" "}
                the same site and membership system from an agency would cost
                ₱150,000+ and lock PMAFI into per-change fees. This is built,
                live, and owned outright — at a fraction of that, with almost no
                cost to keep running.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
