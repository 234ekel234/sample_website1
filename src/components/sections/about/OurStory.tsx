"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Target, Users, Sparkles } from "lucide-react";

const highlights = [
  { icon: Heart, title: "Built on relationships", text: "Most of our orders come from word-of-mouth — and we work hard to keep it that way." },
  { icon: Target, title: "Honest pricing", text: "We tell you exactly what something costs. No hidden fees, no surprise add-ons." },
  { icon: Users, title: "Real people, real replies", text: "When you message us, a real person answers — not an automated bot or a queue ticket." },
  { icon: Sparkles, title: "Quality you can see", text: "Every order goes through our own quality check before it leaves us." },
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
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Who We Are
            </p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              Our Story
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Tusi Solutions was started with a simple idea: customers deserve
              a business that listens, communicates clearly, and delivers what
              it promises. No corporate runaround. No vague pricing. No empty
              marketing.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              We&apos;re a small team that takes pride in every order. Whether
              you&apos;re ordering one item or one hundred, you get the same
              attention to detail and the same honest service. That&apos;s the
              standard — and we don&apos;t cut corners on it.
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
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
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
