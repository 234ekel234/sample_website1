import Image from "next/image";
import type { BoardMember } from "@/lib/board-data";

export default function BoardMemberCard({
  member,
  featured = false,
}: {
  member: BoardMember;
  featured?: boolean;
}) {
  // Source photos are 195×195px, so avatars stay at/below that to remain crisp.
  const avatar = featured ? "h-40 w-40" : "h-32 w-32";

  return (
    <div className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A951]/40 hover:shadow-[0_20px_45px_-20px_rgba(27,42,74,0.4)]">
      {/* Avatar */}
      <div
        className={`relative ${avatar} shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-[#C8A951]/30 ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-[#C8A951]/70`}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "160px" : "128px"}
        />
      </div>

      {/* Info */}
      <span className="mt-4 inline-block rounded-full bg-[#1B2A4A]/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#1B2A4A]">
        {member.pmaClass}
      </span>
      <h3
        className={`mt-2 font-bold leading-snug text-[#1B2A4A] ${
          featured ? "text-xl" : "text-base"
        }`}
      >
        {member.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-[#C8A951]">{member.role}</p>

      {/* Full credentials */}
      {member.highlights.length > 0 && (
        <ul className="mt-4 w-full space-y-2 border-t border-slate-100 pt-4 text-left">
          {member.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8A951]" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
