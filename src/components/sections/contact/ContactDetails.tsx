"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, Clock, MessageSquare } from "lucide-react";

// INTERIM CONTACTS: email points to the Foundation's working inbox so messages
// actually arrive. Swap to the official address/number once PMAFI confirms them.
const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "pmafi.web@gmail.com",
    description: "Best for donation inquiries, partnerships, and membership details.",
    href: "mailto:pmafi.web@gmail.com",
  },
  // Phone number hidden until PMAFI confirms the official number.
  // {
  //   icon: Phone,
  //   label: "Phone / SMS",
  //   value: "(074) 000 0000",
  //   description: "Call or text to speak with the Foundation team directly.",
  //   href: "tel:+63740000000",
  // },
];

const expectations = [
  {
    icon: Clock,
    title: "Response within 24 hours",
    description: "We acknowledge every message by the next business day.",
  },
  {
    icon: MessageSquare,
    title: "No pressure to commit",
    description: "Ask anything about our work. We'll give you a clear, honest answer.",
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
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              Reach Us Directly
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              Contact Information
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Choose the channel that works best for you. Either way, you&apos;re
              talking directly with the Foundation team.
            </p>

            <div className="mt-10 space-y-6">
              {channels.map(({ icon: Icon, label, value, description, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A951]/40 hover:bg-white hover:shadow-[0_18px_40px_-18px_rgba(27,42,74,0.35)]"
                >
                  <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {label}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900 group-hover:text-[#1B2A4A]">
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
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
              <span className="h-px w-8 bg-[#C8A951]/50" />
              What to Expect
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
              We Keep It Simple
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Reaching out doesn&apos;t commit you to anything. We start with a
              conversation to understand how you&apos;d like to support PMAFI and
              the mission of the Academy.
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A]">
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
              className="mt-10 rounded-2xl border border-[#C8A951]/30 bg-[#C8A951]/[0.08] p-6"
            >
              <p className="text-sm font-semibold text-[#1B2A4A]">
                Planning a major gift or partnership?
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Email us at{" "}
                <a
                  href="mailto:pmafi.web@gmail.com"
                  className="font-medium text-[#1B2A4A] underline decoration-[#C8A951]/50 underline-offset-2 transition-colors hover:text-[#C8A951]"
                >
                  pmafi.web@gmail.com
                </a>{" "}
                with the details, and we&apos;ll come back to you with a clear
                next step on how to get involved.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
