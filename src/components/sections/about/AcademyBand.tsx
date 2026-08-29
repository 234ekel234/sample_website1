import Image from "next/image";

/**
 * A photograph of the Corps at Fort del Pilar, between the Foundation's story
 * and its mission.
 *
 * REPLACED THE PARADE-GROUND SHOT, and the trade is worth stating because the
 * old one was chosen on grounds this one does not meet. That image showed the
 * Academy rather than a room and contained no identifiable individuals, so it
 * needed no release — but it was 854x641, which this band displayed at up to
 * 2048 device pixels wide. A ~2.4x enlargement is what "blurry" looked like.
 *
 * This is PMAFI's own photograph of its Board of Trustees addressing the Corps
 * on its annual visit, 15 November 2024, at 2048x1365 — the size the band
 * actually needs. Of the eight PMAFI supplied it carries the fewest identifiable
 * faces: it is shot from behind the seated cadets, so the hall reads as a crowd
 * rather than as portraits. It is still people at an event, so it rests on
 * PMAFI's own consent for official event photography in a way its predecessor
 * did not.
 *
 * It also says something the parade ground could not: this is the Foundation
 * itself, at the Academy, in front of the cadets it exists to serve.
 *
 * object-CENTRE for this frame. The 3:2 original loses ~15% to the 16/9 crop,
 * and where that comes off depends on the photograph: this one has empty hall
 * and high windows along the top with the Corps seated low, so anchoring to the
 * top would keep the ceiling and cut the cadets. Splitting the loss keeps them.
 *
 * The home page hero uses a different frame from the same visit — deliberately,
 * so a visitor going home → About does not meet the same photograph twice.
 */
export default function AcademyBand() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <figure className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Image
              src="/pma-corps-annual-visit.jpg"
              alt="Cadets of the Philippine Military Academy seated in the assembly hall as the PMAFI Board of Trustees addresses them during its annual visit."
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          <figcaption className="mt-3 text-sm text-slate-500">
            The Foundation&apos;s Board of Trustees before the Corps of Cadets at
            Fort del Pilar, November 2024. Everything the Foundation does is in
            service of the officers formed here.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
