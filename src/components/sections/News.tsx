import { getNews } from "@/lib/news";
import NewsCards from "@/components/sections/NewsCards";

export default async function News() {
  const news = await getNews();

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Latest Updates
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            News &amp; Announcements
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Events, programs, and milestones from the Foundation and the
            Academy community.
          </p>
        </div>
        <NewsCards items={news} />
      </div>
    </section>
  );
}
