import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export default function DonateHero() {
  return (
    <PageHero
      eyebrow="Support PMAFI"
      eyebrowIcon={<Heart size={13} />}
      title={
        <>
          Invest in the Next Generation of{" "}
          <span className="text-gold-shimmer">Leaders</span>
        </>
      }
      lede="Every contribution to PMAFI strengthens the faculty, facilities, and programs that shape cadets into officers of integrity and character. Your generosity directly supports the future of the Philippine Military Academy."
    >
      <Link
        href="#ways-to-give"
        className={cn(
          buttonVariants({ size: "lg" }),
          "group bg-[#C8A951] px-8 font-semibold text-[#0a1628] shadow-[0_8px_30px_-8px_rgba(200,169,81,0.6)] transition-all hover:bg-[#8A6A22] hover:text-white"
        )}
      >
        See Ways to Give
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </PageHero>
  );
}
