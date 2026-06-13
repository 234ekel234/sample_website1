"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Image as ImageIcon, FileEdit, Globe, Rocket, BarChart2, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { icon: ImageIcon, title: "Send official assets", note: "Official PMAFI logo/seal and high-resolution trustee photos." },
  { icon: FileEdit, title: "Confirm membership dues & payment", note: "Dues per category, who invoices, and payment channels — completes the apply → pay → active flow." },
  { icon: Rocket, title: "Finish the auto-add setup", note: "Install the form's “Pending Payment” trigger (one-time, ~3 minutes)." },
  { icon: Globe, title: "Connect a custom domain (optional)", note: "Point pmafi.org (or similar) at the site. ~30 min, ~$10/year at-cost (Cloudflare)." },
  { icon: BarChart2, title: "Add Google Analytics", note: "Start tracking visitors and which pages get the most attention." },
  { icon: Plus, title: "Tidy up", note: "Remove the unused Services/Products/Order pages and fix the old page titles." },
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
          <p className="text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            To Finish &amp; Polish
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#C8A951]/20 bg-white text-[#1B2A4A]">
                  <Icon size={20} />
                </div>
                {i < steps.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-[#1B2A4A]/10" />
                )}
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#1B2A4A]">
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
            Essentially no operating cost, fully owned by PMAFI (no vendor
            lock-in), and built to grow with the Foundation. Already working
            end-to-end — members apply online and flow into the roster as
            “Pending Payment” automatically.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#1B2A4A] px-8 text-white hover:bg-[#16294d]"
              )}
            >
              Browse the live site
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-slate-300 text-slate-700 hover:border-[#1B2A4A] hover:text-[#1B2A4A]"
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
