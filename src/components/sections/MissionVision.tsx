"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MISSION, VISION } from "@/lib/foundation";

/**
 * PMAFI's adopted Mission and Vision on the home page.
 *
 * THE TEXT IS IMPORTED, NEVER PASTED. /about's MissionValues renders the same
 * two strings from src/lib/foundation.ts. Two hand-typed copies of a formally
 * adopted statement will differ eventually, and a foundation whose mission
 * reads differently on two pages of its own site is worse off than one that
 * only states it once.
 *
 * WHY IT SITS AFTER THE CHAIRMAN'S MESSAGE. page.tsx keeps the sections with
 * photographs first, so a visitor meets the Foundation as people before they
 * meet it as a list of programme areas — putting a block of formal prose
 * between the hero and that message would undo the thing that ordering exists
 * for. Directly after it reads in the right order anyway: the Chairman speaks,
 * then the Foundation states what it is formally for.
 *
 * IT IS DARK because of the alternation rule, not for emphasis. Chairman is
 * white and News is slate-50, so this seam takes the only third colour
 * available. The sequence stays dark · white · dark · slate · white · slate ·
 * dark · slate · dark, with no two neighbours sharing a background.
 *
 * The two statements are NOT given equal visual weight. The mission is what
 * the Foundation does and leads; the vision is the condition it is working
 * towards and follows, smaller. On /about they sit side by side as equals,
 * which suits a page somebody has chosen to read — here, where the visitor is
 * passing through, one of them has to be the one that lands.
 */
export default function MissionVision() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden bg-[#0a1628] py-24" ref={ref}>
      {/* Same faint seal the hero uses, at the same 6% — enough to register as
          texture on the navy, never enough to compete with the type over it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #C8A951 0px, #C8A951 1px, transparent 1px, transparent 72px)",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Real headings, not styled paragraphs. The band is a titled
              section of the page and h2/h3 is what says so; the eyebrow
              treatment is only how they look. Order on the home page stays
              h1 · h2 · h2 · h3 · h2 …, with no level skipped. */}
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Our Mission
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </h2>
          <p className="mx-auto mt-6 text-xl leading-relaxed text-white sm:text-2xl sm:leading-relaxed">
            {MISSION}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-12 max-w-2xl border-t border-white/10 pt-10"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#C8A951]">
            Our Vision
          </h3>
          {/* slate-300 on #0a1628, not slate-400: this is body copy on a dark
              background and the site holds Lighthouse accessibility at 100. */}
          <p className="mt-4 leading-relaxed text-slate-300">{VISION}</p>
        </motion.div>
      </div>
    </section>
  );
}
