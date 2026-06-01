"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, Calculator, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Fill Out the Form",
    description:
      "Tell us the product number, colors, sizes, and quantities you need — along with your contact details.",
  },
  {
    icon: Calculator,
    step: "02",
    title: "We Send You a Total",
    description:
      "We'll review your order and get back to you with a confirmed price breakdown via your preferred contact method.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Make Your Payment",
    description:
      "Once you're happy with the total, go ahead and complete your payment through our accepted channels.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Send Us Your Receipt",
    description:
      "Forward your payment receipt to us and we'll confirm your order and get it moving right away.",
  },
];

export default function OrderSteps() {
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
            How It Works
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Four Simple Steps
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            No complicated checkout. Just tell us what you need and we&apos;ll
            handle the rest.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-slate-200 md:block" />

          {steps.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
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
