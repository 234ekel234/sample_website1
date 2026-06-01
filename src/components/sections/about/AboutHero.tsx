"use client";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function AboutHero() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#0a1628] pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_-10%,#16294d_0%,#0a1628_45%,#070f1d_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #C8A951 0px, #C8A951 1px, transparent 1px, transparent 72px)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)",
        }}
      />
      <div className="animate-drift pointer-events-none absolute left-1/3 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.07] blur-3xl" />
      <div className="animate-drift-slow pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#1B2A4A] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070f1d] to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/30 bg-[#C8A951]/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8A951] shadow-[0_0_30px_-8px_rgba(200,169,81,0.5)] backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A951] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8A951]" />
              </span>
              About PMAFI
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl"
          >
            A Foundation Built for{" "}
            <span className="text-gold-shimmer">National Service</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            The Philippine Military Academy Foundation, Inc. exists to strengthen
            PMA's capacity to develop military officers of the highest integrity,
            competence, and character — officers who serve God, country, and people.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
