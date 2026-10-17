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
 *
 * NOTE this now sizes the items BELOW the featured one, so the count it is
 * given is one less than the number of published rows.
 */
export function gridFor(count: number): string {
  if (count <= 1) return "mx-auto max-w-md grid-cols-1";
  if (count === 2) return "mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 md:grid-cols-3";
}

/**
 * One row runs full width above the cards: the row whose `Featured` column
 * says Yes, or the top row when none does.
 *
 * WHY A COLUMN RATHER THAN A SORT. Picking the newest date would take the
 * choice away from staff, and would pick by a rule that does not match what
 * "lead with this" means: an announcement carries the date of something that
 * has not happened yet, so it is simultaneously the furthest-future row and
 * the one that stops being worth leading with the moment that date passes.
 * Neither end of a date sort gets that right.
 *
 * WHY NOT JUST THE TOP ROW. That was the first cut, and it conflates two
 * decisions into one knob — a new row is appended at the bottom of a
 * spreadsheet, which is where the 5 March 2027 meeting notice went and why a
 * 2024 board visit led the page. Staff can now order the cards however they
 * like and still choose what leads.
 *
 * The top-row fallback is what keeps a tab with no `Featured` column at all
 * rendering exactly as before, including the sample items. Two rows marked
 * Yes is staff error rather than a state to design for, so the first one
 * wins and the other stays a card — never two features, never none.
 *
 * A lone item is featured rather than left as a single small card, and an
 * empty feed yields no featured item at all — unreachable, because getNews
 * falls back to samples rather than returning none, but the caller must not
 * depend on that to avoid reading items[0] of nothing.
 */
export function splitFeatured(
  items: NewsItem[]
): { featured: NewsItem | null; rest: NewsItem[] } {
  if (items.length === 0) return { featured: null, rest: [] };
  const index = Math.max(
    items.findIndex((i) => i.featured),
    0
  );
  return {
    featured: items[index],
    // Sheet order is preserved among the cards — removing the featured row
    // must not reshuffle the ones around it.
    rest: items.filter((_, i) => i !== index),
  };
}

/**
 * Shared by both card shapes: a link becomes an <a>, otherwise a plain <div>.
 *
 * ONLY AN OFF-SITE LINK OPENS A NEW TAB. `target="_blank"` is right for the
 * Drive and news-site URLs staff paste, and wrong for a path like
 * /membership/annual-meeting — throwing a second tab at someone for moving
 * within the same site is the kind of thing that makes a back button useless.
 * safeHttpUrl in news.ts has already refused anything that is not http(s) or
 * a site-relative path, so "starts with /" is a sound test for internal.
 */
function wrapperFor(link: string) {
  const internal = link.startsWith("/");
  return {
    Wrapper: (link ? "a" : "div") as "a" | "div",
    wrapperProps: link
      ? internal
        ? { href: link }
        : { href: link, target: "_blank", rel: "noopener noreferrer" }
      : {},
  };
}

function FeaturedCard({ item, inView }: { item: NewsItem; inView: boolean }) {
  const { date, category, title, excerpt, link, image } = item;
  const { Wrapper, wrapperProps } = wrapperFor(link);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C8A951]/40 hover:shadow-[0_24px_50px_-20px_rgba(27,42,74,0.4)]"
    >
      <Wrapper {...wrapperProps} className="contents">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#16294d] to-[#0a1628] lg:h-full lg:min-h-[340px]">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              <Calendar size={56} className="text-white/15" />
            )}
            {category && (
              <span className="absolute left-5 top-5 rounded-full bg-[#C8A951] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#1B2A4A]">
                {category}
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
            {/* A blank date shows nothing, not "Upcoming" — see the note on
                the small card below. */}
            {date && (
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-500">
                <Calendar size={13} />
                {date}
              </div>
            )}
            <h3 className="mt-2 text-2xl font-bold leading-snug text-[#1B2A4A] lg:text-3xl">
              {title}
            </h3>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-500">
              {excerpt}
            </p>
            {link && (
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink">
                Read more
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            )}
          </div>
        </div>
      </Wrapper>
    </motion.article>
  );
}

export default function NewsCards({ items }: { items: NewsItem[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { featured, rest } = splitFeatured(items);

  return (
    <div ref={ref}>
      {/* Rendered unconditionally and faded in, never mounted on scroll — the
          lead announcement has to be in the HTML for a crawler and a screen
          reader that never fires an intersection observer. */}
      {featured && <FeaturedCard item={featured} inView={inView} />}

      {rest.length > 0 && (
        <div className={`grid gap-6 ${gridFor(rest.length)}`}>
          {rest.map(({ date, category, title, excerpt, link, image }, i) => {
            const { Wrapper, wrapperProps } = wrapperFor(link);

            return (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
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
                    <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-slate-500">
                      {excerpt}
                    </p>
                    {link && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-ink">
                        Read more
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    )}
                  </div>
                </Wrapper>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
