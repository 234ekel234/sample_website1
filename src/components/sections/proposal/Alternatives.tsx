"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X, Code2 } from "lucide-react";

type Row = {
  label: string;
  ours: { value: string; good: boolean };
  wix: { value: string; good: boolean | null };
  squarespace: { value: string; good: boolean | null };
  shopify: { value: string; good: boolean | null };
  agency: { value: string; good: boolean | null };
};

const rows: Row[] = [
  {
    label: "Setup cost",
    ours: { value: "Done", good: true },
    wix: { value: "Free", good: true },
    squarespace: { value: "Free trial", good: true },
    shopify: { value: "Free trial", good: true },
    agency: { value: "₱150k – ₱400k", good: false },
  },
  {
    label: "Monthly cost",
    ours: { value: "Free", good: true },
    wix: { value: "₱900 – ₱2,500", good: false },
    squarespace: { value: "₱1,000 – ₱2,800", good: false },
    shopify: { value: "₱1,800 – ₱4,500", good: false },
    agency: { value: "Varies", good: null },
  },
  {
    label: "Yearly total (yr 1)",
    ours: { value: "~₱600", good: true },
    wix: { value: "~₱14k – ₱30k", good: false },
    squarespace: { value: "~₱16k – ₱34k", good: false },
    shopify: { value: "~₱25k – ₱54k", good: false },
    agency: { value: "₱150k – ₱400k+", good: false },
  },
  {
    label: "Design freedom",
    ours: { value: "Unlimited", good: true },
    wix: { value: "Template-based", good: false },
    squarespace: { value: "Template-based", good: false },
    shopify: { value: "Template-based", good: false },
    agency: { value: "Unlimited", good: true },
  },
  {
    label: "You own the code",
    ours: { value: "Yes", good: true },
    wix: { value: "No", good: false },
    squarespace: { value: "No", good: false },
    shopify: { value: "No", good: false },
    agency: { value: "Usually yes", good: true },
  },
  {
    label: "Vendor lock-in risk",
    ours: { value: "None", good: true },
    wix: { value: "High", good: false },
    squarespace: { value: "High", good: false },
    shopify: { value: "High", good: false },
    agency: { value: "Low", good: true },
  },
  {
    label: "Speed & performance",
    ours: { value: "Excellent", good: true },
    wix: { value: "Average", good: null },
    squarespace: { value: "Average", good: null },
    shopify: { value: "Good", good: true },
    agency: { value: "Excellent", good: true },
  },
  {
    label: "Update flexibility",
    ours: { value: "Anytime", good: true },
    wix: { value: "Within template", good: null },
    squarespace: { value: "Within template", good: null },
    shopify: { value: "Within template", good: null },
    agency: { value: "Pay per change", good: false },
  },
];

const cols = [
  { key: "ours", title: "This Build", subtitle: "Custom Next.js + Vercel", highlight: true },
  { key: "wix", title: "Wix", subtitle: "Drag-and-drop builder", highlight: false },
  { key: "squarespace", title: "Squarespace", subtitle: "Template-based builder", highlight: false },
  { key: "shopify", title: "Shopify", subtitle: "E-commerce platform", highlight: false },
  { key: "agency", title: "Hire an Agency", subtitle: "Outsourced development", highlight: false },
] as const;

function Cell({ value, good }: { value: string; good: boolean | null }) {
  return (
    <div className="flex items-center gap-2">
      {good === true && <Check size={14} className="shrink-0 text-emerald-600" />}
      {good === false && <X size={14} className="shrink-0 text-red-400" />}
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}

export default function Alternatives() {
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
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            How We Stack Up
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Compared to the Alternatives
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Honest side-by-side with the popular ways businesses get a website.
          </p>
        </motion.div>

        {/* Desktop table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block"
        >
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <span></span>
            {cols.map((c) => (
              <div key={c.key} className={c.highlight ? "rounded-lg bg-blue-600 px-3 py-1.5 text-white" : ""}>
                <p className={c.highlight ? "text-white" : "text-slate-700"}>{c.title}</p>
                <p className={`mt-0.5 text-[10px] font-normal normal-case tracking-normal ${
                  c.highlight ? "text-blue-100" : "text-slate-400"
                }`}>
                  {c.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-6 items-center gap-4 px-6 py-4 ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <span className="text-sm font-semibold text-slate-900">{row.label}</span>
              <div className="rounded-lg bg-blue-50 px-3 py-1.5">
                <Cell value={row.ours.value} good={row.ours.good} />
              </div>
              <Cell value={row.wix.value} good={row.wix.good} />
              <Cell value={row.squarespace.value} good={row.squarespace.good} />
              <Cell value={row.shopify.value} good={row.shopify.good} />
              <Cell value={row.agency.value} good={row.agency.good} />
            </div>
          ))}
        </motion.div>

        {/* Mobile: stacked cards per option */}
        <div className="space-y-5 lg:hidden">
          {cols.map((col, ci) => (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: ci * 0.08 }}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                col.highlight ? "border-blue-300 ring-2 ring-blue-200" : "border-slate-200"
              }`}
            >
              <div className={`mb-4 -mx-5 -mt-5 px-5 py-3 ${col.highlight ? "bg-blue-600 text-white" : "bg-slate-50"}`}>
                <p className={`font-bold ${col.highlight ? "text-white" : "text-slate-900"}`}>{col.title}</p>
                <p className={`text-xs ${col.highlight ? "text-blue-100" : "text-slate-500"}`}>{col.subtitle}</p>
              </div>
              <dl className="space-y-2">
                {rows.map((row) => {
                  const data = row[col.key];
                  return (
                    <div key={row.label} className="flex items-start justify-between gap-3">
                      <dt className="text-sm text-slate-500">{row.label}</dt>
                      <dd className="text-right">
                        <Cell value={data.value} good={data.good} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </motion.div>
          ))}
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 px-8 py-10 text-white"
        >
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Code2 size={26} />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
                The Honest Trade-off
              </p>
              <p className="mt-3 leading-relaxed">
                Website builders (Wix, Squarespace, Shopify) win on convenience
                — but you pay monthly forever, never truly own the site, and
                hit a wall when you want something custom. Agencies do
                excellent work but cost ₱150k+ upfront and lock you in for
                future changes. Our approach gives you the same quality as an
                agency build, owned outright, at a fraction of the cost — the
                only trade-off is needing someone in-house to maintain it.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
