"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// What the Foundation did in 2025, counted in things rather than pesos.
//
// COUNTS, NEVER AMOUNTS. PMAFI's 2025 annual report states all of this in
// money as well — grant totals, the fund balance, and individual donors beside
// the sums they gave. None of that belongs on a public page. /donate/status
// demands a reference code precisely so nobody learns what another person
// gave, and the amount on the presentation cheque in the photograph on /donate
// is blurred out of the file for the same reason. Publishing a donor's gift as
// a headline figure here would undo both. A count of books and faculty says
// what the money achieved without pricing anybody's generosity.
//
// SOURCE: PMAFI Annual Report 2025 (1 January – 31 December 2025), held in
// references/ and deliberately never committed — it carries the full member
// roster. These are the report's facts in the site's own words; when the 2026
// report lands, these numbers are superseded rather than added to.
const counts = [
  {
    figure: "160",
    label: "Professorial chairs endowed",
    note: "As of 31 December 2025",
  },
  {
    figure: "109",
    label: "Books and reference materials",
    note: "Donated to the PMA Library",
  },
  {
    figure: "21",
    label: "Course Directors awarded chairs",
    note: "For course development and administration",
  },
  {
    figure: "12",
    label: "Faculty recognised",
    note: "For teaching and academic excellence",
  },
  {
    figure: "5",
    label: "Faculty on full scholarship",
    // The scholarships run by school year, not calendar year — saying "in 2025"
    // of an SY 2025-26 grant would be a small, avoidable inaccuracy.
    note: "Tuition, fees and a book allowance, SY 2025–26",
  },
  {
    figure: "8",
    label: "Faculty sent to seminars",
    note: "In-house and off-campus, to keep courses current",
  },
];

export default function YearInReview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-b border-slate-100 bg-slate-50 py-16" ref={ref}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          {/* gold-ink, not gold: the vivid token fails AA on a light background. */}
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            The Year in Review
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1B2A4A]">
            In 2025, at the Academy
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Not a plan — a record of what the Foundation put in place last year,
            drawn from its 2025 annual report to the membership.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {counts.map(({ figure, label, note }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-4xl font-bold tracking-tight text-[#1B2A4A]">
                {figure}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {note}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
          The Foundation also donated brand-new training equipment to the
          Academy, funded research grants for faculty and staff, and paid for a
          series of lectures delivered on campus.
        </p>
      </div>
    </section>
  );
}
