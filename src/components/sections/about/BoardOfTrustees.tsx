// Board of Trustees, shown as a section of the About page.
//
// This used to be a standalone /board route. It was folded in here so the
// Foundation's story, mission and the people accountable for it read as one
// page. The `id="board"` anchor is load-bearing: the nav, footer, programs page
// and the FAQ assistant all link to /about#board, and /board itself 308s here
// (see next.config.ts) so older links and search results keep working.

import { officers, committeeMembers, trustees } from "@/lib/board-data";
import BoardMemberCard from "@/components/board/BoardMemberCard";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <div className="h-px flex-1 bg-slate-200" />
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {children}
      </h3>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export default function BoardOfTrustees() {
  return (
    <section id="board" className="scroll-mt-24 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold-ink">
            <span className="h-px w-8 bg-[#C8A951]/50" />
            Board of Trustees
            <span className="h-px w-8 bg-[#C8A951]/50" />
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[#1B2A4A]">
            Who Leads the Foundation
          </h2>
          <p className="mt-2 text-lg font-light text-gold-ink">2025 – 2026</p>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Distinguished graduates of the Philippine Military Academy, united
            in their commitment to strengthen PMAFI and serve the nation through
            principled leadership.
          </p>
        </div>

        {/* Officers */}
        <SectionLabel>Executive Officers</SectionLabel>
        <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {officers.map((member) => (
            <BoardMemberCard key={member.id} member={member} featured />
          ))}
        </div>

        {/* Committee Chairmen */}
        <SectionLabel>Committee Officers</SectionLabel>
        <div className="mb-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {committeeMembers.map((member) => (
            <BoardMemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* Trustees */}
        <SectionLabel>Trustees</SectionLabel>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustees.map((member) => (
            <BoardMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
