"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-800/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <span className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-300">
              Trusted Business Partner
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl"
          >
            Quality You Can Trust,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Service You&apos;ll Remember
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
          >
            Tusi Solutions offers quality products and honest service —
            backed by real people who care about getting your order right
            the first time.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/order"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-blue-600 px-8 text-white hover:bg-blue-700"
              )}
            >
              Place an Order <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              )}
            >
              Browse Products
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
