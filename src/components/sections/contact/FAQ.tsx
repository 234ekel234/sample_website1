"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How can I support PMAFI?",
    a: "There are several ways to get involved: make a one-time or recurring donation, become a member of the Foundation, sponsor a specific program, or take part in our fundraising drives and events. Reach out and we'll help you find the option that fits you best.",
  },
  {
    q: "Where does my donation go?",
    a: "Contributions are channeled into our four core program areas — facilities and modernization, academic excellence and scholarships, leadership and character formation, and alumni and community partnerships. Every peso goes toward strengthening PMA and the cadets it produces.",
  },
  {
    q: "How do I make a donation?",
    a: "Message us by email or phone and we'll share the Foundation's official bank transfer and e-wallet details. Once your gift is received, we issue an acknowledgment and an official receipt for your records.",
  },
  {
    q: "Are donations to PMAFI tax-deductible?",
    a: "PMAFI is a registered non-stock, non-profit foundation and provides official receipts for every contribution. For questions on deductibility, we recommend consulting your accountant or tax advisor regarding your specific situation.",
  },
  {
    q: "Do I need to be a PMA graduate to get involved?",
    a: "Not at all. While many of our members and trustees are PMA alumni, support is open to families, civic organizations, corporate partners, and any Filipino who believes in developing principled military leaders for the nation.",
  },
  {
    q: "Can my company or organization partner with PMAFI?",
    a: "Yes. We welcome corporate and civic partnerships — from program sponsorships and endowments to cadet mentorship and internship opportunities. Get in touch and we'll explore how a partnership can align with your advocacy.",
  },
  {
    q: "How will I know my contribution made a difference?",
    a: "We keep our supporters informed on how funds are put to work and the impact they create across PMA. Tell us you'd like updates and we'll make sure you hear about the programs and milestones your support helps make possible.",
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-[#C8A951]"
      >
        <span className="font-medium text-slate-900">{q}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
            open ? "bg-[#1B2A4A] text-[#C8A951]" : "bg-slate-100 text-slate-600"
          }`}
        >
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-slate-600">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-24" ref={ref}>
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Common Questions
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            Frequently Asked
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            The quick answers to the questions we hear most often. Don&apos;t
            see yours? Just message us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white px-6 shadow-sm sm:px-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.q}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
