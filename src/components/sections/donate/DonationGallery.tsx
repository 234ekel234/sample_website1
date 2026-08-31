import Image from "next/image";
import { getDonationPhotos } from "@/lib/donation-photos";
import { formatSheetDate } from "@/lib/sheet-date";

/**
 * Photographs of gifts arriving.
 *
 * RENDERS NOTHING WHEN THERE ARE NO PHOTOGRAPHS. Not an empty state, not a
 * placeholder frame — the page has plenty else to say, and an empty gallery
 * headed "Moments of Generosity" would be the site advertising a gap.
 *
 * A server component: this is a static grid over sheet data, so there is no
 * reason to ship it to the browser twice.
 */
export default async function DonationGallery() {
  const photos = await getDonationPhotos();
  if (photos.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          {/* gold-ink on a light background — the vivid token fails AA here. */}
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            In Pictures
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1B2A4A]">
            Gifts Arriving
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Donors, alumni classes and partner institutions handing over their
            support to the Foundation.
          </p>
        </div>

        {/* One column on a phone, because these are photographs of people and a
            half-width photograph of a handover shows nobody's face. */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map(({ image, caption, date }) => (
            <li
              key={image}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100">
                <Image
                  src={image}
                  // The caption IS the alt text — see donation-photos.ts, where
                  // a published row without one is refused for this reason.
                  alt={caption}
                  fill
                  // object-top for the same reason the fund updates use it:
                  // when a photograph has people in it they are near the top.
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                />
              </div>
              <div className="p-4">
                <p className="text-sm leading-relaxed text-slate-600">
                  {caption}
                </p>
                {date && (
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {formatSheetDate(date)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
