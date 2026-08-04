import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DigitalIdGenerator from "./DigitalIdGenerator";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Digital Member ID | PMAFI",
  description:
    "Create your personalized Philippine Military Academy Foundation, Inc. digital member ID — add your details and photo, then download it as an image.",
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
        lede="Add your details and a photo to generate a personalized PMAFI digital member ID, then download it to keep on your phone."
      />

      {/* Generator */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <DigitalIdGenerator />

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
