"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Lightbulb, Handshake, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We say what we mean and do what we say. Honest advice — even when it's not what you want to hear — is the foundation of every engagement.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We stay ahead of the curve so our clients don't have to. Continuous learning shapes how we approach every problem.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We treat your goals as our own. Every client relationship is a long-term investment, not a transaction.",
  },
  {
    icon: TrendingUp,
    title: "Excellence",
    description:
      "Good enough never is. We hold ourselves to high standards in everything from strategy decks to product delivery.",
  },
];

export default function MissionValues() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-slate-50 py-24" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            What Guides Us
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Mission & Values
          </h2>
          <p className="mx-auto mt-4 text-lg text-slate-500">
            Our mission is to help businesses of every size operate smarter,
            scale faster, and grow stronger — guided by values we refuse to
            compromise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group h-full border-slate-200 transition-shadow hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                  <CardTitle className="text-lg text-slate-900">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
