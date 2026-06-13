"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

// SCAFFOLD: the message text is placeholder pending PMAFI input (a message from
// the Chairman/President — an open item in the client follow-up email). The
// portrait reuses the Chairman's Board of Trustees photo; swap `message` once
// the real words arrive.
const message = [
  "We cannot deny that what we are today, we owe in part to the Philippine Military Academy. The Foundation exists so that the next generation of cadets inherits an Academy even stronger than the one that shaped us.",
  "Through your membership and support, PMAFI sustains the faculty, facilities, and programs that keep the PMA a true center of academic excellence and character formation. Every contribution is an investment in the leaders who will serve and defend our nation.",
];
const chairman = {
  name: "LEO ANGELO D. LEUTERIO",
  title: "Chairman, PMAFI",
  image: "/board/leuterio.png",
};

export default function ChairmansMessage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16">
          {/* Portrait (placeholder) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[320px]"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-[#16294d] to-[#0a1628] shadow-lg">
              {/* Chairman portrait (reused from the Board of Trustees page) */}
              <div className="relative aspect-[4/5]">
                <Image
                  src={chairman.image}
                  alt={chairman.name}
                  fill
                  className="object-cover object-top"
                  sizes="360px"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-transparent p-6 pt-16">
                <p className="text-sm font-bold text-white">{chairman.name}</p>
                <p className="text-xs font-medium uppercase tracking-widest text-[#C8A951]">
                  {chairman.title}
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
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              From Our Leadership
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Message from the Chairman
            </h2>
            <div className="mt-6 space-y-4">
              {message.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-slate-600">
                  {para}
                </p>
              ))}
            </div>
            <div className="mt-8 border-l-2 border-[#C8A951] pl-5">
              <p className="font-bold text-[#1B2A4A]">{chairman.name}</p>
              <p className="text-sm text-slate-500">{chairman.title}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
