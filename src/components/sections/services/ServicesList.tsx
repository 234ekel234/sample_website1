"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BarChart3, Code2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const services = [
  {
    icon: BarChart3,
    badge: "Advisory",
    title: "Consulting & Strategy",
    description:
      "We work alongside leadership teams to diagnose challenges, uncover growth opportunities, and build actionable strategies. Our advisors bring cross-industry experience and an outside perspective that cuts through internal blind spots.",
    offerings: [
      "Business performance audits",
      "Market entry & expansion strategy",
      "Operational process improvement",
      "Financial planning & forecasting",
      "Organizational restructuring",
    ],
    accent: "bg-blue-100 text-blue-700 group-hover:bg-blue-700 group-hover:text-white",
  },
  {
    icon: Code2,
    badge: "Technology",
    title: "Digital Solutions",
    description:
      "We design, build, and deploy digital tools that modernize how your business operates. Whether it's a customer-facing product or an internal system, we deliver technology that fits your workflow — not the other way around.",
    offerings: [
      "Web & mobile application development",
      "E-commerce & online storefront setup",
      "Business software integration",
      "Workflow automation & dashboards",
      "Ongoing maintenance & support",
    ],
    accent: "bg-indigo-100 text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white",
  },
  {
    icon: Package,
    badge: "Supply Chain",
    title: "Product Supply",
    description:
      "We source, procure, and deliver quality products to businesses that need reliable supply without the overhead. From one-off orders to recurring contracts, we manage the logistics so you can focus on what you do best.",
    offerings: [
      "Product sourcing & procurement",
      "Quality inspection & assurance",
      "Inventory & stock management",
      "Last-mile delivery coordination",
      "Custom bundling & packaging",
    ],
    accent: "bg-cyan-100 text-cyan-700 group-hover:bg-cyan-700 group-hover:text-white",
  },
];

export default function ServicesList() {
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
            Core Disciplines
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Everything Under One Roof
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Three service areas, one accountable partner. No handoffs, no gaps.
          </p>
        </motion.div>

        <div className="space-y-10">
          {services.map(({ icon: Icon, badge, title, description, offerings, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-shadow hover:shadow-lg"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${accent}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <Badge variant="secondary" className="text-xs">{badge}</Badge>
                  </div>
                  <p className="mt-3 text-slate-600 leading-relaxed">{description}</p>
                  <Link
                    href="/order"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "mt-6 bg-blue-700 text-white hover:bg-blue-800"
                    )}
                  >
                    Get Started
                  </Link>
                </div>

                <div className="lg:col-span-2">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    What's included
                  </p>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {offerings.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
