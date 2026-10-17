import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Clock, Mail, Video, ExternalLink } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { ANNUAL_MEETING, NOTICE_EMAIL, NOTICE_SCAN } from "@/lib/annual-meeting";

/**
 * The full notice, as text.
 *
 * It is a page rather than a section of /membership because it is a document:
 * it wants its own URL so PMAFI can send members straight to it, its own
 * title, and it is long enough that bolting it onto an already-long page
 * would bury both. The home page's featured news item links here.
 *
 * Text rather than the scan PMAFI supplied, because the scan is 642x845 of
 * dense body type — unreadable on a phone, invisible to a screen reader, and
 * un-searchable. See src/lib/annual-meeting.ts for what it omits and why.
 */

const m = ANNUAL_MEETING;

export const metadata: Metadata = {
  title: "Annual Membership Meeting and Election of Trustees | PMAFI",
  description: `Notice of the PMAFI Annual Membership Meeting and Election of Trustees — ${m.date}, ${m.time}, ${m.venue}.`,
};

/** The three facts a member checks first, before reading anything. */
const facts = [
  { icon: CalendarDays, label: "Date", value: m.date },
  { icon: Clock, label: "Time", value: m.time },
  { icon: MapPin, label: "Venue", value: m.venue },
];

export default function AnnualMeetingPage() {
  return (
    <main>
      <PageHero
        eyebrow="Notice to Members"
        title={
          <>
            Annual Membership Meeting and{" "}
            <span className="text-gold-shimmer">Election of Trustees</span>
          </>
        }
        lede={`${m.date} · ${m.time} · ${m.venue}`}
      />

      {/* At a glance */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-ink">
                  <Icon size={14} />
                  {label}
                </p>
                <p className="mt-2 font-medium leading-snug text-[#1B2A4A]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-8 space-y-3 border-l-2 border-[#C8A951]/40 pl-5 text-sm">
            <div>
              <dt className="font-semibold text-[#1B2A4A]">To</dt>
              <dd className="text-slate-600">{m.addressedTo}</dd>
            </div>
            <div>
              <dt className="font-semibold text-[#1B2A4A]">References</dt>
              <dd className="text-slate-600">{m.references}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Key dates */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">
            Key dates
          </h2>
          <p className="mt-3 text-slate-500">
            Every deadline in this notice, in the order it falls. The full
            wording is below.
          </p>

          {/* A long table on a narrow screen scrolls inside itself rather than
              pushing the page sideways. */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="py-3 pr-6 font-semibold uppercase tracking-widest text-xs text-slate-500">
                    When
                  </th>
                  <th className="py-3 font-semibold uppercase tracking-widest text-xs text-slate-500">
                    What
                  </th>
                </tr>
              </thead>
              <tbody>
                {m.schedule.map(({ when, what }) => (
                  <tr key={when} className="border-b border-slate-200">
                    <td className="whitespace-nowrap py-4 pr-6 align-top font-semibold text-[#1B2A4A]">
                      {when}
                    </td>
                    <td className="py-4 align-top leading-relaxed text-slate-600">
                      {what}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The notice itself */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">
            The notice
          </h2>

          <p className="mt-6 leading-relaxed text-slate-600">{m.convening}</p>

          <ol className="mt-6 space-y-3">
            {m.purposes.map((purpose, i) => (
              <li key={purpose} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-xs font-bold text-[#C8A951]">
                  {i + 1}
                </span>
                <span className="pt-0.5 leading-relaxed text-slate-600">
                  {purpose}
                </span>
              </li>
            ))}
          </ol>

          {m.sections.map(({ heading, paragraphs }) => (
            <div key={heading} className="mt-12">
              <h3 className="text-xl font-bold text-[#1B2A4A]">{heading}</h3>
              {paragraphs.map((p) => (
                <p key={p} className="mt-4 leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          ))}

          <p className="mt-12 leading-relaxed text-slate-600">{m.closing}</p>

          <div className="mt-10 border-t border-slate-200 pt-6">
            <p className="font-bold uppercase tracking-wide text-[#1B2A4A]">
              {m.issuedBy.name}
            </p>
            <p className="text-sm text-slate-500">{m.issuedBy.role}</p>
          </div>
        </div>
      </section>

      {/* The notice as issued.
          PMAFI's decision, taken 2026-10-17: the signed original is published
          as supplied. It is shown here at full width rather than in the news
          card, where a 642x845 page of body type crops to an illegible strip.
          The transcription above remains the readable version — this is the
          document of record, letterhead and signature included. */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">
            The notice as issued
          </h2>
          <p className="mt-3 text-slate-500">
            The signed original, as circulated to members. The text above is a
            transcription of the same document.
          </p>

          <figure className="mt-8">
            <Image
              src={NOTICE_SCAN.src}
              alt={NOTICE_SCAN.alt}
              width={NOTICE_SCAN.width}
              height={NOTICE_SCAN.height}
              sizes="(min-width: 768px) 42rem, 100vw"
              className="h-auto w-full rounded-2xl border border-slate-300 bg-white shadow-sm"
            />
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <span>
                Issued by {m.issuedBy.name}, {m.issuedBy.role}.
              </span>
              <a
                href={NOTICE_SCAN.src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-gold-ink underline underline-offset-2 transition-colors hover:text-[#1B2A4A]"
              >
                Open the full-size notice
                <ExternalLink size={14} />
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Joining and enquiries.
          This panel must keep agreeing with what the page actually shows. It
          used to say the Zoom details were not published here, which stopped
          being true the moment the signed original went up above — a page
          that withholds something in one section and prints it in the next
          is worse than one that does neither. See annual-meeting.ts for the
          screen-reader gap this leaves open. */}
      <section className="relative overflow-hidden bg-[#0a1628] py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#16294d_0%,#0a1628_55%)]" />
        <div className="relative mx-auto max-w-3xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 font-semibold text-white">
                <Video className="h-5 w-5 text-[#C8A951]" />
                Joining by Zoom
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                The meeting is held in a blended manner. The Zoom link,
                meeting ID and passcode are printed in the notice as issued,
                above. If you cannot read them there, email the Foundation
                and they will be sent to you.
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 font-semibold text-white">
                <Mail className="h-5 w-5 text-[#C8A951]" />
                Enquiries
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                For any question about the meeting, nominations or your
                ballot, email{" "}
                <a
                  href={`mailto:${NOTICE_EMAIL}`}
                  className="font-medium text-[#C8A951] underline underline-offset-2 transition-colors hover:text-white"
                >
                  {NOTICE_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-[#C8A951]/30 bg-white/[0.03] p-6 text-center">
            <p className="text-sm text-slate-300/90">
              Only regular members in good standing may vote.
            </p>
            <Link
              href="/membership#check"
              className="mt-2 inline-block font-semibold text-[#C8A951] underline underline-offset-4 transition-colors hover:text-white"
            >
              Check your membership status
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
