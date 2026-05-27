import { ShieldCheck, Sparkles, Clock, Heart } from "lucide-react";

const stats = [
  { icon: ShieldCheck, label: "Locally Owned", note: "Run by people you can actually talk to" },
  { icon: Sparkles, label: "Quality First", note: "Every order checked before it leaves us" },
  { icon: Clock, label: "Fast Turnaround", note: "Quick replies, faster delivery" },
  { icon: Heart, label: "Customer Focused", note: "Honest pricing, no surprises" },
];

export default function Stats() {
  return (
    <section className="border-b border-slate-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, note }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Icon size={22} />
              </div>
              <p className="text-sm font-bold text-slate-900">{label}</p>
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
