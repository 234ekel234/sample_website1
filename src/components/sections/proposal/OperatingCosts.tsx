"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Server, Globe, FileText, Mail } from "lucide-react";

const costs = [
  {
    icon: Server,
    name: "Hosting (Vercel)",
    price: "Free",
    note: "Free tier handles typical small business traffic. Upgrade only if needed.",
    highlight: true,
  },
  {
    icon: Globe,
    name: "Domain Name",
    price: "~₱550 – ₱900 / year",
    note: "Two options compared in the next section. .ph domain (~₱2,500/yr) available separately if needed.",
  },
  {
    icon: FileText,
    name: "Google Forms",
    price: "Free",
    note: "Unlimited responses, syncs to a Google Sheet for order tracking.",
    highlight: true,
  },
  {
    icon: Mail,
    name: "Custom Email",
    price: "Free / ₱180 mo",
    note: "Free via Zoho Mail. ~₱180/user/month if Google Workspace is preferred.",
  },
];

export default function OperatingCosts() {
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
            What It Costs to Run
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Operating Costs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Real ongoing costs to keep the site live. The minimum to launch is
            just a domain name.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {costs.map(({ icon: Icon, name, price, note, highlight }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">{name}</h3>
                  <span className={`text-lg font-bold ${highlight ? "text-blue-600" : "text-slate-900"}`}>
                    {price}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-10 text-center text-white"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
            Minimum to Launch
          </p>
          <p className="mt-2 text-5xl font-extrabold">~₱600 / year</p>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            For comparison, website builders like Wix or Squarespace typically
            charge <span className="font-semibold text-white">₱2,000+/month</span> — over <span className="font-semibold text-white">₱24,000/year</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
