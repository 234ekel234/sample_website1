"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a1628]">
      {/* Deep base gradient for richness */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_-10%,#16294d_0%,#0a1628_45%,#070f1d_100%)]" />

      {/* Subtle diagonal pattern, faded with a radial mask */}
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

      {/* Drifting ambient glows */}
      <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.07] blur-3xl" />
      <div className="animate-drift-slow pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#1B2A4A] blur-3xl" />
      <div className="animate-drift-slow pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#C8A951]/10 blur-3xl" />

      {/* Top and bottom vignettes to seat the section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070f1d] to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/30 bg-[#C8A951]/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8A951] shadow-[0_0_30px_-8px_rgba(200,169,81,0.5)] backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A951] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8A951]" />
              </span>
              Philippine Military Academy Foundation, Inc.
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl"
          >
            Forging Leaders of
            <br />
            <span className="text-gold-shimmer">Integrity &amp; Excellence</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300/90"
          >
            PMAFI supports the Philippine Military Academy in developing officers
            of integrity, competence, and character — building the next
            generation of leaders dedicated to serving our nation.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group bg-[#C8A951] px-8 font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white hover:shadow-[0_12px_40px_-8px_rgba(200,169,81,0.5)]"
              )}
            >
              Support PMAFI
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/programs"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/15 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 hover:text-white"
              )}
            >
              Our Programs
            </Link>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 text-xs font-medium uppercase tracking-widest text-white/40"
          >
            Honor &middot; Loyalty &middot; Valor &middot; Country
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
