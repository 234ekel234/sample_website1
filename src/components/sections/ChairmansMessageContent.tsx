"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

// Presentation only. The text arrives as props from ChairmansMessage.tsx, which
// reads it from the staff-editable content sheet (src/lib/content.ts).
// The portrait stays in code — board photos are developer-managed.
export interface ChairmansMessageContentProps {
  name: string;
  title: string;
  body: string[];
  /**
   * The speaker's board portrait, resolved from their name by the server
   * component. `null` when the content sheet names somebody who is not on the
   * board — a typo, or a new officer not yet added — in which case the frame
   * renders without a photo. NEVER a default face: showing the previous
   * speaker's portrait beside a new speaker's words is a misattribution, and a
   * silent one.
   */
  portrait: string | null;
}

/**
 * "President, PMAFI" -> "President", for the heading only.
 *
 * The heading used to be the hardcoded string "Message from the Chairman"
 * while the name and title beneath it came from the sheet, so changing who is
 * quoted required a deploy to stop the page contradicting itself. Deriving it
 * means the sheet alone decides, and the heading cannot drift from the byline.
 */
const roleFrom = (title: string) => title.split(",")[0].trim();

export default function ChairmansMessageContent({
  name,
  title,
  body,
  portrait,
}: ChairmansMessageContentProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[320px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#16294d] to-[#0a1628] shadow-lg">
              {/*
                320px WAS A COMPROMISE AND IS NOW SIMPLY THE SIZE. The other
                board portraits are 195x195 — thumbnail size, soft past about
                100px on a retina screen — and this frame sat at 320 anyway,
                because a portrait that reads as small undersells the person in
                it and softness is at least honest about the source.

                PMAFI supplied the Chairman's portrait at full size on
                2026-09-03 (1261x1600, cropped square to 800x800), so whoever
                the sheet names is sharp here as long as it is him. Anyone else
                falls back to a 195px file and the old compromise returns, which
                is why the frame stays where it is rather than growing to suit
                one photograph.

                What is NOT negotiable is the square. The frame was once 4:5,
                and `object-cover` threw away a fifth of the width to reach that
                shape before enlarging what survived — paying twice. Square uses
                every pixel the file has.
              */}
              <div className="relative aspect-square">
                {portrait && (
                  <Image
                    src={portrait}
                    alt={name}
                    fill
                    className="object-cover object-top"
                    sizes="320px"
                  />
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-transparent p-6 pt-16">
                <p className="text-sm font-bold text-white">{name}</p>
                <p className="text-xs font-medium uppercase tracking-widest text-[#C8A951]">
                  {title}
                </p>
              </div>
            </div>
            {/* Floating gold accent */}
            <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8A951] text-[#1B2A4A] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)]">
              <Quote size={22} />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              From Our Leadership
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Message from the {roleFrom(title)}
            </h2>
            <div className="mt-6 space-y-4">
              {body.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-slate-600">
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-8 border-l-2 border-[#C8A951] pl-5">
              <p className="font-bold text-[#1B2A4A]">{name}</p>
              <p className="text-sm text-slate-500">{title}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
