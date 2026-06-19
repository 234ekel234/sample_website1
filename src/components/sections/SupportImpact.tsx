"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Landmark, Building2, Sprout, ArrowRight } from "lucide-react";

// Impact areas drawn from PMAFI's actual programs (professorial chairs,
// endowment & development funds, faculty, facilities). No figures or tax
// claims here — those remain pending PMAFI confirmation.
const areas = [
  {
    icon: GraduationCap,
    title: "Faculty & Professorial Chairs",
    description:
      "Helping the Academy attract and retain outstanding instructors — and honoring them through endowed professorial chairs.",
  },
  {
    icon: Building2,
    title: "Facilities & Modernization",
    description:
      "Funding the classrooms, laboratories, and learning environments that keep PMA's training at world-class standards.",
  },
  {
    icon: Sprout,
    title: "Academic & Cadet Programs",
    description:
      "Strengthening the curriculum, research, and development programs that shape officers of competence and character.",
  },
  {
    icon: Landmark,
    title: "Endowment for the Future",
    description:
      "Building permanent funds whose principal is preserved — so the earnings sustain the Academy in perpetuity.",
  },
];

export default function SupportImpact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden bg-[#0a1628] py-24" ref={ref}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#16294d_0%,#0a1628_55%)]" />
      <div className="animate-drift-slow pointer-events-none absolute -right-20 top-1/3 h-[420px] w-[420px] rounded-full bg-[#C8A951]/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Where Your Support Goes
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
            Every Gift Strengthens the Academy
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            PMAFI channels the generosity of alumni and partners into the people,
            places, and programs that make PMA exceptional.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A951]/40 hover:bg-white/[0.06]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C8A951]/10 text-[#C8A951] transition-transform duration-300 group-hover:scale-110">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/donate"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#C8A951] px-7 py-3 text-sm font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white"
          >
            Support the Mission
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
