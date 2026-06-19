"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building2, GraduationCap, Star, Handshake } from "lucide-react";
import Link from "next/link";

const programs = [
  {
    icon: Building2,
    title: "Facilities & Modernization",
    badge: "Infrastructure",
    description:
      "Upgrading PMA's classrooms, training facilities, and equipment to meet the demands of modern military education.",
  },
  {
    icon: GraduationCap,
    title: "Academic Excellence & Endowment",
    badge: "Education",
    description:
      "Strengthening the quality of PMA education through scholarships, faculty development, and curriculum support.",
  },
  {
    icon: Star,
    title: "Leadership Formation",
    badge: "Character",
    description:
      "Programs focused on discipline, ethics, and character development — building officers dedicated to God, country, and people.",
  },
  {
    icon: Handshake,
    title: "Partnerships & Alumni Engagement",
    badge: "Community",
    description:
      "Sustaining a strong alumni network and building partnerships that support cadets and the PMA mission nationwide.",
  },
];

export default function Programs() {
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
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            What We Do
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            Our Key Programs
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            PMAFI channels support into four strategic areas that strengthen
            the Philippine Military Academy and the cadets it produces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {programs.map(({ icon: Icon, title, badge, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group relative h-full overflow-hidden border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]">
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#C8A951] to-[#F0D080] transition-transform duration-300 group-hover:scale-x-100" />
                <CardHeader className="pb-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1B2A4A] group-hover:text-[#C8A951]">
                    <Icon size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base text-slate-900">
                      {title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="w-fit text-xs bg-[#C8A951]/15 text-[#7A5C1A] border-0"
                    >
                      {badge}
                    </Badge>
                  </div>
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-12 text-center"
        >
          <Link
            href="/programs"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-[#1B2A4A]/30 text-[#1B2A4A] hover:border-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
            )}
          >
            View All Programs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
