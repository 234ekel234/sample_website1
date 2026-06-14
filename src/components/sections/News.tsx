"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, ArrowRight } from "lucide-react";

// SCAFFOLD: these are sample announcements so the layout is reviewable. Replace
// with real PMAFI news/events (and wire "Read more" to article pages or posts)
// once content is provided. Until then the cards are non-linking.
const posts = [
  {
    date: "Upcoming",
    category: "Events",
    title: "Annual General Membership Meeting",
    excerpt:
      "Members gather for the yearly assembly — Foundation updates, the Board report, and fellowship among PMA alumni and supporters.",
  },
  {
    date: "Upcoming",
    category: "Programs",
    title: "Professorial Chair & Endowment Awarding",
    excerpt:
      "Recognizing donors and grantees of professorial chairs and endowment funds that sustain teaching excellence at the Academy.",
  },
  {
    date: "Upcoming",
    category: "Community",
    title: "Class Reunion & Homecoming Support",
    excerpt:
      "PMAFI partners with alumni classes on reunion activities that give back to the Corps and the cadets following in their footsteps.",
  },
];

export default function News() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-slate-50 py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Latest Updates
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            News &amp; Announcements
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Events, programs, and milestones from the Foundation and the
            Academy community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map(({ date, category, title, excerpt }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]"
            >
              {/* Placeholder cover band (swap for a real event photo) */}
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#16294d] to-[#0a1628]">
                <Calendar size={36} className="text-white/15" />
                <span className="absolute left-4 top-4 rounded-full bg-[#C8A951] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#1B2A4A]">
                  {category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400">
                  <Calendar size={13} />
                  {date}
                </div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-[#1B2A4A]">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                  {excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C8A951]">
                  Read more
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
