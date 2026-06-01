"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Users, BookOpen, Globe } from "lucide-react";

const highlights = [
  {
    icon: Shield,
    title: "Mission-Driven",
    text: "Every program and initiative is anchored on a single purpose: strengthening PMA and the officers it produces.",
  },
  {
    icon: Users,
    title: "Alumni-Led",
    text: "PMAFI is governed and supported by PMA graduates who carry a lifelong commitment to the Academy and the nation.",
  },
  {
    icon: BookOpen,
    title: "Education-Focused",
    text: "We invest in academics, facilities, and cadet development — ensuring PMA remains a world-class institution.",
  },
  {
    icon: Globe,
    title: "Nationally Recognized",
    text: "Through partnerships and community engagement, PMAFI extends its reach far beyond the walls of Fort del Pilar.",
  },
];

export default function OurStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Who We Are
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Our Story
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              The Philippine Military Academy Foundation, Inc. (PMAFI) was
              established to bridge the gap between the Academy&apos;s mission
              and the resources it needs to fulfill it. As a non-stock,
              non-profit foundation, PMAFI mobilizes private sector support,
              alumni networks, and community partnerships to advance PMA&apos;s
              institutional goals.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              From modernizing training facilities to funding scholarships and
              supporting cadet development programs, PMAFI ensures that the men
              and women of the Long Gray Line are equipped — not just with
              weapons and tactics, but with the education, values, and character
              demanded of officers who lead in service of the Filipino people.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {highlights.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A951]/40 hover:bg-white hover:shadow-[0_18px_40px_-18px_rgba(27,42,74,0.35)]"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                  <Icon size={18} />
                </div>
                <p className="mt-3 font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
