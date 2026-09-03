"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Six of PMAFI's own photographs, between the numbers and the appeal.
 *
 * SIX, IN TWO ROWS OF THREE, is close to the ceiling this material supports.
 * The client folders hold about thirty files, but most are extra frames of the
 * same handful of occasions — four of the PAF call, four of the Coast Guard
 * visit, several of one cheque handover — and each occasion may appear once.
 * A few are disqualified outright rather than merely repetitive; see the note
 * in AGENTS.md about what is in those folders.
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
 * restating the name". These are posed photographs of official occasions in
 * which serving officers are identifiable, and one of them is somebody's
 * retirement-season turnover of command. A photograph of an official event is
 * one thing; a caption attaching names to the faces in it is a different
 * thing, and not ours to publish on the Foundation's behalf.
 *
 * THE SOURCES ARE THE SECOND PMAFI DROP, not the eight-file set the rest of
 * the site draws on — see the gitignored client folder. The originals stay out
 * of the repo, as that folder's exclude note requires; only these crops ship.
 *
 * ONE OF THE THREE IS SMALL AND THAT IS THE CEILING, NOT A CHOICE.
 * pma-supt-turnover.jpg comes from an 854x641 original, so it exports at
 * 854x569 and no larger — upscaling would add bytes and no detail. At this
 * card's width it is asked for roughly 800 device pixels, which it just meets.
 * If these cards are ever widened, that frame is the one that breaks first,
 * and the fix is a bigger original from PMAFI rather than a bigger export.
 */

interface Frame {
  src: string;
  alt: string;
  caption: string;
  /**
   * Month and year, on its own line beneath the caption.
   *
   * OPTIONAL BECAUSE THE EVIDENCE IS. Every date here is read off something
   * visible inside the photograph itself — the EXIF is stripped from every
   * file PMAFI sent, so they all carry only the timestamp of the day they were
   * delivered, and elsewhere in the drop the filenames are demonstrably wrong
   * about the year. Two frames date themselves: the golf tournament from the
   * board the players stand beside, and the corps assembly from the welcome
   * slide behind the lectern. The other four get no date rather than a guessed
   * one, so two of six cards carry a date line. That is the honest result of
   * the rule, not an oversight: a plausible date published under the
   * Foundation's name is worse than a blank.
   */
  date?: string;
}

const frames: Frame[] = [
  {
    src: "/courtesy-call-paf.jpg",
    alt: "Trustees of the Philippine Military Academy Foundation standing with the Commanding General of the Philippine Air Force during a courtesy call.",
    caption:
      "Trustees of the Foundation on a courtesy call to the Philippine Air Force.",
    // Deliberately undated: nothing in the frame carries one. Outstanding from
    // PMAFI — see references/pmafi-information-request.md.
  },
  {
    src: "/chairman-afp-chief.jpg",
    alt: "The Foundation's Chairman standing with the Chief of Staff of the Armed Forces of the Philippines before the AFP seal.",
    caption:
      "The Chairman with the Chief of Staff of the Armed Forces of the Philippines.",
    // Deliberately undated: nothing in the frame carries one.
  },
  {
    src: "/pma-supt-turnover.jpg",
    alt: "The Corps of Cadets on parade at Fort del Pilar during the turnover of command of the Philippine Military Academy.",
    caption:
      "The turnover of command at the Academy, with the Corps on parade at Fort del Pilar.",
    // Deliberately undated: nothing in the frame carries one.
  },
  {
    src: "/pma-corps-assembly.jpg",
    alt: "Cadets of the Philippine Military Academy seated in the assembly hall as the Foundation's Board of Trustees addresses them.",
    caption:
      "Before the Corps of Cadets at Fort del Pilar, on the Board's annual visit.",
    // The welcome slide behind the lectern reads "15 November 2024". This is the
    // frame shot from BEHIND the seated cadets — /about's AcademyBand carries
    // the side-on one from the same assembly, so the two pages show different
    // photographs, and this is the one where the hall reads as a crowd rather
    // than as portraits.
    date: "November 2024",
  },
  {
    src: "/gift-presentation.jpg",
    alt: "Alumni of the Academy presenting a cheque to officers of the Philippine Military Academy Foundation.",
    caption: "A gift presented to the Foundation by alumni of the Academy.",
    // REDACTED BEFORE EXPORT, and not by cropping. The cheque in frame is a
    // real personal one, and the table carried a Metrobank slip with a MICR
    // line plus filled forms. Both regions were destroyed at source resolution
    // and the export taken afterwards, so the detail is absent from the
    // shipped pixels rather than hidden under anything CSS could lift — the
    // same standard /donate's handover photo is held to. The edges are
    // feathered so it reads as foreground defocus instead of a censor bar.
    // Deliberately undated: nothing legible in the frame carries one.
  },
  {
    src: "/golf-tournament.jpg",
    alt: "Players beside the tournament board at the Foundation's first invitational golf tournament, Camp Aguinaldo Golf Course.",
    caption:
      "The Foundation's first invitational golf tournament, at Camp Aguinaldo.",
    // The tournament board in the frame reads "Camp Aguinaldo Golf Course,
    // May 26, 2026". Month only, to match the format the other cards would
    // use — the day adds nothing a caption needs.
    date: "May 2026",
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
          {frames.map(({ src, alt, caption, date }, i) => (
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
              {/* The date sits on its own line rather than inside the prose,
                  so the three cards line up whether or not a given frame can
                  be dated. Buried in the sentence it read as a fact about one
                  photograph; on its own line it reads as a field the section
                  keeps, and an absent one is visibly absent rather than a
                  sentence that happens to stop early.

                  slate-500 is the floor for muted text on white here — 400
                  fails AA, and these pages hold Lighthouse accessibility at
                  100. */}
              <figcaption className="px-5 py-4">
                <p className="text-sm leading-relaxed text-slate-600">
                  {caption}
                </p>
                {date && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {date}
                  </p>
                )}
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
