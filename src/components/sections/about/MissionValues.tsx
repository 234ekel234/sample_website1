"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Star, Flag, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We uphold the same standard of honor demanded of every PMA graduate — honest, transparent, and accountable in all we do.",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "We pursue the highest standards in every program, every initiative, and every partnership we undertake on behalf of PMA.",
  },
  {
    icon: Flag,
    title: "Patriotism",
    description:
      "Our work is grounded in love of country. We support PMA because we believe strong military leadership is essential to national security and progress.",
  },
  {
    icon: Heart,
    title: "Service",
    description:
      "Like the officers we support, we are driven by a spirit of selfless service — to PMA, to cadets, and to the Filipino people.",
  },
];

export default function MissionValues() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-slate-50 py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          <div className="rounded-2xl bg-[#0a1628] p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8A951]">
              Our Mission
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">
              Strengthening PMA&apos;s Capacity to Lead
            </h3>
            <p className="mt-4 leading-relaxed text-slate-300">
              To support the Philippine Military Academy in its mission of
              developing officers of integrity, competence, and character —
              through resource mobilization, institutional development, and
              community partnerships.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-[#C8A951]/30 bg-white p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C8A951]">
              Our Vision
            </p>
            <h3 className="mt-3 text-2xl font-bold text-[#1B2A4A]">
              A World-Class Military Academy
            </h3>
            <p className="mt-4 leading-relaxed text-slate-600">
              A Philippine Military Academy fully equipped with modern
              facilities, excellent academic programs, and robust support
              systems — producing officers dedicated to God, country, and
              people.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 text-center"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            What Guides Us
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            Core Values
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              <Card className="group relative h-full overflow-hidden border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
                <CardHeader className="pb-3">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                    <Icon size={24} />
                  </div>
                  <CardTitle className="text-lg text-[#1B2A4A]">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
