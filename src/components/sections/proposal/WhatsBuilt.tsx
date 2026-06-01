"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Home,
  Info,
  Briefcase,
  Package,
  Mail,
  ShoppingCart,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const pages = [
  { icon: Home, name: "Home", href: "/", desc: "Hero, stats, services, products, payment methods" },
  { icon: Info, name: "About", href: "/about", desc: "Company story, milestones, mission & values" },
  { icon: Briefcase, name: "Services", href: "/services", desc: "Service categories with offerings and process" },
  { icon: Package, name: "Products", href: "/products", desc: "Product packages with pricing and guarantees" },
  { icon: Mail, name: "Contact", href: "/contact", desc: "Direct email/phone, click-to-call links" },
  { icon: ShoppingCart, name: "Order", href: "/order", desc: "4-step walkthrough into the Google Form" },
];

const features = [
  "Fully responsive — desktop, tablet, and mobile",
  "Smooth scroll animations and modern UI",
  "SEO metadata on every page",
  "Click-to-call and click-to-email links",
  "Google Form integration for order intake",
  "Reusable design system — easy to rebrand",
  "Fast page loads (built with Next.js)",
  "Free hosting on Vercel",
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
            A complete, ready-to-launch website with six pages and everything
            needed for customers to find and order from us.
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
