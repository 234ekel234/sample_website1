import type { Metadata } from "next";
import DonateHero from "@/components/sections/donate/DonateHero";
import WaysToGive from "@/components/sections/donate/WaysToGive";
import GivingPromise from "@/components/sections/donate/GivingPromise";
import HowToDonate from "@/components/sections/donate/HowToDonate";
import OrderCTA from "@/components/sections/OrderCTA";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Receipt, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Donate | PMAFI",
  description:
    "Support the Philippine Military Academy Foundation, Inc. Give a general donation, establish a professorial chair or endowment fund, or become a member — and help sustain academic excellence at the PMA.",
};

export default function DonatePage() {
  return (
    <main>
      <DonateHero />
      <WaysToGive />
      <GivingPromise />
      <HowToDonate />

      {/* Existing donors: look up a donation already made. */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="flex items-center justify-center gap-2 font-bold text-[#1B2A4A] sm:justify-start">
                <Receipt className="h-5 w-5 text-[#C8A951]" />
                Already given?
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Look up a donation and see what it was designated for, using
                your email and the reference from your acknowledgment.
              </p>
            </div>
            <Link
              href="/donate/status"
              className={cn(
                buttonVariants(),
                "shrink-0 bg-[#1B2A4A] font-semibold text-white hover:bg-[#0a1628]"
              )}
            >
              View my donations
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <OrderCTA />
    </main>
  );
}
