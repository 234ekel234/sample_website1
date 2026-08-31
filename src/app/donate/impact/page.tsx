import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Landmark, Sparkles } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import YearInReview from "@/components/sections/donate/YearInReview";
import { getFundUpdates, groupByFund } from "@/lib/fund-updates";
import { formatSheetDate } from "@/lib/sheet-date";

export const metadata: Metadata = {
  title: "Fund Updates | PMAFI",
  description:
    "See what each PMAFI fund has accomplished — the professorial chairs, endowments, facilities and cadet programs your support makes possible.",
};

export default async function FundUpdatesPage() {
  const updates = await getFundUpdates();
  const funds = groupByFund(updates);

  return (
    <main>
      <PageHero
        eyebrow="Fund Updates"
        eyebrowIcon={<Sparkles size={13} />}
        title={
          <>
            What Your Support{" "}
            <span className="text-gold-shimmer">Made Possible</span>
          </>
        }
        lede="Every fund the Foundation holds exists to do something specific at the Academy. This is the record of what each one has accomplished."
      />

      {/* Above the per-fund timeline, and independent of it. The timeline is
          only as full as what staff have published to the sheet; these counts
          are the Foundation's own published record and stand whether or not a
          single fund update exists — including in the empty state below, which
          would otherwise leave this page saying nothing at all. */}
      <YearInReview />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          {funds.length === 0 ? (
            /* Honest empty state — never invent an account of what a donation did. */
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A]">
                <Landmark size={22} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1B2A4A]">
                Updates are on their way
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-500">
                As the Foundation puts each fund to work — professorial chairs,
                endowments, facilities and cadet programs — what it achieves
                will be published here for everyone to see.
              </p>
              <Link
                href="/donate"
                className={cn(
                  buttonVariants(),
                  "group mt-7 bg-[#C8A951] font-semibold text-[#0a1628] hover:bg-[#A07830] hover:text-white"
                )}
              >
                See ways to give
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {funds.map(([fund, items]) => (
                <div key={fund}>
                  <div className="mb-8 flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B2A4A]/10 text-[#1B2A4A]">
                      <Landmark size={20} />
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-[#1B2A4A]">
                        {fund}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {items.length === 1
                          ? "1 update"
                          : `${items.length} updates`}
                      </p>
                    </div>
                  </div>

                  <ol className="space-y-6 border-l border-slate-200 pl-6">
                    {items.map((u) => (
                      <li key={`${u.fund}-${u.title}-${u.date}`} className="relative">
                        <span className="absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[#C8A951] ring-4 ring-white" />
                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(27,42,74,0.4)]">
                          {/* An ASPECT RATIO, not a fixed height. h-56 was 224px
                              whatever the card's width, so on a desktop card it
                              became a ~4:1 letterbox and object-cover took a
                              band through the middle of the photograph — which,
                              for a picture of people standing up, is their
                              torsos with the heads cropped off.

                              object-top for the same reason: when a photograph
                              has people in it they are near the top, and
                              anchoring there is the safer default for whatever
                              staff put in the sheet next. */}
                          {u.image && (
                            <div className="relative aspect-[16/7] w-full bg-slate-100">
                              <Image
                                src={u.image}
                                alt={u.title}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 100vw, 700px"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            {u.date && (
                              <p className="text-xs font-semibold uppercase tracking-widest text-gold-ink">
                                {formatSheetDate(u.date)}
                              </p>
                            )}
                            <h3 className="mt-1.5 text-lg font-bold text-[#1B2A4A]">
                              {u.title}
                            </h3>
                            {u.message && (
                              <p className="mt-2 leading-relaxed text-slate-600">
                                {u.message}
                              </p>
                            )}
                          </div>
                        </article>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-[#C8A951]/30 bg-[#0a1628] p-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-bold text-white">Donated to one of these funds?</p>
              <p className="mt-1 text-sm text-slate-300">
                Look up your own donations to see what they were designated for and
                where it stands.
              </p>
            </div>
            <Link
              href="/donate/status"
              className={cn(
                buttonVariants(),
                "shrink-0 bg-[#C8A951] font-semibold text-[#0a1628] hover:bg-[#A07830] hover:text-white"
              )}
            >
              View my donations
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
