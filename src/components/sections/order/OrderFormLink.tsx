"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Package, Palette, Ruler, User, Phone, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd0lp-bbZ0zoAnLLby4p2Keo6H9XWftNuTOSY23pMbh41zTNQ/viewform";

const fields = [
  { icon: Package, label: "Product number & item description" },
  { icon: Palette, label: "Color selections (up to 4)" },
  { icon: Ruler, label: "Size and quantity per color" },
  { icon: User, label: "Your name" },
  { icon: Phone, label: "Phone number" },
  { icon: Mail, label: "Email and preferred contact method" },
];

export default function OrderFormLink() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-24" ref={ref}>
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl"
        >
          {/* Card header */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Step 1
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Fill Out the Order Form
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-blue-100">
              The form takes about 2 minutes. Have your product number, colors,
              and sizes ready before you start.
            </p>
          </div>

          {/* What you'll need */}
          <div className="px-8 py-10">
            <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
              What the form asks for
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fields.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={15} />
                  </div>
                  <span className="text-sm text-slate-600">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-blue-700 px-10 text-white hover:bg-blue-800"
                )}
              >
                Open Order Form <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"
                )}
              >
                Questions first? Contact us
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              After submitting, we&apos;ll reach out via your chosen contact method
              with your order total — usually within 24 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
