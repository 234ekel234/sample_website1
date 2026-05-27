import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ClipboardList } from "lucide-react";

export default function OrderCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900 py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
          <ClipboardList size={32} />
        </div>
        <h2 className="text-4xl font-bold text-white">Ready to Order?</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
          Fill out our quick order form and our team will get back to you within
          24 hours to confirm your request.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/order"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-white px-8 text-slate-900 hover:bg-slate-100"
            )}
          >
            Go to Order Form <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/20 text-white hover:bg-white/10 hover:text-white"
            )}
          >
            Talk to Us First
          </Link>
        </div>
      </div>
    </section>
  );
}
