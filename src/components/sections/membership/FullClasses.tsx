// PMA classes in which every member has joined the Foundation.
//
// Placed between the categories and the join steps on purpose: an alumnus
// reading about how to apply has just seen whether his own class is already
// complete. A year that is present is a point of pride; a year that is missing
// is the reason to apply, and neither needs a sentence of persuasion written
// around it.
//
// SOURCE: PMAFI Annual Report 2025, p.10, "PMA CLASSES WITH 100% MEMBERSHIP IN
// PMAFI". The page heading there reads "As of31 December 226" — a typo. The
// report covers 1 January to 31 December 2025 and every other list in it is
// dated 31 December 2025, so that is the date shown here. Worth confirming
// with PMAFI rather than assuming forever.
//
// COUNTED, NOT TYPED. The heading below derives its number from this array's
// length, so the two can never disagree — the failure the chairs roll had to
// work around, where the report's stated total and its own list differ.
const FULL_CLASSES = [
  1955, 1957, 1959, 1967, 1970, 1976, 1997, 2002, 2003, 2004, 2005, 2006, 2007,
  2008, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2018, 2019, 2021, 2022, 2023,
  2024, 2025,
];

export default function FullClasses() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          {/* gold-ink on a light background — the vivid token fails AA here. */}
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Class Honor Roll
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            {FULL_CLASSES.length} Classes, Every Member In
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            These PMA classes have one hundred percent of their members enrolled
            in the Foundation, as of 31 December 2025. If yours is not here yet,
            it is one application closer than it was.
          </p>
        </div>

        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-7">
          {FULL_CLASSES.map((year) => (
            <li
              key={year}
              className="rounded-xl border border-slate-200/80 bg-slate-50 py-3 text-center text-sm font-semibold text-[#1B2A4A]"
            >
              {year}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
