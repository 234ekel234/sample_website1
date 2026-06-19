"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Infinity as InfinityIcon, Compass, Award, ShieldCheck } from "lucide-react";

// Stewardship promises — framed around how PMAFI handles gifts, not tax benefits
// (PMAFI's BIR donee status is still pending confirmation, so no tax claims).
const promises = [
  {
    icon: InfinityIcon,
    title: "Preserved in Perpetuity",
    description:
      "Endowment and chair principal is never spent — only the earnings fund programs, so your gift gives forever.",
  },
  {
    icon: Compass,
    title: "Directed Where It Matters",
    description:
      "Unrestricted gifts go straight to the Academy's most pressing needs, guided by PMAFI's board.",
  },
  {
    icon: Award,
    title: "Named in Your Honor",
    description:
      "Establish a professorial chair or fund in your name, your family's, or your class's lasting honor.",
  },
  {
    icon: ShieldCheck,
    title: "A Dedicated Foundation",
    description:
      "PMAFI is a non-stock, non-profit foundation that exists solely to support the Philippine Military Academy.",
  },
];

export default function GivingPromise() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-y border-slate-200/70 bg-gradient-to-b from-white to-slate-50 py-20" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Our Commitment
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            How Your Gift Is Honored
          </h2>
          <p className="mt-4 text-slate-500">
            Every contribution is stewarded with care, transparency, and a
            commitment to lasting impact at the Academy.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center sm:text-left"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A] text-[#C8A951] shadow-sm sm:mx-0">
                <Icon size={22} />
              </div>
              <h3 className="text-base font-bold text-[#1B2A4A]">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
