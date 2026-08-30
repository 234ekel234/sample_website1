import type { Metadata } from "next";
import Image from "next/image";
import DonateHero from "@/components/sections/donate/DonateHero";
import WaysToGive from "@/components/sections/donate/WaysToGive";
import GivingPromise from "@/components/sections/donate/GivingPromise";
import HowToDonate from "@/components/sections/donate/HowToDonate";
import DirectGiving from "@/components/sections/donate/DirectGiving";
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

      {/* A gift actually arriving, between the Foundation's promise about how it
          handles money and the mechanics of sending some. This page asks for
          money and, until now, showed nothing at all.

          PUBLISHED WITH PMAFI'S AUTHORISATION, and the figure is blurred out of
          the file itself. The presentation cheque named a donor AND stated what
          he gave, and the amount is exactly the disclosure /donate/status is
          built to withhold — that lookup demands a reference code precisely so
          nobody learns what another person gave. The name stays, because the
          donation form asks "May we acknowledge you publicly?" and this is that
          acknowledgment, authorised; the sum is not part of the thanks. Both the
          amount line and its reflection in the glass table below it are
          redacted, since the reflection is legible enough to read the figure
          back — the pixels are gone from public/donation-handover.jpg, not
          covered by an overlay, so nothing recovers them by turning CSS off. The
          account and routing digits on the cheque are all-sevens dummies, so no
          banking data is exposed.

          The caption stays general rather than restating the name: the
          photograph is the acknowledgment, and repeating it in our own words
          would be us making the claim rather than showing theirs. */}
      <section className="bg-white pb-20 pt-4">
        <div className="mx-auto max-w-5xl px-6">
          <figure className="overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3] w-full bg-slate-100 sm:aspect-[16/9]">
              <Image
                src="/donation-handover.jpg"
                alt="Alumni of the Academy presenting a donation cheque to the Philippine Military Academy Foundation."
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <figcaption className="mt-3 text-sm text-slate-500">
              Alumni presenting a gift to the Foundation. Every donation is
              recorded by name and designation, acknowledged, and put to work in
              the fund the donor chose.
            </figcaption>
          </figure>
        </div>
      </section>

      <HowToDonate />
      <DirectGiving />

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
