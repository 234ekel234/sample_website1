"use client";
import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function ProposalHero() {
  return (
    <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-[#070f1d] to-slate-900 pt-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#1B2A4A]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-[#16294d]/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/30 bg-[#C8A951]/[0.08]0/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
              <Sparkles size={12} /> Project Proposal
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl"
          >
            A Complete Website for{" "}
            <span className="bg-gradient-to-r from-[#C8A951] to-cyan-300 bg-clip-text text-transparent">
              PMAFI
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            Six pages plus a full membership system — already live. Here&apos;s
            what&apos;s built, what it costs to run, and what we could add next,
            all in one place.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
