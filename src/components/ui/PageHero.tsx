"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The dark navy page hero, in one place.
 *
 * This markup was previously copy-pasted across seven pages and had drifted:
 * the ambient blob existed in a dozen sizes and opacities, hero padding came in
 * two variants, and three pages animated their entrance while four did not.
 * Changing a hero meant editing seven files and missing one.
 *
 * Canonical choices, and why:
 *   - Geometry follows the About/Contact/Donate heroes (`min-h-[60vh]` with
 *     flex centering) rather than the fixed `py-32 pt-40` of the others, so the
 *     hero scales with the viewport instead of the type size.
 *   - The title scale is the responsive one (`text-4xl` → `sm:text-5xl` →
 *     `md:text-6xl`). The variant that started at `text-5xl` was cramped on
 *     small screens.
 *   - One gold drift blob at the most-used size. The extra navy blobs on two
 *     pages were navy-on-navy at `blur-3xl` and are not missed.
 *
 * Keep `title` short and pass the accent word as
 * `<span className="text-gold-shimmer">…</span>`.
 */
export interface PageHeroProps {
  /** Small pill above the title, e.g. "Membership". */
  eyebrow: ReactNode;
  /** Replaces the pulsing dot in the pill — pass a lucide icon for a page with its own mark. */
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  /** Supporting sentence beneath the title. */
  lede?: ReactNode;
  /** Anything after the lede, typically a call to action. Animates in last. */
  children?: ReactNode;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

/** The pulsing gold dot used when a page doesn't supply its own icon. */
function PulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A951] opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8A951]" />
    </span>
  );
}

export default function PageHero({
  eyebrow,
  eyebrowIcon,
  title,
  lede,
  children,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#0a1628] pt-28">
      {/* Depth wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_-10%,#16294d_0%,#0a1628_45%,#070f1d_100%)]" />

      {/* Diagonal gold pinstripe, masked to fade at the edges */}
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

      {/* Slow-drifting gold bloom */}
      <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.07] blur-3xl" />

      {/* Fade into whatever section follows */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070f1d] to-transparent" />

      <div className="relative mx-auto w-full min-w-0 max-w-4xl px-6 py-24 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/30 bg-[#C8A951]/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8A951] shadow-[0_0_30px_-8px_rgba(200,169,81,0.5)] backdrop-blur-sm">
              {eyebrowIcon ?? <PulseDot />}
              {eyebrow}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl sm:leading-[1.05] md:text-6xl"
          >
            {title}
          </motion.h1>

          {lede && (
            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
            >
              {lede}
            </motion.p>
          )}

          {children && (
            <motion.div variants={item} className="mt-9">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
