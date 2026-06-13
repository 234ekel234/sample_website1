import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart } from "lucide-react";

export default function SupportCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0a1628] py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_0%,#16294d_0%,#0a1628_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #C8A951 0px, #C8A951 1px, transparent 1px, transparent 72px)",
          maskImage:
            "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 75%)",
        }}
      />
      <div className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A951]/[0.08] blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C8A951]/20 bg-[#C8A951]/15 text-[#C8A951] shadow-[0_0_40px_-10px_rgba(200,169,81,0.6)]">
          <Heart size={32} />
        </div>
        <h2 className="text-4xl font-bold text-white">
          Join the Mission.
        </h2>
        <p className="mt-1 text-4xl font-bold text-[#C8A951]">
          Support the Future of Leadership.
        </p>
        <p className="mx-auto mt-6 max-w-lg text-lg text-slate-300">
          Your support helps PMAFI provide the resources, programs, and
          opportunities that shape the next generation of Philippine military officers.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/donate"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group bg-[#C8A951] px-8 font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#A07830] hover:text-white hover:shadow-[0_12px_40px_-8px_rgba(200,169,81,0.5)]"
            )}
          >
            Support PMAFI
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/15 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 hover:text-white"
            )}
          >
            Learn About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
