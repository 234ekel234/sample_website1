"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import type { NewsItem } from "@/lib/news";

/**
 * The grid fits the number of items, rather than always being three columns.
 *
 * A fixed md:grid-cols-3 renders one published item as a card in the left
 * third with two thirds of empty page beside it — which reads as something
 * having failed to load. That was survivable when this section sat near the
 * footer; it is the third thing on the home page now.
 *
 * The row is also capped and centred, because three cards' worth of width
 * shared between one or two makes for uncomfortably wide cards: a lone card
 * stretched across 1280px is not a fix for a lone card in a third of it.
 *
 * Four or more items wrap onto a second row of three, which is why the cap
 * only applies below three.
 */
export function gridFor(count: number): string {
  if (count <= 1) return "mx-auto max-w-md grid-cols-1";
  if (count === 2) return "mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3";
}

export default function NewsCards({ items }: { items: NewsItem[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className={`grid gap-6 ${gridFor(items.length)}`} ref={ref}>
      {items.map(({ date, category, title, excerpt, link, image }, i) => {
        const Wrapper = link ? "a" : "div";
        const wrapperProps = link
          ? { href: link, target: "_blank", rel: "noopener noreferrer" }
          : {};

        return (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]"
          >
            <Wrapper {...wrapperProps} className="contents">
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#16294d] to-[#0a1628]">
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                ) : (
                  <Calendar size={36} className="text-white/15" />
                )}
                {category && (
                  <span className="absolute left-4 top-4 rounded-full bg-[#C8A951] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#1B2A4A]">
                    {category}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                {/* A BLANK DATE SHOWS NOTHING, not "Upcoming".
                    Defaulting an empty cell to "Upcoming" made the site assert
                    something the sheet had not said: the teaching-excellence
                    awarding has already happened, its date is simply unknown,
                    and the card announced it as a future event. Staff who mean
                    "upcoming" can type it — the fallback items do exactly that
                    — but an empty cell means unknown, and unknown is best said
                    by saying nothing. */}
                {date && (
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-500">
                    <Calendar size={13} />
                    {date}
                  </div>
                )}
                <h3 className="mt-2 text-lg font-bold leading-snug text-[#1B2A4A]">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                  {excerpt}
                </p>
                {link && (
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C8A951]">
                    Read more
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </div>
            </Wrapper>
          </motion.article>
        );
      })}
    </div>
  );
}
