"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Search, MapPin, Rocket, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Discovery",
    description:
      "We start by listening. Through a structured intake and discovery session, we map your goals, constraints, and the landscape you're operating in.",
  },
  {
    icon: MapPin,
    step: "02",
    title: "Strategy",
    description:
      "We develop a clear plan with defined deliverables, timelines, and success metrics — tailored to your specific situation, not a template.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Execution",
    description:
      "Our team gets to work. You stay informed through regular check-ins and a shared view of progress without micromanagement.",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "Review & Grow",
    description:
      "We measure results against the plan, share honest findings, and identify what's next — because good work compounds over time.",
  },
];

export default function HowItWorks() {
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
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Our Process
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            A straightforward process designed to get you from problem to
            outcome with as little friction as possible.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-slate-200 md:block" />

          {steps.map(({ icon: Icon, step, title, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-blue-100 bg-white shadow-sm">
                <Icon size={28} className="text-blue-600" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
