"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Head to our Order page and fill out the order form. We'll review your order and get back to you within 24 hours with a confirmed total via your preferred contact method.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept GCash, PayMaya, Bank Transfer, and Cash on Delivery for orders within our service area. Once you place an order, we'll share the payment details for your chosen method.",
  },
  {
    q: "How long until I receive my order?",
    a: "Turnaround time depends on the product and quantity. We'll give you a clear estimated date together with your order confirmation — no vague \"soon\" promises.",
  },
  {
    q: "Do you ship outside Metro Manila?",
    a: "Yes! We ship nationwide via partner couriers. Shipping fees vary by location and are calculated when we send your order total.",
  },
  {
    q: "Can I customize my order?",
    a: "In most cases, yes. Mention what you need in the \"Questions and comments\" field on the order form, and we'll let you know what's possible.",
  },
  {
    q: "What if I'm not happy with my order?",
    a: "Message us right away. We stand behind every order — if something isn't right, we'll work with you to make it right.",
  },
  {
    q: "What are your business hours?",
    a: "We respond to messages and calls during regular business hours. For calls or texts outside those hours, please send a message and we'll get back to you the next business day.",
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-blue-700"
      >
        <span className="font-medium text-slate-900">{q}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
            open ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
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
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Common Questions
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
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
