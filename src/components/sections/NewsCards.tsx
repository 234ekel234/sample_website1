"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import type { NewsItem } from "@/lib/news";

export default function NewsCards({ items }: { items: NewsItem[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3" ref={ref}>
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
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-400">
                  <Calendar size={13} />
                  {date || "Upcoming"}
                </div>
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
