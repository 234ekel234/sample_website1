"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CalendarClock, FileEdit, ShieldAlert, Database, MessageCircle, Wrench } from "lucide-react";

const cadences = [
  {
    icon: MessageCircle,
    cadence: "As needed",
    title: "Content updates",
    description: "Board changes, new programs, event news, fixing typos, swapping photos. Same-day turnaround for small changes.",
  },
  {
    icon: ShieldAlert,
    cadence: "Monthly",
    title: "Security patches",
    description: "Apply security updates to Next.js, Tailwind, and other dependencies. Vercel handles infrastructure patches automatically.",
  },
  {
    icon: Wrench,
    cadence: "Quarterly",
    title: "Dependency upgrades",
    description: "Bump library versions to keep the site fast and compatible with modern browsers.",
  },
  {
    icon: FileEdit,
    cadence: "Quarterly",
    title: "Content review",
    description: "Walk through all pages, check that prices and policies still match reality, refresh anything that's gone stale.",
  },
  {
    icon: Database,
    cadence: "Quarterly",
    title: "Backup verification",
    description: "Confirm the site code is in GitHub, the members Google Sheet has a backup copy, and we can restore quickly if needed.",
  },
  {
    icon: CalendarClock,
    cadence: "Annually",
    title: "Domain renewal",
    description: "If a custom domain is used, verify it auto-renewed. Review whether the website still meets the Foundation's needs.",
  },
];

const responsibilities = [
  { who: "Developer", does: "Code, deployments, security updates, technical issues, new features" },
  { who: "PMAFI / content owner", does: "Membership approvals, marking members Active, content, member responses" },
  { who: "Vercel (hosting)", does: "Infrastructure uptime, SSL certificates, CDN, automatic scaling" },
  { who: "Domain registrar", does: "Domain registration, DNS management, renewal reminders" },
];

export default function Maintenance() {
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
          <p className="text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            After Launch
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Maintenance &amp; Support
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            What stays running automatically, what needs occasional attention,
            and who handles which part.
          </p>
        </motion.div>

        {/* Cadence cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cadences.map(({ icon: Icon, cadence, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A]">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    {cadence}
                  </span>
                  <h3 className="mt-2 font-semibold text-slate-900">{title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
            </motion.div>
          ))}
        </div>

        {/* Responsibilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="bg-slate-900 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">
              Who Does What
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {responsibilities.map(({ who, does }) => (
              <div key={who} className="grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-3 sm:items-center sm:gap-6">
                <p className="font-semibold text-slate-900">{who}</p>
                <p className="text-sm text-slate-600 sm:col-span-2">{does}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
