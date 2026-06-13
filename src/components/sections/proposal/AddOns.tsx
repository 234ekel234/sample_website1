"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Wrench, Building2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    icon: Zap,
    label: "Quick Wins",
    effort: "1–3 days each",
    color: "bg-green-100 text-green-700",
    cardColor: "border-green-100 bg-green-50/40",
    items: [
      "Official PMAFI logo/seal + high-res trustee photos",
      "Official social media links (Facebook, etc.)",
      "Real donation channels on the Donate page (bank / GCash)",
      "Link preview image for Facebook/Messenger shares",
      "Google Analytics to see visitor traffic",
      "Transparency page — financial reports & board resolutions",
    ],
  },
  {
    icon: Wrench,
    label: "Medium Features",
    effort: "1–2 weeks each",
    color: "bg-[#1B2A4A]/10 text-[#1B2A4A]",
    cardColor: "border-[#C8A951]/20 bg-[#C8A951]/[0.06]",
    items: [
      "Self-service content editing — update News & messages via a Google Sheet or a simple editor",
      "Automated invoice & receipt emails",
      "Newsletter signup for supporters",
      "Tagalog / English language toggle",
    ],
  },
  {
    icon: Building2,
    label: "Larger Features",
    effort: "3–6 weeks each",
    color: "bg-purple-100 text-purple-700",
    cardColor: "border-purple-100 bg-purple-50/40",
    items: [
      "Online dues & donation payments — GCash, Maya, card (via PayMongo)",
      "Automatic receipts for every online payment",
      "Member management dashboard for PMAFI staff",
      "Members-only area — login + member resources",
      "Custom domain + PMAFI email addresses",
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
          <p className="text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
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

        {/* Recommended starting point */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex items-start gap-4 rounded-2xl border border-[#C8A951]/30 bg-[#C8A951]/[0.08] p-7"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C8A951] text-[#1B2A4A]">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#1B2A4A]">
              Where this delivers the most value next
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              If the Foundation pursues a second phase, the highest-impact step is{" "}
              <span className="font-semibold text-[#1B2A4A]">online payments</span>{" "}
              (dues &amp; donations) paired with a{" "}
              <span className="font-semibold text-[#1B2A4A]">staff dashboard</span> —
              together they complete the apply → pay → active flow end to end, with
              automatic receipts and no manual record-keeping. Everything else can
              follow whenever it suits PMAFI&apos;s priorities and budget.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
