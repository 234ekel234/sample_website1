"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Cloud, ShoppingBag, Check, X, Trophy, Calendar, ShieldCheck, BellRing, Award, Wallet } from "lucide-react";

type Option = {
  icon: typeof Cloud;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
};

const options: Option[] = [
  {
    icon: Cloud,
    name: "Cloudflare Registrar",
    tagline: "At-cost pricing, enterprise-grade infrastructure",
    price: "$10.46 / year",
    priceNote: "At-cost (≈ ₱615/yr) — renews at the same price, never increases",
    pros: [
      "At-cost pricing forever (no renewal price hikes)",
      "Free WHOIS privacy and SSL included",
      "Free global CDN — site loads faster worldwide",
      "Best-in-class security (DNSSEC, 2FA, DDoS protection)",
      "No upsells or marketing pressure during checkout",
      "Used by enterprise companies and serious brands",
    ],
    cons: [
      "Setup is slightly more technical (~15 minutes)",
      "Doesn't sell .ph domains",
      "Requires a Cloudflare account first",
    ],
    recommended: true,
  },
  {
    icon: ShoppingBag,
    name: "Namecheap",
    tagline: "Beginner-friendly with broader domain selection",
    price: "~$10 – 15 / year",
    priceNote: "First year often promotional, renewals can increase",
    pros: [
      "Well-known and trusted brand",
      "Beginner-friendly dashboard",
      "Reliable customer support",
      "Wide variety of domain extensions",
      "Optional add-ons (email, hosting) if needed later",
    ],
    cons: [
      "Renewal price often higher than first year",
      "Persistent upsells during checkout",
      "Average DNS performance — slower than Cloudflare",
    ],
  },
];

export default function DomainOptions() {
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
            Picking a Domain Registrar
          </p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            Two Solid Options
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Both will get the job done. The right choice depends on how much we
            value long-term cost stability vs. setup simplicity.
          </p>
        </motion.div>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {options.map(({ icon: Icon, name, tagline, price, priceNote, pros, cons, recommended }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ${
                recommended ? "border-[#C8A951]/40 ring-2 ring-[#C8A951]/30" : "border-slate-200"
              }`}
            >
              {recommended && (
                <div className="absolute right-0 top-0 flex items-center gap-1.5 rounded-bl-xl bg-[#1B2A4A] px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
                  <Trophy size={12} /> Recommended
                </div>
              )}

              <div className={`px-8 py-8 ${recommended ? "bg-gradient-to-br from-[#C8A951]/[0.08] to-white" : "bg-slate-50"}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    recommended ? "bg-[#1B2A4A] text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{tagline}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className={`text-3xl font-extrabold ${recommended ? "text-[#1B2A4A]" : "text-slate-900"}`}>
                    {price}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{priceNote}</p>
                </div>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-6 border-t border-slate-100 px-8 py-7">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                    Pros
                  </p>
                  <ul className="space-y-2">
                    {pros.map((p) => (
                      <li key={p} className="flex items-start gap-2.5">
                        <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                        <span className="text-sm text-slate-700">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Considerations
                  </p>
                  <ul className="space-y-2">
                    {cons.map((c) => (
                      <li key={c} className="flex items-start gap-2.5">
                        <X size={16} className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-700">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Multi-year strategy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">
                Multi-Year Registration (Namecheap Only)
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">
                Namecheap lets you register a domain for up to 10 years in a
                single upfront payment — no annual renewals to worry about.
                Cloudflare is annual-only, but its at-cost pricing means the
                renewal fee never increases year over year.
              </p>

              {/* Benefits */}
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { icon: Wallet, text: "Locks in today's Namecheap price — no renewal surprises" },
                  { icon: BellRing, text: "No risk of forgetting to renew (= site going down)" },
                  { icon: Award, text: "Longer registration looks more legitimate to visitors and search engines" },
                  { icon: ShieldCheck, text: "Predictable budgeting — pay once, set and forget" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon size={18} className="mt-0.5 shrink-0 text-amber-600" />
                    <span className="text-sm text-slate-700">{text}</span>
                  </li>
                ))}
              </ul>

              {/* Pricing comparison */}
              <div className="mt-7 overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-3 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  <span>Term</span>
                  <span>Cloudflare (annual × term, est.)</span>
                  <span>Namecheap (single payment)</span>
                </div>
                {[
                  { term: "1 year", cf: "$10.46", nc: "$10 – 15" },
                  { term: "3 years", cf: "$31.38 *", nc: "$41 – 46" },
                  { term: "5 years", cf: "$52.30 *", nc: "$71 – 76", suggested: true },
                  { term: "10 years", cf: "$104.60 *", nc: "$148 – 153" },
                ].map(({ term, cf, nc, suggested }, idx, arr) => (
                  <div
                    key={term}
                    className={`grid grid-cols-3 px-5 py-3 text-sm ${
                      idx !== arr.length - 1 ? "border-b border-slate-100" : ""
                    } ${suggested ? "bg-[#C8A951]/[0.08]" : "bg-white"}`}
                  >
                    <span className={`font-semibold ${suggested ? "text-[#1B2A4A]" : "text-slate-900"}`}>
                      {term}
                      {suggested && (
                        <span className="ml-2 rounded bg-[#1B2A4A] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                          Sweet spot
                        </span>
                      )}
                    </span>
                    <span className={suggested ? "font-bold text-[#1B2A4A]" : "text-slate-700"}>{cf}</span>
                    <span className="text-slate-700">{nc}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">* Cloudflare is annual-only</span> — those
                figures are an estimated running total, not a single payment option. If paying upfront for
                multiple years is preferred, Namecheap is the registrar to use.{" "}
                <span className="font-semibold text-slate-700">Suggested Namecheap term: 5 years</span>{" "}
                (~$71–76 paid once — long enough to project stability, short enough to stay flexible).
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 rounded-2xl bg-gradient-to-br from-[#16294d] to-[#0a1628] px-8 py-10 text-white"
        >
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Trophy size={26} className="text-white" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
                Our Recommendation
              </p>
              <h3 className="mt-2 text-2xl font-bold">Go with Cloudflare</h3>
              <p className="mt-3 text-slate-300">
                For an organization that wants to look professional, Cloudflare
                is the right choice. It&apos;s the same infrastructure used by enterprise
                brands — at-cost pricing means our domain bill never goes up,
                and the free CDN makes the site faster for everyone visiting
                from anywhere in the world. The ~15-minute extra setup is a
                one-time cost for permanent savings and a more professional
                technical foundation.
              </p>
              <p className="mt-4 text-sm text-[#C8A951]">
                If we ever need a <span className="font-semibold text-white">.ph</span>{" "}
                domain specifically, we&apos;d register that separately through
                dot.ph (~₱2,500/yr).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
