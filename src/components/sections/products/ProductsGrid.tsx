"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

const products = [
  {
    name: "Starter Pack",
    price: "₱2,500",
    period: "one-time",
    tag: "Entry Level",
    color: "from-blue-400 to-blue-600",
    description: "Everything a small team needs to get off the ground quickly and confidently.",
    features: [
      "Initial business assessment",
      "1 consulting session (2 hrs)",
      "Basic digital setup",
      "Email support for 30 days",
    ],
    cta: "Order Starter Pack",
    featured: false,
  },
  {
    name: "Professional Bundle",
    price: "₱7,500",
    period: "one-time",
    tag: "Most Popular",
    color: "from-indigo-500 to-blue-700",
    description: "A comprehensive package built for growing businesses that need more depth and reach.",
    features: [
      "Full business audit & roadmap",
      "4 consulting sessions (2 hrs each)",
      "Custom digital solution build",
      "Product sourcing assistance",
      "Priority support for 60 days",
    ],
    cta: "Order Pro Bundle",
    featured: true,
  },
  {
    name: "Enterprise Suite",
    price: "₱15,000",
    period: "one-time",
    tag: "Full Feature",
    color: "from-slate-600 to-slate-800",
    description: "Full-featured engagement for large operations that demand a dedicated partner.",
    features: [
      "360° operational assessment",
      "Unlimited consulting sessions",
      "End-to-end digital delivery",
      "Managed product supply chain",
      "Dedicated account manager",
      "Priority support for 90 days",
    ],
    cta: "Order Enterprise Suite",
    featured: false,
  },
  {
    name: "Custom Package",
    price: "Request Quote",
    period: "tailored",
    tag: "Tailored",
    color: "from-blue-800 to-slate-900",
    description: "Built entirely around your business. We scope, price, and deliver exactly what you need.",
    features: [
      "Scoping workshop included",
      "Flexible mix of all services",
      "Custom timeline & milestones",
      "Pricing matched to scope",
    ],
    cta: "Request a Quote",
    featured: false,
  },
];

export default function ProductsGrid() {
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
            Packages & Pricing
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            No hidden fees, no surprises. Pick a package or talk to us about a
            custom scope.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {products.map(({ name, price, period, tag, color, description, features, cta, featured }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex"
            >
              <Card
                className={cn(
                  "relative flex w-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl",
                  featured && "ring-2 ring-blue-600"
                )}
              >
                {featured && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                )}

                <div className={`h-28 bg-gradient-to-br ${color}`} />

                <CardHeader className="pb-2 pt-5">
                  <Badge variant="secondary" className="mb-1 w-fit text-xs">
                    {tag}
                  </Badge>
                  <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                  <p className="text-sm text-slate-500">{description}</p>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-blue-700">{price}</span>
                    {period !== "tailored" && (
                      <span className="ml-1 text-sm text-slate-400">{period}</span>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={15} className="mt-0.5 shrink-0 text-blue-500" />
                        <span className="text-sm text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Link
                    href="/order"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-full",
                      featured
                        ? "bg-blue-700 text-white hover:bg-blue-800"
                        : "bg-slate-900 text-white hover:bg-blue-700"
                    )}
                  >
                    {cta}
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
