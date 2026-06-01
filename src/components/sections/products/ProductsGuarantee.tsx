"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Clock, HeadphonesIcon, RefreshCw } from "lucide-react";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "Every deliverable goes through our internal review before it reaches you. If it's not right, we fix it.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We set realistic timelines and stick to them. You'll always know where things stand.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Every package includes a support window with a real person on the other end — no bots.",
  },
  {
    icon: RefreshCw,
    title: "Revision Policy",
    description: "Not satisfied? We include revision rounds in every package because getting it right matters more than getting it done.",
  },
];

export default function ProductsGuarantee() {
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
            Our Promise
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Every Package, Backed by Us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            The price you see reflects real commitments — not just deliverables
            on paper.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Icon size={26} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
