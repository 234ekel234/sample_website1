"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Image as ImageIcon, FileEdit, Globe, Rocket, BarChart2, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { icon: ImageIcon, title: "Provide brand assets", note: "Real company name, logo, colors, and sample photos." },
  { icon: FileEdit, title: "Swap placeholder content", note: "Update story, stats, services, and product info with real copy." },
  { icon: Globe, title: "Buy and connect a domain", note: "About 30 minutes of setup. Around ₱600 for a .com." },
  { icon: Rocket, title: "Go live", note: "Site can be deployed for free immediately after content is in." },
  { icon: BarChart2, title: "Set up Google Analytics", note: "Start tracking visitors and which pages convert best." },
  { icon: Plus, title: "Layer in add-ons", note: "Add 1–2 high-impact features from the Quick Wins list." },
];

export default function NextSteps() {
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
            If We Greenlight This
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Recommended First Steps
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            A practical order of work to get the site fully launched and useful.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {steps.map(({ icon: Icon, title, note }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-blue-100 bg-white text-blue-600">
                  <Icon size={20} />
                </div>
                {i < steps.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-blue-100" />
                )}
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing pitch */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-16 max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"
        >
          <h3 className="text-2xl font-bold text-slate-900">
            Why this approach is worth it
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Low operating cost, fully owned by the company (no vendor lock-in),
            and built to scale as the business grows. Already working
            end-to-end — orders flow into a Google Sheet automatically.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-blue-700 px-8 text-white hover:bg-blue-800"
              )}
            >
              Browse the live site
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"
              )}
            >
              Discuss next steps
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
