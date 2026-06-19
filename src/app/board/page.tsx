import { officers, committeeMembers, trustees } from "@/lib/board-data";
import BoardMemberCard from "@/components/board/BoardMemberCard";

export const metadata = {
  title: "Board of Trustees 2025–2026 | PMAFI",
  description:
    "Meet the PMAFI Board of Trustees for 2025–2026 — distinguished Philippine Military Academy graduates serving the Foundation.",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <div className="h-px flex-1 bg-slate-200" />
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {children}
      </h2>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export default function BoardPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1628] py-32 pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_-10%,#16294d_0%,#0a1628_45%,#070f1d_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #C8A951 0px, #C8A951 1px, transparent 1px, transparent 72px)",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)",
          }}
        />
        <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070f1d] to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C8A951]/30 bg-[#C8A951]/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C8A951] shadow-[0_0_30px_-8px_rgba(200,169,81,0.5)] backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A951] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8A951]" />
            </span>
            Philippine Military Academy Foundation, Inc.
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Board of Trustees
          </h1>
          <p className="mt-3 text-2xl font-light text-[#C8A951]">2025 – 2026</p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Distinguished graduates of the Philippine Military Academy, united in
            their commitment to strengthen PMAFI and serve the nation through
            principled leadership.
          </p>
        </div>
      </section>

      {/* Board Content */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

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
    </main>
  );
}
