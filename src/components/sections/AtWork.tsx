"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Three of PMAFI's own photographs, between the numbers and the appeal.
 *
 * WHY IT SITS HERE AND NOT HIGHER UP. The page alternates backgrounds —
 * dark · white · slate · white · dark · slate · dark — and News is already
 * slate-50, so a slate band straight after it would read as one long section
 * with a gap in the middle. Between Stats (white) and SupportImpact (#0a1628)
 * is the only seam where a slate band does not touch its own colour, and it
 * happens to read in the right order too: the numbers, then the people the
 * numbers are about, then the ask.
 *
 * NO CAPTION HERE NAMES ANYBODY, and that follows /donate rather than
 * inventing a rule — its cheque handover caption "stays general rather than
 * restating the name". It matters more on this page than on that one. Two of
 * these three are certificate presentations, the certificates carry the
 * recipient's name and rank, and Next will serve a large enough derivative to
 * read them. A photograph of an official event is one thing; a caption naming
 * the recipient turns it into a published record of a named individual, which
 * is a different thing and not ours to publish.
 *
 * THE CORPS FRAME IS THE ONE SHOT FROM BEHIND THE CADETS. PMAFI supplied two
 * frames of the same November 2024 assembly. /about's AcademyBand uses the
 * front-facing one, so this takes the other — a genuinely different photograph
 * rather than the same room twice, and the one where the hall reads as a crowd
 * instead of as portraits.
 *
 * The dates come off the welcome slide in the photographs themselves, which
 * reads 15 November 2024. PMAFI's filenames say 2025 and are wrong; captioning
 * from the filename would have published the wrong year.
 */

interface Frame {
  src: string;
  alt: string;
  caption: string;
}

const frames: Frame[] = [
  {
    src: "/pma-corps-assembly.jpg",
    alt: "Cadets of the Philippine Military Academy seated in the assembly hall as the Foundation's Board of Trustees addresses them.",
    caption:
      "Before the Corps of Cadets at Fort del Pilar, on the Board's annual visit, November 2024.",
  },
  {
    src: "/teaching-excellence-award.jpg",
    alt: "An instructor of the Philippine Military Academy receiving a certificate of recognition from officers of the Foundation.",
    caption:
      "Recognising teaching excellence — the Foundation's certificate presented at the Academy.",
  },
  {
    src: "/donation-handover.jpg",
    alt: "Alumni of the Academy presenting a donation cheque to the Philippine Military Academy Foundation.",
    caption: "A gift from alumni of the Academy, presented to the Foundation.",
  },
];

export default function AtWork() {
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
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            In Pictures
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            The Foundation at Work
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            The Corps the Foundation serves, the faculty it recognises, and the
            alumni whose gifts make both possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {frames.map(({ src, alt, caption }, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* 3:2 is the aspect the source files already are, so the frame
                  crops nothing. The other option was a taller card, which would
                  have thrown away a band of every photograph to gain height
                  nothing needed. */}
              <div className="relative aspect-[3/2] w-full bg-slate-100">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                />
              </div>
              <figcaption className="px-5 py-4 text-sm leading-relaxed text-slate-600">
                {caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/donate/impact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold-ink transition-colors hover:text-[#1B2A4A]"
          >
            See what recent gifts have funded
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
