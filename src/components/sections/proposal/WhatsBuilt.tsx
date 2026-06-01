"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Home,
  Info,
  Target,
  Users,
  BadgeCheck,
  Mail,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const pages = [
  { icon: Home, name: "Home", href: "/", desc: "Hero, foundation stats, mission and calls to action" },
  { icon: Info, name: "About", href: "/about", desc: "PMAFI story, mission, and core values" },
  { icon: Target, name: "Programs", href: "/programs", desc: "Professorial chairs, endowment & development funds" },
  { icon: Users, name: "Board of Trustees", href: "/board", desc: "The 2025–2026 Board, with roles and credentials" },
  { icon: BadgeCheck, name: "Membership", href: "/membership", desc: "Apply online + private status check (see below)" },
  { icon: Mail, name: "Contact", href: "/contact", desc: "Official contact details, click-to-call, FAQ" },
];

const features = [
  "Fully responsive — desktop, tablet, and mobile",
  "Private member status check (Active / Pending / Lapsed)",
  "Online membership application via Google Form",
  "Auto-tracks new applicants as “Pending Payment”",
  "Privacy by design — the roster never reaches the browser",
  "SEO metadata, smooth animations, modern UI",
  "Secure secrets, version-controlled in Git",
  "Free hosting on Vercel — essentially $0/month",
];

export default function WhatsBuilt() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Already Done
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            What&apos;s Already Built
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            A complete, live website — six pages plus a full membership system
            that lets people apply and check their status online.
          </p>
        </motion.div>

        {/* Pages grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map(({ icon: Icon, name, href, desc }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={href}
                className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{name}</h3>
                    <ExternalLink size={14} className="text-slate-400 transition-colors group-hover:text-blue-600" />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Membership system spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BadgeCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Flagship Feature
              </p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                Self-service membership system
              </h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-slate-600">
                Backed by a private Google Sheet — no paid database or service.
                Members apply online, and the moment they submit they&apos;re
                tracked as <span className="font-semibold text-slate-900">Pending Payment</span>.
                Anyone can privately check their own status by email — and only
                ever sees their own record.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "Apply online via the PMAFI form",
                  "Instant “Pending Payment” confirmation",
                  "Private status check: Active / Pending / Lapsed",
                  "Full roster stays private — never sent to the browser",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-sm text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Built-in features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-8"
        >
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Built-in Features
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-sm text-slate-700">{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
