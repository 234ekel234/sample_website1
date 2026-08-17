import Image from "next/image";

/**
 * A photograph of the Corps at Fort del Pilar, between the Foundation's story
 * and its mission.
 *
 * Chosen from the set PMAFI supplied because it is the only one that shows the
 * Academy rather than a room: no identifiable individuals, nothing that needed
 * a release, and the grandstand carries COURAGE · INTEGRITY · LOYALTY in the
 * frame — the three words the values section goes on to state in words.
 *
 * Held to max-w-5xl deliberately. The original is 854px wide, so a full-bleed
 * band would upscale it past the point where it still looks like a photograph.
 * If PMAFI can supply the original at 2000px or more this can widen.
 */
export default function AcademyBand() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <figure className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Image
              src="/pma-graduation.jpg"
              alt="The Corps of Cadets in formation on the parade ground at Fort del Pilar, beneath the words Courage, Integrity and Loyalty."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          <figcaption className="mt-3 text-sm text-slate-500">
            The Corps on the parade ground at Fort del Pilar. Everything the
            Foundation does is in service of the officers formed here.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
