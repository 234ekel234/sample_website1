"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Wrench, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    icon: Zap,
    label: "Quick Wins",
    effort: "1–3 days each",
    color: "bg-green-100 text-green-700",
    cardColor: "border-green-100 bg-green-50/40",
    items: [
      "Real branding — company name, logo, brand colors",
      "Real photography — replace gradients with product/team photos",
      "Social media links — Facebook, Instagram, TikTok",
      "Replace placeholder stats with real numbers",
      "FAQ section to reduce repetitive questions",
      "Customer testimonials section",
      "Link preview image for Messenger/Facebook shares",
      "Google Analytics to track visitors",
    ],
  },
  {
    icon: Wrench,
    label: "Medium Features",
    effort: "1–2 weeks each",
    color: "bg-blue-100 text-blue-700",
    cardColor: "border-blue-100 bg-blue-50/40",
    items: [
      "Product catalog with images and variants",
      "Image gallery / portfolio section",
      "Blog or news section (good for SEO)",
      "Newsletter signup (Mailchimp / Brevo)",
      "Live chat — Messenger or WhatsApp button",
      "Tagalog / English language toggle",
      "Native order form (replaces Google Form embed)",
    ],
  },
  {
    icon: Building2,
    label: "Larger Features",
    effort: "3–6 weeks each",
    color: "bg-purple-100 text-purple-700",
    cardColor: "border-purple-100 bg-purple-50/40",
    items: [
      "Online payments — GCash, PayMaya, card (via PayMongo/Xendit)",
      "Customer accounts — login, order history",
      "Internal order management dashboard",
      "Booking / appointment calendar",
      "Full e-commerce checkout with cart and shipping",
    ],
  },
];

export default function AddOns() {
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
            What Could Come Next
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Suggested Add-Ons
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Features you may want to add, grouped by how much work each takes.
            Pick and choose based on priorities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map(({ icon: Icon, label, effort, color, cardColor, items }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`flex flex-col rounded-2xl border p-7 ${cardColor}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{label}</h3>
                  <Badge variant="secondary" className="mt-0.5 text-xs">{effort}</Badge>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span className="text-sm leading-relaxed text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
