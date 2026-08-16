import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import IdGate from "./IdGate";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Digital Member ID | PMAFI",
  description:
    "Confirm your PMAFI membership, add a photo, and download your digital member ID — generated from the Philippine Military Academy Foundation's own records.",
};

export default function DigitalIdPage() {
  return (
    <main>
      {/* Hero */}
      <PageHero
        eyebrow="Digital Member ID"
        title={
          <>
            Create Your <span className="text-gold-shimmer">Member ID</span>
          </>
        }
        lede="Confirm your membership, add a photo, and your PMAFI digital member ID is generated from the Foundation's own records — ready to download and keep on your phone."
      />

      {/* Generator */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <IdGate />

          <div className="mt-10 text-center">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#1B2A4A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Membership
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
