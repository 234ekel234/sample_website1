"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { HandCoins, BookOpen, Landmark, Users, ArrowRight } from "lucide-react";

// Giving options. The professorial chair (₱250k) and endowment (₱100k) minimums
// come from the PMAFI brochure; confirm current figures with PMAFI before launch.
const ways = [
  {
    icon: HandCoins,
    title: "General Donation",
    amount: "Any amount",
    description:
      "An unrestricted gift that PMAFI directs where it's needed most — faculty development, facilities, scholarships, and cadet programs.",
  },
  {
    icon: BookOpen,
    title: "Professorial Chair Fund",
    amount: "From ₱250,000",
    description:
      "Establish a chair in your name or your class's honor. The principal is preserved — only the earnings fund the grant, so your gift gives in perpetuity.",
  },
  {
    icon: Landmark,
    title: "Endowment Fund",
    amount: "From ₱100,000",
    description:
      "Create a lasting endowment whose principal is never spent. The annual earnings sustain PMA programs and academic excellence year after year.",
  },
  {
    icon: Users,
    title: "Become a Member",
    amount: "Join the mission",
    description:
      "Membership is its own form of support — and connects you to the alumni community sustaining the Academy.",
    href: "/membership",
    cta: "Apply for membership",
  },
];

export default function WaysToGive() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="ways-to-give" className="scroll-mt-24 bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Ways to Give
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            Choose How You&apos;d Like to Help
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Whether a one-time gift or a lasting endowment, every contribution
            advances the mission of the Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ways.map(({ icon: Icon, title, amount, description, href, cta }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]"
            >
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1B2A4A]">{title}</h3>
                  <p className="text-sm font-semibold text-gold-ink">{amount}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-500">
                {description}
              </p>
              {href && (
                <Link
                  href={href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B2A4A] transition-colors hover:text-[#C8A951]"
                >
                  {cta}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
