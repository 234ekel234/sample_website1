"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Users, BookOpen, Award } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    label: "PMA Heritage",
    note: "Supporting the Philippine Military Academy's century-long mission of excellence",
  },
  {
    icon: Users,
    label: "Alumni Network",
    note: "A nationwide community of PMA graduates and dedicated supporters",
  },
  {
    icon: BookOpen,
    label: "Academic Excellence",
    note: "Advancing cadet education, research, and institutional development",
  },
  {
    icon: Award,
    label: "Leadership Formation",
    note: "Building officers of integrity, courage, and principled national service",
  },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative border-b border-slate-100 bg-white py-20" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, label, note }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A951]/40 hover:shadow-[0_18px_40px_-18px_rgba(27,42,74,0.35)]"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1B2A4A]/[0.07] text-[#1B2A4A] transition-colors duration-300 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                <Icon size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">{label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
