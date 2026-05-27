"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, Clock, MessageSquare } from "lucide-react";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "tusi.ekel@gmail.com",
    description: "Best for detailed enquiries and project briefs.",
    href: "mailto:tusi.ekel@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone / SMS",
    value: "0935 733 0435",
    description: "Call or text outside business hours only.",
    href: "tel:+639357330435",
  },
];

const expectations = [
  {
    icon: Clock,
    title: "Response within 24 hours",
    description: "We acknowledge every message by the next business day.",
  },
  {
    icon: MessageSquare,
    title: "No sales pressure",
    description: "Tell us what you need. We'll tell you honestly if we can help.",
  },
];

export default function ContactDetails() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">

          {/* Contact channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Reach Us Directly
            </p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              Contact Information
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Choose the channel that works best for you. Either way, you&apos;re
              talking to the same team.
            </p>

            <div className="mt-10 space-y-6">
              {channels.map(({ icon: Icon, label, value, description, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="group flex items-start gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {label}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* What to expect */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              What to Expect
            </p>
            <h2 className="mt-2 text-4xl font-bold text-slate-900">
              We Keep It Simple
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Reaching out doesn&apos;t lock you in to anything. We start with a
              conversation to understand what you need and whether we&apos;re the
              right fit.
            </p>

            <div className="mt-10 space-y-6">
              {expectations.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
                  className="flex items-start gap-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6"
            >
              <p className="text-sm font-semibold text-blue-700">
                Prefer to send a detailed brief?
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Email us at{" "}
                <a
                  href="mailto:tusi.ekel@gmail.com"
                  className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900"
                >
                  tusi.ekel@gmail.com
                </a>{" "}
                with your project details and we&apos;ll come back to you with a
                clear next step.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
