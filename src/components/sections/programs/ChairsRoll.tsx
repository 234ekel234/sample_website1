import { PROFESSORIAL_CHAIRS } from "@/lib/chairs";

// The roll of endowed chairs, as an honour wall.
//
// A SERVER COMPONENT ON PURPOSE. It renders a static list and nothing here
// animates or responds to a click, so there is no reason to ship 161 names to
// the browser twice — once as HTML and again as a client-component payload.
//
// NO COUNT IN THE HEADING. The report's own heading says 160 while its list
// runs to 161 entries (see src/lib/chairs.ts). Printing a number above a roll
// that disagrees with it invites the one reader who counts, and that reader is
// usually a trustee. The figure appears where it is safe to state — the "160
// professorial chairs endowed" tile on /donate/impact, which cites the report's
// own total rather than counting this array.
export default function ChairsRoll() {
  return (
    <section className="relative overflow-hidden bg-[#0a1628] py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#16294d_0%,#0a1628_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          {/* Vivid gold here: this band is dark, which is the token's home. */}
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#C8A951]">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            The Chairs
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white">
            Endowed in Their Names
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-300">
            A professorial chair carries the name of the person, the class or the
            institution that endowed it, and its earnings fund the teaching of a
            subject at the Academy year after year. These are the chairs the
            Foundation held as of 31 December 2025.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {PROFESSORIAL_CHAIRS.map((chair) => (
            <li
              key={chair}
              className="flex items-baseline gap-2.5 text-sm leading-relaxed text-slate-300"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C8A951]"
              />
              {chair}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed text-slate-400">
          A chair may be established in your own name or in your class&rsquo;s
          honor.
          The Foundation preserves the principal and spends only what it earns,
          so the chair goes on teaching long after the gift is made.
        </p>
      </div>
    </section>
  );
}
